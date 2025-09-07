import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default function DocumentCard({ document, onClick, getTypeIcon, getTypeColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer h-full bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
        onClick={() => onClick(document)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{getTypeIcon(document.file_type)}</span>
            <Badge className={`${getTypeColor(document.file_type)} border`}>
              {document.file_type.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {document.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {document.summary && (
              <p className="text-sm text-slate-600 line-clamp-3">
                {document.summary}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(document.created_date), 'MMM d, yyyy')}</span>
            </div>

            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-3 h-3 text-slate-400" />
                {document.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {document.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{document.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}