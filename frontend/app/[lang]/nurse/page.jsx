'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';
import { toastSuccess, toastError } from '@/components/ui/Toast';
// Module-level translation helper - uses 'en' as default
let _currentLang = 'en';
const tr = (key) => t(_currentLang, key);


const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };


const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const CITIES = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];
const SPECIALTIES_LIST = ['Blood Pressure','Glucose Monitoring','Vitals','Blood Work','Welfare Check','General Nursing','Post-surgical Care','Paediatric Care'];
const SERVICES_LIST = ['Blood Pressure Check','Glucose Monitoring','Vitals Monitoring','Blood Work Collection','Welfare Check','Post-surgical Care','Medication Administration','General Nursing'];
const LANGUAGES_LIST = ['Albanian','English','Italian','Greek','German','French'];
const EXPERIENCE_LIST = ['Less than 1 year','1-2 years','3-5 years','6-10 years','10+ years'];

const NAV_ITEMS = [
  { id:'dashboard', label:'dashboard', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'jobs', label:'jobs', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { id:'visits', label:'visits', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'complete', label:'complete', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { id:'earnings', label:'earnings', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id:'profile', label:'profile', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
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
  en:{ dashboard:'Dashboard', jobs:'Browse Jobs', visits:'My Visits', map:'Navigation', complete:'Complete Visit', earnings:'Earnings', profile:'My Profile' },
  sq:{ dashboard:'Paneli', jobs:'Shfleto Punët', visits:'Vizitat e Mia', map:'Navigimi', complete:'Përfundo Vizitën', earnings:'Fitimet', profile:'Profili Im' },
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
    if (type === 'NEW_JOB') return '💼';
    if (type === 'JOB_ASSIGNED') return '✅';
    if (type === 'JOB_UPDATED') return '✏️';
    if (type === 'VISIT_COMPLETED') return '🏁';
    if (type === 'VISIT_CANCELLED') return '❌';
    return '🔔';
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
        <div style={{ position:'absolute', top:42, right:0, width:320, background:C2.bgWhite, borderRadius:14, boxShadow:'0 8px 30px rgba(15,23,42,0.12)', border:`1px solid ${C2.border}`, zIndex:9999, overflow:'hidden' }}>
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
                  <div style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{iconFor(n.type)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:n.read ? 500 : 700, color:C2.textPrimary, marginBottom:2, lineHeight:1.3 }}>{title}</div>
                    <div style={{ fontSize:12, color:C2.textSecondary, lineHeight:1.4, marginBottom:4 }}>{message}</div>
                    <div style={{ fontSize:11, color:C2.textTertiary }}>{timeAgo(n.createdAt)}</div>
                  </div>
                  {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:C2.primary, flexShrink:0, marginTop:5 }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({ setActive, setSelectedVisit, lang='en', visits=[], nurse=null }) {
  const tr = (key) => t(lang, key);
  const today = visits.filter(v => !['COMPLETED','CANCELLED'].includes(v.status));
  const nurseName = nurse?.user?.name || nurse?.name || 'Nurse';
  const nurseInitials = nurseName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const ratingValue = nurse?.rating > 0 ? nurse.rating : null;
  const totalVisits = nurse?.totalVisits || 0;
  const specialtiesArray = nurse?.specialties ? (typeof nurse.specialties === 'string' ? JSON.parse(nurse.specialties) : nurse.specialties) : [];
  const statusMap = { APPROVED:['#ECFDF5','#059669'], PENDING:['#FEF3C7','#D97706'], INCOMPLETE:['#FFFBEB','#D97706'], REJECTED:['#FEF2F2','#DC2626'], SUSPENDED:['#F1F5F9','#475569'] };
  const [statusBg, statusColor] = statusMap[nurse?.status] || statusMap.INCOMPLETE;

  return (
    <div>
      {/* Nurse Identity Card */}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'24px', marginBottom:28, borderLeft:`4px solid ${C.primary}` }}>
        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
          {/* Avatar */}
          <div style={{ flexShrink:0 }}>
            {nurse?.profilePhotoUrl ? (
              <img src={nurse.profilePhotoUrl} alt={nurseName} style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}` }} />
            ) : (
              <div style={{ width:80, height:80, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff' }}>
                {nurseInitials}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <h1 style={{ fontSize:20, fontWeight:700, color:C.textPrimary, margin:'0 0 8px 0' }}>{nurseName}</h1>

            {/* Rating */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                {[1,2,3,4,5].map((idx) => (
                  <svg key={idx} width="16" height="16" viewBox="0 0 24 24" style={{ fill: ratingValue && idx <= Math.round(ratingValue) ? C.warning : '#E5E7EB', stroke: 'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              {ratingValue ? (
                <span style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{ratingValue.toFixed(1)} / 5 · {totalVisits} {totalVisits === 1 ? 'visit' : 'visits'}</span>
              ) : (
                <span style={{ fontSize:14, fontWeight:600, color:C.textSecondary }}>New Nurse</span>
              )}
            </div>

            {/* Status Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, background:statusBg, color:statusColor, padding:'5px 12px', borderRadius:6, marginBottom:12 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:statusColor }} />
              {nurse?.status || 'INCOMPLETE'}
            </div>

            {/* Specialties */}
            {specialtiesArray.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                {specialtiesArray.map((spec) => (
                  <span key={spec} style={{ fontSize:12, fontWeight:500, background:C.primaryLight, color:C.primary, padding:'4px 10px', borderRadius:4 }}>
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[[t(lang,'nurse.todayLabel'),today.length,C.primary],[t(lang,'nurse.totalVisits'),nurse?.totalVisits||0,C.secondary],[t(lang,'nurse.earningsLabel'),`€${nurse?.totalEarnings||0}`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {today.length > 0 ? (
        <DailyRouteCard lang={lang} visits={today.map(formatVisit)} onVisitSelect={(v)=>{ setSelectedVisit(today.find(vv=>vv.id===v.id)); setActive('map'); }} />
      ) : (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'32px 24px', textAlign:'center', color:C.textTertiary, fontSize:14 }}>
          {t(lang,'dashboard.noVisits')}
        </div>
      )}
      <div style={{ marginTop:16, background:C.warningLight, border:`1px solid #FDE68A`, borderRadius:10, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style={{ fontSize:13, color:'#92400E' }}>{t(lang,'nurse.emergencyWarning')} <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit, lang='en', visits=[], onStatusChange }) {
  const tr = (key) => t(lang, key);
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? visits : visits.filter(v=>filter==='upcoming'?!['COMPLETED','CANCELLED'].includes(v.status):v.status==='COMPLETED');

  const filterLabels = { all:t(lang,'nurse.visitsFilterAll'), upcoming:t(lang,'nurse.visitsFilterUpcoming'), completed:t(lang,'nurse.visitsFilterCompleted') };

  if (!visits.length) return (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center', color:C.textTertiary, fontSize:14 }}>
      {t(lang,'nurse.noVisitsAssigned')}
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','upcoming','completed'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', borderRadius:99, cursor:'pointer', background:filter===f?C.primary:C.bgWhite, color:filter===f?'#fff':C.textSecondary, border:filter===f?'none':`1px solid ${C.border}` }}>
            {filterLabels[f]}
          </button>
        ))}
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
        <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{visit.serviceType} · {new Date(visit.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
        {visit.relative?.address && <div style={{ fontSize:12, color:'#3B82F6', marginTop:2, opacity:0.8 }}>📍 {visit.relative.address}</div>}
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

function Earnings({ lang='en', nurse=null }) {
  const tr = (key) => t(lang, key);
  const payRate = nurse?.payRatePerVisit || 20;
  const totalEarnings = nurse?.totalEarnings || 0;
  const totalVisits = nurse?.totalVisits || 0;
  const rating = nurse?.rating || 0;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[[tr('nurse.totalEarned'),`€${totalEarnings}`,C.secondary],[tr('nurse.totalVisits'),totalVisits,C.primary],[tr('nurse.rating'),rating>0?rating:'N/A',C.warning],[tr('nurse.payRate'),`€${payRate}/visit`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>{tr('nurse.paymentHistoryTitle')}</div>
        <div style={{ fontSize:12, color:C.textTertiary, marginBottom:20 }}>{tr('nurse.payRateLabel')}: <strong style={{ color:C.textPrimary }}>€{payRate} {tr('nurse.perVisit')}</strong> · {tr('nurse.processedViaWise')}</div>
        {totalVisits > 0 ? (
          <div style={{ background:C.bgSubtle, borderRadius:10, padding:'16px 18px' }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{tr('nurse.totalEarnedToDate')}</div>
            <div style={{ fontSize:28, fontWeight:800, color:C.secondary, letterSpacing:'-0.5px' }}>€{totalEarnings}</div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:6 }}>{tr('nurse.fromVisits')} {totalVisits} {totalVisits!==1?tr('nurse.completedVisitsPlural'):tr('nurse.completedVisits')} · €{payRate} {tr('nurse.perVisit')}</div>
            <div style={{ marginTop:16, fontSize:12, color:C.textTertiary, background:C.primaryLight, borderRadius:8, padding:'10px 14px', border:`1px solid rgba(37,99,235,0.15)` }}>
              {tr('nurse.payoutInfo')} <strong>hello@vonaxity.com</strong> {tr('nurse.payoutContact')}
            </div>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'24px 0', color:C.textTertiary, fontSize:13 }}>
            {tr('nurse.noVisitsEarning')}
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
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {jobs.map(job => {
          const isExpanded = expandedJob === job.id;
          const applied = job.hasApplied || statuses[job.id] === 'applied';
          const failed = statuses[job.id] && statuses[job.id] !== 'applied';
          const dateStr = new Date(job.scheduledAt).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
          const timeStr = new Date(job.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});

          return (
            <div key={job.id} style={{ background:C.bgWhite, borderRadius:14, border:`1.5px solid ${applied?'#6EE7B7':isExpanded?C.primary:C.border}`, overflow:'hidden', transition:'border-color 0.15s' }}>

              {/* ── Summary row (always visible) ── */}
              <div style={{ padding:'16px 18px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{job.serviceType}</div>
                    {applied && <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background:'#ECFDF5', color:'#059669', flexShrink:0 }}>{t(lang,'nurse.applied')}</span>}
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 14px', fontSize:12, color:C.textSecondary }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ color:C.textTertiary }}>{iconPin}</span>{job.city||'Albania'}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ color:C.textTertiary }}>{iconCal}</span>{dateStr} · {timeStr}</span>
                    {job.relativeName && <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ color:C.textTertiary }}>{iconUser}</span>{job.relativeName}</span>}
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
                  {applied ? (
                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, fontWeight:600, color:'#059669' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {t(lang,'nurse.applied')}
                    </div>
                  ) : (
                    <button onClick={()=>setExpandedJob(isExpanded?null:job.id)} style={{ fontSize:13, fontWeight:700, padding:'8px 18px', background:isExpanded?C.bgSubtle:C.primary, color:isExpanded?C.textSecondary:'#fff', border:'none', borderRadius:9, cursor:'pointer', fontFamily:F }}>
                      {isExpanded ? t(lang,'nurse.close') : t(lang,'nurse.applyArrow')}
                    </button>
                  )}
                  <button
                    onClick={()=>setExpandedJob(expandedJob===`details-${job.id}`?null:`details-${job.id}`)}
                    style={{ fontSize:11, fontWeight:600, padding:'5px 10px', borderRadius:7, border:`1px solid ${C.border}`, background:'transparent', color:C.textTertiary, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
                    {expandedJob===`details-${job.id}` ? t(lang,'nurse.hideDetails') : t(lang,'nurse.viewDetails')}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {expandedJob===`details-${job.id}` ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Expanded details panel ── */}
              {expandedJob===`details-${job.id}` && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 18px', background:C.bgSubtle, display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'nurse.patientLabel')}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{job.relativeName||'—'}</div>
                      {job.relativeAge && <div style={{ fontSize:11, color:C.textTertiary }}>{t(lang,'nurse.agePrefix')} {job.relativeAge}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'nurse.addressLabel')}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{job.relativeAddress||job.city||'—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'nurse.postedBy')}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{job.postedBy}</div>
                      {job.clientCountry && <div style={{ fontSize:11, color:C.textTertiary }}>{job.clientCountry}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'nurse.postedLabel')}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '—'}</div>
                    </div>
                  </div>
                  {job.notes && (
                    <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'10px 13px' }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#92400E', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{t(lang,'nurse.clientInstructions')}</div>
                      <div style={{ fontSize:13, color:'#78350F', lineHeight:1.6 }}>{job.notes}</div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Apply panel ── */}
              {expandedJob === job.id && !applied && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:'16px 18px', background:C.bgSubtle }}>
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

              {failed && <div style={{ margin:'0 18px 14px', fontSize:12, color:C.error, background:C.errorLight, borderRadius:7, padding:'8px 12px' }}>{statuses[job.id]}</div>}
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

  return (
    <div style={{ maxWidth:620 }}>

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
      <button onClick={handleSave} disabled={saving} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:28, opacity:saving?0.7:1, boxShadow:'0 2px 8px rgba(37,99,235,0.2)' }}>
        {saving ? tr('dashboard.saving') : tr('dashboard.saveProfile')}
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

function OnboardingWizard({ nurse, user, onComplete, onSave }) {
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

  return (
    <div style={{ maxWidth:620 }}>
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

// ── Main nurse page ────────────────────────────────────────────────────────────
export default function NursePage({ params }) {
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
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
  const TITLES = { dashboard:tr('nurse.dashboard'), jobs:tr('nurse.browseJobs'), visits:tr('nurse.myVisits'), map:tr('nurse.navigation'), complete:tr('nurse.completeVisit'), earnings:tr('nurse.earnings'), profile:tr('nurse.profile'), onboarding:tr('nurse.completeProfile') };
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
        <NurseSidebar nurse={displayNurse} active={active} setActive={setActive} onLogout={logout} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />

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
              <NotificationBell lang={lang} onNavigate={(type) => setActive(type === 'NEW_JOB' ? 'jobs' : 'visits')} />
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
              {active==='onboarding' && <OnboardingWizard nurse={nurse} onComplete={handleComplete} onSave={handleSave} />}
              {active==='dashboard' && <Dashboard setActive={setActive} setSelectedVisit={setSelectedVisit} lang={lang} visits={visits} nurse={nurse} />}
              {active==='jobs' && <BrowseJobs nurse={nurse} lang={lang} />}
              {active==='visits' && <Visits setActive={setActive} setSelectedVisit={setSelectedVisit} lang={lang} visits={visits} onStatusChange={handleStatusChange} />}
              {active==='map' && <MapView selectedVisit={selectedVisit} setActive={setActive} setSelectedVisit={setSelectedVisit} visits={visits} onStatusChange={handleStatusChange} lang={lang} />}
              {active==='complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} onComplete={loadData} lang={lang} />}
              {active==='earnings' && <Earnings lang={lang} nurse={nurse} />}
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
    </>
  );
}
