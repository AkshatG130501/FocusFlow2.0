import express, { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import type { ChatSession as GeminiChatSession } from '@google/generative-ai';

type ChatSession = GeminiChatSession & {
  history: Array<{
    role: 'user' | 'model';
    parts: { text: string }[];
  }>;
};

// Load environment variables
dotenv.config();

const router = express.Router();

// Rate limiting configuration
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Initialize the Gemini API client with proper error handling
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Initialize the chat model with safety settings
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    maxOutputTokens: 1000,
    temperature: 0.7,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Chat history storage (in-memory, consider using Redis in production)
const chatSessions = new Map<string, ChatSession>();
const MAX_HISTORY_LENGTH = 20; // Maximum number of messages to keep in history

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Chat error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

// Apply rate limiting to chat endpoint
// Types for the enhanced context
interface Topic {
  id: string;
  name: string;
  content: string;
  description?: string;
  isCompleted?: boolean;
}

interface Day {
  dayNumber: number;
  summary?: string;
  topics?: Topic[];
}

interface RoadmapContext {
  title: string;
  description?: string;
  days: Day[];
}

interface UserGoal {
  goal: string;
  deadline?: string;
  currentProgress?: number;
}

interface CurrentTopic {
  name: string;
  description?: string;
  content?: string;
  isCompleted?: boolean;
}

interface ResumeData {
  rawText: string;
  // Add other resume fields as needed
}

interface ChatRequestBody {
  message: string;
  sessionId?: string;
  currentTopicId?: string;
  roadmap?: RoadmapContext;
  userGoal?: UserGoal;
  currentTopic?: CurrentTopic;
  resume?: ResumeData;
}

// Chat endpoint with rate limiting and enhanced context handling
router.post('/chat', chatLimiter, async (req, res, next) => {
  try {
    const { 
      message, 
      sessionId = `session_${Date.now()}`, // Default to a new session if none provided
      currentTopicId,
      roadmap,
      userGoal,
      currentTopic,
      resume
    } = req.body as ChatRequestBody;

    console.log('Received chat request with session:', sessionId);
    
    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    // Validate message length
    if (message.length > 2000) {
      return res.status(400).json({ 
        error: 'Message is too long. Maximum 2000 characters allowed.' 
      });
    }

    // Get or create chat session
    const chat = getChatSession(sessionId);
    if (!chat) {
      return res.status(500).json({ 
        error: 'Failed to initialize chat session' 
      });
    }
    
    // Build comprehensive context
    let contextParts: string[] = [];
    
    // 1. Add user goal context if available
    if (userGoal?.goal) {
      contextParts.push(`USER GOAL: ${userGoal.goal}`);
      if (userGoal.deadline) {
        contextParts.push(`DEADLINE: ${userGoal.deadline}`);
      }
      if (userGoal.currentProgress !== undefined) {
        contextParts.push(`CURRENT PROGRESS: ${userGoal.currentProgress}%`);
      }
    }
    
    // 2. Add resume context if available
    if (resume?.rawText) {
      // Truncate resume text to avoid hitting token limits
      const maxResumeLength = 2000;
      const truncatedResume = resume.rawText.length > maxResumeLength 
        ? resume.rawText.substring(0, maxResumeLength) + '... (truncated)' 
        : resume.rawText;
      
      contextParts.push('RESUME CONTEXT:');
      contextParts.push(truncatedResume);
    }
    
    // 3. Add roadmap context if available
    if (roadmap?.title) {
      contextParts.push(`ROADMAP: ${roadmap.title}`);
      if (roadmap.description) {
        contextParts.push(`DESCRIPTION: ${roadmap.description}`);
      }
      
      if (roadmap.days?.length) {
        contextParts.push('ROADMAP STRUCTURE:');
        roadmap.days.forEach(day => {
          contextParts.push(`  Day ${day.dayNumber}: ${day.summary || 'No summary'}`);
          if (day.topics?.length) {
            day.topics.forEach(topic => {
              contextParts.push(`    - ${topic.name}${topic.isCompleted ? ' ✓' : ''}`);
            });
          }
        });
      }
    }
    
    // 4. Add current topic context if available
    if (currentTopic) {
      contextParts.push('CURRENT TOPIC:');
      contextParts.push(`TITLE: ${currentTopic.name || 'Untitled'}`);
      if (currentTopic.description) {
        contextParts.push(`DESCRIPTION: ${currentTopic.description}`);
      }
      if (currentTopic.content) {
        // Truncate content to avoid hitting token limits
        const truncatedContent = currentTopic.content.length > 1000 
          ? currentTopic.content.substring(0, 1000) + '...' 
          : currentTopic.content;
        contextParts.push(`CONTENT: ${truncatedContent}`);
      }
    }
    
    // Combine all context parts
    const fullContext = contextParts.join('\n');
    
    // Add system message with context
    if (fullContext) {
      const systemMessage = `You are a helpful study assistant. Use the following context to provide personalized assistance:\n\n${fullContext}`;
      await chat.sendMessage(systemMessage);
    }
    
    // Add user message to chat history
    chat.history.push({
      role: 'user',
      parts: [{ text: message }]
    });
    
    // Send message to Gemini
    const result = await chat.sendMessage(message);
    const responseText = await result.response.text();

    // Add model's response to chat history
    chat.history.push({
      role: 'model',
      parts: [{ text: responseText }]
    });

    // Update chat history in session
    const currentSession = chatSessions.get(sessionId);
    if (currentSession?.history && currentSession.history.length > MAX_HISTORY_LENGTH) {
      currentSession.history = currentSession.history.slice(-MAX_HISTORY_LENGTH);
    }

    res.json({ 
      response: responseText,
      sessionId
    });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    
    // Handle specific Gemini API errors
    if (error.message.includes('safety')) {
      return res.status(400).json({
        error: "I'm sorry, but I can't assist with that request. It may violate content policies.",
      });
    }
    
    next(error);
  }
});

// Helper function to get or create a chat session
const getChatSession = (sessionId: string): ChatSession => {
  if (!chatSessions.has(sessionId)) {
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    }) as unknown as ChatSession;
    
    // Set the system message as the first user message
    chat.history = [{
      role: 'user',
      parts: [{
        text: "You are a helpful study assistant. Provide clear, concise, and accurate information to help users learn effectively."
      }]
    }];
    
    // Initialize history if it doesn't exist
    if (!chat.history) {
      chat.history = [];
    }
    
    chatSessions.set(sessionId, chat);
  }
  
  const chat = chatSessions.get(sessionId);
  if (!chat) {
    throw new Error('Failed to create or retrieve chat session');
  }
  
  return chat;
}

// Error handling middleware
router.use(errorHandler);

export default router;
