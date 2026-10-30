import pandas as pd

from utils.feature_utils import (
    has_website,
    is_free_email
)


def combine_text(job):

    fields = [

        job.get("title", ""),

        job.get("company", ""),

        job.get("description", ""),

        job.get("requirements", ""),

        job.get("benefits", "")

    ]

    return " ".join(fields)


def map_experience(exp):

    exp = str(exp).lower()

    if any(word in exp for word in [
        "fresher",
        "entry",
        "no experience",
        "0 experience"
    ]):
        return "Entry"

    elif any(word in exp for word in [
        "0-1",
        "0-2",
        "1-3",
        "2-5"
    ]):
        return "Junior"

    elif "3-6" in exp:
        return "Mid"

    elif "5+" in exp:
        return "Senior"

    return "Unknown"


def map_education(edu):

    edu = str(edu).lower()

    if "10th" in edu or "12th" in edu:
        return "School"

    elif any(word in edu for word in [
        "graduate",
        "bachelor",
        "b.tech",
        "diploma"
    ]):
        return "Graduate"

    elif any(word in edu for word in [
        "master",
        "mba",
        "m.tech"
    ]):
        return "Postgraduate"

    elif any(word in edu for word in [
        "no formal",
        "minimum education",
        "any qualification"
    ]):
        return "No Requirement"

    return "Unknown"


def create_structured_features(job):

    features = {

        "employment_type":
            job.get("employment_type", ""),

        "remote":
            job.get("remote", ""),

        "experience_level":
            map_experience(
                job.get("experience_required", "")
            ),

        "education_level":
            map_education(
                job.get("education_required", "")
            ),

        "has_website":
            has_website(
                job.get("company_website", "")
            ),

        "is_free_email":
            is_free_email(
                job.get("company_email", "")
            )

    }

    return pd.DataFrame([features])