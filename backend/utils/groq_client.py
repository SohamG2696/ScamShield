import json
import logging
import re
from typing import Optional, Dict, Any, List
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

# Fallback sequence of models if primary model is unavailable or encounters 404
MODEL_FALLBACK_CANDIDATES = [
    GROQ_MODEL,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-8b-8192"
]
# Remove duplicates while preserving order
SEEN_MODELS = set()
ORDERED_MODELS = []
for m in MODEL_FALLBACK_CANDIDATES:
    if m and m not in SEEN_MODELS:
        SEEN_MODELS.add(m)
        ORDERED_MODELS.append(m)

_cached_working_model: Optional[str] = None


def get_working_groq_model() -> str:
    """Returns the cached working model or the default configured model."""
    global _cached_working_model
    return _cached_working_model or GROQ_MODEL or "openai/gpt-oss-120b"


def call_groq_chat(
    messages: List[Dict[str, str]],
    temperature: float = 0.1,
    response_format: Optional[Dict[str, str]] = None,
    max_tokens: Optional[int] = None
) -> str:
    """
    Executes a chat completion call with automatic model fallback.
    Tries the current working model first; if 404/not found occurs, iterates
    through available candidates and caches the working one for future calls.
    """
    global _cached_working_model
    if not client:
        raise RuntimeError("Groq client is not initialized (missing API key).")

    candidate_models = []
    if _cached_working_model:
        candidate_models.append(_cached_working_model)
    for m in ORDERED_MODELS:
        if m not in candidate_models:
            candidate_models.append(m)

    last_error = None
    for model_name in candidate_models:
        try:
            kwargs: Dict[str, Any] = {
                "messages": messages,
                "model": model_name,
                "temperature": temperature
            }
            if response_format:
                kwargs["response_format"] = response_format
            if max_tokens:
                kwargs["max_tokens"] = max_tokens

            completion = client.chat.completions.create(**kwargs)
            _cached_working_model = model_name
            return completion.choices[0].message.content
        except Exception as e:
            err_str = str(e).lower()
            last_error = e
            if "not exist" in err_str or "not found" in err_str or "404" in err_str or "access" in err_str:
                logger.warning(f"Groq model '{model_name}' unavailable ({e}). Trying next fallback candidate...")
                continue
            else:
                # Other error (e.g. rate limit, network timeout)
                logger.error(f"Groq API error on model '{model_name}': {e}")
                raise e

    raise last_error or RuntimeError("All candidate Groq models failed.")


# ==============================================================================
# Rule-Based Heuristic Analysis (Used as safety net when API is unreachable)
# ==============================================================================

COMMON_FREE_EMAIL_DOMAINS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com",
    "icloud.com", "mail.com", "zoho.com", "proton.me", "protonmail.com"
]

ADVANCE_FEE_TERMS = [
    "gift card", "apple card", "steam card", "crypto", "bitcoin", "usdt",
    "wire transfer", "western union", "cash app", "zelle", "venmo",
    "money order", "check", "cheque", "deposit", "fee", "upfront payment",
    "equipment fee", "training fee", "registration fee", "insurance fee"
]

MESSAGING_INTERVIEW_TERMS = [
    "telegram", "whatsapp", "signal", "google chat", "skype", "text interview"
]

URGENCY_TERMS = [
    "urgent", "immediately", "immediate start", "act fast", "within 24 hours",
    "limited slots", "today only", "exclusive offer"
]


