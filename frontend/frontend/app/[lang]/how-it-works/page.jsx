import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

export default function HowItWorksPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };
  const steps = t(lang, 'howItWorks.steps');

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px' }}>{t(lang,'howItWorks.title')}</h1>
        <p style={{ fontSize: 17, color: C.neutralMid, maxWidth: 480, margin: '0 auto' }}>{t(lang,'howItWorks.subtitle')}</p>
      </section>
      <section style={{ padding: '64px 24px', background: C.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {Array.isArray(steps) && steps.map((s,i) => (
              <div key={i} style={{ background: C.neutral, borderRadius: 14, border: `1px solid ${C.border}`, padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 64, opacity: 0.06, fontFamily: 'Georgia', fontWeight: 900 }}>{s.num}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '1.5px', marginBottom: 6 }}>STEP {s.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, background: `linear-gradient(135deg,${C.teal},#164e63)`, borderRadius: 16, padding: '36px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 12 }}>{t(lang,'cta.title')}</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>{t(lang,'cta.subtitle')}</p>
            <Link href={`/${lang}/signup`}><button style={{ background: '#fff', color: C.teal, border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>{t(lang,'cta.btn1')}</button></Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
