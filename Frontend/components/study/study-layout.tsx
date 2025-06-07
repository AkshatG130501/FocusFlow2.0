"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Menu, 
  X, 
  ChevronLeft,
  ChevronRight, 
  LayoutDashboard,
  CheckCircle,
  Circle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Topic } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StudyLayoutProps {
  children: React.ReactNode;
  topics: Topic[];
  currentTopicId?: string;
  isLoading: boolean;
  onSelectTopic: (topicId: string) => void;
}

export default function StudyLayout({ 
  children, 
  topics, 
  currentTopicId,
  isLoading, 
  onSelectTopic 
}: StudyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const completedTopics = topics.filter(topic => topic.completed).length;
  const progress = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;
  
  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 sticky top-0 z-30">
        <div className="flex items-center w-full justify-between container mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link href="/roadmap">
              <Button variant="ghost" size="sm" className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Back to Roadmap
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            
            <div className="bg-gray-100 dark:bg-gray-800 h-8 rounded-full flex items-center px-3">
              <div className="text-xs font-medium whitespace-nowrap mr-2">
                {completedTopics}/{topics.length} completed
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full w-20 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#51d0de] to-[#bf4aa8] h-full rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <motion.div
              className="absolute top-0 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <h2 className="font-semibold">Study Topics</h2>
                <Button variant="ghost" size="icon" onClick={() => setMobileSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search topics..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2">
                  <nav className="space-y-1 pb-4">
                    {filteredTopics.map((topic) => (
                      <SidebarTopicItem 
                        key={topic.id}
                        topic={topic}
                        isActive={topic.id === currentTopicId}
                        onClick={() => {
                          onSelectTopic(topic.id);
                          setMobileSidebarOpen(false);
                        }}
                      />
                    ))}
                    
                    {isLoading && (
                      <div className="animate-pulse space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
                        ))}
                      </div>
                    )}
                  </nav>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Desktop Sidebar */}
        <motion.div 
          className={cn(
            "hidden md:flex relative border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-shadow flex-col overflow-hidden",
            sidebarOpen ? "w-80" : "w-16",
            !sidebarOpen && "shadow-lg"
          )}
          animate={{ width: sidebarOpen ? 320 : 64 }}
          transition={{ duration: 0.2 }}
        >
          {/* Collapse Button - Always visible and centered */}
          <div className="absolute top-1/2 -right-4 z-50 transform -translate-y-1/2">
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full shadow-lg bg-gradient-to-r from-[#51d0de] to-[#bf4aa8] hover:opacity-90 transition-opacity"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-white" />
              ) : (
                <ChevronRight className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>

          {sidebarOpen ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search topics..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-2">
                <nav className="py-2">
                  {filteredTopics.map((topic) => (
                    <SidebarTopicItem 
                      key={topic.id}
                      topic={topic}
                      isActive={topic.id === currentTopicId}
                      onClick={() => onSelectTopic(topic.id)}
                    />
                  ))}
                  
                  {isLoading && (
                    <div className="animate-pulse space-y-2 p-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
                      ))}
                    </div>
                  )}
                </nav>
              </div>
            </div>
          ) : (
            <div className="py-4 overflow-y-auto">
              {filteredTopics.map((topic, index) => (
                <motion.button
                  key={topic.id}
                  className={cn(
                    "w-full p-3 flex justify-center group relative",
                    topic.id === currentTopicId && "bg-gray-100 dark:bg-gray-800"
                  )}
                  onClick={() => onSelectTopic(topic.id)}
                  whileHover={{ scale: 1.1 }}
                >
                  <div 
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-200",
                      topic.id === currentTopicId
                        ? "bg-gradient-to-r from-[#51d0de] to-[#bf4aa8]"
                        : "bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500"
                    )}
                  />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {topic.title}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SidebarTopicItemProps {
  topic: Topic;
  isActive: boolean;
  onClick: () => void;
}

function SidebarTopicItem({ topic, isActive, onClick }: SidebarTopicItemProps) {
  return (
    <button
      className={cn(
        "flex items-start w-full text-left px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-gray-100 dark:bg-gray-800" 
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
      onClick={onClick}
    >
      <div className="mt-0.5 mr-2 flex-shrink-0">
        {topic.completed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-sm font-medium truncate",
          topic.completed ? "text-gray-500 dark:text-gray-400" : ""
        )}>
          {topic.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
          {topic.description}
        </p>
      </div>
    </button>
  );
}