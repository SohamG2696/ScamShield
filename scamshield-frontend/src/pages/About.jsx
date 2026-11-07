const STEPS = [
  {
    title: 'Share the offer',
    description: 'Paste a job listing or recruiter message, upload a PDF or screenshot, or choose an email from Gmail.',
  },
  {
    title: 'Review the assessment',
    description: 'ScamShield analyzes the content for recruitment scam patterns. The result brings together the predicted risk and any available explanation of the warning signs.',
  },
  {
    title: 'Verify before you proceed',
    description: "Check the vacancy on the company's official careers page and contact the company independently. A lower-risk assessment cannot confirm who sent an offer.",
  },
]

export default function About() {
  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-display font-semibold">A second look at the details.</h1>
        <p className="text-slate-400 mt-3">How ScamShield helps you assess a job offer.</p>
      </header>
      <ol className="about-steps">
        {STEPS.map(({ title, description }) => (
          <li key={title}>
            <div><h2>{title}</h2><p>{description}</p></div>
          </li>
        ))}
      </ol>
      <p className="about-note">Be especially cautious about requests for payment or sensitive personal information before you have verified the employer. Use the assessment to inform your next step.</p>
    </div>
  )
}
