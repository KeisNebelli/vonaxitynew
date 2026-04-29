'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function ContactPage({ params }) {
  const lang = params.lang || 'en';
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const channels = t(lang, 'contact.channels');

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

  const CHANNEL_ICONS = [
    <svg key="e" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    <svg key="w" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    <svg key="x" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,100,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <style>{`
        .cx-input { transition: border-color 0.15s, box-shadow 0.15s; }
        .cx-input:focus { outline: none; border-color: #2563EB !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .cx-btn:hover:not(:disabled) { background: #1D4ED8 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37,99,235,0.35) !important; }
        .cx-btn { transition: background 0.15s, transform 0.15s, box-shadow 0.15s; }
        .cx-channel:hover { background: rgba(255,255,255,0.12) !important; }
        .cx-channel { transition: background 0.15s; }
        @media (max-width: 768px) {
          .cx-grid { grid-template-columns: 1fr !important; }
          .cx-left { border-radius: 20px 20px 0 0 !important; padding: 48px 28px !important; }
          .cx-right { border-radius: 0 0 20px 20px !important; padding: 36px 28px !important; }
        }
      `}</style>
      <Nav lang={lang} />

      {/* ── Page wrapper ── */}
      <section style={{ padding:'60px 24px 80px', background:'linear-gradient(160deg, #F0F4FF 0%, #FAFAF9 60%)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>

          {/* Tag above card */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'6px 16px', borderRadius:99, border:`1px solid rgba(37,99,235,0.15)` }}>
              {t(lang,'contact.tag')}
            </div>
          </div>

          {/* Split card */}
          <div className="cx-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderRadius:24, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.12)', border:`1px solid rgba(0,0,0,0.06)` }}>

            {/* ── Left: dark info panel ── */}
            <div className="cx-left" style={{ background:'linear-gradient(155deg, #0F172A 0%, #1E3A5F 50%, #1D4ED8 100%)', padding:'52px 44px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
              {/* Grid texture */}
              <div style={{ position:'absolute', inset:0, opacity:0.05 }}>
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs><pattern id="cg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                  <rect width="100%" height="100%" fill="url(#cg)"/>
                </svg>
              </div>
              {/* Glow blob */}
              <div style={{ position:'absolute', bottom:-60, right:-60, width:240, height:240, borderRadius:'50%', background:'rgba(37,99,235,0.25)', filter:'blur(60px)', pointerEvents:'none' }}/>

              <div style={{ position:'relative', zIndex:1 }}>
                <h1 style={{ fontSize:'clamp(26px,3vw,38px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.15, marginBottom:16, margin:'0 0 16px' }}>
                  {t(lang,'contact.title')}
                </h1>
                <p style={{ fontSize:15, color:'rgba(255,255,255,0.62)', lineHeight:1.8, margin:'0 0 48px', maxWidth:340 }}>
                  {t(lang,'contact.subtitle')}
                </p>

                {/* Channel items */}
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {Array.isArray(channels) && channels.map((ch, i) => (
                    <div key={i} className="cx-channel" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', borderRadius:14, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.1)', cursor:'default' }}>
                      <div style={{ width:38, height:38, borderRadius:10, background: i===2 ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border: i===2 ? '1px solid rgba(234,179,8,0.3)' : '1px solid rgba(255,255,255,0.1)' }}>
                        {CHANNEL_ICONS[i]}
                      </div>
                      <div>
                        <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{ch.label}</div>
                        <div style={{ fontSize:14, fontWeight:600, color: i===2 ? '#FCD34D' : '#fff' }}>{ch.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tagline */}
              <div style={{ position:'relative', zIndex:1, marginTop:48, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#34D399' }}/>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:500 }}>
                  {lang==='sq' ? 'Përgjigje brenda 24 orëve' : 'Response within 24 hours'}
                </span>
              </div>
            </div>

            {/* ── Right: form panel ── */}
            <div className="cx-right" style={{ background:C.bgWhite, padding:'52px 44px' }}>
              {sent ? (
                <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 0' }}>
                  <div style={{ width:64, height:64, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div style={{ fontSize:22, fontWeight:800, color:C.textPrimary, marginBottom:10, letterSpacing:'-0.5px' }}>{t(lang,'contact.successTitle')}</div>
                  <div style={{ fontSize:14, color:C.textSecondary, lineHeight:1.7, maxWidth:280 }}>{t(lang,'contact.successDesc')}</div>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.textTertiary, display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>{t(lang,'contact.name')}</label>
                    <input className="cx-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      placeholder={lang==='sq' ? 'Emri juaj i plotë' : 'Your full name'}
                      style={{ width:'100%', padding:'13px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bg, fontFamily:'inherit', boxSizing:'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom:20 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.textTertiary, display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>{t(lang,'contact.email')}</label>
                    <input className="cx-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                      placeholder="you@email.com"
                      style={{ width:'100%', padding:'13px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bg, fontFamily:'inherit', boxSizing:'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom:28 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.textTertiary, display:'block', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.5px' }}>{t(lang,'contact.message')}</label>
                    <textarea className="cx-input" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                      placeholder={lang==='sq' ? 'Si mund t\'ju ndihmojmë?' : 'How can we help you?'}
                      rows={5}
                      style={{ width:'100%', padding:'13px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bg, fontFamily:'inherit', boxSizing:'border-box', resize:'vertical' }}
                    />
                  </div>
                  <button className="cx-btn" onClick={handleSend} disabled={!valid || sending}
                    style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'15px', fontSize:15, fontWeight:700, cursor: valid ? 'pointer' : 'default', opacity: valid ? 1 : 0.38, boxShadow: valid ? '0 4px 16px rgba(37,99,235,0.25)' : 'none', letterSpacing:'0.1px' }}>
                    {sending ? (lang==='sq' ? 'Duke dërguar…' : 'Sending…') : t(lang,'contact.send')}
                  </button>
                  <p style={{ fontSize:12, color:C.textTertiary, textAlign:'center', marginTop:16, lineHeight:1.6 }}>
                    {lang==='sq' ? 'Nuk ndajmë emailin tuaj me askënd.' : 'We never share your email with anyone.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
