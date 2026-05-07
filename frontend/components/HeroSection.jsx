'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LiveActivity from '@/components/LiveActivity';

function useIsMobile(breakpoint = 480) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return mobile;
}

/* ─── Tag pill ─── */
const TAG = ({ children }) => (
  <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#0D9488', background:'rgba(13,148,136,0.07)', border:'1px solid rgba(13,148,136,0.16)', padding:'5px 13px', borderRadius:99, marginBottom:16 }}>
    {children}
  </div>
);

export default function HeroSection({ lang, badge, headline1, headline2, subtitle, cta1, cta2, visitToday, nurseLabel, nurseName, timeLabel, timeVal, serviceLabel, serviceVal, patientName, patientSub, stat1, stat2, stat3, statN1, statN2, statN3 }) {
  const isMobile = useIsMobile(480);
  return (
    <section style={{ position:'relative', padding:'80px 24px 96px', zIndex:1 }}>
      <style>{`
        @keyframes vx-medcross { 0%,100% { transform:scale(1) rotate(0deg); opacity:0.85; } 50% { transform:scale(1.12) rotate(6deg); opacity:1; } }
        @keyframes vx-medcross2 { 0%,100% { transform:scale(1) rotate(0deg); opacity:0.55; } 50% { transform:scale(1.08) rotate(-4deg); opacity:0.75; } }
      `}</style>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:60, alignItems:'center' }}>

        {/* Left: copy */}
        <div>
          <TAG>{badge}</TAG>
          <h1 style={{ fontSize:'clamp(38px,5vw,56px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-1.5px', color:'#111827', margin:'0 0 20px' }}>
            {headline1}<br />
            <span style={{ background:'linear-gradient(135deg, #1E6FAB 0%, #0D9488 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{headline2}</span>
          </h1>
          <p style={{ fontSize:17, lineHeight:1.75, color:'#6B7280', maxWidth:480, margin:'0 0 24px' }}>
            {subtitle}
          </p>

          {/* Live activity ticker */}
          <div style={{ marginBottom:32 }}>
            <LiveActivity />
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:52 }}>
            <Link href={`/${lang}/signup?role=client`}>
              <button
                style={{ fontSize:15, fontWeight:600, padding:'14px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #2E7BB4 0%, #1E6FAB 100%)', color:'#fff', cursor:'pointer', boxShadow:'0 4px 18px rgba(30,111,171,0.30)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(30,111,171,0.46)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 18px rgba(30,111,171,0.30)'}}>
                {cta1}
              </button>
            </Link>
            <Link href={`/${lang}/how-it-works`}>
              <button
                style={{ fontSize:15, fontWeight:600, padding:'13px 28px', borderRadius:10, border:'2px solid rgba(30,111,171,0.20)', background:'rgba(255,255,255,0.65)', color:'#1A2B3C', cursor:'pointer', backdropFilter:'blur(12px)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(240,248,255,0.88)';e.currentTarget.style.borderColor='rgba(30,111,171,0.40)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.65)';e.currentTarget.style.borderColor='rgba(30,111,171,0.20)';e.currentTarget.style.transform=''}}>
                {cta2}
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, auto)', gap: isMobile ? '16px 24px' : '0 40px' }}>
            {[[statN1, stat1], [statN2, stat2], [statN3, stat3]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: isMobile ? 26 : 32, fontWeight:800, background:'linear-gradient(135deg, #1E6FAB 0%, #0D9488 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-1.5px' }}>{n}</div>
                <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo + floating card */}
        <div style={{ position:'relative' }}>

          {/* Medicine cross — top right corner */}
          <div style={{ position:'absolute', top:-18, right:-18, zIndex:3 }}>
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none" style={{ animation:'vx-medcross 3.6s ease-in-out infinite', transformOrigin:'27px 27px', filter:'drop-shadow(0 2px 10px rgba(13,148,136,0.32))' }}>
              <rect x="19" y="2" width="16" height="50" rx="7" fill="rgba(13,148,136,0.18)" stroke="#0D9488" strokeWidth="2"/>
              <rect x="2" y="19" width="50" height="16" rx="7" fill="rgba(13,148,136,0.18)" stroke="#0D9488" strokeWidth="2"/>
            </svg>
          </div>

          {/* Second smaller cross — bottom left */}
          <div style={{ position:'absolute', bottom:96, left:-22, zIndex:3 }}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ animation:'vx-medcross2 5s ease-in-out infinite', transformOrigin:'17px 17px', filter:'drop-shadow(0 1px 6px rgba(180,155,110,0.28))' }}>
              <rect x="12" y="1" width="10" height="32" rx="4" fill="rgba(180,155,110,0.14)" stroke="rgba(180,155,110,0.50)" strokeWidth="1.5"/>
              <rect x="1" y="12" width="32" height="10" rx="4" fill="rgba(180,155,110,0.14)" stroke="rgba(180,155,110,0.50)" strokeWidth="1.5"/>
            </svg>
          </div>

          <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 48px rgba(30,111,171,0.14)', border:'1px solid rgba(30,111,171,0.18)' }}>
            <img
              src="/hero.jpg"
              alt="Nurse visiting patient at home"
              style={{ width:'100%', height:'clamp(260px,40vw,460px)', objectFit:'cover', display:'block' }}
            />
          </div>
          {/* Floating info card */}
          <div style={{ position:'absolute', bottom:20, left:20, right:20, background:'rgba(255,253,250,0.94)', backdropFilter:'blur(20px)', borderRadius:16, padding:'16px 18px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)', border:'1px solid rgba(30,111,171,0.18)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{patientName}</div>
                <div style={{ fontSize:12, color:'#9CA3AF' }}>{patientSub}</div>
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:'#059669', background:'#ECFDF5', padding:'4px 10px', borderRadius:99 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#059669' }} />
                {visitToday}
              </div>
            </div>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              {[[nurseLabel, nurseName, true], [timeLabel, timeVal, false], [serviceLabel, serviceVal, false]].map(([k, v, blue]) => (
                <div key={k}>
                  <div style={{ fontSize:10, color:'#9CA3AF', marginBottom:2 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600, color: blue ? '#0D9488' : '#1A2B3C' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
