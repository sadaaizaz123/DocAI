{
  "name": "Document",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Document title"
    },
    "file_url": {
      "type": "string",
      "description": "URL of the uploaded document"
    },
    "content": {
      "type": "string",
      "description": "Extracted text content from the document"
    },
    "file_type": {
      "type": "string",
      "enum": [
        "pdf",
        "text",
        "markdown",
        "html",
        "other"
      ],
      "description": "Type of the uploaded document"
    },
    "file_size": {
      "type": "number",
      "description": "File size in bytes"
    },
    "chunks": {
      "type": "array",
      "description": "Document content split into chunks for better retrieval",
      "items": {
        "type": "object",
        "properties": {
          "content": {
            "type": "string"
          },
          "page_number": {
            "type": "number"
          },
          "chunk_index": {
            "type": "number"
          }
        }
      }
    },
    "summary": {
      "type": "string",
      "description": "AI-generated summary of the document"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags for categorizing documents"
    }
  },
  "required": [
    "title",
    "file_url",
    "content",
    "file_type"
  ]
}