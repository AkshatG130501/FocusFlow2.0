"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  BarChart, 
  Calendar, 
  FileText, 
  Code, 
  BookOpen 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Brain />,
    title: "AI-Driven Learning",
    description: "Our AI analyzes your goals and background to create a personalized learning journey just for you."
  },
  {
    icon: <Calendar />,
    title: "Custom Roadmaps",
    description: "Get a day-by-day study plan tailored to your timeline and learning objectives."
  },
  {
    icon: <FileText />,
    title: "Resume Analysis",
    description: "Upload your resume to further personalize your learning experience based on your skills and experience."
  },
  {
    icon: <BookOpen />,
    title: "Comprehensive Content",
    description: "Access curated lessons, practice questions, and resources aligned with your goals."
  },
  {
    icon: <Code />,
    title: "Interactive Practice",
    description: "Test your knowledge with hands-on coding exercises and challenges."
  },
  {
    icon: <BarChart />,
    title: "Progress Tracking",
    description: "Monitor your learning journey with visual progress indicators and completion stats."
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How BrainBoost Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our AI-powered platform transforms how you learn, making it personalized, efficient, and engaging.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-[#51d0de]/10 flex items-center justify-center text-[#51d0de] mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}