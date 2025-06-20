/**
 * Roadmap Routes
 * Handles API endpoints for roadmap generation
 */

import express from 'express';
import { generateRoadmap } from '../services/geminiService';

const router = express.Router();

/**
 * POST /generate
 * Generate a personalized roadmap using Gemini AI
 */
router.post('/generate', async (req, res) => {
  try {
    const { goal, resumeText, timelineInDays } = req.body;
    
    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }
    
    // Default to 30 days if timelineInDays is not provided
    const timeline = timelineInDays || 30;
    
    // Generate the roadmap
    const roadmap = await generateRoadmap(goal, resumeText, timeline);
    
    res.json(roadmap);
  } catch (error: any) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ error: error.message || 'Failed to generate roadmap' });
  }
});

export default router;
