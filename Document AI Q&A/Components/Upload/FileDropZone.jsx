import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, MousePointer } from "lucide-react";

export default function FileDropZone({ onDrop, onDrag, onFileSelect, dragActive }) {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
        dragActive 
          ? "border-blue-400 bg-blue-50 scale-105" 
          : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,.html"
        onChange={onFileSelect}
        className="hidden"
      />
      
      <div className="text-center">
        <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-200 ${
          dragActive ? 'bg-blue-100' : 'bg-slate-100'
        }`}>
          <Upload className={`w-10 h-10 transition-colors duration-200 ${
            dragActive ? 'text-blue-600' : 'text-slate-500'
          }`} />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          {dragActive ? 'Drop your files here' : 'Upload Documents'}
        </h3>
        
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Drag and drop your files here, or click the button below to browse.
          Supports PDF, TXT, Markdown, and HTML files.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Button
            type="button"
            onClick={handleBrowseClick}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
          >
            <MousePointer className="w-5 h-5 mr-2" />
            Browse Files
          </Button>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>TXT</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Markdown</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>HTML</span>
            </div>
          </div>
        </div>
      </div>

      {dragActive && (
        <div className="absolute inset-0 rounded-xl bg-blue-500/10 pointer-events-none"></div>
      )}
    </div>
  );
}