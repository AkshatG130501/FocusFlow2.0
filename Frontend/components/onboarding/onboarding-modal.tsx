"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  FileText,
  ChevronRight,
  Sparkles,
  Brain,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ResumeUpload from "./resume-upload";
import { GoalSubmission } from "@/lib/types";

interface OnboardingModalProps {
  goal: string;
  onClose: () => void;
}

export default function OnboardingModal({
  goal,
  onClose,
}: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    // Simulate API call to process goal and resume
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const submission: GoalSubmission = {
        goal,
        resume: resumeFile || undefined,
      };

      console.log("Submission:", submission);

      toast({
        title: "Success!",
        description: "Your personalized roadmap is ready.",
        duration: 5000,
      });

      // Navigate to roadmap page
      router.push("/roadmap");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[95%] sm:max-w-md md:max-w-xl bg-card border-border/50 shadow-lg">
            <DialogHeader>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <DialogTitle className="text-xl sm:text-2xl font-bold">
                  Personalize Your Learning
                </DialogTitle>
              </div>
              <DialogDescription className="text-foreground/70">
                We&apos;ll create a tailored learning plan based on your goal
                and experience.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 sm:py-6 space-y-4 sm:space-y-6">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-medium flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-secondary" />
                  Resume Upload (Optional)
                </h3>
                <p className="text-sm text-foreground/70">
                  Upload your resume to help us tailor your roadmap based on
                  your existing skills and experience.
                </p>

                <ResumeUpload
                  resumeFile={resumeFile}
                  setResumeFile={setResumeFile}
                />
              </div>

              <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center text-sm text-foreground/60">
                  <Sparkles className="h-4 w-4 mr-2 text-accent" />
                  <span>AI-powered personalization</span>
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
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    {isUploading ? (
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
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Create My Roadmap
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
