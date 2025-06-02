"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  Target,
  Menu,
  X,
} from "lucide-react";
import GoalInput from "./goal-input";
import OnboardingModal from "../onboarding/onboarding-modal";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function LandingPage() {
  const [goal, setGoal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGoalSubmit = () => {
    if (goal.trim()) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Wait a bit before resetting the goal to avoid UI flicker
    setTimeout(() => {
      setGoal("");
    }, 300);
  };

  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Personalized Learning",
      description:
        "AI-tailored study plans based on your specific goals and experience level",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-secondary" />,
      title: "Comprehensive Resources",
      description:
        "Access to curated learning materials, practice exercises, and assessments",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-accent" />,
      title: "Adaptive Progress Tracking",
      description:
        "Smart tracking of your learning journey with personalized recommendations",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              FocusFlow
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6 text-sm font-medium">
              <a
                href="#features"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-foreground/80 hover:text-primary transition-colors"
              >
                How It Works
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <ModeToggle />
              <Button className="bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
                Sign In with Google
              </Button>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden" variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      FocusFlow
                    </span>
                  </div>
                  <ModeToggle />
                </div>

                <nav className="flex flex-col space-y-4 text-lg font-medium mb-8">
                  <a
                    href="#features"
                    className="text-foreground/80 hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-foreground/80 hover:text-primary transition-colors"
                  >
                    How It Works
                  </a>
                </nav>

                <Button className="bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 w-full mt-auto">
                  Sign In with Google
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-[15vh] container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                  Master New Skills
                </span>{" "}
                With AI-Powered Learning
              </h1>
              <p className="text-xl mb-8 text-foreground/80 mx-auto">
                Enter your learning goal and let our AI create a customized
                study plan tailored just for you.
              </p>

              <GoalInput
                goal={goal}
                setGoal={setGoal}
                onSubmit={handleGoalSubmit}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 md:py-32 bg-muted/50 mt-16 md:mt-24"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose FocusFlow
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Our AI-powered platform adapts to your learning style and goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-primary/10 dark:bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Three simple steps to start your personalized learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  number: "01",
                  title: "Define Your Goal",
                  description: "Tell us what you want to learn or achieve",
                },
                {
                  number: "02",
                  title: "Get Your Plan",
                  description: "Receive a customized learning roadmap",
                },
                {
                  number: "03",
                  title: "Start Learning",
                  description: "Follow your plan with guided resources",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center relative"
                >
                  <div className="text-5xl font-bold text-primary/20 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70">{step.description}</p>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent transform translate-x-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <BrainCircuit className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">FocusFlow</span>
              </div>
              <p className="text-foreground/70 max-w-md">
                Personalized AI-driven learning platform to help you achieve
                your career and educational goals.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Features
                  </li>
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Roadmaps
                  </li>
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Pricing
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    About Us
                  </li>
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Contact
                  </li>
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Blog
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Privacy Policy
                  </li>
                  <li className="hover:text-primary cursor-pointer transition-colors">
                    Terms of Service
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-foreground/60">
            <p>© {new Date().getFullYear()} FocusFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <OnboardingModal goal={goal} onClose={handleModalClose} />
      )}
    </div>
  );
}
