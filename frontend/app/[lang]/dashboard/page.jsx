'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';
import Settings from './settings';
import HealthProgress from './health';

const C = { primary:'#2563EB',primaryLight:'#EFF6FF',primaryDark:'#1D4ED8',secondary:'#059669',secondaryLight:'#ECFDF5',warning:'#D97706',warningLight:'#FFFBEB',error:'#DC2626',errorLight:'#FEF2F2',purple:'#7C3AED',purpleLight:'#F5F3FF',bg:'#F8FAFC',bgWhite:'#FFFFFF',bgSubtle:'#F1F5F9',textPrimary:'#0F172A',textSecondary:'#475569',textTertiary:'#94A3B8',border:'#E2E8F0',borderSubtle:'#F1F5F9',sidebarBg:'#111827' };
const F = "'DM Sans','Inter',system-ui,sans-serif";
const SSM = '0 1px 3px rgba(15,23,42,0.06)';
const SMD = '0 4px 12px rgba(15,23,42,0.08)';


const SERVICES_MAP = [
  { en:'Blood Pressure Check',   sq:'Matja e Presionit të Gjakut' },
  { en:'Glucose Monitoring',     sq:'Monitorimi i Glukozës' },
  { en:'Vitals Check',           sq:'Kontrolli i Shenjave Vitale' },
  { en:'Blood Work Collection',  sq:'Marrja e Gjakut' },
  { en:'Welfare Check',          sq:'Vizitë Mirëqenieje' },
  { en:'Post-surgical Care',     sq:'Kujdes Pas-Operativ' },
  { en:'Medication Administration', sq:'Administrim Medikamentesh' },
  { en:'General Nursing',        sq:'Kujdes i Përgjithshëm' },
];
const SERVICES = SERVICES_MAP.map(s => s.en);

