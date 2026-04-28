'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';
import Settings from './settings';

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
        <div style={{ position:'absolute', top:42, right:0, width:320, background:C.bgWhite, borderRadius:14, boxShadow:'0 8px 30px rgba(15,23,42,0.12)', border:`1px solid ${C.border}`, zIndex:9999, overflow:'hidden' }}>
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
              const title = nt(n.type,'title') || n.title;
              const message = n.type === 'announcement' ? n.message : (nt(n.type,'message') || n.message);
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{ padding:'12px 16px', borderBottom:`1px solid ${C.borderSubtle}`, cursor:'pointer', background:n.read ? 'transparent' : C.primaryLight, display:'flex', gap:10, alignItems:'flex-start', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bgSubtle}
                  onMouseLeave={e => e.currentTarget.style.background = n.read ? 'transparent' : C.primaryLight}
                >
                  {iconFor(n.type)}
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

function Overview({ user, visits, relative, lang, onBook }) {
  const tr = (key) => t(lang, key);
  const upcoming = visits.filter(v=>!['COMPLETED','CANCELLED'].includes(v.status));
  const completed = visits.filter(v=>v.status==='COMPLETED');
  const next = upcoming[0], last = completed[0];
  const sub = user?.subscription || { plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:0 };
  const planLabel = (sub?.plan||'standard').charAt(0).toUpperCase()+(sub?.plan||'standard').slice(1);
  return (
    <div>
      {next ? (
        <div style={{ background:C.primary, borderRadius:16, padding:'20px 22px', marginBottom:20, color:'#fff', boxShadow:SMD, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ width:46,height:46,borderRadius:13,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontSize:10, fontWeight:700, opacity:.65, letterSpacing:'1px', textTransform:'uppercase', marginBottom:4 }}>{tr('dashboard.nextVisit')}</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{new Date(next.scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})} at {new Date(next.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{ fontSize:12, opacity:.8 }}>{next.nurse?.user?.name||tr('dashboard.nurseTBCLabel')} · {(() => { const s = SERVICES_MAP.find(x=>x.en===next.serviceType); return lang==='sq'&&s?s.sq:next.serviceType; })()}</div>
          </div>
          <Badge s={next.status} lang={lang} />
        </div>
      ) : (
        <div style={{ background:C.primaryLight, border:`1px solid rgba(37,99,235,0.15)`, borderRadius:16, padding:'20px 22px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.primary, marginBottom:4 }}>{tr('dashboard.noUpcomingVisits')}</div>
            <div style={{ fontSize:13, color:C.textSecondary }}>{tr('dashboard.bookNurseDesc')}</div>
          </div>
          <button onClick={onBook} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'11px 20px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:F }}>{tr('dashboard.bookVisitBtn')}</button>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:20 }}>
        {[[tr('dashboard.plan'),planLabel,C.primary,''],
          [tr('dashboard.visitsUsed'), sub?.visitsPerMonth>=999 ? '∞' : `${sub?.visitsUsed||0}/${sub?.visitsPerMonth||2}`, C.textPrimary, sub?.visitsPerMonth>=999 ? 'Unlimited' : tr('dashboard.thisMonth')],
          [tr('dashboard.completed'),completed.length,C.secondary,tr('dashboard.total')],
          [tr('dashboard.lastBP'),last?.bpSystolic?`${last.bpSystolic}/${last.bpDiastolic}`:'—',last?.bpSystolic?C.warning:C.textTertiary,last?.bpSystolic?'mmHg':'']].map(([label,val,color,sub2])=>(
          <div key={label} style={{ background:C.bgWhite, borderRadius:13, border:`1px solid ${C.border}`, padding:'16px 18px', boxShadow:SSM }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.textTertiary, letterSpacing:'0.7px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:800, color, letterSpacing:'-0.5px', lineHeight:1 }}>{val}</div>
            {sub2 && <div style={{ fontSize:11, color:C.textTertiary, marginTop:5 }}>{sub2}</div>}
          </div>
        ))}
      </div>
      {relative && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:SSM }}>
          <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>{tr('dashboard.lovedOne')}</div>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.secondaryLight, color:C.secondary }}>{tr('dashboard.activeCare')}</span>
          </div>
          {[[tr('dashboard.fullName'),relative.name],[tr('dashboard.city'),relative.city],[tr('dashboard.address'),relative.address||'—'],[tr('dashboard.age'),relative.age?`${relative.age} years`:'—'],[tr('dashboard.assignedNurse'),next?.nurse?.user?.name||tr('dashboard.beingAssigned')]].map(([k,v])=>(
            <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 18px', borderBottom:`1px solid ${C.borderSubtle}` }}>
              <span style={{ fontSize:13, color:C.textSecondary }}>{k}</span>
              <span style={{ fontSize:13, color:C.textPrimary, fontWeight:600, textAlign:'right', maxWidth:'60%' }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookVisit({ relative, subscription, onSuccess, onCancel, lang='en' }) {
  const tr = (key) => t(lang, key);
  const serviceLabel = (en) => { const s = SERVICES_MAP.find(x => x.en === en); return lang === 'sq' && s ? s.sq : en; };
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
      await api.createVisit({ relativeId: relative.id, serviceType: form.serviceType, scheduledAt: form.scheduledAt, notes: form.notes });
      onSuccess();
    } catch (err) {
      setError(err.message || tr('dashboard.bookFailed'));
      setSubmitted(false); // allow retry on error
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:28, boxShadow:SSM, maxWidth:520 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px' }}>{tr('dashboard.bookVisitTitle')}</div>
          <div style={{ fontSize:13, color:C.textSecondary, marginTop:3 }}>
            {relative ? `${tr('dashboard.bookForPrefix')} ${relative.name} ${tr('dashboard.bookIn')} ${relative.city}` : tr('dashboard.bookAddLoved')}
          </div>
          {subscription && (
            subscription.visitsPerMonth >= 999
              ? <div style={{ fontSize:12, fontWeight:600, marginTop:4, color:'#059669' }}>⚡ Unlimited visits (test account)</div>
              : <div style={{ fontSize:12, fontWeight:600, marginTop:4, color: subscription.visitsUsed >= subscription.visitsPerMonth ? '#DC2626' : '#059669' }}>
                  {subscription.visitsPerMonth - subscription.visitsUsed} {subscription.visitsPerMonth - subscription.visitsUsed !== 1 ? tr('dashboard.bookVisitsLeftPlural') : tr('dashboard.bookVisitsLeft')}
                </div>
          )}
        </div>
        <button onClick={onCancel} style={{ background:C.bgSubtle, border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary, fontSize:16 }}>✕</button>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>{tr('dashboard.bookServiceType')}</label>
        <select style={inp} value={form.serviceType} onChange={e=>setForm({...form, serviceType:e.target.value})}>
          {SERVICES_MAP.map(s=><option key={s.en} value={s.en}>{lang==='sq' ? s.sq : s.en}</option>)}
        </select>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>{tr('dashboard.bookDateTime')}</label>
        <input type="datetime-local" style={inp} value={form.scheduledAt} onChange={e=>setForm({...form, scheduledAt:e.target.value})} min={new Date().toISOString().slice(0,16)} />
      </div>

      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>{tr('dashboard.bookNotes')} <span style={{ fontWeight:400, color:C.textTertiary }}>({tr('dashboard.bookNotesOpt')})</span></label>
        <textarea style={{ ...inp, height:90, resize:'vertical' }} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder={tr('dashboard.bookNotesPh')} />
      </div>

      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}

      <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:9, padding:'10px 14px', fontSize:12, color:'#92400E', marginBottom:20 }}>
        {tr('dashboard.bookAfterInfo').replace('{city}', relative?.city || '')}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:F }}>{tr('dashboard.cancel')}</button>
        <button onClick={handleSubmit} disabled={loading||!relative||(subscription&&subscription.visitsPerMonth<999&&subscription.visitsUsed>=subscription.visitsPerMonth)} style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:700, cursor:(loading||!relative||(subscription&&subscription.visitsPerMonth<999&&subscription.visitsUsed>=subscription.visitsPerMonth))?'not-allowed':'pointer', opacity:(loading||!relative||(subscription&&subscription.visitsPerMonth<999&&subscription.visitsUsed>=subscription.visitsPerMonth))?0.7:1, fontFamily:F }}>
          {loading ? tr('dashboard.booking') : tr('dashboard.bookVisitBtn')}
        </button>
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
function EditVisit({ visit, onSave, onCancel, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [form, setForm] = useState({
    serviceType: visit.serviceType || '',
    scheduledAt: visit.scheduledAt ? new Date(visit.scheduledAt).toISOString().slice(0,16) : '',
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

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:C.bgWhite, borderRadius:20, padding:28, maxWidth:420, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:C.errorLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
        </div>
        <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, marginBottom:8 }}>{tr('dashboard.deleteVisitTitle')}</div>
        <div style={{ fontSize:14, color:C.textSecondary, marginBottom:6 }}>
          <strong>{(() => { const s = SERVICES_MAP.find(x=>x.en===visit.serviceType); return lang==='sq'&&s?s.sq:visit.serviceType; })()}</strong> — {new Date(visit.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
        </div>
        <div style={{ fontSize:13, color:C.textTertiary, marginBottom:24 }}>{tr('dashboard.deleteCannotUndo')}</div>
        {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:'12px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', fontSize:14, fontWeight:600, cursor:'pointer', color:C.textSecondary }}>{tr('dashboard.cancel')}</button>
          <button onClick={handleDelete} disabled={loading} style={{ flex:1, padding:'12px', borderRadius:10, border:'none', background:C.error, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', opacity:loading?0.7:1, fontFamily:F }}>
            {loading ? tr('dashboard.deleting') : tr('dashboard.delete')}
          </button>
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
  const [editing, setEditing] = useState(null); // visit object
  const [deleting, setDeleting] = useState(null); // visit object

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
    <div>
      {visits.map(v=>(
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'18px 20px', marginBottom:12, boxShadow:SSM }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:v.bpSystolic||v.status==='UNASSIGNED'?14:0 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{serviceLabel(v.serviceType)}</div>
                {v.workOrderNumber && <span style={{ fontSize:10, fontWeight:700, color:C.primary, background:C.primaryLight, padding:'2px 8px', borderRadius:99, letterSpacing:'0.5px' }}>{v.workOrderNumber}</span>}
              </div>
              <div style={{ fontSize:12, color:C.textTertiary }}>{new Date(v.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {v.nurse?.user?.name||tr('visits.nurseTBC')}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
              <Badge s={v.status} lang={lang}/>
              <div style={{ display:'flex', gap:6 }}>
                {canEdit(v) && (
                  <button onClick={()=>setEditing(v)} style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:6, border:`1px solid ${C.border}`, background:'transparent', cursor:'pointer', color:C.textSecondary }}>{tr('dashboard.edit')}</button>
                )}
                {canDelete(v) && (
                  <button onClick={()=>setDeleting(v)} style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:6, border:`1px solid #FECACA`, background:C.errorLight, cursor:'pointer', color:C.error }}>{tr('dashboard.delete')}</button>
                )}
              </div>
            </div>
          </div>
          {v.bpSystolic && (
            <div style={{ background:C.bgSubtle, borderRadius:10, padding:'12px 16px', display:'flex', gap:20, flexWrap:'wrap', marginBottom:8 }}>
              <div><div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'visits.bloodPressure')}</div><div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{v.bpSystolic}/{v.bpDiastolic} <span style={{ fontSize:10, color:C.textTertiary }}>mmHg</span></div></div>
              {v.glucose && <div><div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>{t(lang,'visits.glucose')}</div><div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{v.glucose} <span style={{ fontSize:10, color:C.textTertiary }}>mmol/L</span></div></div>}
              {v.nurseNotes && <div style={{ width:'100%', borderTop:`1px solid ${C.border}`, paddingTop:8, marginTop:4, fontSize:12, color:C.textSecondary, fontStyle:'italic' }}>"{v.nurseNotes}"</div>}
            </div>
          )}
          {v.status === 'UNASSIGNED' && (
            <button onClick={()=>onViewApplicants(v)} style={{ width:'100%', background:C.primaryLight, color:C.primary, border:`1px solid rgba(37,99,235,0.2)`, borderRadius:9, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, marginTop:4 }}>
              {tr('dashboard.viewApplicants')}
            </button>
          )}
          {v.status === 'COMPLETED' && (
            <button onClick={()=>setViewingDetail(v)} style={{ width:'100%', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:9, padding:'9px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:F, marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
              {lang==='sq' ? 'Shiko Raportin e Vizitës' : 'View Full Report'}
            </button>
          )}
          {v.status === 'COMPLETED' && !v.review && !reviewed[v.id] && (
            reviewing === v.id ? (
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:8 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{tr('dashboard.rateNurse')}</div>
                <div style={{ display:'flex', gap:4, marginBottom:10 }}>
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={()=>setRating(s)} style={{ fontSize:24, background:'none', border:'none', cursor:'pointer', color:s<=rating?'#F59E0B':'#D1D5DB', padding:'0 2px' }}>&#9733;</button>
                  ))}
                </div>
                <input value={comment} onChange={e=>setComment(e.target.value)} placeholder={tr('dashboard.leaveComment')} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, fontFamily:F, marginBottom:10, boxSizing:'border-box' }} />
                {reviewError && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:8, padding:'8px 12px', fontSize:12, color:C.error, marginBottom:10 }}>{reviewError}</div>}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>{ setReviewing(null); setReviewError(''); }} style={{ flex:1, padding:'9px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', fontSize:13, cursor:'pointer', color:C.textSecondary }}>{tr('dashboard.cancel')}</button>
                  <button onClick={()=>submitReview(v.id)} disabled={!rating||submitting} style={{ flex:2, padding:'9px', borderRadius:8, border:'none', background:C.primary, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', opacity:!rating||submitting?0.6:1 }}>{submitting?tr('dashboard.submitting'):tr('dashboard.submitReview')}</button>
                </div>
              </div>
            ) : (
              <button onClick={()=>{ setReviewing(v.id); setRating(0); setComment(''); }} style={{ marginTop:8, fontSize:12, fontWeight:600, color:C.warning, background:C.warningLight, border:`1px solid #FDE68A`, borderRadius:8, padding:'7px 14px', cursor:'pointer' }}>
                &#9733; {tr('dashboard.rateVisit')}
              </button>
            )
          )}
          {(v.review || reviewed[v.id]) && v.status === 'COMPLETED' && (
            <div style={{ marginTop:8, fontSize:12, color:C.secondary, fontWeight:600 }}>&#9733; {tr('dashboard.reviewed')}</div>
          )}
        </div>
      ))}
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
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.bgWhite, borderRadius:20, padding:'28px', maxWidth:540, width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.18)', maxHeight:'90vh', overflowY:'auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:22 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:6 }}>{lang==='sq'?'Raport Vizite':'Visit Report'}</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px', marginBottom:4 }}>{serviceLabel(visit.serviceType)}</div>
            <div style={{ fontSize:13, color:C.textSecondary }}>
              {new Date(visit.scheduledAt).toLocaleDateString(lang==='sq'?'sq-AL':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
              {' · '}
              {new Date(visit.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
            </div>
          </div>
          <button onClick={onClose} style={{ background:C.bgSubtle, border:'none', borderRadius:9, width:34, height:34, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary, fontSize:16, flexShrink:0 }}>✕</button>
        </div>

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

        {/* Footer */}
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Badge s="COMPLETED" lang={lang} />
          {visit.workOrderNumber && <span style={{ fontSize:12, color:C.textTertiary, fontWeight:500 }}>#{visit.workOrderNumber}</span>}
          <button onClick={onClose} style={{ fontSize:13, fontWeight:600, padding:'9px 20px', borderRadius:9, border:`1px solid ${C.border}`, background:C.bgWhite, cursor:'pointer', color:C.textSecondary }}>
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
      <div style={{ marginBottom:20, height:42, borderRadius:10 }} className="fn-shimmer"/>
      {[1,2,3].map(i=>(
        <div key={i} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:12 }}>
          <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:14 }}>
            <div style={{ width:52, height:52, borderRadius:13, flexShrink:0 }} className="fn-shimmer"/>
            <div style={{ flex:1 }}>
              <div style={{ height:14, borderRadius:6, marginBottom:8, width:'55%' }} className="fn-shimmer"/>
              <div style={{ height:11, borderRadius:6, width:'35%' }} className="fn-shimmer"/>
            </div>
          </div>
          <div style={{ height:11, borderRadius:6, width:'80%', marginBottom:6 }} className="fn-shimmer"/>
          <div style={{ height:11, borderRadius:6, width:'60%' }} className="fn-shimmer"/>
        </div>
      ))}
    </div>
  );

  if (error) return <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'16px 20px', fontSize:14, color:C.error }}>{error}</div>;

  return (
    <div>
      {/* Search + filter */}
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:200, position:'relative' }}>
          <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="15" height="15" fill="none" stroke={C.textTertiary} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={tr('dashboard.searchNursesPlaceholder')}
            style={{ width:'100%', paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10, borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:F, boxSizing:'border-box' }}
          />
        </div>
        <select
          value={cityFilter}
          onChange={e=>setCityFilter(e.target.value)}
          style={{ padding:'10px 14px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, color:cityFilter?C.textPrimary:C.textTertiary, background:C.bgWhite, outline:'none', fontFamily:F, cursor:'pointer' }}
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
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{tr('dashboard.noNursesFound')}</div>
          <div style={{ fontSize:13, color:C.textSecondary }}>{tr('dashboard.noNursesFoundSub')}</div>
        </div>
      )}

      {/* Nurse cards */}
      {filtered.map(nurse => (
        <div key={nurse.id} style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'20px', marginBottom:14, boxShadow:SSM }}>
          <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:14 }}>
            <div style={{ width:52, height:52, borderRadius:13, background:'linear-gradient(135deg,#2563EB,#7C3AED)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff', flexShrink:0, overflow:'hidden' }}>
              {nurse.profilePhotoUrl
                ? <img src={nurse.profilePhotoUrl} alt={nurse.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : (nurse.name||'N').charAt(0).toUpperCase()
              }
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nurse.name}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginBottom:6 }}>
                {nurse.city && <span>📍 {nurse.city}</span>}
                {nurse.experience && <span style={{ marginLeft:10 }}>🩺 {nurse.experience}</span>}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ display:'flex', gap:1 }}>{stars(nurse.rating||0)}</div>
                <span style={{ fontSize:12, color:C.textSecondary, fontWeight:600 }}>{nurse.rating>0 ? nurse.rating.toFixed(1) : tr('dashboard.newNurse')}</span>
                {nurse.reviewCount > 0 && <span style={{ fontSize:11, color:C.textTertiary }}>({nurse.reviewCount})</span>}
                <span style={{ marginLeft:4, fontSize:11, color:C.textTertiary }}>· {nurse.totalVisits} {tr('dashboard.visitsApplicantLabel')}</span>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6, flexShrink:0 }}>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.secondaryLight, color:C.secondary, whiteSpace:'nowrap' }}>✓ {tr('dashboard.nurseVerified')}</span>
            </div>
          </div>

          {nurse.bio && (
            <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65, marginBottom:12, padding:'10px 13px', background:C.bgSubtle, borderRadius:9, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {nurse.bio}
            </div>
          )}

          {nurse.specialties?.length > 0 && (
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
              {nurse.specialties.slice(0,4).map(s=>(
                <span key={s} style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99, background:C.primaryLight, color:C.primary }}>{s}</span>
              ))}
              {nurse.specialties.length > 4 && <span style={{ fontSize:11, color:C.textTertiary }}>+{nurse.specialties.length-4}</span>}
            </div>
          )}

          <button
            onClick={() => onBook()}
            style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}
          >
            {tr('dashboard.bookWithNurse')}
          </button>
        </div>
      ))}
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
  const [r, setR] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingApplicants, setViewingApplicants] = useState(null); // visit object
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
          if (meData.user.relatives?.length>0) setR(meData.user.relatives[0]);
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
        if (meData.user.relatives?.length>0) setR(meData.user.relatives[0]);
      }
      setVisits(visitsData?.visits?.length > 0 ? visitsData.visits : []);
    } catch {}
  };

  const logout = () => { localStorage.removeItem('vonaxity-token'); document.cookie='vonaxity-token=;path=/;max-age=0'; document.cookie='vonaxity-role=;path=/;max-age=0'; router.push(`/${lang}/login`); };

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:F, color:C.textTertiary, fontSize:14 }}>Loading...</div>;

  const userData = u || { name:'', email:'', subscription:{ plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:0 } };
  const relative = r;
  const relativeDisplay = r || null;
  const plan = (userData.subscription?.plan||'standard').charAt(0).toUpperCase()+(userData.subscription?.plan||'standard').slice(1);
  const isTrial = userData.subscription?.status === 'TRIAL';
  const isExpired = userData.subscription?.status === 'EXPIRED';
  const initials = (userData.name||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const handleBookSuccess = async () => {
    await loadData(); // full sync — updates visits AND subscription count
    setActive('visits');
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
                  {active==='overview' && <Overview user={userData} visits={visits} relative={relativeDisplay} lang={lang} onBook={()=>isExpired ? setActive('subscription') : setActive('book')}/>}
                  {active==='book' && !isExpired && <BookVisit relative={relative} subscription={userData?.subscription} onSuccess={handleBookSuccess} onCancel={()=>setActive('overview')} lang={lang} />}
                  {active==='book' && isExpired && <SubscriptionSection userData={userData} lang={lang} />}
                  {active==='nurses' && <FindNurses lang={lang} onBook={()=>isExpired ? setActive('subscription') : setActive('book')} />}
                  {active==='visits' && <Visits visits={visits} lang={lang} onViewApplicants={(v)=>setViewingApplicants(v)} onRefresh={loadData} viewingDetail={viewingDetail} setViewingDetail={setViewingDetail} />}
                  {active==='subscription' && <SubscriptionSection userData={userData} lang={lang} />}
                  {active==='settings' && <Settings key="settings-page" initialUser={userData} initialRelative={relative} lang={lang}/>}
                </div>
              </>
            )}
          </main>
        </div>

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
