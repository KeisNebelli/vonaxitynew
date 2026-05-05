'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';

const COUNT = 8;

// ── Lottie-style SVG animations ─────────────────────────────────────────────

const AnimHeartbeat = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {/* ECG trace */}
    <path className="lta-ecg"
      d="M0,62 L52,62 L68,22 L84,105 L100,62 L158,62 L172,40 L186,84 L196,62 L260,62"
      stroke="rgba(255,255,255,0.88)" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Beating heart */}
    <path className="lta-heart"
      d="M130,105 C130,105 108,87 108,74 C108,65 116,59 123,65 C126,68 128,72 130,76 C132,72 134,68 137,65 C144,59 152,65 152,74 C152,87 130,105 130,105Z"
      fill="rgba(255,255,255,0.93)"/>
    {/* Soft glow dots */}
    <circle cx="22" cy="40" r="3.5" fill="rgba(255,255,255,0.28)" className="lta-d1"/>
    <circle cx="238" cy="88" r="2.8" fill="rgba(255,255,255,0.22)" className="lta-d2"/>
    <circle cx="55" cy="95" r="2.2" fill="rgba(255,255,255,0.18)" className="lta-d3"/>
  </svg>
);

const AnimGlucose = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    <defs>
      <clipPath id="anim-gc-clip">
        <path d="M130,8 C130,8 170,58 170,86 C170,108 152,120 130,120 C108,120 90,108 90,86 C90,58 130,8 130,8Z"/>
      </clipPath>
    </defs>
    {/* Drop outline */}
    <path d="M130,8 C130,8 170,58 170,86 C170,108 152,120 130,120 C108,120 90,108 90,86 C90,58 130,8 130,8Z"
      stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
    {/* Rising fill */}
    <rect x="90" y="52" width="80" height="68" fill="rgba(255,255,255,0.52)" clipPath="url(#anim-gc-clip)" className="gc-fill"/>
    {/* Surface ripple */}
    <ellipse cx="130" cy="52" rx="27" ry="5" fill="rgba(255,255,255,0.28)" className="gc-surface"/>
    {/* Reading */}
    <text x="130" y="90" textAnchor="middle" fontSize="22" fontWeight="800" fill="rgba(255,255,255,0.95)"
      style={{ fontFamily:'system-ui,sans-serif', letterSpacing:'-0.5px' }}>98</text>
    <text x="130" y="106" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.7)"
      style={{ fontFamily:'system-ui,sans-serif' }}>mg/dL</text>
  </svg>
);

const AnimVitals = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {[
      { cx:52, label:'♥', val:'72', unit:'bpm', d:'0s' },
      { cx:130, label:'⬤', val:'36.6', unit:'°C', d:'0.5s' },
      { cx:208, label:'◯', val:'98%', unit:'SpO₂', d:'1s' },
    ].map(({ cx, label, val, unit, d }, i) => (
      <g key={i} className="vt-card" style={{ animationDelay: d }}>
        <rect x={cx-38} y="14" width="76" height="90" rx="14" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <text x={cx} y="46" textAnchor="middle" fontSize="16" fill="rgba(255,255,255,0.8)" style={{ fontFamily:'system-ui' }}>{label}</text>
        <text x={cx} y="68" textAnchor="middle" fontSize={i===1?'14':'16'} fontWeight="800" fill="rgba(255,255,255,0.96)" style={{ fontFamily:'system-ui,sans-serif', letterSpacing:'-0.4px' }}>{val}</text>
        <text x={cx} y="84" textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.6)" style={{ fontFamily:'system-ui' }}>{unit}</text>
        {/* Progress bar */}
        <rect x={cx-26} y="94" width="52" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
        <rect x={cx-26} y="94" width={[36,40,48][i]} height="4" rx="2" fill="rgba(255,255,255,0.75)" className="vt-bar" style={{ animationDelay: d }}/>
      </g>
    ))}
  </svg>
);

