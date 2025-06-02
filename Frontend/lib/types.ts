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

export interface Topic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  content?: string;
  resources?: Resource[];
  questions?: Question[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'practice' | 'other';
  url: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer?: string;
}

export type GoalSubmission = {
  goal: string;
  resume?: File;
};