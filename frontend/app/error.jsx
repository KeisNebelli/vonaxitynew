'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => { console.error('App error:', error); }, [error]);
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif", padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:12 }}>Something went wrong</h1>
        <p style={{ fontSize:15, color:'#475569', lineHeight:1.7, marginBottom:32 }}>An unexpected error occurred. Please try again or go back to the homepage.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={reset} style={{ background:'#2563EB', color:'#fff', border:'none', padding:'12px 28px', borderRadius:10, fontWeight:600, fontSize:15, cursor:'pointer' }}>Try again</button>
          <Link href="/en" style={{ display:'inline-block', background:'#F1F5F9', color:'#475569', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontWeight:600, fontSize:15 }}>Go home</Link>
        </div>
        <div style={{ marginTop:48, fontSize:20, fontWeight:700, color:'#2563EB' }}>Vonaxity</div>
      </div>
    </div>
  );
}
