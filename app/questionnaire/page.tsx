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
import { motion } from "@/lib/motion";

const suggestedGoals = [
  "SDE-1 at Google",
  "Data Engineer at MNC",
  "Frontend Engineer at product based startup",
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

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    // In a real app, we'd save this data
    console.log({
      goal,
      experienceLevel,
      timeframe: customDate || timeframe,
      hoursPerDay: customHours || hoursPerDay,
    });
    
    // Navigate to the roadmap page
    router.push("/roadmap");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Create Your Learning Path</CardTitle>
              <CardDescription>
                Answer a few questions to get your personalized roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Goal */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label htmlFor="goal">What goal do you want to achieve?</Label>
                  <Input
                    id="goal"
                    placeholder="Enter your learning goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Suggested goals:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedGoals.map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => setGoal(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Experience Level */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label>What is your experience level?</Label>
                  <RadioGroup
                    value={experienceLevel}
                    onValueChange={setExperienceLevel}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner">Beginner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced">Advanced</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Timeframe */}
              {currentStep === 3 && (
                <div className="space-y-4">
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
                    <div className="mt-4">
                      <Label>Select custom end date</Label>
                      <Calendar
                        mode="single"
                        selected={customDate}
                        onSelect={setCustomDate}
                        className="rounded-md border"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Hours per Day */}
              {currentStep === 4 && (
                <div className="space-y-4">
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
                      <SelectItem value="custom">Custom hours</SelectItem>
                    </SelectContent>
                  </Select>

                  {hoursPerDay === "custom" && (
                    <div className="mt-4">
                      <Label htmlFor="customHours">Enter custom hours</Label>
                      <Input
                        id="customHours"
                        type="number"
                        min="1"
                        max="24"
                        placeholder="Enter hours"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

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
                    Create My Roadmap
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