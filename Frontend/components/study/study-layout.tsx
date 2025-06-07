"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  onSelectTopic,
}: StudyLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { type: "user" | "ai"; content: string }[]
  >([
    {
      type: "ai",
      content:
        "Hi there! I'm your AI study assistant. How can I help you today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Close sidebar on small screens when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group topics by day
  const groupTopicsByDay = () => {
    const days: { [key: string]: Topic[] } = {};

    // Assign topics to days (for demo, we'll distribute them evenly)
    topics.forEach((topic, index) => {
      const dayNumber = Math.floor(index / 2) + 1; // 2 topics per day
      const dayKey = `Day-${dayNumber.toString().padStart(2, "0")}`;

      if (!days[dayKey]) {
        days[dayKey] = [];
      }

      days[dayKey].push(topic);
    });

    return days;
  };

  // Filter topics based on search query
  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group the filtered topics by day
  const groupedTopics = searchQuery
    ? { "Search Results": filteredTopics }
    : groupTopicsByDay();

  // Initialize expanded state for days
  useEffect(() => {
    const days = Object.keys(groupTopicsByDay());
    const initialExpandedState = days.reduce((acc, day) => {
      // By default, expand only the first day
      acc[day] = day === days[0];
      return acc;
    }, {} as { [key: string]: boolean });

    setExpandedDays(initialExpandedState);
  }, [topics.length]);

  // Toggle day expansion
  const toggleDayExpansion = (day: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      { type: "user", content: inputMessage },
    ]);

    // Clear input
    setInputMessage("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I can help you understand that concept better. Let me explain...",
        "That's a great question! Here's what you need to know...",
        "Based on your current topic, I'd recommend focusing on these key points...",
        "Let me find some relevant information for you on that subject.",
        "I'd be happy to help with that. Here's my suggestion...",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((prev) => [
        ...prev,
        { type: "ai", content: randomResponse },
      ]);
    }, 1000);
  };

  const completedTopics = topics.filter((topic) => topic.completed).length;
  const progress =
    topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;

  return (
    <div className="h-screen flex flex-col">
      {" "}
      {/* Changed min-h-screen to h-screen */}
      {/* Header */}
      <header className="h-16 border-b flex-shrink-0 pt-3">
        {" "}
        {/* Added flex-shrink-0 */}
        <div className="flex items-center w-full justify-between container mx-auto">
          <div className="flex items-center">
            {/* Empty div to maintain spacing */}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiChatOpen(!aiChatOpen)}
              className={cn(
                "border-gray-200 dark:border-gray-700",
                aiChatOpen &&
                  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
              )}
            >
              <svg
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 16V16.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  fill="currentColor"
                />
                <path
                  d="M12 8C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7C11 7.55228 11.4477 8 12 8Z"
                  fill="currentColor"
                />
                <path
                  d="M7 12C7 12.5523 6.55228 13 6 13C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11C6.55228 11 7 11.4477 7 12Z"
                  fill="currentColor"
                />
                <path
                  d="M17 12C17 12.5523 16.5523 13 16 13C15.4477 13 15 12.5523 15 12C15 11.4477 15.4477 11 16 11C16.5523 11 17 11.4477 17 12Z"
                  fill="currentColor"
                />
              </svg>
              Ask AI
            </Button>

            <Link href="/roadmap">
              <Button variant="outline" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Roadmap
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
        {" "}
        {/* This is the key change */}
        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
            >
              <motion.div
                className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-white dark:bg-gray-900 shadow-xl flex flex-col"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Fixed header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <div className="relative flex-1 ml-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search topics..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div
                  className="flex-1 overflow-y-auto h-full custom-scrollbar"
                  style={{
                    overscrollBehavior: "contain",
                    maxHeight: "calc(100vh - 120px)",
                  }}
                >
                  <nav className="p-2 space-y-2">
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
                          <div
                            key={i}
                            className="h-10 bg-gray-200 dark:bg-gray-800 rounded"
                          ></div>
                        ))}
                      </div>
                    )}
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Left sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="hidden md:block w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Fixed header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search topics..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto h-full custom-scrollbar"
                style={{
                  overscrollBehavior: "contain",
                  maxHeight: "calc(100vh - 120px)",
                }}
              >
                <nav className="p-2 space-y-2">
                  {Object.entries(groupedTopics).map(([day, dayTopics]) => (
                    <div
                      key={day}
                      className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow"
                    >
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-colors"
                        onClick={() => toggleDayExpansion(day)}
                      >
                        <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                          {day}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-xs mr-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                            {dayTopics.length}
                          </span>
                          {expandedDays[day] ? (
                            <ChevronRight className="h-4 w-4 transform rotate-90 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </button>

                      {expandedDays[day] && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white dark:bg-gray-900"
                          >
                            <div className="p-2 space-y-1">
                              {dayTopics.map((topic) => (
                                <SidebarTopicItem
                                  key={topic.id}
                                  topic={topic}
                                  isActive={topic.id === currentTopicId}
                                  onClick={() => {
                                    onSelectTopic(topic.id);
                                    if (window.innerWidth < 768) {
                                      setMobileSidebarOpen(false);
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="animate-pulse space-y-2 p-2">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 bg-gray-200 dark:bg-gray-800 rounded"
                        ></div>
                      ))}
                    </div>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Main content */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 relative">
          {/* Desktop hamburger menu */}
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-40 hidden md:flex shadow-sm bg-white dark:bg-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          {/* Mobile hamburger menu */}
          <div className="sticky top-0 left-0 h-16 md:hidden flex items-center px-4 z-20 pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
        {/* AI Chat Sidebar - Desktop */}
        {aiChatOpen && (
          <div className="hidden md:flex border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 w-[380px] flex-col h-[calc(100vh-4rem)] fixed right-0 top-16">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
              <h3 className="font-medium">Ask AI Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAiChatOpen(false)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Chat Messages - Scrollable */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ overscrollBehavior: "contain" }}
            >
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.type === "ai"
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-blue-100 dark:bg-blue-900 ml-auto"
                  } rounded-lg p-3 max-w-[85%]`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
              >
                <Input
                  placeholder="Ask a question..."
                  className="pr-12"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  disabled={!inputMessage.trim()}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 2L11 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 2L15 22L11 13L2 9L22 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        )}
        {/* AI Chat Sidebar - Mobile */}
        {aiChatOpen && (
          <>
            {/* Mobile overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setAiChatOpen(false)}
            />

            {/* Mobile sidebar */}
            <div className="md:hidden fixed top-16 bottom-0 right-0 w-[85%] max-w-md bg-white dark:bg-gray-900 shadow-xl z-40 flex flex-col h-[calc(100vh-4rem)]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                <h3 className="font-medium">Ask AI Assistant</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAiChatOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Chat Messages - Scrollable */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ overscrollBehavior: "contain" }}
              >
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`${
                      message.type === "ai"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-blue-100 dark:bg-blue-900 ml-auto"
                    } rounded-lg p-3 max-w-[85%]`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input - Fixed at bottom */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                <form
                  className="relative"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Ask a question..."
                    className="pr-12"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    disabled={!inputMessage.trim()}
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22 2L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}
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
        <p
          className={cn(
            "text-sm font-medium truncate",
            topic.completed ? "text-gray-500 dark:text-gray-400" : ""
          )}
        >
          {topic.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
          {topic.description}
        </p>
      </div>
    </button>
  );
}
