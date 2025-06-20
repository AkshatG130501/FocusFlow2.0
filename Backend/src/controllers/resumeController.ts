/**
 * Resume Controller
 * Handles resume parsing requests
 */

import { Request, Response } from 'express';
import { parseResume } from '../services/resumeParserService';

/**
 * Parse a resume file and return structured data
 * @param req Express request object
 * @param res Express response object
 */
export async function parseResumeFile(req: Request, res: Response): Promise<void> {
  try {
    // Check if file exists in the request
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Get file buffer and type
    const buffer = req.file.buffer;
    const fileType = req.file.mimetype;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(fileType)) {
      res.status(400).json({ error: 'Invalid file type. Please upload a PDF or DOCX file.' });
      return;
    }

    // Parse the resume
    const parsedData = await parseResume(buffer, fileType);

    // Return the parsed data
    res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error in parseResumeFile controller:', error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
}