const AnimBloodDraw = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    <defs>
      <clipPath id="anim-bd-clip">
        <rect x="104" y="32" width="52" height="80" rx="8"/>
      </clipPath>
    </defs>
    {/* Vial body */}
    <rect x="104" y="32" width="52" height="80" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.55)" strokeWidth="2"/>
    {/* Vial cap */}
    <rect x="96" y="22" width="68" height="20" rx="5" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    {/* Rising fill */}
    <rect x="104" y="72" width="52" height="40" fill="rgba(255,255,255,0.65)" clipPath="url(#anim-bd-clip)" className="bd-fill"/>
    {/* Fill surface */}
    <ellipse cx="130" cy="72" rx="20" ry="4" fill="rgba(255,255,255,0.4)" className="bd-surface"/>
    {/* Graduation marks */}
    {[44,56,68,80].map(y => (
      <line key={y} x1="150" y1={y} x2="155" y2={y} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
    ))}
    {/* Falling drop */}
    <ellipse cx="130" cy="18" rx="5.5" ry="7" fill="rgba(255,255,255,0.88)" className="bd-drop"/>
    {/* Side tubes */}
    <line x1="80" y1="32" x2="104" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/>
    <line x1="180" y1="32" x2="156" y2="42" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const AnimWellness = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {/* Person */}
    <circle cx="130" cy="26" r="17" fill="rgba(255,255,255,0.9)"/>
    <path d="M110,50 C110,43 118,40 130,40 C142,40 150,43 150,50 L155,100 L140,100 L130,82 L120,100 L105,100Z"
      fill="rgba(255,255,255,0.9)"/>
    <path d="M110,55 L92,72" stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round"/>
    <path d="M150,55 L168,72" stroke="rgba(255,255,255,0.9)" strokeWidth="8" strokeLinecap="round"/>
    {/* Check circles */}
    <g className="wa-c1">
      <circle cx="176" cy="25" r="14" fill="rgba(255,255,255,0.88)"/>
      <path d="M170,25 L174.5,30 L182,19" stroke="rgba(0,0,0,0.3)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g className="wa-c2">
      <circle cx="68" cy="60" r="14" fill="rgba(255,255,255,0.88)"/>
      <path d="M62,60 L66.5,65 L74,54" stroke="rgba(0,0,0,0.3)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g className="wa-c3">
      <circle cx="192" cy="88" r="14" fill="rgba(255,255,255,0.88)"/>
      <path d="M186,88 L190.5,93 L198,82" stroke="rgba(0,0,0,0.3)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

const AnimPostSurgical = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {/* Pulse rings */}
    <circle cx="130" cy="59" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" className="ps-r1"/>
    <circle cx="130" cy="59" r="38" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" className="ps-r2"/>
    {/* Medical cross */}
    <rect x="118" y="22" width="24" height="74" rx="7" fill="rgba(255,255,255,0.95)"/>
    <rect x="93" y="47" width="74" height="24" rx="7" fill="rgba(255,255,255,0.95)"/>
    {/* Shine sweep */}
    <defs>
      <linearGradient id="anim-ps-shine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
        <stop offset="45%" stopColor="rgba(255,255,255,0.55)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
      <clipPath id="anim-ps-clip">
        <path d="M118,22 h24 v25 h25 v24 h-25 v25 h-24 v-25 h-25 v-24 h25 Z"/>
      </clipPath>
    </defs>
    <rect x="93" y="22" width="74" height="74" fill="url(#anim-ps-shine)" clipPath="url(#anim-ps-clip)" className="ps-shine"/>
  </svg>
);

const AnimMedication = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {/* Large central capsule */}
    <g className="med-main">
      <rect x="94" y="52" width="72" height="36" rx="18" fill="rgba(255,255,255,0.92)"/>
      <rect x="94" y="52" width="36" height="36" rx="18" fill="rgba(255,255,255,0.6)"/>
      <line x1="130" y1="52" x2="130" y2="88" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    </g>
    {/* Falling pill 1 */}
    <g className="med-p1">
      <rect x="44" y="18" width="28" height="15" rx="7.5" fill="rgba(255,255,255,0.82)"/>
      <rect x="44" y="18" width="14" height="15" rx="7.5" fill="rgba(255,255,255,0.55)"/>
    </g>
    {/* Falling pill 2 */}
    <g className="med-p2">
      <rect x="188" y="12" width="26" height="14" rx="7" fill="rgba(255,255,255,0.78)"/>
      <rect x="188" y="12" width="13" height="14" rx="7" fill="rgba(255,255,255,0.5)"/>
    </g>
    {/* Falling pill 3 */}
    <g className="med-p3">
      <rect x="118" y="8" width="24" height="13" rx="6.5" fill="rgba(255,255,255,0.72)"/>
      <rect x="118" y="8" width="12" height="13" rx="6.5" fill="rgba(255,255,255,0.45)"/>
    </g>
    {/* Plus symbol */}
    <text x="220" y="56" textAnchor="middle" fontSize="28" fontWeight="900" fill="rgba(255,255,255,0.88)"
      style={{ fontFamily:'system-ui' }} className="med-plus">+</text>
  </svg>
);

