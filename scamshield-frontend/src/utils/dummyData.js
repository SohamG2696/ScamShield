// Placeholder data. Replace with live responses once /predict/* and the
// Groq-powered explanation endpoint are connected.

export const dummyHistory = [
  {
    id: 'scn_1042',
    title: 'Remote Data Entry Clerk — $45/hr',
    company: 'Global Reach Logistics',
    date: '2026-08-03',
    verdict: 'scam',
    confidence: 0.94,
    method: 'text',
  },
  {
    id: 'scn_1041',
    title: 'Senior Backend Engineer',
    company: 'Fernbank Health',
    date: '2026-08-02',
    verdict: 'genuine',
    confidence: 0.88,
    method: 'pdf',
  },
  {
    id: 'scn_1040',
    title: 'Product Photography — Work From Home',
    company: 'BrightLeaf Media',
    date: '2026-08-01',
    verdict: 'scam',
    confidence: 0.97,
    method: 'image',
  },
  {
    id: 'scn_1039',
    title: 'UX Researcher, Contract',
    company: 'Northwind Studio',
    date: '2026-07-30',
    verdict: 'genuine',
    confidence: 0.81,
    method: 'text',
  },
  {
    id: 'scn_1038',
    title: 'Shipping Coordinator — Immediate Start',
    company: 'Anchor & Crate Co.',
    date: '2026-07-29',
    verdict: 'scam',
    confidence: 0.9,
    method: 'pdf',
  },
  {
    id: 'scn_1037',
    title: 'Junior Financial Analyst',
    company: 'Meridian Capital Partners',
    date: '2026-07-27',
    verdict: 'genuine',
    confidence: 0.76,
    method: 'text',
  },
]

export const dummyReasonsScam = [
  { label: 'Requests payment or "processing fee" upfront', weight: 0.31 },
  { label: 'Salary is significantly above market for the role', weight: 0.24 },
  { label: 'Recruiter uses a free email domain, not a company one', weight: 0.19 },
  { label: 'Urgency pressure — "hire today, start tomorrow"', weight: 0.15 },
  { label: 'Interview conducted entirely over chat, no verification', weight: 0.11 },
]

export const dummyReasonsGenuine = [
  { label: 'Company domain matches a verifiable, registered business', weight: 0.28 },
  { label: 'Salary range is consistent with market rate', weight: 0.22 },
  { label: 'Job description matches standard postings for this role', weight: 0.2 },
  { label: 'No upfront payment or personal financial info requested', weight: 0.18 },
  { label: 'Application flows through a standard ATS', weight: 0.12 },
]

export function makeDummyResult(verdict = 'scam') {
  const isScam = verdict === 'scam'
  return {
    verdict,
    confidence: isScam ? 0.93 : 0.86,
    riskLevel: isScam ? 'High' : 'Low',
    probabilities: { scam: isScam ? 0.93 : 0.14, genuine: isScam ? 0.07 : 0.86 },
    reasons: isScam ? dummyReasonsScam : dummyReasonsGenuine,
    recommendation: isScam
      ? 'Do not respond or share personal information. Report the listing to the platform it was posted on.'
      : 'This posting shows the markers of a legitimate listing. Still verify the recruiter and company independently before sharing sensitive documents.',
  }
}
