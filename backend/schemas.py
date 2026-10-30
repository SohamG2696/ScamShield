from pydantic import BaseModel
from typing import Optional


class TextInput(BaseModel):
    text: str


class JobInput(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    company: Optional[str] = ""
    company_website: Optional[str] = ""
    employment_type: Optional[str] = "Full-time"
    experience_required: Optional[str] = "Unknown"
    education_required: Optional[str] = "Unknown"
    salary_range: Optional[str] = ""
    location: Optional[str] = ""
    text: Optional[str] = None