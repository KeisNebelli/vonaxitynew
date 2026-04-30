import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  primary: '#2563EB', primaryLight: '#EFF6FF', primaryDark: '#1D4ED8',
  secondary: '#059669', secondaryLight: '#ECFDF5',
  bg: '#FAFAF9', bgWhite: '#FFFFFF', bgSubtle: '#F5F5F4',
  textPrimary: '#111827', textSecondary: '#6B7280', textTertiary: '#9CA3AF',
  border: '#E5E7EB', borderSubtle: '#F3F4F6',
  warning: '#D97706', warningLight: '#FFFBEB',
};

const LAUNCH_CITIES = [
  {
    name: 'Tirana',
    icon: '🏛️',
    stat1: { en: 'Albania\'s capital', sq: 'Kryeqyteti' },
    stat2: { en: 'Largest nurse network', sq: 'Rrjeti më i madh' },
    gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    accentColor: '#2563EB',
    accentLight: '#DBEAFE',
  },
  {
    name: 'Durrës',
    icon: '🌊',
    stat1: { en: 'Coastal hub', sq: 'Qendra bregdetare' },
    stat2: { en: 'Full coverage at launch', sq: 'Mbulim i plotë' },
    gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    accentColor: '#059669',
    accentLight: '#D1FAE5',
  },
];

const DEFAULT_PRICING = { basicPrice: 30, standardPrice: 50, premiumPrice: 120, basicVisits: 1, standardVisits: 2, premiumVisits: 4 };



const TRUST_ICONS = [<ShieldIcon />, <CheckIcon />, <HomeIcon />, <GlobeIcon />];

function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function HomeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function GlobeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>;
}
function HeartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
}
function ActivityIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function ClipboardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>;
}
function DropletIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>;
}
function UsersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function FileTextIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function WarningIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

const SERVICE_ITEMS = [
  { Icon: ActivityIcon, titleKey: 0, descKey: 0 },
  { Icon: DropletIcon, titleKey: 1, descKey: 1 },
  { Icon: HeartIcon, titleKey: 2, descKey: 2 },
  { Icon: ClipboardIcon, titleKey: 3, descKey: 3 },
  { Icon: UsersIcon, titleKey: 4, descKey: 4 },
  { Icon: FileTextIcon, titleKey: 5, descKey: 5 },
];

const TAG = ({ children }) => (
  <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.primary, background: C.primaryLight, padding: '5px 12px', borderRadius: '99px', marginBottom: 16 }}>
    {children}
  </div>
);

