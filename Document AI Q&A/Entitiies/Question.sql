{
  "name": "Question",
  "type": "object",
  "properties": {
    "document_id": {
      "type": "string",
      "description": "ID of the document this question relates to"
    },
    "question": {
      "type": "string",
      "description": "The user's question"
    },
    "answer": {
      "type": "string",
      "description": "The generated answer"
    },
    "sources": {
      "type": "array",
      "description": "Source citations used in the answer",
      "items": {
        "type": "object",
        "properties": {
          "content": {
            "type": "string"
          },
          "page_number": {
            "type": "number"
          },
          "relevance_score": {
            "type": "number"
          }
        }
      }
    },
    "session_id": {
      "type": "string",
      "description": "Session ID for grouping related questions"
    }
  },
  "required": [
    "document_id",
    "question",
    "answer"
  ]
}