"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeEditorProps {
  initialCode: string;
  language: string;
}

export default function CodeEditor({ initialCode, language }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Capture console.log output
    const originalConsoleLog = console.log;
    let outputText = "";
    
    console.log = (...args) => {
      const text = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ");
      
      outputText += text + "\n";
    };
    
    try {
      // Execute the code
      const result = new Function(code)();
      
      if (result !== undefined && outputText === "") {
        outputText = String(result);
      }
      
      setOutput(outputText || "Code executed successfully with no output.");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      // Restore original console.log
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex justify-between items-center">
        <Tabs defaultValue={language} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="javascript" className="text-xs px-2 py-1">JavaScript</TabsTrigger>
            <TabsTrigger value="python" className="text-xs px-2 py-1" disabled>Python</TabsTrigger>
            <TabsTrigger value="java" className="text-xs px-2 py-1" disabled>Java</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button 
          size="sm" 
          onClick={runCode} 
          disabled={isRunning}
          className="gap-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="h-3 w-3" />
          Run
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
          <textarea
            value={code}
            onChange={handleCodeChange}
            className="w-full h-80 p-4 font-mono text-sm bg-white dark:bg-gray-900 focus:outline-none"
            spellCheck="false"
          />
        </div>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-800">
          <div className="p-2 text-xs border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 font-medium">
            Output
          </div>
          <pre className="p-4 font-mono text-sm h-72 overflow-auto whitespace-pre-wrap">
            {isRunning ? "Running..." : output}
          </pre>
        </div>
      </div>
    </div>
  );
}