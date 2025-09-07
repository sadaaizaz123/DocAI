import os
import google.generativeai as genai

def get_gemini_answer(question, context):
    """
    Generates a Q&A answer using the Gemini LLM based on provided context.
    This function is used for answering specific user questions.
    """
    try:
        # Retrieve API key securely
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Error: GEMINI_API_KEY not found. Please set it in your secrets file."
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        # The prompt instructs the AI to be a Q&A assistant and use only the provided context
        prompt = f"""
        You are an expert Q&A assistant. Your task is to answer the user's question based *only* on the provided context from a document.
        
        If the answer is not found in the context, clearly state that. Do not use any external knowledge.
        
        **CONTEXT:**
        ---
        {context}
        ---

        **QUESTION:**
        {question}

        **ANSWER:**
        """
        
        response = model.generate_content(prompt)
        return response.text
        
    except Exception as e:
        return f"An error occurred while interacting with the Gemini API: {e}"

def get_gemini_summary(full_text):
    """
    Generates a summary of the entire document text using the Gemini LLM.
    This is a new function added for the 'Summarize Document' feature.
    """
    try:
        # Retrieve API key securely
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Error: GEMINI_API_KEY not found. Please set it in your secrets file."

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        # The prompt instructs the AI to act as a summarizer
        prompt = f"""
        You are an expert summarizer. Your task is to provide a concise, professional summary of the following document text.
        Focus on the main ideas, key findings, and important conclusions. The summary should be presented in a clean, easy-to-read format.

        **DOCUMENT TEXT:**
        ---
        {full_text}
        ---

        **SUMMARY:**
        """

        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        return f"An error occurred while generating the summary: {e}"

