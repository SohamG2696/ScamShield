import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Shield, ScanLine, ArrowUpRight, ArrowRight, Activity, TriangleAlert, CheckCheck, FileText, FileUp, Image, Mail, Crosshair, Fingerprint, ChevronRight, Radar, SlidersHorizontal } from 'lucide-react'
import { dummyHistory } from '../utils/dummyData'

const methods = [
  { icon: FileText, name: 'Text analysis', description: 'Inspect a job post or recruiter message.', to: '/app/text', tag: 'PASTE TEXT' },
  { icon: FileUp, name: 'Document scan', description: 'Examine offer letters and PDF attachments.', to: '/app/pdf', tag: 'UPLOAD PDF' },
  { icon: Image, name: 'Image scan', description: 'Uncover red flags hidden in screenshots.', to: '/app/image', tag: 'UPLOAD IMAGE' },
  { icon: Mail, name: 'Email security', description: 'Review suspicious offers in your Gmail.', to: '/app/gmail', tag: 'CONNECT GMAIL' },
]
function PanelTitle({ icon: Icon, title, children }) { return <div className="panel-title"><h2><Icon size={16}/>{title}</h2>{children}</div> }
function Trend({ items }) {
  const dates = [...new Set(items.map(i => i.date))].sort()
  const points = verdict => dates.map((date, i) => `${40 + i * (490 / Math.max(dates.length - 1, 1))},${150 - items.filter(item => item.date <= date && item.verdict === verdict).length * 35}`).join(' ')
  return <svg className="trend-chart" viewBox="0 0 570 192" role="img" aria-label="Cumulative sample scans: flagged and genuine offers by date">
    <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f7b955" stopOpacity=".16"/><stop offset="1" stopColor="#f7b955" stopOpacity="0"/></linearGradient></defs>
    {[0,1,2,3].map(n => <g key={n}><line x1="40" y1={150-n*35} x2="530" y2={150-n*35} stroke="#ffffff0d" strokeDasharray="3 5"/><text x="13" y={154-n*35}>{n}</text></g>)}
    <polygon points={`40,150 ${points('scam')} 530,150`} fill="url(#chartFill)"/>
    <polyline className="chart-line" points={points('scam')} fill="none" stroke="#f4bc66" strokeWidth="2.4" strokeLinejoin="round"/>
    <polyline className="chart-line violet-line" points={points('genuine')} fill="none" stroke="#a078ed" strokeWidth="2.4" strokeLinejoin="round"/>
    {dates.map((d,i)=><text key={d} x={40+i*(490/Math.max(dates.length-1,1))} y="181" textAnchor="middle">{d.slice(5).replace('-', '/')}</text>)}
  </svg>
}
function RadarVisual() { return <div className="radar-visual"><svg viewBox="0 0 240 240" aria-hidden="true"><defs><radialGradient id="radarGlow"><stop stopColor="#f8bc58" stopOpacity=".12"/><stop offset="1" stopColor="#f8bc58" stopOpacity="0"/></radialGradient><linearGradient id="radarSweep"><stop stopColor="#f8bc58" stopOpacity="0"/><stop offset="1" stopColor="#f8bc58" stopOpacity=".2"/></linearGradient></defs><circle cx="120" cy="120" r="112" fill="url(#radarGlow)"/>{[39,68,98].map(r=><circle key={r} cx="120" cy="120" r={r} fill="none" stroke="#d8b46a" strokeOpacity=".16"/>)}<path d="M120 12V228M12 120H228M44 44L196 196M44 196L196 44" stroke="#d8b46a" strokeOpacity=".1"/><g className="radar-sweep"><path d="M120 120L120 22A98 98 0 0 1 218 120Z" fill="url(#radarSweep)"/><path d="M120 120H218" stroke="#f8bc58" strokeOpacity=".6"/></g><circle className="radar-blip" cx="173" cy="66" r="4" fill="#f8bc58"/><circle cx="55" cy="145" r="3" fill="#a078ed"/><circle cx="155" cy="186" r="3" fill="#a078ed"/><path d="M120 91L141 100V119C141 135 120 146 120 146S99 135 99 119V100Z" fill="#17140e" stroke="#f8bc58" strokeWidth="1.7"/><path d="M111 118L118 125L130 111" fill="none" stroke="#f8bc58" strokeWidth="2"/></svg></div> }
export default function Home() {
  const [range, setRange] = useState('all')
  const [filter, setFilter] = useState('all')
  const items = range === 'recent' ? dummyHistory.slice(0,3) : dummyHistory
  const flagged = items.filter(i=>i.verdict==='scam').length
  const genuine = items.length-flagged
  const confidence = Math.round(items.reduce((sum,i)=>sum+i.confidence,0)/items.length*100)
  const rows = items.filter(i=>filter==='all'||i.verdict===filter)
  return <div className="console-dashboard">
    <section className="field-hero" aria-labelledby="overview-title">
      <div className="field-hero-copy">
        <span className="field-kicker"><span aria-hidden="true" /> JOB OFFER INTELLIGENCE</span>
        <h1 id="overview-title">Check a job offer</h1>
        <p>Look for warning signs in a job listing, offer letter, or message from a recruiter.</p>
        <Link to="/app/text" className="field-action"><ScanLine size={17} /> Check listing text <ArrowRight size={16} /></Link>
      </div>
    </section>
    <div id="scan-center" className="section-heading"><h2><Crosshair size={17}/> Scan center</h2><span>04 / SCAN CHANNELS</span></div>
    <div className="scan-method-grid">{methods.map(({icon:Icon,name,description,to,tag},i)=><Link to={to} key={to} className="scan-method"><div className="method-top"><span className="method-icon"><Icon size={21} strokeWidth={1.5}/></span><span className="method-number">/ 0{i+1}</span><ArrowUpRight size={17} className="method-arrow"/></div><h3>{name}</h3><p>{description}</p><div className="method-action">{tag}<ArrowRight size={14}/></div></Link>)}</div>
    <div className="dashboard-toolbar"><div className="section-label"><Activity size={14}/> THREAT INTELLIGENCE <span className="demo-label">DEMO DATA</span></div><label className="range-picker">Sample period <select value={range} onChange={e=>setRange(e.target.value)}><option value="all">All sample scans</option><option value="recent">Latest 3 scans</option></select></label></div>
    <div className="metrics-grid">{[
      [ScanLine,'Total scans',items.length,'Across all scan methods','gold'],[TriangleAlert,'Flagged offers',flagged,'Potential threats identified','gold'],[CheckCheck,'Genuine offers',genuine,'Lower-risk sample results','purple'],[Fingerprint,'Avg. confidence',`${confidence}%`,'Model confidence · sample data','purple'],
    ].map(([Icon,label,value,detail,tone],i)=><section key={label} className={`metric-card ${tone}`} style={{'--order':i}}><div className="metric-label"><Icon size={17}/>{label}<span>0{i+1}</span></div><div className="metric-value">{typeof value==='number'?String(value).padStart(2,'0'):value}<svg viewBox="0 0 90 30" aria-hidden="true"><path d={i%2 ? 'M0 25L12 19L22 22L35 10L45 14L58 5L70 9L90 2' : 'M0 24L12 24L24 16L37 21L50 11L62 14L76 5L90 5'} fill="none" stroke="currentColor" strokeWidth="1.6"/></svg></div><p>{detail}</p><div className="metric-rule"/></section>)}</div>
    <div className="intelligence-grid"><section className="console-panel trend-panel"><PanelTitle icon={Activity} title="Detection activity"><span className="tiny-label">CUMULATIVE SCANS</span></PanelTitle><div className="chart-summary"><strong>{String(items.length).padStart(2,'0')}<span> offers analyzed</span></strong><div className="chart-legend"><span><i/>Flagged</span><span><i/>Genuine</span></div></div><Trend items={items}/><div className="panel-foot"><span>Sample activity · Jul–Aug 2026</span><span>Review. Verify. Proceed.</span></div></section>
    <section className="console-panel radar-panel"><PanelTitle icon={Radar} title="Defense perimeter"><span className="tiny-label">VISUALIZATION</span></PanelTitle><div className="radar-content"><RadarVisual/><div className="radar-copy"><span className="mini-label">KNOW BEFORE YOU TRUST</span><h3>Your next move,<br/>with eyes open.</h3><p>Inspect suspicious job offers before sharing money or personal information.</p><Link to="/app/text">Run a security check <ArrowRight size={14}/></Link></div></div><div className="radar-status"><span><span className="status-dot"/> ON-DEMAND ANALYSIS</span><span>4 SCAN CHANNELS</span></div></section></div>
    <div className="bottom-grid"><section className="console-panel activity-panel"><PanelTitle icon={HistoryIcon} title="Recent investigations"><Link to="/history">View history <ArrowUpRight size={13}/></Link></PanelTitle><div className="activity-controls"><span className="tiny-label">SAMPLE INVESTIGATION LOG</span><div className="filter-tabs" aria-label="Filter sample investigations">{['all','scam','genuine'].map(f=><button key={f} aria-pressed={filter===f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f==='scam'?'Flagged':f==='all'?'All': 'Genuine'}</button>)}</div></div><div className="investigation-table"><table><thead><tr><th>OFFER / SOURCE</th><th>VERDICT</th><th>CONFIDENCE</th><th>DATE</th></tr></thead><tbody>{rows.map(item=><tr key={item.id}><td><div className="offer-cell"><FileText size={16}/><div><strong>{item.title}</strong><small>{item.company} <span> / {item.method.toUpperCase()}</span></small></div></div></td><td><span className={`verdict ${item.verdict}`}><span/>{item.verdict==='scam'?'Flagged':'Genuine'}</span></td><td><div className="confidence-cell"><span>{Math.round(item.confidence*100)}%</span><div><i style={{width:`${item.confidence*100}%`}}/></div></div></td><td className="date-cell">{item.date.slice(5).replace('-',' / ')}</td></tr>)}</tbody></table></div><div className="panel-foot"><span>{rows.length} sample records shown</span><span>Illustrative data, not your scan history</span></div></section>
    <section className="console-panel breakdown-panel"><PanelTitle icon={Shield} title="Risk distribution"/><div className="risk-donut"><svg viewBox="0 0 160 160" role="img" aria-label={`${flagged} flagged and ${genuine} genuine sample offers`}><circle cx="80" cy="80" r="60" fill="none" stroke="#a078ed" strokeWidth="15"/><circle className="donut-arc" cx="80" cy="80" r="60" fill="none" stroke="#f8bc58" strokeWidth="15" strokeDasharray={`${flagged/items.length*377} 377`} transform="rotate(-90 80 80)"/></svg><div><strong>{Math.round(flagged/items.length*100)}<small>%</small></strong><span>FLAGGED OFFERS</span></div></div><div className="distribution-row"><span><i/>Flagged offers</span><strong>{flagged}</strong></div><div className="distribution-row purple"><span><i/>Genuine offers</span><strong>{genuine}</strong></div><div className="insight-note"><TriangleAlert size={16}/><p>A confident prediction is a signal, not a guarantee. Always verify the recruiter independently.</p></div></section></div>
    <Link to="/about" className="learn-strip"><span><Shield size={18}/><strong>Build your human firewall.</strong><span>Learn how ScamShield reads the warning signs.</span></span><ChevronRight size={18}/></Link>
  </div>
}
function HistoryIcon(props) { return <SlidersHorizontal {...props}/> }
