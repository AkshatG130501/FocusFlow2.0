"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RoadmapHeader from "@/components/roadmap/roadmap-header";
import RoadmapContent from "@/components/roadmap/roadmap-content";
import RoadmapSkeleton from "@/components/roadmap/roadmap-skeleton";
import SignInModal from "@/components/auth/signin-modal";
import { useAuth } from "@/hooks/use-auth";
import { RoadmapItem } from "@/lib/types";
import { mockRoadmapData } from "@/lib/mock-data";

export default function RoadmapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const auth = useAuth();

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

  // Check authentication status when auth state changes
  useEffect(() => {
    if (!auth.isLoading) {
      setIsAuthenticated(!!auth.user);
    }
  }, [auth.user, auth.isLoading]);

  const handleStartLearning = () => {
    // If user is authenticated, navigate directly to study page
    // Otherwise, show sign-in modal
    if (isAuthenticated) {
      router.push("/study");
    } else {
      setShowSignInModal(true);
    }
  };

  const handleCloseSignInModal = () => {
    setShowSignInModal(false);
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

        {/* Sign-in Modal */}
        <SignInModal 
          isOpen={showSignInModal}
          onClose={handleCloseSignInModal}
          userGoal="SDE-1 Interview Preparation for Google"
        />
      </div>
    </div>
  );
}