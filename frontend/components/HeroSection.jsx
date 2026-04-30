'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ─────────────────────────────────────────────
   Canvas: light, flowing purple-violet bokeh
   — matches the existing bright design but adds
     depth & motion like a video background
───────────────────────────────────────────── */
function useCanvasBg(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;

    /* ── particles ── */
    const PALETTE = [
      'rgba(124,58,237,',   // violet
      'rgba(139,92,246,',   // purple
      'rgba(167,139,250,',  // lavender
      'rgba(37,99,235,',    // primary blue
      'rgba(196,181,253,',  // soft lilac
      'rgba(147,197,253,',  // sky blue
    ];
    const COUNT = 75;

    const mkParticle = (W, H) => ({
      x: Math.random() * (W || 1200),
      y: (H || 800) + 10,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.45 + 0.1),
      r: Math.random() * 3 + 0.5,
      alpha: Math.random() * 0.38 + 0.06,
      col: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      life: 0,
      maxLife: Math.random() * 380 + 220,
    });

    let particles = Array.from({ length: COUNT }, () =>
      Object.assign(mkParticle(canvas.width, canvas.height), {
        y: Math.random() * (canvas.height || 800),
        life: Math.random() * 200,
      })
    );

    /* ── large soft bokeh glows ── */
    const BOKEH = [
      { xPct: 0.08, yPct: 0.05, r: 380, col: 'rgba(167,139,250,', a: 0.18, speed: 0.00016 },
      { xPct: 0.88, yPct: 0.10, r: 320, col: 'rgba(124,58,237,',  a: 0.13, speed: 0.00012 },
      { xPct: 0.55, yPct: 0.85, r: 280, col: 'rgba(139,92,246,',  a: 0.10, speed: 0.00019 },
      { xPct: 0.20, yPct: 0.70, r: 240, col: 'rgba(37,99,235,',   a: 0.09, speed: 0.00022 },
      { xPct: 0.78, yPct: 0.55, r: 200, col: 'rgba(196,181,253,', a: 0.12, speed: 0.00028 },
    ];

    const draw = () => {
      t++;
      const W = canvas.width;
      const H = canvas.height;

      /* base gradient — white → soft lavender */
      const bg = ctx.createLinearGradient(0, 0, W * 0.6, H);
      bg.addColorStop(0, '#FFFFFF');
      bg.addColorStop(0.45, `hsl(${250 + Math.sin(t * 0.0005) * 6},80%,97%)`);
      bg.addColorStop(1, `hsl(${244 + Math.sin(t * 0.0007) * 8},75%,95%)`);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      /* bokeh */
      BOKEH.forEach(b => {
        const cx = (b.xPct + Math.sin(t * b.speed) * 0.07) * W;
        const cy = (b.yPct + Math.cos(t * b.speed * 1.4) * 0.06) * H;
        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        radial.addColorStop(0, b.col + b.a + ')');
        radial.addColorStop(1, b.col + '0)');
        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fillStyle = radial;
        ctx.fill();
      });

      /* subtle light-ray streaks */
      [[0.32, 0.00040], [0.62, 0.00030]].forEach(([yFrac, spd], i) => {
        const sy = yFrac * H;
        const off = Math.sin(t * spd + i) * W * 0.35;
        const sg = ctx.createLinearGradient(off, sy, off + W * 0.65, sy);
        sg.addColorStop(0,   'rgba(139,92,246,0)');
        sg.addColorStop(0.5, `rgba(139,92,246,${[0.035, 0.025][i]})`);
        sg.addColorStop(1,   'rgba(139,92,246,0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - 1.5, W, 3);
      });

      /* particles */
      ctx.save();
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife || p.y < -20) {
          Object.assign(p, mkParticle(W, H));
          return;
        }
        const fade = 1 - p.life / p.maxLife;
        ctx.globalAlpha = p.alpha * fade;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + '1)';
        ctx.shadowBlur = p.r * 7;
        ctx.shadowColor = p.col + '0.7)';
        ctx.fill();
      });
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

/* ─── Tag pill — same style as the rest of the page ─── */
const TAG = ({ children }) => (
  <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#7C3AED', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', padding:'5px 13px', borderRadius:99, marginBottom:16 }}>
    {children}
  </div>
);

export default function HeroSection({ lang, badge, headline1, headline2, subtitle, cta1, cta2, visitToday, nurseLabel, nurseName, timeLabel, timeVal, serviceLabel, serviceVal, patientName, patientSub, stat1, stat2, stat3, statN1, statN2, statN3 }) {
  const canvasRef = useRef(null);
  useCanvasBg(canvasRef);

  return (
    <section style={{ position:'relative', padding:'80px 24px 96px', overflow:'hidden' }}>
      {/* ── animated canvas background ── */}
      <canvas ref={canvasRef} aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block', zIndex:0 }} />

      {/* ── content grid ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:60, alignItems:'center', position:'relative', zIndex:1 }}>

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
                style={{ fontSize:15, fontWeight:600, padding:'14px 28px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', color:'#fff', cursor:'pointer', boxShadow:'0 4px 18px rgba(124,58,237,0.38)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(124,58,237,0.55)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 4px 18px rgba(124,58,237,0.38)'}}>
                {cta1}
              </button>
            </Link>
            <Link href={`/${lang}/how-it-works`}>
              <button
                style={{ fontSize:15, fontWeight:600, padding:'13px 28px', borderRadius:10, border:'2px solid rgba(124,58,237,0.2)', background:'rgba(255,255,255,0.7)', color:'#111827', cursor:'pointer', backdropFilter:'blur(8px)', transition:'all 0.18s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(245,243,255,0.9)';e.currentTarget.style.borderColor='rgba(124,58,237,0.4)';e.currentTarget.style.transform='translateY(-1px)'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.7)';e.currentTarget.style.borderColor='rgba(124,58,237,0.2)';e.currentTarget.style.transform=''}}>
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
          <div style={{ borderRadius:20, overflow:'hidden', boxShadow:'0 8px 48px rgba(124,58,237,0.18)' }}>
            <img
              src="/hero.jpg"
              alt="Nurse visiting patient at home"
              style={{ width:'100%', height:'clamp(260px,40vw,460px)', objectFit:'cover', display:'block' }}
            />
          </div>
          {/* Floating info card */}
          <div style={{ position:'absolute', bottom:20, left:20, right:20, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)', borderRadius:16, padding:'16px 18px', boxShadow:'0 4px 24px rgba(0,0,0,0.12)', border:'1px solid rgba(196,181,253,0.4)' }}>
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