def _detect_heuristic_signals(raw_text: str) -> Dict[str, Any]:
    lower = raw_text.lower()
    signals = []
    severities = []

    # 1. Free email check for recruiters
    email_matches = re.findall(r'[\w\.-]+@([\w\.-]+\.\w+)', raw_text)
    for domain in email_matches:
        if domain.lower() in COMMON_FREE_EMAIL_DOMAINS:
            signals.append(f"Recruiter contact uses a free public email domain (@{domain}) instead of an authenticated company domain.")
            severities.append("Critical")
            break

    # 2. Payment / advance fee check
    found_fee = [term for term in ADVANCE_FEE_TERMS if term in lower]
    if found_fee:
        signals.append(f"Request for financial transaction or payment mechanism detected: {', '.join(found_fee[:3])}.")
        severities.append("Critical")

    # 3. Off-platform chat interview
    found_chat = [term for term in MESSAGING_INTERVIEW_TERMS if term in lower]
    if found_chat:
        signals.append(f"Recruitment directs conversation to external untraceable messaging platform ({', '.join(found_chat)}).")
        severities.append("High")

    # 4. Excessive urgency
    found_urgency = [term for term in URGENCY_TERMS if term in lower]
    if found_urgency:
        signals.append(f"High-pressure artificial urgency language found: {', '.join(found_urgency[:2])}.")
        severities.append("Medium")

    # 5. Immediate offer without interview
    if "no interview" in lower or "direct placement" in lower or "selected without interview" in lower:
        signals.append("Immediate placement offered without standard interview or candidate evaluation.")
        severities.append("High")

    return {
        "signals": signals,
        "severities": severities
    }


# ==============================================================================
# Relevance & Employment Scope Verification
# ==============================================================================

