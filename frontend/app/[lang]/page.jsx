import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/HeroSection';
import OrganicBackground from '@/components/OrganicBackground';
import ScrollReveal from '@/components/ScrollReveal';
import HowItWorksSection from '@/components/HowItWorksSection';
import ServiceCardsSection from '@/components/ServiceCardsSection';
import LandingChat from '@/components/chat/LandingChat';
import WellnessTicker from '@/components/WellnessTicker';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  primary: '#2563EB', primaryLight: '#EFF6FF', primaryDark: '#1E6FAB',
  secondary: '#0D9488', secondaryLight: '#F0FDFB',
  bg: '#FAF8F5', bgWhite: '#FFFFFF', bgSubtle: '#F2EDE8',
  textPrimary: '#1A2B3C', textSecondary: '#5D7070', textTertiary: '#9CA3A0',
  border: '#E8DFD4', borderSubtle: '#F0EDE8',
  warning: '#D97706', warningLight: '#FFFBEB',
};

const LAUNCH_CITIES = [
  {
    name: 'Tirana',
    nameSq: 'Tiranë',
    tagLine: { en: "Albania's capital city", sq: 'Kryeqyteti i Shqipërisë' },
    stats: [
      { label: { en:'Nurses active', sq:'Infermiere aktive' }, value:'12+' },
      { label: { en:'Districts covered', sq:'Bashki mbuluar' }, value:'11' },
      { label: { en:'Avg response', sq:'Koha mesatare' }, value:'2h' },
    ],
    features: [
      { en: 'Full city coverage', sq: 'Mbulim i plotë i qytetit' },
      { en: 'Same-day bookings', sq: 'Rezervim në të njëjtën ditë' },
      { en: 'Largest nurse network', sq: 'Rrjeti më i madh i infermiereve' },
    ],
    photo: '/city-tirana.jpg',
    overlay: 'linear-gradient(160deg,rgba(17,50,130,0.82) 0%,rgba(29,78,216,0.72) 50%,rgba(37,99,235,0.55) 100%)',
    glowColor: 'rgba(37,99,235,0.4)',
    accentColor: '#93C5FD',
    textAccent: '#DBEAFE',
  },
  {
    name: 'Durrës',
    nameSq: 'Durrës',
    tagLine: { en: "Albania's coastal hub", sq: 'Qendra bregdetare e Shqipërisë' },
    stats: [
      { label: { en:'Nurses active', sq:'Infermiere aktive' }, value:'6+' },
      { label: { en:'Neighborhoods', sq:'Lagje' }, value:'8' },
      { label: { en:'Full coverage', sq:'Mbulim i plotë' }, value:'✓' },
    ],
    features: [
      { en: 'Coastal city coverage', sq: 'Mbulim i qytetit bregdetar' },
      { en: 'Rapid deployment', sq: 'Dërgim i shpejtë' },
      { en: 'Dedicated care team', sq: 'Ekip kujdesi i dedikuar' },
    ],
    photo: '/city-durres.jpg',
    overlay: 'linear-gradient(160deg,rgba(4,68,48,0.82) 0%,rgba(5,101,71,0.72) 50%,rgba(5,150,105,0.55) 100%)',
    glowColor: 'rgba(5,150,105,0.4)',
    accentColor: '#6EE7B7',
    textAccent: '#D1FAE5',
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
    const res = await fetch(`${BASE}/settings/public`, { next: { revalidate: 60 } });
    if (res.ok) pricing = await res.json();
  } catch {}

  const PLANS = [
    { name: 'Basic',    price: `€${pricing.basicPrice}`,    visits: pricing.basicVisits,    featured: false },
    { name: 'Standard', price: `€${pricing.standardPrice}`, visits: pricing.standardVisits, featured: true  },
    { name: 'Premium',  price: `€${pricing.premiumPrice}`,  visits: pricing.premiumVisits,  featured: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'linear-gradient(168deg, #FEFCF9 0%, #FAF7F3 35%, #F2F9F8 65%, #FAF8F5 100%)' }}>
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
        .hp-pricing-card:hover{transform:translateY(-4px);box-shadow:0 12px 36px rgba(13,148,136,0.14)!important;}
        .hp-pricing-btn-outline{transition:all 0.18s ease;}
        .hp-pricing-btn-outline:hover{background:#2563EB!important;color:#fff!important;}
        .hp-pricing-btn-featured{transition:all 0.18s ease;}
        .hp-pricing-btn-featured:hover{background:linear-gradient(135deg,#1A5F99,#0B8077)!important;}
        .hp-city-card{transition:all 0.18s ease;}
        .hp-city-card:hover{background:#EFF6FF!important;border-color:#BFDBFE!important;}
        .hp-city-card-new{transition:transform 0.2s,box-shadow 0.2s;}
        .hp-city-card-new:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(0,0,0,0.4)!important;}
        .hp-faq-card{transition:all 0.2s ease;}
        .hp-faq-card:hover{border-color:#BFDBFE!important;box-shadow:0 4px 16px rgba(37,99,235,0.06)!important;}
        .hp-cta-btn{transition:all 0.18s ease;}
        .hp-cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.35)!important;}

        /* ── Mobile overrides ── */
        @media (max-width: 640px) {
          .hp-section-lg  { padding: 60px 20px !important; }
          .hp-cta-section { padding: 72px 20px !important; }
          .hp-cities-grid { grid-template-columns: 1fr !important; }
          .hp-nurses-badges { display: none !important; }
          .hp-stat-bar    { padding: 20px 20px !important; gap: 24px !important; }
          .hp-trust-bar   { grid-template-columns: 1fr 1fr !important; gap: 14px !important; }
          .hp-faq-card    { padding: 18px 18px !important; }
          .hp-pricing-card-wrap { padding: 32px 20px !important; }
        }
        @media (max-width: 400px) {
          .hp-cities-grid { gap: 14px !important; }
          .hp-stat-bar    { gap: 18px !important; }
        }
        .hp-nurse-btn{width:100%;padding:10px;font-size:13px;font-weight:600;border-radius:10px;border:1.5px solid #E5E7EB;background:transparent;color:#111827;cursor:pointer;transition:all 0.15s ease;font-family:inherit;}
        .hp-nurse-btn:hover{background:#EFF6FF;border-color:#2563EB;color:#2563EB;}
        @keyframes vx-cta-cross-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes vx-cta-cross-bob{0%,100%{transform:translateY(0px) rotate(12deg)}50%{transform:translateY(-10px) rotate(12deg)}}
        @keyframes vx-cta-orb{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(1.12);opacity:0.9}}

      `}</style>
      <OrganicBackground />
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <HeroSection
        lang={lang}
        badge={t(lang, 'hero.badge')}
        headline1={t(lang, 'hero.headline1')}
        headline2={t(lang, 'hero.headline2')}
        subtitle={t(lang, 'hero.subtitle')}
        cta1={t(lang, 'hero.cta1')}
        cta2={t(lang, 'hero.cta2')}
        visitToday={t(lang, 'hero.visitToday')}
        nurseLabel={t(lang, 'hero.nurseLabel')}
        nurseName="Elona Berberi"
        timeLabel={t(lang, 'hero.timeLabel')}
        timeVal="10:00 AM"
        serviceLabel={t(lang, 'hero.serviceLabel')}
        serviceVal={lang === 'sq' ? 'Presioni + Glukoza' : 'BP + Glucose'}
        patientName="Fatmira Murati"
        patientSub={lang === 'sq' ? 'Tiranë · Mosha 74' : 'Tirana · Age 74'}
        statN1="50+"
        statN2="2"
        statN3="100%"
        stat1={t(lang, 'hero.stat1')}
        stat2={t(lang, 'hero.stat2')}
        stat3={t(lang, 'hero.stat3')}
      />

      {/* ── Trust bar ── */}
      <section style={{ background: '#FEFCF9', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'32px 24px', position:'relative', zIndex:1 }}>
        <div className="hp-trust-bar" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:0 }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:16, padding:'0 28px', borderRight: i < TRUST_ITEMS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#EFF9F7 0%,#EBF5FF 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 2px 8px rgba(13,148,136,0.10)' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.2px' }}>{item.title}</div>
                <div style={{ fontSize:12, color:C.textSecondary, marginTop:3, lineHeight:1.4 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Wellness ticker ── */}
      <WellnessTicker lang={lang} />

      {/* ── How it works ── */}
      <HowItWorksSection
        lang={lang}
        tag={t(lang, 'howItWorks.tag')}
        title={t(lang, 'howItWorks.title')}
        subtitle={t(lang, 'howItWorks.subtitle')}
        steps={steps}
        plans={PLANS}
      />

      {/* ── Services ── */}
      <section id="services" className="hp-section-lg" style={{ padding: '96px 24px', background: 'linear-gradient(160deg,#FAF8F4 0%,#F5FAF9 45%,#F2F9F6 100%)', scrollMarginTop: '76px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {/* Aurora blobs — warm teal tones */}
        <div style={{ position:'absolute', top:-120, left:-100, width:560, height:560, borderRadius:'50%', background:'radial-gradient(circle,rgba(13,148,136,0.09) 0%,transparent 70%)', filter:'blur(48px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, right:-80, width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(30,111,171,0.08) 0%,transparent 70%)', filter:'blur(48px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'35%', right:'12%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(195,165,120,0.07) 0%,transparent 70%)', filter:'blur(56px)', pointerEvents:'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <ScrollReveal>
            <div style={{ marginBottom: 56, display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:20 }}>
              <div>
                <TAG>{t(lang, 'services.tag')}</TAG>
                <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1.5px' }}>{t(lang, 'services.title')}</h2>
                <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 440, lineHeight:1.7, margin:0 }}>{t(lang, 'services.subtitle')}</p>
              </div>
              {/* Medicine cross accent */}
              <svg width="56" height="56" viewBox="0 0 54 54" fill="none" style={{ opacity:0.12, flexShrink:0 }}>
                <rect x="19" y="0" width="16" height="54" rx="7" fill="#059669"/>
                <rect x="0" y="19" width="54" height="16" rx="7" fill="#059669"/>
              </svg>
            </div>
          </ScrollReveal>
          <ServiceCardsSection lang={lang} services={services} />
          <ScrollReveal delay={200}>
            <div style={{ marginTop: 28, background: C.warningLight, border: `1px solid #FDE68A`, borderRadius: 14, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}><WarningIcon /></div>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.65 }}>
                <strong>{t(lang, 'services.nonEmergencyStrong')}</strong> {t(lang, 'services.emergency')} <strong>127</strong> {t(lang, 'services.immediately')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Our Nurses ── */}
      <section id="our-nurses" className="hp-section-lg" style={{ padding: '96px 24px', background: C.bgWhite, scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 52, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <TAG>{t(lang, 'nurses.tag') || 'OUR NURSES'}</TAG>
                <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1.5px' }}>
                  {t(lang, 'nurses.title') || 'Meet your care team'}
                </h2>
                <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 460, margin: 0, lineHeight: 1.7 }}>
                  {t(lang, 'nurses.subtitle') || 'Every Vonaxity nurse is licensed by the Order of Nurses of Albania and personally verified by our team.'}
                </p>
              </div>
              <div className="hp-nurses-badges" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, label: lang === 'sq' ? 'E licensuar' : 'Licensed & Certified' },
                  { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: lang === 'sq' ? 'I verifikuar' : 'Background Checked' },
                  { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="#059669" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, label: lang === 'sq' ? 'E vlerësuar' : 'Patient Rated' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: C.secondary, background: C.secondaryLight, border: '1px solid rgba(5,150,105,0.15)', padding: '6px 12px', borderRadius: 99 }}>
                    {b.icon}{b.label}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { initials:'EB', photo:'/nurse-elona.png',  name:'Elona Berberi',    bg:'#DBEAFE', color:'#1D4ED8', specialty: lang==='sq'?'Kujdes i Përgjithshëm':'General Nursing',   rating:5.0, reviews:38, years:6,  langs:['AL','EN'] },
              { initials:'MG', photo:'/nurse-mirela.png', name:'Mirela Gjoka',     bg:'#D1FAE5', color:'#065F46', specialty: lang==='sq'?'Kujdes për të Moshuarit':'Elderly Care',      rating:4.9, reviews:61, years:11, langs:['AL'] },
              { initials:'AH', photo:'/nurse-artan.png',  name:'Artan Hoxha',      bg:'#EDE9FE', color:'#5B21B6', specialty: lang==='sq'?'Kujdes Post-Operativ':'Post-Op Recovery',    rating:5.0, reviews:24, years:8,  langs:['AL','EN','IT'] },
              { initials:'BL', photo:'/nurse-besmir.png', name:'Besmir Lika',      bg:'#FEF3C7', color:'#92400E', specialty: lang==='sq'?'Kujdesi i Plagëve':'Wound & IV Care',         rating:4.8, reviews:45, years:7,  langs:['AL','EN'] },
            ].map((n, ni) => (
              <ScrollReveal key={n.name} delay={ni * 90}>
                <div className="hp-service-card" style={{ background: '#FAFAF9', borderRadius: 20, border: `1px solid ${C.border}`, padding: '26px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `2.5px solid ${n.color}33`, boxShadow:`0 4px 16px ${n.color}30` }}>
                      <img src={n.photo} alt={n.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: C.secondary, background: C.secondaryLight, border: '1px solid rgba(5,150,105,0.2)', padding: '4px 10px', borderRadius: 99 }}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M5 0L6.12 3.45H9.76L6.82 5.59L7.94 9.05L5 6.91L2.06 9.05L3.18 5.59L0.24 3.45H3.88L5 0Z" fill="#059669"/></svg>
                      {lang === 'sq' ? 'E Verifikuar' : 'Verified'}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 3 }}>{n.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.primary, marginBottom: 14 }}>{n.specialty}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(n.rating) ? '#F59E0B' : '#E5E7EB'} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      ))}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{n.rating.toFixed(1)}</span>
                    <span style={{ fontSize: 12, color: C.textTertiary }}>({n.reviews})</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
                    <div style={{ flex: 1, background: C.bgWhite, borderRadius: 10, padding: '8px 10px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.5px' }}>{n.years}</div>
                      <div style={{ fontSize: 10, color: C.textTertiary, fontWeight: 500 }}>{lang === 'sq' ? 'vjet' : 'yrs exp'}</div>
                    </div>
                    <div style={{ flex: 2, background: C.bgWhite, borderRadius: 10, padding: '8px 10px', border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, color: C.textTertiary, fontWeight: 500, marginBottom: 4 }}>{lang === 'sq' ? 'Gjuhë' : 'Languages'}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap:'wrap' }}>
                        {n.langs.map(l => (
                          <span key={l} style={{ fontSize: 10, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '2px 7px', borderRadius: 6 }}>{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link href={`/${lang}/signup?role=client`} style={{ display: 'block', marginTop: 'auto' }}>
                    <button className="hp-nurse-btn">{lang === 'sq' ? 'Rezervo një vizitë' : 'Book a visit'}</button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div className="hp-stat-bar" style={{ background: 'linear-gradient(135deg, #EFF9F7 0%, #EBF5F3 100%)', borderRadius: 18, padding: '28px 36px', display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', border: '1px solid rgba(13,148,136,0.12)', boxShadow:'0 4px 24px rgba(13,148,136,0.06)' }}>
              {[
                ['18+', lang === 'sq' ? 'Infermierë Aktivë' : 'Active Nurses'],
                ['4.9', lang === 'sq' ? 'Vlerësim Mesatar' : 'Avg Rating'],
                ['100%', lang === 'sq' ? 'Të Licencuar' : 'Licensed'],
                ['2h', lang === 'sq' ? 'Kohë Reagimi' : 'Avg Response'],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #1E6FAB 0%, #0D9488 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px' }}>{n}</div>
                  <div style={{ fontSize: 12, color: C.textTertiary, marginTop: 3, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="hp-section-lg" style={{ padding: '96px 24px', background: 'linear-gradient(180deg, #F0F9F8 0%, #EBF5F9 100%)', scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <ScrollReveal>
            <TAG>{t(lang, 'pricing.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 14px', letterSpacing: '-1.5px' }}>{t(lang, 'pricing.title')}</h2>
            <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 56, lineHeight:1.7 }}>{t(lang, 'pricing.subtitle')}</p>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
            {PLANS.map((p, pi) => (
              <ScrollReveal key={p.name} delay={pi * 100}>
                <div className="hp-pricing-card" style={{ background: C.bgWhite, borderRadius: 22, border: p.featured ? `2px solid ${C.primary}` : `1px solid ${C.border}`, padding: p.featured ? '0 0 32px' : '32px 26px', position: 'relative', boxShadow: p.featured ? '0 12px 48px rgba(37,99,235,0.2)' : '0 2px 12px rgba(0,0,0,0.05)', height:'100%', overflow:'hidden' }}>
                  {p.featured && (
                    <div style={{ height:5, background:'linear-gradient(90deg,#1E6FAB,#0D9488)', marginBottom:24 }} />
                  )}
                  <div style={{ paddingLeft: p.featured ? 26 : 0, paddingRight: p.featured ? 26 : 0 }}>
                  {p.featured && (
                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'linear-gradient(135deg,#1E6FAB,#0D9488)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:99, marginBottom:14, whiteSpace:'nowrap' }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {t(lang, 'pricing.mostPopular')}
                    </div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.featured ? C.primary : C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom: 10 }}>{p.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: C.textPrimary, letterSpacing: '-2.5px', marginBottom: 2, lineHeight:1 }}>{p.price}</div>
                  <div style={{ fontSize: 13, color: C.textTertiary, marginBottom: 20 }}>{t(lang, 'pricing.perMonth')}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? '#0D9488' : C.primary, background: p.featured ? 'rgba(13,148,136,0.08)' : C.primaryLight, display: 'inline-block', padding: '5px 14px', borderRadius: 99, marginBottom: 28 }}>
                    {p.visits} {p.visits === 1 ? t(lang, 'pricing.visitMonth') : t(lang, 'pricing.visitsMonth')}
                  </div>
                  <br />
                  <Link href={`/${lang}/signup?role=client&plan=${p.name.toLowerCase()}`}>
                    <button className={p.featured ? 'hp-pricing-btn-featured' : 'hp-pricing-btn-outline'} style={{ width: '100%', padding: '13px', borderRadius: 12, border: p.featured ? 'none' : `2px solid ${C.primary}`, background: p.featured ? 'linear-gradient(135deg,#1E6FAB,#0D9488)' : 'transparent', color: p.featured ? '#fff' : C.primary, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: p.featured ? '0 6px 20px rgba(30,111,171,0.28)' : 'none' }}>
                      {t(lang, 'pricing.getStarted')}
                    </button>
                  </Link>
                  <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 12 }}>{t(lang, 'pricing.trialNote')}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities ── */}
      <section className="hp-section-lg" style={{ padding:'96px 24px', background:'linear-gradient(135deg,#0D1F2D 0%,#0D3545 45%,#0C4A50 75%,#0D2A38 100%)', position:'relative', overflow:'hidden', zIndex:1 }}>
        {/* Background grid */}
        <div style={{ position:'absolute', inset:0, opacity:0.05, pointerEvents:'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="cg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#cg)"/>
          </svg>
        </div>
        {/* Glow orbs — warm teal */}
        <div style={{ position:'absolute', top:-80, left:'10%', width:500, height:500, borderRadius:'50%', background:'rgba(13,148,136,0.16)', filter:'blur(120px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-80, right:'10%', width:420, height:420, borderRadius:'50%', background:'rgba(30,111,171,0.14)', filter:'blur(110px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'40%', left:'50%', transform:'translateX(-50%)', width:300, height:300, borderRadius:'50%', background:'rgba(13,148,136,0.10)', filter:'blur(90px)', pointerEvents:'none' }}/>

        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          {/* Header */}
          <ScrollReveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(94,234,212,0.90)', background:'rgba(13,148,136,0.20)', padding:'6px 16px', borderRadius:99, marginBottom:20, border:'1px solid rgba(94,234,212,0.18)' }}>{t(lang,'cities.tag')}</div>
              <h2 style={{ fontSize:'clamp(30px,4vw,52px)', fontWeight:800, color:'#fff', margin:'0 0 18px', letterSpacing:'-2px', lineHeight:1.05 }}>
                {t(lang,'cities.title')}
              </h2>
              <p style={{ fontSize:17, color:'rgba(255,255,255,0.55)', lineHeight:1.75, maxWidth:500, margin:'0 auto' }}>
                {t(lang,'cities.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* City cards */}
          <ScrollReveal delay={100}>
          <style>{`
            .hp-city-card-new { transition: transform 0.2s, box-shadow 0.2s; }
            .hp-city-card-new:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.4) !important; }
          `}</style>
          <div className="hp-cities-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:28 }}>
            {LAUNCH_CITIES.map(city => (
              <div key={city.name} className="hp-city-card-new" style={{
                borderRadius: 24,
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 8px 40px ${city.glowColor}`,
                minHeight: 340,
              }}>
                {/* Real city photo background */}
                <div style={{ position:'absolute', inset:0, backgroundImage:`url(${city.photo})`, backgroundSize:'cover', backgroundPosition:'center', pointerEvents:'none' }} />
                {/* Colour overlay — keeps brand feel + ensures readability */}
                <div style={{ position:'absolute', inset:0, background: city.overlay, pointerEvents:'none' }} />
                {/* Subtle vignette at bottom for text contrast */}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.35) 0%,transparent 55%)', pointerEvents:'none' }} />
                {/* Glow circle */}
                <div style={{ position:'absolute', bottom:-60, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }}/>
                <div style={{ position:'relative', zIndex:1 }}>
                  {/* Badge */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', fontSize:10, fontWeight:700, letterSpacing:'0.8px', padding:'5px 13px', borderRadius:99, marginBottom:24, textTransform:'uppercase' }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.8)', display:'inline-block' }}/>
                    {t(lang,'cities.launchBadge')}
                  </div>

                  {/* City name + tagline */}
                  <div style={{ fontSize:'clamp(32px,4vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1, marginBottom:8 }}>{city.name}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.65)', fontWeight:500, marginBottom:28 }}>{city.tagLine[lang] || city.tagLine.en}</div>

                  {/* Stat row */}
                  <div style={{ display:'flex', gap:0, marginBottom:28, background:'rgba(0,0,0,0.15)', borderRadius:14, overflow:'hidden' }}>
                    {city.stats.map((s, i) => (
                      <div key={i} style={{ flex:1, padding:'14px 16px', textAlign:'center', borderRight: i < city.stats.length-1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <div style={{ fontSize:20, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', lineHeight:1 }}>{s.value}</div>
                        <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', marginTop:4, fontWeight:600 }}>{s.label[lang] || s.label.en}</div>
                      </div>
                    ))}
                  </div>

                  {/* Feature list */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {city.features.map((f, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.85)' }}>{f[lang] || f.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          </ScrollReveal>

          {/* Coming soon — redesigned as expansion roadmap */}
          <ScrollReveal delay={180}>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'28px 32px', backdropFilter:'blur(4px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.7)' }}>{t(lang,'cities.comingSoonLabel')}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{lang==='sq'?'Zgjerimi ynë kombëtar vazhdon':'Our national expansion continues'}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {['Elbasan','Fier','Berat','Sarandë','Shkodër','Kukës'].map((c, i) => (
                <div key={c} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:99, padding:'7px 16px' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.2)', flexShrink:0 }}/>
                  <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.45)' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ / About ── */}
      <section id="about" className="hp-section-lg" style={{ padding: '96px 24px', background: C.bg, scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <TAG>{t(lang, 'faq.tag')}</TAG>
              <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 14px', letterSpacing: '-1.5px' }}>{t(lang, 'faq.title')}</h2>
            </div>
          </ScrollReveal>
          {Array.isArray(faqs) && faqs.slice(0, 4).map((f, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="hp-faq-card" style={{ background: C.bgWhite, borderRadius: 16, border: `1px solid ${C.border}`, padding: '22px 26px', marginBottom: 10, boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#EFF6FF,#DBEAFE)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:C.primary }}>Q</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 8, lineHeight:1.45 }}>{f.q}</div>
                    <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.75 }}>{f.a}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={200}>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href={`/${lang}/faq`} style={{ fontSize: 14, fontWeight: 600, color: C.primary, display:'inline-flex', alignItems:'center', gap:6 }}>
                {t(lang, 'faq.viewAll')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hp-cta-section" style={{ padding: '104px 24px', background: 'linear-gradient(158deg, #0D2A38 0%, #0D4A55 50%, #0C5B5B 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative medicine crosses in background */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          {/* Large spinning cross — top right */}
          <svg style={{ position:'absolute', top:-24, right:'8%', opacity:0.07, animation:'vx-cta-cross-spin 28s linear infinite', transformOrigin:'center' }} width="180" height="180" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/>
          </svg>
          {/* Medium bobbing cross — bottom left */}
          <svg style={{ position:'absolute', bottom:-10, left:'6%', opacity:0.10, animation:'vx-cta-cross-bob 6s ease-in-out infinite', transformOrigin:'center' }} width="110" height="110" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#5EEAD4"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#5EEAD4"/>
          </svg>
          {/* Small spinning cross — mid-left */}
          <svg style={{ position:'absolute', top:'38%', left:'14%', opacity:0.08, animation:'vx-cta-cross-spin 40s linear infinite reverse', transformOrigin:'center' }} width="68" height="68" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#99D4D0"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#99D4D0"/>
          </svg>
          {/* Tiny cross — top left */}
          <svg style={{ position:'absolute', top:'18%', left:'3%', opacity:0.08, animation:'vx-cta-cross-spin 20s linear infinite', transformOrigin:'center' }} width="44" height="44" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/>
          </svg>
          {/* Radial glow orb */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(13,148,136,0.14) 0%, transparent 70%)', animation:'vx-cta-orb 5s ease-in-out infinite' }} />
        </div>

        {/* Content */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:99, padding:'6px 16px', marginBottom:24, backdropFilter:'blur(8px)' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#5EEAD4', boxShadow:'0 0 8px rgba(94,234,212,0.7)' }} />
            <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.85)', letterSpacing:'0.8px', textTransform:'uppercase' }}>
              {lang === 'sq' ? 'Tani disponueshëm' : 'Now available in Albania'}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-1.5px', lineHeight:1.1 }}>
            {t(lang, 'cta.title')}
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', maxWidth: 440, margin: '0 auto 40px', lineHeight: 1.75 }}>
            {t(lang, 'cta.subtitle')}
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href={`/${lang}/signup?role=client`}>
              <button className="hp-cta-btn" style={{ background: '#fff', color: '#0D4A55', border: 'none', borderRadius: 12, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 28px rgba(0,0,0,0.22)' }}>
                {t(lang, 'cta.btn1')}
              </button>
            </Link>
            <Link href={`/${lang}/nurse-signup`}>
              <button className="hp-cta-btn" style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.35)', borderRadius: 12, padding: '16px 32px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                {lang === 'sq' ? 'Bashkohu si infermier/e' : 'Join as a nurse'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
      <LandingChat lang={lang} />
    </div>
  );
}
