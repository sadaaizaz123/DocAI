import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Zap, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function LibraryStats({ documents }) {
  const totalDocs = documents.length;
  const totalSize = documents.reduce((acc, doc) => acc + (doc.file_size || 0), 0);
  const uniqueTypes = [...new Set(documents.map(doc => doc.file_type))].length;
  const totalTags = documents.reduce((acc, doc) => acc + (doc.tags?.length || 0), 0);

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? '< 1 MB' : `${mb.toFixed(1)} MB`;
  };

  const stats = [
    {
      icon: FileText,
      label: "Total Documents",
      value: totalDocs,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Zap,
      label: "File Types",
      value: uniqueTypes,
      color: "text-purple-600", 
      bgColor: "bg-purple-100"
    },
    {
      icon: Calendar,
      label: "Storage Used",
      value: formatSize(totalSize),
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Tag,
      label: "Total Tags",
      value: totalTags,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}