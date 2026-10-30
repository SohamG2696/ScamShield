import logging
from fastapi import APIRouter
from pydantic import BaseModel
from utils.groq_client import client
from config import GROQ_MODEL

logger = logging.getLogger("scamshield.chat")

router = APIRouter(prefix="/chat", tags=["Assistant"])

SYSTEM_PROMPT = """You are the ScamShield AI Assistant — a friendly, expert cybersecurity guide embedded in the ScamShield platform.

ScamShield is an AI-powered job scam detection tool that helps users identify fraudulent job postings. Users can:
- Paste job posting text for analysis
- Upload PDF documents
- Submit screenshots (OCR-powered)
- Scan Gmail inbox for suspicious emails

You help users with:
- Understanding ScamShield's results and verdict reasoning
- Spotting red flags in job postings (vague descriptions, upfront fees, unrealistic salaries, free email domains, etc.)
- Cybersecurity best practices when job searching
- How to verify companies, recruiters, and job offers
- General questions about job scam tactics

Keep answers concise (2-4 sentences unless more detail is needed), conversational, and actionable.
Use bullet points when listing multiple items. Never make up specific company data.
If the user shares a job posting snippet, analyze it for red flags.
"""


class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@router.post("")
async def chat(req: ChatRequest):
    if not client:
        return {
            "reply": "⚠️ The AI assistant is currently unavailable (API key not configured). Please check the backend `.env` file."
        }

    # Build the message history for Groq
    groq_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    # Keep last 10 messages for context window efficiency
    for msg in req.messages[-10:]:
        groq_messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = client.chat.completions.create(
            messages=groq_messages,
            model=GROQ_MODEL,
            temperature=0.6,
            max_tokens=512,
        )
        reply = completion.choices[0].message.content.strip()
        return {"reply": reply}
    except Exception as e:
        logger.error(f"Chat completion failed: {e}")
        return {
            "reply": "Sorry, I ran into an issue processing your message. Please try again in a moment."
        }
