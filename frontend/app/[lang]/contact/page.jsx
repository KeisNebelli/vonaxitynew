'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const CHANNEL_ICONS = [
  /* email */
  <svg key="e" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  /* whatsapp */
  <svg key="w" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  /* emergency */
  <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
];

export default function ContactPage({ params }) {
  const lang = params.lang || 'en';
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const channels = t(lang, 'contact.channels');

  const inp = {
    width:'100%', padding:'12px 14px', borderRadius:10,
    border:`1.5px solid ${C.border}`, fontSize:14,
    color:C.textPrimary, background:C.bgWhite,
    outline:'none', fontFamily:'inherit', boxSizing:'border-box',
    transition:'border-color 0.15s',
  };

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
      await fetch(`${BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (_) {}
    setSending(false);
    setSent(true);
  };

  const valid = form.name && form.email && form.message;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <style>{`
        .cx-input:focus { border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .cx-send:hover:not(:disabled) { background: #1D4ED8 !important; transform: translateY(-1px); }
        .cx-send { transition: background 0.15s, transform 0.15s; }
      `}</style>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'88px 24px 100px', background:'linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #1D4ED8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.06 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="cg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#cg)"/>
          </svg>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:20, border:'1px solid rgba(147,197,253,0.2)' }}>
            {t(lang,'contact.tag')}
          </div>
          <h1 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1.1, marginBottom:16 }}>
            {t(lang,'contact.title')}
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.68)', maxWidth:460, margin:'0 auto', lineHeight:1.75 }}>
            {t(lang,'contact.subtitle')}
          </p>
        </div>
      </section>

      {/* ── Form + Channels ── */}
      <section style={{ padding:'0 24px 80px', marginTop:-48 }}>
        <div style={{ maxWidth:680, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr', gap:16 }}>

          {/* Form card */}
          {sent ? (
            <div style={{ background:C.bgWhite, border:`1px solid #A7F3D0`, borderRadius:20, padding:'56px 40px', textAlign:'center', boxShadow:'0 4px 24px rgba(0,0,0,0.07)' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:C.secondary, marginBottom:10, letterSpacing:'-0.3px' }}>{t(lang,'contact.successTitle')}</div>
              <div style={{ fontSize:14, color:'#065F46', lineHeight:1.7 }}>{t(lang,'contact.successDesc')}</div>
            </div>
          ) : (
            <div style={{ background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:20, padding:'36px 32px', boxShadow:'0 4px 24px rgba(0,0,0,0.07)' }}>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:7 }}>{t(lang,'contact.name')}</label>
                <input className="cx-input" style={inp} placeholder={t(lang,'contact.name')} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </div>
              <div style={{ marginBottom:18 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:7 }}>{t(lang,'contact.email')}</label>
                <input className="cx-input" style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              </div>
              <div style={{ marginBottom:28 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:7 }}>{t(lang,'contact.message')}</label>
                <textarea className="cx-input" style={{...inp, minHeight:120, resize:'vertical'}} placeholder={t(lang,'contact.message')} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
              </div>
              <button className="cx-send" onClick={handleSend} disabled={!valid || sending} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:11, padding:'14px', fontSize:15, fontWeight:700, cursor: valid ? 'pointer' : 'default', opacity: valid ? 1 : 0.4 }}>
                {sending ? (lang==='sq' ? 'Duke dërguar…' : 'Sending…') : t(lang,'contact.send')}
              </button>
            </div>
          )}

          {/* Channel cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {Array.isArray(channels) && channels.map((ch, i) => (
              <div key={i} style={{ background:C.bgWhite, border:`1px solid ${i===2 ? '#FDE68A' : C.border}`, borderRadius:14, padding:'16px 14px', display:'flex', flexDirection:'column', gap:8, alignItems:'center', textAlign:'center' }}>
                <div style={{ width:40, height:40, borderRadius:10, background: i===2 ? '#FFFBEB' : C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {CHANNEL_ICONS[i]}
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, marginBottom:3, textTransform:'uppercase', letterSpacing:'0.3px' }}>{ch.label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color: i===2 ? '#92400E' : C.textPrimary }}>{ch.value}</div>
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
