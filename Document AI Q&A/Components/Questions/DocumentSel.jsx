import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DocumentSelector({ documents, selectedDocument, onSelectDocument }) {
  const getTypeIcon = (type) => {
    const icons = {
      pdf: "📄",
      text: "📝",
      markdown: "📋",
      html: "🌐",
      other: "📎"
    };
    return icons[type] || icons.other;
  };

  return (
    <div className="w-full md:w-80">
      <Select 
        value={selectedDocument?.id || ""} 
        onValueChange={(value) => {
          const doc = documents.find(d => d.id === value);
          onSelectDocument(doc);
        }}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Select a document">
            {selectedDocument && (
              <div className="flex items-center gap-2">
                <span>{getTypeIcon(selectedDocument.file_type)}</span>
                <span className="truncate">{selectedDocument.title}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {documents.map((doc) => (
            <SelectItem key={doc.id} value={doc.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span>{getTypeIcon(doc.file_type)}</span>
                  <div>
                    <p className="font-medium truncate max-w-48">{doc.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(doc.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2 capitalize">
                  {doc.file_type}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}