const AnimNursing = () => (
  <svg viewBox="0 0 260 118" style={{ display:'block', width:'100%', height:'118px' }}>
    {/* Earpieces */}
    <path d="M96,12 L96,36 Q96,44 104,44 Q112,44 112,36 L112,12"
      stroke="rgba(255,255,255,0.9)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    <path d="M148,12 L148,36 Q148,44 156,44 Q164,44 164,36 L164,12"
      stroke="rgba(255,255,255,0.9)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    {/* Tube arch */}
    <path d="M104,44 Q104,72 130,72 Q156,72 156,44"
      stroke="rgba(255,255,255,0.9)" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
    {/* Tube stem */}
    <line x1="130" y1="72" x2="130" y2="102" stroke="rgba(255,255,255,0.9)" strokeWidth="4.5" strokeLinecap="round"/>
    {/* Bell */}
    <circle cx="130" cy="108" r="13" fill="rgba(255,255,255,0.95)"/>
    <circle cx="130" cy="108" r="7" fill="rgba(255,255,255,0.35)"/>
    {/* Pulse waves from bell */}
    <circle cx="130" cy="108" r="20" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" className="ns-w1"/>
    <circle cx="130" cy="108" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="ns-w2"/>
    <circle cx="130" cy="108" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" className="ns-w3"/>
  </svg>
);

// ── Service metadata ─────────────────────────────────────────────────────────

const SERVICE_META = [
  {
    name: 'Blood Pressure Check',
    desc: 'Three calibrated readings with nurse notes and instant health dashboard logging.',
    color: '#7C3AED', colorLight: 'rgba(124,58,237,0.08)', colorBorder: 'rgba(124,58,237,0.18)',
    gradient: 'linear-gradient(135deg,#7C3AED 0%,#5B21B6 100%)',
    duration: '15–20 min',
    Anim: AnimHeartbeat,
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
    Anim: AnimGlucose,
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
    Anim: AnimVitals,
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
    Anim: AnimBloodDraw,
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
    Anim: AnimWellness,
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
    Anim: AnimPostSurgical,
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
    Anim: AnimMedication,
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
    Anim: AnimNursing,
    included: ['Tailored nursing plan per patient','Ongoing assessment and adaptation','Family communication after every visit','Coordination with doctors if needed','Full visit report to health dashboard'],
    bestFor: ['Complex care needs', 'Long-term conditions', 'Custom requirements'],
    detail: 'When no single service fits, General Nursing covers it. Our nurse assesses the patient\'s full situation and provides personalised care — from companionship and mobility support to clinical monitoring and family coordination.',
  },
];

