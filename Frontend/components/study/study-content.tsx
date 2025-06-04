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
            !topic.completed &&
              "bg-gradient-to-r from-[#51d0de] to-[#bf4aa8] hover:opacity-90"
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
        <Tabs
          defaultValue="content"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
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

                    <h2 className="text-xl font-semibold mt-6 mb-4">
                      Overview
                    </h2>
                    <p>
                      This topic covers essential concepts you&apos;ll need to
                      understand for your Google SDE interview. We&apos;ll
                      explore the theory, implementation details, and common
                      problems.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">
                      Key Concepts
                    </h2>
                    <ul className="space-y-2 mb-6">
                      <li>
                        Understanding the core principles and applications
                      </li>
                      <li>Analyzing time and space complexity</li>
                      <li>Implementing efficient solutions</li>
                      <li>
                        Recognizing when and how to apply these concepts in
                        interview questions
                      </li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">
                      Common Pitfalls
                    </h2>
                    <p className="mb-6">
                      When working on these problems, be careful to avoid these
                      common mistakes:
                    </p>
                    <ul className="space-y-2">
                      <li>
                        Overlooking edge cases (empty inputs, single elements,
                        etc.)
                      </li>
                      <li>
                        Not considering the optimal approach before coding
                      </li>
                      <li>
                        Failing to communicate your thought process during the
                        interview
                      </li>
                    </ul>

                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mt-8 border border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-2">Pro Tip</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Google interviewers often look for candidates who can
                        optimize their solutions incrementally. Start with a
                        working solution, then improve it step by step while
                        explaining your reasoning.
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
