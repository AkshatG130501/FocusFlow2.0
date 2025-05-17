"use client";

import { useEffect, useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "@/lib/motion";
import Link from "next/link";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Hero Content */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : -20 
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter mb-6">
              Stay Focused. 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Learn Smarter.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              A distraction-free CS learning platform powered by curated content and personalized roadmaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/questionnaire">
                <Button size="lg" className="rounded-full px-8 py-6 text-base">
                  Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base">
                <PlayCircle className="mr-2 h-5 w-5" /> See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              x: isVisible ? 0 : 20 
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 shadow-xl">
              <img
                src="https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Student focused on learning with FocusFlow"
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
              <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                <div className="bg-green-500 rounded-full h-4 w-4"></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500 h-2 w-2 rounded-full"></div>
                  <div className="h-2 bg-blue-200 dark:bg-blue-700 w-20 rounded-full"></div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="bg-indigo-500 h-2 w-2 rounded-full"></div>
                  <div className="h-2 bg-indigo-200 dark:bg-indigo-700 w-16 rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}