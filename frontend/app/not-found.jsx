import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif", padding:24 }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ fontSize:72, fontWeight:800, color:'#E2E8F0', letterSpacing:'-4px', lineHeight:1, marginBottom:24 }}>404</div>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:12 }}>Page not found</h1>
        <p style={{ fontSize:16, color:'#475569', lineHeight:1.7, marginBottom:32 }}>The page you're looking for doesn't exist or has been moved.</p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/en" style={{ display:'inline-block', background:'#2563EB', color:'#fff', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontWeight:600, fontSize:15 }}>Go home →</Link>
          <Link href="/en/login" style={{ display:'inline-block', background:'#F1F5F9', color:'#475569', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontWeight:600, fontSize:15 }}>Sign in</Link>
        </div>
        <div style={{ marginTop:48, fontSize:20, fontWeight:700, color:'#2563EB' }}>Vonaxity</div>
      </div>
    </div>
  );
}
