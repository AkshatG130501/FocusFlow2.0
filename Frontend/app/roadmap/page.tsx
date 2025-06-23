"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoadmapHeader from "@/components/roadmap/roadmap-header";
import RoadmapContent from "@/components/roadmap/roadmap-content";
import RoadmapSkeleton from "@/components/roadmap/roadmap-skeleton";
import SignInModal from "@/components/auth/signin-modal";
import { useAuth } from "@/hooks/use-auth";
import { RoadmapItem, RoadmapResponse } from "@/lib/types";

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapResponse, setRoadmapResponse] =
    useState<RoadmapResponse | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  // Load roadmap data from localStorage
  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        // Add a small delay to show the loading state
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get roadmap items from localStorage
        const storedRoadmap = localStorage.getItem("roadmapItems");

        if (storedRoadmap) {
          const parsedRoadmap = JSON.parse(storedRoadmap) as RoadmapResponse;
          setRoadmapResponse(parsedRoadmap);
        } else {
          // If no roadmap is found, redirect to the home page
          console.error("No roadmap found in localStorage");
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmap();
  }, [router]);

  const handleStartLearning = () => {
    // If user is authenticated, navigate directly to study page
    // Otherwise, show sign-in modal
    if (auth.user) {
      router.push("/study");
    } else {
      setShowSignInModal(true);
    }
  };

  const handleCloseSignInModal = () => {
    setShowSignInModal(false);
  };

  const handleToggleComplete = (topicId: string) => {
    if (!roadmapResponse) return;

    setRoadmapResponse((prev) => {
      if (!prev) return null;

      const updatedRoadmap = {
        ...prev,
        roadmap: prev.roadmap.map((item) => {
          const updatedTopics = item.topics.map((topic) => {
            if (topic.id === topicId) {
              return { ...topic, isCompleted: !topic.isCompleted };
            }
            return topic;
          });

          const allTopicsCompleted = updatedTopics.every(
            (topic) => topic.isCompleted
          );

          return {
            ...item,
            topics: updatedTopics,
            completed: allTopicsCompleted,
          };
        }),
      };

      // Save the updated roadmap to localStorage
      localStorage.setItem("roadmapItems", JSON.stringify(updatedRoadmap));

      return updatedRoadmap;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <RoadmapHeader
          onStartLearning={handleStartLearning}
          title={roadmapResponse?.title}
          timeline={roadmapResponse?.timeline}
          prepType={roadmapResponse?.prepType}
        />

        {isLoading ? (
          <RoadmapSkeleton />
        ) : (
          <RoadmapContent
            items={roadmapResponse?.roadmap || []}
            onToggleComplete={handleToggleComplete}
          />
        )}

        <SignInModal
          isOpen={showSignInModal}
          onClose={handleCloseSignInModal}
        />
      </div>
    </div>
  );
}