export default async function HomePage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');
  const faqs = t(lang, 'faq.items');
  const steps = t(lang, 'howItWorks.steps');
  const trustTexts = t(lang, 'hero.trustItems') || [];
  const TRUST_ITEMS = trustTexts.map((item, i) => ({ ...item, icon: TRUST_ICONS[i] }));

  const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
  let pricing = DEFAULT_PRICING;
  try {
    const res = await fetch(`${BASE}/settings/public`, { next: { revalidate: 300 } });
    if (res.ok) pricing = await res.json();
  } catch {}

  const PLANS = [
    { name: 'Basic',    price: `€${pricing.basicPrice}`,    visits: pricing.basicVisits,    featured: false },
    { name: 'Standard', price: `€${pricing.standardPrice}`, visits: pricing.standardVisits, featured: true  },
    { name: 'Premium',  price: `€${pricing.premiumPrice}`,  visits: pricing.premiumVisits,  featured: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg }}>
      <style>{`
        .hp-hero-btn-primary{transition:all 0.18s ease;background:linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%)!important;}
        .hp-hero-btn-primary:hover{background:linear-gradient(135deg,#1D4ED8 0%,#1E40AF 100%)!important;box-shadow:0 6px 22px rgba(37,99,235,0.5)!important;transform:translateY(-1px)}
        .hp-hero-btn-secondary{transition:all 0.18s ease;}
        .hp-hero-btn-secondary:hover{background:#F8FAFF!important;border-color:#2563EB!important;color:#1D4ED8!important;transform:translateY(-1px)}
        .hp-step-card{transition:all 0.2s ease;}
        .hp-step-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(37,99,235,0.1)!important;border-top-color:#1D4ED8!important;}
        .hp-service-card{transition:all 0.2s ease;}
        .hp-service-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.09)!important;}
        .hp-pricing-card{transition:all 0.2s ease;}
        .hp-pricing-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(37,99,235,0.15)!important;}
        .hp-pricing-btn-outline{transition:all 0.18s ease;}
        .hp-pricing-btn-outline:hover{background:#2563EB!important;color:#fff!important;}
        .hp-pricing-btn-featured{transition:all 0.18s ease;}
        .hp-pricing-btn-featured:hover{background:#1D4ED8!important;}
        .hp-city-card{transition:all 0.18s ease;}
        .hp-city-card:hover{background:#EFF6FF!important;border-color:#BFDBFE!important;}
        .hp-faq-card{transition:all 0.2s ease;}
        .hp-faq-card:hover{border-color:#BFDBFE!important;box-shadow:0 4px 16px rgba(37,99,235,0.06)!important;}
        .hp-cta-btn{transition:all 0.18s ease;}
        .hp-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;}

        /* ── Medical background animations ── */
        @keyframes hp-orb1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(22px,-16px) scale(1.06)}66%{transform:translate(-10px,14px) scale(0.96)}}
        @keyframes hp-orb2{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-18px,22px) scale(1.04)}80%{transform:translate(14px,-10px) scale(0.97)}}
        @keyframes hp-orb3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(12px,16px) scale(1.05)}}
        @keyframes hp-orb4{0%,100%{transform:translate(0,0)}50%{transform:translate(-14px,-12px)}}
        @keyframes hp-ekg{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes hp-ekg-rev{0%{transform:translateX(0)}100%{transform:translateX(50%)}}
        @keyframes hp-pulse-dot{0%,100%{opacity:0.5;transform:scale(1)}50%{opacity:0.85;transform:scale(1.15)}}
        @keyframes hp-pulse-ring1{0%{transform:scale(1);opacity:0.35}100%{transform:scale(2.8);opacity:0}}
        @keyframes hp-pulse-ring2{0%{transform:scale(1);opacity:0.2}100%{transform:scale(4);opacity:0}}
        @keyframes hp-cross-drift{0%,100%{transform:translate(0,0) rotate(0deg);opacity:0.04}50%{transform:translate(6px,-8px) rotate(8deg);opacity:0.07}}
        @keyframes hp-cross-drift2{0%,100%{transform:translate(0,0) rotate(0deg);opacity:0.035}50%{transform:translate(-8px,6px) rotate(-6deg);opacity:0.06}}
        @keyframes hp-grid-pulse{0%,100%{opacity:0.025}50%{opacity:0.045}}
        @media(prefers-reduced-motion:reduce){
          .hp-orb,.hp-ekg-wrap,.hp-pulse-wrap,.hp-cross,.hp-dot-grid,.hp-pulse-ring{animation:none!important;}
        }
      `}</style>
      {/* ══ Page-wide medical background — fixed layer ══ */}
      <div aria-hidden="true" style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>

        {/* Soft glow orbs — slowly drifting */}
        <div className="hp-orb" style={{ position:'absolute', top:'4vh', right:'6%', width:520, height:520, borderRadius:'50%', background:'radial-gradient(circle at 45% 40%, rgba(37,99,235,0.08), transparent 65%)', filter:'blur(64px)', animation:'hp-orb1 18s ease-in-out infinite' }} />
        <div className="hp-orb" style={{ position:'absolute', top:'36vh', left:'1%', width:440, height:440, borderRadius:'50%', background:'radial-gradient(circle at 55% 55%, rgba(20,184,166,0.07), transparent 65%)', filter:'blur(56px)', animation:'hp-orb2 24s ease-in-out infinite 1s' }} />
        <div className="hp-orb" style={{ position:'absolute', top:'62vh', right:'18%', width:380, height:380, borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.06), transparent 65%)', filter:'blur(50px)', animation:'hp-orb3 20s ease-in-out infinite 2s' }} />
        <div className="hp-orb" style={{ position:'absolute', bottom:'8vh', left:'12%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.06), transparent 65%)', filter:'blur(44px)', animation:'hp-orb4 22s ease-in-out infinite 3s' }} />
        <div className="hp-orb" style={{ position:'absolute', top:'50vh', right:'3%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(20,184,166,0.05), transparent 65%)', filter:'blur(36px)', animation:'hp-orb1 28s ease-in-out infinite 5s' }} />

        {/* EKG line 1 — upper third of screen */}
        <div className="hp-ekg-wrap" style={{ position:'absolute', top:'28vh', left:0, width:'200%', height:52, animation:'hp-ekg 30s linear infinite', willChange:'transform' }}>
          <svg width="100%" height="52" viewBox="0 0 2400 52" preserveAspectRatio="none" style={{ display:'block' }}>
            <path d="M0,26 L90,26 L110,26 L124,10 L133,42 L142,4 L151,48 L160,26 L178,22 L190,26 L360,26 L380,26 L394,10 L403,42 L412,4 L421,48 L430,26 L448,22 L460,26 L630,26 L650,26 L664,10 L673,42 L682,4 L691,48 L700,26 L718,22 L730,26 L900,26 L920,26 L934,10 L943,42 L952,4 L961,48 L970,26 L988,22 L1000,26 L1200,26 L1290,26 L1310,26 L1324,10 L1333,42 L1342,4 L1351,48 L1360,26 L1378,22 L1390,26 L1560,26 L1580,26 L1594,10 L1603,42 L1612,4 L1621,48 L1630,26 L1648,22 L1660,26 L1830,26 L1850,26 L1864,10 L1873,42 L1882,4 L1891,48 L1900,26 L1918,22 L1930,26 L2100,26 L2120,26 L2134,10 L2143,42 L2152,4 L2161,48 L2170,26 L2188,22 L2200,26 L2400,26"
              fill="none" stroke="rgba(37,99,235,0.09)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* EKG line 2 — lower two-thirds — slightly different rhythm, reverse direction */}
        <div className="hp-ekg-wrap" style={{ position:'absolute', top:'68vh', left:'-100%', width:'200%', height:52, animation:'hp-ekg-rev 38s linear infinite', willChange:'transform' }}>
          <svg width="100%" height="52" viewBox="0 0 2400 52" preserveAspectRatio="none" style={{ display:'block' }}>
            <path d="M0,26 L120,26 L140,26 L155,8 L164,44 L173,2 L182,50 L191,26 L210,21 L224,26 L450,26 L470,26 L485,8 L494,44 L503,2 L512,50 L521,26 L540,21 L554,26 L780,26 L800,26 L815,8 L824,44 L833,2 L842,50 L851,26 L870,21 L884,26 L1100,26 L1120,26 L1135,8 L1144,44 L1153,2 L1162,50 L1171,26 L1190,21 L1204,26 L1320,26 L1440,26 L1455,8 L1464,44 L1473,2 L1482,50 L1491,26 L1510,21 L1524,26 L1740,26 L1760,26 L1775,8 L1784,44 L1793,2 L1802,50 L1811,26 L1830,21 L1844,26 L2060,26 L2080,26 L2095,8 L2104,44 L2113,2 L2122,50 L2131,26 L2150,21 L2164,26 L2400,26"
              fill="none" stroke="rgba(20,184,166,0.07)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Pulse dots — scattered at various viewport positions */}
        <div className="hp-pulse-wrap" style={{ position:'absolute', top:'18vh', right:'22%', width:10, height:10 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(37,99,235,0.5)', animation:'hp-pulse-dot 3s ease-in-out infinite' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(37,99,235,0.25)', animation:'hp-pulse-ring1 3s ease-out infinite' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(37,99,235,0.1)', animation:'hp-pulse-ring2 3s ease-out infinite 0.6s' }} />
        </div>
        <div className="hp-pulse-wrap" style={{ position:'absolute', top:'48vh', left:'6%', width:8, height:8 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(20,184,166,0.45)', animation:'hp-pulse-dot 4s ease-in-out infinite 1.5s' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(20,184,166,0.2)', animation:'hp-pulse-ring1 4s ease-out infinite 1.5s' }} />
        </div>
        <div className="hp-pulse-wrap" style={{ position:'absolute', top:'78vh', right:'10%', width:9, height:9 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(37,99,235,0.4)', animation:'hp-pulse-dot 3.5s ease-in-out infinite 0.8s' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(37,99,235,0.2)', animation:'hp-pulse-ring1 3.5s ease-out infinite 0.8s' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(37,99,235,0.08)', animation:'hp-pulse-ring2 3.5s ease-out infinite 1.2s' }} />
        </div>
        <div className="hp-pulse-wrap" style={{ position:'absolute', bottom:'20vh', left:'28%', width:7, height:7 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(124,58,237,0.35)', animation:'hp-pulse-dot 5s ease-in-out infinite 2s' }} />
          <div className="hp-pulse-ring" style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1px solid rgba(124,58,237,0.18)', animation:'hp-pulse-ring1 5s ease-out infinite 2s' }} />
        </div>

        {/* Floating medical crosses */}
        <div className="hp-cross" style={{ position:'absolute', top:'12vh', left:'58%', animation:'hp-cross-drift 16s ease-in-out infinite' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity:0.055 }}>
            <rect x="9" y="2" width="6" height="20" rx="2" fill="#2563EB"/>
            <rect x="2" y="9" width="20" height="6" rx="2" fill="#2563EB"/>
          </svg>
        </div>
        <div className="hp-cross" style={{ position:'absolute', top:'42vh', right:'8%', animation:'hp-cross-drift2 20s ease-in-out infinite 1s' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity:0.045 }}>
            <rect x="9" y="2" width="6" height="20" rx="2" fill="#2563EB"/>
            <rect x="2" y="9" width="20" height="6" rx="2" fill="#2563EB"/>
          </svg>
        </div>
        <div className="hp-cross" style={{ position:'absolute', top:'72vh', left:'4%', animation:'hp-cross-drift 22s ease-in-out infinite 3s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity:0.04 }}>
            <rect x="9" y="2" width="6" height="20" rx="2" fill="#14B8A6"/>
            <rect x="2" y="9" width="20" height="6" rx="2" fill="#14B8A6"/>
          </svg>
        </div>
        <div className="hp-cross" style={{ position:'absolute', bottom:'15vh', right:'35%', animation:'hp-cross-drift2 18s ease-in-out infinite 4s' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity:0.04 }}>
            <rect x="9" y="2" width="6" height="20" rx="2" fill="#2563EB"/>
            <rect x="2" y="9" width="20" height="6" rx="2" fill="#2563EB"/>
          </svg>
        </div>

        {/* Dot grid — covers entire viewport */}
        <svg className="hp-dot-grid" style={{ position:'absolute', inset:0, width:'100%', height:'100%', animation:'hp-grid-pulse 10s ease-in-out infinite' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="med-dots-page" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(37,99,235,0.28)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#med-dots-page)" />
        </svg>
      </div>

      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding: '80px 24px 96px', background: 'linear-gradient(150deg, #FFFFFF 0%, #EFF6FF 100%)', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <TAG>{t(lang, 'hero.badge')}</TAG>
            <h1 style={{ fontSize: 'clamp(38px,5vw,56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px', color: C.textPrimary, margin: '0 0 20px' }}>
              {t(lang, 'hero.headline1')}<br />
              <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{t(lang, 'hero.headline2')}</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.textSecondary, maxWidth: 480, margin: '0 0 36px' }}>
              {t(lang, 'hero.subtitle')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href={`/${lang}/signup`}>
                <button className="hp-hero-btn-primary" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#fff', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}>
                  {t(lang, 'hero.cta1')}
                </button>
              </Link>
              <Link href={`/${lang}/how-it-works`}>
                <button className="hp-hero-btn-secondary" style={{ fontSize: 15, fontWeight: 600, padding: '13px 28px', borderRadius: 10, border: `2px solid ${C.border}`, background: 'rgba(255,255,255,0.8)', color: C.textPrimary, cursor: 'pointer' }}>
                  {t(lang, 'hero.cta2')}
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              {[['500+', t(lang, 'hero.stat1')], ['8', t(lang, 'hero.stat2')], ['100%', t(lang, 'hero.stat3')]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: C.primary, letterSpacing: '-1.5px' }}>{n}</div>
                  <div style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero photo + floating card */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
              <img
                src="/hero.jpg"
                alt="Nurse visiting patient at home"
                style={{ width: '100%', height: 'clamp(260px, 40vw, 460px)', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Floating info card over the photo */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '16px 18px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Fatmira Murati</div>
                  <div style={{ fontSize: 12, color: C.textTertiary }}>Tirana · Age 74</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.secondary, background: C.secondaryLight, padding: '4px 10px', borderRadius: 99 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.secondary }} />
                  {t(lang, 'hero.visitToday')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  [t(lang, 'hero.nurseLabel'), 'Elona Berberi', true],
                  [t(lang, 'hero.timeLabel'), '10:00 AM', false],
                  [t(lang, 'hero.serviceLabel'), 'BP + glucose', false],
                ].map(([k, v, blue]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: C.textTertiary, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: blue ? C.primary : C.textPrimary }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ background: C.bgWhite, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(37,99,235,0.12)' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{item.title}</div>
                <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 2 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <TAG>{t(lang, 'howItWorks.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'howItWorks.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {Array.isArray(steps) && steps.slice(0, 4).map((s, i) => (
              <div key={i} className="hp-step-card" style={{ background: C.bgWhite, borderRadius: 18, border: `1px solid ${C.border}`, borderTop: `3px solid ${C.primary}`, padding: '28px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: C.primary, letterSpacing: '0.5px', marginBottom: 12, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <TAG>{t(lang, 'services.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'services.title')}</h2>
            <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 480 }}>{t(lang, 'services.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16 }}>
            {SERVICE_ITEMS.map(({ Icon, titleKey }, i) => (
              <div key={i} className="hp-service-card" style={{ background: C.bgWhite, borderRadius: 16, border: `1px solid ${C.border}`, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 1px 4px rgba(37,99,235,0.12)' }}>
                  <Icon />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>
                  {Array.isArray(services) && services[i]?.title}
                </div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>
                  {Array.isArray(services) && services[i]?.desc}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, background: C.warningLight, border: `1px solid #FDE68A`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><WarningIcon /></div>
            <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              <strong>{t(lang, 'services.nonEmergencyStrong')}</strong> {t(lang, 'services.emergency')} <strong>127</strong> {t(lang, 'services.immediately')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '80px 24px', background: C.primaryLight }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <TAG>{t(lang, 'pricing.tag')}</TAG>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'pricing.title')}</h2>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 48 }}>{t(lang, 'pricing.subtitle')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.name} className="hp-pricing-card" style={{ background: C.bgWhite, borderRadius: 18, border: p.featured ? `2px solid ${C.primary}` : `1px solid ${C.border}`, padding: '28px 24px', position: 'relative', boxShadow: p.featured ? '0 8px 32px rgba(37,99,235,0.18)' : '0 2px 8px rgba(0,0,0,0.04)' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.primary, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
                    {t(lang, 'pricing.mostPopular')}
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textTertiary, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 44, fontWeight: 700, color: C.textPrimary, letterSpacing: '-2px', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: C.textTertiary, marginBottom: 16 }}>{t(lang, 'pricing.perMonth')}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.primary, background: C.primaryLight, display: 'inline-block', padding: '4px 12px', borderRadius: 99, marginBottom: 24 }}>
                  {p.visits} {p.visits === 1 ? t(lang, 'pricing.visitMonth') : t(lang, 'pricing.visitsMonth')}
                </div>
                <br />
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button className={p.featured ? 'hp-pricing-btn-featured' : 'hp-pricing-btn-outline'} style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured ? 'none' : `2px solid ${C.primary}`, background: p.featured ? C.primary : 'transparent', color: p.featured ? '#fff' : C.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {t(lang, 'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 10 }}>{t(lang, 'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities ── */}
      <section style={{ padding:'96px 24px', background:'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <TAG>{t(lang,'cities.tag')}</TAG>
            <h2 style={{ fontSize:'clamp(30px,4vw,46px)', fontWeight:800, color:C.textPrimary, margin:'0 0 16px', letterSpacing:'-1.5px' }}>
              {t(lang,'cities.title')}
            </h2>
            <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
              {t(lang,'cities.subtitle')}
            </p>
          </div>

          {/* Launch city cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24, maxWidth:780, margin:'0 auto 24px' }}>
            {LAUNCH_CITIES.map(city => (
              <div key={city.name} style={{
                background: city.gradient,
                borderRadius: 20,
                border: `1.5px solid ${city.accentColor}22`,
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 4px 32px ${city.accentColor}18`,
              }}>
                {/* Launch badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: city.accentColor,
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  padding: '5px 12px',
                  borderRadius: 99,
                  marginBottom: 20,
                  textTransform: 'uppercase',
                }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.7)', display:'inline-block', animation:'pulse 2s infinite' }}/>
                  {t(lang,'cities.launchBadge')}
                </div>

                {/* City name */}
                <div style={{ fontSize: 36, fontWeight: 800, color: C.textPrimary, letterSpacing: '-1.5px', lineHeight: 1, marginBottom: 8 }}>
                  {city.name}
                </div>

                {/* Stats */}
                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[city.stat1, city.stat2].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: city.accentColor, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: city.accentColor }}>
                        {stat[lang] || stat.en}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Decorative map-pin */}
                <div style={{ position: 'absolute', bottom: 20, right: 24, opacity: 0.08 }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill={city.accentColor} stroke="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Coming soon strip */}
          <div style={{ maxWidth: 780, margin: '0 auto', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.textTertiary, whiteSpace: 'nowrap' }}>
                {t(lang,'cities.comingSoonLabel')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
              {['Elbasan','Fier','Berat','Sarandë','Shkodër','Kukës'].map(c => (
                <span key={c} style={{ fontSize: 12, fontWeight: 600, color: C.textSecondary, background: C.bgWhite, border: `1px solid ${C.border}`, borderRadius: 99, padding: '4px 12px' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <TAG>{t(lang, 'faq.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-1px' }}>{t(lang, 'faq.title')}</h2>
          </div>
          {Array.isArray(faqs) && faqs.slice(0, 4).map((f, i) => (
            <div key={i} className="hp-faq-card" style={{ background: C.bgWhite, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 22px', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href={`/${lang}/faq`} style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{t(lang, 'faq.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-1.5px' }}>{t(lang, 'cta.title')}</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>{t(lang, 'cta.subtitle')}</p>
        <Link href={`/${lang}/signup`}>
          <button className="hp-cta-btn" style={{ background: '#fff', color: '#1E3A5F', border: 'none', borderRadius: 10, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            {t(lang, 'cta.btn1')}
          </button>
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
