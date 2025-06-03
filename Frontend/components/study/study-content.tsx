"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle,
  FileText,
} from "lucide-react";
import { Topic, Resource, Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import CodeEditor from "./code-editor";

interface StudyContentProps {
  topic: Topic | null;
  isLoading: boolean;
  onMarkComplete: (topicId: string) => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function StudyContent({
  topic,
  isLoading,
  onMarkComplete,
  onNavigateNext,
  onNavigatePrev,
  hasPrev,
  hasNext,
}: StudyContentProps) {
  const [activeTab, setActiveTab] = useState("content");

  if (isLoading) {
    return <StudyContentSkeleton />;
  }

  if (!topic) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">No topic selected</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please select a topic from the sidebar to begin studying.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={topic.id}
        >
          {topic.title}
        </motion.h1>
        
        <Button
          variant={topic.completed ? "outline" : "default"}
          className={cn(
            "gap-2",
            !topic.completed && "bg-gradient-to-r from-[#51d0de] to-[#bf4aa8] hover:opacity-90"
          )}
          onClick={() => onMarkComplete(topic.id)}
        >
          {topic.completed ? (
            <>
              <CheckCircle className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              Mark as Complete
            </>
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lesson Content
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={`${topic.id}-${activeTab}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="content" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg mb-4">{topic.description}</p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-4">Overview</h2>
                    <p>
                      This topic covers essential concepts you'll need to understand for your Google SDE interview. 
                      We'll explore the theory, implementation details, and common problems.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-4">Key Concepts</h2>
                    <ul className="space-y-2 mb-6">
                      <li>Understanding the core principles and applications</li>
                      <li>Analyzing time and space complexity</li>
                      <li>Implementing efficient solutions</li>
                      <li>Recognizing when and how to apply these concepts in interview questions</li>
                    </ul>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-4">Common Pitfalls</h2>
                    <p className="mb-6">
                      When working on these problems, be careful to avoid these common mistakes:
                    </p>
                    <ul className="space-y-2">
                      <li>Overlooking edge cases (empty inputs, single elements, etc.)</li>
                      <li>Not considering the optimal approach before coding</li>
                      <li>Failing to communicate your thought process during the interview</li>
                    </ul>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-8 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-2">Pro Tip</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Google interviewers often look for candidates who can optimize their solutions incrementally.
                        Start with a working solution, then improve it step by step while explaining your reasoning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            

          </motion.div>
        </Tabs>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onNavigatePrev}
          disabled={!hasPrev}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Topic
        </Button>
        
        <Button
          variant="outline"
          onClick={onNavigateNext}
          disabled={!hasNext}
          className="gap-2"
        >
          Next Topic
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ResourceList({ resources }: { resources: Resource[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {resources.map((resource) => (
        <div 
          key={resource.id}
          className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="mr-3 mt-1">
            {resource.type === 'video' && <Youtube className="h-5 w-5 text-red-500" />}
            {resource.type === 'article' && <FileText className="h-5 w-5 text-blue-500" />}
            {resource.type === 'practice' && <Code className="h-5 w-5 text-green-500" />}
            {resource.type === 'other' && <ExternalLink className="h-5 w-5 text-purple-500" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{resource.title}</h3>
              <Badge variant="outline" className="ml-2">
                {resource.type}
              </Badge>
            </div>
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-flex items-center"
            >
              View Resource
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionList({ questions }: { questions: Question[] }) {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div 
          key={question.id}
          className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium">{question.text}</h3>
            <Badge 
              variant={
                question.difficulty === 'easy' 
                  ? 'outline' 
                  : question.difficulty === 'medium' 
                    ? 'secondary' 
                    : 'destructive'
              }
            >
              {question.difficulty}
            </Badge>
          </div>
          {question.answer && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300">{question.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StudyContentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
      </div>
      
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-8"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}

// Mock data for the component
const mockResources: Resource[] = [
  {
    id: "r1",
    title: "Data Structures & Algorithms in Python",
    type: "video",
    url: "https://www.youtube.com/watch?v=example1"
  },
  {
    id: "r2",
    title: "Cracking the Coding Interview: Arrays and Strings",
    type: "article",
    url: "https://example.com/article1"
  },
  {
    id: "r3",
    title: "LeetCode Problem: Two Sum",
    type: "practice",
    url: "https://leetcode.com/problems/two-sum/"
  },
  {
    id: "r4",
    title: "Google Tech Dev Guide",
    type: "other",
    url: "https://techdevguide.withgoogle.com/"
  }
];

const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "How would you find all pairs of integers in an array that sum to a specific target?",
    difficulty: "medium",
    answer: "Use a hash map to store each element as you iterate through the array. For each element, check if (target - element) exists in the hash map."
  },
  {
    id: "q2",
    text: "Implement a function to check if a string is a palindrome.",
    difficulty: "easy",
    answer: "Compare characters from the start and end of the string, moving inward until they meet in the middle."
  },
  {
    id: "q3",
    text: "Design an algorithm to find the longest substring without repeating characters.",
    difficulty: "hard",
    answer: "Use a sliding window approach with a hash set to track characters in the current window. Expand the window when possible, and contract it when duplicates are found."
  }
];