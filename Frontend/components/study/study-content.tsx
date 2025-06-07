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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { dummyMarkdown } from "@/lib/dummy-content";
import SelectionToolbar from "./selection-toolbar";

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
  const [selectedText, setSelectedText] = useState("");
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);

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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setToolbarPosition(null);
      setSelectedText("");
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    // Calculate position relative to the selected text
    setSelectedText(selection.toString());
    setToolbarPosition({
      x: rect.left + (rect.width / 2), // Center horizontally over selection
      y: rect.top + scrollY - 10 // Position slightly above selection with offset
    });
  };

  const handleSimplify = (text: string) => {
    console.log("Simplify:", text);
    // Implement your simplify logic here
  };

  const handleAskAI = (text: string) => {
    console.log("Ask AI:", text);
    // Implement your AI query logic here
  };

  const handleGenerateQuiz = (text: string) => {
    console.log("Generate Quiz:", text);
    // Implement your quiz generation logic here
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header section - non-scrollable */}
      <div className="flex-shrink-0 px-4 py-8">
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
      </div>

      {/* Content section - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
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
                  <CardContent 
                    className="pt-6 relative"
                    onMouseUp={(e) => {
                      e.stopPropagation(); // Prevent event bubbling
                      setTimeout(handleTextSelection, 0);
                    }}
                    onMouseDown={() => {
                      setToolbarPosition(null);
                    }}
                  >
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[
                          rehypeRaw,
                          [rehypeSanitize]
                        ]}
                        components={{
                          div: ({ node, ...props }) => <div className="markdown-content" {...props} />
                        }}
                      >
                        {topic.content || dummyMarkdown}
                      </ReactMarkdown>
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

      <SelectionToolbar
        position={toolbarPosition}
        onSimplify={handleSimplify}
        onAskAI={handleAskAI}
        onGenerateQuiz={handleGenerateQuiz}
      />
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
