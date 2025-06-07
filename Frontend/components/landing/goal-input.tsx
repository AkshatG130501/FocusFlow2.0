"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GoalInputProps {
  goal: string;
  setGoal: (goal: string) => void;
  onSubmit: () => void;
}

export default function GoalInput({ goal, setGoal, onSubmit }: GoalInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Reset focus state when goal is cleared
  useEffect(() => {
    if (!goal) {
      setIsFocused(false);
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim()) {
      onSubmit();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative max-w-2xl mx-auto"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="relative flex items-start overflow-hidden rounded-xl border transition-all duration-300 bg-card shadow-sm">
        <div className="absolute left-4 top-4 text-muted-foreground">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        <textarea
          className={`w-full p-4 pl-12 pb-16 text-md leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 bg-transparent ${
            isFocused
              ? "border-primary shadow-md ring-2 ring-primary/20"
              : "border-border"
          }`}
          value={goal}
          rows={3}
          placeholder="State Your Goal. For example : 'Help me prepare for a Google SDE-1 interview in 1 month by studying 3 hours per day'"
          onChange={(e) => setGoal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Button
          type="submit"
          className="absolute right-3 bottom-3 sm:flex hidden"
          disabled={!goal.trim()}
          variant="default"
          size="default"
        >
          Create My Plan
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
        <Button
          type="submit"
          className="absolute right-3 bottom-3 sm:hidden flex"
          disabled={!goal.trim()}
          variant="default"
          size="sm"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="flex items-center">
            <div className="h-1 w-1 rounded-full bg-primary mr-1"></div>
            <span>Be specific</span>
          </div>
          <div className="h-3 w-px bg-border"></div>
          <div className="flex items-center">
            <div className="h-1 w-1 rounded-full bg-secondary mr-1"></div>
            <span>Include timeline</span>
          </div>
          <div className="h-3 w-px bg-border"></div>
          <div className="flex items-center">
            <div className="h-1 w-1 rounded-full bg-accent mr-1"></div>
            <span>Add context</span>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
