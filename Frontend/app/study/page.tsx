"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StudyLayout from "@/components/study/study-layout";
import StudyContent from "@/components/study/study-content";
import {
  Topic,
  RoadmapItem,
  Day,
  TopicContent,
  TopicGenerationStatus,
} from "@/lib/types";
import {
  startTopicContentGeneration,
  getTopicContent,
  getContentGenerationStatus,
} from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function StudyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [currentTopicContent, setCurrentTopicContent] = useState<string>("");
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<{
    days: Day[];
    id: string;
    goal: string;
    duration: number;
    prepType: string;
    progress: number;
    isCompleted: boolean;
  } | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<TopicGenerationStatus | null>(null);
  const [contentCache, setContentCache] = useState<Record<string, string>>({});
  const router = useRouter();
  const { toast } = useToast();

  // Load topic content when current topic changes
  const loadTopicContent = useCallback(
    async (topicId: string) => {
      if (!topicId) return;

      // Check if content is already in cache
      if (contentCache[topicId]) {
        setCurrentTopicContent(contentCache[topicId]);
        return;
      }

      setIsContentLoading(true);

      try {
        const content = await getTopicContent(topicId);

        // Update cache and current content
        setContentCache((prev) => ({
          ...prev,
          [topicId]: content.content,
        }));

        setCurrentTopicContent(content.content);
      } catch (error: any) {
        console.error("Failed to load topic content:", error);

        // Set a helpful message for the user
        setCurrentTopicContent(
          "Content is currently being generated. Please check back in a moment."
        );

        // Show a toast notification
        toast({
          title: "Content Loading",
          description:
            error.message ||
            "We're generating this topic's content. It will be available shortly.",
          duration: 5000,
        });
      } finally {
        setIsContentLoading(false);
      }
    },
    [contentCache, toast]
  );

  // Check content generation status periodically
  const checkGenerationStatus = useCallback(async (journeyId: string) => {
    try {
      const status = await getContentGenerationStatus(journeyId);
      setGenerationStatus(status);

      // If not complete, check again in 10 seconds
      if (!status.isComplete) {
        setTimeout(() => checkGenerationStatus(journeyId), 10000);
      }
    } catch (error: any) {
      console.error("Failed to check generation status:", error);
      // Don't show a toast for this error as it's a background process
      // and we don't want to interrupt the user experience
    }
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const journeyId = localStorage.getItem("journeyId");
        if (!journeyId) {
          console.error("Journey ID not found in localStorage");
          router.push("/");
          return;
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/roadmap/${journeyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") || ""
            }`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch roadmap");
        }

        const data = await response.json();
        setRoadmapData(data);

        // Extract all topics from days array
        if (data.days && Array.isArray(data.days)) {
          const topics = data.days.flatMap((day: Day) =>
            day.topics.map((topic: Topic) => ({
              ...topic,
              dayNumber: day.dayNumber,
              daySummary: day.summary,
            }))
          );
          setAllTopics(topics);

          // Set first topic as current if available
          if (topics.length > 0) {
            setCurrentTopic(topics[0]);
          }
        }

        try {
          // Start content generation for this journey
          await startTopicContentGeneration(journeyId);

          // Start checking generation status
          checkGenerationStatus(journeyId);
        } catch (error: any) {
          console.error("Failed to start content generation:", error);
          toast({
            title: "Content Generation Error",
            description:
              error.message ||
              "Failed to start content generation. Content may be limited.",
            variant: "destructive",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Failed to load study content:", error);
        toast({
          title: "Error",
          description: "Failed to load study content. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, [router, checkGenerationStatus, toast]);

  const handleSelectTopic = (topicId: string) => {
    const topic = allTopics.find((t) => t.id === topicId) || null;
    setCurrentTopic(topic);
    // Content will be loaded by the useEffect that watches currentTopic
  };

  const handleMarkComplete = async (topicId: string) => {
    try {
      setUpdateLoading(topicId);
      const journeyId = localStorage.getItem("journeyId");
      if (!journeyId) {
        console.error("Journey ID not found");
        return;
      }

      const topic = allTopics.find((t) => t.id === topicId);
      if (!topic) return;
      const apiUrl =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${apiUrl}/api/roadmap/${journeyId}/topic/${topicId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") || ""
            }`,
          },
          body: JSON.stringify({
            isCompleted: !topic.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update topic status");
      }

      // Update local state only after successful API call
      setAllTopics((topics) =>
        topics.map((t) =>
          t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );

      // Update current topic if it's the one being modified
      if (currentTopic?.id === topicId) {
        setCurrentTopic((prev) =>
          prev ? { ...prev, isCompleted: !prev.isCompleted } : null
        );
      }

      // Update roadmap data to reflect new progress
      if (roadmapData) {
        const updatedDays = roadmapData.days.map((day) => ({
          ...day,
          topics: day.topics.map((t) =>
            t.id === topicId ? { ...t, isCompleted: !t.isCompleted } : t
          ),
        }));

        const totalTopics = updatedDays.flatMap((d) => d.topics).length;
        const completedTopics = updatedDays
          .flatMap((d) => d.topics)
          .filter((t) => t.isCompleted).length;
        const newProgress = Math.round((completedTopics / totalTopics) * 100);

        setRoadmapData({
          ...roadmapData,
          days: updatedDays,
          progress: newProgress,
        });
      }
    } catch (error) {
      console.error("Failed to update topic status:", error);
      // Optionally show error to user
    } finally {
      setUpdateLoading(null);
    }
  };

  // Load content for the current topic when it changes
  useEffect(() => {
    if (currentTopic) {
      loadTopicContent(currentTopic.id);
    }
  }, [currentTopic, loadTopicContent]);

  // Handle navigation between topics
  const handleNavigateNext = () => {
    const currentIndex = currentTopic
      ? allTopics.findIndex((t) => t.id === currentTopic.id)
      : -1;
    if (currentIndex < allTopics.length - 1) {
      setCurrentTopic(allTopics[currentIndex + 1]);
    }
  };

  const handleNavigatePrev = () => {
    const currentIndex = currentTopic
      ? allTopics.findIndex((t) => t.id === currentTopic.id)
      : -1;
    if (currentIndex > 0) {
      setCurrentTopic(allTopics[currentIndex - 1]);
    }
  };

  return (
    <StudyLayout
      topics={allTopics}
      days={roadmapData?.days || []}
      currentTopicId={currentTopic?.id}
      isLoading={isLoading}
      onSelectTopic={handleSelectTopic}
      generationStatus={generationStatus}
    >
      <StudyContent
        topic={currentTopic}
        topicContent={currentTopicContent}
        isLoading={isLoading}
        isContentLoading={isContentLoading}
        onMarkComplete={handleMarkComplete}
        updateLoading={updateLoading}
        onNavigateNext={handleNavigateNext}
        onNavigatePrev={handleNavigatePrev}
        hasPrev={
          currentTopic
            ? allTopics.findIndex((t) => t.id === currentTopic.id) > 0
            : false
        }
        hasNext={
          currentTopic
            ? allTopics.findIndex((t) => t.id === currentTopic.id) <
              allTopics.length - 1
            : false
        }
      />
    </StudyLayout>
  );
}
