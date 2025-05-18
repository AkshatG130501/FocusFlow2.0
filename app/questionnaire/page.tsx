"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const suggestedGoals = [
  "SDE-1 at Google",
  "Data Engineer at MNC",
  "Frontend Engineer at a startup",
];

const steps = [
  "Your Goal",
  "Experience Level",
  "Timeframe",
  "Daily Commitment",
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [customDate, setCustomDate] = useState<Date>();
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [customHours, setCustomHours] = useState("");

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    console.log({
      goal,
      experienceLevel,
      timeframe: customDate || timeframe,
      hoursPerDay: customHours || hoursPerDay,
    });
    router.push("/roadmap");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-900/40 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">
            🚀 Build Your Learning Path
          </h1>
          <p className="text-muted-foreground mt-1">
            Step {currentStep} of 4 – {steps[currentStep - 1]}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white/70 backdrop-blur-md shadow-xl dark:bg-black/20 border border-white/30">
            <CardHeader>
              <CardTitle className="text-xl">
                {steps[currentStep - 1]}
              </CardTitle>
              <CardDescription>
                Let’s get to know your preferences better.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Label htmlFor="goal">
                      What goal do you want to achieve?
                    </Label>
                    <Input
                      id="goal"
                      placeholder="e.g., Become a frontend developer"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Suggested:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedGoals.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => setGoal(suggestion)}
                            className="hover:bg-indigo-100 dark:hover:bg-indigo-900"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Label>What is your experience level?</Label>
                    <RadioGroup
                      value={experienceLevel}
                      onValueChange={setExperienceLevel}
                      className="space-y-2"
                    >
                      {["beginner", "intermediate", "advanced"].map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={level} id={level} />
                          <Label htmlFor={level} className="capitalize">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Label>How much time do you need?</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">1 Month</SelectItem>
                        <SelectItem value="3months">3 Months</SelectItem>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="custom">Custom Date</SelectItem>
                      </SelectContent>
                    </Select>

                    {timeframe === "custom" && (
                      <div>
                        <Label>Select custom end date</Label>
                        <Calendar
                          mode="single"
                          selected={customDate}
                          onSelect={setCustomDate}
                          className="rounded-md border mt-2"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Label>How many hours can you devote per day?</Label>
                    <Select value={hoursPerDay} onValueChange={setHoursPerDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>

                    {hoursPerDay === "custom" && (
                      <div>
                        <Label htmlFor="customHours">Enter custom hours</Label>
                        <Input
                          id="customHours"
                          type="number"
                          min="1"
                          max="24"
                          placeholder="Enter hours"
                          value={customHours}
                          onChange={(e) => setCustomHours(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button onClick={handleNext} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="ml-auto">
                    🎯 Create My Roadmap
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
