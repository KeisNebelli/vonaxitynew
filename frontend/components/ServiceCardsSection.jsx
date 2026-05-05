'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';

/* ── Rich per-service data ───────────────────────────────── */
const SERVICE_META = [
  {
    color: '#7C3AED', colorLight: 'rgba(124,58,237,0.08)', colorBorder: 'rgba(124,58,237,0.2)',
    gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)',
    duration: '15–20 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    included: [
      'Systolic & diastolic measurement',
      '3 consecutive readings for accuracy',
      'Results compared to your baseline history',
      'Nurse notes on trends and anomalies',
      'Immediate alert if readings are critical',
    ],
    bestFor: ['Hypertension', 'Medication monitoring', 'Routine wellness'],
    detail: 'Our nurse uses a calibrated digital sphygmomanometer to take three readings at 2-minute intervals. Results are logged instantly to your health dashboard and compared against your previous visits.',
  },
  {
    color: '#0EA5E9', colorLight: 'rgba(14,165,233,0.08)', colorBorder: 'rgba(14,165,233,0.2)',
    gradient: 'linear-gradient(135deg,#0EA5E9 0%,#0369A1 100%)',
    duration: '10–15 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
    included: [
      'Finger-prick blood glucose test',
      'Reading logged to your health record',
      'Alert if levels outside safe range',
      'Pre & post-meal comparison available',
      'Nurse guidance on diet and medication',
    ],
    bestFor: ['Diabetes management', 'Pre/post-meal checks', 'Medication adjustments'],
    detail: 'Using a certified glucose meter, our nurse tests blood sugar levels and records them in real time. Results are immediately visible on your dashboard, and any out-of-range readings trigger a nurse follow-up call.',
  },
  {
    color: '#059669', colorLight: 'rgba(5,150,105,0.08)', colorBorder: 'rgba(5,150,105,0.2)',
    gradient: 'linear-gradient(135deg,#059669 0%,#065F46 100%)',
    duration: '20–30 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    included: [
      'Heart rate & rhythm check',
      'Body temperature measurement',
      'SpO₂ (oxygen saturation) reading',
      'Respiratory rate assessment',
      'Full vitals logged to health report',
    ],
    bestFor: ['Post-illness recovery', 'Chronic condition monitoring', 'General wellness'],
    detail: 'A comprehensive snapshot of your loved one\'s physiological state. All five core vital signs are measured with clinical-grade equipment, recorded to their health file, and flagged if any reading falls outside normal ranges.',
  },
  {
    color: '#DC2626', colorLight: 'rgba(220,38,38,0.08)', colorBorder: 'rgba(220,38,38,0.2)',
    gradient: 'linear-gradient(135deg,#DC2626 0%,#991B1B 100%)',
    duration: '20–30 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    included: [
      'Venous blood draw by certified nurse',
      'Same-day courier to certified Albanian lab',
      'Results shared via your health dashboard',
      'Nurse follow-up on abnormal values',
      'Supports all standard lab panels (CBC, lipids, etc.)',
    ],
    bestFor: ['Routine lab panels', 'Medication monitoring', 'Pre-surgical checks'],
    detail: 'No more waiting rooms. Our nurse draws the sample at home, ensures proper handling and cold chain if required, and dispatches it directly to a certified Albanian laboratory. Results typically arrive within 24–48 hours.',
  },
  {
    color: '#D97706', colorLight: 'rgba(217,119,6,0.08)', colorBorder: 'rgba(217,119,6,0.2)',
    gradient: 'linear-gradient(135deg,#D97706 0%,#92400E 100%)',
    duration: '45–60 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    included: [
      'Full physical assessment',
      'Mental health & mood screening',
      'Medication review and adherence check',
      'Home environment safety assessment',
      'Detailed family debrief report',
    ],
    bestFor: ['Elderly living alone', 'Post-hospital discharge', 'Peace of mind'],
    detail: 'Our most comprehensive visit. The nurse spends a full hour assessing physical and mental wellbeing, reviewing all current medications, and flagging any environmental risks. A detailed report with photos of any concerns is sent directly to the family.',
  },
  {
    color: '#2563EB', colorLight: 'rgba(37,99,235,0.08)', colorBorder: 'rgba(37,99,235,0.2)',
    gradient: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%)',
    duration: '30–45 min',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    iconSmall: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    included: [
      'Wound inspection & professional dressing change',
      'Drain and suture integrity check',
      'Pain, swelling & infection assessment',
      'Medication adherence and dosage review',
      'Surgeon liaison report if abnormalities found',
    ],
    bestFor: ['Post-surgery recovery', 'Wound management', 'Drain removal prep'],
    detail: 'Following any surgical procedure, our nurses provide clinical-grade at-home care. They inspect the wound site, change dressings with sterile technique, assess for infection or complications, and compile a report to share with the treating surgeon.',
  },
];

