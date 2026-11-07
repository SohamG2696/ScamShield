"""Offline regression tests for Hindi normalization and analysis ordering.

Run with python -m unittest discover -s backend/tests -p test_translation.py.
"""

import asyncio
import importlib.util
import json
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import AsyncMock, Mock, patch

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))

from fastapi import HTTPException
from utils.translation import normalize_hindi_input, TranslationError

HINDI = "घर से काम की नौकरी। वेतन 50000 INR। पहले 2000 INR शुल्क दें। jobs@example.com"
ENGLISH = "Work-from-home job. Salary 50000 INR. Pay a fee of 2000 INR first. jobs@example.com"


class TranslationTests(unittest.TestCase):
    def test_english_bypasses_groq_and_keeps_structured_fields(self):
        job = {"title": "Engineer", "remote": "Yes", "description": ENGLISH}
        with patch("utils.translation.call_groq_chat") as chat:
            text, fields, applied = normalize_hindi_input(ENGLISH, job)
        self.assertEqual(text, ENGLISH)
        self.assertIs(fields, job)
        self.assertFalse(applied)
        chat.assert_not_called()

    def test_hindi_and_mixed_text_use_separate_system_instructions(self):
        for source in (HINDI, "Subject: Remote job\n" + HINDI):
            with self.subTest(source=source), patch("utils.translation.call_groq_chat", return_value=json.dumps({"raw_text": ENGLISH})) as chat:
                text, fields, applied = normalize_hindi_input(source)
                self.assertEqual((text, fields, applied), (ENGLISH, None, True))
                messages = chat.call_args.kwargs["messages"]
                self.assertEqual(messages[0]["role"], "system")
                self.assertEqual(json.loads(messages[1]["content"]), {"raw_text": source})

    def test_structured_hindi_is_translated_without_mutating_english_fields(self):
        job = {"title": "नौकरी", "company_email": "jobs@example.com", "remote": "Yes"}
        with patch("utils.translation.call_groq_chat", return_value=json.dumps({"job.title": "Job"})):
            text, fields, applied = normalize_hindi_input(ENGLISH, job)
        self.assertEqual(text, ENGLISH)
        self.assertEqual(fields, {**job, "title": "Job"})
        self.assertEqual(job["title"], "नौकरी")
        self.assertTrue(applied)

    def test_full_input_is_sent_without_truncation(self):
        source = HINDI * 100
        with patch("utils.translation.call_groq_chat", return_value=json.dumps({"raw_text": ENGLISH * 100})) as chat:
            normalize_hindi_input(source)
        self.assertEqual(json.loads(chat.call_args.kwargs["messages"][1]["content"])["raw_text"], source)

    def test_invalid_or_incomplete_translation_is_rejected(self):
        responses = ['{', '[]', '{}', '{"raw_text":null}', '{"raw_text":123}', '{"raw_text":" "}', json.dumps({"raw_text": HINDI})]
        for response in responses:
            with self.subTest(response=response), patch("utils.translation.call_groq_chat", return_value=response):
                with self.assertRaises(TranslationError):
                    normalize_hindi_input(HINDI)

    def test_unavailable_service_is_rejected(self):
        with patch("utils.translation.call_groq_chat", side_effect=RuntimeError("Unavailable")):
            with self.assertRaisesRegex(TranslationError, "try again"):
                normalize_hindi_input(HINDI)


class WorkflowTests(unittest.TestCase):
    def setUp(self):
        # Load the real orchestrator without downloading an embedding model or OCR.
        pipeline = types.ModuleType("pipeline")
        pipeline.preprocess_job = Mock()
        model_loader = types.ModuleType("joblib")
        model_loader.load = Mock()
        spec = importlib.util.spec_from_file_location("translation_test_predictor", BACKEND / "predictor.py")
        self.workflow = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {"pipeline": pipeline, "joblib": model_loader}):
            spec.loader.exec_module(self.workflow)
        self.job = {"title": "Remote job", "description": ENGLISH}
        for name, replacement in {
            "parse_job_text_to_json": Mock(return_value=self.job),
            "check_is_job_related": Mock(return_value={"is_job_related": True}),
            "predict_job": Mock(return_value={"prediction": "Scam", "confidence": 95, "scam_probability": 95, "genuine_probability": 5}),
            "generate_explainability": Mock(return_value={"risk_level": "High"}),
            "generate_professional_report": Mock(return_value={"detailed_findings": []}),
            "log_prediction_to_supabase": AsyncMock(),
        }.items():
            setattr(self.workflow, name, replacement)

    def test_all_scan_channels_receive_english_before_extraction_and_prediction(self):
        for channel in ("text", "email", "pdf", "image"):
            with self.subTest(channel=channel), patch("utils.translation.call_groq_chat", return_value=json.dumps({"raw_text": ENGLISH})):
                result = asyncio.run(self.workflow.predict_explain_log_job(None, HINDI, channel))
            self.workflow.parse_job_text_to_json.assert_called_with(ENGLISH, input_type=channel)
            self.workflow.check_is_job_related.assert_called_with(ENGLISH, input_type=channel)
            self.workflow.predict_job.assert_called_with(self.job)
            self.workflow.generate_explainability.assert_called_with(ENGLISH, "Scam", 95, input_type=channel)
            self.assertTrue(result["translation"]["applied"])
            if channel in ("pdf", "image"):
                self.assertEqual(result["extracted_fields"], self.job)

    def test_failed_translation_stops_analysis_with_retryable_http_error(self):
        with patch("utils.translation.call_groq_chat", return_value='{}'):
            with self.assertRaises(HTTPException) as error:
                asyncio.run(self.workflow.predict_explain_log_job(None, HINDI))
        self.assertEqual(error.exception.status_code, 503)
        self.workflow.parse_job_text_to_json.assert_not_called()
        self.workflow.predict_job.assert_not_called()
        self.workflow.log_prediction_to_supabase.assert_not_called()

    def test_english_structured_requests_keep_existing_fields(self):
        with patch("utils.translation.call_groq_chat") as chat:
            result = asyncio.run(self.workflow.predict_explain_log_job(self.job, ENGLISH))
        chat.assert_not_called()
        self.workflow.parse_job_text_to_json.assert_not_called()
        self.workflow.predict_job.assert_called_once_with(self.job)
        self.assertFalse(result["translation"]["applied"])

    def test_irrelevant_hindi_does_not_reach_the_classifier(self):
        self.workflow.check_is_job_related.return_value = {"is_job_related": False, "reason": "Unrelated"}
        with patch("utils.translation.call_groq_chat", return_value=json.dumps({"raw_text": "Today's weather forecast."})):
            result = asyncio.run(self.workflow.predict_explain_log_job(None, "आज का मौसम"))
        self.assertEqual(result["prediction"], "NOT_JOB_RELATED")
        self.assertTrue(result["translation"]["applied"])
        self.workflow.predict_job.assert_not_called()


if __name__ == "__main__":
    unittest.main()
