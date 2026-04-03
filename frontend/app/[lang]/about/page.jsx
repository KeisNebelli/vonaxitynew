import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const values = t(lang, 'about.values');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />
      <section style={{ padding:'80px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:20 }}>{t(lang,'about.tag')}</div>
          <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:28, lineHeight:1.15 }}>{t(lang,'about.headline')}</h1>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.8, marginBottom:16 }}>{t(lang,'about.p1')}</p>
          <p style={{ fontSize:17, color:C.textSecondary, lineHeight:1.8, marginBottom:56 }}>{t(lang,'about.p2')}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {Array.isArray(values) && values.map((v,i) => (
              <div key={i} style={{ background:C.bg, borderRadius:14, border:`1px solid ${C.border}`, padding:'22px 20px' }}>
                <div style={{ fontSize:28, marginBottom:14 }}>{v.icon}</div>
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
