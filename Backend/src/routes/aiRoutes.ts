import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const router = express.Router();

// Initialize the Gemini API client with proper error handling
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables");
  throw new Error("GEMINI_API_KEY is required");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Use the correct model name as defined in geminiService.ts
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post("/simplify", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const prompt = `As an expert educator, simplify the following text to make it more accessible 
and easier to understand. Maintain the key concepts but use simpler language and shorter sentences.
Break it down into bullet points if it helps clarity.

Original text: "${text}"

Guidelines:
- Use clear, everyday language
- Keep technical terms only if essential
- Break long sentences into shorter ones
- Maintain the original meaning
- Add examples where helpful

Simplified version:`;

    // Generate content using the correct model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplified = response.text();

    res.json({ simplified });
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Failed to simplify text",
      details: error.message || "Unknown error",
    });
  }
});

export default router;
