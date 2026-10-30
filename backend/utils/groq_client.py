import json
import logging
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL

logger = logging.getLogger("scamshield.groq")

# Initialize client only if key is available
client = None
if GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Groq client: {e}")


def check_is_job_related(raw_text: str) -> dict:
    """
    Checks if the submitted text is related to a job posting or internship.
    Returns:
        {
          "is_job_related": bool,
          "reason": str   # short human-readable explanation
        }
    Falls back to keyword heuristic if Groq is unavailable.
    """
    # ── Keyword heuristic fallback ──────────────────────────────────────────
    JOB_KEYWORDS = [
        "job", "position", "vacancy", "hiring", "apply", "application",
        "resume", "cv", "salary", "role", "employment", "recruiter",
        "interview", "internship", "intern", "work from home", "wfh",
        "full-time", "part-time", "contract", "freelance", "onsite",
        "remote", "qualifications", "requirements", "responsibilities",
        "experience required", "job description", "join our team",
        "we are looking", "we are hiring", "opportunity", "openings",
        "candidate", "applicant", "offer letter", "compensation",
        "stipend", "ctc", "lpa", "per annum", "per month"
    ]
    lower = raw_text.lower()

    if not client:
        matched = [kw for kw in JOB_KEYWORDS if kw in lower]
        if matched:
            return {
                "is_job_related": True,
                "reason": f"Text contains job-related keywords: {', '.join(matched[:4])}."
            }
        return {
            "is_job_related": False,
            "reason": "The text does not appear to be a job posting or internship listing. No relevant keywords were found."
        }

    # ── LLM check via Groq ──────────────────────────────────────────────────
    prompt = f"""You are a content classifier for the ScamShield job-scam detection platform.
Your task is to determine whether the text below is a job posting, internship listing, recruitment message, or work opportunity of any kind.

Answer strictly with a JSON object containing:
- "is_job_related": true or false
- "reason": a single short sentence explaining your decision (max 20 words)

Text to classify:
---
{raw_text[:1500]}
---"""

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a strict content classifier. Output only JSON."},
                {"role": "user", "content": prompt}
            ],
            model=GROQ_MODEL,
            response_format={"type": "json_object"},
            temperature=0.0
        )
        result = json.loads(response.choices[0].message.content)
        return {
            "is_job_related": bool(result.get("is_job_related", False)),
            "reason": result.get("reason", "Classification completed.")
        }
    except Exception as e:
        logger.error(f"Groq relevance check failed: {e}. Falling back to keyword heuristic.")
        matched = [kw for kw in JOB_KEYWORDS if kw in lower]
        if matched:
            return {"is_job_related": True, "reason": f"Contains job-related keywords."}
        return {"is_job_related": False, "reason": "The submitted text does not appear to be a job or internship posting."}


def parse_job_text_to_json(raw_text: str) -> dict:
    """
    Parses raw text (from PDF or OCR) into structured job fields using Groq API.
    If the API call fails or key is missing, returns a fallback dictionary.
    """
    default_fields = {
        "title": "",
        "company": "",
        "description": raw_text[:500] if raw_text else "",
        "requirements": "",
        "benefits": "",
        "employment_type": "Full-time",
        "remote": "No",
        "experience_required": "Unknown",
        "education_required": "Unknown",
        "salary_range": "",
        "company_website": "",
        "company_email": "",
        "location": ""
    }

    if not client:
        logger.warning("Groq API key is missing or client is uninitialized. Using heuristic fallback.")
        # Basic heuristic parsing: check first line as title
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        if lines:
            default_fields["title"] = lines[0][:100]
        return default_fields

    prompt = f"""
Analyze the following raw job advertisement text (extracted from a document or image). 
Extract the structured job information and return it strictly as a JSON object.

The output JSON object MUST contain the following keys exactly:
- "title": Job title (string)
- "company": Hiring company name (string)
- "description": Job description details (string)
- "requirements": Job requirements or skills needed (string)
- "benefits": Offered benefits or perks (string)
- "employment_type": Employment type, e.g. "Full-time", "Part-time", "Contract", "Internship", "Temporary" (string)
- "remote": Yes/No indicating whether it is remote work (string)
- "experience_required": Required experience details, e.g. "1-3 years", "Entry level", "No experience" (string)
- "education_required": Required education, e.g. "Bachelor's degree", "School", "High school" (string)
- "salary_range": Mentioned salary range (string)
- "company_website": Official company website URL (string)
- "company_email": Company contact email address (string)
- "location": Job location (string)

If any field is missing from the text, return empty string "". Do not create imaginary values.
Make sure to extract "company_website" and "company_email" if they exist, as they are crucial for verification.

Raw text to analyze:
---
{raw_text}
---
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise data extraction agent. You extract job details into JSON format."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=GROQ_MODEL,
            response_format={"type": "json_object"},
            temperature=0.0
        )
        result_text = chat_completion.choices[0].message.content
        extracted = json.loads(result_text)
        
        # Ensure all required keys exist
        for key, default_val in default_fields.items():
            if key not in extracted:
                extracted[key] = default_val
        return extracted
    except Exception as e:
        logger.error(f"Groq text extraction failed: {e}. Falling back.")
        return default_fields


def generate_explainability(raw_text: str, prediction: str, confidence: float) -> dict:
    """
    Generates explainability text details highlighting indicators, risk assessment,
    and recommended user action based on the model's prediction.
    """
    default_explanation = {
        "verdict_reasoning": f"The job posting has been classified as {prediction} with {confidence}% confidence.",
        "scam_indicators": [],
        "risk_level": "Medium" if prediction == "Scam" else "Low",
        "recommended_action": "Verify details manually and cross-check company information before applying."
    }

    if not client:
        logger.warning("Groq API key is missing or client is uninitialized. Using default explanation.")
        return default_explanation

    prompt = f"""
