import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/HeroSection';
import OrganicBackground from '@/components/OrganicBackground';
import ScrollReveal from '@/components/ScrollReveal';
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
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: 'linear-gradient(168deg, #FFFFFF 0%, #F8F6FF 40%, #F0FFFE 75%, #F8F6FF 100%)' }}>
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
        serviceVal="BP + glucose"
        patientName="Fatmira Murati"
        patientSub="Tirana · Age 74"
        statN1="500+"
        statN2="8"
        statN3="100%"
        stat1={t(lang, 'hero.stat1')}
        stat2={t(lang, 'hero.stat2')}
        stat3={t(lang, 'hero.stat3')}
      />

      {/* ── Trust bar ── */}
      <section style={{ background: 'rgba(255,255,255,0.88)', backdropFilter:'blur(8px)', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position:'relative', zIndex:1 }}>
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
      <section id="how-it-works" style={{ padding: '96px 24px', background: C.bgWhite, scrollMarginTop: '76px', position: 'relative', zIndex: 1, overflow:'hidden' }}>
        {/* Subtle background cross watermark */}
        <div style={{ position:'absolute', top:'50%', right:-60, transform:'translateY(-50%)', opacity:0.025, pointerEvents:'none' }}>
          <svg width="340" height="340" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#7C3AED"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#7C3AED"/></svg>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <TAG>{t(lang, 'howItWorks.tag')}</TAG>
              <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 14px', letterSpacing: '-1.5px' }}>{t(lang, 'howItWorks.title')}</h2>
              <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>{t(lang, 'howItWorks.subtitle') || 'From booking to bedside — fast, simple, and completely transparent.'}</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20, position:'relative' }}>
            {Array.isArray(steps) && steps.slice(0, 4).map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="hp-step-card" style={{ background: C.bgWhite, borderRadius: 22, border: `1px solid ${C.border}`, padding: '32px 26px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', position:'relative', overflow:'hidden', height:'100%' }}>
                  {/* Giant watermark number */}
                  <div style={{ position:'absolute', right:14, bottom:8, fontSize:88, fontWeight:900, color:'rgba(124,58,237,0.04)', letterSpacing:'-4px', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                    {i + 1}
                  </div>
                  {/* Gradient step circle */}
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, boxShadow:'0 6px 18px rgba(124,58,237,0.28)', flexShrink:0 }}>
                    <span style={{ fontSize:16, fontWeight:800, color:'#fff' }}>0{i+1}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 10, lineHeight: 1.35 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>{s.desc}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ padding: '96px 24px', background: 'linear-gradient(180deg,#F8FAFF 0%,#F0F4FF 100%)', scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
            {SERVICE_ITEMS.map(({ Icon }, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div className="hp-service-card" style={{ background: C.bgWhite, borderRadius: 18, border: `1px solid ${C.border}`, padding: '26px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height:'100%' }}>
                  {/* Icon with green-tinted gradient */}
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: '0 2px 8px rgba(5,150,105,0.12)' }}>
                    <Icon />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 8, lineHeight:1.35 }}>
                    {Array.isArray(services) && services[i]?.title}
                  </div>
                  <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>
                    {Array.isArray(services) && services[i]?.desc}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
      <section id="our-nurses" style={{ padding: '96px 24px', background: C.bgWhite, scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
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
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { icon: '✓', label: lang === 'sq' ? 'E licensuar' : 'Licensed & Certified' },
                  { icon: '🛡', label: lang === 'sq' ? 'I verifikuar' : 'Background Checked' },
                  { icon: '⭐', label: lang === 'sq' ? 'E vlerësuar' : 'Patient Rated' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: C.secondary, background: C.secondaryLight, border: '1px solid rgba(5,150,105,0.15)', padding: '6px 12px', borderRadius: 99 }}>
                    <span style={{ fontSize: 11 }}>{b.icon}</span>{b.label}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, marginBottom: 40 }}>
            {[
              { initials:'EB', name:'Elona Berberi',    bg:'#DBEAFE', color:'#1D4ED8', specialty: lang==='sq'?'Kujdes i Përgjithshëm':'General Nursing',   rating:5.0, reviews:38, years:6,  langs:['AL','EN'] },
              { initials:'MG', name:'Mirela Gjoka',     bg:'#D1FAE5', color:'#065F46', specialty: lang==='sq'?'Kujdes për të Moshuarit':'Elderly Care',      rating:4.9, reviews:61, years:11, langs:['AL'] },
              { initials:'AH', name:'Artan Hoxha',      bg:'#EDE9FE', color:'#5B21B6', specialty: lang==='sq'?'Kujdes Post-Operativ':'Post-Op Recovery',    rating:5.0, reviews:24, years:8,  langs:['AL','EN','IT'] },
              { initials:'BL', name:'Besmir Lika',      bg:'#FEF3C7', color:'#92400E', specialty: lang==='sq'?'Kujdesi i Plagëve':'Wound & IV Care',         rating:4.8, reviews:45, years:7,  langs:['AL','EN'] },
            ].map((n, ni) => (
              <ScrollReveal key={n.name} delay={ni * 90}>
                <div className="hp-service-card" style={{ background: '#FAFAF9', borderRadius: 20, border: `1px solid ${C.border}`, padding: '26px 22px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: n.color, flexShrink: 0, border: `2px solid ${n.color}22`, boxShadow:`0 4px 12px ${n.color}22` }}>
                      {n.initials}
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
                  <Link href={`/${lang}/signup`} style={{ display: 'block', marginTop: 'auto' }}>
                    <button className="hp-nurse-btn">{lang === 'sq' ? 'Rezervo një vizitë' : 'Book a visit'}</button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={100}>
            <div style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)', borderRadius: 18, padding: '28px 36px', display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', border: '1px solid rgba(124,58,237,0.1)', boxShadow:'0 4px 24px rgba(124,58,237,0.06)' }}>
              {[
                ['500+', lang === 'sq' ? 'Infermierë Aktivë' : 'Active Nurses'],
                ['4.9', lang === 'sq' ? 'Vlerësim Mesatar' : 'Avg Rating'],
                ['100%', lang === 'sq' ? 'Të Licencuar' : 'Licensed'],
                ['48h', lang === 'sq' ? 'Kohë Reagimi' : 'Avg Response'],
              ].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-1px' }}>{n}</div>
                  <div style={{ fontSize: 12, color: C.textTertiary, marginTop: 3, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '96px 24px', background: 'linear-gradient(180deg, #F5F3FF 0%, #EFF6FF 100%)', scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <ScrollReveal>
            <TAG>{t(lang, 'pricing.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 14px', letterSpacing: '-1.5px' }}>{t(lang, 'pricing.title')}</h2>
            <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 56, lineHeight:1.7 }}>{t(lang, 'pricing.subtitle')}</p>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
            {PLANS.map((p, pi) => (
              <ScrollReveal key={p.name} delay={pi * 100}>
                <div className="hp-pricing-card" style={{ background: C.bgWhite, borderRadius: 22, border: p.featured ? `2px solid ${C.primary}` : `1px solid ${C.border}`, padding: '32px 26px', position: 'relative', boxShadow: p.featured ? '0 12px 48px rgba(37,99,235,0.2)' : '0 2px 12px rgba(0,0,0,0.05)', height:'100%' }}>
                  {p.featured && (
                    <>
                      {/* Featured gradient header strip */}
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#7C3AED,#2563EB)', borderRadius:'22px 22px 0 0' }} />
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 99, whiteSpace: 'nowrap', boxShadow:'0 4px 12px rgba(124,58,237,0.35)' }}>
                        {t(lang, 'pricing.mostPopular')}
                      </div>
                    </>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, color: p.featured ? C.primary : C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom: 10 }}>{p.name}</div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: C.textPrimary, letterSpacing: '-2.5px', marginBottom: 2, lineHeight:1 }}>{p.price}</div>
                  <div style={{ fontSize: 13, color: C.textTertiary, marginBottom: 20 }}>{t(lang, 'pricing.perMonth')}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.featured ? '#7C3AED' : C.primary, background: p.featured ? 'rgba(124,58,237,0.08)' : C.primaryLight, display: 'inline-block', padding: '5px 14px', borderRadius: 99, marginBottom: 28 }}>
                    {p.visits} {p.visits === 1 ? t(lang, 'pricing.visitMonth') : t(lang, 'pricing.visitsMonth')}
                  </div>
                  <br />
                  <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                    <button className={p.featured ? 'hp-pricing-btn-featured' : 'hp-pricing-btn-outline'} style={{ width: '100%', padding: '13px', borderRadius: 12, border: p.featured ? 'none' : `2px solid ${C.primary}`, background: p.featured ? 'linear-gradient(135deg,#7C3AED,#2563EB)' : 'transparent', color: p.featured ? '#fff' : C.primary, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: p.featured ? '0 6px 20px rgba(124,58,237,0.3)' : 'none' }}>
                      {t(lang, 'pricing.getStarted')}
                    </button>
                  </Link>
                  <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 12 }}>{t(lang, 'pricing.trialNote')}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities ── */}
      <section style={{ padding:'96px 24px', background:'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {/* Header */}
          <ScrollReveal>
            <div style={{ textAlign:'center', marginBottom:56 }}>
              <TAG>{t(lang,'cities.tag')}</TAG>
              <h2 style={{ fontSize:'clamp(30px,4vw,46px)', fontWeight:800, color:C.textPrimary, margin:'0 0 16px', letterSpacing:'-1.5px' }}>
                {t(lang,'cities.title')}
              </h2>
              <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.7, maxWidth:520, margin:'0 auto' }}>
                {t(lang,'cities.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Launch city cards */}
          <ScrollReveal delay={100}>
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

          </div>
          </ScrollReveal>

          {/* Coming soon strip */}
          <ScrollReveal delay={150}>
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
          </ScrollReveal>
        </div>
      </section>

      {/* ── FAQ / About ── */}
      <section id="about" style={{ padding: '96px 24px', background: C.bg, scrollMarginTop: '76px', position: 'relative', zIndex: 1 }}>
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
      <section style={{ padding: '104px 24px', background: 'linear-gradient(158deg, #022c1a 0%, #064E3B 55%, #065f46 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative medicine crosses in background */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          {/* Large spinning cross — top right */}
          <svg style={{ position:'absolute', top:-24, right:'8%', opacity:0.07, animation:'vx-cta-cross-spin 28s linear infinite', transformOrigin:'center' }} width="180" height="180" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/>
          </svg>
          {/* Medium bobbing cross — bottom left */}
          <svg style={{ position:'absolute', bottom:-10, left:'6%', opacity:0.06, animation:'vx-cta-cross-bob 6s ease-in-out infinite', transformOrigin:'center' }} width="110" height="110" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#4ade80"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#4ade80"/>
          </svg>
          {/* Small spinning cross — mid-left */}
          <svg style={{ position:'absolute', top:'38%', left:'14%', opacity:0.05, animation:'vx-cta-cross-spin 40s linear infinite reverse', transformOrigin:'center' }} width="68" height="68" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#6ee7b7"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#6ee7b7"/>
          </svg>
          {/* Tiny cross — top left */}
          <svg style={{ position:'absolute', top:'18%', left:'3%', opacity:0.08, animation:'vx-cta-cross-spin 20s linear infinite', transformOrigin:'center' }} width="44" height="44" viewBox="0 0 54 54" fill="none">
            <rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/>
            <rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/>
          </svg>
          {/* Radial glow orb */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:400, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)', animation:'vx-cta-orb 5s ease-in-out infinite' }} />
        </div>

        {/* Content */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:99, padding:'6px 16px', marginBottom:24, backdropFilter:'blur(8px)' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
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
            <Link href={`/${lang}/signup`}>
              <button className="hp-cta-btn" style={{ background: '#fff', color: '#064E3B', border: 'none', borderRadius: 12, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 28px rgba(0,0,0,0.25)' }}>
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
    </div>
  );
}
