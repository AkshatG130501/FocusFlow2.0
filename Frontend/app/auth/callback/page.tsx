"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during auth callback:", error);
          router.push("/");
          return;
        }

        if (data?.session) {
          // Authentication successful, redirect to study page
          router.push("/study");
        } else {
          // No session found, redirect to home
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
        <p className="mt-4 text-lg text-foreground/80">Signing you in...</p>
      </div>
    </div>
  );
}
