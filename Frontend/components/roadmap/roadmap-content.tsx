"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RoadmapItem } from "@/lib/types";
import RoadmapItemCard from "./roadmap-item-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListTodo, BookOpen } from "lucide-react";

interface RoadmapContentProps {
  items: RoadmapItem[];
  onToggleComplete: (id: string) => void;
}

export default function RoadmapContent({
  items,
  onToggleComplete,
}: RoadmapContentProps) {
  const [viewType, setViewType] = useState<"list">("list");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-secondary/10 p-1.5 rounded-full mr-2">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Your Study Plan
          </h2>
        </div>

        <Tabs
          value={viewType}
          className="w-auto"
          onValueChange={(value) => setViewType(value as "list")}
        >
          <TabsList className="grid w-[200px] grid-cols-1 bg-muted/80">
            <TabsTrigger
              value="list"
              className="flex items-center data-[state=active]:bg-background"
            >
              <ListTodo className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Tabs value={viewType} className="w-full">
          <TabsContent value="list" className="mt-0">
            <motion.div
              className="space-y-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {items.map((item) => (
                <RoadmapItemCard
                  key={item.id}
                  item={item}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </motion.div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}
