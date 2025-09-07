import streamlit as st
import os

# Import our modularized functions from the other Python files
from document_parser import extract_text_from_pdf, extract_text_from_txt
from text_processor import chunk_text, get_embeddings
from vector_store_manager import create_vector_store, search_vector_store
from rag_core import get_gemini_answer

# --- 1. Page Configuration ---
st.set_page_config(
    page_title="Basic Q&A App",
    page_icon="📄",
    layout="wide"
)

# --- 2. Title and Description ---
st.title("📄 Basic Document Q&A")
st.markdown("Upload a document and ask questions about its content.")

# --- 3. API Key Management ---
# Securely load the API key from Streamlit's secrets management
try:
    os.environ["GEMINI_API_KEY"] = st.secrets["GEMINI_API_KEY"]
except Exception:
    st.error("GEMINI_API_KEY not found. Please add it to your `.streamlit/secrets.toml` file.")
    st.stop()
        
# --- 4. Session State Initialization ---
# We use session_state to store data so it persists between user interactions.
if 'vector_store' not in st.session_state:
    st.session_state.vector_store = None # Will hold the FAISS vector database
if 'chunks' not in st.session_state:
    st.session_state.chunks = []         # Will hold the document text chunks
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []  # Will hold the conversation history

# --- 5. Sidebar for Document Upload ---
with st.sidebar:
    st.header("Upload Document")
    uploaded_file = st.file_uploader(
        "Choose a PDF or TXT file",
        type=['pdf', 'txt']
    )

    if st.button("Process Document") and uploaded_file:
        with st.spinner("Processing document... This may take a moment."):
            try:
                # Step A: Extract Text
                if uploaded_file.type == "application/pdf":
                    raw_text = extract_text_from_pdf(uploaded_file)
                else: # For text/plain
                    raw_text = extract_text_from_txt(uploaded_file)
                
                if not raw_text or not raw_text.strip():
                    st.error("Failed to extract text. The document might be empty or image-based.")
                else:
                    # Step B: Chunk the text
                    st.session_state.chunks = chunk_text(raw_text)
                    
                    # Step C: Generate embeddings and create the vector store
                    embeddings = get_embeddings(st.session_state.chunks)
                    st.session_state.vector_store = create_vector_store(embeddings)
                    
                    # Reset chat history for the new document
                    st.session_state.chat_history = []
                    st.success("Document processed successfully! You can now ask questions.")

            except Exception as e:
                st.error(f"An error occurred during processing: {e}")

# --- 6. Main Chat Interface ---
st.header("Chat with your Document")

# Display previous chat messages from the session history
for message in st.session_state.chat_history:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Handle new user input
if user_question := st.chat_input("Ask a question..."):
    
    # First, check if a document has been processed
    if st.session_state.vector_store is None:
        st.warning("Please upload and process a document in the sidebar first.")
    else:
        # Add user's question to the chat and history
        st.session_state.chat_history.append({"role": "user", "content": user_question})
        with st.chat_message("user"):
            st.markdown(user_question)

        # Start the RAG process
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                # Step D: Search the vector store for relevant context
                _, indices = search_vector_store(st.session_state.vector_store, user_question, k=3)
                
                if indices is not None and len(indices[0]) > 0:
                    # Step E: Combine the relevant chunks into a context
                    context_chunks = [st.session_state.chunks[i] for i in indices[0]]
                    context = "\n---\n".join(context_chunks)
                    
                    # Step F: Generate the final answer using the LLM
                    answer = get_gemini_answer(user_question, context)
                    st.markdown(answer)
                else:
                    answer = "I'm sorry, I couldn't find any relevant information in the document to answer that question."
                    st.warning(answer)
                
                # Add the AI's answer to the chat history
                st.session_state.chat_history.append({"role": "assistant", "content": answer})

