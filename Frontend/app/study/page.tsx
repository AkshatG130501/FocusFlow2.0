"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StudyLayout from "@/components/study/study-layout";
import StudyContent from "@/components/study/study-content";
import { Topic, RoadmapItem } from "@/lib/types";

export default function StudyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const router = useRouter();

  // Flatten all topics from roadmap items
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const journeyId = localStorage.getItem('journeyId');
        if (!journeyId) {
          console.error("Journey ID not found in localStorage");
          router.push('/');
          return;
        }

        const roadmap = await fetch(`http://localhost:5000/api/roadmap/${journeyId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
          },
        });
        if (!roadmap.ok) {
          throw new Error("Failed to fetch roadmap");
        }
        const roadmapData = await roadmap.json();
        console.log("Roadmap data:", roadmapData);
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get roadmap items from localStorage
        const storedRoadmap = localStorage.getItem('roadmapItems');
        
        if (storedRoadmap) {
          const roadmapItems = JSON.parse(storedRoadmap) as RoadmapItem[];
          const topics = roadmapItems.flatMap(item => item.topics);
          setAllTopics(topics);
          
          // Set the first topic as current
          if (topics.length > 0) {
            setCurrentTopic(topics[0]);
          }
        } else {
          // If no roadmap is found, redirect to the home page
          console.error("No roadmap found in localStorage");
          router.push('/');
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
    const topic = allTopics.find(t => t.id === topicId) || null;
    setCurrentTopic(topic);
  };

  const handleMarkComplete = (topicId: string) => {
    setAllTopics(topics => {
      // Update the topic completion status
      const updatedTopics = topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, isCompleted: !topic.isCompleted }
          : topic
      );
      
      // Update the roadmap items in localStorage
      const storedRoadmap = localStorage.getItem('roadmapItems');
      
      if (storedRoadmap) {
        const roadmapItems = JSON.parse(storedRoadmap) as RoadmapItem[];
        
        // Find and update the topic in the roadmap items
        const updatedRoadmapItems = roadmapItems.map(item => {
          const updatedItemTopics = item.topics.map(topic => {
            if (topic.id === topicId) {
              return { ...topic, isCompleted: !topic.isCompleted };
            }
            return topic;
          });
          
          // Calculate if all topics are completed to mark the section as completed
          const allTopicsCompleted = updatedItemTopics.every(topic => topic.isCompleted);
          
          return {
            ...item,
            topics: updatedItemTopics,
            completed: allTopicsCompleted,
          };
        });
        
        // Save the updated roadmap to localStorage
        localStorage.setItem('roadmapItems', JSON.stringify(updatedRoadmapItems));
      }
      
      return updatedTopics;
    });
    
    if (currentTopic?.id === topicId) {
      setCurrentTopic(prev => prev ? { ...prev, isCompleted: !prev.isCompleted } : null);
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