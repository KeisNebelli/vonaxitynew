'use client';
import Link from 'next/link';

/* ─── Tag pill ─── */
const TAG = ({ children }) => (
  <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#7C3AED', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', padding:'5px 13px', borderRadius:99, marginBottom:16 }}>
    {children}
  </div>
);

export default function HeroSection({ lang, badge, headline1, headline2, subtitle, cta1, cta2, visitToday, nurseLabel, nurseName, timeLabel, timeVal, serviceLabel, serviceVal, patientName, patientSub, stat1, stat2, stat3, statN1, statN2, statN3 }) {
  return (
    <section style={{ position:'relative', padding:'80px 24px 96px', zIndex:1 }}>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:60, alignItems:'center' }}>

        {/* Left: copy */}
        <div>
          <TAG>{badge}</TAG>
          <h1 style={{ fontSize:'clamp(38px,5vw,56px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-1.5px', color:'#111827', margin:'0 0 20px' }}>
            {headline1}<br />
            <span style={{ background:'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>{headline2}</span>
          </h1>
          <p style={{ fontSize:17, lineHeight:1.75, color:'#6B7280', maxWidth:480, margin:'0 0 36px' }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:52 }}>
            <Link href={`/${lang}/signup`}>
              <button
                style={{ fontSize:15, fontWeight:600, padding:'14px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', color:'#fff', cursor:'pointer', boxShadow:'0 4px 18px rgba(124,58,237,0.35)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.52)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 18px rgba(124,58,237,0.35)'}}>
                {cta1}
              </button>
            </Link>
            <Link href={`/${lang}/how-it-works`}>
              <button
                style={{ fontSize:15, fontWeight:600, padding:'13px 28px', borderRadius:10, border:'2px solid rgba(124,58,237,0.18)', background:'rgba(255,255,255,0.65)', color:'#111827', cursor:'pointer', backdropFilter:'blur(12px)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(245,243,255,0.85)';e.currentTarget.style.borderColor='rgba(124,58,237,0.38)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.65)';e.currentTarget.style.borderColor='rgba(124,58,237,0.18)';e.currentTarget.style.transform=''}}>
                {cta2}
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:40 }}>
            {[[statN1, stat1], [statN2, stat2], [statN3, stat3]].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize:32, fontWeight:800, background:'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', letterSpacing:'-1.5px' }}>{n}</div>
                <div style={{ fontSize:12, color:'#9CA3AF', marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo + floating card */}
        <div style={{ position:'relative' }}>
          <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 48px rgba(124,58,237,0.16)', border:'1px solid rgba(196,181,253,0.25)' }}>
            <img
              src="/hero.jpg"
              alt="Nurse visiting patient at home"
              style={{ width:'100%', height:'clamp(260px,40vw,460px)', objectFit:'cover', display:'block' }}
            />
          </div>
          {/* Floating info card */}
          <div style={{ position:'absolute', bottom:20, left:20, right:20, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(20px)', borderRadius:16, padding:'16px 18px', boxShadow:'0 4px 24px rgba(0,0,0,0.10)', border:'1px solid rgba(196,181,253,0.35)' }}>
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
                  <div style={{ fontSize:13, fontWeight:600, color: blue ? '#7C3AED' : '#111827' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
