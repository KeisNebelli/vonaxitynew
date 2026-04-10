import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';
import { StepIcon, TrustIcon } from '@/components/visuals/StepIcons';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const TRUST = [
  { type:'shield', title:'Licensed nurses', sub:'Every nurse holds a valid Albanian nursing license' },
  { type:'check', title:'Background checked', sub:'Criminal record check before joining Vonaxity' },
  { type:'heart', title:'Compassionate care', sub:'Trained to work with elderly and vulnerable patients' },
  { type:'star', title:'Rated by families', sub:'Average rating of 4.8 stars from client families' },
  { type:'globe', title:'International families', sub:'Supporting diaspora from UK, Italy, Germany & more' },
  { type:'home', title:'Home visits only', sub:'We come to your loved one. No travel required.' },
];

export default function HowItWorksPage({ params }) {
  const lang = params.lang || 'en';
  const steps = t(lang, 'howItWorks.steps');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />

      {/* Hero with AI-style illustration */}
      <section style={{ background:'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #1D4ED8 100%)', padding:'80px 24px', overflow:'hidden', position:'relative' }}>
        {/* Background geometric pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.07 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', position:'relative' }}>
          {/* Left - text */}
          <div>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.9)', background:'rgba(37,99,235,0.3)', padding:'6px 14px', borderRadius:99, marginBottom:20, border:'1px solid rgba(147,197,253,0.2)' }}>{t(lang,'howItWorks.tag')}</div>
            <h1 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:20 }}>{t(lang,'howItWorks.title')}</h1>
            <p style={{ fontSize:17, color:'rgba(255,255,255,0.65)', lineHeight:1.75, marginBottom:32, maxWidth:440 }}>{t(lang,'howItWorks.subtitle')||{en:'Book online, we assign a nurse, you receive health reports after every visit.',sq:'Rezervoni online, ne caktojmë infermieren, ju merrni raporte shëndetësore pas çdo vizite.'}[lang]||'Book online, we assign a nurse, you receive health reports after every visit.'}</p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <Link href={`/${lang}/signup`}><button style={{ background:'#2563EB', color:'#fff', border:'none', borderRadius:10, padding:'13px 28px', fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 20px rgba(37,99,235,0.4)' }}>{t(lang,'cta.btn1')}</button></Link>
              <Link href={`/${lang}/pricing`}><button style={{ background:'rgba(255,255,255,0.08)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'13px 28px', fontSize:14, fontWeight:600, cursor:'pointer' }}>View plans</button></Link>
            </div>
          </div>

          {/* Right - AI-style illustration */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
            <svg viewBox="0 0 420 380" width="420" height="380" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth:'100%' }}>
              {/* Background glow */}
              <defs>
                <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#059669" stopOpacity="0"/>
                </radialGradient>
                <filter id="blur1">
                  <feGaussianBlur stdDeviation="8"/>
                </filter>
              </defs>

              {/* Glow blobs */}
              <ellipse cx="210" cy="190" rx="160" ry="140" fill="url(#glow1)" filter="url(#blur1)"/>
              <ellipse cx="310" cy="120" rx="80" ry="70" fill="url(#glow2)" filter="url(#blur1)"/>

              {/* Central phone/device */}
              <rect x="155" y="60" width="110" height="200" rx="20" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
              <rect x="163" y="75" width="94" height="150" rx="10" fill="rgba(37,99,235,0.2)"/>
              {/* Screen content lines */}
              <rect x="172" y="88" width="60" height="6" rx="3" fill="rgba(255,255,255,0.5)"/>
              <rect x="172" y="100" width="76" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
              <rect x="172" y="110" width="50" height="4" rx="2" fill="rgba(255,255,255,0.25)"/>
              {/* Health data bars */}
              <rect x="172" y="124" width="76" height="1" rx="1" fill="rgba(255,255,255,0.1)"/>
              <rect x="172" y="132" width="45" height="8" rx="4" fill="rgba(5,150,105,0.6)"/>
              <rect x="172" y="146" width="60" height="8" rx="4" fill="rgba(37,99,235,0.6)"/>
              <rect x="172" y="160" width="35" height="8" rx="4" fill="rgba(5,150,105,0.4)"/>
              {/* Pulse line */}
              <polyline points="172,195 184,195 190,178 198,210 206,178 214,195 226,195 232,185 240,195 248,195" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

              {/* Floating cards */}
              {/* Card 1 - top left */}
              <g transform="translate(20, 80)">
                <rect width="110" height="62" rx="14" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                <circle cx="22" cy="22" r="12" fill="rgba(37,99,235,0.4)"/>
                <line x1="16" y1="22" x2="28" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22" y1="16" x2="22" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <rect x="40" y="14" width="55" height="5" rx="2.5" fill="rgba(255,255,255,0.4)"/>
                <rect x="40" y="24" width="40" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
                <rect x="14" y="44" width="82" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
              </g>

              {/* Card 2 - top right */}
              <g transform="translate(290, 50)">
                <rect width="108" height="58" rx="14" fill="rgba(5,150,105,0.15)" stroke="rgba(52,211,153,0.3)" strokeWidth="1"/>
                <circle cx="20" cy="20" r="10" fill="rgba(5,150,105,0.5)"/>
                <polyline points="13,20 18,25 27,14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="38" y="13" width="55" height="5" rx="2.5" fill="rgba(255,255,255,0.4)"/>
                <rect x="38" y="23" width="38" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
                <rect x="12" y="40" width="80" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
              </g>

              {/* Card 3 - bottom right */}
              <g transform="translate(285, 270)">
                <rect width="118" height="68" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                <rect x="12" y="12" width="94" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
                <rect x="12" y="22" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                {/* Mini chart */}
                <polyline points="12,52 28,42 44,48 60,36 76,44 92,38 106,44" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </g>

              {/* Card 4 - bottom left */}
              <g transform="translate(18, 280)">
                <rect width="112" height="60" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                <rect x="12" y="12" width="50" height="5" rx="2.5" fill="rgba(255,255,255,0.4)"/>
                <rect x="12" y="24" width="88" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                <rect x="12" y="33" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
                <rect x="12" y="45" width="40" height="8" rx="4" fill="rgba(37,99,235,0.5)"/>
                <rect x="14" y="47" width="36" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
              </g>

              {/* Connecting dots/lines */}
              <circle cx="130" cy="111" r="3" fill="rgba(255,255,255,0.3)"/>
              <circle cx="155" cy="140" r="2" fill="rgba(255,255,255,0.2)"/>
              <circle cx="294" cy="108" r="3" fill="rgba(52,211,153,0.4)"/>
              <circle cx="270" cy="150" r="2" fill="rgba(255,255,255,0.2)"/>
              <circle cx="130" cy="299" r="3" fill="rgba(255,255,255,0.2)"/>
              <circle cx="155" cy="275" r="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="285" cy="299" r="3" fill="rgba(96,165,250,0.4)"/>
              <circle cx="265" cy="272" r="2" fill="rgba(255,255,255,0.15)"/>

              {/* Notification dot */}
              <circle cx="265" cy="65" r="8" fill="#EF4444"/>
              <text x="265" y="69" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">3</text>
            </svg>
          </div>
        </div>
      </section>

      <section style={{ padding:'64px 24px', background:C.bg }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:60 }}>
            {Array.isArray(steps) && steps.map((s,i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'28px 24px' }}>
                <div style={{ marginBottom:18 }}><StepIcon step={s.num} size={52} /></div>
                <div style={{ display:'inline-block', fontSize:11, fontWeight:700, color:C.primary, letterSpacing:'1.5px', background:C.primaryLight, padding:'3px 10px', borderRadius:99, marginBottom:12 }}>STEP {s.num}</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary, marginBottom:10, lineHeight:1.4 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Trust section */}
          <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px', marginBottom:40 }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99, marginBottom:12 }}>Why trust us</div>
              <h2 style={{ fontSize:28, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', margin:0 }}>Built on trust, verified at every step</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
              {TRUST.map((item,i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <TrustIcon type={item.type} size={44} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:C.textTertiary, lineHeight:1.6 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'#1E3A5F', borderRadius:18, padding:'40px', textAlign:'center' }}>
            <h2 style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:12 }}>{t(lang,'cta.title')}</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:28 }}>{t(lang,'cta.subtitle')}</p>
            <Link href={`/${lang}/signup`}><button style={{ background:'#fff', color:'#1E3A5F', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer' }}>{t(lang,'cta.btn1')}</button></Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
