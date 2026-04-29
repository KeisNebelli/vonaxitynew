import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const ICONS = [
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  <svg key="5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg key="6" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
];

export default function ServicesPage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'88px 24px 100px', background:'linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #1D4ED8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Grid pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.06 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="sg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#sg)"/>
          </svg>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:20, border:'1px solid rgba(147,197,253,0.2)' }}>{t(lang,'services.tag')}</div>
          <h1 style={{ fontSize:'clamp(30px,5vw,54px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1.1, maxWidth:640, margin:'0 auto 16px' }}>{t(lang,'services.title')}</h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.68)', maxWidth:480, margin:'0 auto', lineHeight:1.75 }}>{t(lang,'services.subtitle')}</p>
        </div>
      </section>

      {/* ── Certified block ── */}
      <section style={{ padding:'64px 24px 0', background:C.bgWhite }}>
        <div style={{ maxWidth:860, margin:'0 auto', background:C.bg, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px 48px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:C.primary, marginBottom:14 }}>{t(lang,'services.certifiedTag')}</div>
            <h2 style={{ fontSize:'clamp(20px,3vw,30px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:14, lineHeight:1.2 }}>{t(lang,'services.certifiedTitle')}</h2>
            <p style={{ fontSize:14, color:C.textSecondary, lineHeight:1.8, margin:0 }}>{t(lang,'services.certifiedDesc')}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(()=>{const features=t(lang,'services.certifiedFeatures');return Array.isArray(features)?features:[];})().map((item,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textPrimary, fontWeight:500, padding:'10px 14px', background:C.bgWhite, borderRadius:10, border:`1px solid ${C.border}` }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section style={{ padding:'60px 24px 80px', background:C.bg }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:12 }}>{t(lang,'services.allServicesTitle')}</h2>
            <p style={{ fontSize:15, color:C.textSecondary }}>{t(lang,'services.allServicesDesc')}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:16, marginBottom:32 }}>
            {ICONS.map((icon,i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, transition:'box-shadow 0.15s' }}>
                <div style={{ width:44, height:44, borderRadius:11, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>{icon}</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{Array.isArray(services)&&services[i]?.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65 }}>{Array.isArray(services)&&services[i]?.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', gap:12, alignItems:'center', marginBottom:32 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p style={{ fontSize:13, color:'#92400E', margin:0 }}><strong>{t(lang,'services.nonEmergencyStrong')}</strong> {t(lang,'services.emergency')} <strong>127</strong> {t(lang,'services.immediately')}</p>
          </div>
          <div style={{ textAlign:'center' }}>
            <Link href={`/${lang}/signup`}><button style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'14px 36px', fontSize:15, fontWeight:600, cursor:'pointer' }}>{t(lang,'nav.getStarted')}</button></Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
