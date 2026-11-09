import React from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  Lock,
  EyeOff,
  FileText,
  Trash2,
  Cpu,
  Database,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

export default function Privacy() {
  const lastUpdated = 'November 9, 2026'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      {/* Header section */}
      <header className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-[#d8bd91] mb-4">
          <Shield size={13} className="text-[#e8c48d]" aria-hidden="true" />
          <span>TRANSPARENCY & DATA PROTECTION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold tracking-tight text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          ScamShield is engineered with a strict privacy-first, zero-retention philosophy. We analyze job opportunities to protect seekers from fraudulent recruiters without compromising your personal documents, emails, or identity.
        </p>
        <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-500 font-mono mt-4">
          <Clock size={13} />
          <span>Last modified: {lastUpdated}</span>
        </div>
      </header>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="p-4 rounded-xl border border-white/10 bg-[#111c2be8]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Trash2 size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Instant File Deletion</h2>
          <p className="text-xs text-slate-400 leading-normal">
            Uploaded PDFs and screenshots are permanently wiped from server disk immediately after text extraction.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#111c2be8]">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <EyeOff size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Zero Content Storage</h2>
          <p className="text-xs text-slate-400 leading-normal">
            We never store job descriptions, resume contents, or email bodies in our cloud database.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#111c2be8]">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <Shield size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Google Limited Use</h2>
          <p className="text-xs text-slate-400 leading-normal">
            Full compliance with Google API Services User Data Policy, strictly isolating read-only Gmail access.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-[#111c2be8]">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
            <Lock size={16} />
          </div>
          <h2 className="text-sm font-semibold text-white mb-1">Client-Only Tokens</h2>
          <p className="text-xs text-slate-400 leading-normal">
            OAuth access tokens live exclusively in browser session storage and are destroyed on tab close.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-10 text-slate-300 text-sm leading-relaxed">
        
        {/* Section 1: Overview */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <FileText size={20} className="text-[#e8c48d]" />
            1. Overview and Core Purpose
          </h2>
          <p className="mb-3">
            ScamShield (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) provides automated risk assessment tools designed to help job seekers detect employment fraud, fake recruiters, advance-fee scams, and deceptive job offers.
          </p>
          <p>
            This Privacy Policy outlines how our application collects, processes, and protects your information across all analysis channels, including direct text, uploaded PDF documents, image screenshots, interactive chat, and connected Gmail accounts.
          </p>
        </section>

        {/* Section 2: Input Modalities & Processing */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2.5">
            <Cpu size={20} className="text-[#e8c48d]" />
            2. How We Process Your Data
          </h2>
          <div className="space-y-4">
            <div className="border-l-2 border-cyan-500/40 pl-4 py-1">
              <h3 className="font-semibold text-white text-base">A. Direct Text Analysis (/app/text)</h3>
              <p className="mt-1 text-slate-400">
                When you paste a job posting or recruiter message into ScamShield, the text is evaluated entirely in-memory using our LightGBM machine learning classifier and Sentence Transformers embedding pipeline. If the text is in Hindi, it is translated in-memory into English for uniform feature extraction. The raw text is discarded once the scan result is delivered to your browser.
              </p>
            </div>

            <div className="border-l-2 border-emerald-500/40 pl-4 py-1">
              <h3 className="font-semibold text-white text-base">B. PDF Document Analysis (/predict/pdf)</h3>
              <p className="mt-1 text-slate-400">
                When you upload a PDF file (such as a job description or offer letter), ScamShield validates the file size (maximum 10 MB) and verifies the standard PDF binary header (<code className="text-[#e8c48d]">%PDF-</code>). The document is saved under an isolated, cryptographically generated UUID filename to prevent path traversal and file collisions. Text is extracted in memory using PyMuPDF. <strong className="text-white">The temporary PDF file is permanently deleted from server storage in an automated code finally block</strong> as soon as text extraction finishes or if an error occurs.
              </p>
            </div>

            <div className="border-l-2 border-violet-500/40 pl-4 py-1">
              <h3 className="font-semibold text-white text-base">C. Screenshot &amp; Image OCR (/predict/image)</h3>
              <p className="mt-1 text-slate-400">
                When you submit an image or screenshot (supporting PNG, JPG, JPEG, WEBP, BMP, and TIFF formats up to 10 MB), ScamShield validates the image header magic bytes and assigns a collision-proof UUID filename. Text is extracted locally on the server using an embedded EasyOCR optical character recognition engine with bilingual English and Hindi support. <strong className="text-white">The image file is permanently deleted from server storage immediately in the finally block</strong> after OCR completion.
              </p>
            </div>

            <div className="border-l-2 border-amber-500/40 pl-4 py-1">
              <h3 className="font-semibold text-white text-base">D. Gmail Inbox Integration (/app/gmail)</h3>
              <p className="mt-1 text-slate-400">
                ScamShield provides an optional Gmail integration to scan suspicious job-related emails. Our system is designed with strict client-side controls and incremental authorization:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400 pl-2">
                <li><strong className="text-slate-200">Incremental Least-Privilege Authorization:</strong> General site authentication requests only basic identity (<code className="text-[#e8c48d]">openid email profile</code>). The restricted <code className="text-[#e8c48d]">gmail.readonly</code> permission is requested only if you explicitly choose to activate Gmail scanning.</li>
                <li><strong className="text-slate-200">On-Demand Selection Only:</strong> ScamShield does NOT bulk-download, clone, or continuously monitor your inbox. The client fetches a short list of message headers (Subject, From, Date) so you can review and select a specific email.</li>
                <li><strong className="text-slate-200">Isolated Message Transfer:</strong> Only the single email message you explicitly choose and confirm to scan has its text decoded and submitted for analysis.</li>
                <li><strong className="text-slate-200">Direct Browser Communication:</strong> Your browser communicates directly with Google&apos;s official Gmail API (<code className="text-[#e8c48d]">gmail.googleapis.com</code>). Your Google OAuth access token is stored strictly in your browser&apos;s transient <code className="text-[#e8c48d]">sessionStorage</code> and is never transmitted to or stored on the ScamShield backend.</li>
              </ul>
            </div>

            <div className="border-l-2 border-blue-500/40 pl-4 py-1">
              <h3 className="font-semibold text-white text-base">E. Embedded AI Chat Assistant (/chat)</h3>
              <p className="mt-1 text-slate-400">
                When you interact with the ScamShield AI Assistant, your questions and the most recent ten conversation messages are sent via secure HTTPS to Groq Cloud API for immediate real-time response generation. Chat conversations are not persisted in our database and exist only in your active browser session.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Google Limited Use & API Policy */}
        <section className="p-6 rounded-2xl border border-amber-500/30 bg-[#162232] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-amber-400">
            <Shield size={160} />
          </div>
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <Mail size={20} className="text-[#e8c48d]" />
            3. Google API Services User Data Policy &amp; Limited Use Disclosure
          </h2>
          
          <div className="bg-[#0b131e] p-4 rounded-xl border border-amber-500/20 text-slate-200 mb-4">
            <p className="font-medium text-amber-300 mb-1">Mandatory Google Limited Use Compliance Statement:</p>
            <p className="text-sm leading-relaxed italic">
              &quot;ScamShield&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8c48d] underline hover:text-white inline-flex items-center gap-1"
              >
                Google API Services User Data Policy
                <ExternalLink size={12} />
              </a>
              , including the Limited Use requirements.&quot;
            </p>
          </div>

          <p className="mb-3 text-slate-300">
            In compliance with Google API Services User Data Policy requirements for restricted scopes, we guarantee the following:
          </p>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Strictly Read-Only Access:</strong> We request only the <code className="text-[#e8c48d]">https://www.googleapis.com/auth/gmail.readonly</code> scope. We cannot send emails, delete messages, modify drafts, or alter your account settings.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">No Advertising or Commercial Profiling:</strong> Google user data is never used to serve advertisements, sold to data brokers, or shared with third-party marketing services.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">No Generalized AI Model Training:</strong> Information received through Google APIs is never used to train, retrain, or improve generalized or foundation artificial intelligence and machine learning models.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">No Human Inspection:</strong> No employee, contractor, or developer at ScamShield will read your private emails, except with your explicit written consent for troubleshooting or when strictly required by law.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Restricted Transfer:</strong> Email text is transferred exclusively to Groq Inc.&apos;s API solely to perform the real-time scam classification and explainability requested by the user.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: AI Processing and Subprocessors */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-4 flex items-center gap-2.5">
            <Cpu size={20} className="text-[#e8c48d]" />
            4. AI Inference and Infrastructure Subprocessors
          </h2>
          <p className="mb-4 text-slate-300">
            ScamShield relies on specialized, enterprise-grade cloud service providers to deliver secure scanning and AI-powered insights:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-[#0c1521]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Groq Cloud (LLM Inference)</span>
                <span className="text-xs font-mono text-[#e8c48d]">HTTPS TLS 1.3</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processes job text and email excerpts to detect scam signals, highlight suspicious patterns, and produce explainability reports. Groq processes API inputs transiently and does not retain customer API inputs for foundation model training.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-[#0c1521]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Supabase (Telemetry Database)</span>
                <span className="text-xs font-mono text-[#e8c48d]">Anonymous Metrics</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stores high-level application performance telemetry. Supabase <strong className="text-slate-200">only</strong> receives the prediction verdict (&quot;Scam&quot; or &quot;Genuine&quot;), confidence score, input type (&quot;text&quot;, &quot;pdf&quot;, &quot;image&quot;, &quot;email&quot;), and processing duration. No personal identifiers or text are logged.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-[#0c1521]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Google OAuth 2.0 &amp; Gmail API</span>
                <span className="text-xs font-mono text-[#e8c48d]">Identity &amp; Inbox</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Handles federated user authentication and enables read-only inbox scanning. Authentication tokens remain isolated inside the client browser.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-[#0c1521]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">Microsoft Azure</span>
                <span className="text-xs font-mono text-[#e8c48d]">Cloud Hosting</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hosts ScamShield frontend via Azure Static Web Apps and backend API via Azure Container Apps with automated container isolation and TLS encryption.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Telemetry & What We Do NOT Log */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <Database size={20} className="text-[#e8c48d]" />
            5. Telemetry &amp; Database Logging Verification
          </h2>
          <p className="mb-3 text-slate-300">
            To provide complete transparency, the table below documents the exact data fields transmitted to our Supabase database versus data that is strictly prohibited from storage:
          </p>

          <div className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono">
                  <th className="py-2.5 pr-4">Data Category</th>
                  <th className="py-2.5 px-4">Stored in Database?</th>
                  <th className="py-2.5 pl-4">Description / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Model Verdict</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-mono">YES (Logged)</td>
                  <td className="py-2.5 pl-4 text-slate-400">&quot;Scam&quot; or &quot;Genuine&quot; label for model performance metrics.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Confidence Score</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-mono">YES (Logged)</td>
                  <td className="py-2.5 pl-4 text-slate-400">Numeric confidence percentage (e.g., 96.5%).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Input Modality</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-mono">YES (Logged)</td>
                  <td className="py-2.5 pl-4 text-slate-400">&quot;text&quot;, &quot;pdf&quot;, &quot;image&quot;, or &quot;email&quot;.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium text-white">Processing Latency</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-mono">YES (Logged)</td>
                  <td className="py-2.5 pl-4 text-slate-400">Duration in seconds to monitor infrastructure latency.</td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 pr-4 font-medium text-red-200">Job Description / Text</td>
                  <td className="py-2.5 px-4 text-red-400 font-mono">NEVER STORED</td>
                  <td className="py-2.5 pl-4 text-slate-400">Evaluated in transient memory only; discarded immediately.</td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 pr-4 font-medium text-red-200">PDF &amp; Image Files</td>
                  <td className="py-2.5 px-4 text-red-400 font-mono">NEVER STORED</td>
                  <td className="py-2.5 pl-4 text-slate-400">Purged from disk immediately in Python finally block.</td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 pr-4 font-medium text-red-200">Gmail Message Content</td>
                  <td className="py-2.5 px-4 text-red-400 font-mono">NEVER STORED</td>
                  <td className="py-2.5 pl-4 text-slate-400">Decoded in-browser; analyzed in memory; never saved to database.</td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 pr-4 font-medium text-red-200">OAuth Access Tokens</td>
                  <td className="py-2.5 px-4 text-red-400 font-mono">NEVER STORED</td>
                  <td className="py-2.5 pl-4 text-slate-400">Retained solely in browser sessionStorage; never sent to backend DB.</td>
                </tr>
                <tr className="bg-red-500/5">
                  <td className="py-2.5 pr-4 font-medium text-red-200">Personal Identity &amp; Email</td>
                  <td className="py-2.5 px-4 text-red-400 font-mono">NEVER STORED</td>
                  <td className="py-2.5 pl-4 text-slate-400">No user accounts or email lists are retained in our database.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 6: Data Retention & User Controls */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <Lock size={20} className="text-[#e8c48d]" />
            6. Data Retention, Session Storage &amp; User Controls
          </h2>
          <div className="space-y-3 text-slate-400">
            <p>
              <strong className="text-white">Active Session Storage:</strong> When you sign in with Google, your display name, email, profile picture URL, and access token are placed in your browser&apos;s <code className="text-[#e8c48d]">sessionStorage</code> (<code className="text-[#e8c48d]">scamshield_google_user</code>). This storage is sandbox-isolated to your current browser tab and is purged automatically when you close the tab or window.
            </p>
            <p>
              <strong className="text-white">Immediate Sign-Out:</strong> Clicking the &quot;Sign out&quot; button in ScamShield immediately purges your profile data and access token from browser memory.
            </p>
            <p>
              <strong className="text-white">Revoking Access via Google:</strong> You can permanently disconnect ScamShield and revoke its read-only permissions at any time through your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e8c48d] underline hover:text-white inline-flex items-center gap-1"
              >
                Google Account Security Dashboard
                <ExternalLink size={12} />
              </a>
              .
            </p>
            <p>
              <strong className="text-white">Sample History:</strong> The &quot;History&quot; view in ScamShield presents sample educational demonstration records. Your actual scans are not indexed or stored in persistent user accounts.
            </p>
          </div>
        </section>

        {/* Section 7: Security Architecture */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <Shield size={20} className="text-[#e8c48d]" />
            7. Security Architecture
          </h2>
          <p className="mb-3 text-slate-300">
            We employ modern cybersecurity standards across our frontend and containerized backend infrastructure:
          </p>
          <ul className="space-y-2 text-slate-400 list-disc list-inside pl-2">
            <li><strong className="text-slate-200">HTTPS Encryption in Transit:</strong> All communications between your browser, our Azure Container Apps API, the Google Gmail API, and Groq LLM API are enforced over TLS 1.3 / HTTPS encryption.</li>
            <li><strong className="text-slate-200">Restricted Cross-Origin Resource Sharing (CORS):</strong> API access is strictly limited to authorized production web domains (<code className="text-[#e8c48d]">https://happy-cliff-00cb7b800.4.azurestaticapps.net</code>) and local development ports. Wildcard origin sharing is rejected.</li>
            <li><strong className="text-slate-200">Application Rate Limiting (HTTP 429):</strong> To prevent abuse, brute-force requests, and automated scraping, API endpoints enforce sliding-window rate limits per client IP address.</li>
            <li><strong className="text-slate-200">Ephemeral Execution Sandbox:</strong> File uploads reside only under random UUID temporary paths on a stateless container and are deleted via automated finally handlers.</li>
            <li><strong className="text-slate-200">Frontend Error Boundaries:</strong> Built-in React Error Boundaries prevent sensitive stack trace leaks in production builds.</li>
          </ul>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3">
            8. Children&apos;s Privacy
          </h2>
          <p className="text-slate-400">
            ScamShield is intended for individuals of legal working age seeking employment opportunities. We do not knowingly collect or solicit personal information from individuals under the age of 13. If you believe a minor has provided us with personal information, please contact us immediately.
          </p>
        </section>

        {/* Section 9: Updates to this Policy */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3">
            9. Updates to this Privacy Policy
          </h2>
          <p className="text-slate-400">
            We may periodically update this Privacy Policy to reflect changes in our security architecture, external integrations, or applicable regulatory standards. Any modifications will be posted directly to this page with an updated modification timestamp.
          </p>
        </section>

        {/* Section 10: Contact Us */}
        <section className="p-6 rounded-2xl border border-white/10 bg-[#111c2be8]">
          <h2 className="text-xl font-display font-semibold text-white mb-3 flex items-center gap-2.5">
            <Mail size={20} className="text-[#e8c48d]" />
            10. Contact and Developer Inquiries
          </h2>
          <p className="mb-3 text-slate-400">
            If you have questions, feedback, or security inquiries regarding this Privacy Policy or our data practices, please reach out to the ScamShield development team:
          </p>
          <div className="bg-[#0b131e] p-4 rounded-xl border border-white/10 text-slate-300 text-xs font-mono space-y-1">
            <p><span className="text-slate-500">Project:</span> ScamShield Cyber Defense</p>
            <p><span className="text-slate-500">Repository:</span> <a href="https://github.com/SohamG2696/ScamShield" target="_blank" rel="noopener noreferrer" className="text-[#e8c48d] hover:underline">github.com/SohamG2696/ScamShield</a></p>
            <p><span className="text-slate-500">Developer Contact:</span> <a href="https://github.com/SohamG2696" target="_blank" rel="noopener noreferrer" className="text-[#e8c48d] hover:underline">github.com/SohamG2696</a></p>
          </div>
        </section>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
          <ChevronRight size={14} className="rotate-180" />
          Back to ScamShield Home
        </Link>
        <Link to="/about" className="text-[#e8c48d] hover:underline">
          Understand how the assessment works &rarr;
        </Link>
      </div>
    </div>
  )
}

