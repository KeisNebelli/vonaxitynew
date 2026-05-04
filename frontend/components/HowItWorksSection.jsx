'use client';
import { useState, useEffect, useCallback } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

/* ── Inline dashboard mockups ───────────────────────────── */

function MockupBooking({ plans }) {
  const displayPlans = plans && plans.length === 3 ? plans : [
    { name:'Basic',    price:'€30',  visits:1, featured:false },
    { name:'Standard', price:'€50',  visits:2, featured:true  },
    { name:'Premium',  price:'€120', visits:4, featured:false },
  ];
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      {/* Browser bar */}
      <div style={{ background:'#1E293B', padding:'8px 14px', display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#F59E0B' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E' }}/>
        <div style={{ flex:1, background:'#334155', borderRadius:4, padding:'3px 10px', marginLeft:8, fontSize:10, color:'rgba(255,255,255,0.5)' }}>vonaxity.com/signup</div>
      </div>
      <div style={{ padding:'20px 18px' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#111827', marginBottom:14 }}>Choose your plan</div>
        {/* Plan cards — live from CRM */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:16 }}>
          {displayPlans.map((p, i) => (
            <div key={p.name} style={{ border: p.featured ? '2px solid #2563EB' : '1px solid #E5E7EB', borderRadius:10, padding:'10px 8px', textAlign:'center', background: p.featured ? '#EFF6FF' : '#fff', position:'relative' }}>
              {p.featured && <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', background:'#2563EB', color:'#fff', fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:99, whiteSpace:'nowrap' }}>POPULAR</div>}
              <div style={{ fontSize:10, fontWeight:600, color: p.featured ? '#2563EB':'#6B7280', marginBottom:3 }}>{p.name}</div>
              <div style={{ fontSize:16, fontWeight:800, color:'#111827', letterSpacing:'-0.5px' }}>{p.price}</div>
              <div style={{ fontSize:9, color:'#9CA3AF', marginTop:2 }}>{p.visits} {p.visits === 1 ? 'visit' : 'visits'}/mo</div>
            </div>
          ))}
        </div>
        {/* Form fields */}
        <div style={{ fontSize:10, fontWeight:600, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>Patient details</div>
        {[['Full name','Fatmira Murati'],['City','Tirana'],['Services needed','Blood pressure, glucose check']].map(([label,val]) => (
          <div key={label} style={{ marginBottom:8 }}>
            <div style={{ fontSize:10, color:'#9CA3AF', marginBottom:2 }}>{label}</div>
            <div style={{ background:'#fff', border:'1px solid #D1D5DB', borderRadius:7, padding:'6px 10px', fontSize:11, color:'#374151' }}>{val}</div>
          </div>
        ))}
        <div style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', borderRadius:8, padding:'9px', textAlign:'center', color:'#fff', fontWeight:700, fontSize:12, marginTop:4 }}>
          Confirm booking →
        </div>
      </div>
    </div>
  );
}

function MockupNurse() {
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <div style={{ background:'#1E293B', padding:'8px 14px', display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#F59E0B' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E' }}/>
        <div style={{ flex:1, background:'#334155', borderRadius:4, padding:'3px 10px', marginLeft:8, fontSize:10, color:'rgba(255,255,255,0.5)' }}>vonaxity.com/dashboard</div>
      </div>
      <div style={{ padding:'20px 18px' }}>
        {/* Confirmation banner */}
        <div style={{ background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:10, padding:'10px 14px', display:'flex', gap:10, alignItems:'center', marginBottom:16 }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#065F46' }}>Nurse confirmed!</div>
            <div style={{ fontSize:10, color:'#059669' }}>Arriving tomorrow · 10:00 AM</div>
          </div>
        </div>
        {/* Nurse card */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'14px' }}>
          <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
            <img src="/nurse-elona.png" alt="Elona" style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover', border:'2px solid #DBEAFE' }}/>
            <div>
              <div style={{ fontWeight:700, color:'#111827', fontSize:13 }}>Elona Berberi</div>
              <div style={{ fontSize:10, color:'#2563EB', fontWeight:500 }}>General Nursing · 6 yrs exp</div>
              <div style={{ display:'flex', gap:1, marginTop:3 }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontSize:10, color:'#6B7280', marginLeft:3 }}>5.0 (38)</span>
              </div>
            </div>
            <div style={{ marginLeft:'auto', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'4px 8px', fontSize:10, fontWeight:700, color:'#2563EB' }}>Verified</div>
          </div>
          {/* Visit details */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['Date','Mon, May 5'],['Time','10:00 AM'],['Services','BP + Glucose'],['Location','Tirana, AL-01']].map(([k,v]) => (
              <div key={k} style={{ background:'#F9FAFB', borderRadius:7, padding:'7px 9px' }}>
                <div style={{ fontSize:9, color:'#9CA3AF', marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'#374151' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupCare() {
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <div style={{ background:'#1E293B', padding:'8px 14px', display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#F59E0B' }}/>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E' }}/>
        <div style={{ flex:1, background:'#334155', borderRadius:4, padding:'3px 10px', marginLeft:8, fontSize:10, color:'rgba(255,255,255,0.5)' }}>vonaxity.com/dashboard</div>
      </div>
      <div style={{ padding:'20px 18px' }}>
        {/* Visit done banner */}
        <div style={{ background:'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border:'1px solid #C4B5FD', borderRadius:10, padding:'10px 14px', display:'flex', gap:10, alignItems:'center', marginBottom:16 }}>
          <div style={{ fontSize:20 }}>✅</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#4C1D95' }}>Visit completed</div>
            <div style={{ fontSize:10, color:'#7C3AED' }}>May 5 · 10:00–10:45 AM · Elona Berberi</div>
          </div>
        </div>
        {/* Health report */}
        <div style={{ fontSize:11, fontWeight:700, color:'#111827', marginBottom:10 }}>Health Report</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          {[
            { label:'Blood Pressure', val:'118 / 76', unit:'mmHg', ok:true },
            { label:'Glucose', val:'94', unit:'mg/dL', ok:true },
            { label:'Heart Rate', val:'72', unit:'bpm', ok:true },
            { label:'SpO₂', val:'98', unit:'%', ok:true },
          ].map(r => (
            <div key={r.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'10px' }}>
              <div style={{ fontSize:9, color:'#9CA3AF', marginBottom:4 }}>{r.label}</div>
              <div style={{ fontSize:15, fontWeight:800, color:'#111827', letterSpacing:'-0.5px' }}>{r.val} <span style={{ fontSize:9, fontWeight:500, color:'#6B7280' }}>{r.unit}</span></div>
              <div style={{ fontSize:9, fontWeight:600, color:'#059669', marginTop:3 }}>✓ Normal</div>
            </div>
          ))}
        </div>
        {/* Nurse note */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'9px 11px' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#92400E', marginBottom:3 }}>NURSE NOTE</div>
          <div style={{ fontSize:10, color:'#78350F', lineHeight:1.6 }}>Patient is in stable condition. Recommend continuing current medication. Next check-in in 2 weeks.</div>
        </div>
        <div style={{ marginTop:12, background:'#EFF6FF', borderRadius:8, padding:'8px 12px', fontSize:10, fontWeight:600, color:'#2563EB', textAlign:'center' }}>
          📧 Full report sent to your email
        </div>
      </div>
    </div>
  );
}

/* ── Step modal content ─────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    title: 'Book online',
    color: '#7C3AED',
    colorLight: 'rgba(124,58,237,0.08)',
    badge: 'Takes 2 minutes',
    headline: 'Pick a plan, tell us about your loved one',
    description: 'Choose a subscription plan that fits your needs, then enter your family member\'s details — name, city, and the services required. No phone calls, no paperwork.',
    bullets: [
      'Select Basic, Standard, or Premium',
      'Enter patient name and location',
      'Choose services (BP check, glucose, wound care…)',
      'Pay securely — confirmation arrives instantly',
    ],
    Mockup: MockupBooking,
  },
  {
    num: '02',
    title: 'We assign a nurse',
    color: '#2563EB',
    colorLight: 'rgba(37,99,235,0.08)',
    badge: 'Within 24 hours',
    headline: 'A verified nurse is matched and confirmed',
    description: 'Our team matches you with a licensed nurse in your city based on the services needed. You\'ll see their profile, rating, and credentials before they arrive.',
    bullets: [
      'Matched by specialty and proximity',
      'View nurse profile, rating, and certifications',
      'Appointment confirmed with exact time slot',
      'SMS + email reminder sent to you',
    ],
    Mockup: MockupNurse,
  },
  {
    num: '03',
    title: 'Care is delivered',
    color: '#059669',
    colorLight: 'rgba(5,150,105,0.08)',
    badge: 'At your doorstep',
    headline: 'The nurse visits, you get a full health report',
    description: 'The nurse arrives at the scheduled time and performs all requested health services. A detailed report with vitals and nurse notes is sent to you the same day.',
    bullets: [
      'Nurse arrives at your door on schedule',
      'All requested services performed',
      'Vitals recorded (BP, glucose, SpO₂…)',
      'Full health report delivered to your email',
    ],
    Mockup: MockupCare,
  },
];

/* ── Main component ─────────────────────────────────────── */
export default function HowItWorksSection({ lang, tag, title, subtitle, steps, plans }) {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);

  const open = useCallback((i) => {
    setActive(i);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setActive(null), 320);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (active === null) return;
    const handler = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, close]);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const step = active !== null ? STEPS[active] : null;

  return (
    <>
      <style>{`
        .hiw-card {
          cursor: pointer;
          background: #fff;
          border-radius: 22px;
          border: 1px solid #E5E7EB;
          padding: 32px 26px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.22s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.22s ease;
          height: 100%;
          outline: none;
        }
        .hiw-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(124,58,237,0.13);
          border-color: rgba(124,58,237,0.2);
        }
        .hiw-caret {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #7C3AED;
          background: rgba(124,58,237,0.07);
          border: 1px solid rgba(124,58,237,0.15);
          padding: 5px 12px;
          border-radius: 99px;
          transition: background 0.18s ease, gap 0.18s ease;
        }
        .hiw-card:hover .hiw-caret {
          background: rgba(124,58,237,0.13);
          gap: 9px;
        }
        /* ── Modal overlay ── */
        .hiw-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.55);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .hiw-overlay.vis { opacity: 1; }
        /* ── Modal card ── */
        .hiw-modal {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          transform: scale(0.93) translateY(18px);
          opacity: 0;
          transition: transform 0.32s cubic-bezier(0.34,1.26,0.64,1), opacity 0.28s ease;
        }
        .hiw-overlay.vis .hiw-modal { transform: scale(1) translateY(0); opacity: 1; }
        .hiw-modal-left  { padding: 44px 40px; }
        .hiw-modal-right { padding: 32px 32px 32px 0; display: flex; align-items: center; }
        .hiw-close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid #E5E7EB;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          color: #6B7280;
          transition: background 0.15s, border-color 0.15s;
          z-index: 2;
        }
        .hiw-close:hover { background: #FEF2F2; border-color: #FCA5A5; color: #EF4444; }
        @media (max-width: 680px) {
          .hiw-modal {
            grid-template-columns: 1fr;
            max-height: 88vh;
          }
          .hiw-modal-left  { padding: 36px 24px 20px; }
          .hiw-modal-right { padding: 0 24px 32px; }
        }
      `}</style>

      {/* ── Section ── */}
      <section id="how-it-works" style={{ padding:'96px 24px', background:'#fff', scrollMarginTop:'76px', position:'relative', zIndex:1, overflow:'hidden' }}>
        {/* Watermark cross */}
        <div style={{ position:'absolute', top:'50%', right:-60, transform:'translateY(-50%)', opacity:0.025, pointerEvents:'none' }}>
          <svg width="340" height="340" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#7C3AED"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#7C3AED"/></svg>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#7C3AED', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', padding:'5px 13px', borderRadius:99, marginBottom:16 }}>
                {tag}
              </div>
              <h2 style={{ fontSize:'clamp(30px,4vw,46px)', fontWeight:800, color:'#111827', margin:'0 0 14px', letterSpacing:'-1.5px' }}>{title}</h2>
              <p style={{ fontSize:16, color:'#6B7280', maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
                {subtitle || 'From booking to bedside — fast, simple, and completely transparent.'}
              </p>
            </div>
          </ScrollReveal>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
            {STEPS.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div
                  className="hiw-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => open(i)}
                  onKeyDown={(e) => e.key === 'Enter' && open(i)}
                  aria-label={`Learn more about step ${i+1}: ${s.title}`}
                >
                  {/* Watermark number */}
                  <div style={{ position:'absolute', right:14, bottom:8, fontSize:88, fontWeight:900, color:'rgba(124,58,237,0.04)', letterSpacing:'-4px', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                    {i + 1}
                  </div>
                  {/* Step circle */}
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED 0%,#2563EB 100%)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, boxShadow:'0 6px 18px rgba(124,58,237,0.28)' }}>
                    <span style={{ fontSize:16, fontWeight:800, color:'#fff' }}>0{i+1}</span>
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#111827', marginBottom:10, lineHeight:1.35 }}>
                    {Array.isArray(steps) && steps[i]?.title || s.title}
                  </div>
                  <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.7 }}>
                    {Array.isArray(steps) && steps[i]?.desc || s.description}
                  </div>
                  <div className="hiw-caret">
                    See how it works
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      {active !== null && step && (
        <div
          className={`hiw-overlay${visible ? ' vis' : ''}`}
          onClick={close}
        >
          <div
            className="hiw-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ position:'relative' }}
          >
            <button className="hiw-close" onClick={close} aria-label="Close">✕</button>

            {/* Left: text */}
            <div className="hiw-modal-left">
              {/* Step badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background: step.colorLight, border:`1px solid ${step.color}22`, borderRadius:99, padding:'5px 14px', marginBottom:20 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'#fff' }}>0{active+1}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color: step.color, textTransform:'uppercase', letterSpacing:'0.8px' }}>{step.badge}</span>
              </div>

              <h3 style={{ fontSize:'clamp(20px,2.5vw,28px)', fontWeight:800, color:'#111827', margin:'0 0 14px', letterSpacing:'-0.8px', lineHeight:1.2 }}>
                {step.headline}
              </h3>
              <p style={{ fontSize:15, color:'#6B7280', lineHeight:1.75, margin:'0 0 24px' }}>
                {step.description}
              </p>

              {/* Bullets */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {step.bullets.map((b, bi) => (
                  <div key={bi} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background: step.colorLight, border:`1.5px solid ${step.color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize:14, color:'#374151', lineHeight:1.55 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Nav between steps */}
              <div style={{ display:'flex', gap:8, marginTop:32 }}>
                {STEPS.map((_, si) => (
                  <button
                    key={si}
                    onClick={() => { setVisible(false); setTimeout(() => { setActive(si); requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, 160); }}
                    style={{ width: si === active ? 28 : 8, height:8, borderRadius:99, border:'none', background: si === active ? step.color : '#E5E7EB', cursor:'pointer', transition:'width 0.3s ease, background 0.2s ease', padding:0 }}
                    aria-label={`Step ${si+1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: mockup */}
            <div className="hiw-modal-right" style={{ background:'linear-gradient(145deg,#F8FAFF 0%,#F5F3FF 100%)', borderRadius:'0 24px 24px 0' }}>
              <div style={{ width:'100%' }}>
                <step.Mockup plans={active === 0 ? plans : undefined} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
