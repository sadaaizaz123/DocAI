import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { User, Bot, Quote, ExternalLink } from "lucide-react";

export default function MessageBubble({ question, isNew = false }) {
  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* User Question */}
      <div className="flex justify-end">
        <div className="flex items-start gap-3 max-w-2xl">
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3">
            <p className="text-sm">{question.question}</p>
          </div>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* AI Answer */}
      <div className="flex justify-start">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <Card className="bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <p className="text-slate-800 leading-relaxed mb-4 whitespace-pre-wrap">
                {question.answer}
              </p>
              
              {/* Sources */}
              {question.sources && question.sources.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Quote className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Sources</span>
                  </div>
                  <div className="space-y-2">
                    {question.sources.map((source, index) => (
                      <div key={index} className="bg-slate-50 rounded-lg p-3 border-l-4 border-blue-500">
                        <p className="text-sm text-slate-700 italic mb-2">
                          "{source.content}"
                        </p>
                        <div className="flex items-center justify-between">
                          {source.page_number && (
                            <Badge variant="outline" className="text-xs">
                              Page {source.page_number}
                            </Badge>
                          )}
                          {source.relevance_score && (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                source.relevance_score > 0.8 ? 'bg-green-50 text-green-700' :
                                source.relevance_score > 0.6 ? 'bg-yellow-50 text-yellow-700' :
                                'bg-gray-50 text-gray-700'
                              }`}
                            >
                              {Math.round(source.relevance_score * 100)}% relevant
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}