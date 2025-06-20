"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { parseResumeWithBackend } from "@/lib/api-client";
import { ResumeData, ParsedResumeData } from "@/lib/types";

interface UserContextType {
  userGoal: string;
  setUserGoal: (goal: string) => void;
  timeline: string;
  setTimeline: (timeline: string) => void;
  parseGoalInput: (input: string) => void;
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  parsedResumeData: ParsedResumeData | null;
  setParsedResumeData: (data: ParsedResumeData | null) => void;
  isParsingResume: boolean;
  parseResume: (file: File) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userGoal, setUserGoal] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [parsedResumeData, setParsedResumeData] = useState<ParsedResumeData | null>(null);
  const [isParsingResume, setIsParsingResume] = useState<boolean>(false);

  // Parse goal input to extract goal and timeline
  const parseGoalInput = (input: string) => {
    if (!input.trim()) return;
    
    // Try to extract timeline with patterns like "in X months/days/weeks"
    const timelinePatterns = [
      /in\s+(\d+)\s+month(s)?/i,
      /in\s+(\d+)\s+day(s)?/i,
      /in\s+(\d+)\s+week(s)?/i,
    ];
    
    let extractedTimeline = "";
    let cleanedGoal = input;
    
    // Check for timeline patterns
    for (const pattern of timelinePatterns) {
      const match = input.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[0].toLowerCase().includes("month") ? "Month" : 
                    match[0].toLowerCase().includes("week") ? "Week" : "Day";
        
        // Format the timeline
        extractedTimeline = value === 1 ? 
          `${value} ${unit}` : 
          `${value} ${unit}s`;
        
        // Remove the timeline part from the goal
        cleanedGoal = input.replace(pattern, "").trim();
        break;
      }
    }
    
    // Extract the main goal by removing common phrases
    let mainGoal = cleanedGoal;
    
    // Remove common phrases that aren't part of the core goal
    const phrasesToRemove = [
      /help me prepare for/i,
      /i want to prepare for/i,
      /prepare for/i,
      /help me with/i,
      /i need to learn/i,
      /i want to learn/i,
      /by studying .+ per day/i,
      /studying .+ hours/i,
      /studying .+ a day/i,
    ];
    
    for (const phrase of phrasesToRemove) {
      mainGoal = mainGoal.replace(phrase, "").trim();
    }
    
    // Set the extracted values
    setUserGoal(mainGoal);
    setTimeline(extractedTimeline);
    
    // Save to localStorage
    localStorage.setItem("userGoal", mainGoal);
    localStorage.setItem("timeline", extractedTimeline);
  };

  // Parse resume file by sending it to the backend for processing
  const parseResume = async (file: File): Promise<void> => {
    if (!file) return;
    
    setIsParsingResume(true);
    
    try {
      // Basic file metadata
      const newResumeData: ResumeData = {
        text: "", // Will be populated after parsing
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      // Parse the resume using the backend service
      const parsedData = await parseResumeWithBackend(file);
      
      // Update the text in our basic resume data
      newResumeData.text = parsedData.rawText;
      
      // Store both basic and parsed resume data
      setResumeData(newResumeData);
      setParsedResumeData(parsedData);
      
      // Save to localStorage (only metadata, not the full text to avoid storage limits)
      localStorage.setItem("resumeFileName", file.name);
      localStorage.setItem("resumeFileSize", file.size.toString());
      localStorage.setItem("resumeFileType", file.type);
      
      // We can store a portion of the text for reference
      const textPreview = parsedData.rawText.substring(0, 1000); // Store first 1000 chars
      localStorage.setItem("resumeTextPreview", textPreview);
      
      // Store the fact that we have parsed resume data
      localStorage.setItem("hasResumeData", "true");
      
      // Store a preview of the raw text
      localStorage.setItem("resumeTextPreview", parsedData.rawText.substring(0, 1000));
      
    } catch (error) {
      console.error("Error parsing resume:", error);
      // Reset resume data on error
      setResumeData(null);
      setParsedResumeData(null);
    } finally {
      setIsParsingResume(false);
    }
  };

  // Load from localStorage on initial render
  useEffect(() => {
    const savedGoal = localStorage.getItem("userGoal");
    const savedTimeline = localStorage.getItem("timeline");
    const savedResumeFileName = localStorage.getItem("resumeFileName");
    const savedResumeFileSize = localStorage.getItem("resumeFileSize");
    const savedResumeFileType = localStorage.getItem("resumeFileType");
    const savedResumeTextPreview = localStorage.getItem("resumeTextPreview");
    const hasResumeData = localStorage.getItem("hasResumeData");
    
    if (savedGoal) {
      setUserGoal(savedGoal);
    }
    
    if (savedTimeline) {
      setTimeline(savedTimeline);
    }
    
    // Restore resume metadata if available
    if (savedResumeFileName && savedResumeFileSize && savedResumeFileType && savedResumeTextPreview) {
      // Restore basic resume data
      setResumeData({
        fileName: savedResumeFileName,
        fileSize: parseInt(savedResumeFileSize),
        fileType: savedResumeFileType,
        text: savedResumeTextPreview
      });
      
      // Restore parsed resume data if available
      if (savedResumeTextPreview && localStorage.getItem("hasResumeData")) {
        // Create a minimal parsed resume data object from localStorage
        // This is just a placeholder until the user uploads a resume again
        setParsedResumeData({
          rawText: savedResumeTextPreview
        });
      }
    }
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    if (userGoal) {
      localStorage.setItem("userGoal", userGoal);
    }
  }, [userGoal]);
  
  useEffect(() => {
    if (timeline) {
      localStorage.setItem("timeline", timeline);
    }
  }, [timeline]);

  return (
    <UserContext.Provider value={{ 
      userGoal, 
      setUserGoal, 
      timeline, 
      setTimeline,
      parseGoalInput,
      resumeData,
      setResumeData,
      parsedResumeData,
      setParsedResumeData,
      isParsingResume,
      parseResume
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
