import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const VALUE_ICONS = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
];

const STATS = {
  en: [['Est. 2026','Founded'], ['Tirana & Durrës','Launch cities'], ['Certified','Every nurse'], ['24h','Nurse assigned']],
  sq: [['Est. 2026','Themeluar'], ['Tiranë & Durrës','Qytetet e nisjes'], ['E certifikuar','Çdo infermiere'], ['24h','Infermierja caktohet']],
};

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const values = t(lang, 'about.values');
  const stats = STATS[lang] || STATS.en;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'88px 24px 100px', background:'linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #1D4ED8 100%)', position:'relative', overflow:'hidden' }}>
        {/* Grid pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.06 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="ag" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#ag)"/>
          </svg>
        </div>
        <div style={{ maxWidth:760, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:20, border:'1px solid rgba(147,197,253,0.2)' }}>
            {t(lang,'about.tag')}
          </div>
          <h1 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1.1, marginBottom:20, maxWidth:640 }}>
            {t(lang,'about.headline')}
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.68)', lineHeight:1.8, maxWidth:560 }}>
            {t(lang,'about.p1')}
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{ background:C.bgWhite, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {stats.map(([val, label], i) => (
            <div key={i} style={{ padding:'28px 24px', textAlign:'center', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ fontSize:28, fontWeight:800, color:C.primary, letterSpacing:'-1px', marginBottom:4 }}>{val}</div>
              <div style={{ fontSize:12, fontWeight:600, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section style={{ padding:'72px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99, marginBottom:20 }}>
            {lang === 'sq' ? 'Historia jonë' : 'Our story'}
          </div>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.85, marginBottom:20 }}>{t(lang,'about.p1')}</p>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.85, marginBottom:0 }}>{t(lang,'about.p2')}</p>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding:'72px 24px', background:C.bg }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>
              {lang === 'sq' ? 'Vlerat tona' : 'Our values'}
            </div>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-1px', margin:0 }}>
              {lang === 'sq' ? 'Çfarë na udhëzon' : 'What guides us'}
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:16 }}>
            {Array.isArray(values) && values.map((v, i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'28px 24px', boxShadow:'0 1px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ width:44, height:44, borderRadius:12, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                  {VALUE_ICONS[i] || VALUE_ICONS[0]}
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:10, letterSpacing:'-0.2px' }}>{v.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'80px 24px', background:'linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', marginBottom:14 }}>
          {t(lang, 'cta.title')}
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.7)', maxWidth:400, margin:'0 auto 32px', lineHeight:1.7 }}>
          {t(lang, 'cta.subtitle')}
        </p>
        <Link href={`/${lang}/signup?role=client`}>
          <button style={{ background:'#fff', color:'#1E3A5F', border:'none', borderRadius:10, padding:'14px 36px', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
            {t(lang, 'cta.btn1')}
          </button>
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
