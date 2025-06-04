"use client";

import { motion } from "framer-motion";
import { BookOpen, Home, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RoadmapHeaderProps {
  onStartLearning: () => void;
}

export default function RoadmapHeader({ onStartLearning }: RoadmapHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Link href="/">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground/80">Roadmap</span>
          </div>
          
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold text-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Personalized Learning Roadmap
          </motion.h1>
        </div>
        
        {/* Button moved to the bottom section */}
      </div>
      
      <motion.div 
        className="bg-card rounded-lg p-6 shadow-md border border-border/50 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-primary/10 p-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                SDE-1 Interview Preparation for Google
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                30 Days Timeline
              </span>
              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                Technical Interview
              </span>
              <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                Algorithms & Data Structures
              </span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Button 
                onClick={onStartLearning}
                className="bg-primary hover:bg-primary/90 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}