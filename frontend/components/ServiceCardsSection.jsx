'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';

const COUNT = 8;

const SERVICE_META = [
  {
    name: 'Blood Pressure Check',
    desc: 'Three calibrated readings with nurse notes and instant health dashboard logging.',
    color: '#7C3AED', colorLight: 'rgba(124,58,237,0.08)', colorBorder: 'rgba(124,58,237,0.18)',
    gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)',
    duration: '15–20 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    included: ['Systolic & diastolic measurement','3 consecutive readings for accuracy','Results compared to your baseline history','Nurse notes on trends and anomalies','Immediate alert if readings are critical'],
    bestFor: ['Hypertension', 'Medication monitoring', 'Routine wellness'],
    detail: 'Our nurse uses a calibrated digital sphygmomanometer to take three readings at 2-minute intervals. Results are logged instantly to your health dashboard and compared against your previous visits.',
  },
  {
    name: 'Blood Glucose Test',
    desc: 'Finger-prick test with real-time results, diet guidance, and medication review.',
    color: '#0EA5E9', colorLight: 'rgba(14,165,233,0.08)', colorBorder: 'rgba(14,165,233,0.18)',
    gradient: 'linear-gradient(135deg,#0EA5E9 0%,#0369A1 100%)',
    duration: '10–15 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
    included: ['Finger-prick blood glucose test','Reading logged to your health record','Alert if levels outside safe range','Pre & post-meal comparison available','Nurse guidance on diet and medication'],
    bestFor: ['Diabetes management', 'Pre/post-meal checks', 'Medication adjustments'],
    detail: 'Using a certified glucose meter, our nurse tests blood sugar levels and records them in real time. Results are immediately visible on your dashboard, and any out-of-range readings trigger a nurse follow-up call.',
  },
  {
    name: 'Full Vitals Check',
    desc: 'Five core vital signs measured with clinical-grade equipment and flagged instantly.',
    color: '#059669', colorLight: 'rgba(5,150,105,0.08)', colorBorder: 'rgba(5,150,105,0.18)',
    gradient: 'linear-gradient(135deg,#059669 0%,#065F46 100%)',
    duration: '20–30 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    included: ['Heart rate & rhythm check','Body temperature measurement','SpO₂ (oxygen saturation) reading','Respiratory rate assessment','Full vitals logged to health report'],
    bestFor: ['Post-illness recovery', 'Chronic condition monitoring', 'General wellness'],
    detail: 'A comprehensive snapshot of your loved one\'s physiological state. All five core vital signs are measured with clinical-grade equipment, recorded to their health file, and flagged if any reading falls outside normal ranges.',
  },
  {
    name: 'Blood Draw & Lab Work',
    desc: 'Home blood draw with same-day courier to certified Albanian laboratories.',
    color: '#DC2626', colorLight: 'rgba(220,38,38,0.08)', colorBorder: 'rgba(220,38,38,0.18)',
    gradient: 'linear-gradient(135deg,#DC2626 0%,#991B1B 100%)',
    duration: '20–30 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    included: ['Venous blood draw by certified nurse','Same-day courier to certified Albanian lab','Results shared via your health dashboard','Nurse follow-up on abnormal values','Supports all standard lab panels (CBC, lipids, etc.)'],
    bestFor: ['Routine lab panels', 'Medication monitoring', 'Pre-surgical checks'],
    detail: 'No more waiting rooms. Our nurse draws the sample at home, ensures proper handling and cold chain if required, and dispatches it directly to a certified Albanian laboratory. Results typically arrive within 24–48 hours.',
  },
  {
    name: 'Wellness Assessment',
    desc: 'Comprehensive physical, mental, medication, and home safety evaluation.',
    color: '#D97706', colorLight: 'rgba(217,119,6,0.08)', colorBorder: 'rgba(217,119,6,0.18)',
    gradient: 'linear-gradient(135deg,#D97706 0%,#92400E 100%)',
    duration: '45–60 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    included: ['Full physical assessment','Mental health & mood screening','Medication review and adherence check','Home environment safety assessment','Detailed family debrief report'],
    bestFor: ['Elderly living alone', 'Post-hospital discharge', 'Peace of mind'],
    detail: 'Our most comprehensive visit. The nurse spends a full hour assessing physical and mental wellbeing, reviewing all current medications, and flagging any environmental risks. A detailed report with photos of any concerns is sent directly to the family.',
  },
  {
    name: 'Post-surgical Care',
    desc: 'Sterile wound care, drain checks, and surgeon liaison reporting at home.',
    color: '#2563EB', colorLight: 'rgba(37,99,235,0.08)', colorBorder: 'rgba(37,99,235,0.18)',
    gradient: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%)',
    duration: '30–45 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    included: ['Wound inspection & professional dressing change','Drain and suture integrity check','Pain, swelling & infection assessment','Medication adherence and dosage review','Surgeon liaison report if abnormalities found'],
    bestFor: ['Post-surgery recovery', 'Wound management', 'Drain removal prep'],
    detail: 'Following any surgical procedure, our nurses provide clinical-grade at-home care. They inspect the wound site, change dressings with sterile technique, assess for infection or complications, and compile a report to share with the treating surgeon.',
  },
  {
    name: 'Medication Administration',
    desc: 'On-schedule dosing with side-effect monitoring and a full medication log.',
    color: '#DB2777', colorLight: 'rgba(219,39,119,0.08)', colorBorder: 'rgba(219,39,119,0.18)',
    gradient: 'linear-gradient(135deg,#DB2777 0%,#9D174D 100%)',
    duration: '20–30 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
    included: ['On-schedule medication administration','Dosage verification','Side-effect monitoring and reporting','Injection and IV support','Medication log updated after every visit'],
    bestFor: ['Chronic illness', 'Post-operative care', 'Elderly patients'],
    detail: 'Our nurses ensure medications are taken correctly, at the right time, and in the right dose. Every administration is logged, and any concerning side effects are immediately reported to the family and flagged in the health record.',
  },
  {
    name: 'General Nursing',
    desc: 'Tailored nursing plan for complex, ongoing, or custom care needs.',
    color: '#0F766E', colorLight: 'rgba(15,118,110,0.08)', colorBorder: 'rgba(15,118,110,0.18)',
    gradient: 'linear-gradient(135deg,#0F766E 0%,#134E4A 100%)',
    duration: '30–60 min',
    icon: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    included: ['Tailored nursing plan per patient','Ongoing assessment and adaptation','Family communication after every visit','Coordination with doctors if needed','Full visit report to health dashboard'],
    bestFor: ['Complex care needs', 'Long-term conditions', 'Custom requirements'],
    detail: 'When no single service fits, General Nursing covers it. Our nurse assesses the patient\'s full situation and provides personalised care — from companionship and mobility support to clinical monitoring and family coordination.',
  },
];

