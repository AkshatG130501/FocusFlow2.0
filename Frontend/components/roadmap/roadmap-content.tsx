"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { RoadmapItem } from "@/lib/types";
import RoadmapItemCard from "./roadmap-item-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  ListTodo,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoadmapContentProps {
  items: RoadmapItem[];
  onToggleComplete: (id: string) => void;
}

export default function RoadmapContent({
  items,
  onToggleComplete,
}: RoadmapContentProps) {
  const [viewType, setViewType] = useState<"list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending

  // Calculate overall progress
  const totalTopics = items.reduce((acc, item) => acc + item.topics.length, 0);
  const completedTopics = items.reduce(
    (acc, item) => acc + item.topics.filter((topic) => topic.completed).length,
    0
  );
  const overallProgress = Math.round((completedTopics / totalTopics) * 100);

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all"
          ? true
          : filter === "completed"
          ? item.completed
          : !item.completed;
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, filter]);

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
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
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
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <RoadmapItemCard
                    key={item.id}
                    item={item}
                    onToggleComplete={onToggleComplete}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No topics found matching your criteria
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
