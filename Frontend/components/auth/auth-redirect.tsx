"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface AuthRedirectProps {
  redirectTo: string;
}

export default function AuthRedirect({ redirectTo }: AuthRedirectProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only redirect after authentication state is loaded and user is authenticated
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, redirectTo, router]);

  // This component doesn't render anything
  return null;
}
