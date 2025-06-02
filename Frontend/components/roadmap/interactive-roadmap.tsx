"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoadmapItem } from "@/lib/types";
import { CheckCircle, Circle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface InteractiveRoadmapProps {
  items: RoadmapItem[];
  onToggleComplete: (id: string) => void;
}

// Week Box Component
function WeekBox({ 
  item, 
  index, 
  isExpanded, 
  onToggleComplete, 
  onToggleExpand 
}: { 
  item: RoadmapItem; 
  index: number; 
  isExpanded: boolean; 
  onToggleComplete: (id: string) => void; 
  onToggleExpand: (id: string) => void; 
}) {
  // Calculate progress
  const completedTopics = item.topics.filter(topic => topic.completed).length;
  const progress = (completedTopics / item.topics.length) * 100;
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-2xl font-bold text-gray-800">Week{index}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6 w-6 hover:bg-transparent"
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
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </motion.div>
        </Button>
      </div>
      
      <p className="text-sm text-gray-600 mb-auto">
        {item.description}
      </p>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-700">
            Progress
          </span>
          <span className="text-xs font-medium text-gray-700">
            {completedTopics}/{item.topics.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-green-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white rounded-lg shadow-md absolute top-full left-0 right-0 mt-2 p-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[300px] overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Topics:</h4>
              <ul className="space-y-3">
                {item.topics.map((topic) => (
                  <motion.li 
                    key={topic.id} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mt-0.5">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {topic.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-400" />
                        )}
                      </motion.div>
                    </div>
                    <div className="ml-2">
                      <p className={cn(
                        "text-sm font-medium text-gray-800",
                        topic.completed ? "text-gray-400 line-through" : ""
                      )}>
                        {topic.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {topic.description}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(item.id);
                }}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InteractiveRoadmap({ items, onToggleComplete }: InteractiveRoadmapProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  };
  
  const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: "easeInOut" 
      }
    }
  };
  
  const arrowHeadVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.8,
        duration: 0.3, 
        type: "spring",
        stiffness: 200
      }
    }
  };
  
  // Toggle expanded item
  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  
  // Calculate progress for each item
  const getProgress = (item: RoadmapItem) => {
    const completedTopics = item.topics.filter(topic => topic.completed).length;
    return (completedTopics / item.topics.length) * 100;
  };

  return (
    <div className="relative py-10 px-4 min-h-[600px]">
      <motion.div
        className="relative max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* SVG paths for connecting lines */}
        <svg className="absolute inset-0 w-full h-full z-0 overflow-visible" 
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>
          
          {items.length > 1 && (
            <>
              {/* Week 1 to Week 2 */}
              <g>
                <motion.path
                  d={`M 350 100 L 780 100 L 780 230`}
                  stroke="#000"
                  strokeWidth="2"
                  fill="transparent"
                  variants={lineVariants}
                  custom={0}
                />
                {/* Arrow head */}
                <motion.g
                  variants={arrowHeadVariants}
                  custom={0}
                >
                  <polygon 
                    points="780,240 775,230 785,230" 
                    fill="#000"
                  />
                </motion.g>
              </g>
              
              {/* Week 2 to Week 3 */}
              <g>
                <motion.path
                  d={`M 560 350 L 180 350 L 180 480`}
                  stroke="#000"
                  strokeWidth="2"
                  fill="transparent"
                  variants={lineVariants}
                  custom={1}
                />
                {/* Arrow head */}
                <motion.g
                  variants={arrowHeadVariants}
                  custom={1}
                >
                  <polygon 
                    points="180,490 175,480 185,480" 
                    fill="#000"
                  />
                </motion.g>
              </g>
              
              {/* Week 3 to Week 4 */}
              {items.length > 3 && (
                <g>
                  <motion.path
                    d={`M 350 570 L 780 570 L 780 700`}
                    stroke="#000"
                    strokeWidth="2"
                    fill="transparent"
                    variants={lineVariants}
                    custom={2}
                  />
                  {/* Arrow head */}
                  <motion.g
                    variants={arrowHeadVariants}
                    custom={2}
                  >
                    <polygon 
                      points="780,710 775,700 785,700" 
                      fill="#000"
                    />
                  </motion.g>
                </g>
              )}
            </>
          )}
        </svg>
        
        {/* Week boxes */}
        <div className="grid grid-cols-1 gap-8">
          {/* Week 1 - Top left */}
          {items.length > 0 && (
            <div className="flex justify-start">
              <motion.div
                className="w-[350px] h-[200px] bg-[#7FDFD4] rounded-lg shadow-lg p-6 relative z-10"
                variants={itemVariants}
                whileHover="hover"
                onClick={() => toggleExpand(items[0].id)}
                style={{ marginLeft: '0px', marginTop: '0px' }}
              >
                <WeekBox 
                  item={items[0]} 
                  index={1} 
                  isExpanded={expandedItem === items[0].id}
                  onToggleComplete={onToggleComplete}
                  onToggleExpand={toggleExpand}
                />
              </motion.div>
            </div>
          )}
          
          {/* Week 2 - Top right */}
          {items.length > 1 && (
            <div className="flex justify-end">
              <motion.div
                className="w-[350px] h-[200px] bg-[#7FDFD4] rounded-lg shadow-lg p-6 relative z-10"
                variants={itemVariants}
                whileHover="hover"
                onClick={() => toggleExpand(items[1].id)}
                style={{ marginRight: '0px', marginTop: '40px' }}
              >
                <WeekBox 
                  item={items[1]} 
                  index={2} 
                  isExpanded={expandedItem === items[1].id}
                  onToggleComplete={onToggleComplete}
                  onToggleExpand={toggleExpand}
                />
              </motion.div>
            </div>
          )}
          
          {/* Week 3 - Bottom left */}
          {items.length > 2 && (
            <div className="flex justify-start">
              <motion.div
                className="w-[350px] h-[200px] bg-[#7FDFD4] rounded-lg shadow-lg p-6 relative z-10"
                variants={itemVariants}
                whileHover="hover"
                onClick={() => toggleExpand(items[2].id)}
                style={{ marginLeft: '0px', marginTop: '40px' }}
              >
                <WeekBox 
                  item={items[2]} 
                  index={3} 
                  isExpanded={expandedItem === items[2].id}
                  onToggleComplete={onToggleComplete}
                  onToggleExpand={toggleExpand}
                />
              </motion.div>
            </div>
          )}
          
          {/* Week 4 - Bottom right */}
          {items.length > 3 && (
            <div className="flex justify-end">
              <motion.div
                className="w-[350px] h-[200px] bg-[#7FDFD4] rounded-lg shadow-lg p-6 relative z-10"
                variants={itemVariants}
                whileHover="hover"
                onClick={() => toggleExpand(items[3].id)}
                style={{ marginRight: '0px', marginTop: '40px' }}
              >
                <WeekBox 
                  item={items[3]} 
                  index={4} 
                  isExpanded={expandedItem === items[3].id}
                  onToggleComplete={onToggleComplete}
                  onToggleExpand={toggleExpand}
                />
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
