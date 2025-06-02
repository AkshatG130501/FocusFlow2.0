"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, CheckCircle, Circle, BookOpen } from "lucide-react";
import { RoadmapItem, Topic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface RoadmapItemCardProps {
  item: RoadmapItem;
  onToggleComplete: (id: string) => void;
}

export default function RoadmapItemCard({ item, onToggleComplete }: RoadmapItemCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedTopics = item.topics.filter(topic => topic.completed).length;
  const progress = (completedTopics / item.topics.length) * 100;
  
  const item_variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div variants={item_variants}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-card rounded-lg shadow-sm border border-border/50 overflow-hidden transition-all duration-200"
      >
        <div className={cn(
          "p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
          isOpen ? "border-b border-border/50" : ""
        )}>
          <div className="flex-1">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 mr-2 h-6 w-6 hover:bg-transparent"
                onClick={() => onToggleComplete(item.id)}
              >
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/50" />
                )}
              </Button>
              
              <h3 className={cn(
                "text-lg font-medium text-foreground",
                item.completed ? "text-muted-foreground line-through" : ""
              )}>
                {item.title}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 ml-7">
              {item.description}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 ml-7 sm:ml-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {item.duration}
            </div>
            
            <div className="flex-1 sm:flex-none w-full sm:w-32">
              <div className="flex items-center">
                <div className="bg-muted h-2 rounded-full w-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-xs font-medium whitespace-nowrap text-muted-foreground">
                  {completedTopics}/{item.topics.length}
                </span>
              </div>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent>
          <div className="p-5 bg-muted/30">
            <div className="flex items-center mb-3">
              <BookOpen className="h-4 w-4 text-primary mr-2" />
              <h4 className="text-sm font-medium text-foreground">Topics:</h4>
            </div>
            <ul className="space-y-3 ml-1">
              {item.topics.map((topic) => (
                <TopicItem 
                  key={topic.id} 
                  topic={topic} 
                  roadmapItemId={item.id}
                />
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}

function TopicItem({ topic, roadmapItemId }: { topic: Topic; roadmapItemId: string }) {
  return (
    <li className="flex items-start">
      <div className="mt-0.5">
        {topic.completed ? (
          <CheckCircle className="h-4 w-4 text-secondary" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground/50" />
        )}
      </div>
      <div className="ml-2">
        <p className={cn(
          "text-sm font-medium text-foreground",
          topic.completed ? "text-muted-foreground line-through" : ""
        )}>
          {topic.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {topic.description}
        </p>
      </div>
    </li>
  );
}