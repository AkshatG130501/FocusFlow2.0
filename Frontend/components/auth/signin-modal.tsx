"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, ChevronRight, Sparkles, Brain } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userGoal?: string;
}

export default function SignInModal({
  isOpen,
  onClose,
  userGoal = "Improve your learning experience",
}: SignInModalProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    onClose();
  };

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    
    try {
      // Call Supabase Google OAuth sign-in
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        throw error;
      }
      
      // The actual redirect will be handled by the auth callback page
      // Just close the modal here as the redirect will happen automatically
      onClose();
      
      toast({
        title: "Redirecting to Google",
        description: "Please complete the sign-in process",
        duration: 5000,
      });
      
    } catch (error) {
      console.error("Sign in failed:", error);
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="max-w-[95%] sm:max-w-md md:max-w-lg bg-card border-border/50 shadow-lg">
            <DialogHeader>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  Sign in to continue
                </DialogTitle>
              </div>
              <DialogDescription className="text-foreground/70">
                Sign in to access your personalized learning experience
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div className="bg-muted p-3 sm:p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-medium mb-2">Your goal</h3>
                  <p className="text-foreground/80">{userGoal}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">
                    Sign in to track your progress, save your work, and get personalized recommendations.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center text-sm text-foreground/60">
                  <Sparkles className="h-4 w-4 mr-2 text-accent" />
                  <span>Personalized learning experience</span>
                </div>
                <div className="flex w-full sm:w-auto space-x-2 sm:space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-border/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSignInWithGoogle}
                    disabled={isSigningIn}
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {isSigningIn ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in with Google
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
