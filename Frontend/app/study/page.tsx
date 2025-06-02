"use client";

import { useState, useEffect } from "react";
import StudyLayout from "@/components/study/study-layout";
import StudyContent from "@/components/study/study-content";
import { Topic } from "@/lib/types";
import { mockRoadmapData } from "@/lib/mock-data";

export default function StudyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);

  // Flatten all topics from roadmap items
  useEffect(() => {
    const loadTopics = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const topics = mockRoadmapData.flatMap(item => item.topics);
        setAllTopics(topics);
        
        // Set the first topic as current
        if (topics.length > 0) {
          setCurrentTopic(topics[0]);
        }
      } catch (error) {
        console.error("Failed to load study content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTopics();
  }, []);

  const handleSelectTopic = (topicId: string) => {
    const topic = allTopics.find(t => t.id === topicId) || null;
    setCurrentTopic(topic);
  };

  const handleMarkComplete = (topicId: string) => {
    setAllTopics(topics => 
      topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, completed: !topic.completed }
          : topic
      )
    );
    
    if (currentTopic?.id === topicId) {
      setCurrentTopic(prev => prev ? { ...prev, completed: !prev.completed } : null);
    }
  };

  const handleNavigateToNextTopic = () => {
    if (!currentTopic) return;
    
    const currentIndex = allTopics.findIndex(t => t.id === currentTopic.id);
    if (currentIndex < allTopics.length - 1) {
      setCurrentTopic(allTopics[currentIndex + 1]);
    }
  };

  const handleNavigateToPrevTopic = () => {
    if (!currentTopic) return;
    
    const currentIndex = allTopics.findIndex(t => t.id === currentTopic.id);
    if (currentIndex > 0) {
      setCurrentTopic(allTopics[currentIndex - 1]);
    }
  };

  return (
    <StudyLayout
      topics={allTopics}
      currentTopicId={currentTopic?.id}
      onSelectTopic={handleSelectTopic}
      isLoading={isLoading}
    >
      <StudyContent
        topic={currentTopic}
        isLoading={isLoading}
        onMarkComplete={handleMarkComplete}
        onNavigateNext={handleNavigateToNextTopic}
        onNavigatePrev={handleNavigateToPrevTopic}
        hasPrev={currentTopic ? allTopics.findIndex(t => t.id === currentTopic.id) > 0 : false}
        hasNext={currentTopic ? allTopics.findIndex(t => t.id === currentTopic.id) < allTopics.length - 1 : false}
      />
    </StudyLayout>
  );
}