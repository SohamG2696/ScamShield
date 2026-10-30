import joblib
import pandas as pd
import numpy as np

from config import (
    ENCODER_PATH,
    FEATURE_COLUMNS_PATH
)

from embedding import generate_embedding

from feature_engineering import (
    combine_text,
    create_structured_features
)

# ---------------------------------------------------
# Load encoder and feature columns only once
# ---------------------------------------------------

encoder = joblib.load(ENCODER_PATH)

feature_columns = joblib.load(FEATURE_COLUMNS_PATH)


# ---------------------------------------------------
# Encode Structured Features
# ---------------------------------------------------

def encode_features(structured_df):

    categorical_columns = [
        "employment_type",
        "remote",
        "experience_level",
        "education_level"
    ]

    numerical_columns = [
        "has_website",
        "is_free_email"
    ]

    # Encode categorical columns
    encoded = encoder.transform(
        structured_df[categorical_columns]
    )

    encoded_df = pd.DataFrame(
        encoded,
        columns=encoder.get_feature_names_out(categorical_columns)
    )

    # Numerical features
    numerical_df = structured_df[numerical_columns].reset_index(drop=True)

    # Merge numerical + encoded
    structured_final = pd.concat(
        [numerical_df, encoded_df],
        axis=1
    )

    return structured_final


# ---------------------------------------------------
# Combine Embedding + Structured Features
# ---------------------------------------------------

def combine_features(embedding, structured_features):

    embedding_df = pd.DataFrame(
        [embedding],
        columns=[f"emb_{i}" for i in range(len(embedding))]
    )

    final_df = pd.concat(
        [embedding_df, structured_features],
        axis=1
    )

    return final_df


# ---------------------------------------------------
# Ensure Column Order Matches Training
# ---------------------------------------------------

def arrange_columns(final_df):

    for column in feature_columns:

        if column not in final_df.columns:

            final_df[column] = 0

    final_df = final_df[feature_columns]

    return final_df


# ---------------------------------------------------
# Complete Pipeline
# ---------------------------------------------------

def preprocess_job(job):

    # Step 1
    text = combine_text(job)

    # Step 2
    embedding = generate_embedding(text)

    # Step 3
    structured = create_structured_features(job)

    # Step 4
    structured = encode_features(structured)

    # Step 5
    final_features = combine_features(
        embedding,
        structured
    )

    # Step 6
    final_features = arrange_columns(
        final_features
    
    )
    print("Embedding shape:", embedding.shape)
    print("Structured shape:", structured.shape)
    print("Final shape:", final_features.shape)
    
    return final_features
