"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For GitHub-flavored markdown
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CheckCircle,
  Circle,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { Options } from 'react-markdown';
import UserProfile from "@/components/auth/user-profile";
import { Button } from "@/components/ui/button";
import { Day, Topic, TopicGenerationStatus } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/user-context";

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  isLoading?: boolean;
  isError?: boolean;
  timestamp?: string;
  id?: string;
}

interface StudyLayoutProps {
  children: React.ReactNode;
  topics: Topic[];
  days: Day[];
  currentTopicId?: string;
  isLoading: boolean;
  onSelectTopic: (topicId: string) => void;
  generationStatus: TopicGenerationStatus | null;
}

export default function StudyLayout({
  children,
  topics = [],
  days = [],
  currentTopicId = '',
  isLoading = false,
  onSelectTopic = (topicId: string) => {},
  generationStatus = null,
}: StudyLayoutProps) {
  // Get user context at the top level of the component
  const { userGoal, parsedResumeData } = useUser();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [aiChatOpen, setAiChatOpen] = useState(false);
  
  // Chat State
  const [chatSessionId] = useState(() => `session_${Math.random().toString(36).substr(2, 9)}`);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Load messages from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem(`chat_${chatSessionId}`);
      if (saved) {
        setChatMessages(JSON.parse(saved));
      } else {
        // Initialize with welcome message if no saved messages
        setChatMessages([{
          type: "ai" as const,
          content: "Hi there! I'm your AI study assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
          id: `msg_${Date.now()}`,
        }]);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      // Initialize with error message if loading fails
      setChatMessages([{
        type: "ai" as const,
        content: "I had trouble loading our conversation. Let's start fresh!",
        timestamp: new Date().toISOString(),
        id: `msg_${Date.now()}`,
      }]);
    }
  }, [chatSessionId]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        localStorage.setItem(
          `chat_${chatSessionId}`,
          JSON.stringify(chatMessages)
        );
      } catch (error) {
        console.error('Failed to save chat messages:', error);
      }
    }
  }, [chatMessages, chatSessionId]);
  
  // Load messages from localStorage
  const loadMessages = useCallback((): ChatMessage[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(`chat_${chatSessionId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
    
    // Default welcome message
    return [{
      type: 'ai' as const,
      content: "Hi there! I'm your AI study assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
      id: `msg_${Date.now()}`,
    }];
  }, [chatSessionId]);

  // Load messages on mount
  useEffect(() => {
    setChatMessages(loadMessages());
  }, [loadMessages]);
  
  // Clear chat history
  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      localStorage.removeItem(`chat_${chatSessionId}`);
      setChatMessages([
        {
          type: "ai",
          content: "Hi there! I'm your AI study assistant. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };
  
  // Retry failed message
  const retryMessage = (index: number) => {
    const messageToRetry = chatMessages[index - 1]?.content;
    if (messageToRetry && chatMessages[index - 1]?.type === 'user') {
      setChatMessages(prev => [...prev.slice(0, index)]);
      setInputMessage(messageToRetry);
      // Small delay to ensure state updates before sending
      setTimeout(() => {
        const sendButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (sendButton) sendButton.click();
      }, 100);
    }
  };

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

  // Get the currently selected topic
  const selectedTopic = useMemo(() => 
    topics.find((topic: Topic) => topic.id === currentTopicId),
    [topics, currentTopicId]
  );

  // Process topics by day
  const processTopics = useCallback((daysToProcess: Day[]) => {
    if (!daysToProcess) return {};
    
    return daysToProcess.reduce<Record<string, Topic[]>>((acc, day) => {
      if (!day.topics) return acc;
      
      const dayKey = `Day ${day.dayNumber}`;
      acc[dayKey] = day.topics.map((topic: Topic) => ({
        ...topic,
        content: topic.content || "No description available",
        dayNumber: day.dayNumber,
        daySummary: day.summary,
      }));
      return acc;
    }, {});
  }, []);

  // Filter topics based on search query
  const filteredTopics = useMemo(() => 
    topics.filter((topic) =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [topics, searchQuery]
  );

  // Group the filtered topics by day
  const groupedTopics = useMemo(() => 
    searchQuery ? { "Search Results": filteredTopics } : processTopics(days),
    [searchQuery, filteredTopics, days, processTopics]
  );

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
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      type: 'ai',
      content: '...',
      isLoading: true,
      timestamp: new Date().toISOString(),
    };
    
    setChatMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      const requestBody = {
        message: inputMessage,
        sessionId: chatSessionId,
        currentTopicId: selectedTopic?.id,
        roadmap: {
          title: 'Study Roadmap',
          description: 'Your personalized learning path',
          days: days.map(day => ({
            dayNumber: day.dayNumber,
            summary: day.summary,
            topics: day.topics?.map(topic => ({
              id: topic.id,
              name: topic.name,
              content: topic.content,
              isCompleted: topic.isCompleted
            })) || []
          }))
        },
        userGoal: {
          goal: userGoal || 'Master the selected topics',
          // Add any additional user-specific goal data here
        },
        resume: parsedResumeData ? {
          rawText: parsedResumeData.rawText,
          // Add any other relevant resume fields
        } : undefined,
        currentTopic: selectedTopic ? {
          name: selectedTopic.name,
          description: selectedTopic.description,
          content: selectedTopic.content,
          isCompleted: selectedTopic.isCompleted
        } : undefined
      };

      console.log('Sending request to AI with body:', JSON.stringify(requestBody, null, 2));
      
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Received response status:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}...`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      if (!data || !data.response) {
        throw new Error('Empty or invalid response from AI service');
      }
      
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                content: data.response, 
                isLoading: false,
                timestamp: new Date().toISOString(),
              } 
            : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === loadingMessage.id 
            ? { 
                ...msg, 
                content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
                isLoading: false,
                isError: true,
                timestamp: new Date().toISOString(),
              } 
            : msg
        )
      );
    } finally {
      setIsSending(false);
      
      // Auto-scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-messages-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  }, [inputMessage, isSending, chatSessionId, selectedTopic?.id]);

  // Calculate completed topics and progress
  const completedTopicsCount = useMemo(() => 
    topics.filter((topic: Topic) => topic.isCompleted).length, 
    [topics]
  );
  
  const progressPercentage = useMemo(() => 
    topics.length > 0 ? (completedTopicsCount / topics.length) * 100 : 0,
    [topics.length, completedTopicsCount]
  );
  
  // Filter and group topics based on search query - alternative implementation
  const filteredAndGroupedTopics = useCallback(() => {
    if (!topics.length) return {};

    // If there's a search query, filter across all topics
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = topics.filter(
        (topic: Topic) =>
          topic.name?.toLowerCase().includes(query) ||
          (topic.content?.toLowerCase() || '').includes(query)
      );
      return { "Search Results": filtered };
    }

    // Otherwise, group by days
    return processTopics(days);
  }, [topics, searchQuery, days, processTopics]);

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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <UserProfile />

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
                {completedTopicsCount}/{topics.length} completed
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full w-20 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#51d0de] to-[#bf4aa8] h-full rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {generationStatus && !generationStatus.isComplete && (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-xs">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Generating content: {generationStatus.percentComplete}%</span>
              </div>
            )}
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
                  {Object.entries(filteredAndGroupedTopics()).map(
                    ([day, dayTopics]) => (
                      <div
                        key={day}
                        className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow transition-shadow"
                      >
                        <button
                          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750"
                          onClick={() => toggleDayExpansion(day)}
                        >
                          <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                            {day}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-xs mr-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                              {
                                dayTopics.filter(
                                  (topic: any) => topic.completed
                                ).length
                              }
                              /{dayTopics.length}
                            </span>
                            {expandedDays[day] ? (
                              <ChevronRight className="h-4 w-4 transform rotate-90" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </button>

                        {expandedDays[day] && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="bg-white dark:bg-gray-900"
                            >
                              <div className="p-2 space-y-1">
                                {dayTopics.map((topic: any) => (
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
                    )
                  )}

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
        <AnimatePresence>
          {aiChatOpen && (
            <motion.div
              className="hidden md:flex border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 w-80 flex-col"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">AI Study Assistant</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearChat}
                    disabled={chatMessages.length <= 1}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear Chat
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAiChatOpen(false)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Chat Messages - Scrollable */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar chat-messages-container"
                style={{
                  overscrollBehavior: "contain",
                  maxHeight: "calc(100vh - 180px)",
                }}
              >
                {chatMessages.map((message, index) => (
                  <div 
                    key={message.id || index}
                    className={`${
                      message.type === "ai"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-blue-100 dark:bg-blue-900 ml-auto"
                    } ${
                      message.isError ? 'border border-red-300 dark:border-red-700' : ''
                    } rounded-lg p-3 max-w-[85%]`}
                  >
                    <div className="flex flex-col space-y-1">
                      {message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : message.isError ? (
                        <div className="flex flex-col">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {message.content}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 self-start text-xs h-6 px-2"
                            onClick={() => retryMessage(index)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Try Again
                          </Button>
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert prose-sm max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: (props: any) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline" />
                              ),
                              code: (props: any) => {
                                const isInline = !(props as any).inline;
                                return (
                                  <code 
                                    {...props} 
                                    className={`${isInline ? 'bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded' : 'block bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto'}`} 
                                  />
                                );
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                      {message.timestamp && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 self-end">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
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
                    disabled={!inputMessage.trim() || isSending}
                  >
                    {isSending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
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
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* AI Chat Sidebar - Mobile */}
        <AnimatePresence>
          {aiChatOpen && (
            <>
              {/* Mobile overlay */}
              <motion.div
                className="md:hidden fixed inset-0 bg-black/50 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAiChatOpen(false)}
              />

              {/* Mobile sidebar */}
              <motion.div
                className="md:hidden fixed top-16 bottom-0 right-0 w-[85%] max-w-md bg-white dark:bg-gray-900 shadow-xl z-40 flex flex-col"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
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
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
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
                      disabled={!inputMessage.trim() || isSending}
                    >
                      {isSending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
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
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface SidebarTopicItemProps {
  topic: {
    id: string;
    name: string;
    content: string;
    isCompleted: boolean;
    title?: string;
    description?: string;
    completed?: boolean;
  };
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
        {topic.isCompleted || topic.completed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium truncate",
            topic.isCompleted || topic.completed
              ? "text-gray-500 dark:text-gray-400"
              : ""
          )}
        >
          {topic.title || topic.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
          {topic.description || topic.content || "No description available"}
        </p>
      </div>
    </button>
  );
}
