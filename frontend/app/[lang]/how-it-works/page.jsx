import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function HowItWorksPage({ params }) {
  const lang = params.lang || 'en';
  const steps = t(lang, 'howItWorks.steps');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />
      <section style={{ padding:'80px 24px', background:C.bgWhite, textAlign:'center' }}>
        <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>{t(lang,'howItWorks.tag')}</div>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:12 }}>{t(lang,'howItWorks.title')}</h1>
        <p style={{ fontSize:17, color:C.textSecondary, maxWidth:480, margin:'0 auto' }}>{t(lang,'howItWorks.subtitle')}</p>
      </section>
      <section style={{ padding:'40px 24px 80px', background:C.bg }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:48 }}>
            {Array.isArray(steps) && steps.map((s,i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'28px 24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-8, right:-8, fontSize:72, fontWeight:800, color:C.primary, opacity:0.04, lineHeight:1, fontFamily:'inherit' }}>{s.num}</div>
                <div style={{ display:'inline-block', fontSize:11, fontWeight:700, color:C.primary, letterSpacing:'1.5px', background:C.primaryLight, padding:'3px 10px', borderRadius:99, marginBottom:14 }}>STEP {s.num}</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary, marginBottom:10, lineHeight:1.4 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
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
