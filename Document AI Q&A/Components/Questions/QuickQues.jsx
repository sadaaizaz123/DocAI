import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickQuestions({ documentTitle, onQuestionSelect }) {
  const getQuickQuestions = (title) => {
    const genericQuestions = [
      "What are the main topics covered in this document?",
      "Can you provide a summary of the key points?",
      "What are the most important conclusions or recommendations?",
      "Are there any specific terms or concepts I should understand?",
    ];

    // Add document-specific questions based on title keywords
    const specificQuestions = [];
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('report') || titleLower.includes('analysis')) {
      specificQuestions.push("What methodology was used in this analysis?");
      specificQuestions.push("What are the key findings and recommendations?");
    }
    
    if (titleLower.includes('manual') || titleLower.includes('guide')) {
      specificQuestions.push("What are the step-by-step instructions?");
      specificQuestions.push("Are there any prerequisites or requirements?");
    }
    
    if (titleLower.includes('research') || titleLower.includes('study')) {
      specificQuestions.push("What research methods were employed?");
      specificQuestions.push("What are the main conclusions of this research?");
    }

    return [...specificQuestions, ...genericQuestions].slice(0, 4);
  };

  const quickQuestions = getQuickQuestions(documentTitle);

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Suggested Questions</h3>
        </div>
        <div className="grid gap-3">
          {quickQuestions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                onClick={() => onQuestionSelect(question)}
                className="h-auto p-3 text-left justify-start w-full bg-white/60 hover:bg-white/80 border border-transparent hover:border-blue-200 transition-all duration-200"
              >
                <span className="text-sm text-slate-700 leading-relaxed">
                  {question}
                </span>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}