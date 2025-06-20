/**
 * Types for resume parsing functionality
 */

export interface Skill {
  name: string;
  category?: string;
  level?: string;
}

export interface Education {
  institution: string;
  degree?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  location?: string;
}

export interface Experience {
  company: string;
  title: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string[];
}

/**
 * Resume Parser Types
 * Type definitions for resume parsing functionality
 */

/**
 * Parsed resume data structure
 */
export interface ParsedResumeData {
  rawText: string;
}
