"use client";

import { useEffect, useState } from "react";
import { motion } from "@/lib/motion";
import { Target, Brain, Route, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Choose your goal",
    description: "Select from career paths like SDE-1, Frontend Dev, or learn specific technologies.",
    color: "bg-blue-500",
  },
  {
    icon: Brain,
    title: "Set your level & time",
    description: "Tell us your experience level and how much time you can commit to learning.",
    color: "bg-indigo-500",
  },
  {
    icon: Route,
    title: "Start your AI roadmap",
    description: "Get a personalized roadmap with curated videos, tasks, and milestones.",
    color: "bg-purple-500",
  },
];

export default function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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

    const element = document.getElementById("how-it-works");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section id="how-it-works" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to transform your learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10 mb-10">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={index}
                className={`relative p-6 rounded-xl ${activeStep === index ? 'bg-white dark:bg-gray-900 shadow-lg' : 'bg-white/50 dark:bg-gray-950/50'} transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 20,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                onClick={() => setActiveStep(index)}
              >
                <div className={`absolute top-0 left-0 h-1 ${step.color} rounded-t-xl transition-all duration-300 ${activeStep === index ? 'w-full' : 'w-1/4'}`}></div>
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-4 p-3 rounded-full ${step.color}/10`}>
                    <StepIcon className={`h-6 w-6 ${step.color.replace('bg-', 'text-')}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demo */}
        <motion.div 
          className="mt-12 lg:mt-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 20,
          }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                React Developer Roadmap
              </h4>
              <div className="text-sm px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                In Progress
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                <div className="text-lg font-semibold">7/14</div>
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                <div className="text-lg font-semibold">15</div>
                <div className="text-xs text-muted-foreground">Days Streak</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-center">
                <div className="text-lg font-semibold">52%</div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-3"></div>
                <div className="flex-1">
                  <div className="h-2 bg-green-200 dark:bg-green-700 rounded-full"></div>
                </div>
                <div className="ml-3 text-sm">Done</div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-blue-500 mr-3"></div>
                <div className="flex-1">
                  <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded-full w-3/4"></div>
                </div>
                <div className="ml-3 text-sm">Current</div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-3"></div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="ml-3 text-sm">Upcoming</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}