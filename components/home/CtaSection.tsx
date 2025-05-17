"use client";

import { useEffect, useState } from "react";
import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Timer } from "lucide-react";

export default function CtaSection() {
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

    const element = document.getElementById("cta");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="cta" className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 z-0"></div>
      
      {/* Animated circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-400/5 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-400/5 rounded-full translate-x-1/3 translate-y-1/3 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 md:p-12 shadow-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 20,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <Timer className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to take control of your learning?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get your personalized roadmap in 60 seconds and start your focused learning journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" className="rounded-full px-8 py-6 text-base w-full sm:w-auto">
              Start Learning <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base w-full sm:w-auto">
              Explore Features
            </Button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">20,000+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400">50+</p>
                <p className="text-sm text-muted-foreground">Career Paths</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">1,000+</p>
                <p className="text-sm text-muted-foreground">Curated Videos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400">98%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}