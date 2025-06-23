"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudyLayout from "@/components/study/study-layout";
import StudyContent from "@/components/study/study-content";
import { Topic, RoadmapItem, Day } from "@/lib/types";

export default function StudyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
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
  const router = useRouter();

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const journeyId = localStorage.getItem("journeyId");
        if (!journeyId) {
          console.error("Journey ID not found in localStorage");
          router.push("/");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/roadmap/${journeyId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("accessToken") || ""
              }`,
            },
          }
        );

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
      } catch (error) {
        console.error("Failed to load study content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopics();
  }, [router]);

  const handleSelectTopic = (topicId: string) => {
    const topic = allTopics.find((t) => t.id === topicId) || null;
    setCurrentTopic(topic);
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

      const response = await fetch(
        `http://localhost:5000/api/roadmap/${journeyId}/topic/${topicId}`,
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

  return (
    <StudyLayout
      topics={allTopics}
      days={roadmapData?.days || []}
      currentTopicId={currentTopic?.id}
      isLoading={isLoading}
      onSelectTopic={handleSelectTopic}
    >
      <StudyContent
        topic={currentTopic}
        isLoading={isLoading}
        onMarkComplete={handleMarkComplete}
        updateLoading={updateLoading} // Add this prop
        onNavigateNext={() => {
          const currentIndex = currentTopic
            ? allTopics.findIndex((t) => t.id === currentTopic.id)
            : -1;
          if (currentIndex < allTopics.length - 1) {
            setCurrentTopic(allTopics[currentIndex + 1]);
          }
        }}
        onNavigatePrev={() => {
          const currentIndex = currentTopic
            ? allTopics.findIndex((t) => t.id === currentTopic.id)
            : -1;
          if (currentIndex > 0) {
            setCurrentTopic(allTopics[currentIndex - 1]);
          }
        }}
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