const makeNAV = (tr) => [
  { id:'overview', label:tr('dashboard.overview'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'book', label:tr('dashboard.bookVisit'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id:'health', label: tr('dashboard.health') || 'Health', icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { id:'nurses', label:tr('dashboard.findNurses'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id:'visits', label:tr('dashboard.myVisits'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'subscription', label:tr('dashboard.subscription'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'settings', label:tr('dashboard.settings'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

function Badge({ s, lang='en' }) {
  const m = { COMPLETED:[C.secondaryLight,'#059669'], PENDING:[C.primaryLight,C.primary], ACCEPTED:[C.secondaryLight,C.secondary], CANCELLED:[C.bgSubtle,C.textTertiary], UNASSIGNED:[C.warningLight,C.warning], REJECTED:[C.errorLight,C.error] };
  const [bg,col] = m[s]||[C.bgSubtle,C.textTertiary];
  const label = t(lang,'visits.status.'+s) || s;
  return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:bg, color:col, textTransform:'uppercase', whiteSpace:'nowrap' }}>{label}</span>;
}

function NotificationBell({ lang, onNavigate }) {
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    try { const d = await api.getNotifications(); setNotifs(d.notifications || []); } catch {}
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 10000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const handleClick = async (n) => {
    if (!n.read) {
      try { await api.markNotificationRead(n.id); } catch {}
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    }
    setOpen(false);
    if (onNavigate) onNavigate(n.type, n.relatedId);
  };

  const markAll = async () => {
    try { await api.markAllNotificationsRead(); } catch {}
    setNotifs(prev => prev.map(x => ({ ...x, read: true })));
  };

  const iconFor = (type) => {
    const icons = {
      NURSE_APPLIED:   { bg:'#EFF6FF', color:'#2563EB', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
      NURSE_ASSIGNED:  { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
      JOB_ASSIGNED:    { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
      JOB_UPDATED:     { bg:'#FEF3C7', color:'#D97706', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
      NURSE_ON_WAY:    { bg:'#EFF6FF', color:'#2563EB', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
      NURSE_ARRIVED:   { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> },
      VISIT_COMPLETED: { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
      VISIT_CANCELLED: { bg:'#FEF2F2', color:'#DC2626', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
      NEW_JOB:         { bg:'#EDE9FE', color:'#7C3AED', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
      announcement:    { bg:'#F1F5F9', color:'#475569', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
    };
    const cfg = icons[type] || icons.announcement;
    return <div style={{ width:32, height:32, borderRadius:9, background:cfg.bg, color:cfg.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{cfg.svg}</div>;
  };

  const timeAgo = (d) => {
    const s = Math.floor((Date.now() - new Date(d)) / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s/60)}m`;
    if (s < 86400) return `${Math.floor(s/3600)}h`;
    return `${Math.floor(s/86400)}d`;
  };

  // Parse notification message — may be JSON with { text, actorName, actorPhoto }
  const parseNotif = (n) => {
    let text = n.message, actorName = null, actorPhoto = null;
    try { const p = JSON.parse(n.message); text = p.text || n.message; actorName = p.actorName; actorPhoto = p.actorPhoto; } catch {}
    return { text, actorName, actorPhoto };
  };
  const nt = (type, field) => {
    const map = t(lang, `notifications.types.${type}`);
    if (map && typeof map === 'object') return map[field] || '';
    return '';
  };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => { setOpen(o => !o); }}
        style={{ position:'relative', width:36, height:36, borderRadius:9, border:`1px solid ${C.border}`, background:open ? C.bgSubtle : C.bgWhite, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary, flexShrink:0 }}
        aria-label="Notifications"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:'#EF4444', border:`1.5px solid ${C.bgWhite}` }} />
        )}
      </button>

      {open && (
        <div style={{ position:'absolute', top:42, right:0, width:'min(320px, calc(100vw - 32px))', background:C.bgWhite, borderRadius:14, boxShadow:'0 8px 30px rgba(15,23,42,0.12)', border:`1px solid ${C.border}`, zIndex:9999, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'14px 16px 10px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>{t(lang,'notifications.header')} {unread > 0 && <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:99, background:C.primaryLight, color:C.primary, marginLeft:6 }}>{unread}</span>}</div>
            {unread > 0 && <button onClick={markAll} style={{ fontSize:11, fontWeight:600, color:C.primary, background:'none', border:'none', cursor:'pointer', padding:0 }}>{t(lang,'notifications.markAllRead')}</button>}
          </div>

          {/* List */}
          <div style={{ maxHeight:320, overflowY:'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding:'28px 16px', textAlign:'center', color:C.textTertiary, fontSize:13 }}>
                {t(lang,'notifications.empty')}
              </div>
            ) : notifs.map(n => {
              const { text: parsedMsg, actorName, actorPhoto } = parseNotif(n);
              // Prefer DB title (has actor name) over generic translation, fall back to translation
              const title = n.title || nt(n.type,'title');
              const message = n.type === 'announcement' ? parsedMsg : parsedMsg;
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{ padding:'12px 16px', borderBottom:`1px solid ${C.borderSubtle}`, cursor:'pointer', background:n.read ? 'transparent' : C.primaryLight, display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bgSubtle}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : C.primaryLight}
                >
                  {actorPhoto ? (
                    <img src={actorPhoto} alt={actorName||''} style={{ width:32, height:32, borderRadius:9, objectFit:'cover', flexShrink:0, border:'1.5px solid #E2E8F0' }} />
                  ) : actorName ? (
                    <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#2563EB,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>
                      {actorName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                  ) : iconFor(n.type)}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:n.read ? 500 : 700, color:C.textPrimary, marginBottom:2, lineHeight:1.3 }}>{title}</div>
                    <div style={{ fontSize:12, color:C.textSecondary, lineHeight:1.4, marginBottom:4 }}>{message}</div>
                    <div style={{ fontSize:11, color:C.textTertiary }}>{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.read && <div style={{ width:6, height:6, borderRadius:'50%', background:C.primary, flexShrink:0, marginTop:6 }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ClientCalendar({ visits=[], lang='en', onBook, onViewVisits }) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);

  const visitsByDate = {};
  visits.forEach(v => {
    if (!v.scheduledAt) return;
    const d = new Date(v.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!visitsByDate[key]) visitsByDate[key] = [];
    visitsByDate[key].push(v);
  });

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const startOffset = firstDow === 0 ? 6 : firstDow - 1;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const MONTHS = lang==='sq'
    ? ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DOW = lang==='sq' ? ['Hë','Ma','Më','En','Pr','Sh','Di'] : ['Mo','Tu','We','Th','Fr','Sa','Su'];

  const dayKey = (d) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const selectedKey = selectedDay ? dayKey(selectedDay) : null;
  const selectedVisits = selectedKey ? (visitsByDate[selectedKey]||[]) : [];

  const statusDot = (s) => {
    if (!s) return '#94A3B8';
    s = s.toUpperCase();
    if (s==='COMPLETED') return '#22C55E';
    if (s==='CANCELLED') return '#EF4444';
    return '#2563EB';
  };
  const statusLabel = (s) => {
    const m = { UNASSIGNED: lang==='sq'?'Pa infermiere':'Unassigned', SCHEDULED: lang==='sq'?'Planifikuar':'Scheduled', IN_PROGRESS: lang==='sq'?'Në progres':'In Progress', COMPLETED: lang==='sq'?'Kompletuar':'Completed', CANCELLED: lang==='sq'?'Anuluar':'Cancelled' };
    return m[s] || s;
  };

  return (
    <div style={{ background:C.bgWhite, borderRadius:18, border:`1.5px solid ${C.border}`, overflow:'hidden', boxShadow:SSM }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${C.border}`, background:'linear-gradient(135deg,#F8FAFF,#F0F7FF)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:10, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="15" height="15" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.2px' }}>{MONTHS[month]} {year}</div>
            <div style={{ fontSize:11, color:C.textTertiary, marginTop:1 }}>{lang==='sq'?'Vizitat tuaja':'Your visits this month'}</div>
          </div>
        </div>
        <button onClick={onViewVisits} style={{ fontSize:12, fontWeight:700, color:C.primary, background:C.primaryLight, border:'none', borderRadius:9, padding:'6px 13px', cursor:'pointer', fontFamily:F }}>
          {lang==='sq'?'Shiko të gjitha':'View all →'}
        </button>
      </div>

      <div style={{ padding:'14px 16px' }}>
        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:6 }}>
          {DOW.map(d => <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:C.textTertiary, padding:'2px 0' }}>{d}</div>)}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`}/>;
            const key = dayKey(d);
            const dayVisits = visitsByDate[key]||[];
            const isToday = key === todayStr;
            const isSelected = d === selectedDay;
            const hasPending = dayVisits.some(v=>['SCHEDULED','UNASSIGNED','IN_PROGRESS'].includes(v.status));
            const hasDone = dayVisits.some(v=>v.status==='COMPLETED');
            const hasCancelled = dayVisits.some(v=>v.status==='CANCELLED') && !hasPending && !hasDone;

            return (
              <button key={key} onClick={()=>setSelectedDay(d===selectedDay?null:d)}
                style={{
                  aspectRatio:'1', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  borderRadius:10, border:'none', fontFamily:F, gap:2,
                  background: isSelected?C.primary : isToday?C.primaryLight : 'transparent',
                  cursor: dayVisits.length?'pointer':'default',
                  outline: isToday && !isSelected ? `2px solid ${C.primary}` : 'none', outlineOffset:'-2px',
                }}>
                <span style={{ fontSize:12, fontWeight:isToday||isSelected?800:400, color:isSelected?'#fff':isToday?C.primary:C.textPrimary, lineHeight:1 }}>{d}</span>
                {dayVisits.length > 0 && (
                  <div style={{ display:'flex', gap:2 }}>
                    {hasPending && <div style={{ width:4, height:4, borderRadius:'50%', background:isSelected?'rgba(255,255,255,0.8)':'#2563EB' }}/>}
                    {hasDone && <div style={{ width:4, height:4, borderRadius:'50%', background:isSelected?'rgba(255,255,255,0.8)':'#22C55E' }}/>}
                    {hasCancelled && <div style={{ width:4, height:4, borderRadius:'50%', background:isSelected?'rgba(255,255,255,0.8)':'#EF4444' }}/>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', gap:14, marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
          {[['#2563EB', lang==='sq'?'Aktive':'Active'], ['#22C55E', lang==='sq'?'Kryer':'Done'], ['#EF4444', lang==='sq'?'Anuluar':'Cancelled']].map(([col,lbl])=>(
            <div key={lbl} style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:col }}/>
              <span style={{ fontSize:10, color:C.textTertiary, fontWeight:500 }}>{lbl}</span>
            </div>
          ))}
          <div style={{ marginLeft:'auto' }}>
            <button onClick={onBook} style={{ fontSize:11, fontWeight:700, color:'#fff', background:C.primary, border:'none', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', gap:5 }}>
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {lang==='sq'?'Rezervo':'Book Visit'}
            </button>
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div style={{ marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.textSecondary, marginBottom:8 }}>
              {new Date(`${year}-${String(month+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}T12:00:00`).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'long',day:'numeric',month:'long'})}
            </div>
            {selectedVisits.length === 0 ? (
              <div style={{ fontSize:12, color:C.textTertiary, textAlign:'center', padding:'10px 0' }}>
                {lang==='sq'?'Asnjë vizitë planifikuar':'No visits scheduled'}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {selectedVisits.map(v => {
                  const d = new Date(v.scheduledAt);
                  const time = d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
                  const dc = statusDot(v.status);
                  const svc = (()=>{const s=SERVICES_MAP.find(x=>x.en===v.serviceType);return lang==='sq'&&s?s.sq:v.serviceType;})();
                  return (
                    <div key={v.id} style={{ display:'flex', alignItems:'center', gap:10, background:'#F8FAFC', border:`1px solid ${C.border}`, borderRadius:11, padding:'10px 12px' }}>
                      <div style={{ width:3, height:36, borderRadius:2, background:dc, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2, flexWrap:'wrap' }}>
                          <span style={{ fontSize:12, fontWeight:800, color:C.textPrimary }}>{svc}</span>
                          <span style={{ fontSize:10, fontWeight:700, color:'#64748B', background:'#F1F5F9', borderRadius:5, padding:'1px 6px', flexShrink:0 }}>#{v.workOrderNumber?.slice(-6)||v.id?.slice(-6)?.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize:11, color:C.textTertiary }}>{time} · {v.nurse?.user?.name||(lang==='sq'?'Infermiere TBC':'Nurse TBC')}</div>
                      </div>
                      <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:99, background:dc+'18', color:dc, flexShrink:0 }}>{statusLabel(v.status)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Overview({ user, visits, relative, lang, onBook, onViewVisits, onViewNextVisit }) {
  const tr = (key) => t(lang, key);
  const upcoming = visits.filter(v=>!['COMPLETED','CANCELLED'].includes(v.status));
  const completed = visits.filter(v=>v.status==='COMPLETED');
  const next = upcoming[0], last = completed[0];
  const sub = user?.subscription || { plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:0 };
  const planLabel = (sub?.plan||'standard').charAt(0).toUpperCase()+(sub?.plan||'standard').slice(1);
  const usedPct = sub?.visitsPerMonth >= 999 ? 0 : Math.min(100, Math.round(((sub?.visitsUsed||0) / (sub?.visitsPerMonth||2)) * 100));
  const visitsLeft = sub?.visitsPerMonth >= 999 ? null : Math.max(0, (sub?.visitsPerMonth||2) - (sub?.visitsUsed||0));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <style>{`
        .ov-next:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(37,99,235,0.35) !important; }
        .ov-next { transition:transform 0.15s, box-shadow 0.15s; }
        .ov-action:hover { opacity:0.87 !important; transform:translateY(-1px); }
        .ov-action { transition:opacity 0.15s, transform 0.15s; }
        .ov-stat:hover { border-color:#2563EB !important; transform:translateY(-2px); }
        .ov-stat { transition:border-color 0.15s, transform 0.15s; }
      `}</style>

      {/* ── Next Visit banner ── */}
      {next ? (
        <div className="ov-next" onClick={()=>(onViewNextVisit||onViewVisits)(next)} style={{ background:'linear-gradient(135deg,#1D4ED8 0%,#2563EB 60%,#3B82F6 100%)', borderRadius:18, padding:'22px 24px', color:'#fff', boxShadow:'0 4px 16px rgba(37,99,235,0.25)', cursor:'pointer', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.06, pointerEvents:'none' }}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="og" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#og)"/></svg>
          </div>
          <div style={{ position:'absolute', bottom:-30, right:-30, width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div style={{ flex:1, minWidth:150 }}>
              <div style={{ fontSize:10, fontWeight:700, opacity:.65, letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:4 }}>{tr('dashboard.nextVisit')}</div>
              <div style={{ fontSize:17, fontWeight:800, marginBottom:3, letterSpacing:'-0.3px' }}>
                {new Date(next.scheduledAt).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'long',day:'numeric',month:'long'})} · {new Date(next.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
              </div>
              <div style={{ fontSize:12, opacity:.78 }}>{next.nurse?.user?.name||tr('dashboard.nurseTBCLabel')} · {(()=>{const s=SERVICES_MAP.find(x=>x.en===next.serviceType);return lang==='sq'&&s?s.sq:next.serviceType;})()}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <Badge s={next.status} lang={lang} />
              <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:12, opacity:.75 }}>
                <span>{lang==='sq'?'Shiko':'View'}</span>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background:C.primaryLight, border:`1.5px dashed rgba(37,99,235,0.3)`, borderRadius:18, padding:'22px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:C.bgWhite, border:`1px solid rgba(37,99,235,0.15)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.primary, marginBottom:3 }}>{tr('dashboard.noUpcomingVisits')}</div>
              <div style={{ fontSize:13, color:C.textSecondary }}>{tr('dashboard.bookNurseDesc')}</div>
            </div>
          </div>
          <button onClick={onBook} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:11, padding:'11px 20px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:F, flexShrink:0 }}>{tr('dashboard.bookVisitBtn')}</button>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12 }}>

        {/* Plan */}
        <div className="ov-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM }}>
          <div style={{ width:34, height:34, borderRadius:10, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <svg width="16" height="16" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:5 }}>{tr('dashboard.plan')}</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.primary, letterSpacing:'-0.5px', lineHeight:1 }}>{planLabel}</div>
          <div style={{ fontSize:11, color:C.textTertiary, marginTop:5, fontWeight:500 }}>{sub?.status||'Active'}</div>
        </div>

        {/* Visits used */}
        <div className="ov-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'#F0FDF4', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <svg width="16" height="16" fill="none" stroke={C.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:5 }}>{tr('dashboard.visitsUsed')}</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', lineHeight:1 }}>
            {sub?.visitsPerMonth>=999 ? '∞' : `${sub?.visitsUsed||0}/${sub?.visitsPerMonth||2}`}
          </div>
          {sub?.visitsPerMonth < 999 ? (
            <div style={{ marginTop:8 }}>
              <div style={{ height:4, borderRadius:99, background:C.bgSubtle, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:99, width:`${usedPct}%`, background:usedPct>=100?C.error:C.secondary, transition:'width 0.4s' }}/>
              </div>
              <div style={{ fontSize:10, color:C.textTertiary, marginTop:4 }}>{visitsLeft} {lang==='sq'?'mbetur':'remaining'}</div>
            </div>
          ) : (
            <div style={{ fontSize:11, color:C.secondary, marginTop:5, fontWeight:600 }}>Unlimited</div>
          )}
        </div>

        {/* Completed */}
        <div className="ov-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM }}>
          <div style={{ width:34, height:34, borderRadius:10, background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <svg width="16" height="16" fill="none" stroke={C.secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:5 }}>{tr('dashboard.completed')}</div>
          <div style={{ fontSize:20, fontWeight:800, color:C.secondary, letterSpacing:'-0.5px', lineHeight:1 }}>{completed.length}</div>
          <div style={{ fontSize:11, color:C.textTertiary, marginTop:5 }}>{lang==='sq'?'gjithsej':'total visits'}</div>
        </div>

        {/* Last BP */}
        <div className="ov-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM }}>
          <div style={{ width:34, height:34, borderRadius:10, background:last?.bpSystolic?'#FEF3C7':C.bgSubtle, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <svg width="16" height="16" fill="none" stroke={last?.bpSystolic?C.warning:C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:5 }}>{tr('dashboard.lastBP')}</div>
          <div style={{ fontSize:20, fontWeight:800, color:last?.bpSystolic?C.warning:C.textTertiary, letterSpacing:'-0.5px', lineHeight:1 }}>
            {last?.bpSystolic?`${last.bpSystolic}/${last.bpDiastolic}`:'—'}
          </div>
          <div style={{ fontSize:11, color:C.textTertiary, marginTop:5 }}>{last?.bpSystolic?'mmHg':(lang==='sq'?'pa të dhëna':'no data yet')}</div>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <button className="ov-action" onClick={onBook} style={{ flex:1, minWidth:120, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'13px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, boxShadow:'0 4px 12px rgba(37,99,235,0.2)' }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          {tr('dashboard.bookVisitBtn')}
        </button>
        <button className="ov-action" onClick={onViewVisits} style={{ flex:1, minWidth:120, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:C.bgWhite, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {lang==='sq'?'Vizitat e Mia':'My Visits'}
        </button>
      </div>

      {/* ── Client Calendar ── */}
      <ClientCalendar visits={visits} lang={lang} onBook={onBook} onViewVisits={onViewVisits} />

      {/* ── Loved one card ── */}
      {relative && (
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:SSM }}>
          {/* Header */}
          <div style={{ padding:'18px 20px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:50, height:50, borderRadius:14, background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(37,99,235,0.25)' }}>
              <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>{(relative.name||'?').charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:800, color:C.textPrimary, marginBottom:6, letterSpacing:'-0.3px' }}>{relative.name}</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {relative.city && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.primaryLight, color:C.primary }}>{relative.city}</span>}
                {relative.age && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.bgSubtle, color:C.textSecondary }}>{relative.age} {lang==='sq'?'vjeç':'yrs'}</span>}
              </div>
            </div>
            <span style={{ fontSize:11, fontWeight:700, padding:'5px 13px', borderRadius:99, background:C.secondaryLight, color:C.secondary, flexShrink:0, border:`1px solid rgba(5,150,105,0.2)` }}>{tr('dashboard.activeCare')}</span>
          </div>

          {/* Address — full width */}
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textTertiary, marginBottom:5 }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('dashboard.address')}</span>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{relative.address||'—'}</div>
          </div>

          {/* 2-col info grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
            {/* Assigned Nurse */}
            <div style={{ padding:'14px 20px', borderRight:`1px solid ${C.borderSubtle}`, borderBottom:`1px solid ${C.borderSubtle}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textTertiary, marginBottom:5 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('dashboard.assignedNurse')}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color: next?.nurse?.user?.name ? C.secondary : C.textTertiary }}>
                {next?.nurse?.user?.name || tr('dashboard.beingAssigned')}
              </div>
            </div>
            {/* Completed visits */}
            <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textTertiary, marginBottom:5 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{lang==='sq'?'Vizita Kompletuar':'Completed Visits'}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.secondary }}>{completed.length}</div>
            </div>
            {/* Last visit */}
            <div style={{ padding:'14px 20px', borderRight:`1px solid ${C.borderSubtle}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textTertiary, marginBottom:5 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{lang==='sq'?'Vizita e Fundit':'Last Visit'}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color: last ? C.textPrimary : C.textTertiary }}>
                {last ? new Date(last.scheduledAt).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—'}
              </div>
            </div>
            {/* Upcoming */}
            <div style={{ padding:'14px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, color:C.textTertiary, marginBottom:5 }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{lang==='sq'?'Të Ardhshme':'Upcoming'}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color: upcoming.length > 0 ? C.primary : C.textTertiary }}>
                {upcoming.length > 0 ? `${upcoming.length} ${lang==='sq'?'planifikuar':'scheduled'}` : (lang==='sq'?'Asnjë':'None')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookVisit({ relatives=[], subscription, onSuccess, onCancel, lang='en' }) {
  const tr = (key) => t(lang, key);
  const serviceLabel = (en) => { const s = SERVICES_MAP.find(x => x.en === en); return lang === 'sq' && s ? s.sq : en; };
  const [selectedRelativeId, setSelectedRelativeId] = useState(relatives[0]?.id || null);
  const relative = relatives.find(r => r.id === selectedRelativeId) || relatives[0] || null;
  const [form, setForm] = useState({ serviceType: SERVICES[0], scheduledAt: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async () => {
    if (loading || submitted) return; // prevent double submit
    if (!form.scheduledAt) return setError(tr('dashboard.bookSelectDate'));
    if (!relative) return setError(tr('dashboard.bookAddLovedFirst'));
    setLoading(true); setSubmitted(true); setError('');
    try {
      const data = await api.createVisit({ relativeId: relative.id, serviceType: form.serviceType, scheduledAt: form.scheduledAt, notes: form.notes });
      onSuccess(data?.visit || data);
    } catch (err) {
      setError(err.message || tr('dashboard.bookFailed'));
      setSubmitted(false); // allow retry on error
    } finally { setLoading(false); }
  };

  const isDisabled = loading || !relative || (subscription && subscription.visitsPerMonth < 999 && subscription.visitsUsed >= subscription.visitsPerMonth);

  return (
    <div style={{ background:'#fff', borderRadius:24, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 8px 32px rgba(0,0,0,0.10)', maxWidth:520 }}>
      <style>{`
        .bv-inp:focus { border-color:#2563EB !important; box-shadow:0 0 0 3px rgba(37,99,235,0.1) !important; outline:none; }
        .bv-svc:hover { border-color:#2563EB !important; background:#F8FAFF !important; }
      `}</style>

      {/* Gradient header */}
      <div style={{ background:'linear-gradient(145deg,#0F4C8A 0%,#2563EB 60%,#6366F1 100%)', padding:'24px 24px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.07, pointerEvents:'none' }}>
          <svg width="100%" height="100%"><defs><pattern id="bv-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#bv-dots)"/></svg>
        </div>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.3px' }}>{tr('dashboard.bookVisitTitle')}</div>
            </div>
            {relative && (
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                <svg width="12" height="12" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>{relative.name} · {relative.city}</span>
              </div>
            )}
            {subscription && (
              subscription.visitsPerMonth >= 999
                ? <span style={{ fontSize:11, fontWeight:700, color:'#6EE7B7', background:'rgba(110,231,183,0.15)', padding:'3px 10px', borderRadius:99, border:'1px solid rgba(110,231,183,0.3)' }}>⚡ Unlimited visits</span>
                : <span style={{ fontSize:11, fontWeight:700, color: subscription.visitsUsed >= subscription.visitsPerMonth ? '#FCA5A5':'#6EE7B7', background:'rgba(255,255,255,0.12)', padding:'3px 10px', borderRadius:99 }}>
                    {subscription.visitsPerMonth - subscription.visitsUsed} {lang==='sq'?'vizita mbetur':'visits remaining'}
                  </span>
            )}
          </div>
          <button onClick={onCancel} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:9, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:15, flexShrink:0 }}>✕</button>
        </div>
      </div>

      {/* Form body */}
      <div style={{ padding:'22px 24px 24px', display:'flex', flexDirection:'column', gap:16 }}>

        {/* Relative picker — shown only when there are multiple family members */}
        {relatives.length > 1 && (
          <div>
            <label style={{ fontSize:11, fontWeight:800, color:'#64748B', display:'block', marginBottom:7, letterSpacing:'0.6px', textTransform:'uppercase' }}>
              {lang==='sq' ? 'ANËTAR I FAMILJES' : 'FAMILY MEMBER'}
            </label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {relatives.map(rel => {
                const selected = rel.id === (relative?.id);
                return (
                  <button
                    key={rel.id}
                    onClick={() => setSelectedRelativeId(rel.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'9px 14px', borderRadius:12,
                      border: selected ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                      background: selected ? '#EFF6FF' : '#fff',
                      color: selected ? '#2563EB' : '#374151',
                      fontFamily:F, fontSize:13, fontWeight: selected ? 700 : 500,
                      cursor:'pointer', transition:'all 0.15s',
                      boxShadow: selected ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none'
                    }}
                  >
                    <div style={{ width:28, height:28, borderRadius:99, background: selected ? '#2563EB' : '#E5E7EB', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="14" height="14" fill="none" stroke={selected ? '#fff' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <div style={{ lineHeight:1.2 }}>{rel.name}</div>
                      <div style={{ fontSize:11, fontWeight:400, color: selected ? '#3B82F6' : '#9CA3AF', lineHeight:1.1 }}>{rel.city}</div>
                    </div>
                    {selected && (
                      <svg width="13" height="13" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Service type */}
        <div>
          <label style={{ fontSize:11, fontWeight:800, color:'#64748B', display:'block', marginBottom:7, letterSpacing:'0.6px', textTransform:'uppercase' }}>{tr('dashboard.bookServiceType')}</label>
          <select className="bv-svc" style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid #E2E8F0', fontSize:14, color:C.textPrimary, background:'#fff', fontFamily:F, cursor:'pointer', transition:'border-color 0.15s, background 0.15s', boxSizing:'border-box', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center' }}
            value={form.serviceType} onChange={e=>setForm({...form, serviceType:e.target.value})}>
            {SERVICES_MAP.map(s=><option key={s.en} value={s.en}>{lang==='sq' ? s.sq : s.en}</option>)}
          </select>
        </div>

        {/* Date & time */}
        <div>
          <label style={{ fontSize:11, fontWeight:800, color:'#64748B', display:'block', marginBottom:7, letterSpacing:'0.6px', textTransform:'uppercase' }}>{tr('dashboard.bookDateTime')}</label>
          <input className="bv-inp" type="datetime-local"
            style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid #E2E8F0', fontSize:14, color:C.textPrimary, background:'#fff', fontFamily:F, boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' }}
            value={form.scheduledAt} onChange={e=>setForm({...form, scheduledAt:e.target.value})} min={toLocalDT(new Date().toISOString())} />
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize:11, fontWeight:800, color:'#64748B', display:'block', marginBottom:7, letterSpacing:'0.6px', textTransform:'uppercase' }}>
            {tr('dashboard.bookNotes')} <span style={{ fontWeight:500, textTransform:'none', letterSpacing:0, color:'#94A3B8' }}>({tr('dashboard.bookNotesOpt')})</span>
          </label>
          <textarea className="bv-inp"
            style={{ width:'100%', padding:'11px 14px', borderRadius:11, border:'1.5px solid #E2E8F0', fontSize:14, color:C.textPrimary, background:'#fff', fontFamily:F, boxSizing:'border-box', height:88, resize:'vertical', transition:'border-color 0.15s, box-shadow 0.15s' }}
            value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder={tr('dashboard.bookNotesPh')} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#DC2626', display:'flex', alignItems:'center', gap:8 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        {/* Info banner */}
        <div style={{ background:'linear-gradient(135deg,#FFFBEB,#FEF9C3)', border:'1px solid #FDE68A', borderRadius:11, padding:'11px 14px', display:'flex', gap:9, alignItems:'flex-start' }}>
          <svg width="15" height="15" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ fontSize:12, color:'#92400E', lineHeight:1.55 }}>{tr('dashboard.bookAfterInfo').replace('{city}', relative?.city || '')}</span>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:10, marginTop:2 }}>
          <button onClick={onCancel} style={{ flex:1, background:'transparent', color:'#64748B', border:'1.5px solid #E2E8F0', borderRadius:12, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:F }}>
            {tr('dashboard.cancel')}
          </button>
          <button onClick={handleSubmit} disabled={isDisabled}
            style={{ flex:2, background: isDisabled ? '#94A3B8' : 'linear-gradient(135deg,#2563EB,#4F46E5)', color:'#fff', border:'none', borderRadius:12, padding:'13px', fontSize:14, fontWeight:800, cursor:isDisabled?'not-allowed':'pointer', fontFamily:F, boxShadow: isDisabled?'none':'0 4px 14px rgba(37,99,235,0.3)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'box-shadow 0.15s' }}>
            {loading
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 0.8s linear infinite' }}><path d="M12 2a10 10 0 0110 10"/><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/></svg>{tr('dashboard.booking')}</>
              : <>{tr('dashboard.bookVisitBtn')} <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingConfirmation({ visit, onClose, onViewApplicants, lang='en' }) {
  const serviceLabel = (en) => { const s = SERVICES_MAP.find(x => x.en === en); return lang === 'sq' && s ? s.sq : en; };
  const dt = visit?.scheduledAt ? new Date(visit.scheduledAt) : null;
  const dateStr = dt ? dt.toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : '';
  const timeStr = dt ? dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : '';
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(visit.workOrderNumber).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.7)', backdropFilter:'blur(6px)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <style>{`
        @keyframes bc-pop { from { opacity:0; transform:scale(0.92) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes bc-ring { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.55);opacity:0} }
        @keyframes bc-check { from{stroke-dashoffset:30} to{stroke-dashoffset:0} }
      `}</style>
      <div style={{ background:'#fff', borderRadius:28, maxWidth:420, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.28)', overflow:'hidden', animation:'bc-pop 0.28s cubic-bezier(0.34,1.56,0.64,1) both' }}>

        {/* ── Header ── */}
        <div style={{ background:'linear-gradient(145deg,#0F4C8A 0%,#1D6FD4 55%,#22C55E 100%)', padding:'36px 28px 28px', textAlign:'center', position:'relative', overflow:'hidden' }}>
          {/* Dot-grid texture */}
          <div style={{ position:'absolute', inset:0, opacity:0.07, pointerEvents:'none' }}>
            <svg width="100%" height="100%"><defs><pattern id="bc-dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#bc-dots)"/></svg>
          </div>
          {/* Glow orbs */}
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'rgba(34,197,94,0.25)', filter:'blur(50px)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-30, left:-20, width:140, height:140, borderRadius:'50%', background:'rgba(29,111,212,0.3)', filter:'blur(40px)', pointerEvents:'none' }}/>

          {/* Animated checkmark */}
          <div style={{ position:'relative', width:72, height:72, margin:'0 auto 18px' }}>
            {/* Pulse ring */}
            <div style={{ position:'absolute', inset:-8, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.35)', animation:'bc-ring 2s ease-in-out infinite' }}/>
            <div style={{ width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'2px solid rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:1 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" strokeDasharray="30" strokeDashoffset="0" style={{ animation:'bc-check 0.5s ease 0.2s both' }}/>
              </svg>
            </div>
          </div>

          <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:6, position:'relative', zIndex:1 }}>
            {lang==='sq'?'Vizita u rezervua!':'Visit Booked!'}
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.5, position:'relative', zIndex:1 }}>
            {lang==='sq'?'Infermierët pranë jush do të aplikojnë së shpejti.':'Nurses near you will apply shortly.'}
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding:'24px 24px 28px' }}>

          {/* Work order banner */}
          {visit?.workOrderNumber && (
            <button onClick={copy} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)', border:'1.5px solid rgba(37,99,235,0.15)', borderRadius:14, padding:'14px 18px', marginBottom:18, cursor:'pointer', fontFamily:F, textAlign:'left' }}>
              <div>
                <div style={{ fontSize:9, fontWeight:800, color:'#6B7280', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:4 }}>{lang==='sq'?'Nr. i Urdhrit':'Work Order'}</div>
                <div style={{ fontSize:22, fontWeight:900, color:C.primary, letterSpacing:'0.5px', fontFamily:'monospace' }}>{visit.workOrderNumber}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                {copied
                  ? <svg width="20" height="20" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="20" height="20" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                }
                <span style={{ fontSize:9, fontWeight:700, color: copied?'#22C55E':'#94A3B8' }}>{copied?'Copied!':'Copy'}</span>
              </div>
            </button>
          )}

          {/* Detail rows */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
            {[
              { icon:<svg width="15" height="15" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, bg:'#EFF6FF', label:lang==='sq'?'Shërbimi':'Service', value:serviceLabel(visit?.serviceType) },
              { icon:<svg width="15" height="15" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, bg:'#F5F3FF', label:lang==='sq'?'Data':'Date', value:dateStr },
              { icon:<svg width="15" height="15" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, bg:'#F5F3FF', label:lang==='sq'?'Ora':'Time', value:timeStr },
              { icon:<svg width="15" height="15" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, bg:'#FEF2F2', label:lang==='sq'?'Vendndodhja':'Location', value:visit?.relative?.city||visit?.relativeCity||(lang==='sq'?'Do konfirmohet':'To be confirmed') },
            ].map(({ icon, bg, label, value }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#F8FAFC', borderRadius:12, border:'1px solid #F1F5F9' }}>
                <div style={{ width:32, height:32, borderRadius:9, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:9, fontWeight:800, color:'#94A3B8', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:2 }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* What happens next */}
          <div style={{ background:'linear-gradient(135deg,#FFFBEB,#FEF9C3)', border:'1px solid #FDE68A', borderRadius:12, padding:'13px 16px', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <svg width="14" height="14" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontSize:12, fontWeight:800, color:'#92400E' }}>{lang==='sq'?'Çfarë ndodh tani?':'What happens next?'}</span>
            </div>
            <div style={{ fontSize:12, color:'#92400E', lineHeight:1.6 }}>
              {lang==='sq'?'Infermierët e kualifikuar do të aplikojnë. Do të njoftoheni kur dikush aplikojë — ju zgjidhni kë të caktoni.':'Qualified nurses will apply. You\'ll be notified when someone applies — then you choose who to assign.'}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <button onClick={()=>{ onClose(); onViewApplicants(visit); }}
              style={{ width:'100%', background:'linear-gradient(135deg,#2563EB,#4F46E5)', color:'#fff', border:'none', borderRadius:13, padding:'14px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:F, boxShadow:'0 4px 16px rgba(37,99,235,0.3)', letterSpacing:'-0.2px', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              {lang==='sq'?'Monitoroni Aplikimet':'Track Applicants'}
            </button>
            <button onClick={onClose}
              style={{ width:'100%', background:'transparent', color:'#64748B', border:'1.5px solid #E2E8F0', borderRadius:13, padding:'13px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
              {lang==='sq'?'Shko te Vizitat e Mia':'Go to My Visits'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Applicants({ visitId, visitInfo, onBack, onSelect, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getApplicants(visitId)
      .then(d => setApplicants(d.applications||[]))
      .catch(() => setError(tr('dashboard.failedLoadApplicants')))
      .finally(() => setLoading(false));
  }, [visitId]);

  const handleSelect = async (nurseId) => {
    setSelecting(nurseId);
    try {
      await api.selectNurse(visitId, nurseId);
      onSelect();
    } catch (err) {
      setError(err.message || tr('dashboard.failedSelectNurse'));
      setSelecting(null);
    }
  };

  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500, fontFamily:F }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {tr('dashboard.backToVisits')}
      </button>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'16px 20px', marginBottom:20, boxShadow:SSM }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{(() => { const s = SERVICES_MAP.find(x=>x.en===visitInfo?.serviceType); return lang==='sq'&&s?s.sq:visitInfo?.serviceType; })()}</div>
        <div style={{ fontSize:12, color:C.textTertiary, marginTop:3 }}>{visitInfo?.scheduledAt ? new Date(visitInfo.scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : ''}</div>
      </div>

      {loading && <div style={{ textAlign:'center', padding:40, color:C.textTertiary, fontSize:14 }}>{tr('dashboard.applicantsLoading')}</div>}
      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
      {!loading && applicants.length === 0 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'40px 24px', textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{tr('dashboard.noApplicants')}</div>
          <div style={{ fontSize:13, color:C.textSecondary }}>{tr('dashboard.noApplicantsSub')}</div>
        </div>
      )}
      {applicants.map(a => (
        <div key={a.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px', marginBottom:12, boxShadow:SSM }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:16 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:48, height:48, borderRadius:13, background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff', flexShrink:0, overflow:'hidden' }}>
                {a.nurse.profilePhotoUrl ? (
                  <img src={a.nurse.profilePhotoUrl} alt={a.nurse.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  (a.nurse.name||'N').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{a.nurse.name}</div>
                <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{a.nurse.city} · {tr('dashboard.licenseLabel')}: {a.nurse.licenseNumber||'Verified'}</div>
              </div>
            </div>
            <Badge s={a.status} lang={lang} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
            {[[tr('dashboard.ratingLabel'), a.nurse.rating>0?`${a.nurse.rating}/5`:tr('dashboard.newNurse'),''],[tr('dashboard.visitsApplicantLabel'), a.nurse.totalVisits||0,tr('dashboard.completedSub')],[tr('dashboard.experienceLabel'), a.nurse.experience||'—','']].map(([k,v,sub])=>(
              <div key={k} style={{ background:C.bg, borderRadius:9, padding:'10px 12px' }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase' }}>{k}</div>
                <div style={{ fontSize:16, fontWeight:800, color:C.textPrimary, marginTop:2 }}>{v}</div>
                {sub && <div style={{ fontSize:10, color:C.textTertiary }}>{sub}</div>}
              </div>
            ))}
          </div>
          {a.nurse.bio && <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65, marginBottom:16, padding:'12px 14px', background:C.bg, borderRadius:9 }}>{a.nurse.bio}</div>}
          {a.message && <div style={{ fontSize:13, color:C.textSecondary, fontStyle:'italic', marginBottom:16 }}>"{a.message}"</div>}
          {a.status === 'PENDING' && (
            <button onClick={()=>handleSelect(a.nurse.id)} disabled={selecting===a.nurse.id} style={{ width:'100%', background:C.secondary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:700, cursor:selecting===a.nurse.id?'not-allowed':'pointer', opacity:selecting===a.nurse.id?0.7:1, fontFamily:F }}>
              {selecting===a.nurse.id ? tr('dashboard.selecting') : `${a.nurse.name} →`}
            </button>
          )}
          {a.status === 'ACCEPTED' && <div style={{ background:C.secondaryLight, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.secondary, fontWeight:600, textAlign:'center' }}>{tr('dashboard.nurseSelected')}</div>}
        </div>
      ))}
    </div>
  );
}


// ── Edit Visit Modal ────────────────────────────────────────────────────────
function toLocalDT(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EditVisit({ visit, onSave, onCancel, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [form, setForm] = useState({
    serviceType: visit.serviceType || '',
    scheduledAt: toLocalDT(visit.scheduledAt),
    notes: visit.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:F, boxSizing:'border-box' };

  const handleSave = async () => {
    if (!form.serviceType || !form.scheduledAt) return setError(tr('dashboard.editRequired'));
    setLoading(true); setError('');
    try {
      await api.editVisit(visit.id, form);
      onSave();
    } catch (err) { setError(err.message || tr('dashboard.editFailed')); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:C.bgWhite, borderRadius:20, padding:28, maxWidth:480, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, marginBottom:4 }}>{tr('dashboard.editVisitTitle')}</div>
        <div style={{ fontSize:13, color:C.textTertiary, marginBottom:24 }}>{tr('dashboard.editVisitSub')}</div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('dashboard.bookServiceType')}</label>
          <select value={form.serviceType} onChange={e=>setForm(f=>({...f,serviceType:e.target.value}))} style={{...inp}}>
            <option value="">{tr('dashboard.selectService')}</option>
            {SERVICES_MAP.map(s=><option key={s.en} value={s.en}>{lang==='sq' ? s.sq : s.en}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('dashboard.bookDateTime')}</label>
          <input type="datetime-local" value={form.scheduledAt} onChange={e=>setForm(f=>({...f,scheduledAt:e.target.value}))} style={inp} />
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('dashboard.notesForNurse')}</label>
          <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder={tr('dashboard.specialInstructions')} style={{...inp, minHeight:80, resize:'vertical'}} />
        </div>
        {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'12px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', fontSize:14, fontWeight:600, cursor:'pointer', color:C.textSecondary }}>{tr('dashboard.cancel')}</button>
          <button onClick={handleSave} disabled={loading} style={{ flex:2, padding:'12px', borderRadius:10, border:'none', background:C.primary, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1, fontFamily:F }}>
            {loading ? tr('dashboard.saving') : tr('dashboard.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteConfirm({ visit, onConfirm, onCancel, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true); setError('');
    try {
      await api.deleteVisit(visit.id);
      onConfirm();
    } catch (err) { setError(err.message || tr('dashboard.deleteFailed')); setLoading(false); }
  };

  const svcLabel = (()=>{ const s = SERVICES_MAP.find(x=>x.en===visit.serviceType); return lang==='sq'&&s?s.sq:visit.serviceType; })();
  const dateStr = new Date(visit.scheduledAt).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{day:'numeric',month:'long',year:'numeric'});

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.65)', backdropFilter:'blur(5px)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e=>{ if(e.target===e.currentTarget) onCancel(); }}>
      <div style={{ background:'#fff', borderRadius:24, maxWidth:400, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', overflow:'hidden', animation:'fadeSlideIn 0.22s cubic-bezier(0.34,1.4,0.64,1) both' }}>
        {/* Red gradient header */}
        <div style={{ background:'linear-gradient(145deg,#7f1d1d 0%,#DC2626 55%,#EF4444 100%)', padding:'28px 24px 22px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.07, pointerEvents:'none' }}>
            <svg width="100%" height="100%"><defs><pattern id="del-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#del-dots)"/></svg>
          </div>
          <div style={{ position:'absolute', top:-25, right:-25, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
            </div>
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.3px', marginBottom:3 }}>{tr('dashboard.deleteVisitTitle')}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{svcLabel} · {dateStr}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 24px 24px' }}>
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:12, padding:'12px 16px', marginBottom:20, display:'flex', gap:10, alignItems:'flex-start' }}>
            <svg width="16" height="16" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span style={{ fontSize:13, color:'#991B1B', lineHeight:1.5 }}>{tr('dashboard.deleteCannotUndo')}</span>
          </div>

          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#DC2626', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onCancel} style={{ flex:1, padding:'12px', borderRadius:11, border:'1.5px solid #E2E8F0', background:'transparent', fontSize:14, fontWeight:700, cursor:'pointer', color:'#64748B', fontFamily:F }}>{tr('dashboard.cancel')}</button>
            <button onClick={handleDelete} disabled={loading} style={{ flex:1, padding:'12px', borderRadius:11, border:'none', background: loading?'#FCA5A5':'linear-gradient(135deg,#DC2626,#B91C1C)', color:'#fff', fontSize:14, fontWeight:800, cursor:loading?'not-allowed':'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
              {loading ? (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10"/></svg>{tr('dashboard.deleting')}</>
              ) : (
                <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>{tr('dashboard.delete')}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Visits({ visits, lang, onViewApplicants, onRefresh, viewingDetail: _viewingDetail, setViewingDetail: _setViewingDetail }) {
  const tr = (key) => t(lang, key);
  const serviceLabel = (en) => { const s = SERVICES_MAP.find(x => x.en === en); return lang === 'sq' && s ? s.sq : en; };
  const [_localViewingDetail, _setLocalViewingDetail] = useState(null);
  const viewingDetail = _viewingDetail !== undefined ? _viewingDetail : _localViewingDetail;
  const setViewingDetail = _setViewingDetail || _setLocalViewingDetail;
  const [reviewing, setReviewing] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewed, setReviewed] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState('all');

  const OPEN_STATUSES = ['UNASSIGNED','PENDING','ACCEPTED','NURSE_ON_WAY','NURSE_ARRIVED'];
  const FILTERS = [
    { id:'all',       label: lang==='sq' ? 'Të gjitha' : 'All' },
    { id:'open',      label: lang==='sq' ? 'Hapura'    : 'Open' },
    { id:'pending',   label: lang==='sq' ? 'Në pritje' : 'Pending' },
    { id:'completed', label: lang==='sq' ? 'Kompletuar': 'Completed' },
  ];

  const filteredVisits = visits.filter(v => {
    if (filter === 'all')       return true;
    if (filter === 'open')      return OPEN_STATUSES.includes(v.status);
    if (filter === 'pending')   return v.status === 'UNASSIGNED';
    if (filter === 'completed') return v.status === 'COMPLETED';
    return true;
  });

  const canEdit = (v) => v.status === 'UNASSIGNED';
  const canDelete = (v) => !['COMPLETED'].includes(v.status) && !['PENDING','ACCEPTED'].includes(v.status);

  const submitReview = async (visitId) => {
    if (!rating) return;
    setSubmitting(true); setReviewError('');
    try {
      await api.reviewVisit(visitId, { rating, comment });
      setReviewed(r => ({ ...r, [visitId]: rating }));
      setReviewing(null); setRating(0); setComment(''); setReviewError('');
    } catch (err) {
      console.error('Review error:', err);
      setReviewError(err.message || 'Failed to submit review. Please try again.');
    }
    finally { setSubmitting(false); }
  };

  if (!visits.length) return (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center', color:C.textTertiary }}>
      {tr('dashboard.noVisits')}
    </div>
  );
  return (
    <>
    {/* Filter tabs */}
    <div style={{ display:'flex', gap:6, marginBottom:16, background:C.bgSubtle, borderRadius:10, padding:4, width:'fit-content' }}>
      {FILTERS.map(f => {
        const count = f.id === 'all' ? visits.length
          : f.id === 'open'      ? visits.filter(v => OPEN_STATUSES.includes(v.status)).length
          : f.id === 'pending'   ? visits.filter(v => v.status === 'UNASSIGNED').length
          : visits.filter(v => v.status === 'COMPLETED').length;
        return (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, fontFamily: F,
            background: filter === f.id ? C.bgWhite : 'transparent',
            color: filter === f.id ? C.textPrimary : C.textTertiary,
            boxShadow: filter === f.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}>
            {f.label}
            {count > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, background: filter === f.id ? C.primaryLight : C.border, color: filter === f.id ? C.primary : C.textTertiary, borderRadius: 99, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {filteredVisits.length === 0 && (
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'36px 24px', textAlign:'center', color:C.textTertiary, fontSize:14 }}>
        {lang==='sq' ? 'Nuk ka vizita në këtë kategori.' : 'No visits in this category.'}
      </div>
    )}
    <style>{`
      .vc-card { transition: transform 0.15s, box-shadow 0.15s; }
      .vc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.10) !important; }
    `}</style>
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {filteredVisits.map(v=>{
        const statusMeta = {
          UNASSIGNED:  { bar:'#F59E0B', bg:'#FFFBEB' },
          SCHEDULED:   { bar:'#2563EB', bg:'#EFF6FF' },
          IN_PROGRESS: { bar:'#7C3AED', bg:'#F5F3FF' },
          COMPLETED:   { bar:'#22C55E', bg:'#F0FDF4' },
          CANCELLED:   { bar:'#EF4444', bg:'#FEF2F2' },
        };
        const sm = statusMeta[v.status] || { bar:'#94A3B8', bg:'#F8FAFC' };
        const dt = new Date(v.scheduledAt);
        const dateStr = dt.toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
        const timeStr = dt.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
        return (
        <div key={v.id} className="vc-card" style={{ background:'#fff', borderRadius:16, border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          {/* Coloured top bar */}
          <div style={{ height:4, background:`linear-gradient(90deg,${sm.bar},${sm.bar}88)` }}/>
          <div style={{ padding:'16px 18px' }}>
            {/* Top row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:5 }}>
                  <span style={{ fontSize:15, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.2px' }}>{serviceLabel(v.serviceType)}</span>
                  {v.workOrderNumber && (
                    <span style={{ fontSize:10, fontWeight:800, color:sm.bar, background:sm.bg, padding:'2px 9px', borderRadius:99, letterSpacing:'0.6px', fontFamily:'monospace', border:`1px solid ${sm.bar}22` }}>{v.workOrderNumber}</span>
                  )}
                </div>
                {/* Date / time / nurse row */}
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <svg width="11" height="11" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span style={{ fontSize:12, color:C.textTertiary, fontWeight:500 }}>{dateStr}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <svg width="11" height="11" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ fontSize:12, color:C.textTertiary, fontWeight:500 }}>{timeStr}</span>
                  </div>
                  {v.nurse?.user?.name && (
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      <svg width="11" height="11" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span style={{ fontSize:12, color:C.textTertiary, fontWeight:500 }}>{v.nurse.user.name}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Status + actions */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
                <Badge s={v.status} lang={lang}/>
                <div style={{ display:'flex', gap:6 }}>
                  {canEdit(v) && (
                    <button onClick={()=>setEditing(v)} style={{ fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.textSecondary, fontFamily:F }}>{tr('dashboard.edit')}</button>
                  )}
                  {canDelete(v) && (
                    <button onClick={()=>setDeleting(v)} style={{ fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:7, border:'1px solid #FECACA', background:'#FEF2F2', cursor:'pointer', color:'#DC2626', fontFamily:F }}>{tr('dashboard.delete')}</button>
                  )}
                </div>
              </div>
            </div>

            {/* Vitals strip */}
            {v.bpSystolic && (
              <div style={{ background:'#F8FAFC', borderRadius:10, padding:'10px 14px', display:'flex', gap:18, flexWrap:'wrap', marginBottom:10, border:'1px solid #F1F5F9' }}>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{t(lang,'visits.bloodPressure')}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#1E3A5F' }}>{v.bpSystolic}/{v.bpDiastolic} <span style={{ fontSize:10, fontWeight:500, color:C.textTertiary }}>mmHg</span></div>
                </div>
                {v.glucose && <div>
                  <div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{t(lang,'visits.glucose')}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#14532D' }}>{v.glucose} <span style={{ fontSize:10, fontWeight:500, color:C.textTertiary }}>mmol/L</span></div>
                </div>}
                {v.nurseNotes && <div style={{ width:'100%', borderTop:'1px solid #E2E8F0', paddingTop:8, marginTop:2, fontSize:12, color:C.textSecondary, fontStyle:'italic' }}>"{v.nurseNotes}"</div>}
              </div>
            )}

            {/* CTA buttons */}
            {v.status === 'UNASSIGNED' && (
              <button onClick={()=>onViewApplicants(v)} style={{ width:'100%', background:`linear-gradient(135deg,#EFF6FF,#F5F3FF)`, color:C.primary, border:`1.5px solid rgba(37,99,235,0.2)`, borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                {tr('dashboard.viewApplicants')}
              </button>
            )}
            {v.status === 'COMPLETED' && (
              <button onClick={()=>setViewingDetail(v)} style={{ width:'100%', background:'linear-gradient(135deg,#F0FDF4,#ECFDF5)', color:'#15803D', border:'1.5px solid rgba(34,197,94,0.2)', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginBottom:v.status==='COMPLETED'&&!v.review&&!reviewed[v.id]?8:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                {lang==='sq'?'Shiko Raportin e Plotë':'View Full Report'}
              </button>
            )}
            {v.status === 'COMPLETED' && !v.review && !reviewed[v.id] && (
              reviewing === v.id ? (
                <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:4 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>{tr('dashboard.rateNurse')}</div>
                  <div style={{ display:'flex', gap:4, marginBottom:10 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={()=>setRating(s)} style={{ fontSize:26, background:'none', border:'none', cursor:'pointer', color:s<=rating?'#F59E0B':'#D1D5DB', padding:'0 2px', transition:'color 0.1s' }}>★</button>
                    ))}
                  </div>
                  <input value={comment} onChange={e=>setComment(e.target.value)} placeholder={tr('dashboard.leaveComment')} style={{ width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:F, marginBottom:10, boxSizing:'border-box', outline:'none' }} />
                  {reviewError && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#DC2626', marginBottom:10 }}>{reviewError}</div>}
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>{ setReviewing(null); setReviewError(''); }} style={{ flex:1, padding:'10px', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', fontSize:13, cursor:'pointer', color:C.textSecondary, fontFamily:F }}>{tr('dashboard.cancel')}</button>
                    <button onClick={()=>submitReview(v.id)} disabled={!rating||submitting} style={{ flex:2, padding:'10px', borderRadius:9, border:'none', background:'linear-gradient(135deg,#2563EB,#4F46E5)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity:!rating||submitting?0.6:1, fontFamily:F }}>{submitting?tr('dashboard.submitting'):tr('dashboard.submitReview')}</button>
                  </div>
                </div>
              ) : (
                <button onClick={()=>{ setReviewing(v.id); setRating(0); setComment(''); }} style={{ width:'100%', marginTop:4, fontSize:12, fontWeight:700, color:'#D97706', background:'linear-gradient(135deg,#FFFBEB,#FEF3C7)', border:'1px solid #FDE68A', borderRadius:10, padding:'9px 14px', cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  ★ {tr('dashboard.rateVisit')}
                </button>
              )
            )}
            {(v.review || reviewed[v.id]) && v.status === 'COMPLETED' && (
              <div style={{ marginTop:6, fontSize:12, color:'#15803D', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
                <svg width="13" height="13" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {tr('dashboard.reviewed')}
              </div>
            )}
          </div>
        </div>
        );
      })}
    </div>
    {editing && <EditVisit visit={editing} onSave={()=>{ setEditing(null); onRefresh?.(); }} onCancel={()=>setEditing(null)} lang={lang} />}
    {deleting && <DeleteConfirm visit={deleting} onConfirm={()=>{ setDeleting(null); onRefresh?.(); }} onCancel={()=>setDeleting(null)} lang={lang} />}
    {viewingDetail && <VisitDetailModal visit={viewingDetail} lang={lang} onClose={()=>setViewingDetail(null)} />}
    </>
  );
}

// ── Visit Detail Modal ────────────────────────────────────────────────────────
function VisitDetailModal({ visit, lang, onClose }) {
  const tr = (key) => t(lang, key);
  const serviceLabel = (en) => { const s = SERVICES_MAP.find(x => x.en === en); return lang === 'sq' && s ? s.sq : en; };
  const hasVitals = visit.bpSystolic || visit.glucose || visit.heartRate || visit.oxygenSat || visit.temperature;

  const VitalCard = ({ label, value, unit, bg, col }) => (
    <div style={{ background:bg, borderRadius:11, padding:'14px 16px' }}>
      <div style={{ fontSize:10, fontWeight:700, color:col, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6, opacity:0.8 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, color:C.textTertiary, marginTop:4 }}>{unit}</div>
    </div>
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(2,6,23,0.65)', backdropFilter:'blur(5px)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.bgWhite, borderRadius:24, maxWidth:540, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.25)', maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Gradient header */}
        <div style={{ background:'linear-gradient(145deg,#1e3a5f 0%,#2563EB 60%,#4F46E5 100%)', padding:'26px 24px 22px', flexShrink:0, position:'relative', overflow:'hidden' }}>
          {/* Dot texture */}
          <div style={{ position:'absolute', inset:0, opacity:0.07, pointerEvents:'none' }}>
            <svg width="100%" height="100%"><defs><pattern id="vd-dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#vd-dots)"/></svg>
          </div>
          <div style={{ position:'absolute', top:-30, right:-30, width:130, height:130, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.55)', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:6 }}>{lang==='sq'?'Raport Vizite':'Visit Report'}</div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-0.4px', marginBottom:5 }}>{serviceLabel(visit.serviceType)}</div>
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {new Date(visit.scheduledAt).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric'})}
                </span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.75)', display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {new Date(visit.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
                </span>
                {visit.workOrderNumber && <span style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.9)', background:'rgba(255,255,255,0.15)', padding:'2px 9px', borderRadius:99, fontFamily:'monospace', border:'1px solid rgba(255,255,255,0.2)' }}>{visit.workOrderNumber}</span>}
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0, fontSize:15 }}>✕</button>
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY:'auto', padding:'20px 28px', flex:1 }}>

        {/* Patient */}
        {visit.relative && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>{lang==='sq'?'Pacienti':'Patient'}</div>
            <div style={{ background:C.bgSubtle, borderRadius:12, padding:'14px 16px', display:'flex', flexWrap:'wrap', gap:'10px 24px' }}>
              <div>
                <div style={{ fontSize:11, color:C.textTertiary, marginBottom:2 }}>{lang==='sq'?'Emri':'Name'}</div>
                <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>{visit.relative.name}</div>
              </div>
              {visit.relative.age && <div>
                <div style={{ fontSize:11, color:C.textTertiary, marginBottom:2 }}>{lang==='sq'?'Mosha':'Age'}</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{visit.relative.age}</div>
              </div>}
              {visit.relative.city && <div>
                <div style={{ fontSize:11, color:C.textTertiary, marginBottom:2 }}>{lang==='sq'?'Qyteti':'City'}</div>
                <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{visit.relative.city}</div>
              </div>}
              {visit.relative.address && <div style={{ flexBasis:'100%' }}>
                <div style={{ fontSize:11, color:C.textTertiary, marginBottom:2 }}>{lang==='sq'?'Adresa':'Address'}</div>
                <div style={{ fontSize:13, fontWeight:500, color:C.textSecondary }}>{visit.relative.address}</div>
              </div>}
            </div>
          </div>
        )}

        {/* Nurse */}
        {visit.nurse?.user && (
          <div style={{ background:C.bgSubtle, borderRadius:12, padding:'14px 16px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#2563EB,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', flexShrink:0, overflow:'hidden' }}>
              {visit.nurse.profilePhotoUrl
                ? <img src={visit.nurse.profilePhotoUrl} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                : (visit.nurse.user.name||'N').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>{visit.nurse.user.name}</div>
              <div style={{ fontSize:12, color:C.textTertiary }}>{lang==='sq'?'Infermiere Kujdestare':'Attending Nurse'}{visit.nurse.city ? ` · ${visit.nurse.city}` : ''}</div>
            </div>
            <div style={{ marginLeft:'auto' }}>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.secondaryLight, color:C.secondary }}>✓ {lang==='sq'?'Verifikuar':'Verified'}</span>
            </div>
          </div>
        )}

        {/* Booking Notes */}
        {visit.notes && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>{lang==='sq'?'Shënimet e Rezervimit':'Booking Notes'}</div>
            <div style={{ background:'#FFFBEB', borderRadius:11, padding:'14px 16px', fontSize:13, color:'#92400E', lineHeight:1.65, borderLeft:`3px solid #D97706` }}>
              {visit.notes}
            </div>
          </div>
        )}

        {/* Vitals */}
        {hasVitals && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:12 }}>{lang==='sq'?'Shenjat Vitale':'Vitals Recorded'}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {visit.bpSystolic && <VitalCard label={lang==='sq'?'Presioni Gjakut':'Blood Pressure'} value={`${visit.bpSystolic}/${visit.bpDiastolic}`} unit="mmHg" bg="#EFF6FF" col="#2563EB" />}
              {visit.glucose && <VitalCard label={lang==='sq'?'Glukoza':'Glucose'} value={visit.glucose} unit="mmol/L" bg="#ECFDF5" col="#059669" />}
              {visit.heartRate && <VitalCard label={lang==='sq'?'Rrahjet e Zemrës':'Heart Rate'} value={visit.heartRate} unit="bpm" bg="#FEF2F2" col="#DC2626" />}
              {visit.oxygenSat && <VitalCard label="SpO₂" value={`${visit.oxygenSat}%`} unit={lang==='sq'?'Saturimi i O₂':'Oxygen Saturation'} bg="#F5F3FF" col="#7C3AED" />}
              {visit.temperature && <VitalCard label={lang==='sq'?'Temperatura':'Temperature'} value={`${visit.temperature}°C`} unit="Celsius" bg="#FFFBEB" col="#D97706" />}
            </div>
          </div>
        )}

        {/* Nurse Notes */}
        {visit.nurseNotes && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:10 }}>{lang==='sq'?'Shënimet e Infermières':'Nurse Notes'}</div>
            <div style={{ background:C.bgSubtle, borderRadius:11, padding:'16px 18px', fontSize:13, color:C.textSecondary, lineHeight:1.75, fontStyle:'italic', borderLeft:`3px solid ${C.primary}` }}>
              "{visit.nurseNotes}"
            </div>
          </div>
        )}

        {/* No data fallback */}
        {!hasVitals && !visit.nurseNotes && (
          <div style={{ textAlign:'center', padding:'28px 20px', color:C.textTertiary, fontSize:13, background:C.bgSubtle, borderRadius:12, marginBottom:20 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.textTertiary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:10, display:'block', margin:'0 auto 10px' }}><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            {lang==='sq' ? 'Nuk janë regjistruar shenja vitale për këtë vizitë.' : 'No vitals were recorded for this visit.'}
          </div>
        )}

        </div>{/* end scrollable body */}

        {/* Sticky footer */}
        <div style={{ padding:'14px 24px', borderTop:`1px solid ${C.border}`, flexShrink:0, display:'flex', justifyContent:'space-between', alignItems:'center', background:'#F8FAFC' }}>
          <Badge s="COMPLETED" lang={lang} />
          <button onClick={onClose} style={{ fontSize:13, fontWeight:700, padding:'9px 22px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', color:C.textSecondary, fontFamily:F }}>
            {lang==='sq'?'Mbyll':'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Find Nurses ────────────────────────────────────────────────────────────────
function FindNurses({ lang, onBook }) {
  const tr = (key) => t(lang, key);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getPublicNurses()
      .then(d => setNurses(d.nurses || []))
      .catch(() => setError(tr('dashboard.failedLoadNurses')))
      .finally(() => setLoading(false));
  }, []);

  const CITIES = [...new Set(nurses.map(n => n.city).filter(Boolean))].sort();

  const filtered = nurses.filter(n => {
    const q = query.toLowerCase();
    const matchQ = !q || n.name.toLowerCase().includes(q) || (n.city||'').toLowerCase().includes(q) || (n.bio||'').toLowerCase().includes(q) || (n.specialties||[]).some(s=>s.toLowerCase().includes(q));
    const matchC = !cityFilter || n.city === cityFilter;
    return matchQ && matchC;
  });

  const stars = (rating) => {
    const r = Math.round(rating * 2) / 2;
    return [1,2,3,4,5].map(i => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i<=r?'#F59E0B':'#E5E7EB'} stroke={i<=r?'#F59E0B':'#D1D5DB'} strokeWidth="1" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ));
  };

  if (loading) return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}.fn-shimmer{background:linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%);background-size:600px 100%;animation:shimmer 1.4s infinite}`}</style>
      <div style={{ marginBottom:20, height:44, borderRadius:12 }} className="fn-shimmer"/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, overflow:'hidden' }}>
            <div style={{ height:76, marginBottom:0 }} className="fn-shimmer"/>
            <div style={{ padding:'16px 18px' }}>
              <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14, marginTop:'-28px' }}>
                <div style={{ width:54, height:54, borderRadius:14, flexShrink:0, border:'3px solid #fff', boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }} className="fn-shimmer"/>
                <div style={{ flex:1, marginTop:28 }}>
                  <div style={{ height:13, borderRadius:6, marginBottom:7, width:'65%' }} className="fn-shimmer"/>
                  <div style={{ height:10, borderRadius:6, width:'40%' }} className="fn-shimmer"/>
                </div>
              </div>
              <div style={{ height:10, borderRadius:6, width:'90%', marginBottom:6 }} className="fn-shimmer"/>
              <div style={{ height:10, borderRadius:6, width:'70%', marginBottom:16 }} className="fn-shimmer"/>
              <div style={{ height:36, borderRadius:10 }} className="fn-shimmer"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'16px 20px', fontSize:14, color:C.error }}>{error}</div>;

  return (
    <div>
      <style>{`.fn-card{transition:transform 0.18s,box-shadow 0.18s}.fn-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.11) !important}.fn-book:hover{background:linear-gradient(135deg,#1D4ED8,#4338CA) !important}`}</style>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="15" height="15" fill="none" stroke={C.textTertiary} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={tr('dashboard.searchNursesPlaceholder')}
            style={{ width:'100%', paddingLeft:40, paddingRight:14, paddingTop:11, paddingBottom:11, borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:F, boxSizing:'border-box' }}
          />
        </div>
        <select
          value={cityFilter}
          onChange={e=>setCityFilter(e.target.value)}
          style={{ padding:'11px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:cityFilter?C.textPrimary:C.textTertiary, background:C.bgWhite, outline:'none', fontFamily:F, cursor:'pointer' }}
        >
          <option value="">{tr('dashboard.allCities')}</option>
          {CITIES.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Count */}
      <div style={{ fontSize:12, color:C.textTertiary, marginBottom:16 }}>
        {filtered.length} {filtered.length === 1 ? tr('dashboard.nurseFound') : tr('dashboard.nursesFound')}
        {(query||cityFilter) && <button onClick={()=>{setQuery('');setCityFilter('');}} style={{ marginLeft:10, fontSize:12, color:C.primary, background:'transparent', border:'none', cursor:'pointer', fontWeight:600 }}>{tr('dashboard.clearFilters')}</button>}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'56px 24px', textAlign:'center' }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{tr('dashboard.noNursesFound')}</div>
          <div style={{ fontSize:13, color:C.textSecondary }}>{tr('dashboard.noNursesFoundSub')}</div>
        </div>
      )}

      {/* Nurse cards — grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:18 }}>
        {filtered.map(nurse => (
          <div key={nurse.id} className="fn-card" style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column' }}>

            {/* Card accent header */}
            <div style={{ height:72, background:'linear-gradient(135deg,#1e3a5f 0%,#2563EB 55%,#6366F1 100%)', position:'relative', overflow:'hidden', flexShrink:0 }}>
              <div style={{ position:'absolute', inset:0, opacity:0.08 }}>
                <svg width="100%" height="100%"><defs><pattern id={`fn-dots-${nurse.id}`} width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill={`url(#fn-dots-${nurse.id})`}/></svg>
              </div>
              <div style={{ position:'absolute', top:-20, right:-20, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
              {/* Verified badge top-right */}
              <div style={{ position:'absolute', top:10, right:12, fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.18)', color:'#fff', backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', gap:4 }}>
                <svg width="10" height="10" fill="none" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {tr('dashboard.nurseVerified')}
              </div>
            </div>

            {/* Avatar + name row — overlaps header */}
            <div style={{ padding:'0 18px', marginTop:-26, marginBottom:14, display:'flex', alignItems:'flex-end', gap:13, position:'relative', zIndex:2 }}>
              <div style={{ width:56, height:56, borderRadius:15, background:'linear-gradient(135deg,#2563EB,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:21, fontWeight:900, color:'#fff', flexShrink:0, overflow:'hidden', border:'3px solid #fff', boxShadow:'0 4px 14px rgba(0,0,0,0.18)' }}>
                {nurse.profilePhotoUrl
                  ? <img src={nurse.profilePhotoUrl} alt={nurse.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : (nurse.name||'N').charAt(0).toUpperCase()
                }
              </div>
              {/* Name + meta sit right next to avatar, pushed down to align with avatar bottom */}
              <div style={{ paddingBottom:2, flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:800, color:C.textPrimary, lineHeight:1.2, marginBottom:3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{nurse.name}</div>
                <div style={{ fontSize:11.5, color:C.textTertiary, display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
                  {nurse.city && <span style={{ display:'flex', alignItems:'center', gap:3 }}><svg width="10" height="10" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{nurse.city}</span>}
                  {nurse.experience && <span style={{ display:'flex', alignItems:'center', gap:3 }}><svg width="10" height="10" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>{nurse.experience}</span>}
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding:'0 18px 18px', flex:1, display:'flex', flexDirection:'column', position:'relative', zIndex:2 }}>
              {/* Stars row */}
              <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:10 }}>
                <div style={{ display:'flex', gap:1 }}>{stars(nurse.rating||0)}</div>
                <span style={{ fontSize:12, fontWeight:700, color:C.textSecondary }}>{nurse.rating>0 ? nurse.rating.toFixed(1) : tr('dashboard.newNurse')}</span>
                {nurse.reviewCount > 0 && <span style={{ fontSize:11, color:C.textTertiary }}>({nurse.reviewCount})</span>}
                <span style={{ fontSize:11, color:C.textTertiary, marginLeft:2 }}>· {nurse.totalVisits} {tr('dashboard.visitsApplicantLabel')}</span>
              </div>

              {nurse.bio && (
                <div style={{ fontSize:12.5, color:C.textSecondary, lineHeight:1.6, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', flex:1 }}>
                  {nurse.bio}
                </div>
              )}

              {nurse.specialties?.length > 0 && (
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
                  {nurse.specialties.slice(0,3).map(s=>(
                    <span key={s} style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99, background:C.primaryLight, color:C.primary }}>{s}</span>
                  ))}
                  {nurse.specialties.length > 3 && <span style={{ fontSize:11, color:C.textTertiary, padding:'3px 0' }}>+{nurse.specialties.length-3}</span>}
                </div>
              )}

              <button
                className="fn-book"
                onClick={() => onBook()}
                style={{ width:'100%', background:'linear-gradient(135deg,#2563EB,#4F46E5)', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, boxShadow:'0 4px 12px rgba(37,99,235,0.25)', display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:'auto', transition:'background 0.15s' }}
              >
                {tr('dashboard.bookWithNurse')}
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SubscriptionSection({ userData, lang }) {
  const tr = (key) => t(lang, key);
  const [loading, setLoading] = useState(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState([
    { id:'basic',    name:'Basic',    price:'€30',  visits:1, desc:'1 nurse visit per month' },
    { id:'standard', name:'Standard', price:'€50',  visits:2, desc:'2 nurse visits per month', popular:true },
    { id:'premium',  name:'Premium',  price:'€120', visits:4, desc:'4 nurse visits per month' },
  ]);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
    fetch(`${BASE}/settings/public`)
      .then(r => r.json())
      .then(p => setPlans([
        { id:'basic',    name:'Basic',    price:`€${p.basicPrice||30}`,    visits:p.basicVisits||1,    desc:`${p.basicVisits||1} nurse visit${(p.basicVisits||1)>1?'s':''} per month` },
        { id:'standard', name:'Standard', price:`€${p.standardPrice||50}`, visits:p.standardVisits||2, desc:`${p.standardVisits||2} nurse visits per month`, popular:true },
        { id:'premium',  name:'Premium',  price:`€${p.premiumPrice||120}`, visits:p.premiumVisits||4,  desc:`${p.premiumVisits||4} nurse visits per month` },
      ]))
      .catch(() => {});
  }, []);
  const sub = userData?.subscription;
  const currentPlan = sub?.plan || null;
  const status = sub?.status || 'TRIAL';
  const visitsUsed = sub?.visitsUsed || 0;
  const visitsTotal = sub?.visitsPerMonth || 0;

  const handleCheckout = async (planId) => {
    setLoading(planId); setError('');
    try {
      const data = await api.createCheckout(planId, lang);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.message || tr('dashboard.checkoutFailed'));
    } finally { setLoading(null); }
  };

  const handlePortal = async () => {
    setPortalLoading(true); setError('');
    try {
      const data = await api.createPortal();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.message || tr('dashboard.portalFailed'));
    } finally { setPortalLoading(false); }
  };

  return (
    <div style={{ maxWidth:680 }}>
      {/* Current plan */}
      <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:24, marginBottom:24, boxShadow:SSM }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>{tr('dashboard.currentPlan')}</div>
            <div style={{ fontSize:22, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px' }}>{currentPlan ? currentPlan.charAt(0).toUpperCase()+currentPlan.slice(1) : tr('dashboard.trialLabel')}</div>
            <div style={{ fontSize:13, color:C.textSecondary, marginTop:4 }}>
              {visitsTotal >= 999 ? '⚡ Unlimited visits (test account)' : visitsTotal > 0 ? `${visitsUsed}/${visitsTotal} ${tr('dashboard.visitsUsedMonth')}` : tr('dashboard.freeTrial')}
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:99, background:status==='ACTIVE'?C.secondaryLight:status==='TRIAL'?C.purpleLight:C.warningLight, color:status==='ACTIVE'?C.secondary:status==='TRIAL'?C.purple:C.warning }}>{status}</span>
            {sub?.stripeSubId && (
              <button onClick={handlePortal} disabled={portalLoading} style={{ fontSize:13, fontWeight:600, padding:'8px 16px', borderRadius:9, border:`1px solid ${C.border}`, background:C.bgWhite, cursor:'pointer', color:C.textSecondary }}>
                {portalLoading ? tr('dashboard.opening') : tr('dashboard.manageBilling')}
              </button>
            )}
          </div>
        </div>
        {visitsTotal > 0 && visitsTotal < 999 && (
          <div style={{ marginTop:16, background:C.bgSubtle, borderRadius:8, height:8, overflow:'hidden' }}>
            <div style={{ height:'100%', background:visitsUsed>=visitsTotal?C.error:C.primary, width:`${Math.min(100,(visitsUsed/visitsTotal)*100)}%`, borderRadius:8, transition:'width 0.3s' }} />
          </div>
        )}
      </div>

      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:10, padding:'12px 16px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}

      {/* Plan cards */}
      <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:16 }}>
        {currentPlan ? tr('dashboard.changePlan') : tr('dashboard.choosePlan')}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
        {plans.map(p => (
          <div key={p.id} style={{ background:C.bgWhite, borderRadius:14, border:`2px solid ${p.id===currentPlan?C.primary:p.popular?'rgba(37,99,235,0.2)':C.border}`, padding:20, position:'relative' }}>
            {p.popular && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.primary, color:'#fff', whiteSpace:'nowrap' }}>{tr('dashboard.mostPopular')}</div>}
            {p.id===currentPlan && <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.secondary, color:'#fff', whiteSpace:'nowrap' }}>{tr('dashboard.currentBadge')}</div>}
            <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, marginBottom:4 }}>{p.name}</div>
            <div style={{ fontSize:24, fontWeight:800, color:C.primary, letterSpacing:'-0.5px', marginBottom:4 }}>{p.price}<span style={{ fontSize:13, fontWeight:500, color:C.textTertiary }}>{tr('dashboard.perMonth')}</span></div>
            <div style={{ fontSize:13, color:C.textSecondary, marginBottom:16, lineHeight:1.5 }}>{p.desc}</div>
            <button
              onClick={()=>handleCheckout(p.id)}
              disabled={loading===p.id || p.id===currentPlan}
              style={{ width:'100%', padding:'10px', borderRadius:9, border:'none', background:p.id===currentPlan?C.bgSubtle:C.primary, color:p.id===currentPlan?C.textTertiary:'#fff', fontSize:13, fontWeight:700, cursor:p.id===currentPlan?'not-allowed':'pointer', opacity:loading===p.id?0.7:1, fontFamily:F }}
            >
              {loading===p.id ? tr('dashboard.loadingPlan') : p.id===currentPlan ? tr('dashboard.currentPlanBtn') : tr('dashboard.selectPlanBtn')}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop:16, fontSize:12, color:C.textTertiary, textAlign:'center' }}>
        {tr('dashboard.stripeInfo')}
      </div>
    </div>
  );
}

export default function Dashboard({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [uiLang, setUiLang] = useState(lang);
  const tr = (key) => t(lang, key);
  const NAV = makeNAV(tr);
  const switchLang = (l) => { setUiLang(l); document.cookie=`vonaxity-locale=${l};path=/;max-age=31536000`; const path = window.location.pathname.replace(/^\/(en|sq)/,`/${l}`); window.location.href = path; };
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [u, setU] = useState(null);
  const [relatives, setRelatives] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingApplicants, setViewingApplicants] = useState(null); // visit object
  const [confirmVisit, setConfirmVisit] = useState(null); // newly booked visit
  const [viewingDetail, setViewingDetail] = useState(null); // visit object for report modal

  const TITLES = { overview:tr('dashboard.title'), book:tr('dashboard.bookVisitTitle'), nurses:tr('dashboard.findNurses'), visits:tr('dashboard.myVisits'), subscription:tr('dashboard.subscription'), settings:tr('dashboard.settings') };

  useEffect(() => {
    const load = async () => {
      try {
        const [meData, visitsData] = await Promise.all([
          api.me().catch(()=>null),
          api.getVisits().catch(()=>({ visits:[] })),
        ]);
        if (meData?.user) {
          setU(meData.user);
          setRelatives(meData.user.relatives || []);
        } else {
          // No valid session - redirect to login
          router.push(`/${lang}/login`);
          return;
        }
        setVisits(visitsData?.visits?.length > 0 ? visitsData.visits : []);
      } catch {
        router.push(`/${lang}/login`);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const loadData = async () => {
    try {
      const [meData, visitsData] = await Promise.all([
        api.me().catch(()=>null),
        api.getVisits().catch(()=>({ visits:[] })),
      ]);
      if (meData?.user) {
        setU(meData.user);
        setRelatives(meData.user.relatives || []);
      }
      setVisits(visitsData?.visits?.length > 0 ? visitsData.visits : []);
    } catch {}
  };

  const logout = () => { localStorage.removeItem('vonaxity-token'); document.cookie='vonaxity-token=;path=/;max-age=0'; document.cookie='vonaxity-role=;path=/;max-age=0'; router.push(`/${lang}/login`); };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:F, color:C.textTertiary, fontSize:14 }}>Loading...</div>;

  const userData = u || { name:'', email:'', subscription:{ plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:0 } };
  const relative = relatives[0] || null;
  const relativeDisplay = relative;
  const plan = (userData.subscription?.plan||'standard').charAt(0).toUpperCase()+(userData.subscription?.plan||'standard').slice(1);
  const isTrial = userData.subscription?.status === 'TRIAL';
  const isExpired = userData.subscription?.status === 'EXPIRED';
  const initials = (userData.name||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const handleBookSuccess = async (newVisit) => {
    await loadData(); // full sync — updates visits AND subscription count
    setActive('visits');
    if (newVisit) setConfirmVisit(newVisit);
  };

  const handleApplicantSelect = async () => {
    const visitsData = await api.getVisits().catch(()=>({ visits:[] }));
    setVisits(visitsData?.visits || []);
    setViewingApplicants(null);
    setActive('visits');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:${F};}
        .dash-wrap{display:flex;height:100vh;overflow:hidden;background:${C.bg};}
        .desk-sb{display:flex!important;}
        .mob-sb,.mob-ham,.mob-tabs{display:none!important;}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .dash-section{animation:fadeSlideIn 0.2s ease both;}
        @media(max-width:768px){
          .desk-sb{display:none!important;}
          .mob-sb{display:flex!important;}
          .mob-ham{display:flex!important;}
          .mob-tabs{display:flex!important;}
          .dash-cont{padding-bottom:80px!important;}
        }
      `}</style>
      <div className="dash-wrap">
        {/* Desktop sidebar */}
        <div className="desk-sb" style={{ width:224,background:C.sidebarBg,display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh',flexShrink:0 }}>
          <div style={{ padding:'22px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:17,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',marginBottom:14 }}>Vonaxity</div>
            <div style={{ display:'flex',alignItems:'center',gap:9 }}>
              <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#2563EB,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0 }}>{initials}</div>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:'#fff' }}>{userData.name}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,0.55)' }}>{tr('dashboard.clientRole')} · {plan}</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1,padding:'10px',overflowY:'auto' }}>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>{ setActive(item.id); setViewingApplicants(null); }}
                style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',background:active===item.id?'rgba(37,99,235,0.2)':'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.72)',cursor:'pointer',fontSize:13,fontWeight:active===item.id?700:500,marginBottom:2,textAlign:'left',fontFamily:F,borderLeft:active===item.id?'2px solid #60A5FA':'2px solid transparent' }}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding:'14px 16px',borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={logout} style={{ width:'100%',padding:'10px 12px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:9,color:'#F87171',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:F,textAlign:'left' }}>{tr('dashboard.signOut')}</button>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:39 }} onClick={()=>setSidebarOpen(false)}/>}

        {/* Mobile sidebar */}
        <div className="mob-sb" style={{ display:'none',position:'fixed',top:0,left:0,height:'100vh',width:260,background:C.sidebarBg,flexDirection:'column',zIndex:50,transform:sidebarOpen?'translateX(0)':'translateX(-100%)',transition:'transform 0.25s ease',boxShadow:'4px 0 24px rgba(0,0,0,0.3)' }}>
          <div style={{ padding:'20px 18px 14px',borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
            <div style={{ fontSize:18,fontWeight:800,color:'#fff' }}>Vonaxity</div>
            <button onClick={()=>setSidebarOpen(false)} style={{ background:'rgba(255,255,255,0.08)',border:'none',color:'rgba(255,255,255,0.6)',borderRadius:8,width:30,height:30,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
          </div>
          <nav style={{ flex:1,padding:'10px' }}>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>{ setActive(item.id); setSidebarOpen(false); setViewingApplicants(null); }} style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10,border:'none',background:active===item.id?'rgba(37,99,235,0.2)':'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.72)',cursor:'pointer',fontSize:14,fontWeight:active===item.id?700:500,marginBottom:2,textAlign:'left',fontFamily:F,borderLeft:active===item.id?'2px solid #60A5FA':'2px solid transparent' }}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding:'16px',borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={logout} style={{ width:'100%',padding:'13px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:10,color:'#F87171',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F }}>{tr('dashboard.signOut')}</button>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1,display:'flex',flexDirection:'column',minWidth:0 }}>
          <div style={{ padding:'0 24px',height:58,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.bgWhite,flexShrink:0 }}>
            <div style={{ display:'flex',alignItems:'center',gap:12 }}>
              <button onClick={()=>setSidebarOpen(true)} className="mob-ham" style={{ display:'none',flexDirection:'column',gap:4,background:'transparent',border:'none',cursor:'pointer',padding:'6px' }}>
                <span style={{ display:'block',width:20,height:2,background:C.textPrimary,borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:C.textPrimary,borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:C.textPrimary,borderRadius:2 }}/>
              </button>
              <div style={{ fontSize:16,fontWeight:700,color:C.textPrimary }}>{viewingApplicants ? tr('dashboard.applicantsTitle') : TITLES[active]}</div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
              <NotificationBell lang={lang} onNavigate={(type, relatedId) => {
                setViewingApplicants(null);
                setViewingDetail(null);
                setActive('visits');
                if (relatedId) {
                  const v = visits.find(x => x.id === relatedId);
                  if (v) {
                    if (type === 'NURSE_APPLIED') setViewingApplicants(v);
                    else if (type === 'VISIT_COMPLETED') setViewingDetail(v);
                  }
                }
              }} />
              <div style={{ display:'flex',background:'#F1F5F9',borderRadius:8,padding:3,border:`1px solid ${C.border}` }}>
                {['en','sq'].map(l=>(
                  <button key={l} onClick={()=>switchLang(l)} style={{ padding:'4px 10px',borderRadius:6,border:'none',fontSize:11,fontWeight:700,cursor:'pointer',background:uiLang===l?C.primary:'transparent',color:uiLang===l?'#fff':C.textSecondary,fontFamily:F }}>{l.toUpperCase()}</button>
                ))}
              </div>
              <span style={{ fontSize:11,fontWeight:700,padding:'4px 11px',borderRadius:99,background:isTrial?C.purpleLight:C.secondaryLight,color:isTrial?C.purple:C.secondary }}>{userData.subscription?.status||'Trial'}</span>
            </div>
          </div>

          <main className="dash-cont" style={{ flex:1,overflowY:'auto',padding:24,maxWidth:760,width:'100%' }}>
            {/* Applicants view overrides everything */}
            {viewingApplicants ? (
              <Applicants
                visitId={viewingApplicants.id}
                visitInfo={viewingApplicants}
                onBack={()=>setViewingApplicants(null)}
                onSelect={handleApplicantSelect}
                lang={lang}
              />
            ) : (
              <>
                {/* Trial expired paywall banner */}
                {isExpired && (
                  <div style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', padding:'18px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:3 }}>
                        {lang==='sq' ? 'Periudha e provës ka përfunduar' : 'Your free trial has ended'}
                      </div>
                      <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>
                        {lang==='sq' ? 'Zgjidhni një plan për të vazhduar rezervimet e vizitave.' : 'Choose a plan to continue booking nurse visits for your loved ones.'}
                      </div>
                    </div>
                    <button
                      onClick={() => setActive('subscription')}
                      style={{ background:'#fff', color:'#7C3AED', border:'none', borderRadius:10, padding:'10px 22px', fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}
                    >
                      {lang==='sq' ? 'Shiko planet →' : 'View plans →'}
                    </button>
                  </div>
                )}
                <div key={active} className="dash-section">
                  {active==='overview' && <Overview user={userData} visits={visits} relative={relativeDisplay} lang={lang} onBook={()=>isExpired ? setActive('subscription') : setActive('book')} onViewVisits={()=>setActive('visits')} onViewNextVisit={(v)=>{ if (v?.status==='UNASSIGNED') { setViewingApplicants(v); } else { setViewingDetail(v); setActive('visits'); } }} />}
                  {active==='health' && <HealthProgress visits={visits} relative={relativeDisplay} lang={lang} />}
                  {active==='book' && !isExpired && <BookVisit relatives={relatives} subscription={userData?.subscription} onSuccess={handleBookSuccess} onCancel={()=>setActive('overview')} lang={lang} />}
                  {active==='book' && isExpired && <SubscriptionSection userData={userData} lang={lang} />}
                  {active==='nurses' && <FindNurses lang={lang} onBook={()=>isExpired ? setActive('subscription') : setActive('book')} />}
                  {active==='visits' && <Visits visits={visits} lang={lang} onViewApplicants={(v)=>setViewingApplicants(v)} onRefresh={loadData} viewingDetail={viewingDetail} setViewingDetail={setViewingDetail} />}
                  {active==='subscription' && <SubscriptionSection userData={userData} lang={lang} />}
                  {active==='settings' && <Settings key="settings-page" initialUser={userData} initialRelatives={relatives} lang={lang}/>}
                </div>
              </>
            )}
          </main>
        </div>

        {/* Booking confirmation modal */}
        {confirmVisit && (
          <BookingConfirmation
            visit={confirmVisit}
            lang={lang}
            onClose={() => setConfirmVisit(null)}
            onViewApplicants={(v) => {
              setConfirmVisit(null);
              // find the freshly-loaded visit by workOrderNumber in case id changed
              const fresh = visits.find(x => x.workOrderNumber === v.workOrderNumber || x.id === v.id) || v;
              setViewingApplicants(fresh);
            }}
          />
        )}

        {/* Mobile bottom tabs */}
        <div className="mob-tabs" style={{ display:'none',position:'fixed',bottom:0,left:0,right:0,background:C.sidebarBg,borderTop:'1px solid rgba(255,255,255,0.08)',zIndex:48,padding:'8px 0 env(safe-area-inset-bottom,8px)' }}>
          <button onClick={()=>setSidebarOpen(true)} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,border:'none',background:'transparent',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:10,fontWeight:500,fontFamily:F,padding:'4px 2px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            Menu
          </button>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>{ setActive(item.id); setViewingApplicants(null); }} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,border:'none',background:'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:10,fontWeight:active===item.id?700:500,fontFamily:F,padding:'4px 2px' }}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
