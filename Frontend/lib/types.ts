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
  title: string;
  description: string;
  completed: boolean;
  content?: string; // Markdown content
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
