import express, { Request, Response, NextFunction } from "express";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { createChatSession, saveChatMessage, getChatHistory, getOrCreateSession } from "../services/chatService";

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
  journeyId: string;  // Required for creating new chat sessions
  currentTopicId?: string;
  roadmap?: RoadmapContext;
  userGoal?: UserGoal;
  currentTopic?: CurrentTopic;
  resume?: ResumeData;
}

// Chat endpoint with rate limiting and enhanced context handling
router.post('/chat', chatLimiter, async (req: Request<{}, {}, ChatRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { 
      message, 
      sessionId: providedSessionId,
      currentTopicId,
      roadmap,
      userGoal,
      currentTopic,
      resume
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create a chat session
    if (!req.body.journeyId) {
      return res.status(400).json({ error: 'journeyId is required' });
    }
    const sessionId = await getOrCreateSession(providedSessionId, req.body.journeyId);

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

    // Get or create Gemini chat session
    const geminiChat = getOrCreateGeminiChat(sessionId);
    if (!geminiChat) {
      return res.status(500).json({ 
        error: 'Failed to initialize chat session' 
      });
    }
    
    // Get or create database chat session
    const dbSessionId = await getOrCreateSession(sessionId);
    if (!dbSessionId) {
      return res.status(500).json({ 
        error: 'Failed to initialize database chat session' 
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
    
    // Save user message to database
    const userMessage = {
      session_id: sessionId,
      role: 'user' as const,
      content: message
    };
    await saveChatMessage(userMessage);
    
    // Get chat history for context from database
    const history = await getChatHistory(sessionId);
    
    // Prepare chat history for Gemini
    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }]
    }));
    
    // Add system message with context at the beginning if we have context
    if (fullContext) {
      const systemMessage = `You are a helpful study assistant. Use the following context to provide personalized assistance. Current context:\n\n${fullContext}`;
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: systemMessage }]
      });
    }
    
    // Create a new chat instance with the full history including context
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
    
    // Get AI response
    const result = await chat.sendMessage(message);
    const responseText = await result.response.text();

    // Save AI response to database
    const assistantMessage = {
      session_id: sessionId,
      role: 'assistant' as const,
      content: responseText
    };
    await saveChatMessage(assistantMessage);
    
    // Update in-memory session with the new messages
    if (chatSessions.has(sessionId)) {
      const currentSession = chatSessions.get(sessionId);
      if (currentSession) {
        currentSession.history = [
          ...chatHistory,
          { role: 'user' as const, parts: [{ text: message }] },
          { role: 'model' as const, parts: [{ text: responseText }] }
        ];
      }
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
const getOrCreateGeminiChat = (sessionId: string): ChatSession => {
  if (!chatSessions.has(sessionId)) {
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    }) as unknown as ChatSession;
    
    // Initialize history if it doesn't exist
    chat.history = chat.history || [];
    
    // Add system message as the first message
    chat.history.push({
      role: 'user',
      parts: [{
        text: "You are a helpful study assistant. Provide clear, concise, and accurate information to help users learn effectively."
      }]
    });
    
    chatSessions.set(sessionId, chat);
  }
  
  const chat = chatSessions.get(sessionId);
  if (!chat) {
    throw new Error('Failed to create or retrieve chat session');
  }
  
  return chat;
}

// Text simplification endpoint
interface SimplifyRequest {
  text: string;
}

/**
 * @route POST /api/ai/simplify
 * @desc Simplify complex text to make it more accessible
 * @access Public
 * @param {string} text - The text to be simplified
 * @returns {Object} Simplified version of the input text
 */
router.post('/simplify', chatLimiter, async (req: Request<{}, {}, SimplifyRequest>, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Truncate text if too long to avoid token limits
    const maxTextLength = 10000;
    const textToSimplify = text.length > maxTextLength 
      ? text.substring(0, maxTextLength) + '... (truncated)'
      : text;

    // Create a system message with clear instructions
    const systemMessage = `You are an expert educator who simplifies complex text. Your task is to make the text more accessible while preserving its core meaning.

Follow these guidelines:
1. Use simple, clear language
2. Break down complex ideas
3. Keep technical terms only if essential (explain them if kept)
4. Use short sentences and paragraphs
5. Add bullet points for lists
6. Include examples where helpful
7. Maintain a friendly, approachable tone`;

    // Create a chat instance with the system message
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemMessage }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. Please provide the text you\'d like me to simplify.' }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 2000,
        temperature: 0.3, // Lower temperature for more focused, consistent output
      },
    });

    // Send the text to be simplified
    const result = await chat.sendMessage(`Please simplify this text for me:\n\n${textToSimplify}`);
    const simplified = await result.response.text();

    // Clean up the response (sometimes Gemini adds quotes or other artifacts)
    const cleanedSimplified = simplified
      .replace(/^"|"$/g, '') // Remove surrounding quotes if present
      .trim();

    res.json({ simplified: cleanedSimplified });
  } catch (error: any) {
    console.error('Error simplifying text:', error);
    res.status(500).json({
      error: 'Failed to simplify text',
      details: error.message || 'Unknown error',
    });
  }
});

// Get chat history by session ID
router.get('/chat/history/:sessionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const chatHistory = await getChatHistory(sessionId);
    res.json({ history: chatHistory });
  } catch (error: any) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error.message || 'Unknown error',
    });
  }
});

// Error handling middleware
router.use(errorHandler);

export default router;
