import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare } from "lucide-react";

export default function DocumentPreview() {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-r from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="w-6 h-6 text-purple-600" />
          What happens next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-slate-900">Document Analysis</p>
              <p className="text-sm text-slate-600">
                AI extracts and analyzes content, creates smart chunks for better retrieval
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-slate-900">Knowledge Base Integration</p>
              <p className="text-sm text-slate-600">
                Document gets added to your searchable knowledge base with AI-generated summary
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-slate-900">Ready for Questions</p>
              <p className="text-sm text-slate-600">
                Ask natural language questions and get accurate answers with citations
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}