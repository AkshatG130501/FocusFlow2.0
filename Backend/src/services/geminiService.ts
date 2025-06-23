/**
 * Gemini AI Service
 * Provides functions for interacting with Google's Gemini API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
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

// Use the correct model name based on the latest API version (0.24.1)
// Simplifying to use just the model name without additional configuration
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  duration: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  content?: string; // Markdown content
}

interface RoadmapResponse {
  title: string;
  timeline: string;
  prepType: string;
  roadmap: RoadmapItem[];
}

/**
 * Generate a personalized learning roadmap based on user goal and resume data
 * @param goal The user's learning goal
 * @param resumeText The raw text extracted from the user's resume
 * @param timelineInDays The number of days for the roadmap
 * @returns Promise resolving to an array of roadmap items
 */
export async function generateRoadmap(
  goal: string,
  resumeText: string | null,
  timelineInDays: number
): Promise<RoadmapResponse> {
  try {
    if (!API_KEY) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    // Prepare the prompt for Gemini
    const prompt = `
    You are an expert learning path creator. Create a personalized learning roadmap for a user with the following goal:
    "${goal}"
    
    ${
      resumeText
        ? `The user has provided their resume, here is the extracted text:
    ${resumeText.substring(0, 2000)}...`
        : "The user has not provided a resume."
    }
    
    Create a detailed day-by-day learning roadmap for exactly ${timelineInDays} days. First, determine:
    1. A concise title for this learning journey
    2. The preparation type (e.g., "Technical Interview Preparation", "Full-Stack Development Learning", etc.)
    
    Then create the daily roadmap structured as follows:
    1. Create exactly ${timelineInDays} sections, one for each day (Day 1, Day 2, etc.)
    2. Each day should have a title, description, and duration of 1 day
    3. Each day should contain specific topics to learn on that day
    4. Each topic should have a title and description (DO NOT include detailed content)

    Respond with a JSON object in this exact format:
    {
      "title": "Concise title of the learning journey",
      "timeline": "${timelineInDays} days",
      "prepType": "Type of preparation/study",
      "roadmap": [
        {
          "id": "day-1",
          "title": "Day 1: [Focus Area]",
          "description": "Detailed description of what will be covered on Day 1",
          "completed": false,
          "duration": "1 day",
          "topics": [
            {
              "id": "topic-1-1",
              "title": "Topic Title",
              "description": "Topic description",
              "completed": false
            }
          ]
        }
      ]
    }
    
    Make sure the roadmap is tailored to the user's goal and background (if resume is provided).
    You MUST create exactly ${timelineInDays} days, with a logical progression of topics.
    Each day should have 2-4 specific topics to learn.
    Only respond with the JSON object, no additional text.
    `;

    // Generate content using Gemini with simplified approach
    try {
      // Generate content with the prompt
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log("Gemini response received, length:", text.length);

      // Parse the JSON response
      try {
        // Extract JSON from the response (in case there's any additional text)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error(
            "Could not extract JSON from response. Raw response:",
            text
          );
          throw new Error("Could not extract JSON from Gemini response");
        }

        const jsonText = jsonMatch[0];
        console.log("Extracted JSON, length:", jsonText.length);

        const roadmapResponse = JSON.parse(jsonText) as RoadmapResponse;
        return roadmapResponse;
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        throw new Error("Failed to parse roadmap data from Gemini");
      }
    } catch (error: any) {
      // Type error as 'any' to safely access message property
      console.error("Error generating content with Gemini:", error);
      throw new Error(
        `Error generating roadmap with Gemini: ${
          error.message || "Unknown error"
        }`
      );
    }
  } catch (error) {
    console.error("Error generating roadmap with Gemini:", error);
    throw error;
  }
}