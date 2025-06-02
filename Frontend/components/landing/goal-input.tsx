"use client";

import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
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
          placeholder="e.g., Learn Python for data science in 3 months"
          className="flex-1 border-0 py-6 pl-12 pr-40 focus-visible:ring-0 text-base bg-transparent"
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button 
            type="submit" 
            className="rounded-lg bg-primary hover:bg-primary/90 transition-colors"
            disabled={!goal.trim()}
          >
            <span className="mr-2 hidden sm:inline">Create My Plan</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
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
    </motion.form>
  );
}