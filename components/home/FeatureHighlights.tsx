"use client";

import { useEffect, useState } from "react";
import { motion } from "@/lib/motion";
import { 
  Video, Calendar, Edit3, BarChart3, Bot, Users, Bookmark, Award
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Curated Video Content",
    description: "Handpicked educational videos from the best creators, organized to maximize learning efficiency.",
    color: "blue",
  },
  {
    icon: Calendar,
    title: "Personalized Roadmap",
    description: "AI-generated learning paths tailored to your career goals, skill level, and available time.",
    color: "indigo",
  },
  {
    icon: Edit3,
    title: "In-app Note Taking",
    description: "Take notes while watching videos, with automatic timestamps for easy reference later.",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Progress Tracker & Streaks",
    description: "Track your learning journey with detailed progress metrics and maintain a daily streak.",
    color: "pink",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get help with concepts, problems, and personalized recommendations for your learning path.",
    badge: "Coming Soon",
    color: "orange",
  },
  {
    icon: Users,
    title: "Creator Uploads",
    description: "Educators can upload original content directly to the platform for their students.",
    badge: "Coming Soon",
    color: "amber",
  },
  {
    icon: Bookmark,
    title: "Bookmark & Resume",
    description: "Save your place in any video or learning path and pick up exactly where you left off.",
    color: "emerald",
  },
  {
    icon: Award,
    title: "Skill Certifications",
    description: "Earn certificates when you complete paths, validated by skill assessments.",
    color: "teal",
  },
];

export default function FeatureHighlights() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("features");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Features to Enhance Your Learning
          </h2>
          <p className="text-lg text-muted-foreground">
            Tools designed to keep you engaged and productive
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isVisible ? 1 : 0,
                  y: isVisible ? 0 : 20,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: Math.min(index * 0.1, 0.5),
                }}
              >
                {feature.badge && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {feature.badge}
                    </span>
                  </div>
                )}
                <div className={`mb-4 p-3 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/20`}>
                  <FeatureIcon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}