/**
 * Topic Content Routes
 * Handles API endpoints for topic content generation and retrieval
 */

import express from "express";
import {
  generateTopicContent,
  saveTopicContent,
  generateInitialContent,
} from "../services/topicContentService";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * POST /generate-initial/:journeyId
 * Generate content for Day 1 topics and queue the rest
 */
router.post("/generate-initial/:journeyId", async (req, res) => {
  try {
    const { journeyId } = req.params;

    if (!journeyId) {
      return res.status(400).json({ error: "Journey ID is required" });
    }

    // Start the content generation process
    await generateInitialContent(journeyId);

    res.json({
      success: true,
      message: "Content generation started successfully",
    });
  } catch (error: any) {
    console.error("Error starting content generation:", error);
    res.status(500).json({
      error: "Failed to start content generation",
      details: error.message || "Unknown error",
    });
  }
});

/**
 * GET /topic/:topicId
 * Get content for a specific topic
 */
router.get("/topic/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;

    if (!topicId) {
      return res.status(400).json({ error: "Topic ID is required" });
    }

    // Check if topic exists and get its details
    const { data: topic, error: topicError } = await supabase
      .from("topics")
      .select(
        `
        id,
        name,
        topic_content,
        day_id
      `
      )
      .eq("id", topicId)
      .single();

    if (topicError) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // If content already exists, return it
    if (topic.topic_content) {
      return res.json({
        id: topic.id,
        name: topic.name,
        content: topic.topic_content,
        isGenerating: false,
      });
    }

    // Content doesn't exist, get necessary info to generate it
    const { data: day, error: dayError } = await supabase
      .from("days")
      .select(
        `
        day_number,
        journey_id,
        day_summaries (
          summary
        )
      `
      )
      .eq("id", topic.day_id)
      .single();

    if (dayError) {
      return res.status(500).json({ error: "Failed to fetch day information" });
    }

    const { data: journey, error: journeyError } = await supabase
      .from("journeys")
      .select("goal")
      .eq("id", day.journey_id)
      .single();

    if (journeyError) {
      return res
        .status(500)
        .json({ error: "Failed to fetch journey information" });
    }

    // Generate content on-demand
    const content = await generateTopicContent(
      topic.id,
      topic.name,
      journey.goal,
      day.day_number,
      day.day_summaries?.[0]?.summary || ""
    );

    // Save the generated content
    await saveTopicContent(topic.id, content);

    res.json({
      id: topic.id,
      name: topic.name,
      content: content,
      isGenerating: false,
    });
  } catch (error: any) {
    console.error("Error fetching topic content:", error);
    res.status(500).json({
      error: "Failed to fetch topic content",
      details: error.message || "Unknown error",
    });
  }
});

/**
 * GET /status/:journeyId
 * Get content generation status for a journey
 */
router.get("/status/:journeyId", async (req, res) => {
  try {
    const { journeyId } = req.params;

    if (!journeyId) {
      return res.status(400).json({ error: "Journey ID is required" });
    }

    // Get all topics for the journey
    const { data: days, error: daysError } = await supabase
      .from("days")
      .select(
        `
        id,
        day_number,
        topics (
          id,
          name,
          topic_content
        )
      `
      )
      .eq("journey_id", journeyId);

    if (daysError) {
      return res.status(500).json({ error: "Failed to fetch journey topics" });
    }

    // Calculate generation status
    let totalTopics = 0;
    let generatedTopics = 0;

    for (const day of days || []) {
      for (const topic of day.topics || []) {
        totalTopics++;
        if (topic.topic_content) {
          generatedTopics++;
        }
      }
    }

    const percentComplete =
      totalTopics > 0 ? Math.round((generatedTopics / totalTopics) * 100) : 0;

    res.json({
      journeyId,
      totalTopics,
      generatedTopics,
      percentComplete,
      isComplete: totalTopics === generatedTopics && totalTopics > 0,
    });
  } catch (error: any) {
    console.error("Error fetching content generation status:", error);
    res.status(500).json({
      error: "Failed to fetch content generation status",
      details: error.message || "Unknown error",
    });
  }
});

export default router;