// ── Component ────────────────────────────────────────────────────────────────

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
        /* ── ECG / Blood Pressure ── */
        @keyframes lta-ecg-kf  { 0%{stroke-dashoffset:420} 100%{stroke-dashoffset:0} }
        @keyframes lta-heart-kf { 0%,75%,100%{transform:scale(1)} 35%{transform:scale(1.22)} 55%{transform:scale(1.06)} }
        @keyframes lta-dot-kf  { 0%,100%{opacity:.28;transform:scale(1)} 50%{opacity:.72;transform:scale(1.5)} }
        .lta-ecg   { stroke-dasharray:420; animation:lta-ecg-kf 2.4s linear infinite; }
        .lta-heart { transform-origin:130px 84px; animation:lta-heart-kf 1.1s ease-in-out infinite; }
        .lta-d1    { animation:lta-dot-kf 2.4s ease-in-out infinite; }
        .lta-d2    { animation:lta-dot-kf 2.4s ease-in-out infinite .6s; }
        .lta-d3    { animation:lta-dot-kf 2.4s ease-in-out infinite 1.2s; }

        /* ── Blood Glucose ── */
        @keyframes gc-rise-kf    { 0%{transform:translateY(36px)} 100%{transform:translateY(0)} }
        @keyframes gc-surface-kf { 0%,100%{opacity:.28;transform:scaleX(1)} 50%{opacity:.55;transform:scaleX(1.18)} }
        .gc-fill    { animation:gc-rise-kf 2.6s ease-in-out infinite alternate; }
        .gc-surface { animation:gc-surface-kf 2.6s ease-in-out infinite; }

        /* ── Full Vitals ── */
        @keyframes vt-card-kf { 0%,100%{transform:translateY(0);opacity:.8} 50%{transform:translateY(-6px);opacity:1} }
        @keyframes vt-bar-kf  { 0%{transform:scaleX(0);opacity:0} 40%,100%{transform:scaleX(1);opacity:1} }
        .vt-card { animation:vt-card-kf 2.4s ease-in-out infinite; transform-origin:center; }
        .vt-bar  { transform-origin:left center; animation:vt-bar-kf 2.4s ease-in-out infinite; }

        /* ── Blood Draw ── */
        @keyframes bd-rise-kf    { 0%{transform:translateY(44px)} 100%{transform:translateY(0)} }
        @keyframes bd-surface-kf { 0%,100%{opacity:.4;transform:scaleX(1)} 50%{opacity:.7;transform:scaleX(1.12)} }
        @keyframes bd-drop-kf    { 0%{transform:translateY(-6px);opacity:1} 55%{transform:translateY(18px);opacity:1} 75%,100%{transform:translateY(18px);opacity:0} }
        .bd-fill    { animation:bd-rise-kf 2.4s ease-in-out infinite alternate; }
        .bd-surface { animation:bd-surface-kf 2.4s ease-in-out infinite; }
        .bd-drop    { transform-origin:130px 18px; animation:bd-drop-kf 2.4s ease-in-out infinite; }

        /* ── Wellness ── */
        @keyframes wa-pop-kf { 0%,55%{opacity:0;transform:scale(0.5)} 75%,100%{opacity:1;transform:scale(1)} }
        .wa-c1 { animation:wa-pop-kf 2.4s ease-out infinite; }
        .wa-c2 { animation:wa-pop-kf 2.4s ease-out infinite .8s; }
        .wa-c3 { animation:wa-pop-kf 2.4s ease-out infinite 1.6s; }

        /* ── Post-surgical ── */
        @keyframes ps-ring-kf  { 0%{transform:scale(.7);opacity:0} 45%{opacity:.65} 100%{transform:scale(1.15);opacity:0} }
        @keyframes ps-shine-kf { 0%{transform:translateX(-80px)} 100%{transform:translateX(80px)} }
        .ps-r1    { transform-origin:130px 59px; animation:ps-ring-kf 2.2s ease-out infinite; }
        .ps-r2    { transform-origin:130px 59px; animation:ps-ring-kf 2.2s ease-out infinite .55s; }
        .ps-shine { animation:ps-shine-kf 2.8s ease-in-out infinite; }

        /* ── Medication ── */
        @keyframes med-main-kf { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes med-fall-kf { 0%{transform:translateY(-28px);opacity:0} 15%{opacity:1} 65%{transform:translateY(22px);opacity:1} 85%,100%{transform:translateY(22px);opacity:0} }
        @keyframes med-plus-kf { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.2) rotate(90deg)} }
        .med-main { transform-origin:130px 70px; animation:med-main-kf 1.9s ease-in-out infinite; }
        .med-p1   { animation:med-fall-kf 2.2s ease-in-out infinite; }
        .med-p2   { animation:med-fall-kf 2.2s ease-in-out infinite .55s; }
        .med-p3   { animation:med-fall-kf 2.2s ease-in-out infinite 1.1s; }
        .med-plus { transform-origin:220px 42px; animation:med-plus-kf 2.2s ease-in-out infinite; }

        /* ── Nursing / Stethoscope ── */
        @keyframes ns-wave-kf { 0%{transform:scale(.65);opacity:.7} 100%{transform:scale(1.25);opacity:0} }
        .ns-w1 { transform-origin:130px 108px; animation:ns-wave-kf 2.2s ease-out infinite; }
        .ns-w2 { transform-origin:130px 108px; animation:ns-wave-kf 2.2s ease-out infinite .55s; }
        .ns-w3 { transform-origin:130px 108px; animation:ns-wave-kf 2.2s ease-out infinite 1.1s; }

        /* ── Coverflow fan ── */
        @keyframes svc-fade-up   { from{opacity:0;transform:translateY(20px) scale(0.96)} to{opacity:1;transform:none} }
        @keyframes svc-fade-down { from{opacity:1;transform:none} to{opacity:0;transform:translateY(12px) scale(0.97)} }
        @keyframes svc-overlay-in  { from{opacity:0} to{opacity:1} }
        @keyframes svc-overlay-out { from{opacity:1} to{opacity:0} }

        .fan-scene {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 460px;
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
        .fan-card.is-center:hover { box-shadow: 0 28px 72px rgba(0,0,0,0.18); }
        .fan-card.is-center:hover .fan-lift { transform: translateY(-4px); }
        .fan-lift { transition: transform 0.3s ease; }

        .fan-head {
          height: 148px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .fan-head::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 28%, rgba(255,255,255,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .fan-body {
          padding: 18px 22px 22px;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .fan-name { font-size:16px; font-weight:800; color:#0F172A; letter-spacing:-0.3px; line-height:1.25; }
        .fan-desc { font-size:13px; color:#64748B; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .fan-tags { display:flex; gap:6px; flex-wrap:wrap; }
        .fan-tag  { font-size:11px; font-weight:600; padding:3px 10px; border-radius:99px; border:1px solid transparent; }
        .fan-footer { display:flex; align-items:center; justify-content:space-between; padding-top:11px; border-top:1px solid #F1F5F9; margin-top:2px; }
        .fan-dur { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; padding:4px 10px; border-radius:99px; }
        .fan-cta { font-size:12px; font-weight:700; display:flex; align-items:center; gap:4px; }

        .fan-arrow {
          position: absolute; top:50%; transform:translateY(-50%);
          width:42px; height:42px; border-radius:50%;
          border:1.5px solid #E2E8F0; background:#fff;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; box-shadow:0 2px 12px rgba(0,0,0,0.08);
          transition:all 0.18s ease; z-index:20;
        }
        .fan-arrow:hover { border-color:#7C3AED; background:#F5F3FF; box-shadow:0 4px 20px rgba(124,58,237,0.2); }
        .fan-arrow.left  { left:calc(50% - 214px); }
        .fan-arrow.right { right:calc(50% - 214px); }

        .fan-dots { display:flex; gap:6px; justify-content:center; margin-bottom:36px; }
        .fan-dot  { height:6px; border-radius:99px; border:none; cursor:pointer; padding:0; transition:width .35s ease,background .2s ease; }
        .fan-hint { text-align:center; font-size:12px; color:#94A3B8; margin-top:-20px; margin-bottom:28px; letter-spacing:.2px; }

        .svc-overlay {
          position:fixed; top:0; left:0; right:0; bottom:0; width:100vw; height:100vh;
          background:rgba(15,23,42,.65); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          z-index:9500; display:flex; align-items:center; justify-content:center;
          padding:24px; box-sizing:border-box;
        }
        .svc-overlay.is-visible { animation:svc-overlay-in  .25s ease both; }
        .svc-overlay.is-leaving { animation:svc-overlay-out .25s ease both; }
        .svc-modal {
          background:#fff; border-radius:24px; box-shadow:0 40px 100px rgba(0,0,0,.25);
          width:100%; max-width:640px; max-height:90vh; overflow-y:auto; position:relative; scrollbar-width:thin;
        }
        .svc-modal.is-visible { animation:svc-fade-up   .32s cubic-bezier(.34,1.26,.64,1) both; }
        .svc-modal.is-leaving { animation:svc-fade-down .25s ease both; }
        .svc-modal::-webkit-scrollbar { width:4px; }
        .svc-modal::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:99px; }
        .svc-close {
          position:absolute; top:14px; right:14px; width:34px; height:34px; border-radius:50%;
          border:none; background:rgba(255,255,255,.18); backdrop-filter:blur(4px);
          color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;
          font-size:15px; z-index:2; transition:background .15s;
        }
        .svc-close:hover { background:rgba(255,255,255,.32); }
        .svc-nav-btn {
          width:36px; height:36px; border-radius:50%; border:1.5px solid #E5E7EB; background:#fff;
          display:flex; align-items:center; justify-content:center; cursor:pointer;
          transition:all .15s ease; flex-shrink:0;
        }
        .svc-nav-btn:hover:not(:disabled) { border-color:#7C3AED; background:#F5F3FF; }
        .svc-nav-btn:disabled { opacity:.3; cursor:default; }
        .svc-item {
          display:flex; gap:10px; align-items:flex-start; padding:9px 12px; border-radius:10px;
          background:#FAFAF9; border:1px solid #F3F4F6; transition:background .15s;
        }
        .svc-item:hover { background:#F5F3FF; border-color:rgba(124,58,237,.12); }

        @media (max-width:640px) {
          .fan-arrow.left  { left:8px; }
          .fan-arrow.right { right:8px; }
          .fan-scene { height:400px; }
          .fan-card  { width:270px; }
          .svc-overlay { padding:0; align-items:flex-end; }
          .svc-modal { max-height:92vh; border-radius:24px 24px 0 0; }
        }
      `}</style>

      {/* ── Coverflow ── */}
      <div
        className="fan-scene"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <button className="fan-arrow left" onClick={prev} aria-label="Previous service">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        {SERVICE_META.map((m, i) => {
          const pos = getPos(i);
          if (Math.abs(pos) > 1) return null;
          const isCenter = pos === 0;
          return (
            <div
              key={i}
              className={`fan-card${isCenter ? ' is-center' : ''}`}
              onClick={isCenter ? openModal : undefined}
              style={{
                transform: `translateX(${pos * 255}px) rotateY(${-pos * 42}deg) scale(${isCenter ? 1 : 0.78})`,
                opacity: isCenter ? 1 : 0.44,
                zIndex: isCenter ? 10 : 5,
                pointerEvents: isCenter ? 'auto' : 'none',
              }}
            >
              <div className="fan-lift">
                {/* Animated header */}
                <div className="fan-head" style={{ background: m.gradient }}>
                  <m.Anim />
                </div>

                {/* Card body */}
                <div className="fan-body">
                  <div className="fan-name">{m.name}</div>
                  <div className="fan-desc">{m.desc}</div>
                  <div className="fan-tags">
                    {m.bestFor.slice(0, 2).map(t => (
                      <span key={t} className="fan-tag" style={{ color: m.color, background: m.colorLight, borderColor: m.colorBorder }}>{t}</span>
                    ))}
                  </div>
                  <div className="fan-footer">
                    <span className="fan-dur" style={{ color: m.color, background: m.colorLight }}>
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

        <button className="fan-arrow right" onClick={next} aria-label="Next service">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <p className="fan-hint">Hover to pause &nbsp;·&nbsp; Click the card to explore</p>

      <div className="fan-dots">
        {SERVICE_META.map((m, i) => (
          <button key={i} className="fan-dot" onClick={() => rotateTo(i)}
            style={{ width: i === current ? 22 : 6, background: i === current ? m.color : '#CBD5E1' }}
            aria-label={`Go to ${m.name}`}/>
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
            <div style={{ padding:'36px 36px 28px', position:'relative', borderRadius:'24px 24px 0 0', overflow:'hidden', background: meta.gradient }}>
              <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }} />
              <div style={{ position:'absolute', bottom:-20, left:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />
              <button className="svc-close" onClick={closeModal}>✕</button>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, position:'relative', zIndex:1 }}>
                <div style={{ width:56, height:56, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', border:'1px solid rgba(255,255,255,0.25)', overflow:'hidden', flexShrink:0 }}>
                  <meta.Anim />
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>Service {String(current + 1).padStart(2, '0')}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'#fff', width:'fit-content' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {meta.duration}
                  </div>
                </div>
              </div>
              <h2 style={{ fontSize:'clamp(20px,3vw,26px)', fontWeight:800, color:'#fff', margin:'0 0 8px', letterSpacing:'-0.5px', lineHeight:1.2, position:'relative', zIndex:1 }}>{meta.name}</h2>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.78)', margin:0, lineHeight:1.65, maxWidth:480, position:'relative', zIndex:1 }}>{meta.detail}</p>
            </div>

            <div style={{ padding:'28px 36px 36px' }}>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>What's included</div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {meta.included.map((item, ii) => (
                    <div key={ii} className="svc-item">
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

              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button className="svc-nav-btn" onClick={() => { closeModal(); setTimeout(() => { prev(); setTimeout(openModal, 800); }, 300); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div style={{ display:'flex', gap:4, flex:1, justifyContent:'center' }}>
                  {SERVICE_META.map((m, si) => (
                    <div key={si} style={{ width: si === current ? 20 : 6, height:6, borderRadius:99, background: si === current ? meta.color : '#E5E7EB', transition:'width .3s ease,background .2s ease' }} />
                  ))}
                </div>
                <button className="svc-nav-btn" onClick={() => { closeModal(); setTimeout(() => { next(); setTimeout(openModal, 800); }, 300); }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <Link href={`/${lang || 'en'}/signup?role=client`} style={{ flex:1, maxWidth:200 }}>
                  <button
                    style={{ width:'100%', background:meta.gradient, color:'#fff', border:'none', borderRadius:11, padding:'11px 18px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 4px 18px ${meta.color}44`, transition:'all .18s ease' }}
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
