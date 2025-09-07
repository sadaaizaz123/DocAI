import React, { useState, useCallback } from "react";
import { Document } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, FileText, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

import FileDropZone from "../components/upload/FileDropZone";
import ProcessingStatus from "../components/upload/ProcessingStatus";
import DocumentPreview from "../components/upload/DocumentPreview";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      file.type === "application/pdf" ||
      file.type === "text/plain" ||
      file.type === "text/markdown" ||
      file.type === "text/html" ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );

    if (validFiles.length === 0) {
      setError("Please upload supported file types: PDF, TXT, MD, HTML");
      return;
    }

    if (validFiles.length !== newFiles.length) {
      setError("Some files were skipped. Only PDF, TXT, MD, HTML files are supported.");
    } else {
      setError(null);
    }

    setFiles(prev => [...prev, ...validFiles]);
    setProcessing(prev => [...prev, ...Array(validFiles.length).fill(false)]);
    setProgress(prev => [...prev, ...Array(validFiles.length).fill(0)]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setProcessing(prev => prev.filter((_, index) => index !== indexToRemove));
    setProgress(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const processFile = async (file, index) => {
    setProcessing(prev => {
      const newProcessing = [...prev];
      newProcessing[index] = true;
      return newProcessing;
    });

    try {
      // Update progress
      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 20;
        return newProgress;
      });

      // Upload file
      const { file_url } = await UploadFile({ file });
      
      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 40;
        return newProgress;
      });

      // Extract content
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            content: { type: "string" },
            title: { type: "string" }
          }
        }
      });

      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 70;
        return newProgress;
      });

      let content = "";
      let title = file.name;

      if (extractResult.status === "success" && extractResult.output) {
        content = extractResult.output.content || "";
        title = extractResult.output.title || file.name;
      }

      // Generate summary and chunks
      const summaryResult = await InvokeLLM({
        prompt: `Please analyze this document and provide:
        1. A concise summary (2-3 sentences)
        2. Suggested tags for categorization
        3. Split the content into meaningful chunks for better retrieval

        Document Title: ${title}
        Content: ${content}

        Please structure your response as JSON.`,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            chunks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  page_number: { type: "number" },
                  chunk_index: { type: "number" }
                }
              }
            }
          }
        }
      });

      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 90;
        return newProgress;
      });

      // Create document record
      await Document.create({
        title: title.replace(/\.[^/.]+$/, ""), // Remove file extension
        file_url,
        content,
        file_type: file.type.includes('pdf') ? 'pdf' : 
                   file.type.includes('markdown') || file.name.endsWith('.md') ? 'markdown' :
                   file.type.includes('html') ? 'html' :
                   file.type.includes('text') ? 'text' : 'other',
        file_size: file.size,
        summary: summaryResult.summary || "",
        tags: summaryResult.tags || [],
        chunks: summaryResult.chunks || []
      });

      setProgress(prev => {
        const newProgress = [...prev];
        newProgress[index] = 100;
        return newProgress;
      });

      setSuccess(`Successfully processed "${title}"`);
      
      // Remove processed file after a delay
      setTimeout(() => {
        removeFile(index);
      }, 2000);

    } catch (error) {
      console.error("Error processing file:", error);
      setError(`Error processing ${file.name}. Please try again.`);
    }

    setProcessing(prev => {
      const newProcessing = [...prev];
      newProcessing[index] = false;
      return newProcessing;
    });
  };

  const processAllFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (!processing[i] && progress[i] !== 100) {
        await processFile(files[i], i);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Upload Documents</h1>
              <p className="text-slate-600">Add documents to your intelligent knowledge base</p>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Upload className="w-6 h-6" />
                Add New Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileDropZone 
                onDrop={handleDrop}
                onDrag={handleDrag}
                onFileSelect={handleFileInput}
                dragActive={dragActive}
              />
            </CardContent>
          </Card>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Files to Process ({files.length})</CardTitle>
                      <Button 
                        onClick={processAllFiles}
                        disabled={processing.some(p => p)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {processing.some(p => p) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Process All
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProcessingStatus 
                      files={files}
                      processing={processing}
                      progress={progress}
                      removeFile={removeFile}
                      processFile={processFile}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <DocumentPreview />
        </div>
      </div>
    </div>
  );
}