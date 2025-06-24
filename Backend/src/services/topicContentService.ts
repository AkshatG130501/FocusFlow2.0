/**
 * Topic Content Generation Service
 * Handles generating detailed content for roadmap topics using Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the Gemini API client
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Generate detailed content for a specific topic
 * @param topicId The ID of the topic
 * @param topicName The name/title of the topic
 * @param journeyGoal The overall learning goal
 * @param dayNumber The day number this topic belongs to
 * @param daySummary Summary of the day's focus
 * @returns Promise resolving to the generated content
 */
export async function generateTopicContent(
  topicId: string,
  topicName: string,
  journeyGoal: string,
  dayNumber: number,
  daySummary: string
): Promise<string> {
  try {
    // Prepare the prompt for Gemini
    const prompt = `
    You are an expert educational content creator. Create detailed, comprehensive learning content for the following topic:
    
    Topic: "${topicName}"
    
    This topic is part of Day ${dayNumber} in a learning journey focused on: "${journeyGoal}"
    
    Day ${dayNumber} Summary: "${daySummary}"
    
    Please create educational content that:
    1. Starts with a brief introduction to the topic
    2. Explains key concepts in detail with examples
    3. Provides practical applications or exercises
    4. Includes code examples if relevant
    5. Ends with a summary and next steps
    
    Format the content using Markdown, with proper headings, code blocks, bullet points, etc.
    Make the content comprehensive but concise, focusing on the most important aspects of the topic.
    The content should be educational, accurate, and helpful for someone trying to learn this topic.
    
    Respond with just the formatted Markdown content, no additional text.
    `;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return content;
  } catch (error: any) {
    console.error(`Error generating content for topic ${topicId}:`, error);
    throw new Error(`Failed to generate content: ${error.message || "Unknown error"}`);
  }
}

/**
 * Save generated topic content to the database
 * @param topicId The ID of the topic
 * @param content The generated content
 */
export async function saveTopicContent(topicId: string, content: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("topics")
      .update({ topic_content: content })
      .eq("id", topicId);

    if (error) throw error;
  } catch (error: any) {
    console.error(`Error saving content for topic ${topicId}:`, error);
    throw new Error(`Failed to save content: ${error.message || "Unknown error"}`);
  }
}

/**
 * Check if a topic already has content
 * @param topicId The ID of the topic
 * @returns Promise resolving to boolean indicating if content exists
 */
export async function hasTopicContent(topicId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("topics")
      .select("topic_content")
      .eq("id", topicId)
      .single();

    if (error) throw error;
    
    return !!data && !!data.topic_content && data.topic_content.length > 0;
  } catch (error) {
    console.error(`Error checking content for topic ${topicId}:`, error);
    return false;
  }
}

/**
 * Queue for managing topic content generation
 */
class TopicGenerationQueue {
  private queue: {
    topicId: string;
    topicName: string;
    journeyGoal: string;
    dayNumber: number;
    daySummary: string;
  }[] = [];
  private isProcessing = false;
  private concurrentLimit = 2; // Number of concurrent generations
  private activeCount = 0;

  /**
   * Add a topic to the generation queue
   */
  addToQueue(
    topicId: string,
    topicName: string,
    journeyGoal: string,
    dayNumber: number,
    daySummary: string
  ): void {
    this.queue.push({
      topicId,
      topicName,
      journeyGoal,
      dayNumber,
      daySummary,
    });
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process the queue of topics
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0 || this.activeCount >= this.concurrentLimit) {
      if (this.activeCount === 0) {
        this.isProcessing = false;
      }
      return;
    }

    this.isProcessing = true;
    
    // Get next item from queue
    const item = this.queue.shift();
    if (!item) {
      if (this.activeCount === 0) {
        this.isProcessing = false;
      }
      return;
    }

    this.activeCount++;

    try {
      // Check if content already exists
      const hasContent = await hasTopicContent(item.topicId);
      
      if (!hasContent) {
        // Generate and save content
        const content = await generateTopicContent(
          item.topicId,
          item.topicName,
          item.journeyGoal,
          item.dayNumber,
          item.daySummary
        );
        
        await saveTopicContent(item.topicId, content);
        console.log(`Generated and saved content for topic ${item.topicId}`);
      } else {
        console.log(`Content already exists for topic ${item.topicId}, skipping`);
      }
    } catch (error) {
      console.error(`Error processing topic ${item.topicId}:`, error);
    } finally {
      this.activeCount--;
      // Continue processing the queue
      this.processQueue();
    }

    // Process next item in parallel if below concurrent limit
    if (this.activeCount < this.concurrentLimit) {
      this.processQueue();
    }
  }
}

// Export singleton instance of the queue
export const topicQueue = new TopicGenerationQueue();

/**
 * Generate content for Day 1 topics immediately and queue the rest
 * @param journeyId The ID of the journey/roadmap
 */
export async function generateInitialContent(journeyId: string): Promise<void> {
  try {
    // Fetch journey data
    const { data: journey, error: journeyError } = await supabase
      .from("journeys")
      .select("goal")
      .eq("id", journeyId)
      .single();

    if (journeyError) throw journeyError;

    // Fetch all days and topics
    const { data: days, error: daysError } = await supabase
      .from("days")
      .select(`
        id,
        day_number,
        topics (
          id,
          name,
          topic_content
        ),
        day_summaries (
          summary
        )
      `)
      .eq("journey_id", journeyId)
      .order("day_number", { ascending: true });

    if (daysError) throw daysError;

    if (!days || days.length === 0) {
      throw new Error("No days found for this journey");
    }

    // Process Day 1 topics immediately
    const day1 = days.find(day => day.day_number === 1);
    
    if (day1 && day1.topics && day1.topics.length > 0) {
      const day1Summary = day1.day_summaries?.[0]?.summary || "";
      
      // Generate content for Day 1 topics in parallel
      await Promise.all(
        day1.topics.map(async (topic: any) => {
          if (!topic.topic_content) {
            const content = await generateTopicContent(
              topic.id,
              topic.name,
              journey.goal,
              1,
              day1Summary
            );
            
            await saveTopicContent(topic.id, content);
          }
        })
      );
    }

    // Queue the rest of the topics for background processing
    for (const day of days) {
      // Skip Day 1 as we've already processed it
      if (day.day_number === 1) continue;
      
      const daySummary = day.day_summaries?.[0]?.summary || "";
      
      for (const topic of day.topics) {
        // Only queue topics that don't already have content
        if (!topic.topic_content) {
          topicQueue.addToQueue(
            topic.id,
            topic.name,
            journey.goal,
            day.day_number,
            daySummary
          );
        }
      }
    }
  } catch (error) {
    console.error("Error generating initial content:", error);
    throw error;
  }
}
