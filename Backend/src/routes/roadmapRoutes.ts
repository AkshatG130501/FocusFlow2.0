/**
 * Roadmap Routes
 * Handles API endpoints for roadmap generation
 */

import express from "express";
import { generateRoadmap } from "../services/geminiService";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /generate
 * Generate a personalized roadmap using Gemini AI
 */
router.post("/generate", async (req, res) => {
  try {
    const { goal, resumeText, timelineInDays } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    // Default to 30 days if timelineInDays is not provided
    const timeline = timelineInDays || 30;

    // Generate the roadmap
    const roadmap = await generateRoadmap(goal, resumeText, timeline);

    res.json(roadmap);
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate roadmap" });
  }
});

router.post("/save", async (req, res) => {
  try {
    const { userId, roadmapItems, userData } = req.body;
    console.log("Saving user data:", { userId, roadmapItems, userData });

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Parse roadmap items and user data
    const parsedRoadmap = JSON.parse(roadmapItems || "{}");
    const goal = userData?.userGoal || "Default Goal";
    const timeline = parseInt(userData?.timeline || "30");
    const resumeData = userData?.resumeData || null;

    // 1. Create journey record
    const { data: journey, error: journeyError } = await supabase
      .from("journeys")
      .insert({
        user_id: userId,
        goal: goal,
        resume: resumeData,
        duration_days: timeline,
        prepType: parsedRoadmap.type || "general",
      })
      .select()
      .single();

    if (journeyError) throw journeyError;

    // 2. Create journey progress
    const { error: progressError } = await supabase
      .from("journey_progress")
      .insert({
        user_id: userId,
        journey_id: journey.id,
        last_visited_day: 1,
      });

    if (progressError) throw progressError;

    // 3. Create days and topics
    if (parsedRoadmap.roadmap) {
      for (let i = 0; i < parsedRoadmap.roadmap.length; i++) {
        const dayItem = parsedRoadmap.roadmap[i];

        // Create day
        const { data: day, error: dayError } = await supabase
          .from("days")
          .insert({
            journey_id: journey.id,
            day_number: i + 1,
          })
          .select()
          .single();

        if (dayError) throw dayError;

        // Create topics for the day
        if (dayItem.topics && dayItem.topics.length > 0) {
          const topicsToInsert = dayItem.topics.map((topic: any) => ({
            day_id: day.id,
            name: topic.title,
            topic_content: topic.content || "",
          }));

          const { error: topicsError } = await supabase
            .from("topics")
            .insert(topicsToInsert);

          if (topicsError) throw topicsError;
        }

        // Create day summary if exists
        if (dayItem.summary) {
          const { error: summaryError } = await supabase
            .from("day_summaries")
            .insert({
              day_id: day.id,
              summary: dayItem.summary,
            });

          if (summaryError) throw summaryError;
        }
      }
    }

    res.json({
      message: "User data saved successfully",
      journeyId: journey.id,
    });
  } catch (error: any) {
    console.error("Error saving user data:", error);
    res.status(500).json({
      error: error.message || "Failed to save user data",
      details: error.details || null,
    });
  }
});

/**
 * GET /roadmap/:journeyId
 * Retrieve a complete roadmap with all related data
 */
router.get("/:journeyId", async (req, res) => {
  try {
    const { journeyId } = req.params;

    // 1. Get journey data
    const { data: journey, error: journeyError } = await supabase
      .from("journeys")
      .select(
        `
        *,
        journey_progress (
          last_visited_day
        ),
        days (
          *,
          topics (
            *
          ),
          day_summaries (
            summary
          )
        )
      `
      )
      .eq("id", journeyId)
      .single();

    if (journeyError) {
      throw journeyError;
    }

    if (!journey) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    // 2. Restructure the data for frontend consumption
    const restructuredRoadmap = {
      id: journey.id,
      goal: journey.goal,
      duration: journey.duration_days,
      prepType: journey.prepType,
      progress: journey.journey_progress?.[0]?.last_visited_day || 1,
      isCompleted: journey.is_completed,
      days: journey.days
        .sort((a: any, b: any) => a.day_number - b.day_number)
        .map((day: any) => ({
          id: day.id,
          dayNumber: day.day_number,
          isCompleted: day.is_completed,
          summary: day.day_summaries?.[0]?.summary || "",
          topics: day.topics.map((topic: any) => ({
            id: topic.id,
            name: topic.name,
            content: topic.topic_content,
            isCompleted: topic.is_completed,
          })),
        })),
    };

    res.json(restructuredRoadmap);
  } catch (error: any) {
    console.error("Error fetching roadmap:", error);
    res.status(500).json({
      error: "Failed to fetch roadmap",
      details: error.message,
    });
  }
});

export default router;
