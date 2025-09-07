import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, MessageSquare, FileText, Calendar, Tag, Hash } from "lucide-react";
import { format } from "date-fns";

export default function DocumentDetails({ document }) {
  if (!document) {
    return (
      <Card className="h-fit">
        <CardContent className="p-6 text-center">
          <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3" />
          <p className="text-slate-600">
            Select a document to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5" />
            Document Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">{document.title}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                {document.file_type.toUpperCase()}
              </Badge>
              <span className="text-sm text-slate-500">
                {formatFileSize(document.file_size || 0)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">
                Added {format(new Date(document.created_date), 'MMM d, yyyy')}
              </span>
            </div>

            {document.chunks && (
              <div className="flex items-center gap-2 text-sm">
                <Hash className="w-4 h-4 text-slate-500" />
                <span className="text-slate-600">
                  {document.chunks.length} content chunks
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              asChild
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <a href={`/Questions?doc=${document.id}`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Questions
              </a>
            </Button>

            <Button 
              variant="outline" 
              asChild
              className="w-full"
            >
              <a 
                href={document.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {document.summary && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 leading-relaxed">
              {document.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="w-5 h-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Preview */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <p className="text-sm text-slate-600 leading-relaxed">
              {document.content.substring(0, 500)}
              {document.content.length > 500 && '...'}
            </p>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}