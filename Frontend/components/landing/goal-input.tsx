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
      <div
        className={`relative flex items-center overflow-hidden rounded-xl border transition-all duration-300 bg-card shadow-sm ${isFocused ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border"}`}
      >
        <div className="absolute left-4 h-5 w-5 text-muted-foreground">
          {isFocused ? <Sparkles className="h-5 w-5 text-primary animate-pulse" /> : <Search className="h-5 w-5" />}
        </div>
        
        <Input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter your learning goal..."
          className="flex-1 border-0 py-6 pl-12 pr-[180px] focus-visible:ring-0 text-base bg-transparent text-ellipsis"
          style={{ textOverflow: 'ellipsis' }}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button 
            type="submit" 
            className="rounded-lg bg-primary hover:bg-primary/90 transition-colors ml-4"
            disabled={!goal.trim()}
          >
            <span className="mr-2 hidden sm:inline">Create My Plan</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
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
        
        <div className="mt-3 bg-muted/40 p-3 rounded-lg">
          <p className="font-medium mb-1 text-xs uppercase tracking-wide">Example prompts:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="p-2 bg-background/80 rounded border border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setGoal("Learn Python for data science in 3 months")}>Learn Python for data science in 3 months</div>
            <div className="p-2 bg-background/80 rounded border border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setGoal("Help me prepare for a Google SDE-1 interview in 1 month by studying 3 hours per day")}>Help me prepare for a Google SDE-1 interview in 1 month by studying 3 hours per day</div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}