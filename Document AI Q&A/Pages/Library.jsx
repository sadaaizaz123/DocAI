import React, { useState, useEffect } from "react";
import { Document } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Calendar, ExternalLink, Plus, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import DocumentCard from "../components/library/DocumentCard";
import DocumentDetails from "../components/library/DocumentDetails";
import LibraryStats from "../components/library/LibraryStats";

export default function LibraryPage() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setIsLoading(true);
    const docs = await Document.list('-created_date');
    setDocuments(docs);
    setIsLoading(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || doc.file_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

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

  const getTypeColor = (type) => {
    const colors = {
      pdf: "bg-red-100 text-red-800 border-red-200",
      text: "bg-blue-100 text-blue-800 border-blue-200",
      markdown: "bg-green-100 text-green-800 border-green-200",
      html: "bg-purple-100 text-purple-800 border-purple-200",
      other: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[type] || colors.other;
  };

  if (documents.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <FileText className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <CardTitle>No Documents Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6">
              Your document library is empty. Start by uploading some documents to build your knowledge base.
            </p>
            <Button onClick={() => window.location.href = '/Upload'} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload First Document
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Document Library</h1>
              <p className="text-slate-600">Manage and explore your knowledge base</p>
            </div>
          </div>

          <LibraryStats documents={documents} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search documents by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-300 bg-white"
            />
          </div>
          <div className="flex gap-2">
            {["all", "pdf", "text", "markdown", "html"].map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={`capitalize ${filterType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.id}
                      document={doc}
                      onClick={() => handleDocumentClick(doc)}
                      getTypeIcon={getTypeIcon}
                      getTypeColor={getTypeColor}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {filteredDocuments.length === 0 && !isLoading && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Documents Found</h3>
                  <p className="text-slate-600">
                    Try adjusting your search terms or filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Document Details Sidebar */}
          <div className="lg:col-span-1">
            <DocumentDetails document={selectedDocument} />
          </div>
        </div>
      </div>
    </div>
  );
}