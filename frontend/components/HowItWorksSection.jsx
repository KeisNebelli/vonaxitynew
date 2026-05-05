'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import {
  AnimBooking,
  AnimMatching,
  AnimChooseNurse,
  AnimConfirmed,
  AnimTracking,
  AnimReport,
} from '@/components/visuals/StepAnimations';

const STEP_ANIMATIONS = [AnimBooking, AnimMatching, AnimChooseNurse, AnimConfirmed, AnimTracking, AnimReport];

/* ─────────────────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────────────────── */
const T = {
  en: {
    seeHow: 'See how it works',
    // Mockup — Booking
    choosePlan: 'Choose your plan', patientDetails: 'Patient details',
    fullName: 'Full name', city: 'City', servicesNeeded: 'Services needed',
    confirmBooking: 'Confirm booking →', popular: 'POPULAR',
    visitMo: (v) => `${v} ${v===1?'visit':'visits'}/mo`,
    // Mockup — Job board
    bookingConfirmed: 'Booking confirmed!', matchingNow: "We're matching you with a nurse now",
    homeVisit: 'Home Visit', findingNurse: 'Finding nurse…',
    searchingNurses: 'Searching nearby nurses…', matchedHours: 'Typically matched within a few hours',
    notifiedOnce: "You'll be notified once a nurse is assigned",
    date: 'Date', time: 'Time', location: 'Location', plan: 'Plan',
    // Mockup — Applicants
    nursesReady: '2 nurses ready for your visit', pickOrLet: 'Pick one or let us choose for you',
    recommended: 'RECOMMENDED', verified: 'Verified', exp: 'exp',
    selectConfirm: 'Select · Confirm visit →', viewProfile: 'View profile',
    letVonaxity: 'Or tap', letVonaxityBold: 'Let Vonaxity choose', letVonaxityEnd: 'for the best match',
    // Mockup — Confirmed
    nurseConfirmed: 'Nurse confirmed!', arrivingTime: 'Arriving Mon May 5 · 10:00 AM',
    services: 'Services', smsSent: 'SMS + email reminder sent',
    // Mockup — Tracking
    nurseArrived: 'Nurse has arrived · Live', eta: 'ETA: Arrived 10:03 AM', onSite: 'On site',
    now: 'NOW',
    trackSteps: ['Booking confirmed','Nurse on the way','Nurse arrived','Visit in progress','Visit complete'],
    servicesInProgress: 'Services in progress · Est. 45 min',
    // Mockup — Report
    visitCompleted: 'Visit completed · May 5', healthReport: 'Health Report',
    normal: '✓ Normal', nurseNote: 'Nurse Note',
    nurseNoteText: 'Patient stable. Recommend continuing current medication. Next check-in in 2 weeks.',
    reportSent: 'Full report sent to your email',
    vitals: ['Blood Pressure','Glucose','Heart Rate','SpO₂'],
  },
  sq: {
    seeHow: 'Shih si funksionon',
    // Mockup — Booking
    choosePlan: 'Zgjidhni planin', patientDetails: 'Të dhënat e pacientit',
    fullName: 'Emri i plotë', city: 'Qyteti', servicesNeeded: 'Shërbimet e nevojshme',
    confirmBooking: 'Konfirmo rezervimin →', popular: 'POPULLAR',
    visitMo: (v) => `${v} ${v===1?'vizitë':'vizita'}/muaj`,
    // Mockup — Job board
    bookingConfirmed: 'Rezervimi u konfirmua!', matchingNow: 'Po ju përputhim me një infermiere tani',
    homeVisit: 'Vizitë Shtëpie', findingNurse: 'Duke gjetur infermieren…',
    searchingNurses: 'Duke kërkuar infermierë afër…', matchedHours: 'Zakonisht përputhet brenda disa orësh',
    notifiedOnce: 'Do të njoftoheni sapo të caktohet një infermiere',
    date: 'Data', time: 'Ora', location: 'Vendndodhja', plan: 'Plani',
    // Mockup — Applicants
    nursesReady: '2 infermierë gati për vizitën tuaj', pickOrLet: 'Zgjidhni njërin ose lërini ne t\'ju zgjedhim',
    recommended: 'E REKOMANDUAR', verified: 'E verifikuar', exp: 'vit',
    selectConfirm: 'Zgjidh · Konfirmo vizitën →', viewProfile: 'Shiko profilin',
    letVonaxity: 'Ose shtypni', letVonaxityBold: 'Lëre Vonaxity të zgjedhë', letVonaxityEnd: 'për përputhjen më të mirë',
    // Mockup — Confirmed
    nurseConfirmed: 'Infermierja u konfirmua!', arrivingTime: 'Mbërrin Hën 5 Maj · 10:00 PD',
    services: 'Shërbime', smsSent: 'Kujtesa me SMS + email u dërgua',
    // Mockup — Tracking
    nurseArrived: 'Infermierja mbërriti · Live', eta: 'Mbërriti: 10:03 PD', onSite: 'Në vend',
    now: 'TANI',
    trackSteps: ['Rezervimi u konfirmua','Infermierja në rrugë','Infermierja mbërriti','Vizita në vazhdim','Vizita u krye'],
    servicesInProgress: 'Shërbime në vazhdim · Rreth 45 min',
    // Mockup — Report
    visitCompleted: 'Vizita u krye · 5 Maj', healthReport: 'Raporti Shëndetësor',
    normal: '✓ Normale', nurseNote: 'Shënim Infermiereje',
    nurseNoteText: 'Pacienti stabil. Rekomandohet vazhdimi i medikamenteve aktuale. Kontroll tjetër për 2 javë.',
    reportSent: 'Raporti i plotë u dërgua në emailin tuaj',
    vitals: ['Presioni','Glukoza','Ritmi Kardiak','SpO₂'],
  },
};
const tr = (lang, key) => (T[lang] || T.en)[key];

