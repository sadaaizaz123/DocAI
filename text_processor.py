from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def chunk_text(text, chunk_size=500, chunk_overlap=50):
    """
    Splits a long text into smaller chunks.

    Args:
        text (str): The input text.
        chunk_size (int): The maximum size of each chunk.
        chunk_overlap (int): The number of characters to overlap between chunks.

    Returns:
        A list of text chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks

def get_embeddings(chunks):
    """
    Generates vector embeddings for a list of text chunks.

    Args:
        chunks (list): A list of text chunks.

    Returns:
        A numpy array of embeddings.
    """
    embeddings = embedding_model.encode(chunks, convert_to_tensor=False)
    return embeddings
