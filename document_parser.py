import fitz  # PyMuPDF

def extract_text_from_pdf(file_stream):
    """
    Extracts text from an uploaded PDF file stream.

    Args:
        file_stream: A file-like object (e.g., from st.file_uploader).

    Returns:
        A string containing the extracted text.
    """
    try:
        # Open the PDF directly from the in-memory bytes stream
        pdf_document = fitz.open(stream=file_stream.read(), filetype="pdf")
        full_text = ""
        for page in pdf_document:
            full_text += page.get_text() + "\n" # Add a newline after each page
        pdf_document.close()
        return full_text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_txt(file_stream):
    """
    Extracts text from a plain text file.
    """
    return file_stream.read().decode("utf-8")
