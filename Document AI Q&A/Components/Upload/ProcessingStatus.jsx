import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, ImageIcon, X, CheckCircle, Loader2, Play } from "lucide-react";

export default function ProcessingStatus({ files, processing, progress, removeFile, processFile }) {
  const getFileIcon = (file) => {
    if (file.type === "application/pdf") {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  const getFileSize = (size) => {
    return (size / 1024 / 1024).toFixed(2) + " MB";
  };

  const getStatusBadge = (index) => {
    if (processing[index]) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Processing
        </Badge>
      );
    }
    if (progress[index] === 100) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-slate-600">
        Ready
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <motion.div
          key={`${file.name}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
            processing[index] 
              ? "border-blue-500 bg-blue-50/50" 
              : progress[index] === 100
              ? "border-green-500 bg-green-50/50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-center gap-4 flex-1">
            {getFileIcon(file)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{file.name}</p>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm text-slate-500">{getFileSize(file.size)}</p>
                {getStatusBadge(index)}
              </div>
              {(processing[index] || progress[index] > 0) && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Processing...</span>
                    <span>{progress[index]}%</span>
                  </div>
                  <Progress value={progress[index]} className="h-2" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {!processing[index] && progress[index] !== 100 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => processFile(file, index)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Play className="w-4 h-4 mr-1" />
                Process
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFile(index)}
              disabled={processing[index]}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}