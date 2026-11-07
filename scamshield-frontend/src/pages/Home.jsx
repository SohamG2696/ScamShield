import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, BriefcaseBusiness, Users } from 'lucide-react'
import TextScan from './TextScan'
import ScanNavigation from '../components/layout/ScanNavigation'

const audiences = [
  { icon: GraduationCap, title: 'Students & graduates', description: 'Take a closer look at internships and first-job offers before sharing your details.' },
  { icon: BriefcaseBusiness, title: 'Job seekers', description: 'Review unfamiliar recruiters, remote roles, and offers that arrive out of the blue.' },
  { icon: Users, title: 'Friends & family', description: 'Help someone you care about check a suspicious listing or recruitment message.' },
]

const steps = [
  { title: 'Choose what to check', description: 'Paste a job description or recruiter message. For an attachment, choose PDF or Screenshot. Use Gmail to select an email from your inbox.' },
  { title: 'Run the analysis', description: 'Select Analyze after adding your content. ScamShield reads the text and checks it for patterns associated with recruitment scams.' },
  { title: 'Review and verify', description: "Read the risk assessment and available explanations. Confirm the role through the company's official website or contact details before you proceed." },
]

const questions = [
  { question: 'What should I include in a text scan?', answer: 'Include the role, job description, salary, and any instructions or requests from the recruiter. More relevant context helps the tool assess the posting.' },
  { question: 'Can I check a PDF or screenshot?', answer: 'Yes. Choose PDF for an offer letter or saved listing, or Screenshot for an image of a message or job post. The tool extracts the text for analysis.' },
  { question: 'Do I need to sign in?', answer: 'You can check text, PDFs, and screenshots without signing in. Checking messages from Gmail requires connecting your Google account.' },
  { question: 'Does a lower-risk result prove the offer is genuine?', answer: "A scan identifies patterns in the content. It cannot verify who is behind an offer. Confirm the vacancy and recruiter through the company's official contact details." },
]

export default function Home() {
  return (
    <div className="check-home">
      <header className="check-intro">
        <p className="intro-eyebrow">JOB OFFER CHECKER</p>
        <h1>Check a job offer<br /><span>before your next move</span></h1>
        <p className="intro-description">Paste a listing or upload an offer to look for scam warning signs.</p>
      </header>

      <section className="home-scanner" aria-label="Check a job offer">
        <ScanNavigation />
        <TextScan embedded />
      </section>
      <p className="scanner-help">New to ScamShield? <a href="#how-it-works">See how it works <ArrowRight size={14} aria-hidden="true" /></a></p>

      <section className="tool-overview" aria-labelledby="overview-title">
        <div>
          <h2 id="overview-title">A closer look at the offer,<br />before you put your trust in it.</h2>
          <p>Recruitment scams can look convincing. ScamShield helps you examine a listing or message for suspicious patterns and understand the available risk signals.</p>
          <p>Read the assessment, then verify the employer independently before sharing money or sensitive information.</p>
        </div>
        <aside className="related-checks" aria-labelledby="related-title">
          <h3 id="related-title">MORE WAYS TO CHECK</h3>
          <Link to="/app/pdf"><strong>Offer letters & documents</strong><span>Upload a PDF for a closer look at its contents. <ArrowRight size={15} aria-hidden="true" /></span></Link>
          <Link to="/app/gmail"><strong>Recruitment emails</strong><span>Connect Gmail and select a message to review. <ArrowRight size={15} aria-hidden="true" /></span></Link>
        </aside>
      </section>

      <section className="tool-audiences" aria-labelledby="audience-title">
        <h2 id="audience-title">For anyone considering their next opportunity</h2>
        <div className="audience-list">
          {audiences.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="tool-instructions" aria-labelledby="steps-title">
        <h2 id="steps-title">How it works</h2>
        <p className="section-description">From a suspicious offer to a more informed next step.</p>
        <ol className="scan-steps">
          {steps.map(({ title, description }, index) => (
            <li key={title}>
              <span className="step-number" aria-hidden="true">{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="tool-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Questions about checking job offers</h2>
        <p className="section-description">A few things to know before you scan.</p>
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
        <Link className="about-link" to="/about">Learn more about ScamShield <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>
    </div>
  )
}
