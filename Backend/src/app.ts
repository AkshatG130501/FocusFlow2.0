import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import resumeRoutes from "./routes/resumeRoutes";
import roadmapRoutes from "./routes/roadmapRoutes";
import topicContentRoutes from "./routes/topicContentRoutes";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/resume-parser", resumeRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/topic-content", topicContentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
