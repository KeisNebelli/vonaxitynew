'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';
import { toastSuccess, toastError } from '@/components/ui/Toast';
import HealthProgress from '../dashboard/health';
import NurseChat from '@/components/chat/NurseChat';
// Module-level translation helper - uses 'en' as default
let _currentLang = 'en';
const tr = (key) => t(_currentLang, key);


const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };


const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const CITIES = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];
const SPECIALTIES_LIST = ['Blood Pressure','Glucose Monitoring','Vitals','Blood Work','Welfare Check','General Nursing','Post-surgical Care','Paediatric Care'];
const SERVICES_LIST = ['Blood Pressure Check','Glucose Monitoring','Vitals Monitoring','Blood Work Collection','Welfare Check','Post-surgical Care','Medication Administration','General Nursing'];
const LANGUAGES_LIST = ['Albanian','English','Italian','Greek','German','French'];

// Service-type translations (en → sq)
const SERVICE_SQ = {
  'Blood Pressure Check':      'Kontroll i Presionit të Gjakut',
  'Glucose Monitoring':        'Monitorim i Glukozës',
  'Vitals Monitoring':         'Monitorim i Shenjave Vitale',
  'Blood Work Collection':     'Marrja e Mostrave të Gjakut',
  'Welfare Check':             'Kontroll i Mirëqenies',
  'Post-surgical Care':        'Kujdes Post-operativ',
  'Medication Administration': 'Administrim i Barnave',
  'General Nursing':           'Kujdes i Përgjithshëm Infermieristik',
  'Blood Pressure + Glucose Check': 'Presioni + Glukoza',
  'Vitals Check':              'Kontroll Vital',
  'Blood Work':                'Analizë Gjaku',
  'Paediatric Care':           'Kujdes Pediatrik',
};

function trService(serviceType, lang) {
  if (!serviceType) return '—';
  if (lang !== 'sq') return serviceType;
  return SERVICE_SQ[serviceType] || serviceType;
}
const EXPERIENCE_LIST = ['Less than 1 year','1-2 years','3-5 years','6-10 years','10+ years'];