export default function ServiceCardsSection({ lang, services }) {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const touchStartX = useRef(null);

  const open = useCallback((i) => {
    setLeaving(false);
    setActive(i);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const close = useCallback(() => {
    setLeaving(true);
    setVisible(false);
    setTimeout(() => { setActive(null); setLeaving(false); }, 280);
  }, []);

  const goPrev = useCallback(() => {
    if (active <= 0) return;
    setLeaving(true); setVisible(false);
    setTimeout(() => { setActive(a => a - 1); setLeaving(false); setVisible(true); }, 180);
  }, [active]);

  const goNext = useCallback(() => {
    if (active >= SERVICE_META.length - 1) return;
    setLeaving(true); setVisible(false);
    setTimeout(() => { setActive(a => a + 1); setLeaving(false); setVisible(true); }, 180);
  }, [active]);

  useEffect(() => {
    if (active === null) return;
    const h = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [active, goNext, goPrev, close]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const onTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) { diff > 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  const meta = active !== null ? SERVICE_META[active] : null;
  const svc  = active !== null && Array.isArray(services) ? services[active] : null;

  return (
    <>
      <style>{`
        @keyframes svc-fade-up {
          from { opacity:0; transform:translateY(24px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes svc-fade-down {
          from { opacity:1; transform:translateY(0)    scale(1);    }
          to   { opacity:0; transform:translateY(16px) scale(0.97); }
        }
        @keyframes svc-overlay-in  { from{opacity:0} to{opacity:1} }
        @keyframes svc-overlay-out { from{opacity:1} to{opacity:0} }

        .svc-card {
          background:#fff;
          border-radius:18px;
          border:1px solid #E5E7EB;
          padding:26px 22px;
          cursor:pointer;
          position:relative;
          overflow:hidden;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.22s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.22s ease;
          outline:none;
          display:flex;
          flex-direction:column;
        }
        .svc-card::after {
          content:'';
          position:absolute;
          inset:0;
          border-radius:18px;
          opacity:0;
          transition:opacity 0.22s ease;
        }
        .svc-card:hover {
          transform:translateY(-5px);
          box-shadow:0 16px 40px rgba(0,0,0,0.1);
        }
        .svc-card:hover .svc-arrow { opacity:1; transform:translateX(0); }
        .svc-card:focus-visible { box-shadow:0 0 0 3px rgba(124,58,237,0.4); }

        .svc-arrow {
          opacity:0;
          transform:translateX(-4px);
          transition:opacity 0.2s ease, transform 0.2s ease;
          margin-left:auto;
          flex-shrink:0;
        }

        .svc-overlay {
          position:fixed;
          top:0; left:0; right:0; bottom:0;
          width:100vw; height:100vh;
          background:rgba(15,23,42,0.65);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          z-index:9500;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:24px;
          box-sizing:border-box;
        }
        .svc-overlay.is-visible  { animation:svc-overlay-in  0.25s ease both; }
        .svc-overlay.is-leaving  { animation:svc-overlay-out 0.25s ease both; }
        .svc-modal {
          background:#fff;
          border-radius:24px;
          box-shadow:0 40px 100px rgba(0,0,0,0.25);
          width:100%;
          max-width:640px;
          max-height:90vh;
          overflow-y:auto;
          position:relative;
          scrollbar-width:thin;
          transition:opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.1,0.64,1);
        }
        .svc-modal.is-visible { animation:svc-fade-up   0.32s cubic-bezier(0.34,1.26,0.64,1) both; }
        .svc-modal.is-leaving { animation:svc-fade-down 0.25s ease both; }
        .svc-modal::-webkit-scrollbar { width:4px; }
        .svc-modal::-webkit-scrollbar-track { background:transparent; }
        .svc-modal::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:99px; }

        .svc-modal-header {
          padding:36px 36px 28px;
          position:relative;
          border-radius:24px 24px 0 0;
          overflow:hidden;
        }
        .svc-modal-body { padding:28px 36px 36px; }

        .svc-close {
          position:absolute;
          top:14px; right:14px;
          width:34px; height:34px;
          border-radius:50%;
          border:none;
          background:rgba(255,255,255,0.18);
          backdrop-filter:blur(4px);
          color:#fff;
          font-size:16px;
          cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          z-index:2;
          transition:background 0.15s;
        }
        .svc-close:hover { background:rgba(255,255,255,0.3); }

        .svc-nav-btn {
          width:36px; height:36px;
          border-radius:50%;
          border:1.5px solid #E5E7EB;
          background:#fff;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
          transition:all 0.15s ease;
          flex-shrink:0;
        }
        .svc-nav-btn:hover:not(:disabled) { border-color:#7C3AED; background:#F5F3FF; }
        .svc-nav-btn:disabled { opacity:0.3; cursor:default; }

        .svc-included-item {
          display:flex; gap:10px; align-items:flex-start;
          padding:9px 12px;
          border-radius:10px;
          background:#FAFAF9;
          border:1px solid #F3F4F6;
          transition:background 0.15s;
        }
        .svc-included-item:hover { background:#F5F3FF; border-color:rgba(124,58,237,0.15); }

        @media (max-width:640px) {
          .svc-overlay { padding:0; align-items:flex-end; }
          .svc-modal { max-height:92vh; border-radius:24px 24px 0 0; }
          .svc-modal-header { padding:28px 22px 22px; }
          .svc-modal-body { padding:22px 22px 32px; }
        }
      `}</style>

      {/* ── Cards grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:16, marginBottom:32 }}>
        {SERVICE_META.map((meta, i) => (
          <div
            key={i}
            className="svc-card"
            role="button"
            tabIndex={0}
            onClick={() => open(i)}
            onKeyDown={(e) => e.key === 'Enter' && open(i)}
            aria-label={Array.isArray(services) && services[i]?.title}
            style={{ '--card-color': meta.color }}
          >
            {/* Faint color wash on hover — done via ::after pseudo, but we use inline for the icon bg */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:meta.gradient, borderRadius:'18px 18px 0 0', opacity:0.7 }} />

            {/* Icon */}
            <div style={{ width:48, height:48, borderRadius:13, background:meta.colorLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, border:`1px solid ${meta.colorBorder}` }}>
              {meta.iconSmall}
            </div>

            {/* Title row */}
            <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
              <div style={{ fontSize:15, fontWeight:700, color:'#111827', flex:1, lineHeight:1.35 }}>
                {Array.isArray(services) && services[i]?.title}
              </div>
              <div className="svc-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>

            {/* Desc */}
            <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.65, flex:1, marginBottom:16 }}>
              {Array.isArray(services) && services[i]?.desc}
            </div>

            {/* Footer: duration + "learn more" */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:meta.color, background:meta.colorLight, padding:'4px 10px', borderRadius:99 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {meta.duration}
              </div>
              <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF' }}>Tap for details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {active !== null && meta && svc && (
        <div
          className={`svc-overlay ${leaving ? 'is-leaving' : visible ? 'is-visible' : ''}`}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className={`svc-modal ${leaving ? 'is-leaving' : visible ? 'is-visible' : ''}`} onClick={(e) => e.stopPropagation()}>

            {/* ── Gradient header ── */}
            <div className="svc-modal-header" style={{ background: meta.gradient }}>
              {/* Decorative circles */}
              <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

              <button className="svc-close" onClick={close} aria-label="Close">✕</button>

              {/* Icon + service number */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, position:'relative', zIndex:1 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.25)' }}>
                  {meta.icon}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>Service {String(active + 1).padStart(2, '0')}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'#fff', width:'fit-content' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {meta.duration}
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.5px', lineHeight:1.2, position:'relative', zIndex:1 }}>
                {svc.title}
              </h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.78)', margin:0, lineHeight:1.65, maxWidth:480, position:'relative', zIndex:1 }}>
                {meta.detail}
              </p>
            </div>

            {/* ── Body ── */}
            <div className="svc-modal-body">

              {/* What's included */}
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>What's included</div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {meta.included.map((item, ii) => (
                    <div key={ii} className="svc-included-item">
                      <div style={{ width:20, height:20, borderRadius:'50%', background:meta.colorLight, border:`1.5px solid ${meta.colorBorder}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={meta.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize:13, color:'#374151', lineHeight:1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best for */}
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>Best for</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {meta.bestFor.map((tag) => (
                    <span key={tag} style={{ fontSize:12, fontWeight:600, color:meta.color, background:meta.colorLight, border:`1px solid ${meta.colorBorder}`, padding:'5px 13px', borderRadius:99 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height:1, background:'#F3F4F6', marginBottom:24 }} />

              {/* Navigation + CTA */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                {/* Prev */}
                <button className="svc-nav-btn" onClick={goPrev} disabled={active === 0} aria-label="Previous service">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {/* Dots */}
                <div style={{ display:'flex', gap:4, flex:1, justifyContent:'center' }}>
                  {SERVICE_META.map((m, si) => (
                    <button
                      key={si}
                      onClick={() => { if (si === active) return; setLeaving(true); setVisible(false); setTimeout(() => { setActive(si); setLeaving(false); setVisible(true); }, 180); }}
                      style={{ width: si === active ? 20 : 6, height:6, borderRadius:99, border:'none', background: si === active ? meta.color : '#E5E7EB', cursor:'pointer', transition:'width 0.3s ease, background 0.2s ease', padding:0, flexShrink:0 }}
                      aria-label={`Go to service ${si + 1}`}
                    />
                  ))}
                </div>
                {/* Next */}
                <button className="svc-nav-btn" onClick={goNext} disabled={active === SERVICE_META.length - 1} aria-label="Next service">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                {/* Book CTA */}
                <Link href={`/en/signup?role=client`} style={{ flex:1, maxWidth:200 }}>
                  <button style={{ width:'100%', background:meta.gradient, color:'#fff', border:'none', borderRadius:11, padding:'11px 18px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 18px ${meta.color}44`, transition:'all 0.18s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${meta.color}55`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 4px 18px ${meta.color}44`; }}
                  >
                    Book this service →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
