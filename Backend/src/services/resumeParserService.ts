/**
 * Resume Parser Service
 * Uses popular Node.js libraries to parse resume files
 */

import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedResumeData } from '../types/resume';

/**
 * Extract text from a PDF file
 * @param buffer PDF file buffer
 * @returns Extracted text
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extract text from a DOCX file
 * @param buffer DOCX file buffer
 * @returns Extracted text
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}



/**
 * Parse a resume file and extract raw text
 * @param buffer File buffer
 * @param fileType MIME type of the file
 * @returns Parsed resume data with raw text only
 */
export async function parseResume(buffer: Buffer, fileType: string): Promise<ParsedResumeData> {
  try {
    // Extract text based on file type
    let text = '';
    
    if (fileType === 'application/pdf') {
      text = await extractTextFromPDF(buffer);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await extractTextFromDOCX(buffer);
    } else {
      throw new Error('Unsupported file type');
    }
    
    // Return parsed data with just the raw text
    return {
      rawText: text
    };
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}
