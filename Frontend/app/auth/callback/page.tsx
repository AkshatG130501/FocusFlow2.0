"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error during auth callback:", error);
          router.push("/");
          return;
        }

        if (data?.session) {
          // Collect relevant data from localStorage
          const userDataToSync = {
            roadmapItems: localStorage.getItem("roadmapItems"),
            userGoal: localStorage.getItem("userGoal"),
            timeline: localStorage.getItem("timeline"),
            resumeData: localStorage.getItem("resumeTextPreview"),
          };

          try {
            // Send data to backend
            const response = await fetch(
              "http://localhost:5000/api/roadmap/save",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.session.access_token}`,
                },
                body: JSON.stringify({
                  userId: data.session.user.id,
                  roadmapItems: userDataToSync.roadmapItems, // Changed this line
                  userData: {
                    // Added structured userData
                    userGoal: userDataToSync.userGoal,
                    timeline: userDataToSync.timeline,
                    resumeData: userDataToSync.resumeData,
                  },
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to sync user data");
            }

            const { journeyId } = await response.json();
            localStorage.setItem("journeyId", journeyId);
            // After successful sync, redirect to study page
            router.push("/study");
          } catch (syncError) {
            console.error("Error syncing user data:", syncError);
            // Still redirect to study page even if sync fails
            router.push("/study");
          }
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-lg text-foreground/80">
          Setting up your account...
        </p>
      </div>
    </div>
  );
}
