"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Circle,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { RoadmapItem, Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface RoadmapItemCardProps {
  item: RoadmapItem;
  onToggleComplete: (id: string) => void;
}

export default function RoadmapItemCard({
  item,
  onToggleComplete,
}: RoadmapItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const completedTopics = item.topics.filter(
    (topic) => topic.isCompleted
  ).length;
  const progress = (completedTopics / item.topics.length) * 100;
  const dayNumber = item.title.match(/Day (\d+):/)?.[1] || "";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn(
          "bg-card rounded-lg border border-border/50 overflow-hidden transition-all duration-200",
          "hover:shadow-sm hover:border-border",
          "transform-gpu hover:-translate-y-0.5"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
            isOpen ? "border-b border-border/50" : "",
            item.completed ? "bg-muted/30" : ""
          )}
        >
          <div className="flex-1 flex items-center gap-3">
            <Button
              variant={item.completed ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "rounded-full w-7 h-7 p-0 shrink-0",
                item.completed ? "bg-secondary/20 hover:bg-secondary/30" : ""
              )}
              onClick={() => onToggleComplete(item.id)}
            >
              {item.completed ? (
                <CheckCircle className="h-3.5 w-3.5 text-secondary" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="rounded-full px-2 py-0 text-xs"
                >
                  Day {dayNumber}
                </Badge>
                <h3
                  className={cn(
                    "text-sm font-medium truncate",
                    item.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  )}
                >
                  {item.title.replace(/Day \d+: /, "")}
                </h3>
              </div>
              {!isOpen && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 ml-10 sm:ml-0">
            <div className="w-24">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      progress === 100 ? "bg-secondary" : "bg-primary"
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {completedTopics}/{item.topics.length}
                </span>
              </div>
            </div>

            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 rounded-full"
              >
                {isOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4 space-y-3 bg-muted/10">
            {isOpen && (
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            )}
            <div className="grid gap-2">
              {item.topics.map((topic) => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  roadmapItemId={item.id}
                />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

function TopicItem({
  topic,
  roadmapItemId,
}: {
  topic: Topic;
  roadmapItemId: string;
}) {
  return (
    <li
      className={cn(
        "flex items-start p-2.5 rounded-md gap-2.5",
        topic.isCompleted ? "bg-muted/30" : "bg-card",
        "hover:bg-muted/40 transition-colors"
      )}
    >
      <div className="mt-0.5">
        {topic.isCompleted ? (
          <CheckCircle className="h-3.5 w-3.5 text-secondary" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium truncate",
            topic.isCompleted
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {topic.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {topic.description}
        </p>
      </div>
    </li>
  );
}
