export interface User {
  id: string;
  name?: string;
  email?: string;
  goal?: string;
  resumeUrl?: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  duration: string;
  topics: Topic[];
}

export interface RoadmapResponse {
  title: string;
  timeline: string;
  prepType: string;
  roadmap: RoadmapItem[];
}

export interface Topic {
  id: string;
  name: string;
  content: string;
  isCompleted: boolean;
  dayNumber: number;
  daySummary: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  isCompleted: boolean;
  summary: string;
  topics: Topic[];
}

export interface Roadmap {
  id: string;
  goal: string;
  duration: number;
  prepType: string;
  progress: number;
  isCompleted: boolean;
  days: Day[];
}

export type GoalSubmission = {
  goal: string;
  resume?: File;
};

export interface ResumeData {
  text: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface ParsedResumeData {
  rawText: string;
}
