"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, Check } from "lucide-react";
import { motion } from "@/lib/motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  children?: RoadmapNode[];
}

const sampleRoadmap: RoadmapNode[] = [
  {
    id: "foundations",
    title: "Programming Foundations",
    description: "Master the basics of programming and computer science",
    status: "completed",
    children: [
      {
        id: "python",
        title: "Python Basics",
        description: "Variables, data types, control flow",
        status: "completed",
      },
      {
        id: "dsa",
        title: "Data Structures",
        description: "Arrays, linked lists, trees, graphs",
        status: "completed",
      },
    ],
  },
  {
    id: "web-dev",
    title: "Web Development",
    description: "Build modern web applications",
    status: "current",
    children: [
      {
        id: "html-css",
        title: "HTML & CSS",
        description: "Structure and style web pages",
        status: "completed",
      },
      {
        id: "javascript",
        title: "JavaScript",
        description: "DOM manipulation and ES6+ features",
        status: "current",
      },
      {
        id: "react",
        title: "React",
        description: "Component-based UI development",
        status: "upcoming",
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Development",
    description: "Server-side programming and databases",
    status: "upcoming",
    children: [
      {
        id: "node",
        title: "Node.js",
        description: "Server-side JavaScript",
        status: "upcoming",
      },
      {
        id: "databases",
        title: "Databases",
        description: "SQL and NoSQL databases",
        status: "upcoming",
      },
    ],
  },
];

function RoadmapNode({
  node,
  level = 0,
}: {
  node: RoadmapNode;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const statusColors = {
    completed: "bg-green-500",
    current: "bg-blue-500",
    upcoming: "bg-gray-300 dark:bg-gray-600",
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

      <div className="relative flex items-start gap-4 py-4">
        <div
          className={`w-8 h-8 rounded-full ${
            statusColors[node.status]
          } flex items-center justify-center shrink-0`}
        >
          {node.status === "completed" && (
            <Check className="w-4 h-4 text-white" />
          )}
          {node.status === "current" && (
            <div className="w-3 h-3 bg-white rounded-full" />
          )}
        </div>

        <Card className="flex-grow">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{node.title}</CardTitle>
                <CardDescription>{node.description}</CardDescription>
              </div>
              {node.children && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      {node.children && isExpanded && (
        <div className="ml-12">
          {node.children.map((child) => (
            <RoadmapNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    console.log("Downloading roadmap...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Learning Roadmap</h1>
              <p className="text-muted-foreground">
                Follow this personalized path to achieve your learning goals
              </p>
            </div>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="space-y-6">
            {sampleRoadmap.map((node) => (
              <RoadmapNode key={node.id} node={node} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
