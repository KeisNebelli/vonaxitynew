'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function ContactPage({ params }) {
  const lang = params.lang || 'en';
  const [form, setForm] = useState({ name:'', email:'', message:'' });
  const [sent, setSent] = useState(false);
  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };
  const channels = t(lang, 'contact.channels');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />
      <section style={{ padding:'80px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>{t(lang,'contact.tag')}</div>
          <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:12 }}>{t(lang,'contact.title')}</h1>
          <p style={{ fontSize:16, color:C.textSecondary, marginBottom:40 }}>{t(lang,'contact.subtitle')}</p>
          {sent ? (
            <div style={{ background:C.secondaryLight, border:'1px solid #A7F3D0', borderRadius:16, padding:40, textAlign:'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div style={{ fontSize:18, fontWeight:700, color:C.secondary, marginBottom:8 }}>{t(lang,'contact.successTitle')}</div>
              <div style={{ fontSize:14, color:'#065F46' }}>{t(lang,'contact.successDesc')}</div>
            </div>
          ) : (
            <div style={{ background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:16, padding:'32px 28px', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(lang,'contact.name')}</label>
                <input style={inp} placeholder={t(lang,'contact.name')} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(lang,'contact.email')}</label>
                <input style={inp} type="email" placeholder="you@email.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(lang,'contact.message')}</label>
                <textarea style={{...inp,minHeight:100,resize:'vertical'}} placeholder={t(lang,'contact.message')} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
              </div>
              <button onClick={()=>setSent(true)} disabled={!form.name||!form.email||!form.message} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:(!form.name||!form.email||!form.message)?0.4:1 }}>
                {t(lang,'contact.send')}
              </button>
            </div>
          )}
          <div style={{ marginTop:24, display:'flex', flexDirection:'column', gap:10 }}>
            {Array.isArray(channels) && channels.map((ch,i) => (
              <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', display:'flex', gap:16, alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:10, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {i===0&&<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
                    {i===1&&<><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>}
                    {i===2&&<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize:12, color:C.textTertiary, marginBottom:2 }}>{ch.label}</div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{ch.value}</div>
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