You are an expert Cybersecurity and AI Job Scam Analyst for the "ScamShield" platform.
An ML classifier has analyzed a job posting and generated the following result:
- ML Prediction: {prediction} (is it a Scam or Genuine job)
- ML Classifier Confidence: {confidence}%

Review the raw job posting text and explain why the classifier labeled it as "{prediction}".
You must output a JSON object with these keys:
- "verdict_reasoning": Clear explanation of the decision based on indicators found in the text (string).
- "scam_indicators": A list of specific indicators or red/green flags found in the text (array of strings). For example, if it's a Scam, identify flags like free emails, vague descriptions, requests for money, or unrealistic wages. If Genuine, identify signs like valid company domains, structured requirements, and detailed responsibilities.
- "risk_level": One of: "Low", "Medium", "High" (string).
- "recommended_action": Actionable advice for the job seeker, e.g. "Do not apply, flag this email", "Verify on the official company website", or "Apply with confidence" (string).

Raw job posting text:
---
{raw_text}
---
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a cybersecurity expert analyzing job postings for fraud."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=GROQ_MODEL,
            response_format={"type": "json_object"},
            temperature=0.2
        )
        result_text = chat_completion.choices[0].message.content
        explanation = json.loads(result_text)
        
        # Verify keys
        for key, val in default_explanation.items():
            if key not in explanation:
                explanation[key] = val
        return explanation
    except Exception as e:
        logger.error(f"Groq explainability generation failed: {e}. Falling back.")
        return default_explanation


def generate_professional_report(raw_text: str, prediction: str, confidence: float, explanation: dict) -> dict:
    """
    Generates a comprehensive, professionally formatted fraud analysis report
    using Groq. Includes executive summary, detailed findings, risk matrix,
    and actionable next steps.
    """
    default_report = {
        "executive_summary": f"This job posting has been assessed as **{prediction}** with a confidence of **{confidence}%** by ScamShield's ML classifier.",
        "detailed_findings": [
            {
                "category": "ML Classification",
                "finding": f"Classified as {prediction} with {confidence}% confidence.",
                "severity": "High" if prediction == "Scam" else "Low"
            }
        ],
        "risk_matrix": {
            "overall_risk": explanation.get("risk_level", "Medium"),
            "financial_risk": "Unknown",
            "identity_risk": "Unknown",
            "reputational_risk": "Low"
        },
        "red_flags_summary": explanation.get("scam_indicators", []),
        "verification_checklist": [
            "Search the company name on official registrar websites",
            "Verify the recruiter's identity on LinkedIn or company website",
            "Never pay any upfront fee before receiving a formal offer letter"
        ],
        "conclusion": explanation.get("recommended_action", "Proceed with caution and verify independently."),
        "disclaimer": "This report is generated by an AI system. Always apply independent judgment before making decisions."
    }

    if not client:
        logger.warning("Groq API key is missing or client is uninitialized. Using default professional report.")
        return default_report

    indicators_text = "\n".join(f"- {i}" for i in explanation.get("scam_indicators", []))

    prompt = f"""
You are a Senior Fraud Intelligence Analyst producing a formal, professional report for the ScamShield platform.
You have received the following pre-analysis data:

- ML Verdict: {prediction}
- ML Confidence: {confidence}%
- Risk Level: {explanation.get('risk_level', 'Unknown')}
- Preliminary Indicators Found:
{indicators_text}
- Preliminary Verdict Reasoning: {explanation.get('verdict_reasoning', '')}

Using the raw job posting text below, write a thorough, professional fraud assessment report.
Return a JSON object with EXACTLY these keys:

- "executive_summary": A 2-3 sentence professional summary paragraph suitable for an executive audience. Clearly state the verdict, confidence, and overall risk posture. (string)
- "detailed_findings": An array of finding objects, each with:
    - "category": Category name, e.g. "Language Analysis", "Compensation Claims", "Contact Verification", "Application Process", "Company Identity" (string)
    - "finding": Specific, evidence-based finding from the text. Be detailed and cite specific phrases or patterns from the text. (string)
    - "severity": One of "Critical", "High", "Medium", "Low", "Positive" (string)
- "risk_matrix": An object with:
    - "overall_risk": One of "Critical", "High", "Medium", "Low" (string)
    - "financial_risk": One of "Critical", "High", "Medium", "Low", "None" (string)
    - "identity_risk": One of "Critical", "High", "Medium", "Low", "None" (string)
    - "reputational_risk": One of "High", "Medium", "Low", "None" (string)
- "red_flags_summary": An array of concise red flag strings (or green flag strings if genuine). 3-6 items. (array of strings)
- "verification_checklist": An array of 4-6 specific, actionable steps a job seeker should take to verify or protect themselves, written as imperatives. (array of strings)
- "conclusion": A 1-2 sentence definitive conclusion and recommendation. (string)
- "disclaimer": Keep this exactly as: "This report is AI-generated by ScamShield. It is for informational purposes only. Always apply independent judgment before making decisions."

Raw job posting text:
---
{raw_text}
---
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior fraud intelligence analyst producing formal, evidence-based professional reports for cybersecurity platforms. Your reports are thorough, precise, and cite specific evidence from the text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model=GROQ_MODEL,
            response_format={"type": "json_object"},
            temperature=0.1
        )
        result_text = chat_completion.choices[0].message.content
        report = json.loads(result_text)

        # Ensure all required keys exist
        for key, val in default_report.items():
            if key not in report:
                report[key] = val
        return report
    except Exception as e:
        logger.error(f"Groq professional report generation failed: {e}. Falling back.")
        return default_report