/* ─────────────────────────────────────────────────────────
   MOCKUP COMPONENTS — one per step
───────────────────────────────────────────────────────── */

/* Step 1 — Client picks a plan & books */
function MockupBooking({ plans, lang = 'en' }) {
  const displayPlans = plans && plans.length === 3 ? plans : [
    { name:'Basic',    price:'€50',  visits:1, featured:false },
    { name:'Standard', price:'€75',  visits:2, featured:true  },
    { name:'Premium',  price:'€155', visits:4, featured:false },
  ];
  const t = (k) => tr(lang, k);
  const fields = [[t('fullName'),'Fatmira Murati'],[t('city'),'Tirana'],[t('servicesNeeded'), lang==='sq'?'Presioni, glukoza':'Blood pressure, glucose check']];
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/signup" />
      <div style={{ padding:'18px 16px' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#111827', marginBottom:12 }}>{t('choosePlan')}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7, marginBottom:14 }}>
          {displayPlans.map((p) => (
            <div key={p.name} style={{ border: p.featured ? '2px solid #7C3AED' : '1px solid #E5E7EB', borderRadius:10, padding:'9px 7px', textAlign:'center', background: p.featured ? '#F5F3FF' : '#fff', position:'relative' }}>
              {p.featured && <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', background:'#7C3AED', color:'#fff', fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:99, whiteSpace:'nowrap' }}>{t('popular')}</div>}
              <div style={{ fontSize:10, fontWeight:600, color: p.featured ? '#7C3AED':'#6B7280', marginBottom:2 }}>{p.name}</div>
              <div style={{ fontSize:15, fontWeight:800, color:'#111827', letterSpacing:'-0.5px' }}>{p.price}</div>
              <div style={{ fontSize:9, color:'#9CA3AF', marginTop:1 }}>{t('visitMo')(p.visits)}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:7 }}>{t('patientDetails')}</div>
        {fields.map(([label,val]) => (
          <div key={label} style={{ marginBottom:7 }}>
            <div style={{ fontSize:10, color:'#9CA3AF', marginBottom:2 }}>{label}</div>
            <div style={{ background:'#fff', border:'1px solid #D1D5DB', borderRadius:7, padding:'6px 10px', fontSize:11, color:'#374151' }}>{val}</div>
          </div>
        ))}
        <div style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', borderRadius:8, padding:'9px', textAlign:'center', color:'#fff', fontWeight:700, fontSize:12, marginTop:6 }}>
          {t('confirmBooking')}
        </div>
      </div>
    </div>
  );
}

/* Step 2 — Client dashboard: booking confirmed, finding nurse */
function MockupJobBoard({ lang = 'en' }) {
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/dashboard" />
      <div style={{ padding:'16px' }}>
        {/* Success banner */}
        <div style={{ background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:10, padding:'10px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:13 }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'#065F46' }}>{tr(lang,'bookingConfirmed')}</div>
            <div style={{ fontSize:10, color:'#059669' }}>{tr(lang,'matchingNow')}</div>
          </div>
        </div>
        {/* Visit card — UNASSIGNED state */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'13px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'#111827' }}>{tr(lang,'homeVisit')}</div>
              <div style={{ fontSize:10, color:'#6B7280', marginTop:2 }}>{lang==='sq'?'Presioni · Glukoza':'Blood Pressure · Glucose Check'}</div>
            </div>
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:99, padding:'3px 9px', fontSize:10, fontWeight:700, color:'#D97706' }}>{tr(lang,'findingNurse')}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:10 }}>
            {[[tr(lang,'date'),'Hën, 5 Maj'],[tr(lang,'time'),'10:00 PD'],[tr(lang,'location'),'Tirana'],[tr(lang,'plan'),'Standard']].map(([k,v]) => (
              <div key={k} style={{ background:'#F9FAFB', borderRadius:7, padding:'6px 9px' }}>
                <div style={{ fontSize:9, color:'#9CA3AF', marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'#374151' }}>{v}</div>
              </div>
            ))}
          </div>
          {/* Matching progress bar */}
          <div style={{ fontSize:9, color:'#6B7280', marginBottom:5, fontWeight:600 }}>{tr(lang,'searchingNurses')}</div>
          <div style={{ height:5, borderRadius:99, background:'#F3F4F6', overflow:'hidden' }}>
            <div style={{ height:'100%', width:'65%', borderRadius:99, background:'linear-gradient(90deg,#7C3AED,#2563EB)', opacity:0.85 }} />
          </div>
          <div style={{ fontSize:9, color:'#9CA3AF', marginTop:5 }}>{tr(lang,'matchedHours')}</div>
        </div>
        {/* Notification hint */}
        <div style={{ background:'#EFF6FF', borderRadius:8, padding:'8px 12px', fontSize:10, color:'#2563EB', fontWeight:600 }}>
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011 1.18 2 2 0 012.98 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>{tr(lang,'notifiedOnce')}</span>
        </div>
      </div>
    </div>
  );
}

/* Step 3 — Client dashboard: nurses available, pick yours */
function MockupApplicants({ lang = 'en' }) {
  const nurses = [
    { name:'Elona Berberi', spec: lang==='sq'?'Kujdes i Përgjithshëm':'General Nursing', exp:'6', rating:'5.0', reviews:38, photo:'/nurse-elona.png', top:true  },
    { name:'Mirela Daka',   spec: lang==='sq'?'Analizat e Gjakut':'Blood Work',          exp:'4', rating:'4.9', reviews:21, photo:'/nurse-mirela.png', top:false },
  ];
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/dashboard" />
      <div style={{ padding:'16px' }}>
        {/* Notification banner */}
        <div style={{ background:'#EDE9FE', border:'1px solid #C4B5FD', borderRadius:10, padding:'9px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:13 }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'#7C3AED', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'#4C1D95' }}>{tr(lang,'nursesReady')}</div>
            <div style={{ fontSize:10, color:'#7C3AED' }}>{tr(lang,'pickOrLet')}</div>
          </div>
        </div>
        {/* Nurse cards */}
        {nurses.map((n) => (
          <div key={n.name} style={{ background:'#fff', border: n.top ? '2px solid #059669':'1px solid #E5E7EB', borderRadius:12, padding:'11px 12px', marginBottom:8, position:'relative' }}>
            {n.top && <div style={{ position:'absolute', top:-8, right:12, background:'#059669', color:'#fff', fontSize:8, fontWeight:800, padding:'2px 8px', borderRadius:99 }}>{tr(lang,'recommended')}</div>}
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
              <img src={n.photo} alt={n.name} style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:'2px solid #DBEAFE', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:'#111827', fontSize:11 }}>{n.name}</div>
                <div style={{ fontSize:10, color:'#2563EB', fontWeight:500 }}>{n.spec} · {n.exp} {tr(lang,'exp')}</div>
                <div style={{ display:'flex', gap:1, marginTop:2, alignItems:'center' }}>
                  {[1,2,3,4,5].map(s=><svg key={s} width="8" height="8" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  <span style={{ fontSize:9, color:'#6B7280', marginLeft:3 }}>{n.rating} ({n.reviews})</span>
                </div>
              </div>
              <div style={{ background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:6, padding:'2px 7px', fontSize:9, fontWeight:700, color:'#059669', flexShrink:0 }}>{tr(lang,'verified')}</div>
            </div>
            <div style={{ background: n.top ? '#059669':'#F3F4F6', borderRadius:7, padding:'6px', textAlign:'center', color: n.top ? '#fff':'#374151', fontWeight:700, fontSize:10 }}>
              {n.top ? tr(lang,'selectConfirm') : tr(lang,'viewProfile')}
            </div>
          </div>
        ))}
        <div style={{ background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:8, padding:'8px 12px', fontSize:10, color:'#6B7280', textAlign:'center' }}>
          {tr(lang,'letVonaxity')} <strong style={{ color:'#7C3AED' }}>{tr(lang,'letVonaxityBold')}</strong> {tr(lang,'letVonaxityEnd')}
        </div>
      </div>
    </div>
  );
}

/* Step 4 — Nurse assigned, client confirmed */
function MockupNurseConfirmed({ lang = 'en' }) {
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/dashboard" />
      <div style={{ padding:'16px' }}>
        {/* Confirmation banner */}
        <div style={{ background:'#ECFDF5', border:'1px solid #6EE7B7', borderRadius:10, padding:'10px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:13 }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'#059669', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#065F46' }}>{tr(lang,'nurseConfirmed')}</div>
            <div style={{ fontSize:10, color:'#059669' }}>{tr(lang,'arrivingTime')}</div>
          </div>
        </div>
        {/* Nurse card */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:12, padding:'13px' }}>
          <div style={{ display:'flex', gap:11, alignItems:'center', marginBottom:11 }}>
            <img src="/nurse-elona.png" alt="Elona" style={{ width:46, height:46, borderRadius:'50%', objectFit:'cover', border:'2px solid #DBEAFE' }} />
            <div>
              <div style={{ fontWeight:700, color:'#111827', fontSize:12 }}>Elona Berberi</div>
              <div style={{ fontSize:10, color:'#2563EB', fontWeight:500 }}>{lang==='sq'?'Kujdes i Përgjithshëm · 6 vit':'General Nursing · 6 yrs'} {tr(lang,'exp')}</div>
              <div style={{ display:'flex', gap:1, marginTop:2 }}>
                {[1,2,3,4,5].map(s=><svg key={s} width="9" height="9" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                <span style={{ fontSize:10, color:'#6B7280', marginLeft:3 }}>5.0 (38)</span>
              </div>
            </div>
            <div style={{ marginLeft:'auto', background:'#EFF6FF', border:'1px solid #BFDBFE', borderRadius:8, padding:'3px 8px', fontSize:10, fontWeight:700, color:'#2563EB' }}>Verified</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
            {[[tr(lang,'date'),'Hën, 5 Maj'],[tr(lang,'time'),'10:00 PD'],[tr(lang,'services'),lang==='sq'?'Presioni + Glukoza':'BP + Glucose'],[tr(lang,'location'),'Tirana, AL-01']].map(([k,v]) => (
              <div key={k} style={{ background:'#F9FAFB', borderRadius:7, padding:'7px 9px' }}>
                <div style={{ fontSize:9, color:'#9CA3AF', marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'#374151' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:10, background:'#F5F3FF', borderRadius:8, padding:'8px 10px', fontSize:10, color:'#7C3AED', fontWeight:600, textAlign:'center' }}>
            <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 011 1.18 2 2 0 012.98 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>SMS + email reminder sent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Step 5 — Nurse on the way / visit in progress */
function MockupVisitTracking() {
  const steps = [
    { label:'Booking confirmed', done:true  },
    { label:'Nurse on the way',  done:true, active:false  },
    { label:'Nurse arrived',     done:false, active:true  },
    { label:'Visit in progress', done:false },
    { label:'Visit complete',    done:false },
  ];
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/dashboard/visits" />
      <div style={{ padding:'16px' }}>
        {/* Live status pill */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:13 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#059669', boxShadow:'0 0 0 3px rgba(5,150,105,0.2)', animation:'pulse 1.5s infinite' }} />
          <div style={{ fontSize:12, fontWeight:700, color:'#059669' }}>Nurse has arrived · Live</div>
        </div>
        {/* Nurse strip */}
        <div style={{ display:'flex', gap:10, alignItems:'center', background:'#fff', border:'1px solid #E5E7EB', borderRadius:11, padding:'10px 12px', marginBottom:14 }}>
          <img src="/nurse-elona.png" alt="Elona" style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover' }} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:'#111827', fontSize:11 }}>Elona Berberi</div>
            <div style={{ fontSize:10, color:'#6B7280' }}>ETA: Arrived 10:03 AM</div>
          </div>
          <div style={{ background:'#ECFDF5', borderRadius:7, padding:'4px 9px', fontSize:10, fontWeight:700, color:'#059669' }}>On site</div>
        </div>
        {/* Timeline */}
        <div style={{ position:'relative', paddingLeft:20 }}>
          <div style={{ position:'absolute', left:7, top:8, bottom:8, width:2, background:'#E5E7EB', borderRadius:99 }} />
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:11, position:'relative' }}>
              <div style={{ width:14, height:14, borderRadius:'50%', flexShrink:0, zIndex:1, position:'relative',
                background: s.active ? '#059669' : s.done ? '#059669' : '#E5E7EB',
                border: s.active ? '2px solid #fff' : 'none',
                boxShadow: s.active ? '0 0 0 3px rgba(5,150,105,0.25)' : 'none',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {s.done && !s.active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{ fontSize:11, fontWeight: s.active ? 700 : s.done ? 600 : 400, color: s.active ? '#059669' : s.done ? '#374151' : '#9CA3AF' }}>
                {s.label}
                {s.active && <span style={{ marginLeft:6, fontSize:9, background:'#ECFDF5', color:'#059669', padding:'1px 6px', borderRadius:99, fontWeight:700 }}>NOW</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:'#EFF6FF', borderRadius:8, padding:'8px 12px', fontSize:10, color:'#2563EB', fontWeight:600, textAlign:'center', marginTop:4 }}>
          Services in progress · Est. 45 min
        </div>
      </div>
    </div>
  );
}

/* Step 6 — Health report delivered */
function MockupHealthReport() {
  return (
    <div style={{ background:'#F8FAFF', borderRadius:16, overflow:'hidden', border:'1px solid #E5E7EB', fontFamily:'Inter,system-ui,sans-serif', fontSize:12 }}>
      <BrowserBar url="vonaxity.com/dashboard/health" />
      <div style={{ padding:'16px' }}>
        {/* Done banner */}
        <div style={{ background:'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border:'1px solid #C4B5FD', borderRadius:10, padding:'9px 13px', display:'flex', gap:10, alignItems:'center', marginBottom:13 }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'linear-gradient(135deg,#7C3AED,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'#4C1D95' }}>Visit completed · May 5</div>
            <div style={{ fontSize:10, color:'#7C3AED' }}>10:00–10:48 AM · Elona Berberi</div>
          </div>
        </div>
        {/* Vitals grid */}
        <div style={{ fontSize:11, fontWeight:700, color:'#111827', marginBottom:9 }}>Health Report</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
          {[
            { label:'Blood Pressure', val:'118 / 76', unit:'mmHg', ok:true  },
            { label:'Glucose',        val:'94',       unit:'mg/dL', ok:true  },
            { label:'Heart Rate',     val:'72',       unit:'bpm',   ok:true  },
            { label:'SpO₂',          val:'98',       unit:'%',     ok:true  },
          ].map(r => (
            <div key={r.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:10, padding:'9px 10px' }}>
              <div style={{ fontSize:9, color:'#9CA3AF', marginBottom:3 }}>{r.label}</div>
              <div style={{ fontSize:14, fontWeight:800, color:'#111827', letterSpacing:'-0.5px' }}>{r.val} <span style={{ fontSize:9, fontWeight:400, color:'#6B7280' }}>{r.unit}</span></div>
              <div style={{ fontSize:9, fontWeight:700, color:'#059669', marginTop:3 }}>✓ Normal</div>
            </div>
          ))}
        </div>
        {/* Nurse note */}
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'8px 10px', marginBottom:9 }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#92400E', marginBottom:2, textTransform:'uppercase', letterSpacing:'0.5px' }}>Nurse Note</div>
          <div style={{ fontSize:10, color:'#78350F', lineHeight:1.6 }}>Patient stable. Recommend continuing current medication. Next check-in in 2 weeks.</div>
        </div>
        <div style={{ background:'#ECFDF5', borderRadius:8, padding:'7px 12px', fontSize:10, fontWeight:600, color:'#059669', textAlign:'center' }}>
          <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>Full report sent to your email</span>
        </div>
      </div>
    </div>
  );
}

/* ── Shared browser chrome bar ── */
function BrowserBar({ url }) {
  return (
    <div style={{ background:'#1E293B', padding:'8px 14px', display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444' }}/>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#F59E0B' }}/>
      <div style={{ width:8, height:8, borderRadius:'50%', background:'#22C55E' }}/>
      <div style={{ flex:1, background:'#334155', borderRadius:4, padding:'3px 10px', marginLeft:8, fontSize:10, color:'rgba(255,255,255,0.5)' }}>{url}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STEP DEFINITIONS
───────────────────────────────────────────────────────── */
const getSteps = (lang) => {
  const sq = lang === 'sq';
  return [
    {
      num: '01',
      title: sq ? 'Zgjidhni planin & rezervoni' : 'Pick a plan & book',
      color: '#7C3AED',
      colorLight: 'rgba(124,58,237,0.08)',
      badge: sq ? 'Zgjat 2 minuta' : 'Takes 2 minutes',
      headline: sq ? 'Zgjidhni planin, tregoni për të dashurin tuaj' : 'Pick a plan, tell us about your loved one',
      description: sq
        ? "Zgjidhni një plan abonimi që i përshtatet nevojave tuaja, pastaj vendosni të dhënat e anëtarit të familjes — emrin, qytetin dhe shërbimet e nevojshme. Pa thirrje telefonike, pa letrapunë."
        : "Choose a subscription plan that fits your needs, then enter your family member's details — name, city, and the services required. No phone calls, no paperwork.",
      bullets: sq ? [
        'Zgjidhni planin Basic, Standard ose Premium',
        'Vendosni emrin e pacientit, qytetin dhe adresën',
        'Zgjidhni shërbimet (kontroll BP, glukozë, kujdes plagësh…)',
        'Paguani me siguri — konfirmimi mbërrin menjëherë',
      ] : [
        'Select Basic, Standard, or Premium plan',
        'Enter patient name, city, and address',
        'Choose services (BP check, glucose, wound care…)',
        'Pay securely — confirmation arrives instantly',
      ],
      Mockup: MockupBooking,
    },
    {
      num: '02',
      title: sq ? 'Puna u postua te infermierët' : 'Job posted to nurses',
      color: '#0EA5E9',
      colorLight: 'rgba(14,165,233,0.08)',
      badge: sq ? 'Postim i menjëhershëm' : 'Instant posting',
      headline: sq ? 'Rezervimi juaj shkon live te infermierët e verifikuar afër' : 'Your booking goes live to verified nurses nearby',
      description: sq
        ? 'Sapo konfirmoni, një kartë pune publikohet te çdo infermiere e verifikuar në qytetin tuaj. Ata shohin kërkesat e shërbimit, datën dhe kompensimin — dhe mund të aplikojnë menjëherë.'
        : 'The moment you confirm, a job card is published to every verified nurse in your city. They see your service requirements, date, and compensation — and can apply immediately.',
      bullets: sq ? [
        'Puna postohet menjëherë te rrjeti i infermierëve',
        'Vetëm infermierët e verifikuar me regjistrim mund të aplikojnë',
        'Infermierët shohin llojin e shërbimit, vendndodhjen dhe pagën',
        'Infermierë të shumtë konkurrojnë për vizitën tuaj',
      ] : [
        'Job posted instantly to nurse network',
        'Only verified, background-checked nurses can apply',
        'Nurses see service type, location, and pay rate',
        'Multiple nurses compete for your visit',
      ],
      Mockup: MockupJobBoard,
    },
    {
      num: '03',
      title: sq ? 'Infermierët aplikojnë' : 'Nurses apply',
      color: '#2563EB',
      colorLight: 'rgba(37,99,235,0.08)',
      badge: sq ? 'Ju zgjidhni ose ne përputhim' : 'You choose or we match',
      headline: sq ? 'Shikoni aplikantët ose lërini ne të zgjedhim ndeshjen më të mirë' : 'Review applicants or let us pick the best match',
      description: sq
        ? 'Mund të shfletoni profilet e infermierëve — vlerësimet, specialitetet, vitet e përvojës — dhe të zgjidhni atë që preferoni. Ose lërini ekipin tonë të zgjedhë infermieren me vlerësimet më të larta.'
        : 'You can browse nurse profiles — ratings, specialties, years of experience — and select the one you prefer. Or let our team pick the top-rated, best-matched nurse for you.',
      bullets: sq ? [
        'Shikoni profilin e plotë: foto, vlerësim, përvojë',
        'Shikoni të gjitha çertifikatat dhe specialitetet',
        'Zgjidhni manualisht ose lërini Vonaxity t\'ju përputhë',
        'Vetëm infermierë me vlerësim 4.5★+ janë të kualifikuar',
      ] : [
        'See full nurse profile: photo, rating, experience',
        'View all certifications and specialties',
        'Choose manually or let Vonaxity match you',
        'Only nurses with 4.5★+ rating are eligible',
      ],
      Mockup: MockupApplicants,
    },
    {
      num: '04',
      title: sq ? 'Infermierja u konfirmua' : 'Nurse confirmed',
      color: '#059669',
      colorLight: 'rgba(5,150,105,0.08)',
      badge: sq ? 'Brenda 24 orësh' : 'Within 24 hours',
      headline: sq ? 'Infermierja juaj konfirmohet me orën dhe detajet e sakta' : 'Your nurse is confirmed with exact time and details',
      description: sq
        ? "Pasi të caktohet infermierja, do ta shihni profilin e saj të plotë në panelin tuaj me kohën e saktë të mbërritjes. Merrni kujtesë me SMS dhe email për të mos u kapur të papërgatitur."
        : "Once a nurse is assigned, you'll see their full profile on your dashboard with the exact arrival time. You receive an SMS and email reminder so you're never caught off guard.",
      bullets: sq ? [
        'Profili, vlerësimi dhe foto e infermierës të dukshme në panel',
        'Data dhe orari i saktë i konfirmuar',
        'Kujtesë me SMS + email dërguar automatikisht',
        'Anulim ose ricaktim i lehtë deri 4 orë para',
      ] : [
        'Nurse profile, rating, and photo visible on dashboard',
        'Exact date and time slot confirmed',
        'SMS + email reminder sent automatically',
        'Easy cancellation or rescheduling up to 4h before',
      ],
      Mockup: MockupNurseConfirmed,
    },
    {
      num: '05',
      title: sq ? 'Infermierja ju viziton' : 'Nurse visits you',
      color: '#D97706',
      colorLight: 'rgba(217,119,6,0.08)',
      badge: sq ? 'Tek dera juaj' : 'At your doorstep',
      headline: sq ? 'Gjurmoni infermieren tuaj në kohë reale ndërsa mbërrin' : 'Track your nurse in real-time as they arrive',
      description: sq
        ? 'Ndiqni vizitën tuaj live në panel — nga konfirmimi deri te mbërritja dhe kujdesi në vazhdim. Infermierja kryen të gjitha shërbimet e kërkuara në kohën e planifikuar.'
        : 'Follow your visit live on the dashboard — from confirmation through arrival to care in progress. The nurse performs all requested services at the scheduled time.',
      bullets: sq ? [
        'Status live: në rrugë → mbërriti → në vazhdim',
        'Infermierja mbërrin tek dera juaj sipas orarit',
        'Të gjitha shërbimet e kërkuara kryhen në shtëpi',
        'Çdo ndryshim ose shënim i përditësuar në kohë reale',
      ] : [
        'Live status: on the way → arrived → in progress',
        'Nurse arrives at your door on schedule',
        'All requested services performed at home',
        'Any changes or notes updated in real-time',
      ],
      Mockup: MockupVisitTracking,
    },
    {
      num: '06',
      title: sq ? 'Raporti shëndetësor dërgohet' : 'Health report delivered',
      color: '#7C3AED',
      colorLight: 'rgba(124,58,237,0.08)',
      badge: sq ? 'Të njëjtën ditë' : 'Same day',
      headline: sq ? 'Raporti i plotë i vitaleve dhe shënimet e infermierës — direkt në emailin tuaj' : 'Full vitals report and nurse notes — straight to your inbox',
      description: sq
        ? 'Brenda orësh nga vizita, një raport i detajuar shëndetësor mbërrin në emailin tuaj me të gjitha vitalet e regjistruara, vërejtjet e infermierës dhe rekomandimet. Çdo vizitë, çdo herë.'
        : 'Within hours of the visit, a detailed health report lands in your inbox with all recorded vitals, nurse observations, and follow-up recommendations. Every visit, every time.',
      bullets: sq ? [
        'BP, glukoza, ritmi kardiak, SpO₂ të regjistruara',
        'Shënimet e infermierës dhe vërejtjet klinike të përfshira',
        'Raporti PDF i ruajtur në panelin tuaj shëndetësor',
        'Trendet e gjurmuara automatikisht nëpër të gjitha vizitat',
      ] : [
        'BP, glucose, heart rate, SpO₂ all recorded',
        'Nurse notes and clinical observations included',
        'PDF report stored in your health dashboard',
        'Trends tracked across all visits automatically',
      ],
      Mockup: MockupHealthReport,
    },
  ];
};

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function HowItWorksSection({ lang = 'en', tag, title, subtitle, steps: stepsProp, plans: plansProp }) {
  const STEPS = getSteps(lang);
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dir, setDir] = useState('next');       // 'next' | 'prev' — slide direction
  const [contentKey, setContentKey] = useState(0); // bumped on each step change to re-trigger animation
  const touchStartX = useRef(null);

  // Fetch live pricing from CRM fresh on mount (bypasses Next.js page cache)
  const [plans, setPlans] = useState(plansProp);
  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => {
        if (data?.basicPrice) {
          setPlans([
            { name:'Basic',    price:`€${data.basicPrice}`,    visits:data.basicVisits    || 1, featured:false },
            { name:'Standard', price:`€${data.standardPrice}`, visits:data.standardVisits || 2, featured:true  },
            { name:'Premium',  price:`€${data.premiumPrice}`,  visits:data.premiumVisits  || 4, featured:false },
          ]);
        }
      })
      .catch(() => {});
  }, []);

  // Open modal — fade + scale in
  const open = useCallback((i) => {
    setDir('next');
    setActive(i);
    setContentKey(k => k + 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  // Close modal — fade out
  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setActive(null), 300);
  }, []);

  // Navigate between steps — modal stays open, only content slides
  const goTo = useCallback((si, direction) => {
    setDir(direction ?? (si > active ? 'next' : 'prev'));
    setActive(si);
    setContentKey(k => k + 1);
  }, [active]);

  const goPrev = useCallback(() => { if (active > 0) goTo(active - 1, 'prev'); }, [active, goTo]);
  const goNext = useCallback(() => { if (active < STEPS.length - 1) goTo(active + 1, 'next'); }, [active, goTo]);

  // Keyboard: ← → to navigate, Escape to close
  useEffect(() => {
    if (active === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
      else if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, goNext, goPrev, close]);

  // Touch swipe handlers
  const onTouchStart = useCallback((e) => { touchStartX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) { diff > 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  }, [goNext, goPrev]);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [active]);

  const step = active !== null ? STEPS[active] : null;

  /* Color for the step circle on cards — cycles through step colors */
  const cardColor = (i) => STEPS[i].color;

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes slideInNext { from { opacity:0; transform:translateX(28px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInPrev { from { opacity:0; transform:translateX(-28px); } to { opacity:1; transform:translateX(0); } }
        .hiw-content-next { animation: slideInNext 0.28s cubic-bezier(0.4,0,0.2,1) both; }
        .hiw-content-prev { animation: slideInPrev 0.28s cubic-bezier(0.4,0,0.2,1) both; }
        .hiw-card {
          cursor: pointer;
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E5E7EB;
          padding: 28px 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.22s cubic-bezier(0.4,0,0.2,1),
                      border-color 0.22s ease;
          height: 100%;
          outline: none;
          display: flex;
          flex-direction: column;
        }
        .hiw-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 36px rgba(124,58,237,0.13);
          border-color: rgba(124,58,237,0.2);
        }
        .hiw-caret {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: auto;
          padding-top: 18px;
          font-size: 12px;
          font-weight: 600;
          color: #7C3AED;
          background: rgba(124,58,237,0.07);
          border: 1px solid rgba(124,58,237,0.15);
          padding: 5px 12px;
          border-radius: 99px;
          align-self: flex-start;
          transition: background 0.18s ease, gap 0.18s ease;
        }
        .hiw-card:hover .hiw-caret {
          background: rgba(124,58,237,0.13);
          gap: 9px;
        }
        .hiw-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,0.58);
          backdrop-filter: blur(7px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .hiw-overlay.vis { opacity: 1; }
        .hiw-modal {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          width: 100%;
          max-width: 920px;
          max-height: 90vh;
          overflow-y: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          transform: scale(0.93) translateY(18px);
          opacity: 0;
          transition: transform 0.32s cubic-bezier(0.34,1.26,0.64,1), opacity 0.28s ease;
          position: relative;
        }
        .hiw-overlay.vis .hiw-modal { transform: scale(1) translateY(0); opacity: 1; }
        .hiw-modal-left  { padding: 44px 40px; }
        .hiw-modal-right { padding: 32px 32px 32px 0; display: flex; align-items: center; }
        .hiw-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid #E5E7EB;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          color: #6B7280;
          transition: background 0.15s, border-color 0.15s;
          z-index: 2;
        }
        .hiw-close:hover { background: #FEF2F2; border-color: #FCA5A5; color: #EF4444; }
        @media (max-width: 700px) {
          .hiw-modal { grid-template-columns: 1fr; max-height: 88vh; }
          .hiw-modal-left  { padding: 36px 24px 16px; }
          .hiw-modal-right { padding: 0 24px 32px; }
          .hiw-content-next, .hiw-content-prev { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          #how-it-works { padding: 60px 16px !important; }
          .hiw-card { padding: 22px 18px !important; }
          .hiw-overlay { padding: 0 !important; align-items: flex-end !important; }
          .hiw-modal { border-radius: 24px 24px 0 0 !important; max-height: 92vh !important; }
          .hiw-modal-left { padding: 28px 20px 14px !important; }
          .hiw-modal-right { padding: 0 20px 28px !important; }
          .hiw-nav-prev, .hiw-nav-next { width: 44px !important; height: 44px !important; }
        }
      `}</style>

      {/* ── Section ── */}
      <section id="how-it-works" style={{ padding:'96px 24px', background:'#fff', scrollMarginTop:'76px', position:'relative', zIndex:1, overflow:'hidden' }}>
        {/* Watermark cross */}
        <div style={{ position:'absolute', top:'50%', right:-60, transform:'translateY(-50%)', opacity:0.025, pointerEvents:'none' }}>
          <svg width="340" height="340" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#7C3AED"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#7C3AED"/></svg>
        </div>

        <div style={{ maxWidth:1140, margin:'0 auto' }}>
          <ScrollReveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#7C3AED', background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.15)', padding:'5px 13px', borderRadius:99, marginBottom:16 }}>
                {tag}
              </div>
              <h2 style={{ fontSize:'clamp(30px,4vw,46px)', fontWeight:800, color:'#111827', margin:'0 0 14px', letterSpacing:'-1.5px' }}>{title}</h2>
              <p style={{ fontSize:16, color:'#6B7280', maxWidth:500, margin:'0 auto', lineHeight:1.7 }}>
                {subtitle || 'From booking to bedside — transparent every step of the way.'}
              </p>
            </div>
          </ScrollReveal>

          {/* 6-card grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18 }}>
            {STEPS.map((s, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div
                  className="hiw-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => open(i)}
                  onKeyDown={(e) => e.key === 'Enter' && open(i)}
                  aria-label={`Step ${i+1}: ${s.title}`}
                >
                  {/* Faint watermark number */}
                  <div style={{ position:'absolute', right:12, bottom:6, fontSize:72, fontWeight:900, color:'rgba(0,0,0,0.03)', letterSpacing:'-4px', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
                    {i + 1}
                  </div>
                  {/* Step animation illustration */}
                  {(() => { const Anim = STEP_ANIMATIONS[i]; return <Anim />; })()}
                  {/* Step circle — uses each step's own color */}
                  <div style={{ width:46, height:46, borderRadius:'50%', background:cardColor(i), display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 6px 16px ${cardColor(i)}44` }}>
                    <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>0{i+1}</span>
                  </div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#111827', marginBottom:8, lineHeight:1.35 }}>
                    {Array.isArray(stepsProp) && stepsProp[i]?.title || s.title}
                  </div>
                  <div style={{ fontSize:13, color:'#6B7280', lineHeight:1.65, marginBottom:16, flex:1 }}>
                    {Array.isArray(stepsProp) && stepsProp[i]?.desc || s.description}
                  </div>
                  <div className="hiw-caret">
                    See how it works
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
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
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="hiw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="hiw-close" onClick={close} aria-label="Close">✕</button>

            {/* Animated content wrapper — key changes on every step nav to re-trigger slide */}
            <div
              key={contentKey}
              className={`hiw-content-${dir}`}
              style={{ display:'grid', gridColumn:'1 / -1', gridTemplateColumns:'1fr 1fr' }}
            >

            {/* Left: copy */}
            <div className="hiw-modal-left">
              {/* Step badge */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:step.colorLight, border:`1px solid ${step.color}33`, borderRadius:99, padding:'5px 14px', marginBottom:20 }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:step.color, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'#fff' }}>0{active+1}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:step.color, textTransform:'uppercase', letterSpacing:'0.8px' }}>{step.badge}</span>
              </div>

              <h3 style={{ fontSize:'clamp(19px,2.5vw,27px)', fontWeight:800, color:'#111827', margin:'0 0 13px', letterSpacing:'-0.8px', lineHeight:1.2 }}>
                {step.headline}
              </h3>
              <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.75, margin:'0 0 22px' }}>
                {step.description}
              </p>

              {/* Bullets */}
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {step.bullets.map((b, bi) => (
                  <div key={bi} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:19, height:19, borderRadius:'50%', background:step.colorLight, border:`1.5px solid ${step.color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize:13, color:'#374151', lineHeight:1.55 }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Step navigation: arrows + dots */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:30 }}>
                {/* Prev arrow */}
                <button
                  onClick={goPrev}
                  disabled={active === 0}
                  className="hiw-nav-prev"
                  style={{ width:34, height:34, borderRadius:'50%', border:'1.5px solid #E5E7EB', background:'#fff', cursor: active === 0 ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: active === 0 ? 0.3 : 1, transition:'all 0.15s ease' }}
                  aria-label="Previous step"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {/* Dots */}
                <div style={{ display:'flex', gap:5, flex:1, justifyContent:'center' }}>
                  {STEPS.map((_, si) => (
                    <button
                      key={si}
                      onClick={() => goTo(si)}
                      style={{ width: si === active ? 24 : 7, height:7, borderRadius:99, border:'none', background: si === active ? step.color : '#E5E7EB', cursor:'pointer', transition:'width 0.3s ease, background 0.2s ease', padding:0, flexShrink:0 }}
                      aria-label={`Go to step ${si+1}`}
                    />
                  ))}
                </div>
                {/* Next arrow */}
                <button
                  onClick={goNext}
                  disabled={active === STEPS.length - 1}
                  className="hiw-nav-next"
                  style={{ width:34, height:34, borderRadius:'50%', border:'none', background: active === STEPS.length - 1 ? '#F3F4F6' : step.color, cursor: active === STEPS.length - 1 ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, opacity: active === STEPS.length - 1 ? 0.35 : 1, transition:'all 0.18s ease', boxShadow: active < STEPS.length - 1 ? `0 4px 14px ${step.color}55` : 'none' }}
                  aria-label="Next step"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active === STEPS.length - 1 ? '#9CA3AF' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            {/* Right: mockup */}
            <div className="hiw-modal-right" style={{ background:'linear-gradient(145deg,#F8FAFF 0%,#F5F3FF 100%)', borderRadius:'0 24px 24px 0' }}>
              <div style={{ width:'100%' }}>
                <step.Mockup plans={active === 0 ? plans : undefined} lang={lang} />
              </div>
            </div>

            </div>{/* end animated content wrapper */}
          </div>
        </div>
      )}
    </>
  );
}
