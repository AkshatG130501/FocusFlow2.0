"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Home,
  Sparkles,
  Clock,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface RoadmapHeaderProps {
  onStartLearning: () => void;
  title?: string;
  timeline?: string;
  prepType?: string;
  className?: string;
}

export default function RoadmapHeader({
  onStartLearning,
  title = "Your Roadmap",
  timeline = "30 days",
  prepType = "Full-Stack Development",
  className,
}: RoadmapHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-muted-foreground/60 mb-4">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center"
        >
          <Home className="h-4 w-4 mr-1.5" />
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
        <span className="text-foreground/80">Roadmap</span>
      </div>

      {/* Main Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h1
            className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Your Personalized Learning Roadmap
          </motion.h1>
          <p className="text-muted-foreground/80 max-w-2xl text-base">
            A step-by-step guide to master the skills needed for your target
            role.
          </p>
        </div>
      </motion.div>

      {/* Roadmap Info Card */}
      <motion.div
        className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/30 mb-8 bg-gradient-to-br from-background/80 to-card/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/15 p-2.5 rounded-lg ring-1 ring-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground/90">
                {title}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-muted/80 px-3.5 py-1.5 rounded-full text-sm border border-border/20">
                <Clock className="h-4 w-4 text-primary/90" />
                <span className="text-foreground/70">{timeline}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted/80 px-3.5 py-1.5 rounded-full text-sm border border-border/20">
                <Lightbulb className="h-4 w-4 text-primary/90" />
                <span className="text-foreground/70">{prepType}</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Button
              onClick={onStartLearning}
              size="lg"
              className="group bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/20 hover:scale-[1.02]"
            >
              <BookOpen className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Learning Journey
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
