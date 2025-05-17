"use client";

import { useEffect, useState } from "react";
import { motion } from "@/lib/motion";
import { Youtube, Check, X } from "lucide-react";

export default function ProblemSolution() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("problem-solution");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem-solution" className="py-16 lg:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why You Need FocusFlow
          </h2>
          <p className="text-lg text-muted-foreground">
            Learning online is chaotic. We make it focused and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Problem */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 20,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="absolute top-0 right-0 bg-red-500/10 p-2 rounded-bl-lg">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex items-center mb-6">
              <Youtube className="h-8 w-8 mr-3 text-red-500" />
              <h3 className="text-xl font-semibold">The YouTube Problem</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              YouTube is great... but also a trap. You waste hours jumping between videos, 
              get distracted by recommendations, and lose focus with no clear path.
            </p>
            <ul className="space-y-3">
              {[
                "Overwhelming number of videos",
                "Distracting recommendations",
                "No structured learning path",
                "Time wasted on irrelevant content",
                "Inconsistent quality",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <X className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
              <p className="text-sm italic text-red-700 dark:text-red-400">
                "I spent 3 hours on YouTube but barely learned anything useful."
              </p>
            </div>
          </motion.div>

          {/* Solution */}
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isVisible ? 1 : 0,
              y: isVisible ? 0 : 20,
            }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 bg-green-500/10 p-2 rounded-bl-lg">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 mr-3 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h3 className="text-xl font-semibold">The FocusFlow Solution</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              FocusFlow gives you a clean, curated, and time-bound journey — 
              no distractions, just structured learning paths tailored to your goals.
            </p>
            <ul className="space-y-3">
              {[
                "Curated, high-quality content only",
                "Distraction-free interface",
                "Personalized learning roadmaps",
                "Time-efficient learning sessions",
                "Progress tracking & accountability",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <Check className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <p className="text-sm italic text-green-700 dark:text-green-400">
                "I completed my React learning path in just 2 weeks with FocusFlow!"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}