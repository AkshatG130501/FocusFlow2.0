"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoadmapHeader from "@/components/roadmap/roadmap-header";
import RoadmapContent from "@/components/roadmap/roadmap-content";
import RoadmapSkeleton from "@/components/roadmap/roadmap-skeleton";
import { RoadmapItem } from "@/lib/types";
import { mockRoadmapData } from "@/lib/mock-data";

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const router = useRouter();

  // Simulate loading roadmap data
  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRoadmapItems(mockRoadmapData);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoadmap();
  }, []);

  const handleStartLearning = () => {
    router.push("/study");
  };

  const handleToggleComplete = (roadmapId: string) => {
    setRoadmapItems(items => 
      items.map(item => 
        item.id === roadmapId 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RoadmapHeader onStartLearning={handleStartLearning} />
        
        {isLoading ? (
          <RoadmapSkeleton />
        ) : (
          <RoadmapContent 
            items={roadmapItems} 
            onToggleComplete={handleToggleComplete}
          />
        )}
      </div>
    </div>
  );
}