def check_is_job_related(raw_text: str, input_type: str = "text") -> dict:
    """
    Checks if the submitted text is related to a job posting, recruitment email,
    employment offer letter, interview invitation, or internship.
    """
    JOB_KEYWORDS = [
        "job", "position", "vacancy", "hiring", "apply", "application",
        "resume", "cv", "salary", "role", "employment", "recruiter",
        "interview", "internship", "intern", "work from home", "wfh",
        "full-time", "part-time", "contract", "freelance", "onsite",
        "remote", "qualifications", "requirements", "responsibilities",
        "experience required", "job description", "join our team",
        "we are looking", "we are hiring", "opportunity", "openings",
        "candidate", "applicant", "offer letter", "compensation",
        "stipend", "ctc", "lpa", "per annum", "per month",
        "subject:", "from:", "recruitment", "talent acquisition",
        "human resources", "hr", "hiring manager", "placement", "onboarding"
    ]
    lower = raw_text.lower()

    # Fast heuristic match
    matched = [kw for kw in JOB_KEYWORDS if kw in lower]
    if len(matched) >= 2 or input_type in ["email", "pdf", "image"]:
        fast_pass = True
    else:
        fast_pass = False

    if not client:
        if fast_pass or matched:
            return {
                "is_job_related": True,
                "reason": f"Text contains employment and recruitment terminology: {', '.join(matched[:4])}."
            }
        return {
            "is_job_related": False,
            "reason": "The content does not appear to be an employment posting, recruitment email, or offer letter."
        }

    prompt = f"""You are a content classifier for the ScamShield job fraud detection system.
Determine whether the provided text is related to employment, job opportunities, internships, recruitment emails, interview invitations, job offer letters, or hiring communication.

Input Source: {input_type.upper()}

Rules:
- Mark as TRUE if it is a job post, recruiter outreach, interview invitation, job offer email/letter, or work-from-home inquiry.
- Mark as FALSE only if the text is completely unrelated to jobs or careers (e.g., cooking recipes, sports news, weather forecast, general consumer shopping receipts).

Respond strictly with a JSON object:
{{
  "is_job_related": true or false,
  "reason": "Short human-readable sentence explaining the decision (max 20 words)"
}}

Content:
---
{raw_text[:1500]}
---"""

    try:
        content = call_groq_chat(
            messages=[
                {"role": "system", "content": "You are a strict content classifier. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        result = json.loads(content)
        return {
            "is_job_related": bool(result.get("is_job_related", False)),
            "reason": result.get("reason", "Classification completed.")
        }
    except Exception as e:
        logger.warning(f"Groq relevance check failed: {e}. Falling back to heuristic.")
        if matched or fast_pass:
            return {"is_job_related": True, "reason": "Text contains job-related and recruitment terms."}
        return {"is_job_related": False, "reason": "The submitted content does not appear to be a job posting or recruitment message."}


# ==============================================================================
# Structured Field Extraction
# ==============================================================================

def parse_job_text_to_json(raw_text: str, input_type: str = "text") -> dict:
    """
    Parses raw text (from email, PDF, image OCR, or text) into structured job fields using Groq.
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
        # Heuristic extraction
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        for line in lines[:5]:
            if line.lower().startswith("subject:"):
                default_fields["title"] = line.split(":", 1)[1].strip()[:100]
            elif line.lower().startswith("from:"):
                default_fields["company_email"] = line.split(":", 1)[1].strip()
        if not default_fields["title"] and lines:
            default_fields["title"] = lines[0][:100]
        return default_fields

    prompt = f"""Analyze the following {input_type.upper()} employment communication or job advertisement.
Extract the structured job attributes into a JSON object with these EXACT keys:
- "title": Job title (string)
- "company": Hiring company or organization name (string)
- "description": Comprehensive summary of the job description or email message body (string)
- "requirements": Qualifications, skills, or experience needed (string)
- "benefits": Offered compensation perks, health benefits, or incentives (string)
- "employment_type": Employment type ("Full-time", "Part-time", "Contract", "Internship", "Temporary") (string)
- "remote": "Yes" or "No" (string)
- "experience_required": Required experience range (e.g. "Entry-level", "1-3 years", "Not specified") (string)
- "education_required": Education level needed (string)
- "salary_range": Mentioned compensation, hourly rate, or annual salary (string)
- "company_website": Official corporate website URL if mentioned (string)
- "company_email": Recruiter or company contact email address (string)
- "location": Work location or "Remote" (string)

If a field is not present in the text, use an empty string "". Do not fabricate values.

Raw content to analyze:
---
{raw_text[:4000]}
---"""

    try:
        content = call_groq_chat(
            messages=[
                {"role": "system", "content": "You are a precise data extraction specialist. Output ONLY valid JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        extracted = json.loads(content)
        for key, default_val in default_fields.items():
            if key not in extracted or extracted[key] is None:
                extracted[key] = default_val
        return extracted
    except Exception as e:
        logger.error(f"Groq text extraction failed: {e}. Falling back.")
        return default_fields


# ==============================================================================
# Explainability & Detailed Analysis Description
# ==============================================================================

def generate_explainability(
    raw_text: str,
    prediction: str,
    confidence: float,
    input_type: str = "text"
) -> dict:
    """
    Generates explainability details with specific evidence explaining why the
    email, document, or posting was classified as Scam or Genuine.
    """
    heuristic = _detect_heuristic_signals(raw_text)

    # Prepare default fallback explanation with detected heuristic signals
    if prediction == "Scam":
        risk_level = "Critical" if "Critical" in heuristic["severities"] else "High"
        default_indicators = heuristic["signals"] or [
            "Unverifiable employer contact details or suspicious sender domain",
            "Discrepancies in the recruitment process or missing job requirements",
            "Urgency markers designed to bypass normal verification"
        ]
        default_reasoning = (
            f"The analyzed {input_type} exhibits characteristics common to recruitment fraud and advance-fee schemes. "
            f"Key red flags include non-standard recruitment channels, vague role expectations, or suspicious contact origins. "
            f"Classified as Scam with {confidence}% confidence."
        )
        default_action = "Do not provide personal or financial details. Avoid clicking unknown links and verify the opportunity directly on the official company careers portal."
    else:
        risk_level = "Low"
        default_indicators = [
            "Authentic and professional hiring communication format",
            "Realistic role expectations and industry-appropriate structure",
            "Standard application workflow with no advance monetary demands"
        ]
        default_reasoning = (
            f"The analyzed {input_type} adheres to legitimate recruitment practices. "
            f"It displays verifiable organizational structure, realistic compensation parameters, and no advance payment or credential harvesting requests. "
            f"Classified as Genuine with {confidence}% confidence."
        )
        default_action = "Proceed with your application while maintaining standard diligence: verify recruiter credentials on LinkedIn or the official company website."

    default_explanation = {
        "verdict_reasoning": default_reasoning,
        "scam_indicators": default_indicators,
        "risk_level": risk_level,
        "recommended_action": default_action
    }

    if not client:
        return default_explanation

    prompt = f"""You are a Lead Cybersecurity & Employment Fraud Analyst for ScamShield.
An ML classifier analyzed an incoming {input_type.upper()} and produced:
- Classification Verdict: {prediction}
- Confidence Score: {confidence}%
- Media / Input Type: {input_type}

Provide a deep, expert analysis of this {input_type}. Cite SPECIFIC details from the text (such as sender email domain, salary claims, payment requests, company name, tone, or interview process).

Requirements for output JSON:
- "verdict_reasoning": A comprehensive 3-5 sentence explanation detailing EXACTLY why this {input_type} is classified as {prediction}. If it is an email, analyze the sender address, subject line, domain credibility, and request format. If it is a PDF or image, analyze the document format, company credentials, and legitimacy markers.
- "scam_indicators": A list of 4-6 specific, evidence-backed red flags (if Scam) or positive trust signals (if Genuine). For example: "Sender uses a free Gmail account (recruitment@gmail.com) while claiming to represent Google LLC", "Demands $150 onboarding fee via gift card", "Offers job without technical interview".
- "risk_level": Must be one of "Critical", "High", "Medium", or "Low".
- "recommended_action": Direct, actionable instruction advising the user on immediate next steps.

Content to analyze ({input_type}):
---
{raw_text[:4000]}
---"""

    try:
        content = call_groq_chat(
            messages=[
                {
                    "role": "system",
                    "content": "You are a cybersecurity expert analyzing emails, documents, and job postings for fraud. Output ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        explanation = json.loads(content)

        # Validate structure
        for key, val in default_explanation.items():
            if key not in explanation or not explanation[key]:
                explanation[key] = val
        return explanation
    except Exception as e:
        logger.error(f"Groq explainability generation failed: {e}. Using robust heuristic fallback.")
        return default_explanation


# ==============================================================================
# Comprehensive Professional Fraud Intelligence Report
# ==============================================================================

def generate_professional_report(
    raw_text: str,
    prediction: str,
    confidence: float,
    explanation: dict,
    input_type: str = "text"
) -> dict:
    """
    Generates a formal, comprehensive Fraud Intelligence Report for the user,
    providing structured evidence breakdown, multi-dimensional risk matrix,
    and a step-by-step verification checklist.
    """
    heuristic = _detect_heuristic_signals(raw_text)
    is_scam = (prediction == "Scam")

    # Default fallback structured findings
    default_findings = []
    if is_scam:
        for idx, sig in enumerate(heuristic["signals"]):
            severity = heuristic["severities"][idx] if idx < len(heuristic["severities"]) else "High"
            default_findings.append({
                "category": "Heuristic Signal Detection",
                "finding": sig,
                "severity": severity
            })
        if not default_findings:
            default_findings.append({
                "category": "ML Classification",
                "finding": f"The model detected high-risk syntactic and semantic patterns consistent with job scam operations (Confidence: {confidence}%).",
                "severity": "High"
            })
    else:
        default_findings.append({
            "category": "Domain & Communication Integrity",
            "finding": "Communication adheres to professional enterprise standards with no overt credential-harvesting markers.",
            "severity": "Positive"
        })
        default_findings.append({
            "category": "Compensation Structure",
            "finding": "Compensation expectations align with standard market distributions for the indicated discipline.",
            "severity": "Low"
        })

    default_report = {
        "executive_summary": (
            f"This {input_type} has been evaluated by ScamShield as **{prediction}** with a confidence of **{confidence}%**. "
            f"{explanation.get('verdict_reasoning', '')}"
        ),
        "detailed_findings": default_findings,
        "risk_matrix": {
            "overall_risk": explanation.get("risk_level", "Critical" if is_scam else "Low"),
            "financial_risk": "Critical" if (is_scam and any("payment" in f.get("finding", "").lower() or "fee" in f.get("finding", "").lower() for f in default_findings)) else ("Medium" if is_scam else "None"),
            "identity_risk": "High" if is_scam else "Low",
            "reputational_risk": "High" if is_scam else "None"
        },
        "red_flags_summary": explanation.get("scam_indicators", []),
        "verification_checklist": [
            "Verify the sender's domain against official enterprise corporate records",
            "Cross-reference the position and requisition ID on the organization's verified career portal",
            "Contact official talent acquisition via official switchboard or verified LinkedIn corporate pages",
            "Never disburse funds, purchase gift cards, or provide banking credentials prior to contract execution"
        ],
        "conclusion": explanation.get("recommended_action", "Proceed with caution and verify independently."),
        "disclaimer": "This report is AI-generated by ScamShield. It is for informational purposes only. Always apply independent judgment before making decisions."
    }

    if not client:
        return default_report

    indicators_text = "\n".join(f"- {i}" for i in explanation.get("scam_indicators", []))

    prompt = f"""You are a Senior Cyber Threat & Employment Fraud Intelligence Analyst producing a formal, evidence-backed security report for the ScamShield platform.

Pre-analysis Metrics:
- Input Format: {input_type.upper()}
- ML Verdict: {prediction}
- Model Confidence: {confidence}%
- Assessed Risk Level: {explanation.get('risk_level', 'Unknown')}
- Identified Key Signals:
{indicators_text}
- Summary Reasoning: {explanation.get('verdict_reasoning', '')}

Analyze the raw content below and generate a formal, professional fraud assessment report.
Return a JSON object with EXACTLY these keys:

- "executive_summary": 2-3 sentence executive paragraph. Clearly declare the verdict, summarize the critical evidence (such as spoofed sender domain, advance fees, chat interviews, or legitimate corporate indicators), and state the risk posture. (string)
- "detailed_findings": An array of 3-5 structured finding objects. Each item must have:
    - "category": Finding category, e.g. "Sender & Domain Authenticity", "Payment & Advance-Fee Demands", "Hiring & Interview Integrity", "Compensation Realism", "Communication Formality & Tone" (string)
    - "finding": Deep, specific, evidence-backed observation citing exact quotes, domains, or phrases from the text. (string)
    - "severity": One of "Critical", "High", "Medium", "Low", "Positive" (string)
- "risk_matrix": An object assessing 4 risk dimensions:
    - "overall_risk": "Critical", "High", "Medium", or "Low"
    - "financial_risk": "Critical", "High", "Medium", "Low", or "None"
    - "identity_risk": "Critical", "High", "Medium", "Low", or "None"
    - "reputational_risk": "High", "Medium", "Low", or "None"
- "red_flags_summary": An array of 3-6 concise, bullet-ready strings highlighting the key takeaways. (array of strings)
- "verification_checklist": An array of 4-6 specific, actionable steps a candidate should take to verify or protect themselves, written as clear imperatives. (array of strings)
- "conclusion": A definitive 1-2 sentence closing verdict and recommendation. (string)
- "disclaimer": Must remain exactly: "This report is AI-generated by ScamShield. It is for informational purposes only. Always apply independent judgment before making decisions."

Content to inspect ({input_type}):
---
{raw_text[:4000]}
---"""

    try:
        content = call_groq_chat(
            messages=[
                {
                    "role": "system",
                    "content": "You are a senior fraud intelligence analyst producing formal, evidence-based reports for cybersecurity platforms. Your analysis is thorough, precise, and cites exact evidence from the text. Output ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        report = json.loads(content)

        # Ensure all required keys exist
        for key, val in default_report.items():
            if key not in report or not report[key]:
                report[key] = val
        return report
    except Exception as e:
        logger.error(f"Groq professional report generation failed: {e}. Using fallback.")
        return default_report