export default function ServiceCardsSection({ lang, services }) {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLeaving, setModalLeaving] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const currentRef = useRef(current);
  const spinningRef = useRef(spinning);
  useEffect(() => { currentRef.current = current; }, [current]);
  useEffect(() => { spinningRef.current = spinning; }, [spinning]);

  const rotateTo = useCallback((idx) => {
    if (spinningRef.current) return;
    setSpinning(true);
    setCurrent(idx);
    setTimeout(() => setSpinning(false), 650);
  }, []);

  const prev = useCallback(() => rotateTo((currentRef.current - 1 + COUNT) % COUNT), [rotateTo]);
  const next = useCallback(() => rotateTo((currentRef.current + 1) % COUNT), [rotateTo]);

  const openModal = useCallback(() => {
    setModalLeaving(false);
    setModalOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  }, []);

  const closeModal = useCallback(() => {
    setModalLeaving(true);
    setModalVisible(false);
    setTimeout(() => { setModalOpen(false); setModalLeaving(false); }, 280);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (!modalOpen) {
        if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
      } else if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [modalOpen, next, prev, closeModal]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  useEffect(() => {
    if (paused || modalOpen) return;
    const id = setInterval(() => {
      if (!spinningRef.current) {
        const nxt = (currentRef.current + 1) % COUNT;
        setSpinning(true);
        setCurrent(nxt);
        setTimeout(() => setSpinning(false), 650);
      }
    }, 3200);
    return () => clearInterval(id);
  }, [paused, modalOpen]);

  const onTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) { diff > 0 ? next() : prev(); }
    touchStartX.current = null;
  }, [next, prev]);

  // Position relative to current: -1 (left), 0 (center), 1 (right), others hidden
  const getPos = (i) => {
    let p = i - current;
    if (p > COUNT / 2) p -= COUNT;
    if (p < -COUNT / 2) p += COUNT;
    return p;
  };

  const meta = SERVICE_META[current];

  return (
    <>
      <style>{`
        @keyframes svc-fade-up   { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes svc-fade-down { from{opacity:1;transform:none} to{opacity:0;transform:translateY(12px) scale(0.97)} }
        @keyframes svc-overlay-in  { from{opacity:0} to{opacity:1} }
        @keyframes svc-overlay-out { from{opacity:1} to{opacity:0} }

        .fan-scene {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 440px;
          margin-bottom: 32px;
          user-select: none;
          perspective: 1100px;
          perspective-origin: 50% 50%;
        }
        .fan-card {
          position: absolute;
          width: 300px;
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          border: 1px solid #E9EBF0;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s ease, box-shadow 0.3s ease;
          cursor: default;
          will-change: transform;
        }
        .fan-card.is-center {
          cursor: pointer;
          box-shadow: 0 20px 56px rgba(0,0,0,0.14);
          z-index: 10;
        }
        .fan-card.is-center:hover {
          box-shadow: 0 28px 72px rgba(0,0,0,0.18);
        }
        .fan-card.is-center:hover .fan-card-lift {
          transform: translateY(-4px);
        }
        .fan-card-lift {
          transition: transform 0.3s ease;
        }
        .fan-card-head {
          height: 148px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .fan-card-head::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .fan-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fan-card-body {
          padding: 20px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .fan-card-name {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.3px;
          line-height: 1.25;
        }
        .fan-card-desc {
          font-size: 13px;
          color: #64748B;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fan-card-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .fan-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          border: 1px solid transparent;
        }
        .fan-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid #F1F5F9;
          margin-top: 2px;
        }
        .fan-duration {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .fan-cta {
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .fan-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid #E2E8F0;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          transition: all 0.18s ease;
          z-index: 20;
        }
        .fan-arrow:hover {
          border-color: #7C3AED;
          background: #F5F3FF;
          box-shadow: 0 4px 20px rgba(124,58,237,0.2);
        }
        .fan-arrow.left  { left: calc(50% - 214px); }
        .fan-arrow.right { right: calc(50% - 214px); }

        .fan-dots {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .fan-dot {
          height: 6px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width 0.35s ease, background 0.2s ease;
        }
        .fan-hint {
          text-align: center;
          font-size: 12px;
          color: #94A3B8;
          margin-top: -20px;
          margin-bottom: 28px;
          letter-spacing: 0.2px;
        }

        .svc-overlay {
          position: fixed;
          top:0; left:0; right:0; bottom:0;
          width: 100vw; height: 100vh;
          background: rgba(15,23,42,0.65);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 9500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }
        .svc-overlay.is-visible { animation: svc-overlay-in  0.25s ease both; }
        .svc-overlay.is-leaving { animation: svc-overlay-out 0.25s ease both; }

        .svc-modal {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
          width: 100%;
          max-width: 640px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          scrollbar-width: thin;
        }
        .svc-modal.is-visible { animation: svc-fade-up   0.32s cubic-bezier(0.34,1.26,0.64,1) both; }
        .svc-modal.is-leaving { animation: svc-fade-down 0.25s ease both; }
        .svc-modal::-webkit-scrollbar { width: 4px; }
        .svc-modal::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 99px; }

        .svc-close {
          position: absolute; top: 14px; right: 14px;
          width: 34px; height: 34px; border-radius: 50%;
          border: none; background: rgba(255,255,255,0.18);
          backdrop-filter: blur(4px); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; z-index: 2;
          font-size: 15px;
          transition: background 0.15s;
        }
        .svc-close:hover { background: rgba(255,255,255,0.32); }

        .svc-nav-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1.5px solid #E5E7EB; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
        }
        .svc-nav-btn:hover:not(:disabled) { border-color: #7C3AED; background: #F5F3FF; }
        .svc-nav-btn:disabled { opacity: 0.3; cursor: default; }

        .svc-included-item {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 9px 12px; border-radius: 10px;
          background: #FAFAF9; border: 1px solid #F3F4F6;
          transition: background 0.15s;
        }
        .svc-included-item:hover { background: #F5F3FF; border-color: rgba(124,58,237,0.12); }

        @media (max-width: 640px) {
          .fan-arrow.left  { left: 8px; }
          .fan-arrow.right { right: 8px; }
          .fan-scene { height: 400px; }
          .fan-card { width: 270px; }
          .svc-overlay { padding: 0; align-items: flex-end; }
          .svc-modal { max-height: 92vh; border-radius: 24px 24px 0 0; }
        }
      `}</style>

      {/* ── Coverflow carousel ── */}
      <div
        className="fan-scene"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left arrow */}
        <button className="fan-arrow left" onClick={prev} aria-label="Previous service">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {/* Fan cards */}
        {SERVICE_META.map((m, i) => {
          const pos = getPos(i);
          if (Math.abs(pos) > 1) return null;
          const isCenter = pos === 0;
          const xShift = pos * 255;
          const rotY = -pos * 42;
          const scale = isCenter ? 1 : 0.78;
          const opacity = isCenter ? 1 : 0.44;

          return (
            <div
              key={i}
              className={`fan-card${isCenter ? ' is-center' : ''}`}
              onClick={isCenter ? openModal : undefined}
              style={{
                transform: `translateX(${xShift}px) rotateY(${rotY}deg) scale(${scale})`,
                opacity,
                zIndex: isCenter ? 10 : 5,
                pointerEvents: isCenter ? 'auto' : 'none',
              }}
            >
              <div className="fan-card-lift">
                {/* Header */}
                <div className="fan-card-head" style={{ background: m.gradient }}>
                  <div className="fan-icon-wrap">{m.icon}</div>
                </div>

                {/* Body */}
                <div className="fan-card-body">
                  <div className="fan-card-name">{m.name}</div>
                  <div className="fan-card-desc">{m.desc}</div>

                  <div className="fan-card-tags">
                    {m.bestFor.slice(0, 2).map(t => (
                      <span key={t} className="fan-tag" style={{ color: m.color, background: m.colorLight, borderColor: m.colorBorder }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="fan-card-footer">
                    <span className="fan-duration" style={{ color: m.color, background: m.colorLight }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {m.duration}
                    </span>
                    {isCenter && (
                      <span className="fan-cta" style={{ color: m.color }}>
                        View details
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Right arrow */}
        <button className="fan-arrow right" onClick={next} aria-label="Next service">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Hint */}
      <p className="fan-hint">Hover to pause &nbsp;·&nbsp; Click the card to explore</p>

      {/* Dots */}
      <div className="fan-dots">
        {SERVICE_META.map((m, i) => (
          <button
            key={i}
            className="fan-dot"
            onClick={() => rotateTo(i)}
            style={{ width: i === current ? 22 : 6, background: i === current ? m.color : '#CBD5E1' }}
            aria-label={`Go to ${m.name}`}
          />
        ))}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div
          className={`svc-overlay${modalLeaving ? ' is-leaving' : modalVisible ? ' is-visible' : ''}`}
          onClick={closeModal}
        >
          <div
            className={`svc-modal${modalLeaving ? ' is-leaving' : modalVisible ? ' is-visible' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding:'36px 36px 28px', position:'relative', borderRadius:'24px 24px 0 0', overflow:'hidden', background: meta.gradient }}>
              <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

              <button className="svc-close" onClick={closeModal}>✕</button>

              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, position:'relative', zIndex:1 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.25)' }}>
                  {meta.icon}
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>
                    Service {String(current + 1).padStart(2, '0')}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'#fff', width:'fit-content' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {meta.duration}
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.5px', lineHeight:1.2, position:'relative', zIndex:1 }}>
                {meta.name}
              </h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.78)', margin:0, lineHeight:1.65, maxWidth:480, position:'relative', zIndex:1 }}>
                {meta.detail}
              </p>
            </div>

            {/* Body */}
            <div style={{ padding:'28px 36px 36px' }}>
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

              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>Best for</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {meta.bestFor.map(tag => (
                    <span key={tag} style={{ fontSize:12, fontWeight:600, color:meta.color, background:meta.colorLight, border:`1px solid ${meta.colorBorder}`, padding:'5px 13px', borderRadius:99 }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ height:1, background:'#F3F4F6', marginBottom:24 }} />

              {/* Nav + CTA */}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button className="svc-nav-btn"
                  onClick={() => { closeModal(); setTimeout(() => { prev(); setTimeout(openModal, 800); }, 300); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div style={{ display:'flex', gap:4, flex:1, justifyContent:'center' }}>
                  {SERVICE_META.map((m, si) => (
                    <div key={si} style={{ width: si === current ? 20 : 6, height:6, borderRadius:99, background: si === current ? meta.color : '#E5E7EB', transition:'width 0.3s ease, background 0.2s ease' }} />
                  ))}
                </div>
                <button className="svc-nav-btn"
                  onClick={() => { closeModal(); setTimeout(() => { next(); setTimeout(openModal, 800); }, 300); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <Link href={`/${lang || 'en'}/signup?role=client`} style={{ flex:1, maxWidth:200 }}>
                  <button
                    style={{ width:'100%', background:meta.gradient, color:'#fff', border:'none', borderRadius:11, padding:'11px 18px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 18px ${meta.color}44`, transition:'all 0.18s ease' }}
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
