'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

export default function FAQPage({ params }) {
  const lang = params.lang || 'en';
  const [open, setOpen] = useState(null);
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };
  const faqs = t(lang, 'faq.items');

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px 80px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px', textAlign: 'center' }}>{t(lang,'faq.title')}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 32 }}>
            {Array.isArray(faqs) && faqs.map((f,i) => (
              <div key={i} style={{ background: C.white, borderRadius: 12, border: `1px solid ${open===i?C.teal:C.border}`, overflow: 'hidden' }}>
                <button onClick={() => setOpen(open===i?null:i)} style={{ width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{f.q}</span>
                  <span style={{ fontSize: 20, color: C.teal, transform: open===i?'rotate(45deg)':'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {open===i && <div style={{ padding: '0 20px 16px', fontSize: 14, color: C.neutralMid, lineHeight: 1.7 }}>{f.a}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 18px', textAlign: 'center', fontSize: 13, color: '#991b1b' }}>
            ⚠️ {t(lang,'ui.emergency')}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
