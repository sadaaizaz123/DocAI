import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

# We use the same model for consistency
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def create_vector_store(embeddings):
    """
    Creates a FAISS index for the given embeddings.

    Args:
        embeddings (np.array): A numpy array of document chunk embeddings.

    Returns:
        A FAISS index object.
    """
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def search_vector_store(index, query, k=5):
    """
    Searches the vector store for the most relevant chunks to a query.

    Args:
        index: The FAISS index object.
        query (str): The user's question.
        k (int): The number of top results to retrieve.

    Returns:
        A tuple containing the scores and indices of the most relevant chunks.
    """
    query_embedding = embedding_model.encode([query])
    scores, indices = index.search(query_embedding, k)
    return scores, indices
