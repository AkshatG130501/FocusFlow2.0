/**
 * API Client Utility
 * Provides functions for interacting with backend APIs
 */

import {
  ParsedResumeData,
  RoadmapItem,
  TopicContent,
  TopicGenerationStatus,
} from "./types";

/**
 * Parse a resume file by sending it to the backend
 * @param file The resume file to parse
 * @returns Promise resolving to the parsed resume data
 */
export async function parseResumeWithBackend(
  file: File
): Promise<ParsedResumeData> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/resume-parser/parse`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to parse resume");
    }

    const data = await response.json();
    return data as ParsedResumeData;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}

/**
 * Generate a personalized roadmap using Gemini AI
 * @param goal The user's learning goal
 * @param resumeText The raw text extracted from the user's resume (optional)
 * @param timelineInDays The number of days for the roadmap (default: 30)
 * @returns Promise resolving to an array of roadmap items
 */
export async function generateRoadmap(
  goal: string,
  resumeText?: string,
  timelineInDays: number = 30
): Promise<RoadmapItem[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/roadmap/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        resumeText,
        timelineInDays,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate roadmap");
    }

    const data = await response.json();
    return data as RoadmapItem[];
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}

/**
 * Start generating content for a journey, prioritizing Day 1 topics
 * @param journeyId The ID of the journey/roadmap
 * @returns Promise resolving to success status
 */
export async function startTopicContentGeneration(
  journeyId: string
): Promise<boolean> {
  try {
    const token = localStorage.getItem("accessToken") || "";
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(
      `${apiUrl}/api/topic-content/generate-initial/${journeyId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to start content generation");
    }

    return true;
  } catch (error) {
    console.error("Error starting content generation:", error);
    return false;
  }
}

/**
 * Get content for a specific topic
 * @param topicId The ID of the topic
 * @returns Promise resolving to the topic content
 */
export async function getTopicContent(topicId: string): Promise<TopicContent> {
  try {
    const token = localStorage.getItem("accessToken") || "";
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(
      `${apiUrl}/api/topic-content/topic/${topicId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch topic content");
    }

    const data = await response.json();
    return data as TopicContent;
  } catch (error) {
    console.error("Error fetching topic content:", error);
    throw error;
  }
}

/**
 * Get content generation status for a journey
 * @param journeyId The ID of the journey/roadmap
 * @returns Promise resolving to the generation status
 */
export async function getContentGenerationStatus(
  journeyId: string
): Promise<TopicGenerationStatus> {
  try {
    const token = localStorage.getItem("accessToken") || "";
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(
      `${apiUrl}/api/topic-content/status/${journeyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch generation status");
    }

    const data = await response.json();
    return data as TopicGenerationStatus;
  } catch (error) {
    console.error("Error fetching generation status:", error);
    throw new Error("Failed to fetch generation status");
  }
}

/**
 * Simplify the given text using AI
 * @param text The text to simplify
 * @returns Promise resolving to the simplified text
 */
export async function simplifyText(text: string): Promise<string> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
    const response = await fetch(`${apiUrl}/api/ai/simplify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to simplify text");
    }

    const data = await response.json();
    return data.simplified;
  } catch (error) {
    console.error("Error simplifying text:", error);
    throw error;
  }
}
