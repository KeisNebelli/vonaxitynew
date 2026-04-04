'use client';
import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', textPrimary:'#111827', textSecondary:'#6B7280', border:'#E5E7EB', bg:'#FAFAF9' };

export default function Nav({ lang = 'en' }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: t(lang, 'nav.howItWorks'), href: `/${lang}/how-it-works` },
    { label: t(lang, 'nav.services'), href: `/${lang}/services` },
    { label: lang === 'sq' ? 'Infermierët' : 'Our Nurses', href: `/${lang}/nurses` },
    { label: t(lang, 'nav.pricing'), href: `/${lang}/pricing` },
    { label: t(lang, 'nav.about'), href: `/${lang}/about` },
  ];

  const switchLang = (l) => {
    document.cookie = `vonaxity-locale=${l};path=/;max-age=31536000`;
    const path = window.location.pathname.replace(/^\/(en|sq)/, `/${l}`);
    window.location.href = path;
  };

  return (
    <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,255,255,0.96)', backdropFilter:'blur(12px)', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        <Link href={`/${lang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', textDecoration:'none' }}>Vonaxity</Link>

        {/* Desktop nav */}
        <div style={{ display:'flex', gap:24, alignItems:'center', '@media(max-width:768px)':{display:'none'} }} className="desktop-nav">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize:14, color:C.textSecondary, fontWeight:500, textDecoration:'none' }}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ display:'flex', background:'#F5F5F4', borderRadius:8, padding:3, border:`1px solid ${C.border}` }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={()=>switchLang(l)} style={{ padding:'4px 10px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', letterSpacing:'0.3px', background:lang===l?C.primary:'transparent', color:lang===l?'#fff':C.textSecondary }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link href={`/${lang}/login`} className="desktop-only">
            <button style={{ fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:8, border:'none', background:'transparent', color:C.textPrimary, cursor:'pointer' }}>{t(lang,'nav.signIn')}</button>
          </Link>
          <Link href={`/${lang}/signup`} className="desktop-only">
            <button style={{ fontSize:13, fontWeight:600, padding:'9px 18px', borderRadius:8, border:'none', background:C.primary, color:'#fff', cursor:'pointer' }}>{t(lang,'nav.getStarted')}</button>
          </Link>
          {/* Hamburger */}
          <button onClick={()=>setOpen(!open)} className="mobile-only" style={{ background:'transparent', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5 }}>
            <span style={{ display:'block', width:22, height:2, background:C.textPrimary, borderRadius:2, transition:'all 0.2s', transform:open?'rotate(45deg) translate(5px,5px)':'none' }}/>
            <span style={{ display:'block', width:22, height:2, background:C.textPrimary, borderRadius:2, opacity:open?0:1, transition:'all 0.2s' }}/>
            <span style={{ display:'block', width:22, height:2, background:C.textPrimary, borderRadius:2, transition:'all 0.2s', transform:open?'rotate(-45deg) translate(5px,-5px)':'none' }}/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'#fff', borderTop:`1px solid ${C.border}`, padding:'16px 20px 24px' }} className="mobile-only">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={()=>setOpen(false)} style={{ display:'block', fontSize:16, color:C.textPrimary, fontWeight:500, padding:'12px 0', borderBottom:`1px solid #F3F4F6`, textDecoration:'none' }}>{l.label}</Link>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:20 }}>
            <Link href={`/${lang}/login`} style={{ flex:1 }} onClick={()=>setOpen(false)}>
              <button style={{ width:'100%', fontSize:14, fontWeight:600, padding:'12px', borderRadius:10, border:`1.5px solid ${C.border}`, background:'transparent', color:C.textPrimary, cursor:'pointer' }}>Sign in</button>
            </Link>
            <Link href={`/${lang}/signup`} style={{ flex:1 }} onClick={()=>setOpen(false)}>
              <button style={{ width:'100%', fontSize:14, fontWeight:600, padding:'12px', borderRadius:10, border:'none', background:C.primary, color:'#fff', cursor:'pointer' }}>Get started</button>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .desktop-only { display: flex !important; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
