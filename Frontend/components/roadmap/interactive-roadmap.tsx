"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapItem } from "@/lib/types";
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveRoadmapProps {
  items: RoadmapItem[];
  onToggleComplete: (id: string) => void;
}

// Week Card Component
function WeekCard({
  item,
  weekNumber,
  onToggleComplete,
  isExpanded,
  onToggleExpand,
}: {
  item: RoadmapItem;
  weekNumber: number;
  onToggleComplete: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
}) {
  // Calculate progress
  const completedTopics = item.topics.filter(
    (topic) => topic.isCompleted
  ).length;
  const progress = (completedTopics / item.topics.length) * 100;

  return (
    <div className="bg-card border border-border/50 rounded-lg shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="p-4 bg-muted/30">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">
            Week {weekNumber}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(item.id);
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.completed ? (
                <CheckCircle className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground mb-4">{item.description}</p>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              Progress
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {completedTopics}/{item.topics.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* View Topics Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(item.id);
            }}
          >
            {isExpanded ? "Hide Topics" : "View Topics"}
          </Button>
        </div>
      </div>

      {/* Expandable Topics List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/50 bg-background/50"
          >
            <div className="p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Topics:
              </h4>
              <ul className="space-y-3">
                {item.topics.map((topic, index) => (
                  <motion.li
                    key={topic.id}
                    className="flex items-start"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {}}
                  >
                    <div className="bg-primary/10 hover:bg-primary/20 transition-colors rounded-full p-3 shadow-sm">
                      {index % 2 === 0 ? (
                        <ArrowRight className="h-6 w-6 text-primary" />
                      ) : (
                        <ArrowLeft className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="ml-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          topic.isCompleted
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        )}
                      >
                        {topic.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {topic.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InteractiveRoadmap({
  items,
  onToggleComplete,
}: InteractiveRoadmapProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [animatingLines, setAnimatingLines] = useState<{
    [key: number]: boolean;
  }>({});

  // Initialize all lines to be visible
  useEffect(() => {
    setAnimatingLines(
      Object.fromEntries(
        Array.from(Array(items.length - 1).keys()).map((i) => [i, true])
      )
    );
  }, [items]);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8, // Slower box animation
        ease: "easeOut",
      },
    },
  };

  const lineVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1.0, // Slower line animation
        ease: "easeInOut",
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.2,
      },
    },
  };

  return (
    <div className="py-6 px-4">
      <div className="max-w-5xl mx-auto relative min-h-[500px]">
        {/* SVG for connecting lines */}
        <svg
          className="absolute top-0 left-0 w-full h-full z-0 overflow-visible"
          style={{ pointerEvents: "none" }}
        >
          {/* Connecting lines between boxes */}
          {items.map((_, index) => {
            if (index % 2 === 0 && index < items.length - 1) {
              // Line from left to right
              return (
                <motion.path
                  key={`line-${index}`}
                  d={`M 320 ${120 + index * 200} H 680 V ${
                    120 + (index + 1) * 200
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary/30"
                  initial="hidden"
                  animate={animatingLines[index] ? "visible" : "hidden"}
                  variants={lineVariants}
                />
              );
            } else if (index < items.length - 1) {
              // Line from right to left
              return (
                <motion.path
                  key={`line-${index}`}
                  d={`M 680 ${120 + index * 200} H 320 V ${
                    120 + (index + 1) * 200
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary/30"
                  initial="hidden"
                  animate={animatingLines[index] ? "visible" : "hidden"}
                  variants={lineVariants}
                />
              );
            }
            return null;
          })}
        </svg>

        {/* Week boxes in zigzag pattern */}
        {items.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={item.id} className="relative">
              {/* Week Card */}
              <motion.div
                className={`absolute ${
                  isEven ? "left-0" : "right-0"
                } w-[300px] z-10`}
                style={{ top: `${index * 200}px` }}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
              >
                <WeekCard
                  item={item}
                  weekNumber={index + 1}
                  onToggleComplete={onToggleComplete}
                  isExpanded={expandedItem === item.id}
                  onToggleExpand={toggleExpand}
                />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
