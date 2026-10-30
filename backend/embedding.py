from sentence_transformers import SentenceTransformer

from config import SENTENCE_MODEL

embedding_model = SentenceTransformer(
    SENTENCE_MODEL
)


def generate_embedding(text):

    embedding = embedding_model.encode(
        text,
        convert_to_numpy=True
    )

    return embedding