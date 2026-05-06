'use client';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF',
  bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280',
  textTertiary:'#9CA3AF', border:'#E5E7EB',
};

/* SVG icons for each section */
const ICONS = {
  emergency: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  medical:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  people:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  shield:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  legal:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12M12 12L3 7M12 12l9-5M3 7v10l9 5M21 7v10l-9 5"/></svg>,
  chart:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  wifi:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  lock:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  globe:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  refresh:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  mail:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const SECTION_META = [
  { icon: ICONS.emergency, color:'#DC2626', bg:'#FEF2F2', border:'#FECACA', numGrad:'linear-gradient(135deg,#DC2626,#EF4444)' },
  { icon: ICONS.medical,   color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', numGrad:'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  { icon: ICONS.people,    color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE', numGrad:'linear-gradient(135deg,#2563EB,#60A5FA)' },
  { icon: ICONS.shield,    color:'#059669', bg:'#ECFDF5', border:'#A7F3D0', numGrad:'linear-gradient(135deg,#059669,#34D399)' },
  { icon: ICONS.legal,     color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', numGrad:'linear-gradient(135deg,#D97706,#FBBF24)' },
  { icon: ICONS.chart,     color:'#0891B2', bg:'#ECFEFF', border:'#A5F3FC', numGrad:'linear-gradient(135deg,#0891B2,#22D3EE)' },
  { icon: ICONS.wifi,      color:'#6B7280', bg:'#F9FAFB', border:'#E5E7EB', numGrad:'linear-gradient(135deg,#6B7280,#9CA3AF)' },
  { icon: ICONS.lock,      color:'#2563EB', bg:'#EFF6FF', border:'#BFDBFE', numGrad:'linear-gradient(135deg,#2563EB,#60A5FA)' },
  { icon: ICONS.globe,     color:'#059669', bg:'#ECFDF5', border:'#A7F3D0', numGrad:'linear-gradient(135deg,#059669,#34D399)' },
  { icon: ICONS.refresh,   color:'#7C3AED', bg:'#F5F3FF', border:'#DDD6FE', numGrad:'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  { icon: ICONS.mail,      color:'#D97706', bg:'#FFFBEB', border:'#FDE68A', numGrad:'linear-gradient(135deg,#D97706,#FBBF24)' },
];

const CONTENT = {
  en: {
    tag: 'Legal',
    title: 'Disclaimer',
    lastUpdated: 'Last updated: May 2026',
    intro: 'Vonaxity is a non-emergency healthcare service platform designed to connect clients with independent healthcare providers, including licensed nurses, and to facilitate access to home-based care, lab services, and health record management tools. Please read this disclaimer carefully before using our platform, website, or services. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by the terms set out below.',
    navLabel: 'Jump to section',
    sections: [
      { title:'Non-Emergency Services Only', body:'Vonaxity is not an emergency service. In the event of a medical emergency, users must immediately contact their local emergency services. If you or someone in your care is experiencing a medical emergency, call the Albanian Emergency Number 127 immediately or proceed to the nearest emergency facility. Do not use this platform to seek emergency care. Vonaxity accepts no liability for harm arising from delayed emergency response due to use of this platform.' },
      { title:'No Medical Advice', body:'Vonaxity does not provide medical advice, diagnosis, or treatment. All medical decisions should be made in consultation with a qualified and licensed healthcare professional. The information, content, and services provided through the Vonaxity platform are for informational and coordination purposes only. Never disregard professional medical advice or delay seeking it because of something you have read or received through this platform.' },
      { title:'Independent Professionals', body:'While Vonaxity conducts a verification process for healthcare professionals prior to approval on the platform, all providers operate as independent professionals. Vonaxity does not directly employ, supervise, or control the medical decisions, actions, or conduct of any healthcare provider. Any care provided is the sole responsibility of the individual provider and the patient. Any contractual or care relationship is solely between the client and the independent professional.' },
      { title:'Verification & Credentialing', body:'Users are encouraged to independently verify the identity and credentials of any caregiver prior to receiving services. While Vonaxity takes reasonable steps to verify professional licenses from the Order of Nurses of Albania, Vonaxity does not guarantee the accuracy, completeness, or current validity of any professional\'s credentials at the time of service delivery.' },
      { title:'Limitation of Liability', body:'To the fullest extent permitted by applicable law, Vonaxity, its founders, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from: (a) the use or inability to use the platform; (b) any care services provided or not provided by independent professionals; (c) any errors or omissions in platform content; (d) unauthorized access to or alteration of your data; or (e) any other matter relating to the platform or services.' },
      { title:'No Guarantee of Outcomes', body:'Vonaxity makes no representations or warranties, express or implied, regarding the outcome of any care service. Health outcomes depend on many factors outside Vonaxity\'s control, including the patient\'s medical condition, compliance with care instructions, and the professional judgment of the independent nurse. Vonaxity does not guarantee any specific health results.' },
      { title:'Platform Availability', body:'Vonaxity does not guarantee uninterrupted, error-free access to the platform at all times. The platform may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control. Vonaxity shall not be liable for any loss or inconvenience caused by platform downtime.' },
      { title:'Privacy & Data', body:'The collection and use of personal and health-related information through the Vonaxity platform is governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described therein. We handle all personal data in accordance with applicable Albanian data protection legislation.' },
      { title:'Governing Law', body:'This disclaimer and any disputes arising in connection with it shall be governed by and construed in accordance with the laws of the Republic of Albania. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Albania.' },
      { title:'Changes to This Disclaimer', body:'Vonaxity reserves the right to update or modify this disclaimer at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the revised disclaimer. We encourage you to review this page periodically.' },
      { title:'Contact', body:'If you have any questions about this disclaimer or our services, please contact us via WhatsApp or through our website. We are committed to transparency and will do our best to address your concerns promptly.' },
    ],
  },
  sq: {
    tag: 'Ligjore',
    title: 'Mohim Përgjegjësie',
    lastUpdated: 'Përditësuar: Maj 2026',
    intro: 'Vonaxity është një platformë shërbimesh shëndetësore jo-urgjente e projektuar për të lidhur klientët me ofrues të pavarur të kujdesit shëndetësor, duke përfshirë infermierë të licencuar, dhe për të lehtësuar qasjen në kujdesin e bazuar në shtëpi, shërbimet laboratorike dhe mjetet e menaxhimit të të dhënave shëndetësore. Ju lutemi lexoni me kujdes këtë mohim para se të përdorni platformën, faqen e internetit ose shërbimet tona. Duke hyrë ose përdorur shërbimet tona, ju pranoni që keni lexuar, kuptuar dhe jeni dakord të jeni të lidhur nga kushtet e mëposhtme.',
    navLabel: 'Shko te seksioni',
    sections: [
      { title:'Vetëm Shërbime Jo-Urgjente', body:'Vonaxity nuk është një shërbim urgjence. Në rast të një urgjence mjekësore, përdoruesit duhet të kontaktojnë menjëherë shërbimet lokale të urgjencës. Nëse ju ose dikush nën kujdesin tuaj po përjeton një urgjencë mjekësore, thirrni menjëherë Numrin e Urgjencës Shqiptare 127 ose shkoni në objektin e urgjencës më të afërt. Mos e përdorni këtë platformë për të kërkuar kujdes urgjent.' },
      { title:'Pa Këshilla Mjekësore', body:'Vonaxity nuk ofron këshilla mjekësore, diagnozë ose trajtim. Të gjitha vendimet mjekësore duhet të merren në konsultim me një profesionist të kualifikuar dhe të licencuar të kujdesit shëndetësor. Informacioni, përmbajtja dhe shërbimet e ofruara përmes platformës Vonaxity janë vetëm për qëllime informative dhe koordinimi.' },
      { title:'Profesionistë të Pavarur', body:'Ndërsa Vonaxity kryen një proces verifikimi për profesionistët e kujdesit shëndetësor para aprovimit në platformë, të gjithë ofruesit operojnë si profesionistë të pavarur. Vonaxity nuk punëson, mbikëqyr ose kontrollon drejtpërdrejt vendimet mjekësore, veprimet ose sjelljen e asnjë ofruesi. Çdo kujdes i ofruar është përgjegjësi e vetme e ofruesit individual dhe pacientit.' },
      { title:'Verifikimi dhe Kredencialet', body:'Përdoruesit inkurajohen të verifikojnë në mënyrë të pavarur identitetin dhe kredencialet e çdo kujdestari para se të marrin shërbime. Ndërsa Vonaxity merr hapa të arsyeshëm për të verifikuar licencat profesionale nga Urdhri i Infermierëve të Shqipërisë, Vonaxity nuk garanton vlefshmërinë aktuale të kredencialeve të çdo profesionisti.' },
      { title:'Kufizimi i Përgjegjësisë', body:'Në masën maksimale të lejuar nga ligji i aplikueshëm, Vonaxity, themeluesit, drejtorët, punonjësit dhe bashkëpunëtorët e saj nuk do të jenë përgjegjës për asnjë dëm të drejtpërdrejtë, të tërthortë, aksidental, të veçantë ose pasojë që lind nga: (a) përdorimi ose pamundësia e përdorimit të platformës; (b) çdo shërbim kujdesi i ofruar ose jo nga profesionistë të pavarur; (c) çdo gabim ose lëshim në përmbajtjen e platformës.' },
      { title:'Pa Garanci të Rezultateve', body:'Vonaxity nuk bën asnjë përfaqësim ose garanci, të shprehur ose të nënkuptuar, në lidhje me rezultatin e çdo shërbimi kujdesi. Rezultatet shëndetësore varen nga shumë faktorë jashtë kontrollit të Vonaxity, duke përfshirë gjendjen mjekësore të pacientit dhe gjykimin profesional të infermierës së pavarur.' },
      { title:'Disponueshmëria e Platformës', body:'Vonaxity nuk garanton qasje të pandërprerë dhe pa gabime në platformë në çdo kohë. Platforma mund të jetë përkohësisht e padisponueshme për shkak të mirëmbajtjes, problemeve teknike ose rrethanave jashtë kontrollit tonë.' },
      { title:'Privatësia dhe të Dhënat', body:'Mbledhja dhe përdorimi i informacionit personal dhe shëndetësor përmes platformës Vonaxity rregullohet nga Politika jonë e Privatësisë. Ne trajtojmë të gjitha të dhënat personale në përputhje me legjislacionin shqiptar të aplikueshëm për mbrojtjen e të dhënave.' },
      { title:'Ligji Rregullues', body:'Ky mohim përgjegjësie dhe çdo mosmarrëveshje që lind në lidhje me të do të rregullohet në përputhje me ligjet e Republikës së Shqipërisë. Çdo mosmarrëveshje do t\'i nënshtrohet juridiksionit ekskluziv të gjykatave kompetente të Shqipërisë.' },
      { title:'Ndryshimet në këtë Mohim', body:'Vonaxity rezervon të drejtën të përditësojë ose modifikojë këtë mohim në çdo kohë pa njoftim paraprak. Përdorimi i vazhdueshëm i platformës pas çdo ndryshimi përbën pranimin tuaj të mohimit të rishikuar.' },
      { title:'Kontakti', body:'Nëse keni pyetje rreth këtij mohimi ose shërbimeve tona, ju lutemi na kontaktoni përmes WhatsApp ose faqes sonë të internetit. Jemi të përkushtuar ndaj transparencës dhe do të bëjmë çmos për t\'u adresuar shqetësimet tuaja menjëherë.' },
    ],
  },
};

export default function DisclaimerPage({ params }) {
  const lang = params?.lang || 'en';
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg, minHeight:'100vh' }}>
      <style>{`
        .disc-card { transition: transform 0.2s, box-shadow 0.2s; }
        .disc-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.08) !important; }
        .disc-nav-pill { transition: all 0.15s; cursor: pointer; }
        .disc-nav-pill:hover { opacity: 0.8; transform: translateY(-1px); }

        @keyframes orbitCW  { from { transform: rotate(0deg)   translateX(88px) rotate(0deg);   } to { transform: rotate(360deg)  translateX(88px) rotate(-360deg);  } }
        @keyframes orbitCCW { from { transform: rotate(0deg)   translateX(64px) rotate(0deg);   } to { transform: rotate(-360deg) translateX(64px) rotate(360deg);   } }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.07);opacity:0.85} }
        @keyframes hbeat    { 0%,100%{stroke-dashoffset:200} 40%{stroke-dashoffset:0} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes shimmer  { 0%{opacity:0.4} 50%{opacity:1} 100%{opacity:0.4} }
        @keyframes ringPulse{ 0%,100%{r:42;opacity:0.18} 50%{r:50;opacity:0.08} }

        .disc-orbit-1 { animation: orbitCW  14s linear infinite; }
        .disc-orbit-2 { animation: orbitCCW 10s linear infinite; }
        .disc-orbit-3 { animation: orbitCW  18s linear infinite; animation-delay:-5s; }
        .disc-orbit-4 { animation: orbitCCW 12s linear infinite; animation-delay:-3s; }
        .disc-shield   { animation: pulse   3.2s ease-in-out infinite; transform-origin: center; }
        .disc-float    { animation: floatUp 4s ease-in-out infinite; }
        .disc-shimmer  { animation: shimmer 2.5s ease-in-out infinite; }
      `}</style>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'88px 24px 96px', background:'linear-gradient(135deg,#0F172A 0%,#1E3A5F 55%,#1D4ED8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Grid */}
        <div style={{ position:'absolute', inset:0, opacity:0.06, pointerEvents:'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dg)"/>
          </svg>
        </div>
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:-60, left:'20%', width:300, height:300, borderRadius:'50%', background:'rgba(37,99,235,0.18)', filter:'blur(90px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, right:'15%', width:250, height:250, borderRadius:'50%', background:'rgba(124,58,237,0.14)', filter:'blur(80px)', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 18px', borderRadius:99, marginBottom:28, border:'1px solid rgba(147,197,253,0.2)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {c.tag}
          </div>

          {/* ── Animated illustration ── */}
          <div className="disc-float" style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
            <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow:'visible' }}>

              {/* Outer glow rings */}
              <circle cx="110" cy="110" r="95" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <circle cx="110" cy="110" r="72" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

              {/* Animated pulse ring */}
              <circle cx="110" cy="110" r="52" stroke="rgba(99,179,255,0.25)" strokeWidth="1.5" style={{ animation:'ringPulse 2.8s ease-in-out infinite' }}/>

              {/* Orbit paths (dashed) */}
              <circle cx="110" cy="110" r="88" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4 8"/>
              <circle cx="110" cy="110" r="64" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 6"/>

              {/* ── Orbiting icons ── */}
              {/* 1 — Lock (outer orbit) */}
              <g style={{ transformOrigin:'110px 110px' }} className="disc-orbit-1">
                <g transform="translate(110,110)">
                  <rect x="-14" y="-14" width="28" height="28" rx="8" fill="rgba(37,99,235,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <rect x="-5" y="-3" width="10" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M-2.5 -3 Q-2.5 -7 0 -7 Q2.5 -7 2.5 -3" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="0" cy="2" r="1" fill="white"/>
                </g>
              </g>

              {/* 2 — Document (outer orbit) */}
              <g style={{ transformOrigin:'110px 110px' }} className="disc-orbit-3">
                <g transform="translate(110,110)">
                  <rect x="-14" y="-14" width="28" height="28" rx="8" fill="rgba(124,58,237,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <rect x="-6" y="-8" width="12" height="16" rx="1.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <line x1="-3" y1="-3" x2="3" y2="-3" stroke="white" strokeWidth="1.2"/>
                  <line x1="-3" y1="0" x2="3" y2="0" stroke="white" strokeWidth="1.2"/>
                  <line x1="-3" y1="3" x2="1" y2="3" stroke="white" strokeWidth="1.2"/>
                </g>
              </g>

              {/* 3 — People (inner orbit) */}
              <g style={{ transformOrigin:'110px 110px' }} className="disc-orbit-2">
                <g transform="translate(110,110)">
                  <rect x="-14" y="-14" width="28" height="28" rx="8" fill="rgba(5,150,105,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <circle cx="-2" cy="-4" r="3.5" fill="none" stroke="white" strokeWidth="1.5"/>
                  <path d="M-8 7 Q-8 1 -2 1 Q4 1 4 7" fill="none" stroke="white" strokeWidth="1.5"/>
                </g>
              </g>

              {/* 4 — Checkmark (inner orbit) */}
              <g style={{ transformOrigin:'110px 110px' }} className="disc-orbit-4">
                <g transform="translate(110,110)">
                  <rect x="-14" y="-14" width="28" height="28" rx="8" fill="rgba(217,119,6,0.85)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <polyline points="-5,0 -1,5 6,-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </g>

              {/* ── Central shield ── */}
              <g className="disc-shield" style={{ transformOrigin:'110px 110px' }}>
                {/* Shield shadow/glow */}
                <ellipse cx="110" cy="148" rx="28" ry="6" fill="rgba(0,0,0,0.25)" filter="url(#blur)"/>
                {/* Shield body */}
                <path d="M110 68 L138 80 L138 108 Q138 130 110 148 Q82 130 82 108 L82 80 Z"
                  fill="url(#shieldGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                {/* Shield inner highlight */}
                <path d="M110 76 L132 86 L132 108 Q132 126 110 141 Q88 126 88 108 L88 86 Z"
                  fill="url(#shieldInner)" opacity="0.4"/>
                {/* Heartbeat line */}
                <polyline points="94,109 99,109 102,100 106,118 110,104 114,114 117,109 126,109"
                  fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray="60" strokeDashoffset="60"
                  style={{ animation:'hbeat 2.4s ease-in-out infinite' }}/>
              </g>

              {/* ── Floating mini badges ── */}
              {/* Top-left verified badge */}
              <g className="disc-shimmer" style={{ animationDelay:'0s' }}>
                <rect x="28" y="56" width="52" height="22" rx="11" fill="rgba(5,150,105,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <polyline points="39,67 42,71 49,63" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="53" y="71" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">Verified</text>
              </g>
              {/* Top-right secure badge */}
              <g className="disc-shimmer" style={{ animationDelay:'0.8s' }}>
                <rect x="140" y="48" width="52" height="22" rx="11" fill="rgba(37,99,235,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <rect x="150" y="60" width="8" height="6" rx="1" fill="none" stroke="white" strokeWidth="1.5"/>
                <path d="M151 60 Q151 56 154 56 Q157 56 157 60" fill="none" stroke="white" strokeWidth="1.5"/>
                <text x="162" y="63" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui">Secure</text>
              </g>
              {/* Bottom legal badge */}
              <g className="disc-shimmer" style={{ animationDelay:'1.6s' }}>
                <rect x="68" y="162" width="64" height="22" rx="11" fill="rgba(124,58,237,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <text x="100" y="177" fontSize="9" fontWeight="700" fill="white" fontFamily="system-ui" textAnchor="middle">⚖ Albanian Law</text>
              </g>

              {/* Gradient defs */}
              <defs>
                <radialGradient id="shieldGrad" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#60A5FA"/>
                  <stop offset="100%" stopColor="#1D4ED8"/>
                </radialGradient>
                <linearGradient id="shieldInner" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="white" stopOpacity="0"/>
                </linearGradient>
                <filter id="blur"><feGaussianBlur stdDeviation="4"/></filter>
              </defs>
            </svg>
          </div>

          <h1 style={{ fontSize:'clamp(36px,5vw,60px)', fontWeight:900, color:'#fff', letterSpacing:'-2.5px', lineHeight:1.05, marginBottom:14 }}>
            {c.title}
          </h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', margin:'0 0 32px', letterSpacing:'0.2px' }}>{c.lastUpdated}</p>
          {/* Quick stats */}
          <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            {[
              lang==='sq' ? '11 Seksione' : '11 Sections',
              lang==='sq' ? 'Ligjërisht e Mbrojtur' : 'Legally Protected',
              lang==='sq' ? 'EN & SQ' : 'EN & SQ',
            ].map(pill => (
              <div key={pill} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:99, padding:'6px 16px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.75)' }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#34D399' }}/>
                {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Emergency banner ── */}
      <div style={{ background:'linear-gradient(90deg,#7F1D1D 0%,#991B1B 100%)', borderBottom:'2px solid #B91C1C' }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:14 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <p style={{ margin:0, fontSize:14, fontWeight:600, color:'#FCA5A5', letterSpacing:'0.1px' }}>
            {lang === 'sq'
              ? <>Vonaxity <strong style={{color:'#fff'}}>nuk</strong> ofron shërbime urgjente. Urgjencë mjekësore? Thirrni menjëherë <strong style={{color:'#fff',fontSize:16}}>127</strong></>
              : <>Vonaxity does <strong style={{color:'#fff'}}>not</strong> provide emergency services. Medical emergency? Call <strong style={{color:'#fff',fontSize:16}}>127</strong> immediately</>
            }
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <section style={{ padding:'64px 24px 100px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>

          {/* Intro card */}
          <div style={{ background:'linear-gradient(135deg,#EFF6FF 0%,#F5F3FF 100%)', border:'1px solid #BFDBFE', borderRadius:20, padding:'28px 32px', marginBottom:56, display:'flex', gap:20, alignItems:'flex-start' }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#2563EB,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(37,99,235,0.3)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p style={{ fontSize:15, color:'#1E3A5F', lineHeight:1.85, margin:0, fontWeight:450 }}>{c.intro}</p>
          </div>

          {/* Quick nav index */}
          <div style={{ marginBottom:48 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.textTertiary, marginBottom:14 }}>{c.navLabel}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {c.sections.map((sec, i) => {
                const m = SECTION_META[i];
                return (
                  <a key={i} href={`#section-${i}`} className="disc-nav-pill" style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:99, border:`1.5px solid ${m.border}`, background:m.bg, fontSize:12, fontWeight:600, color:m.color, textDecoration:'none' }}>
                    <span style={{ fontSize:11, fontWeight:800, opacity:0.7 }}>{String(i+1).padStart(2,'0')}</span>
                    {sec.title}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Section cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {c.sections.map((sec, i) => {
              const m = SECTION_META[i];
              return (
                <div key={i} id={`section-${i}`} className="disc-card" style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                  {/* Card header */}
                  <div style={{ display:'flex', alignItems:'center', gap:16, padding:'22px 28px', borderBottom:`1px solid ${C.border}`, background: i===0 ? '#FFF5F5' : C.bgWhite }}>
                    {/* Big gradient number */}
                    <div style={{ fontSize:40, fontWeight:900, lineHeight:1, background:m.numGrad, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-2px', minWidth:44, flexShrink:0 }}>
                      {String(i+1).padStart(2,'0')}
                    </div>
                    {/* Icon bubble */}
                    <div style={{ width:42, height:42, borderRadius:12, background:m.bg, border:`1.5px solid ${m.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:m.color, flexShrink:0 }}>
                      {m.icon}
                    </div>
                    <h2 style={{ fontSize:16, fontWeight:800, color: i===0 ? '#B91C1C' : C.textPrimary, margin:0, letterSpacing:'-0.3px', flex:1 }}>
                      {sec.title}
                    </h2>
                    {i===0 && (
                      <div style={{ display:'flex', alignItems:'center', gap:5, background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'#DC2626', flexShrink:0 }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:'#DC2626' }}/>
                        {lang==='sq'?'E Rëndësishme':'Important'}
                      </div>
                    )}
                  </div>
                  {/* Card body */}
                  <div style={{ padding:'22px 28px' }}>
                    <p style={{ fontSize:14.5, color:C.textSecondary, lineHeight:1.9, margin:0 }}>{sec.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom seal */}
          <div style={{ marginTop:56, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div style={{ background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.textPrimary, marginBottom:2 }}>Vonaxity L.L.C.</div>
                <div style={{ fontSize:11, color:C.textTertiary }}>Durrës, Albania · Founded 2025</div>
              </div>
            </div>
            <div style={{ background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:16, padding:'20px 24px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.textPrimary, marginBottom:2 }}>{lang==='sq'?'Përditësuar':'Last updated'}</div>
                <div style={{ fontSize:11, color:C.textTertiary }}>{c.lastUpdated}</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
