import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for parsing resume files
 * This endpoint accepts multipart/form-data with a resume file
 * and returns structured data extracted from the resume
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }
    
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Please upload a file smaller than 5MB.' },
        { status: 400 }
      );
    }
    
    // Convert file to buffer for sending to backend
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Send to backend API for parsing
    // In a real implementation, this would be your actual backend API URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001';
    
    const backendResponse = await fetch(`${backendUrl}/api/resume-parser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-file-name': file.name,
        'x-file-type': file.type,
      },
      body: buffer,
    });
    
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to parse resume' },
        { status: backendResponse.status }
      );
    }
    
    // Return the parsed data from the backend
    const parsedData = await backendResponse.json();
    
    return NextResponse.json(parsedData);
    
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
