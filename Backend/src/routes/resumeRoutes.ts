/**
 * Resume Routes
 * Defines API routes for resume parsing
 */

import { Router } from 'express';
import multer from 'multer';
import { parseResumeFile } from '../controllers/resumeController';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Route for parsing resumes
router.post('/parse', upload.single('file'), parseResumeFile);

export default router;
