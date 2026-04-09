import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const VALUE_ICONS = [
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
];

const CONTACT_ICONS = [
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
];

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const values = t(lang, 'about.values');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* Hero image section */}
      <section style={{ position:'relative', height:'420px', overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1400&q=80&auto=format&fit=crop"
          alt="Nurse providing home care"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.65) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
          <div>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.8)', background:'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:99, marginBottom:16, backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>{t(lang,'about.tag')}</div>
            <h1 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, maxWidth:700, margin:'0 auto' }}>
              {t(lang,'about.headline')}
            </h1>
          </div>
        </div>
      </section>

      <section style={{ padding:'80px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.8, marginBottom:16 }}>{t(lang,'about.p1')}</p>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.8, marginBottom:56 }}>{t(lang,'about.p2')}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {Array.isArray(values) && values.map((v,i) => (
              <div key={i} style={{ background:C.bg, borderRadius:14, border:`1px solid ${C.border}`, padding:'22px 20px' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  {VALUE_ICONS[i] || VALUE_ICONS[0]}
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{v.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
