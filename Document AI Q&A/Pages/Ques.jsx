
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Document, Question } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, FileText, Quote, Sparkles, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import MessageBubble from "../components/questions/MessageBubble";
import DocumentSelector from "../components/questions/DocumentSelector";
import QuickQuestions from "../components/questions/QuickQuestions";

export default function QuestionsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const loadDocuments = useCallback(async () => {
    const docs = await Document.list('-created_date');
    setDocuments(docs);
    if (docs.length > 0 && !selectedDocument) {
      setSelectedDocument(docs[0]);
    }
  }, [selectedDocument]); // Added selectedDocument to deps

  const loadQuestions = useCallback(async () => {
    if (selectedDocument) {
      const qs = await Question.filter({ document_id: selectedDocument.id }, '-created_date');
      setQuestions(qs);
    }
  }, [selectedDocument]); // Added selectedDocument to deps

  useEffect(() => {
    loadDocuments();
    loadQuestions();
  }, [loadDocuments, loadQuestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [questions]);

  useEffect(() => {
    if (selectedDocument) {
      loadQuestions();
    }
  }, [selectedDocument, loadQuestions]);

  const askQuestion = async (question = currentQuestion) => {
    if (!question.trim() || !selectedDocument) return;

    setIsLoading(true);
    const userQuestion = question.trim();
    setCurrentQuestion("");

    try {
      // Use LLM with document context for RAG-style answering
      const response = await InvokeLLM({
        prompt: `Based on the following document content, answer the user's question. Provide accurate, contextual answers and include relevant quotes or references from the document when possible.

Document Title: ${selectedDocument.title}
Document Content: ${selectedDocument.content}

User Question: ${userQuestion}

Instructions:
1. Answer the question based on the document content
2. Include relevant quotes from the document to support your answer
3. If the answer cannot be found in the document, say so clearly
4. Structure your response to be clear and helpful
5. Include page numbers or section references when available

Format your response as JSON with:
{
  "answer": "Your detailed answer here",
  "sources": [
    {
      "content": "Quote from document",
      "page_number": 1,
      "relevance_score": 0.9
    }
  ],
  "confidence": "high/medium/low"
}`,
        response_json_schema: {
          type: "object",
          properties: {
            answer: { type: "string" },
            sources: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  page_number: { type: "number" },
                  relevance_score: { type: "number" }
                }
              }
            },
            confidence: { type: "string" }
          }
        }
      });

      const questionRecord = await Question.create({
        document_id: selectedDocument.id,
        question: userQuestion,
        answer: response.answer,
        sources: response.sources || [],
        session_id: sessionId
      });

      setQuestions(prev => [...prev, questionRecord]);
    } catch (error) {
      console.error("Error asking question:", error);
    }

    setIsLoading(false);
  };

  const handleQuickQuestion = (question) => {
    setCurrentQuestion(question);
    askQuestion(question);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  if (documents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <BookOpen className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <CardTitle>No Documents Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              Upload some documents first to start asking questions about their content.
            </p>
            <Button onClick={() => window.location.href = '/Upload'} className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Ask Questions</h1>
                <p className="text-slate-600">Get intelligent answers from your documents</p>
              </div>
            </div>
            <DocumentSelector 
              documents={documents}
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
            />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {questions.length === 0 && selectedDocument && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Answer</h3>
                <p className="text-slate-600 mb-6">
                  I've analyzed "{selectedDocument.title}". Ask me anything about this document!
                </p>
                <QuickQuestions 
                  documentTitle={selectedDocument.title}
                  onQuestionSelect={handleQuickQuestion}
                />
              </motion.div>
            )}

            <AnimatePresence>
              {questions.map((q, index) => (
                <MessageBubble 
                  key={q.id} 
                  question={q}
                  isNew={index === questions.length - 1}
                />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl rounded-bl-md shadow-sm border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span className="text-slate-600">Analyzing document and generating answer...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedDocument ? `Ask anything about "${selectedDocument.title}"...` : "Select a document first..."}
                disabled={isLoading || !selectedDocument}
                className="pr-12 h-12 border-slate-300 focus:border-blue-500 bg-white"
              />
              <Button
                onClick={() => askQuestion()}
                disabled={isLoading || !currentQuestion.trim() || !selectedDocument}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          {selectedDocument && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Searching in: {selectedDocument.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}