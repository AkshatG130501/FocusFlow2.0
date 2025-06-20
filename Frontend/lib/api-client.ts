/**
 * API Client Utility
 * Provides functions for interacting with backend APIs
 */

import { ParsedResumeData, RoadmapItem } from "./types";

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

    const response = await fetch(
      "http://localhost:5000/api/resume-parser/parse",
      {
        method: "POST",
        body: formData,
      }
    );

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
    const response = await fetch(
      "http://localhost:5000/api/roadmap/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          resumeText,
          timelineInDays,
        }),
      }
    );

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
