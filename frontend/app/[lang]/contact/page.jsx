'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function ContactPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const inp = { width: '100%', padding: '11px 13px', borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 12, boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px' }}>Get in touch</h1>
          <p style={{ fontSize: 16, color: C.neutralMid, marginBottom: 32 }}>We respond within 24 hours in English or Albanian.</p>
          {sent ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.sage }}>Message received!</div>
              <div style={{ fontSize: 14, color: C.neutralMid, marginTop: 6 }}>We'll get back to you within 24 hours.</div>
            </div>
          ) : (
            <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, padding: '28px' }}>
              <input style={inp} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={inp} type="email" placeholder="Email address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <textarea style={{ ...inp, minHeight: 100, resize: 'vertical', marginBottom: 16 }} placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              <button onClick={() => setSent(true)} disabled={!form.name || !form.email || !form.message} style={{ width: '100%', background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Send message →
              </button>
            </div>
          )}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[['📧', 'Email', 'hello@vonaxity.com'], ['💬', 'WhatsApp', '+355 69 000 0000'], ['🚨', 'Emergency in Albania?', 'Call 127 immediately']].map(([icon, label, value]) => (
              <div key={label} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, color: C.neutralMid }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
