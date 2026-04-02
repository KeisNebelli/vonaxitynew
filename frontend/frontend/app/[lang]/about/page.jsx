import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const values = t(lang, 'about.values');
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.teal, background: C.tealLight, padding: '5px 12px', borderRadius: 20, marginBottom: 16 }}>{t(lang,'about.tag')}</div>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 20, letterSpacing: '-1.5px' }}>{t(lang,'about.headline')}</h1>
          <p style={{ fontSize: 17, color: C.neutralMid, lineHeight: 1.75, marginBottom: 16 }}>{t(lang,'about.p1')}</p>
          <p style={{ fontSize: 17, color: C.neutralMid, lineHeight: 1.75, marginBottom: 32 }}>{t(lang,'about.p2')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {Array.isArray(values) && values.map((v,i) => (
              <div key={i} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
