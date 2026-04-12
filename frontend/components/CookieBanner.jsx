'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner({ lang='en' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vonaxity-cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem('vonaxity-cookie-consent', 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem('vonaxity-cookie-consent', 'declined'); setVisible(false); };

  if (!visible) return null;

  return (
    <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:9999, background:'#0F172A', color:'#fff', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap', borderTop:'1px solid rgba(255,255,255,0.1)', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ fontSize:13, color:'#CBD5E1', lineHeight:1.6, flex:1, minWidth:240 }}>
        We use cookies to improve your experience and analyze usage.
        {' '}<Link href={`/${lang}/privacy`} style={{ color:'#60A5FA', textDecoration:'underline' }}>Privacy Policy</Link>
      </div>
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        <button onClick={decline} style={{ fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)', background:'transparent', color:'#94A3B8', cursor:'pointer' }}>
          Decline
        </button>
        <button onClick={accept} style={{ fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:8, border:'none', background:'#2563EB', color:'#fff', cursor:'pointer' }}>
          Accept cookies
        </button>
      </div>
    </div>
  );
}
