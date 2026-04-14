'use client';
import { useState } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function FAQPage({ params }) {
  const lang = params.lang || 'en';
  const [open, setOpen] = useState(null);
  const faqs = t(lang, 'faq.items');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />
      <section style={{ padding:'80px 24px', background:C.bgWhite, textAlign:'center' }}>
        <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>{t(lang,'faq.tag')}</div>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', margin:0 }}>{t(lang,'faq.title')}</h1>
      </section>
      <section style={{ padding:'40px 24px 80px', background:C.bg }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          {Array.isArray(faqs) && faqs.map((f,i) => (
            <div key={i} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${open===i?C.primary:C.border}`, marginBottom:8, overflow:'hidden', transition:'border-color 0.15s' }}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', background:'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ fontSize:15, fontWeight:600, color:C.textPrimary }}>{f.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open===i?C.primary:'#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginLeft:12, transform:open===i?'rotate(180deg)':'none', transition:'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {open===i && <div style={{ padding:'0 22px 18px', fontSize:14, color:C.textSecondary, lineHeight:1.75 }}>{f.a}</div>}
            </div>
          ))}
          <div style={{ marginTop:28, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', fontSize:13, color:'#92400E', textAlign:'center' }}>
            {lang === 'sq' ? 'Vetëm kujdes jo-urgjent. Urgjencë në Shqipëri:' : 'Non-emergency care only. Emergency in Albania:'} <strong>127</strong>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
