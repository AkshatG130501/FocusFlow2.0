"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, File, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
}

export default function ResumeUpload({ resumeFile, setResumeFile }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    setResumeFile(file);
  };

  const removeFile = () => {
    setResumeFile(null);
  };

  return (
    <div className="w-full">
      {!resumeFile ? (
        <div
          className={`border border-dashed rounded-lg p-6 transition-colors ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-secondary/10 p-3 rounded-full mb-4">
              <Upload className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-sm font-medium mb-1">Drag and drop your resume here</p>
            <p className="text-xs text-muted-foreground mb-4">PDF or DOCX, up to 5MB</p>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-border/80 hover:border-primary/50 hover:bg-primary/5"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              Browse Files
            </Button>
            <input
              id="resume-upload"
              type="file"
              className="hidden"
              accept=".pdf,.docx"
              onChange={handleFileInput}
            />
          </div>
        </div>
      ) : (
        <motion.div 
          className="bg-muted/50 border border-border/50 rounded-lg p-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div className="bg-secondary/10 p-2 rounded-md mr-3">
              <File className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium truncate max-w-[200px]">{resumeFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(resumeFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-secondary" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}