const NAV_ITEMS = [
  { id:'dashboard', label:'dashboard', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'jobs',      label:'jobs',      icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { id:'visits',    label:'visits',    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'calendar',  label:'calendar',  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/></svg> },
  { id:'health',    label:'health',    icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { id:'complete',  label:'complete',  icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { id:'profile',   label:'profile',   icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

function formatVisit(v) {
  return {
    id: v.id,
    workOrderNumber: v.workOrderNumber || null,
    clientName: v.relative?.name || 'Patient',
    address: v.relative?.address || '',
    lat: v.lat || null,
    lng: v.lng || null,
    service: v.serviceType,
    date: new Date(v.scheduledAt).toISOString().split('T')[0],
    time: new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),
    status: v.status.toLowerCase(),
    notes: v.notes || '',
    phone: v.relative?.phone || '',
    age: v.relative?.age || null,
  };
}

const F = "'DM Sans','Inter',system-ui,sans-serif";

const NURSE_LABELS = {
  en:{ dashboard:'Dashboard', jobs:'Browse Jobs', visits:'My Visits', calendar:'Calendar', health:'Patient Health', complete:'Complete Visit', profile:'My Profile' },
  sq:{ dashboard:'Paneli', jobs:'Shfleto Punët', visits:'Vizitat e Mia', calendar:'Kalendar', health:'Shëndeti i Pacientit', complete:'Përfundo Vizitën', profile:'Profili Im' },
};
const SSM = '0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04)';

function NurseSidebarInner({ mobile=false, initials, nurse, status, sbg, scol, active, setActive, onLogout, setOpen, lang="en" }) {
  return (
    <>
      <div style={{ padding:'22px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        {mobile && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>
            <button onClick={()=>setOpen(false)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.6)', borderRadius:8, width:30,height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        )}
        {!mobile && <div style={{ fontSize:18, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:18 }}>Vonaxity</div>}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {nurse?.profilePhotoUrl ? (
            <img src={nurse.profilePhotoUrl} alt={initials} style={{ width:34,height:34,borderRadius:10,objectFit:'cover',flexShrink:0,border:'1.5px solid rgba(255,255,255,0.15)' }} />
          ) : (
            <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#2563EB,#7C3AED)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',flexShrink:0 }}>{initials}</div>
          )}
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nurse?.name||'Nurse'}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:10, fontWeight:700, color:scol, background:sbg, padding:'2px 8px', borderRadius:99, marginTop:3 }}>
              <div style={{ width:5,height:5,borderRadius:'50%',background:scol }}/>{status}
            </div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'10px', overflow:'auto' }}>
        {NAV_ITEMS.map(item=>(
          <button key={item.id} onClick={()=>{ setActive(item.id); if(mobile)setOpen(false); }} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:mobile?'13px 12px':'10px 12px', borderRadius:10, border:'none', borderLeft:active===item.id?'2px solid #60A5FA':'2px solid transparent', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.72)', cursor:'pointer', fontSize:mobile?14:13, fontWeight:active===item.id?700:500, marginBottom:2, textAlign:'left', fontFamily:F, transition:'all 0.15s' }}>
            {item.icon}<span>{(NURSE_LABELS[lang]||NURSE_LABELS.en)[item.label]||item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        {mobile ? (
          <button onClick={onLogout} style={{ width:'100%', padding:'13px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#F87171', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:F }}>Sign out</button>
        ) : (
          <button onClick={onLogout} style={{ width:'100%', padding:'11px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#F87171', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>Sign out</button>
        )}
      </div>
    </>
  );
}

function NurseSidebar({ nurse, active, setActive, onLogout, open, setOpen, lang="en" }) {
  const initials = nurse?.name ? nurse.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : 'N';
  const status = nurse?.status || 'INCOMPLETE';
  const statusMap = { APPROVED:['#ECFDF5','#059669'], PENDING:['#EFF6FF','#2563EB'], INCOMPLETE:['#FFFBEB','#D97706'], REJECTED:['#FEF2F2','#DC2626'], SUSPENDED:['#F1F5F9','#475569'] };
  const [sbg, scol] = statusMap[status] || statusMap.INCOMPLETE;

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ width:220, background:'#111827', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', flexShrink:0 }} className="nurse-desk-sidebar">
        <NurseSidebarInner initials={initials} nurse={nurse} status={status} sbg={sbg} scol={scol} active={active} setActive={setActive} onLogout={onLogout} setOpen={setOpen} lang={lang} />
      </div>
      {/* Mobile overlay */}
      {open && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:39 }} onClick={()=>setOpen(false)} />}
      {/* Mobile sidebar */}
      <div style={{ display:'none', position:'fixed', top:0, left:0, height:'100vh', width:270, background:'#111827', flexDirection:'column', zIndex:50, transform:open?'translateX(0)':'translateX(-100%)', transition:'transform 0.25s ease', boxShadow:'4px 0 24px rgba(0,0,0,0.3)' }} className="nurse-mob-sidebar">
        <NurseSidebarInner mobile initials={initials} nurse={nurse} status={status} sbg={sbg} scol={scol} active={active} setActive={setActive} onLogout={onLogout} setOpen={setOpen} lang={lang} />
      </div>
      <style>{`
        @media(max-width:768px){
          .nurse-desk-sidebar{display:none!important;}
          .nurse-mob-sidebar{display:flex!important;}
        }
      `}</style>
    </>
  );
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
      NEW_JOB:         { bg:'#EDE9FE', color:'#7C3AED', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> },
      JOB_ASSIGNED:    { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
      JOB_UPDATED:     { bg:'#FEF3C7', color:'#D97706', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
      VISIT_COMPLETED: { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
      VISIT_CANCELLED: { bg:'#FEF2F2', color:'#DC2626', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
      NURSE_ON_WAY:    { bg:'#EFF6FF', color:'#2563EB', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
      NURSE_ARRIVED:   { bg:'#ECFDF5', color:'#059669', svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> },
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

  const C2 = { bgWhite:'#FFFFFF', bgSubtle:'#F1F5F9', borderSubtle:'#F8FAFC', primary:'#2563EB', primaryLight:'#EFF6FF', textPrimary:'#0F172A', textSecondary:'#475569', textTertiary:'#94A3B8', border:'#E2E8F0' };

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position:'relative', width:36, height:36, borderRadius:9, border:'1px solid #E2E8F0', background:open ? '#F1F5F9' : '#FFFFFF', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#475569', flexShrink:0 }}
        aria-label="Notifications"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:'#EF4444', border:'1.5px solid #FFFFFF' }} />
        )}
      </button>

      {open && (
        <div style={{ position:'absolute', top:42, right:0, width:'min(320px, calc(100vw - 32px))', background:C2.bgWhite, borderRadius:14, boxShadow:'0 8px 30px rgba(15,23,42,0.12)', border:`1px solid ${C2.border}`, zIndex:9999, overflow:'hidden' }}>
          <div style={{ padding:'14px 16px 10px', borderBottom:`1px solid ${C2.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C2.textPrimary }}>{t(lang,'notifications.header')} {unread > 0 && <span style={{ fontSize:11, fontWeight:600, padding:'2px 7px', borderRadius:99, background:C2.primaryLight, color:C2.primary, marginLeft:6 }}>{unread}</span>}</div>
            {unread > 0 && <button onClick={markAll} style={{ fontSize:11, fontWeight:600, color:C2.primary, background:'none', border:'none', cursor:'pointer', padding:0 }}>{t(lang,'notifications.markAllRead')}</button>}
          </div>
          <div style={{ maxHeight:320, overflowY:'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding:'28px 16px', textAlign:'center', color:C2.textTertiary, fontSize:13 }}>
                {t(lang,'notifications.empty')}
              </div>
            ) : notifs.map(n => {
              const typeMap = t(lang, `notifications.types.${n.type}`);
              const title = (typeMap && typeof typeMap === 'object' ? typeMap.title : null) || n.title;
              const message = n.type === 'announcement' ? n.message : ((typeMap && typeof typeMap === 'object' ? typeMap.message : null) || n.message);
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{ padding:'12px 16px', borderBottom:`1px solid ${C2.borderSubtle}`, cursor:'pointer', background:n.read ? 'transparent' : C2.primaryLight, display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C2.bgSubtle}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : C2.primaryLight}
                >
                  {iconFor(n.type)}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:n.read ? 500 : 700, color:C2.textPrimary, marginBottom:2, lineHeight:1.3 }}>{title}</div>
                    <div style={{ fontSize:12, color:C2.textSecondary, lineHeight:1.4, marginBottom:4 }}>{message}</div>
                    <div style={{ fontSize:11, color:C2.textTertiary }}>{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.read && <div style={{ width:6, height:6, borderRadius:'50%', background:C2.primary, flexShrink:0, marginTop:6 }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCalendar({ visits=[], lang='en', onOpenCalendar, onVisitSelect }) {
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);

  // Build a map of date-string → visits[]
  const visitsByDate = {};
  visits.forEach(v => {
    if (!v.scheduledAt) return;
    const d = new Date(v.scheduledAt);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!visitsByDate[key]) visitsByDate[key] = [];
    visitsByDate[key].push(v);
  });

  // Build this month's grid (Mon–Sun)
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // shift to Mon=0
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayStr = `${year}-${String(month+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const DOW = lang==='sq' ? ['Hë','Ma','Më','En','Pr','Sh','Di'] : ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const MONTHS = lang==='sq'
    ? ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const statusColor = (s) => s==='COMPLETED'?'#059669':s==='CANCELLED'?'#DC2626':'#2563EB';

  const dayKey = (d) => d ? `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null;
  const selectedKey = selectedDay ? dayKey(selectedDay) : null;
  const selectedVisits = selectedKey ? (visitsByDate[selectedKey]||[]) : [];

  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${C.border}`, padding:16, boxShadow:SSM }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <span style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>{MONTHS[month]} {year}</span>
        </div>
        <button onClick={onOpenCalendar} style={{ fontSize:11, fontWeight:700, color:'#2563EB', background:'#EFF6FF', border:'none', borderRadius:8, padding:'5px 11px', cursor:'pointer', fontFamily:F }}>
          {lang==='sq'?'Shiko të gjitha →':'View all →'}
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:C.textTertiary, padding:'2px 0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`}/>;
          const key = dayKey(d);
          const dayVisits = visitsByDate[key]||[];
          const isToday = key === todayStr;
          const isSelected = d === selectedDay;
          const hasPending = dayVisits.some(v=>v.status==='SCHEDULED'||v.status==='IN_PROGRESS');
          const hasDone = dayVisits.some(v=>v.status==='COMPLETED');
          const hasCancelled = dayVisits.some(v=>v.status==='CANCELLED') && !hasPending && !hasDone;

          return (
            <button key={key} onClick={()=>setSelectedDay(d===selectedDay?null:d)}
              style={{
                position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                padding:'5px 2px', borderRadius:8, border:'none', cursor:dayVisits.length?'pointer':'default',
                background: isSelected ? '#2563EB' : isToday ? '#EFF6FF' : 'transparent',
                fontFamily:F,
              }}>
              <span style={{ fontSize:12, fontWeight: isToday||isSelected?700:400, color: isSelected?'#fff':isToday?'#2563EB':C.textPrimary, lineHeight:1 }}>{d}</span>
              {/* Dots */}
              {dayVisits.length > 0 && (
                <div style={{ display:'flex', gap:2, marginTop:3 }}>
                  {hasPending && <div style={{ width:4, height:4, borderRadius:'50%', background: isSelected?'#93C5FD':'#2563EB' }}/>}
                  {hasDone && <div style={{ width:4, height:4, borderRadius:'50%', background: isSelected?'#6EE7B7':'#059669' }}/>}
                  {hasCancelled && <div style={{ width:4, height:4, borderRadius:'50%', background: isSelected?'#FCA5A5':'#DC2626' }}/>}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day visits */}
      {selectedDay && (
        <div style={{ marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12 }}>
          {selectedVisits.length === 0 ? (
            <div style={{ fontSize:12, color:C.textTertiary, textAlign:'center', padding:'8px 0' }}>
              {lang==='sq'?'Asnjë vizitë këtë ditë':'No visits this day'}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {selectedVisits.map(v => {
                const t = new Date(v.scheduledAt);
                const time = t.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
                const sc = statusColor(v.status);
                return (
                  <button key={v.id} onClick={()=>onVisitSelect(v)}
                    style={{ display:'flex', alignItems:'center', gap:10, background:'#F8FAFC', border:`1px solid ${C.border}`, borderRadius:10, padding:'9px 12px', cursor:'pointer', textAlign:'left', fontFamily:F, width:'100%' }}>
                    <div style={{ width:3, height:36, borderRadius:2, background:sc, flexShrink:0 }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:C.textPrimary, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                          {v.relative?.name || (lang==='sq'?'Pacient':'Patient')}
                        </span>
                        <span style={{ fontSize:10, fontWeight:700, color:C.textTertiary, background:'#F1F5F9', borderRadius:5, padding:'1px 5px', flexShrink:0 }}>#{v.id?.slice(-6)?.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize:11, color:C.textTertiary }}>{v.serviceType} · {time}</div>
                    </div>
                    <svg width="12" height="12" fill="none" stroke={C.textTertiary} strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', gap:12, marginTop:12, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
        {[['#2563EB', lang==='sq'?'Planifikuar':'Scheduled'], ['#059669', lang==='sq'?'Kryer':'Completed'], ['#DC2626', lang==='sq'?'Anuluar':'Cancelled']].map(([col,lbl])=>(
          <div key={lbl} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:col }}/>
            <span style={{ fontSize:10, color:C.textTertiary, fontWeight:500 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ setActive, setSelectedVisit, lang='en', visits=[], nurse=null, onTodayClick }) {
  const tr = (key) => t(lang, key);
  const [openJobsCount, setOpenJobsCount] = useState(null);
  useEffect(() => {
    if (nurse?.status === 'APPROVED') {
      api.getOpenVisits().then(d => setOpenJobsCount((d.visits||[]).length)).catch(()=>{});
    }
  }, [nurse?.status]);

  const todayStr = new Date().toISOString().split('T')[0];
  const today = visits.filter(v => {
    if (['COMPLETED','CANCELLED'].includes(v.status)) return false;
    const visitDate = new Date(v.scheduledAt).toISOString().split('T')[0];
    return visitDate === todayStr;
  });
  const completed = visits.filter(v => v.status === 'COMPLETED');
  const nurseName = nurse?.user?.name || nurse?.name || 'Nurse';
  const nurseInitials = nurseName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const firstName = nurseName.split(' ')[0];
  const ratingValue = nurse?.rating > 0 ? nurse.rating : null;
  const totalVisits = nurse?.totalVisits || 0;
  const specialtiesArray = nurse?.specialties ? (typeof nurse.specialties === 'string' ? JSON.parse(nurse.specialties) : nurse.specialties) : [];
  const statusMap = { APPROVED:['#ECFDF5','#059669','Approved'], PENDING:['#FEF3C7','#D97706','Pending'], INCOMPLETE:['#FFFBEB','#D97706','Incomplete'], REJECTED:['#FEF2F2','#DC2626','Rejected'], SUSPENDED:['#F1F5F9','#475569','Suspended'] };
  const [statusBg, statusColor, statusLabel] = statusMap[nurse?.status] || statusMap.INCOMPLETE;
  const hourNow = new Date().getHours();
  const greeting = lang==='sq' ? (hourNow < 12 ? 'Mirëmëngjes' : hourNow < 18 ? 'Mirëdita' : 'Mirëmbrëma') : (hourNow < 12 ? 'Good morning' : hourNow < 18 ? 'Good afternoon' : 'Good evening');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <style>{`
        .nd-stat:hover { border-color:#2563EB!important; transform:translateY(-2px); }
        .nd-stat { transition:border-color 0.15s,transform 0.15s; }
        .nd-route-btn:hover { background:#1D4ED8!important; }
        .nd-route-btn { transition:background 0.15s; }
        /* ── Mobile overrides ── */
        @media(max-width:480px){
          .nd-stat-grid { grid-template-columns: 1fr 1fr !important; }
          .nd-stat-earn { grid-column: span 2; flex-direction:row!important; align-items:center!important; gap:14px!important; padding:14px 16px!important; }
          .nd-stat-earn .nd-stat-val { font-size:20px!important; }
          .nd-stat { padding:14px 14px!important; }
          .nd-stat .nd-stat-val { font-size:20px!important; }
          .nd-actions { flex-direction:column!important; }
          .nd-actions button { flex:unset!important; width:100%!important; }
          .nd-hero-content { padding:18px 18px 16px!important; }
          .nd-hero-name { font-size:20px!important; }
          .nd-hero-bottom { flex-direction:column!important; align-items:flex-start!important; gap:8px!important; }
        }
        @media(max-width:360px){
          .nd-stat-earn .nd-stat-val { font-size:17px!important; }
        }
      `}</style>

      {/* ── Profile hero card ── */}
      <div style={{ borderRadius:20, overflow:'hidden', background:'linear-gradient(135deg,#2563EB 0%,#4F46E5 55%,#7C3AED 100%)', boxShadow:'0 6px 24px rgba(37,99,235,0.28)', position:'relative' }}>
        {/* Subtle noise texture */}
        <div style={{ position:'absolute', inset:0, opacity:0.04, pointerEvents:'none' }}>
          <svg width="100%" height="100%"><defs><pattern id="nd" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#nd)"/></svg>
        </div>
        {/* Glow orbs */}
        <div style={{ position:'absolute', top:-60, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(124,58,237,0.35)', filter:'blur(60px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, left:20, width:140, height:140, borderRadius:'50%', background:'rgba(37,99,235,0.3)', filter:'blur(50px)', pointerEvents:'none' }}/>

        {/* Content */}
        <div className="nd-hero-content" style={{ position:'relative', zIndex:1, padding:'22px 22px 20px' }}>
          {/* Top row: greeting + avatar */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:18 }}>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.55)', marginBottom:3, letterSpacing:'0.2px' }}>{greeting}</div>
              <div className="nd-hero-name" style={{ fontSize:24, fontWeight:800, color:'#fff', letterSpacing:'-0.6px', lineHeight:1.1 }}>{firstName}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:'rgba(255,255,255,0.15)', color:'#fff', backdropFilter:'blur(4px)' }}>
                  <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:statusColor, marginRight:5, verticalAlign:'middle' }}/>{statusLabel}
                </span>
                {nurse?.city && (
                  <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99, background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.85)' }}>
                    {nurse.city}
                  </span>
                )}
              </div>
            </div>
            {/* Avatar */}
            <div style={{ flexShrink:0, position:'relative' }}>
              {nurse?.profilePhotoUrl ? (
                <img src={nurse.profilePhotoUrl} alt={nurseName}
                  style={{ width:64, height:64, borderRadius:18, objectFit:'cover', border:'2.5px solid rgba(255,255,255,0.3)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}/>
              ) : (
                <div style={{ width:64, height:64, borderRadius:18, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'2px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#fff', boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
                  {nurseInitials}
                </div>
              )}
              <div style={{ position:'absolute', bottom:-3, right:-3, width:16, height:16, borderRadius:'50%', background:statusColor, border:'2px solid rgba(255,255,255,0.6)', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:'rgba(255,255,255,0.1)', marginBottom:16 }}/>

          {/* Bottom row: rating + visits + specialties */}
          <div className="nd-hero-bottom" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', gap:2 }}>
                {[1,2,3,4,5].map(idx => (
                  <svg key={idx} width="13" height="13" viewBox="0 0 24 24" style={{ fill: ratingValue && idx <= Math.round(ratingValue) ? '#FCD34D' : 'rgba(255,255,255,0.2)', stroke:'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span style={{ fontSize:13, fontWeight:700, color:'#fff' }}>
                {ratingValue ? ratingValue.toFixed(1) : <span style={{ fontWeight:500, opacity:0.6, fontSize:12 }}>{lang==='sq'?'Infermiere e re':'New'}</span>}
              </span>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>·</span>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>
                {totalVisits} {lang==='sq'?'vizita':'visits'}
              </span>
            </div>
            {/* Specialty pills */}
            {specialtiesArray.length > 0 && (
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {specialtiesArray.slice(0,2).map(spec => (
                  <span key={spec} style={{ fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.13)', color:'rgba(255,255,255,0.85)', border:'1px solid rgba(255,255,255,0.15)' }}>{spec}</span>
                ))}
                {specialtiesArray.length > 2 && (
                  <span style={{ fontSize:10, fontWeight:600, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)' }}>+{specialtiesArray.length-2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Performance Insights ── */}
      {(() => {
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeek = visits.filter(v => v.status === 'COMPLETED' && new Date(v.completedAt||v.scheduledAt) >= weekAgo);
        const completionRate = visits.filter(v=>!['PENDING','UNASSIGNED'].includes(v.status)).length > 0
          ? Math.round((visits.filter(v=>v.status==='COMPLETED').length / visits.filter(v=>!['PENDING','UNASSIGNED'].includes(v.status)).length) * 100)
          : null;
        const ratingDisplay = ratingValue ? ratingValue.toFixed(1) : null;
        if (!totalVisits && !thisWeek.length) return null;
        return (
          <div style={{ background:'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)', borderRadius:16, padding:'18px 20px', boxShadow:'0 4px 16px rgba(15,23,42,0.2)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:12 }}>{lang==='sq'?'Performanca':'Performance'}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', lineHeight:1 }}>{thisWeek.length}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{lang==='sq'?'Vizita këtë javë':'This week'}</div>
                </div>
                {completionRate !== null && (
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:completionRate>=80?'#34D399':completionRate>=60?'#FCD34D':'#FCA5A5', letterSpacing:'-0.5px', lineHeight:1 }}>{completionRate}%</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{lang==='sq'?'Kompletimi':'Completion'}</div>
                  </div>
                )}
                {ratingDisplay && (
                  <div>
                    <div style={{ fontSize:22, fontWeight:800, color:'#FCD34D', letterSpacing:'-0.5px', lineHeight:1 }}>★ {ratingDisplay}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:4 }}>{lang==='sq'?'Vlerësimi':'Rating'}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Stat cards ── */}
      <div className="nd-stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {/* Today's visits */}
        <div className="nd-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM, cursor:'pointer' }} onClick={()=>onTodayClick?.()}>
          <div style={{ width:32, height:32, borderRadius:10, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
            <svg width="15" height="15" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:4 }}>{tr('nurse.todayLabel')}</div>
          <div className="nd-stat-val" style={{ fontSize:24, fontWeight:800, color:'#2563EB', letterSpacing:'-0.5px', lineHeight:1 }}>{today.length}</div>
          <div style={{ fontSize:11, color:C.textTertiary, marginTop:4 }}>{lang==='sq'?'sot':'today'}</div>
        </div>
        {/* Total visits */}
        <div className="nd-stat" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM, cursor:'pointer' }} onClick={()=>setActive('visits')}>
          <div style={{ width:32, height:32, borderRadius:10, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
            <svg width="15" height="15" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:4 }}>{tr('nurse.totalVisits')}</div>
          <div className="nd-stat-val" style={{ fontSize:24, fontWeight:800, color:'#059669', letterSpacing:'-0.5px', lineHeight:1 }}>{totalVisits}</div>
          <div style={{ fontSize:11, color:C.textTertiary, marginTop:4 }}>{lang==='sq'?'gjithsej':'all time'}</div>
        </div>
        {/* Earnings — spans full width on mobile */}
        <div className="nd-stat nd-stat-earn" style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM, cursor:'pointer', display:'flex', flexDirection:'column' }} onClick={()=>setActive('earnings')}>
          <div style={{ width:32, height:32, borderRadius:10, background:'#F5F3FF', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, flexShrink:0 }}>
            <svg width="15" height="15" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:4 }}>{tr('nurse.earningsLabel')}</div>
            <div className="nd-stat-val" style={{ fontSize:24, fontWeight:800, color:'#7C3AED', letterSpacing:'-0.5px', lineHeight:1 }}>€{(visits.filter(v=>v.status==='COMPLETED').length*(nurse?.payRatePerVisit||20))}</div>
            <div style={{ fontSize:11, color:C.textTertiary, marginTop:4 }}>{lang==='sq'?'fituar':'earned'}</div>
          </div>
        </div>
      </div>

      {/* ── Available jobs banner ── */}
      {nurse?.status === 'APPROVED' && openJobsCount !== null && (
        <button
          onClick={() => setActive('jobs')}
          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, background:'linear-gradient(135deg,#0F4C8A,#2563EB)', borderRadius:14, padding:'14px 18px', border:'none', cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(37,99,235,0.22)', textAlign:'left' }}
        >
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="17" height="17" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.7)', marginBottom:2 }}>
                {lang==='sq' ? 'Punë të disponueshme' : 'Available jobs'}{nurse?.city ? ` · ${nurse.city}` : ''}
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.3px', lineHeight:1 }}>
                {openJobsCount} {lang==='sq' ? (openJobsCount===1?'vizitë e hapur':'vizita të hapura') : (openJobsCount===1?'open visit':'open visits')}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', borderRadius:99, padding:'6px 14px', flexShrink:0 }}>
            <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{lang==='sq'?'Shfleto':'Browse'}</span>
            <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </button>
      )}

      {/* ── Quick actions ── */}
      <div className="nd-actions" style={{ display:'flex', gap:10 }}>
        <button className="nd-route-btn" onClick={()=>setActive('jobs')} style={{ flex:2, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'#2563EB', color:'#fff', border:'none', borderRadius:12, padding:'13px 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, boxShadow:'0 4px 12px rgba(37,99,235,0.2)' }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          {lang==='sq'?'Shfleto Punët':'Browse Jobs'}
        </button>
        <button onClick={()=>setActive('visits')} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:C.bgWhite, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {lang==='sq'?'Vizitat':'Visits'}
        </button>
        <button onClick={()=>setActive('profile')} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:C.bgWhite, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'13px 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {lang==='sq'?'Profili':'Profile'}
        </button>
      </div>

      {/* ── Mini Calendar ── */}
      <DashboardCalendar visits={visits} lang={lang} onOpenCalendar={()=>setActive('calendar')} onVisitSelect={(v)=>{ setSelectedVisit(v); setActive('map'); }} />

      {/* ── Today's route ── */}
      {today.length > 0 ? (
        <DailyRouteCard lang={lang} visits={today.map(formatVisit)} onVisitSelect={(v)=>{ setSelectedVisit(today.find(vv=>vv.id===v.id)); setActive('map'); }} />
      ) : (
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px dashed ${C.border}`, padding:'36px 24px', textAlign:'center' }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <svg width="22" height="22" fill="none" stroke={C.textTertiary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:C.textSecondary, marginBottom:4 }}>{lang==='sq'?'Asnjë vizitë sot':'No visits scheduled today'}</div>
          <div style={{ fontSize:12, color:C.textTertiary }}>{lang==='sq'?'Shfleto punët e disponueshme.':'Browse available jobs to pick up new visits.'}</div>
          <button className="nd-route-btn" onClick={()=>setActive('jobs')} style={{ marginTop:16, background:'#2563EB', color:'#fff', border:'none', borderRadius:10, padding:'10px 22px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
            {lang==='sq'?'Shfleto Punët':'Browse Jobs'}
          </button>
        </div>
      )}

      {/* ── Upcoming Visits ── */}
      {(() => {
        const todayStr2 = new Date().toISOString().split('T')[0];
        const sevenDays = new Date(); sevenDays.setDate(sevenDays.getDate() + 7);
        const upcoming = visits.filter(v => {
          if (['COMPLETED','CANCELLED'].includes(v.status)) return false;
          const d = new Date(v.scheduledAt);
          const ds = d.toISOString().split('T')[0];
          return ds > todayStr2 && d <= sevenDays;
        }).sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)).slice(0, 4);
        if (!upcoming.length) return null;
        return (
          <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 3px rgba(15,23,42,0.05)' }}>
            <div style={{ padding:'14px 18px 10px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>{lang==='sq'?'Vizita të Ardhshme':'Upcoming Visits'}</div>
              <button onClick={()=>setActive('visits')} style={{ fontSize:12, fontWeight:700, color:C.primary, background:'none', border:'none', cursor:'pointer', fontFamily:F }}>{lang==='sq'?'Shiko të gjitha':'View all'}</button>
            </div>
            <style>{`.nd-upc-row:hover { background:#F8FAFC !important; }`}</style>
            {upcoming.map((v, i) => {
              const d = new Date(v.scheduledAt);
              const dayLabel = d.toLocaleDateString(lang==='sq'?'sq-AL':'en-GB', { weekday:'short', day:'numeric', month:'short' });
              const timeLabel = d.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
              const svc = trService(v.serviceType, lang);
              const statusColors = { ACCEPTED:'#059669', PENDING:'#2563EB', UNASSIGNED:'#D97706' };
              const statusBg = { ACCEPTED:'#ECFDF5', PENDING:'#EFF6FF', UNASSIGNED:'#FFFBEB' };
              const sc = statusColors[v.status] || C.textTertiary;
              const sb = statusBg[v.status] || C.bgSubtle;
              return (
                <div key={v.id} className="nd-upc-row" onClick={()=>setActive('visits')} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderBottom: i < upcoming.length-1 ? `1px solid ${C.borderSubtle}` : 'none', cursor:'pointer', transition:'background 0.15s' }}>
                  <div style={{ width:40, height:40, borderRadius:11, background:'#EFF6FF', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:C.primary, lineHeight:1 }}>{d.getDate()}</div>
                    <div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase' }}>{d.toLocaleDateString('en-GB',{month:'short'})}</div>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{svc}</div>
                    <div style={{ fontSize:11, color:C.textTertiary }}>{dayLabel} · {timeLabel}</div>
                  </div>
                  <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:99, background:sb, color:sc, flexShrink:0 }}>{v.status}</span>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* ── Emergency warning ── */}
      <div style={{ background:'#FFFBEB', border:`1px solid #FDE68A`, borderRadius:12, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style={{ fontSize:13, color:'#92400E' }}>{tr('nurse.emergencyWarning')} <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit, lang='en', visits=[], onStatusChange, initialFilter='all' }) {
  const tr = (key) => t(lang, key);
  const [filter, setFilter] = useState(initialFilter);
  const todayStr = new Date().toISOString().split('T')[0];

  // Counts per tab
  const counts = {
    all:       visits.length,
    today:     visits.filter(v => !['COMPLETED','CANCELLED'].includes(v.status) && new Date(v.scheduledAt).toISOString().split('T')[0] === todayStr).length,
    upcoming:  visits.filter(v => !['COMPLETED','CANCELLED'].includes(v.status)).length,
    completed: visits.filter(v => v.status === 'COMPLETED').length,
  };

  const filtered = visits.filter(v => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      if (['COMPLETED','CANCELLED'].includes(v.status)) return false;
      return new Date(v.scheduledAt).toISOString().split('T')[0] === todayStr;
    }
    if (filter === 'upcoming') return !['COMPLETED','CANCELLED'].includes(v.status);
    if (filter === 'completed') return v.status === 'COMPLETED';
    return true;
  });

  const filterLabels = {
    all:       t(lang,'nurse.visitsFilterAll'),
    today:     lang==='sq' ? 'Sot' : 'Today',
    upcoming:  t(lang,'nurse.visitsFilterUpcoming'),
    completed: t(lang,'nurse.visitsFilterCompleted'),
  };

  if (!visits.length) return (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center', color:C.textTertiary, fontSize:14 }}>
      {t(lang,'nurse.noVisitsAssigned')}
    </div>
  );

  return (
    <div>
      {/* Status tab bar with counts */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {['all','today','upcoming','completed'].map(f => {
          const active = filter === f;
          const count = counts[f];
          return (
            <button key={f} onClick={()=>setFilter(f)} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:99, cursor:'pointer', background:active ? C.primary : C.bgWhite, color:active ? '#fff' : C.textSecondary, border:active ? 'none' : `1px solid ${C.border}`, transition:'all 0.15s' }}>
              {filterLabels[f]}
              <span style={{ fontSize:11, fontWeight:700, padding:'1px 6px', borderRadius:99, background: active ? 'rgba(255,255,255,0.25)' : C.bgSubtle, color: active ? '#fff' : C.textTertiary, minWidth:18, textAlign:'center' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {filtered.map(v => (
          <VisitLocationCard key={v.id} lang={lang} visit={formatVisit(v)} compact={v.status==='COMPLETED'}
            onStatusChange={onStatusChange || ((id,status)=>{})}
            onComplete={(id)=>{ setSelectedVisit(v); setActive('complete'); }} />
        ))}
      </div>
    </div>
  );
}

function MapView({ selectedVisit, setActive, setSelectedVisit, visits=[], onStatusChange, lang='en' }) {
  const upcoming = visits.filter(v=>!['COMPLETED','CANCELLED'].includes(v.status));
  const [selected, setSelected] = useState(selectedVisit||upcoming[0]||null);
  return (
    <div>
      {upcoming.length > 0 && (
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {upcoming.map(v => (
            <button key={v.id} onClick={()=>setSelected(v)} style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:10, cursor:'pointer', background:selected?.id===v.id?C.primary:C.bgWhite, color:selected?.id===v.id?'#fff':C.textSecondary, border:selected?.id===v.id?'none':`1px solid ${C.border}` }}>
              {new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} · {v.relative?.name?.split(' ')[0] || t(lang,'nurse.patientLabel')}
            </button>
          ))}
        </div>
      )}
      {selected ? (
        <VisitLocationCard lang={lang} visit={formatVisit(selected)} onStatusChange={onStatusChange || ((id,status)=>{})} onComplete={(id)=>{ setSelectedVisit(selected); setActive('complete'); }} />
      ) : (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center', color:C.textTertiary, fontSize:14 }}>
          {t(lang,'dashboard.noVisits')}
        </div>
      )}
    </div>
  );
}

function CompleteVisit({ visit, setActive, onComplete, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [form, setForm] = useState({ bp:'', hr:'', glucose:'', temp:'', oxygen:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  if (!visit) return (
    <div style={{ padding:40, textAlign:'center', color:C.textTertiary, fontSize:14 }}>
      {lang==='sq'?'Nuk ka vizitë të zgjedhur. Shko te Vizitat e Mia dhe kliko Përfundo.':'No visit selected. Go to My Visits and click Complete on an active visit.'}
    </div>
  );

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      await api.completeVisit(visit.id, {
        bp: form.bp, hr: form.hr, glucose: form.glucose,
        temperature: form.temp, oxygenSat: form.oxygen, nurseNotes: form.notes,
      });
      setSubmitted(true);
      onComplete && onComplete();
    } catch (err) {
      setError(err.message || tr('nurse.passwordUpdateFailed'));
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:10 }}>{tr('nurse.reportSubmitted')}</h3>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>{tr('nurse.reportSaved')}</p>
      <button onClick={()=>{ setSubmitted(false); setActive('visits'); }} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:600, cursor:'pointer' }}>{tr('nurse.backToVisits')}</button>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.primaryLight, borderRadius:12, padding:'14px 18px', marginBottom:24, border:`1px solid rgba(37,99,235,0.15)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>{visit.relative?.name || visit.clientName || 'Patient'}</div>
          {visit.workOrderNumber && <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:'rgba(37,99,235,0.5)', padding:'2px 8px', borderRadius:99, letterSpacing:'0.5px' }}>{visit.workOrderNumber}</span>}
        </div>
        <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{trService(visit.serviceType, lang)} · {new Date(visit.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
        {visit.relative?.address && <div style={{ fontSize:12, color:'#3B82F6', marginTop:2, opacity:0.8, display:'flex', alignItems:'center', gap:4 }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>{visit.relative.address}</div>}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('nurse.vitals')}</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {[['bp',tr('nurse.bloodPressure'),'128/82'],['hr',tr('nurse.heartRate'),'72'],['glucose',tr('nurse.glucose'),'5.4'],['temp',tr('nurse.temperature'),'36.8'],['oxygen',tr('nurse.oxygen'),'97']].map(([key,label,ph]) => (
            <div key={key}>
              <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:5 }}>{label}</label>
              <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={`e.g. ${ph}`} style={inp} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>{tr('nurse.nurseNotes')}</div>
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder={tr('nurse.notesPlaceholder')} style={{...inp,minHeight:100,resize:'vertical'}} />
      </div>
      {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:9, padding:'11px 14px', fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>}
      <button onClick={handleSubmit} disabled={submitting} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:submitting?'not-allowed':'pointer', opacity:submitting?0.7:1 }}>
        {submitting ? tr('nurse.submitting') : tr('nurse.submitVisitReport')}
      </button>
    </div>
  );
}

function EarningsRow({ visit, payRate, lang }) {
  const [hov, setHov] = useState(false);
  const date = visit.completedAt || visit.scheduledAt;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—';
  const patient = visit.relative?.name || visit.clientName || '—';
  const service = trService(visit.serviceType, lang) || '—';
  return (
    <tr
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ borderBottom:`1px solid ${C.borderSubtle}`, background:hov?C.bgSubtle:C.bgWhite, transition:'background 0.1s' }}>
      <td style={{ padding:'13px 16px', fontSize:13, color:C.textPrimary, whiteSpace:'nowrap', fontWeight:500 }}>
        {fmtDate(date)}
      </td>
      <td style={{ padding:'13px 16px', fontSize:13, color:C.textSecondary }}>
        {patient}
      </td>
      <td style={{ padding:'13px 16px', fontSize:12, color:C.textTertiary, maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
        {service}
      </td>
      <td style={{ padding:'13px 16px' }}>
        <span style={{ fontSize:14, fontWeight:800, color:C.secondary }}>€{payRate}</span>
      </td>
      <td style={{ padding:'13px 16px' }}>
        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
          background:'#ECFDF5', color:'#059669', border:'1px solid #86efac44' }}>
          {lang==='sq'?'E fituar':'Earned'}
        </span>
      </td>
    </tr>
  );
}

function Earnings({ lang='en', nurse=null, visits=[] }) {
  const tr = (key) => t(lang, key);
  const payRate     = nurse?.payRatePerVisit || 20;
  const rating      = nurse?.rating || 0;

  // Use real completed visits for history
  const completedVisits = [...visits]
    .filter(v => v.status === 'COMPLETED')
    .sort((a,b) => new Date(b.completedAt||b.scheduledAt) - new Date(a.completedAt||a.scheduledAt));

  const totalVisits   = completedVisits.length;
  const totalEarnings = totalVisits * payRate;

  const statCards = [
    { label: lang==='sq'?'Fituar gjithsej':'Total Earned',    value:`€${totalEarnings}`, color:C.secondary },
    { label: lang==='sq'?'Gjithsej vizita':'Total Visits',    value:totalVisits,          color:C.primary   },
    { label: lang==='sq'?'Vlerësimi':'Rating',                value:rating>0?rating:'N/A',color:C.warning   },
    { label: lang==='sq'?'Tarifa e pagesës':'Pay Per Visit',  value:`€${payRate}/visit`,  color:C.purple    },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16, fontFamily:F }}>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
        {statCards.map(({ label, value, color }) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px', boxShadow:'0 1px 3px rgba(15,23,42,0.05)' }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.6px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:800, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Monthly Earnings Chart ── */}
      {completedVisits.length > 0 && (() => {
        const now = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          return { key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: d.toLocaleDateString('en-GB', { month:'short' }), year: d.getFullYear(), month: d.getMonth() };
        });
        const earnings = months.map(m => completedVisits.filter(v => {
          const d = new Date(v.completedAt || v.scheduledAt);
          return d.getFullYear() === m.year && d.getMonth() === m.month;
        }).length * payRate);
        const maxE = Math.max(...earnings, 1);
        const total6m = earnings.reduce((a,b) => a+b, 0);
        return (
          <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'20px 22px', boxShadow:'0 1px 3px rgba(15,23,42,0.05)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>{lang==='sq'?'Fitimet 6 Muajt Fundit':'Last 6 Months Earnings'}</div>
                <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>€{total6m} {lang==='sq'?'gjithsej':'total'}</div>
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:C.purple, letterSpacing:'-0.5px' }}>€{total6m}</div>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:72 }}>
              {months.map((m, i) => {
                const h = earnings[i] === 0 ? 4 : Math.max(8, Math.round((earnings[i] / maxE) * 64));
                const isLatest = i === 5;
                return (
                  <div key={m.key} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                    <div style={{ fontSize:9, fontWeight:700, color: earnings[i]>0 ? C.purple : C.textTertiary, letterSpacing:'-0.2px' }}>{earnings[i]>0?`€${earnings[i]}`:''}</div>
                    <div style={{ width:'100%', height:h, borderRadius:'6px 6px 3px 3px', background: isLatest ? 'linear-gradient(180deg,#7C3AED,#4F46E5)' : earnings[i]>0 ? 'rgba(124,58,237,0.35)' : C.bgSubtle, transition:'height 0.3s', minHeight:4 }}/>
                    <div style={{ fontSize:10, fontWeight:600, color: isLatest ? C.textPrimary : C.textTertiary }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Payout info strip */}
      <div style={{ background:'#EFF6FF', borderRadius:10, border:'1px solid #BFDBFE', padding:'11px 16px',
        display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#1E40AF' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>
          {lang==='sq'
            ? <>Pagesat përpunohen javore nëpërmjet Wise. Kontaktoni <strong>hello@vonaxity.com</strong> për pyetje.</>
            : <>Payments processed weekly via Wise. Contact <strong>hello@vonaxity.com</strong> for questions.</>}
        </span>
      </div>

      {/* Per-visit history */}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 3px rgba(15,23,42,0.05)' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>
              {lang==='sq'?'Historia e pagesave':'Payment History'}
            </div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>
              {lang==='sq'?'Tarifa':'Rate'}: <strong style={{ color:C.textPrimary }}>€{payRate} {lang==='sq'?'për vizitë':'per visit'}</strong>
            </div>
          </div>
          <span style={{ fontSize:12, color:C.textTertiary }}>
            {totalVisits} {lang==='sq'?'vizita':'visits'}
          </span>
        </div>

        {completedVisits.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.bgSubtle }}>
                  {[lang==='sq'?'Data':'Date', lang==='sq'?'Pacienti':'Patient',
                    lang==='sq'?'Shërbimi':'Service', lang==='sq'?'Shuma':'Amount',
                    lang==='sq'?'Statusi':'Status'].map(h=>(
                    <th key={h} style={{ padding:'9px 16px', textAlign:'left', fontSize:10,
                      fontWeight:700, color:C.textTertiary, textTransform:'uppercase',
                      letterSpacing:'0.5px', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {completedVisits.map((v,i) => (
                  <EarningsRow key={v.id||i} visit={v} payRate={payRate} lang={lang}/>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'48px 24px', color:C.textTertiary }}>
            <div style={{ width:44, height:44, borderRadius:12, background:C.bgSubtle,
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:C.textSecondary, marginBottom:4 }}>
              {lang==='sq'?'Nuk ka pagesa akoma':'No payments yet'}
            </div>
            <div style={{ fontSize:12, lineHeight:1.7 }}>
              {lang==='sq'
                ? 'Pagesat do të shfaqen pasi të kompletoni vizitat tuaja.'
                : 'Payments will appear here after you complete visits.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nurse Profile Settings ────────────────────────────────────────────────────
// Defined OUTSIDE component to prevent remounting
function NurseSectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function NurseField({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

function BrowseJobs({ nurse, lang='en' }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [allCities, setAllCities] = useState(false);
  const [nurseCity, setNurseCity] = useState('');

  const loadJobs = (showAll) => {
    setLoading(true);
    api.getOpenVisits(showAll)
      .then(data => { setJobs(data.visits || []); setNurseCity(data.nurseCity || ''); })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(false); }, []);

  const handleApply = async (visitId) => {
    setApplying(visitId);
    try {
      await api.applyToVisit(visitId, { message });
      setStatuses(s => ({ ...s, [visitId]: 'applied' }));
      setExpandedJob(null);
      setMessage('');
      loadJobs(allCities);
    } catch (err) {
      setStatuses(s => ({ ...s, [visitId]: err.message || (lang==='sq'?'Aplikimi dështoi':'Failed to apply') }));
    } finally { setApplying(null); }
  };

  const iconPin = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
  const iconCal = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  const iconUser = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const iconNote = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;

  if (nurse?.status !== 'APPROVED') {
    return (
      <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'40px 32px', textAlign:'center' }}>
        <div style={{ width:48, height:48, borderRadius:12, background:C.warningLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>Profile pending approval</div>
        <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.6, maxWidth:320, margin:'0 auto' }}>Your profile is being reviewed by our team. You will receive an email once approved and can then browse and apply to visits.</div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px 22px', animation:'pulse 1.5s ease-in-out infinite' }}>
          <div style={{ height:16, background:C.bgSubtle, borderRadius:6, width:'40%', marginBottom:12 }} />
          <div style={{ height:12, background:C.bgSubtle, borderRadius:6, width:'65%', marginBottom:8 }} />
          <div style={{ height:12, background:C.bgSubtle, borderRadius:6, width:'50%' }} />
        </div>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  );

  if (!jobs.length) return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'56px 24px', textAlign:'center' }}>
      <div style={{ width:48, height:48, borderRadius:12, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </div>
      <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{t(lang,'nurse.noOpenVisits')} {allCities ? t(lang,'nurse.rightNow') : `${t(lang,'nurse.inCity')} ${nurseCity||''}`}</div>
      <div style={{ fontSize:13, color:C.textTertiary, marginBottom:16 }}>{t(lang,'nurse.newRequestsAppear')}</div>
      {!allCities && <button onClick={()=>{ setAllCities(true); loadJobs(true); }} style={{ fontSize:13, fontWeight:600, color:C.primary, background:C.primaryLight, border:'none', borderRadius:8, padding:'8px 18px', cursor:'pointer' }}>{t(lang,'nurse.showAllCities')}</button>}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{jobs.length} {jobs.length!==1?t(lang,'nurse.openVisits'):t(lang,'nurse.openVisit')}</div>
          <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{allCities ? t(lang,'nurse.showingAllCities') : `${t(lang,'nurse.filteredTo')} ${nurseCity||''}`}</div>
        </div>
        <button onClick={()=>{ const v=!allCities; setAllCities(v); loadJobs(v); }} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bgWhite, color:allCities?C.primary:C.textSecondary, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {allCities ? t(lang,'nurse.myCityOnly') : t(lang,'nurse.allCities')}
        </button>
      </div>

      {/* Job cards */}
      <style>{`.jc-apply:hover{background:#1D4ED8!important}.jc-apply{transition:background 0.15s}.jc-card:hover{border-color:#2563EB!important;box-shadow:0 6px 20px rgba(37,99,235,0.08)!important}.jc-card{transition:border-color 0.15s,box-shadow 0.15s}`}</style>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {jobs.map(job => {
          const isExpanded = expandedJob === job.id;
          const applied = job.hasApplied || statuses[job.id] === 'applied';
          const failed = statuses[job.id] && statuses[job.id] !== 'applied';
          const dateStr = new Date(job.scheduledAt).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
          const timeStr = new Date(job.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
          const payRate = job.payRate || 20;
          const postedAgo = job.createdAt ? (() => { const m=Math.floor((Date.now()-new Date(job.createdAt))/60000); return m<60?`${m}m ago`:m<1440?`${Math.floor(m/60)}h ago`:`${Math.floor(m/1440)}d ago`; })() : '';

          return (
            <div key={job.id} className="jc-card" style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${applied?'#6EE7B7':isExpanded?C.primary:C.border}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>

              {/* ── Main card body ── */}
              <div style={{ padding:'18px 20px' }}>
                {/* Top row: service + pay + applied/posted */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:12 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:6 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.2px' }}>{trService(job.serviceType, lang)}</div>
                      {job.workOrderNumber && (
                        <span style={{ fontSize:10, fontWeight:800, color:C.primary, background:C.primaryLight, padding:'2px 9px', borderRadius:99, letterSpacing:'0.6px', border:'1px solid rgba(37,99,235,0.18)' }}>
                          {job.workOrderNumber}
                        </span>
                      )}
                      {applied && <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:99, background:'#ECFDF5', color:'#059669', border:'1px solid rgba(5,150,105,0.2)' }}>✓ {t(lang,'nurse.applied')}</span>}
                    </div>
                    {/* Pay chip */}
                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:'#F5F3FF', borderRadius:99, padding:'4px 11px', border:'1px solid rgba(124,58,237,0.15)' }}>
                      <svg width="12" height="12" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                      <span style={{ fontSize:12, fontWeight:800, color:'#7C3AED' }}>€{payRate} {lang==='sq'?'për vizitë':'per visit'}</span>
                    </div>
                  </div>
                  {postedAgo && <span style={{ fontSize:11, color:C.textTertiary, flexShrink:0, marginTop:2 }}>{postedAgo}</span>}
                </div>

                {/* Info rows */}
                <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
                  {/* Date + time */}
                  <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:C.textSecondary }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#2563EB' }}>{iconCal}</div>
                    <span><strong style={{ color:C.textPrimary }}>{dateStr}</strong> · {timeStr}</span>
                  </div>
                  {/* Location */}
                  <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:C.textSecondary }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#ECFDF5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#059669' }}>{iconPin}</div>
                    <span>{job.relativeAddress || job.city || 'Albania'}</span>
                  </div>
                  {/* Patient */}
                  {(job.relativeName || job.relativeAge) && (
                    <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, color:C.textSecondary }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:C.textTertiary }}>{iconUser}</div>
                      <span>{job.relativeName || t(lang,'nurse.patientLabel')}{job.relativeAge ? `, ${lang==='sq'?'mosha':'age'} ${job.relativeAge}` : ''}</span>
                    </div>
                  )}
                  {/* Booked by client */}
                  {job.postedBy && (
                    <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:C.textTertiary }}>
                      <div style={{ width:28, height:28, borderRadius:8, background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:C.textTertiary }}>{iconUser}</div>
                      <span>{lang==='sq'?'Klienti:':'Client:'} <strong style={{ color:C.textSecondary }}>{job.postedBy}</strong>{job.clientCountry ? ` · ${job.clientCountry}` : ''}</span>
                    </div>
                  )}
                </div>

                {/* Notes strip */}
                {job.notes && (
                  <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'9px 12px', marginBottom:14 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:'#92400E', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'nurse.clientInstructions')}</div>
                    <div style={{ fontSize:12, color:'#78350F', lineHeight:1.6 }}>{job.notes}</div>
                  </div>
                )}

                {/* CTA */}
                {applied ? (
                  <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, color:'#059669', background:'#ECFDF5', borderRadius:10, padding:'11px 14px', border:'1px solid rgba(5,150,105,0.2)' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {lang==='sq'?'Aplikimi u dërgua':'Application submitted'}
                  </div>
                ) : (
                  <button className="jc-apply" onClick={()=>setExpandedJob(isExpanded?null:job.id)} style={{ width:'100%', background:isExpanded?C.bgSubtle:C.primary, color:isExpanded?C.textSecondary:'#fff', border:isExpanded?`1px solid ${C.border}`:'none', borderRadius:10, padding:'12px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
                    {isExpanded ? t(lang,'nurse.close') : t(lang,'nurse.applyArrow')}
                  </button>
                )}
              </div>

              {/* ── Apply panel ── */}
              {isExpanded && !applied && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:'16px 20px', background:'#F8FAFC' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{t(lang,'nurse.messageToClient')} <span style={{ fontWeight:400, color:C.textTertiary }}>({t(lang,'nurse.optional')})</span></div>
                  <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={t(lang,'nurse.messagePlaceholder')} style={{ width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:13, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box', resize:'vertical', minHeight:70, lineHeight:1.5 }} />
                  <div style={{ display:'flex', gap:8, marginTop:10 }}>
                    <button onClick={()=>{ setExpandedJob(null); setMessage(''); }} style={{ padding:'10px 16px', background:'transparent', color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:9, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:F }}>{t(lang,'nurse.cancel')}</button>
                    <button onClick={()=>handleApply(job.id)} disabled={applying===job.id} style={{ flex:1, padding:'10px', background:C.primary, color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, cursor:applying===job.id?'not-allowed':'pointer', opacity:applying===job.id?0.7:1, fontFamily:F }}>
                      {applying===job.id ? t(lang,'nurse.sending') : t(lang,'nurse.submitApplication')}
                    </button>
                  </div>
                </div>
              )}

              {failed && <div style={{ margin:'0 20px 14px', fontSize:12, color:C.error, background:C.errorLight, borderRadius:7, padding:'8px 12px' }}>{statuses[job.id]}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function NurseProfile({ lang='en', nurse=null }) {
  const tr = (key) => t(lang, key);
  const [profile, setProfile] = useState({ name:nurse?.user?.name||nurse?.name||'', email:nurse?.user?.email||nurse?.email||'', phone:nurse?.user?.phone||nurse?.phone||'', city:nurse?.city||'', bio:nurse?.bio||'', licenseNumber:nurse?.licenseNumber||'' });
  const [availability, setAvailability] = useState(nurse?.availability ? JSON.parse(nurse.availability) : []);
  const [specialties, setSpecialties] = useState(nurse?.specialties ? JSON.parse(nurse.specialties) : []);
  const [password, setPassword] = useState({ current:'', newPass:'', confirm:'' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [passStatus, setPassStatus] = useState(null);
  const [passError, setPassError] = useState('');
  const [photoUrl, setPhotoUrl] = useState(nurse?.profilePhotoUrl || null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState(null); // 'success' | 'error'

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true); setPhotoStatus(null);
    try {
      const res = await api.uploadNurseDoc(file, 'photo');
      setPhotoUrl(res.url);
      setPhotoStatus('success');
      setTimeout(() => setPhotoStatus(null), 4000);
    } catch {
      setPhotoStatus('error');
      setTimeout(() => setPhotoStatus(null), 4000);
    } finally { setPhotoUploading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const toggleDay = (day) => setAvailability(prev => prev.includes(day) ? prev.filter(d=>d!==day) : [...prev, day]);
  const toggleSpecialty = (s) => setSpecialties(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);

  const handleSave = async () => {
    setSaving(true); setProfileStatus(null);
    try {
      await api.updateProfile({ name:profile.name, phone:profile.phone, city:profile.city });
      setProfileStatus('success');
      setTimeout(()=>setProfileStatus(null), 4000);
    } catch (err) {
      setProfileStatus('error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPassError('');
    if (!password.current || !password.newPass || !password.confirm) return setPassError(tr('settings.allRequired'));
    if (password.newPass.length < 8) return setPassError(tr('settings.passLength'));
    if (password.newPass !== password.confirm) return setPassError(tr('settings.passMismatch'));
    setSavingPass(true);
    try {
      await api.updatePassword({ currentPassword:password.current, newPassword:password.newPass });
      setPassword({ current:'', newPass:'', confirm:'' });
      setPassStatus('success');
      setTimeout(()=>setPassStatus(null), 4000);
    } catch (err) {
      setPassError(err.message || tr('nurse.passwordUpdateFailed'));
    } finally { setSavingPass(false); }
  };

  const specialtiesArray = nurse?.specialties ? (typeof nurse.specialties === 'string' ? JSON.parse(nurse.specialties) : nurse.specialties) : [];
  const ratingValue = nurse?.rating > 0 ? nurse.rating : null;
  const totalVisits = nurse?.totalVisits || 0;
  const nurseName = nurse?.user?.name || nurse?.name || 'Nurse';
  const nurseInitials = nurseName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const statusMap = { APPROVED:['#ECFDF5','#059669'], PENDING:['#FEF3C7','#D97706'], INCOMPLETE:['#FFFBEB','#D97706'], REJECTED:['#FEF2F2','#DC2626'], SUSPENDED:['#F1F5F9','#475569'] };
  const [statusBg, statusColor] = statusMap[nurse?.status] || statusMap.INCOMPLETE;

  const isPending = (nurse?.status || 'INCOMPLETE') === 'PENDING';

  return (
    <div style={{ maxWidth:620 }}>

      {/* Pending review notice — profile edits locked */}
      {isPending && (
        <div style={{ background:'#EFF6FF', border:'1px solid rgba(37,99,235,0.22)', borderRadius:12, padding:'14px 18px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div style={{ fontSize:13, color:'#1E40AF', lineHeight:1.5 }}>
            <strong>Profile under review.</strong> Your profile details are locked while our team reviews your application. You can still update your password and photo below.
          </div>
        </div>
      )}

      {/* Your Public Profile - Read-only display */}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'24px', marginBottom:28 }}>
        <div style={{ marginBottom:16 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:C.textPrimary, margin:'0 0 4px 0' }}>Your Public Profile</h2>
          <p style={{ fontSize:13, color:C.textSecondary, margin:0 }}>This is what clients see when they find you</p>
        </div>

        <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
          {/* Avatar */}
          <div style={{ flexShrink:0 }}>
            {photoUrl ? (
              <img src={photoUrl} alt={nurseName} style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}` }} />
            ) : (
              <div style={{ width:80, height:80, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff' }}>
                {nurseInitials}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:C.textPrimary, margin:'0 0 8px 0' }}>{nurseName}</h3>

            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ display:'flex', gap:3, alignItems:'center' }}>
                {[1,2,3,4,5].map((idx) => (
                  <svg key={idx} width="14" height="14" viewBox="0 0 24 24" style={{ fill: ratingValue && idx <= Math.round(ratingValue) ? C.warning : '#E5E7EB', stroke: 'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              {ratingValue ? (
                <span style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{ratingValue.toFixed(1)} / 5</span>
              ) : (
                <span style={{ fontSize:13, fontWeight:600, color:C.textSecondary }}>No rating yet</span>
              )}
            </div>

            {/* Visits count */}
            <div style={{ fontSize:13, color:C.textSecondary, marginBottom:10 }}>
              {totalVisits} completed {totalVisits === 1 ? 'visit' : 'visits'}
            </div>

            {/* Specialties */}
            {specialtiesArray.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {specialtiesArray.map((spec) => (
                  <span key={spec} style={{ fontSize:11, fontWeight:500, background:C.secondaryLight, color:C.secondary, padding:'3px 9px', borderRadius:3 }}>
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div style={{ flexShrink:0 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, background:statusBg, color:statusColor, padding:'4px 10px', borderRadius:5 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:statusColor }} />
              {nurse?.status || 'INCOMPLETE'}
            </div>
          </div>
        </div>
      </div>

      {/* Profile photo */}
      <NurseSectionCard title={tr('nurse.changePhoto')} subtitle={tr('nurse.photoHint')}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}` }} />
            ) : (
              <div style={{ width:80, height:80, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#fff' }}>
                {(nurse?.user?.name || nurse?.name || 'N').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
              </div>
            )}
            {photoUploading && (
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:20, height:20, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
              </div>
            )}
          </div>
          <div>
            <label style={{ display:'inline-block', cursor:'pointer', background:C.primary, color:'#fff', borderRadius:10, padding:'10px 18px', fontSize:13, fontWeight:600, boxShadow:'0 2px 8px rgba(37,99,235,0.2)', opacity:photoUploading?0.6:1, pointerEvents:photoUploading?'none':'auto' }}>
              {photoUploading ? tr('nurse.photoUploading') : (photoUrl ? tr('nurse.changePhoto') : tr('nurse.uploadPhoto'))}
              <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={handlePhotoChange} disabled={photoUploading} />
            </label>
            {photoStatus === 'success' && <div style={{ marginTop:8, fontSize:13, fontWeight:600, color:C.secondary }}>✓ {tr('nurse.photoSaved')}</div>}
            {photoStatus === 'error' && <div style={{ marginTop:8, fontSize:13, color:C.error }}>{tr('nurse.photoError')}</div>}
          </div>
        </div>
      </NurseSectionCard>

      {/* Profile info */}
      <NurseSectionCard title={tr('dashboard.personalInfo')} subtitle={tr('dashboard.personalInfoSub')}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <NurseField label={tr('settings.fullName')}>
            <input style={inp} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} />
          </NurseField>
          <NurseField label={tr('settings.email')}>
            <input style={{...inp,background:C.bgSubtle,color:C.textTertiary}} value={profile.email} disabled />
          </NurseField>
          <NurseField label={tr('settings.phone')}>
            <input style={inp} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} placeholder="+355 69 000 0000" />
          </NurseField>
          <NurseField label={tr('dashboard.city')}>
            <select style={{...inp}} value={profile.city} onChange={e=>setProfile({...profile,city:e.target.value})}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </NurseField>
        </div>
        <NurseField label={tr('onboarding.licenseNumber')}>
          <input style={inp} value={profile.licenseNumber} onChange={e=>setProfile({...profile,licenseNumber:e.target.value})} placeholder="ALB-NURSE-XXXX-XXX" />
        </NurseField>
        <NurseField label={tr('onboarding.bioLabel')}>
          <textarea style={{...inp,minHeight:90,resize:'vertical'}} value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} placeholder={tr('onboarding.bioSub')} />
        </NurseField>
      </NurseSectionCard>

      {/* Availability */}
      <NurseSectionCard title={tr('onboarding.availabilityTitle')} subtitle={tr('onboarding.availabilitySub')}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {DAYS.map((day, i) => {
            const dayLabels = t(lang,'nurse.daysShort');
            const label = Array.isArray(dayLabels) ? dayLabels[i] : day.slice(0,3);
            return (
              <button key={day} onClick={()=>toggleDay(day)} style={{ fontSize:13, fontWeight:600, padding:'9px 16px', borderRadius:10, border:`1.5px solid ${availability.includes(day)?C.primary:C.border}`, background:availability.includes(day)?C.primaryLight:'transparent', color:availability.includes(day)?C.primary:C.textSecondary, cursor:'pointer', transition:'all 0.15s' }}>
                {label}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:12, fontSize:12, color:C.textTertiary }}>
          {availability.length === 0 ? tr('nurse.noDaysSelected') : `${tr('nurse.availablePrefix')}: ${availability.map((d,_) => { const dayLabels=t(lang,'nurse.days'); const idx=DAYS.indexOf(d); return Array.isArray(dayLabels)&&idx>=0?dayLabels[idx]:d; }).join(', ')}`}
        </div>
      </NurseSectionCard>

      {/* Specialties */}
      <NurseSectionCard title={tr('nurse.specialtiesTitle')} subtitle={tr('nurse.specialtiesSub')}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {SPECIALTIES_LIST.map(s => (
            <button key={s} onClick={()=>toggleSpecialty(s)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:99, border:`1.5px solid ${specialties.includes(s)?C.secondary:C.border}`, background:specialties.includes(s)?C.secondaryLight:'transparent', color:specialties.includes(s)?C.secondary:C.textSecondary, cursor:'pointer', transition:'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>
      </NurseSectionCard>

      {/* Stats overview */}
      <NurseSectionCard title={tr('nurse.profileStats')} subtitle={tr('nurse.profileStatsSub')}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12 }}>
          {[[tr('nurse.rating'),nurse?.rating>0?nurse.rating:'N/A',C.warning],[tr('nurse.totalVisits'),nurse?.totalVisits||0,C.primary],[tr('nurse.totalEarned'),`€${nurse?.totalEarnings||0}`,C.secondary],[tr('nurse.statusLabel'),nurse?.status||'PENDING',C.secondary]].map(([label,value,color]) => (
            <div key={label} style={{ background:C.bgSubtle, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:16, fontWeight:700, color }}>{value}</div>
            </div>
          ))}
        </div>
      </NurseSectionCard>

      {/* Save button */}
      {profileStatus==='success' && (
        <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:C.secondary }}>{tr('nurse.profileSavedSuccess')}</span>
        </div>
      )}
      {profileStatus==='error' && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <span style={{ fontSize:14, color:C.error }}>{tr('settings.savedError')}</span>
        </div>
      )}
      <button onClick={isPending ? undefined : handleSave} disabled={saving || isPending} style={{ width:'100%', background:isPending?C.textTertiary:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:isPending?'not-allowed':'pointer', marginBottom:28, opacity:saving||isPending?0.5:1, boxShadow: isPending?'none':'0 2px 8px rgba(37,99,235,0.2)' }}>
        {isPending ? (
          <span style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Locked — under review
          </span>
        ) : saving ? tr('dashboard.saving') : tr('dashboard.saveProfile')}
      </button>

      {/* Security */}
      <NurseSectionCard title={tr('settings.security')} subtitle={tr('settings.securitySub')}>
        <NurseField label={tr('settings.currentPassword')}>
          <input style={inp} type="password" value={password.current} onChange={e=>setPassword({...password,current:e.target.value})} placeholder="••••••••" />
        </NurseField>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <NurseField label={tr('settings.newPassword')}>
            <input style={inp} type="password" value={password.newPass} onChange={e=>setPassword({...password,newPass:e.target.value})} placeholder="Min 8" />
          </NurseField>
          <NurseField label={tr('settings.confirmPassword')}>
            <input style={inp} type="password" value={password.confirm} onChange={e=>setPassword({...password,confirm:e.target.value})} placeholder="••••••••" />
          </NurseField>
        </div>
        {passError && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.error }}>{passError}</div>}
        {passStatus==='success' && <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.secondary, fontWeight:600 }}>{tr('nurse.passwordUpdated')}</div>}
        <button onClick={handleChangePassword} disabled={savingPass} style={{ background:C.bgSubtle, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:savingPass?0.7:1 }}>
          {savingPass ? tr('settings.updating') : tr('settings.updatePassword')}
        </button>
      </NurseSectionCard>

    </div>
  );
}

// ── Onboarding ────────────────────────────────────────────────────────────────

function OnboardingBanner({ nurse, onStartOnboarding, lang='en' }) {
  const status = nurse?.status || 'INCOMPLETE';
  if (status === 'APPROVED') return null;

  const tr = (k) => t(lang, k);
  const configs = {
    INCOMPLETE: { bg:'#FEF3C7', border:'#FDE68A', color:'#92400E', title:tr('nurse.completeProfile'), sub:tr('nurse.completeProfileSub'), btn:tr('nurse.completeBtn'), btnColor:C.warning },
    PENDING: { bg:C.primaryLight, border:'rgba(37,99,235,0.2)', color:'#1E40AF', title:tr('nurse.underReview'), sub:tr('nurse.underReviewSub'), btn:null },
    REJECTED: { bg:C.errorLight, border:'#FECACA', color:C.error, title:tr('nurse.applicationRejected'), sub:nurse?.rejectionReason||tr('nurse.underReviewSub'), btn:tr('nurse.updateResubmit'), btnColor:C.error },
    SUSPENDED: { bg:C.errorLight, border:'#FECACA', color:C.error, title:tr('nurse.accountSuspended'), sub:tr('nurse.accountSuspended'), btn:null },
  };

  const cfg = configs[status] || configs.INCOMPLETE;
  return (
    <div style={{ background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:14, padding:'20px 22px', marginBottom:24 }}>
      <div style={{ fontSize:15, fontWeight:700, color:cfg.color, marginBottom:6 }}>{cfg.title}</div>
      <div style={{ fontSize:13, color:cfg.color, opacity:0.85, lineHeight:1.6, marginBottom:cfg.btn?14:0 }}>{cfg.sub}</div>
      {cfg.btn && <button onClick={onStartOnboarding} style={{ fontSize:13, fontWeight:700, padding:'9px 20px', borderRadius:9, border:'none', background:cfg.btnColor, color:'#fff', cursor:'pointer' }}>{cfg.btn}</button>}
    </div>
  );
}

function tryParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

function OnboardingWizard({ nurse, user, onComplete, onSave, lang='en' }) {
  const nurseStatus = nurse?.status || 'INCOMPLETE';
  const isLocked = nurseStatus === 'PENDING';
  const isRejected = nurseStatus === 'REJECTED';
  const tr = (k) => t(lang, k);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    city: nurse?.city || '',
    bio: nurse?.bio || '',
    experience: nurse?.experience || '',
    languages: tryParse(nurse?.languages, []),
    services: tryParse(nurse?.services, []),
    licenseNumber: nurse?.licenseNumber || '',
    issuingAuthority: nurse?.issuingAuthority || '',
    availability: tryParse(nurse?.availability, []),
    diplomaConfirmed: !!nurse?.diplomaUrl,
    licenseConfirmed: !!nurse?.licenseUrl,
    diplomaUrl: nurse?.diplomaUrl || null,
    licenseUrl: nurse?.licenseUrl || null,
  });

  const toggle = (key, val) => setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key], val] }));

  const inp2 = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        city: form.city, bio: form.bio, experience: form.experience,
        languages: form.languages, services: form.services,
        licenseNumber: form.licenseNumber, issuingAuthority: form.issuingAuthority,
        availability: form.availability,
        diplomaUrl: form.diplomaUrl || null,
        licenseUrl: form.licenseUrl || null,
      });
    } finally { setSaving(false); }
  };

  const handleSubmit = async () => {
    if (!form.city || !form.bio || !form.licenseNumber || !form.issuingAuthority) {
      setError(tr('onboarding.fillRequiredFields')); return;
    }
    if (!form.diplomaUrl || !form.licenseUrl) {
      setError(tr('onboarding.confirmDocuments')); return;
    }
    setSubmitting(true); setError('');
    try {
      await onComplete({
        city: form.city, bio: form.bio, experience: form.experience,
        languages: form.languages, services: form.services,
        licenseNumber: form.licenseNumber, issuingAuthority: form.issuingAuthority,
        availability: form.availability,
        diplomaUrl: form.diplomaUrl, licenseUrl: form.licenseUrl,
      });
    } catch (err) {
      setError(err.message || tr('onboarding.fillRequiredFields'));
    } finally { setSubmitting(false); }
  };

  const STEPS = [tr('onboarding.step1'),tr('onboarding.step2'),tr('onboarding.step3'),tr('onboarding.step4'),tr('onboarding.step5')];

  /* ── Locked view for PENDING status ── */
  if (isLocked) {
    return (
      <div style={{ maxWidth:620 }}>
        <div style={{ background:'#EFF6FF', border:'1px solid rgba(37,99,235,0.25)', borderRadius:14, padding:'24px 22px', marginBottom:20 }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'#DBEAFE', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#1E40AF', marginBottom:6 }}>{tr('nurse.underReview')}</div>
              <div style={{ fontSize:14, color:'#3B82F6', lineHeight:1.6 }}>{tr('nurse.underReviewSub')}</div>
            </div>
          </div>
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:14 }}>Submitted profile summary</div>
          {[['City', nurse?.city],['Experience', nurse?.experience],['License No.', nurse?.licenseNumber]].filter(([,v])=>v).map(([k,v]) => (
            <div key={k} style={{ display:'flex', gap:10, marginBottom:10 }}>
              <div style={{ fontSize:12, color:C.textTertiary, width:100, flexShrink:0 }}>{k}</div>
              <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{v}</div>
            </div>
          ))}
          {nurse?.bio && <div style={{ marginTop:10, padding:'12px 14px', background:C.bgSubtle, borderRadius:10, fontSize:13, color:C.textSecondary, lineHeight:1.6 }}>{nurse.bio}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:620 }}>
      {/* Rejection notice */}
      {isRejected && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:14, padding:'18px 20px', marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:700, color:C.error, marginBottom:4 }}>{tr('nurse.applicationRejected')}</div>
          <div style={{ fontSize:13, color:'#991B1B', lineHeight:1.6 }}>{nurse?.rejectionReason || tr('nurse.underReviewSub')}</div>
          <div style={{ marginTop:10, fontSize:12, color:C.error, fontWeight:600 }}>Update your profile below and submit again.</div>
        </div>
      )}
      {/* Step indicator */}
      <div style={{ display:'flex', gap:4, marginBottom:28 }}>
        {STEPS.map((s,i) => (
          <div key={s} style={{ flex:1, textAlign:'center' }}>
            <div style={{ height:4, borderRadius:99, background:step>i+1?C.secondary:step===i+1?C.primary:C.border, marginBottom:6, transition:'background 0.2s' }}/>
            <div style={{ fontSize:10, color:step>=i+1?C.textPrimary:C.textTertiary, fontWeight:step===i+1?700:400 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Profile */}
      {step===1 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{tr('onboarding.profileTitle')}</div>
          <div style={{ fontSize:13, color:C.textTertiary, marginBottom:20 }}>{tr('onboarding.profileSub')}</div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('dashboard.city')} <span style={{ color:C.error }}>*</span></label>
            <select style={inp2} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}>
              <option value="">{tr('onboarding.selectCity')}</option>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('dashboard.experience')}</label>
            <select style={inp2} value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))}>
              <option value="">{tr('onboarding.selectExp')}</option>
              {EXPERIENCE_LIST.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('onboarding.bioLabel')} <span style={{ color:C.error }}>*</span></label>
            <textarea style={{...inp2, minHeight:90, resize:'vertical'}} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder={tr('onboarding.bioSub')} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:8 }}>{tr('onboarding.languages')}</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {LANGUAGES_LIST.map(l=>(
                <button key={l} type="button" onClick={()=>toggle('languages',l)} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:99, border:`1.5px solid ${form.languages.includes(l)?C.primary:C.border}`, background:form.languages.includes(l)?C.primaryLight:'transparent', color:form.languages.includes(l)?C.primary:C.textSecondary, cursor:'pointer' }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Services */}
      {step===2 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{tr('onboarding.services')} <span style={{ color:C.error }}>*</span></div>
          <div style={{ fontSize:13, color:C.textTertiary, marginBottom:20 }}>{tr('nurse.specialtiesSub')}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {SERVICES_LIST.map(s=>(
              <button key={s} type="button" onClick={()=>toggle('services',s)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', borderRadius:99, border:`1.5px solid ${form.services.includes(s)?C.secondary:C.border}`, background:form.services.includes(s)?C.secondaryLight:'transparent', color:form.services.includes(s)?C.secondary:C.textSecondary, cursor:'pointer' }}>{s}</button>
            ))}
          </div>
          {form.services.length===0 && <div style={{ fontSize:12, color:C.textTertiary, marginTop:12 }}>{tr('onboarding.servicesRequired')}</div>}
        </div>
      )}

      {/* Step 3: Verification */}
      {step===3 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{tr('onboarding.verificationTitle')}</div>
          <div style={{ fontSize:13, color:C.textTertiary, marginBottom:16 }}>{tr('onboarding.verificationSub')}</div>
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'10px 14px', marginBottom:20, fontSize:12, color:'#92400E' }}>
            {tr('onboarding.verificationWarning')}
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('onboarding.licenseNumber')} <span style={{ color:C.error }}>*</span></label>
            <input style={inp2} value={form.licenseNumber} onChange={e=>setForm(f=>({...f,licenseNumber:e.target.value}))} placeholder="e.g. ALB-NURSE-2024-001" />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('onboarding.issuingAuthority')} <span style={{ color:C.error }}>*</span></label>
            <input style={inp2} value={form.issuingAuthority} onChange={e=>setForm(f=>({...f,issuingAuthority:e.target.value}))} placeholder="Order of Nurses of Albania (ONA)" />
          </div>
          {[[`diploma`,tr('onboarding.diplomaTitle'),tr('onboarding.diplomaDesc')],[`license`,tr('onboarding.licenseTitle'),tr('onboarding.licenseDesc')]].map(([docType,title,desc])=>(
            <div key={docType} style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:12, color:C.textSecondary, marginBottom:10 }}>{desc}</div>
              {form[`${docType}Url`] && form[`${docType}Url`] !== 'pending-upload' ? (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px', background:C.secondaryLight, borderRadius:10, border:'1px solid #6EE7B7' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span style={{ fontSize:13, color:C.secondary, fontWeight:600 }}>{_currentLang==='sq'?'U ngarkua me sukses':'Uploaded successfully'}</span>
                  <a href={form[`${docType}Url`]} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:C.primary, marginLeft:'auto' }}>{_currentLang==='sq'?'Shiko →':'View →'}</a>
                </div>
              ) : (
                <label style={{ display:'block', border:`2px dashed ${C.border}`, borderRadius:10, padding:'16px', textAlign:'center', cursor:'pointer' }}>
                  <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" style={{ display:'none' }} onChange={async (e)=>{
                    const file = e.target.files[0];
                    if (!file) return;
                    setError('');
                    try {
                      setSaving(true);
                      const data = await api.uploadNurseDoc(file, docType);
                      setForm(f=>({...f,[`${docType}Url`]:data.url,[`${docType}Confirmed`]:true}));
                    } catch(err) { setError(err.message||tr('onboarding.uploadFailed')); }
                    finally { setSaving(false); }
                  }} />
                  <div style={{ color:C.textTertiary, fontSize:12 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{display:'block',margin:'0 auto 6px'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    {tr('onboarding.clickUpload')}
                  </div>
                </label>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 4: Availability */}
      {step===4 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{tr('onboarding.step4')}</div>
          <div style={{ fontSize:13, color:C.textTertiary, marginBottom:20 }}>{tr('onboarding.availabilitySub')||(_currentLang==='sq'?'Zgjidhni ditët kur jeni të disponueshëm për vizita.':'Select which days you are available for home visits.')}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {DAYS.map((day,i)=>(
              <button key={day} type="button" onClick={()=>toggle('availability',day)} style={{ padding:'10px 16px', borderRadius:10, border:`1.5px solid ${form.availability.includes(day)?C.primary:C.border}`, background:form.availability.includes(day)?C.primaryLight:'transparent', color:form.availability.includes(day)?C.primary:C.textSecondary, fontSize:13, fontWeight:600, cursor:'pointer' }}>
                {t(_currentLang,'nurse.daysShort')[i]||day.slice(0,3)}
              </button>
            ))}
          </div>
          {form.availability.length>0 && <div style={{ fontSize:12, color:C.textTertiary, marginTop:10 }}>{tr('nurse.availablePrefix')}: {form.availability.map(d=>{ const i=DAYS.indexOf(d); return i>=0?(t(_currentLang,'nurse.daysShort')[i]||d):d; }).join(', ')}</div>}
          <div style={{ background:C.primaryLight, borderRadius:10, padding:'12px 14px', marginTop:16, fontSize:12, color:'#1E40AF' }}>
            {_currentLang==='sq'?'Mund të përditësoni disponueshmërinë tuaj në çdo kohë nga cilësimet e profilit.':'You can update your availability anytime from your profile settings.'}
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {step===5 && (
        <div>
          <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:16 }}>{tr('onboarding.reviewTitle')}</div>
            {[[tr('onboarding.reviewCity'),form.city||tr('onboarding.notSet')],[tr('onboarding.reviewExperience'),form.experience||tr('onboarding.notSet')],[tr('onboarding.reviewServices'),form.services.join(', ')||tr('onboarding.noneSelected')],[tr('onboarding.reviewLanguages'),form.languages.join(', ')||(_currentLang==='sq'?'Shqip':'Albanian')],[tr('onboarding.reviewLicense'),form.licenseNumber||tr('onboarding.notSet')],[tr('onboarding.reviewAuthority'),form.issuingAuthority||tr('onboarding.notSet')],[tr('onboarding.reviewDiploma'),form.diplomaUrl&&form.diplomaUrl!=='pending-upload'?tr('onboarding.uploadedDoc'):tr('onboarding.notUploaded')],[tr('onboarding.reviewLicenseDoc'),form.licenseUrl&&form.licenseUrl!=='pending-upload'?tr('onboarding.uploadedDoc'):tr('onboarding.notUploaded')],[tr('onboarding.reviewDays'),form.availability.map(d=>{ const i=DAYS.indexOf(d); return i>=0?(t(_currentLang,'nurse.daysShort')[i]||d):d; }).join(', ')||tr('onboarding.noneSelected')]].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle||'#F3F4F6'}`, fontSize:13 }}>
                <span style={{ color:C.textTertiary }}>{k}</span>
                <span style={{ color:v===tr('onboarding.notSet')||v===tr('onboarding.noneSelected')||v===tr('onboarding.notUploaded')?C.error:C.textPrimary, fontWeight:500, textAlign:'right', maxWidth:'60%' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#92400E' }}>
            {tr('onboarding.submitWarning')}
          </div>
          {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13, color:C.error }}>{error}</div>}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display:'flex', gap:10 }}>
        {step>1 && <button onClick={()=>{setStep(s=>s-1);setError('');}} style={{ flex:1, background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer' }}>{tr('onboarding.back')}</button>}
        <button onClick={handleSave} disabled={saving} style={{ padding:'12px 18px', background:C.bgWhite, color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer', opacity:saving?0.7:1 }}>
          {saving?tr('onboarding.saving'):tr('onboarding.save')}
        </button>
        {step<5 && (
          <button onClick={()=>setStep(s=>s+1)} disabled={
            (step===1 && (!form.city||!form.bio)) ||
            (step===2 && form.services.length===0) ||
            (step===3 && (!form.licenseNumber||!form.issuingAuthority)) ||
            (step===4 && form.availability.length===0)
          } style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:(step===1&&(!form.city||!form.bio))||(step===2&&form.services.length===0)||(step===3&&(!form.licenseNumber||!form.issuingAuthority))||(step===4&&form.availability.length===0)?0.5:1 }}>
            {tr('onboarding.continue')}
          </button>
        )}
        {step===5 && (
          <button onClick={handleSubmit} disabled={submitting} style={{ flex:2, background:C.secondary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:700, cursor:'pointer', opacity:submitting?0.7:1 }}>
            {submitting?tr('onboarding.submitting'):tr('onboarding.submit')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Nurse Calendar ────────────────────────────────────────────────────────────
function NurseCalendar({ visits = [], lang = 'en', setActive, setSelectedVisit }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const MONTH_NAMES_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const MONTH_NAMES_SQ = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'];
  const DAY_NAMES_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const DAY_NAMES_SQ = ['Hën','Mar','Mër','Enj','Pre','Sht','Die'];
  const monthName = lang === 'sq' ? MONTH_NAMES_SQ[month] : MONTH_NAMES_EN[month];
  const dayNames = lang === 'sq' ? DAY_NAMES_SQ : DAY_NAMES_EN;

  // Build visit index: { 'YYYY-MM-DD': [visit, ...] }
  const visitsByDate = {};
  visits.forEach(v => {
    const d = new Date(v.scheduledAt).toISOString().split('T')[0];
    if (!visitsByDate[d]) visitsByDate[d] = [];
    visitsByDate[d].push(v);
  });

  // Build calendar grid (Monday-first)
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;
  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDow + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) { cells.push(null); continue; }
    const pad = n => String(n).padStart(2,'0');
    const dateStr = `${year}-${pad(month+1)}-${pad(dayNum)}`;
    cells.push({ day: dayNum, dateStr, visits: visitsByDate[dateStr] || [] });
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); setSelectedDay(null); };

  const todayStr = now.toISOString().split('T')[0];
  const selectedCell = selectedDay ? cells.find(c => c?.dateStr === selectedDay) : null;

  const statusColor = (s) => {
    if (!s) return '#2563EB';
    const u = s.toUpperCase();
    if (u === 'COMPLETED') return '#059669';
    if (u === 'CANCELLED') return '#DC2626';
    return '#2563EB';
  };

  const statusBg = (s) => statusColor(s) + '18';

  // Count visits this month for the header summary
  const monthVisitsCount = cells.reduce((acc, c) => acc + (c ? c.visits.length : 0), 0);

  return (
    <div>
      <style>{`
        .cal-chip { transition: opacity 0.12s, transform 0.12s; }
        .cal-chip:hover { opacity: 0.85; transform: translateX(1px); }
        .cal-cell { transition: background 0.1s; }
        .cal-cell:hover { background: #F1F5F9 !important; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px' }}>
            {lang==='sq'?'Kalendari':'Work Calendar'}
          </div>
          <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>
            {monthVisitsCount} {lang==='sq'?'vizitë këtë muaj':'visits this month'}
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=>{ setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDay(todayStr); }} style={{ fontSize:12, fontWeight:600, color:C.primary, background:C.primaryLight, border:`1px solid ${C.primary}30`, borderRadius:8, padding:'6px 12px', cursor:'pointer', fontFamily:F }}>
            {lang==='sq'?'Sot':'Today'}
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:SSM }}>
        {/* Month nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:`1px solid ${C.border}`, background:'#F8FAFC' }}>
          <button onClick={prevMonth} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:C.bgWhite, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ fontSize:15, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px' }}>{monthName} {year}</div>
          <button onClick={nextMonth} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:C.bgWhite, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Day-name headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', borderBottom:`1px solid ${C.border}` }}>
          {dayNames.map((d,i) => (
            <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color: i >= 5 ? '#94A3B8' : C.textTertiary, letterSpacing:'0.6px', textTransform:'uppercase', padding:'8px 0', background:'#FAFAFA', borderRight: i < 6 ? `1px solid ${C.border}` : 'none' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid — each cell is a real box with visit chips */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)' }}>
          {cells.map((cell, i) => {
            if (!cell) {
              return (
                <div key={`empty-${i}`} style={{ minHeight:88, background:'#FAFAFA', borderRight: i%7 < 6 ? `1px solid ${C.border}` : 'none', borderBottom: i < totalCells-7 ? `1px solid ${C.border}` : 'none' }} />
              );
            }
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDay;
            const isPast = cell.dateStr < todayStr;
            const isSat = (i % 7) === 5;
            const isSun = (i % 7) === 6;
            const isWeekend = isSat || isSun;
            const hasVisits = cell.visits.length > 0;

            return (
              <div
                key={cell.dateStr}
                className="cal-cell"
                onClick={() => setSelectedDay(isSelected ? null : cell.dateStr)}
                style={{
                  minHeight:88,
                  padding:'6px 5px',
                  cursor:'pointer',
                  background: isSelected ? '#EFF6FF' : isToday ? '#FFFBEB' : isWeekend ? '#FAFAFA' : C.bgWhite,
                  borderRight: i%7 < 6 ? `1px solid ${C.border}` : 'none',
                  borderBottom: i < totalCells-7 ? `1px solid ${C.border}` : 'none',
                  position:'relative',
                  verticalAlign:'top',
                }}
              >
                {/* Day number */}
                <div style={{
                  width:22, height:22, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4,
                  background: isToday ? C.primary : 'transparent',
                  color: isToday ? '#fff' : isPast ? C.textTertiary : isWeekend ? '#94A3B8' : C.textPrimary,
                  fontSize:11, fontWeight: isToday || hasVisits ? 800 : 500,
                }}>
                  {cell.day}
                </div>

                {/* Visit chips */}
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {cell.visits.slice(0,3).map((v, vi) => {
                    const col = statusColor(v.status);
                    const time = new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
                    const wo = v.workOrderNumber ? `WO-${v.workOrderNumber}` : `#${v.id?.slice(-4)?.toUpperCase()}`;
                    const svc = trService(v.serviceType, lang);
                    return (
                      <div
                        key={v.id || vi}
                        className="cal-chip"
                        onClick={e => { e.stopPropagation(); setSelectedVisit(v); setActive('complete'); }}
                        style={{
                          background: statusBg(v.status),
                          borderLeft:`2.5px solid ${col}`,
                          borderRadius:'0 5px 5px 0',
                          padding:'2px 5px',
                          cursor:'pointer',
                          overflow:'hidden',
                        }}
                      >
                        <div style={{ fontSize:9, fontWeight:800, color:col, letterSpacing:'0.2px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{time} · {wo}</div>
                        <div style={{ fontSize:9, fontWeight:500, color:C.textSecondary, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{svc}</div>
                      </div>
                    );
                  })}
                  {cell.visits.length > 3 && (
                    <div style={{ fontSize:9, fontWeight:700, color:C.primary, paddingLeft:4 }}>+{cell.visits.length - 3} {lang==='sq'?'më shumë':'more'}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, marginTop:12, flexWrap:'wrap' }}>
        {[['#2563EB', lang==='sq'?'Planifikuar':'Scheduled'], ['#059669', lang==='sq'?'Kompletuar':'Completed'], ['#DC2626', lang==='sq'?'Anuluar':'Cancelled']].map(([col, label]) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:C.textSecondary }}>
            <div style={{ width:10, height:10, borderRadius:3, background:col+'22', borderLeft:`3px solid ${col}` }} />
            {label}
          </div>
        ))}
        <div style={{ marginLeft:'auto', fontSize:12, color:C.textTertiary }}>
          {lang==='sq'?'Klikoni vizitën për detaje':'Click a visit chip to open details'}
        </div>
      </div>

      {/* Selected day detail panel */}
      {selectedCell && (
        <div style={{ marginTop:16, background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:SSM }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, background:'#F8FAFC', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>
                {new Date(selectedCell.dateStr+'T12:00:00').toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'long',day:'numeric',month:'long'})}
              </div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>
                {selectedCell.visits.length === 0
                  ? (lang==='sq'?'Asnjë vizitë e planifikuar':'No visits scheduled')
                  : `${selectedCell.visits.length} ${lang==='sq'?'vizitë':'visit'}${selectedCell.visits.length > 1 && lang!=='sq' ? 's':''} ${lang==='sq'?'të planifikuara':''}`}
              </div>
            </div>
            <button onClick={()=>setSelectedDay(null)} style={{ width:28,height:28,borderRadius:8,border:`1px solid ${C.border}`,background:C.bgWhite,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:C.textTertiary }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {selectedCell.visits.length === 0 ? (
            <div style={{ padding:'28px 18px', textAlign:'center' }}>
              <svg width="32" height="32" fill="none" stroke="#CBD5E1" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom:8 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div style={{ color:C.textTertiary, fontSize:13 }}>{lang==='sq'?'Shfleto punët për të marrë vizita të reja.':'Browse jobs to pick up new visits.'}</div>
              <button onClick={()=>setActive('jobs')} style={{ marginTop:12, fontSize:12, fontWeight:600, color:C.primary, background:C.primaryLight, border:`1px solid ${C.primary}30`, borderRadius:8, padding:'6px 14px', cursor:'pointer', fontFamily:F }}>
                {lang==='sq'?'Shfleto Punët':'Browse Jobs'}
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column' }}>
              {selectedCell.visits.map((v, i) => {
                const time = new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
                const col = statusColor(v.status);
                const svc = trService(v.serviceType, lang);
                const wo = v.workOrderNumber ? `WO-${v.workOrderNumber}` : `#${v.id?.slice(-6)?.toUpperCase()}`;
                return (
                  <div
                    key={v.id}
                    onClick={()=>{ setSelectedVisit(v); setActive('complete'); }}
                    style={{ padding:'14px 18px', borderBottom: i < selectedCell.visits.length-1 ? `1px solid ${C.border}` : 'none', display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#F8FAFC'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    {/* Time + WO block */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, flexShrink:0 }}>
                      <div style={{ fontSize:14, fontWeight:800, color:col, background:col+'18', borderRadius:8, padding:'5px 8px', textAlign:'center', minWidth:50 }}>{time}</div>
                      <div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, letterSpacing:'0.3px' }}>{wo}</div>
                    </div>

                    {/* Service + patient */}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:2 }}>{svc}</div>
                      <div style={{ fontSize:12, color:C.textSecondary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {v.relative?.name || (lang==='sq'?'Pacient':'Patient')}{v.relative?.address ? ` · ${v.relative.address}` : ''}
                      </div>
                    </div>

                    {/* Status badge */}
                    <div style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:99, background:col+'18', color:col, textTransform:'uppercase', letterSpacing:'0.5px', flexShrink:0 }}>
                      {v.status?.replace(/_/g,' ')}
                    </div>

                    {/* Arrow */}
                    <svg width="14" height="14" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main nurse page ────────────────────────────────────────────────────────────
export default function NursePage({ params }) {
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [visitsInitialFilter, setVisitsInitialFilter] = useState('all');
  const navigateTo = (section) => {
    if (section === 'visits') setVisitsInitialFilter('all');
    setActive(section);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState(params?.lang || 'en');
  _currentLang = lang; // Update module-level tr
  const switchLang = (l) => { setLang(l); document.cookie=`vonaxity-locale=${l};path=/;max-age=31536000`; localStorage.setItem('vonaxity-lang',l); };
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [nurse, setNurse] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('vonaxity-token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const [nurseRes, visitsRes] = await Promise.all([
        fetch(`${BASE}/nurses/me`, { headers }),
        fetch(`${BASE}/visits`, { headers }),
      ]);
      const nurseData = await nurseRes.json();
      const visitsData = await visitsRes.json();
      if (nurseData.nurse) setNurse(nurseData.nurse);
      if (visitsData.visits) setVisits(visitsData.visits);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusChange = async (visitId, status) => {
    try {
      const apiStatus = status.toUpperCase().replace(/ /g, '_');
      await api.updateVisitStatus(visitId, apiStatus);
      setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: apiStatus } : v));
      toastSuccess(t(_currentLang, 'nurse.updateStatus') + ': ' + apiStatus.replace(/_/g,' '));
    } catch (err) { toastError(err.message || 'Failed to update status'); }
  };

  const handleSave = async (formData) => { await api.saveNurseProfile(formData); };
  const handleComplete = async (formData) => {
    await api.submitNurseOnboarding(formData);
    setNurse(prev => ({...prev, status:'PENDING'}));
    setActive('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('vonaxity-token');
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const displayNurse = { name: nurse?.user?.name||nurse?.name||'Nurse', email: nurse?.user?.email||'', city: nurse?.city||'', rating: nurse?.rating||0, totalVisits: nurse?.totalVisits||0, totalEarnings: nurse?.totalEarnings||0, status: nurse?.status||'INCOMPLETE', ...nurse, initials:(nurse?.user?.name||nurse?.name||'N').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() };
  const TITLES = { dashboard:tr('nurse.dashboard'), jobs:tr('nurse.browseJobs'), visits:tr('nurse.myVisits'), calendar: lang==='sq'?'Kalendar':'Calendar', map:tr('nurse.navigation'), complete:tr('nurse.completeVisit'), earnings:tr('nurse.earnings'), profile:tr('nurse.profile'), onboarding:tr('nurse.completeProfile') };
  const status = nurse?.status || 'INCOMPLETE';
  const statusColors = { APPROVED:['#ECFDF5','#059669'], PENDING:['#EFF6FF','#2563EB'], INCOMPLETE:['#FFFBEB','#D97706'], REJECTED:['#FEF2F2','#DC2626'], SUSPENDED:['#F1F5F9','#475569'] };
  const [sbg, scol] = statusColors[status] || statusColors.INCOMPLETE;

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F8FAFC', fontFamily:F }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:36,height:36,borderRadius:'50%',border:'3px solid #ECFDF5',borderTopColor:'#059669',animation:'spin 0.8s linear infinite',margin:'0 auto 12px' }}/>
        <div style={{ fontSize:13, color:'#94A3B8' }}>Loading...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const NAV_BOTTOM = NAV_ITEMS.slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}body{margin:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .nurse-section{animation:fadeSlideIn 0.2s ease both;}
        .nurse-btn-primary:hover:not(:disabled){background:#1D4ED8!important;transform:translateY(-1px);box-shadow:0 4px 12px rgba(37,99,235,0.3)!important;}
        .nurse-btn-secondary:hover:not(:disabled){background:#F8FAFC!important;border-color:#2563EB!important;}
        .nurse-btn-danger:hover:not(:disabled){background:rgba(239,68,68,0.12)!important;}
        @media(max-width:768px){
          .nurse-cont{padding:16px 16px 140px!important;}
          .nurse-ham{display:flex!important;}
          .nurse-tabs{display:flex!important;}
        }
      `}</style>
      <div style={{ display:'flex', minHeight:'100vh', fontFamily:F, background:'#F8FAFC' }}>
        <NurseSidebar nurse={displayNurse} active={active} setActive={navigateTo} onLogout={logout} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />

        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          {/* Header */}
          <div style={{ padding:'0 24px', height:58, borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FFFFFF', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={()=>setSidebarOpen(true)} className="nurse-ham" style={{ display:'none', flexDirection:'column', gap:4, background:'transparent', border:'none', cursor:'pointer', padding:'6px' }}>
                <span style={{ display:'block',width:20,height:2,background:'#111827',borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:'#111827',borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:'#111827',borderRadius:2 }}/>
              </button>
              <div style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{TITLES[active]||'Nurse Dashboard'}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <NotificationBell lang={lang} onNavigate={(type, relatedId) => {
                if (type === 'NEW_JOB') { navigateTo('jobs'); return; }
                if (relatedId) {
                  const v = visits.find(x => x.id === relatedId);
                  if (v && type === 'JOB_ASSIGNED') { setSelectedVisit(v); setActive('map'); return; }
                }
                navigateTo('visits');
              }} />
              <div style={{ display:'flex', background:'#F1F5F9', borderRadius:8, padding:3, border:'1px solid #E2E8F0' }}>
                {['en','sq'].map(l=>(
                  <button key={l} onClick={()=>switchLang(l)} style={{ padding:'4px 10px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background:lang===l?'#2563EB':'transparent', color:lang===l?'#fff':'#475569', fontFamily:F }}>{l.toUpperCase()}</button>
                ))}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"4px 11px", borderRadius:99, background:sbg, color:scol, display:"flex", alignItems:"center", gap:5 }}><div style={{ width:5,height:5,borderRadius:"50%",background:scol }}/>{status}</span>
            </div>
          </div>

          {/* Content */}
          <main className="nurse-cont" style={{ flex:1, padding:24, overflowY:'auto', maxWidth:720, width:'100%' }}>
            <OnboardingBanner nurse={nurse} onStartOnboarding={()=>setActive('onboarding')} lang={lang} />
            <div key={active} className="nurse-section">
              {active==='onboarding' && <OnboardingWizard nurse={nurse} onComplete={handleComplete} onSave={handleSave} lang={lang} />}
              {active==='dashboard' && <Dashboard setActive={setActive} setSelectedVisit={setSelectedVisit} lang={lang} visits={visits} nurse={nurse} onTodayClick={()=>{ setVisitsInitialFilter('today'); setActive('visits'); }} />}
              {active==='jobs' && <BrowseJobs nurse={nurse} lang={lang} />}
              {active==='visits' && <Visits setActive={setActive} setSelectedVisit={setSelectedVisit} lang={lang} visits={visits} onStatusChange={handleStatusChange} initialFilter={visitsInitialFilter} />}
              {active==='calendar' && <NurseCalendar visits={visits} lang={lang} setActive={navigateTo} setSelectedVisit={setSelectedVisit} />}
              {active==='health' && <HealthProgress visits={visits} lang={lang} nurseMode={true} />}
              {active==='complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} onComplete={loadData} lang={lang} />}
              {active==='profile' && <NurseProfile lang={lang} nurse={nurse} />}
            </div>
          </main>
        </div>

        {/* Mobile bottom tabs */}
        <div style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, background:'#111827', borderTop:'1px solid rgba(255,255,255,0.08)', zIndex:48, padding:'8px 0 env(safe-area-inset-bottom,8px)' }} className="nurse-tabs">
          <button onClick={()=>setSidebarOpen(true)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', color:'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:10, fontWeight:500, fontFamily:F, padding:'4px 2px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            Menu
          </button>
          {NAV_BOTTOM.map(item=>(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', color:active===item.id?'#6EE7B7':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:10, fontWeight:active===item.id?700:500, fontFamily:F, padding:'4px 2px' }}>
              {item.icon}<span>{(NURSE_LABELS[lang]||NURSE_LABELS.en)[item.label]||item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <NurseChat lang={lang} nurseStatus={nurse?.status || 'INCOMPLETE'} onNavigate={(section) => { navigateTo(section); }} />
    </>
  );
}
