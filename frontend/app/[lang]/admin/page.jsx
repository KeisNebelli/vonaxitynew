'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', primaryDark:'#1D4ED8',
  secondary:'#059669', secondaryLight:'#ECFDF5',
  warning:'#D97706', warningLight:'#FFFBEB',
  error:'#DC2626', errorLight:'#FEF2F2',
  purple:'#7C3AED', purpleLight:'#F5F3FF',
  bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4',
  textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF',
  border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827',
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_CLIENTS = [
  { id:'c1', name:'Arta Murati', email:'client@test.com', phone:'+44 7700 000000', country:'UK', plan:'standard', status:'TRIAL', visitsUsed:1, visitsTotal:2, joinedAt:'2024-11-15', relative:{ name:'Fatmira Murati', city:'Tirana', address:'Rruga e Elbasanit 14', phone:'+355690001111', age:74 } },
  { id:'c2', name:'Besnik Kola', email:'besnik@test.com', phone:'+39 340 000 0000', country:'Italy', plan:'premium', status:'ACTIVE', visitsUsed:3, visitsTotal:4, joinedAt:'2024-10-02', relative:{ name:'Shqipe Kola', city:'Durrës', address:'Rruga Tregtare 5', phone:'+355692002222', age:68 } },
  { id:'c3', name:'Donika Cela', email:'donika@test.com', phone:'+1 212 000 0000', country:'USA', plan:'standard', status:'TRIAL', visitsUsed:0, visitsTotal:2, joinedAt:'2024-12-01', relative:{ name:'Ndrek Cela', city:'Shkodër', address:'Rruga Vasil Shanto 8', phone:'+355693003333', age:79 } },
  { id:'c4', name:'Gjon Marku', email:'gjon@test.com', phone:'+49 160 000 0000', country:'Germany', plan:'basic', status:'ACTIVE', visitsUsed:1, visitsTotal:1, joinedAt:'2024-09-20', relative:{ name:'Mira Marku', city:'Tirana', address:'Bulevardi Zogu I 12', phone:'+355694004444', age:71 } },
  { id:'c5', name:'Entela Hoxha', email:'entela@test.com', phone:'+44 7800 000000', country:'UK', plan:'premium', status:'ACTIVE', visitsUsed:2, visitsTotal:4, joinedAt:'2024-08-10', relative:{ name:'Ramazan Hoxha', city:'Elbasan', address:'Rruga 28 Nentori 3', phone:'+355695005555', age:83 } },
];

const MOCK_NURSES = [
  { id:'n1', name:'Elona Berberi', email:'nurse@test.com', phone:'+355690001111', city:'Tirana', status:'APPROVED', rating:4.9, totalVisits:47, totalEarnings:940, licenseNumber:'ALB-2024-001', availability:['Monday','Tuesday','Wednesday','Friday'], joinedAt:'2024-03-10', bio:'6 years experience in cardiovascular and diabetic care.' },
  { id:'n2', name:'Mirjeta Doshi', email:'mirjeta@test.com', phone:'+355690002222', city:'Durrës', status:'APPROVED', rating:4.7, totalVisits:31, totalEarnings:620, licenseNumber:'ALB-2024-002', availability:['Tuesday','Thursday','Friday','Saturday'], joinedAt:'2024-06-15', bio:'Post-surgical care and welfare checks specialist.' },
  { id:'n3', name:'Arjana Teli', email:'arjana@test.com', phone:'+355690003333', city:'Tirana', status:'PENDING', rating:0, totalVisits:0, totalEarnings:0, licenseNumber:'ALB-2024-003', availability:['Monday','Wednesday','Friday'], joinedAt:'2024-12-18', bio:'Recent graduate, eager to serve families.' },
  { id:'n4', name:'Fatjona Leka', email:'fatjona@test.com', phone:'+355690004444', city:'Fier', status:'APPROVED', rating:4.9, totalVisits:22, totalEarnings:440, licenseNumber:'ALB-2024-004', availability:['Monday','Tuesday','Thursday'], joinedAt:'2024-08-01', bio:'Preventive care and health education.' },
  { id:'n5', name:'Besa Marku', email:'besa@test.com', phone:'+355690005555', city:'Tirana', status:'SUSPENDED', rating:3.8, totalVisits:12, totalEarnings:240, licenseNumber:'ALB-2024-005', availability:[], joinedAt:'2024-05-20', bio:'Geriatric nursing specialist.' },
];

const MOCK_VISITS = [
  { id:'v1', clientName:'Fatmira Murati', clientId:'c1', nurseName:'Elona Berberi', nurseId:'n1', city:'Tirana', service:'Blood Pressure + Glucose Check', scheduledAt:'2024-12-20T10:00:00Z', status:'PENDING', notes:'Patient has diabetes.', bp:null, glucose:null, nurseNotes:null },
  { id:'v2', clientName:'Shqipe Kola', clientId:'c2', nurseName:'Mirjeta Doshi', nurseId:'n2', city:'Durrës', service:'Vitals Monitoring', scheduledAt:'2024-12-20T14:00:00Z', status:'PENDING', notes:'Post-surgery check.', bp:null, glucose:null, nurseNotes:null },
  { id:'v3', clientName:'Ndrek Cela', clientId:'c3', nurseName:null, nurseId:null, city:'Shkodër', service:'Welfare Check', scheduledAt:'2024-12-22T09:00:00Z', status:'UNASSIGNED', notes:'First visit.', bp:null, glucose:null, nurseNotes:null },
  { id:'v4', clientName:'Fatmira Murati', clientId:'c1', nurseName:'Elona Berberi', nurseId:'n1', city:'Tirana', service:'Blood Pressure Check', scheduledAt:'2024-11-28T10:00:00Z', status:'COMPLETED', notes:'', bp:'128/82', glucose:'5.4', nurseNotes:'Patient in good spirits. BP slightly elevated.' },
  { id:'v5', clientName:'Ramazan Hoxha', clientId:'c5', nurseName:null, nurseId:null, city:'Elbasan', service:'Blood Work Collection', scheduledAt:'2024-12-21T11:00:00Z', status:'UNASSIGNED', notes:'Fasting required.', bp:null, glucose:null, nurseNotes:null },
  { id:'v6', clientName:'Mira Marku', clientId:'c4', nurseName:'Elona Berberi', nurseId:'n1', city:'Tirana', service:'Welfare Check', scheduledAt:'2024-12-18T09:00:00Z', status:'NO_SHOW', notes:'', bp:null, glucose:null, nurseNotes:'Patient did not answer door.' },
];

const MOCK_PAYMENTS = [
  { id:'p1', clientName:'Besnik Kola', plan:'Premium', amount:120, date:'2024-12-01', status:'paid' },
  { id:'p2', clientName:'Arta Murati', plan:'Standard', amount:50, date:'2024-12-01', status:'paid' },
  { id:'p3', clientName:'Entela Hoxha', plan:'Premium', amount:120, date:'2024-12-01', status:'paid' },
  { id:'p4', clientName:'Gjon Marku', plan:'Basic', amount:30, date:'2024-11-22', status:'failed' },
  { id:'p5', clientName:'Donika Cela', plan:'Standard', amount:50, date:'2024-12-01', status:'paid' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const Badge = ({ label, type='default', small=false }) => {
  const types = {
    default:[C.bgSubtle,C.textSecondary],
    success:[C.secondaryLight,C.secondary],
    warning:[C.warningLight,C.warning],
    error:[C.errorLight,C.error],
    primary:[C.primaryLight,C.primary],
    purple:[C.purpleLight,C.purple],
  };
  const [bg,color] = types[type]||types.default;
  return <span style={{ fontSize:small?11:12, fontWeight:600, padding:small?'3px 8px':'4px 10px', borderRadius:99, background:bg, color, display:'inline-block', whiteSpace:'nowrap' }}>{label}</span>;
};

const statusBadge = (status, lang='en') => {
  const map = {
    ACTIVE:'success', APPROVED:'success', COMPLETED:'success', paid:'success',
    TRIAL:'warning', PENDING:'warning', pending:'warning',
    SUSPENDED:'error', UNASSIGNED:'error', NO_SHOW:'error', CANCELLED:'error', failed:'error',
    IN_PROGRESS:'primary', ON_THE_WAY:'primary',
  };
  const statusText = t(lang, 'admin.status.'+status) || status;
  return <Badge label={statusText} type={map[status]||'default'} />;
};

const inp = { padding:'9px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit' };
const searchInp = { ...inp, paddingLeft:32, width:'100%', boxSizing:'border-box' };

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position:'relative' }}>
      <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.textTertiary }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input style={searchInp} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||'Search...'} />
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { id:'overview', label:'Overview', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'clients', label:'Clients', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { id:'nurses', label:'Nurses', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id:'visits', label:'Visits', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'alerts', label:'Alerts', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { id:'payments', label:'Payments', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'analytics', label:'Analytics', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id:'ai', label:'AI Assistant', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>, highlight:true },
  { id:'settings', label:'Settings', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

const ADMIN_LABELS = {
  en:{ overview:'Admin Overview', clients:'Clients', nurses:'Nurses', visits:'Visits', alerts:'Alerts', payments:'Payments', analytics:'Analytics', ai:'AI Assistant', settings:'Settings' },
  sq:{ overview:'Pasqyra', clients:'Klientët', nurses:'Infermierët', visits:'Vizitat', alerts:'Alarmet', payments:'Pagesat', analytics:'Analitika', ai:'Asistenti AI', settings:'Cilësimet' },
};

const F = "'DM Sans','Inter',system-ui,sans-serif";
const SSM = '0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04)';
const SMD = '0 4px 12px rgba(15,23,42,0.08),0 2px 4px rgba(15,23,42,0.04)';

function SidebarContent({ mobile=false, active, setActive, onLogout, alertCount, setOpen, lang="en" }) {
  return (
    <>
      <div style={{ padding:'22px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        {mobile ? (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>
              <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'2px', marginTop:2 }}>{t(lang, 'admin.adminCRM')}</div>
            </div>
            <button onClick={()=>setOpen(false)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.6)', borderRadius:8, width:30,height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
          </div>
        ) : (
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'2px', marginTop:2 }}>{t(lang, 'admin.adminCRM')}</div>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'linear-gradient(135deg,#7C3AED,#5B21B6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0 }}>A</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>Admin</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>admin@vonaxity.com</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'10px', overflowY:'auto' }}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>{ setActive(item.id); if(mobile)setOpen(false); }}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:mobile?'12px 12px':'10px 12px', borderRadius:10, border:'none', background:active===item.id?(item.highlight?'rgba(124,58,237,0.25)':'rgba(37,99,235,0.22)'):'transparent', color:active===item.id?(item.highlight?'#C4B5FD':'#93C5FD'):'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:mobile?14:13, fontWeight:active===item.id?700:500, marginBottom:2, textAlign:'left', fontFamily:F, transition:'all 0.15s' }}>
            {item.icon}
            <span style={{ flex:1 }}>{(ADMIN_LABELS[lang]||ADMIN_LABELS.en)[item.id]||item.label}</span>
            {item.id==='alerts' && alertCount>0 && <span style={{ fontSize:10,fontWeight:800,background:'#DC2626',color:'#fff',borderRadius:99,padding:'2px 6px',minWidth:18,textAlign:'center' }}>{alertCount}</span>}
          </button>
        ))}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        {mobile ? (
          <button onClick={onLogout} style={{ width:'100%', padding:'13px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#F87171', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:F }}>{t(lang, 'admin.signOut')}</button>
        ) : (
          <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', background:'transparent', border:'none', cursor:'pointer', fontFamily:F, padding:0 }}>{t(lang, 'admin.signOut')}</button>
        )}
      </div>
    </>
  );
}

function AdminSidebar({ active, setActive, onLogout, alertCount, open, setOpen, lang="en" }) {
  return (
    <>
      <div style={{ width:224, background:'#0F172A', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', flexShrink:0 }} className="admin-desk-sb">
        <SidebarContent active={active} setActive={setActive} onLogout={onLogout} alertCount={alertCount} setOpen={setOpen} lang={lang} />
      </div>
      {open && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:39 }} onClick={()=>setOpen(false)} />}
      <div style={{ display:'none', position:'fixed', top:0, left:0, height:'100vh', width:270, background:'#0F172A', flexDirection:'column', zIndex:50, transform:open?'translateX(0)':'translateX(-100%)', transition:'transform 0.25s ease', boxShadow:'4px 0 24px rgba(0,0,0,0.3)' }} className="admin-mob-sb">
        <SidebarContent mobile active={active} setActive={setActive} onLogout={onLogout} alertCount={alertCount} setOpen={setOpen} lang={lang} />
      </div>
      <style>{`@media(max-width:768px){.admin-desk-sb{display:none!important;}.admin-mob-sb{display:flex!important;}}`}</style>
    </>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview({ setActive, nurses, clients, visits, payments, lang='en' }) {
  const tr = (key) => t(lang, key);
  const unassigned = visits.filter(v=>v.status==='UNASSIGNED');
  const pending = nurses.filter(n=>['PENDING','INCOMPLETE'].includes(n.status));
  const todayVisits = visits.filter(v=>['PENDING','IN_PROGRESS','ON_THE_WAY'].includes(v.status));
  const revenue = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);

  return (
    <div>
      {/* Metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
        {[
          [tr('admin.totalClients'), clients.length, C.primary, 'clients'],
          [tr('admin.activeNurses'), nurses.filter(n=>n.status==='APPROVED').length, C.secondary, 'nurses'],
          [tr('admin.visitsToday'), todayVisits.length, C.purple, 'visits'],
          [tr('admin.unassigned'), unassigned.length, unassigned.length>0?C.error:C.textTertiary, 'alerts'],
          [tr('admin.revenue'), `€${revenue}`, C.secondary, 'payments'],
          [tr('admin.pendingNurses'), pending.length, pending.length>0?C.warning:C.textTertiary, 'nurses'],
        ].map(([label,value,color,tab]) => (
          <div key={label} onClick={()=>setActive(tab)} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'18px', cursor:'pointer' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(unassigned.length > 0 || pending.length > 0) && (
        <div style={{ marginBottom:24 }}>
          {unassigned.length > 0 && (
            <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.error }}>{unassigned.length} {tr('admin.visitCountSuffix')} {tr('admin.unassigned')}</div>
              <button onClick={()=>setActive('alerts')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.error, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>{tr('admin.fixNow')}</button>
            </div>
          )}
          {pending.length > 0 && (
            <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.warning }}>{pending.length} {tr('admin.nurseCountSuffix')} {tr('admin.pendingNurses')}</div>
              <button onClick={()=>setActive('nurses')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.warning, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>{tr('admin.reviewBtn')}</button>
            </div>
          )}
        </div>
      )}

      {/* Recent visits */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.recentVisits')||'Recent visits'}</div>
          {visits.slice(0,4).map((v,i) => (
            <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<3?`1px solid ${C.borderSubtle}`:'none' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:C.textPrimary }}>{v.clientName}</div>
                <div style={{ fontSize:11, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city}</div>
              </div>
              {statusBadge(v.status)}
            </div>
          ))}
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.recentPayments')||'Recent payments'}</div>
          {payments.slice(0,4).map((p,i) => (
            <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<3?`1px solid ${C.borderSubtle}`:'none' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:C.textPrimary }}>{p.clientName}</div>
                <div style={{ fontSize:11, color:C.textTertiary, marginTop:2 }}>{p.plan} · {p.date}</div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>€{p.amount}</span>
                {statusBadge(p.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Clients ───────────────────────────────────────────────────────────────────
function Clients({ clients, visits, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => clients.filter(c => {
    const name = (c.name||'').toLowerCase();
    const email = (c.email||'').toLowerCase();
    const country = (c.country||'').toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || country.includes(search.toLowerCase());
    const plan = c.subscription?.plan || c.plan || '';
    const matchPlan = filterPlan==='all' || plan===filterPlan;
    const matchStatus = filterStatus==='all' || c.status===filterStatus;
    return matchSearch && matchPlan && matchStatus;
  }), [search, filterPlan, filterStatus, clients]);

  if (selected) return <ClientDetail client={selected} onBack={()=>setSelected(null)} visits={visits} lang={lang} />;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder={tr('admin.searchClients')} /></div>
        <select style={{...inp}} value={filterPlan} onChange={e=>setFilterPlan(e.target.value)}>
          <option value="all">{tr('admin.allPlans')}</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">{tr('admin.allStatuses')}</option>
          <option value="ACTIVE">{tr('admin.status.ACTIVE')}</option>
          <option value="TRIAL">{tr('admin.status.TRIAL')}</option>
          <option value="CANCELLED">{tr('admin.status.CANCELLED')}</option>
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} {tr('admin.clientCountSuffix')}</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {[tr('admin.clientTable.client'),tr('admin.clientTable.country'),tr('admin.clientTable.plan'),tr('admin.clientTable.status'),tr('admin.clientTable.visitsUsed'),tr('admin.clientTable.joined'),''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i) => (
              <tr key={c.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.borderSubtle}`:'none', cursor:'pointer' }} onClick={()=>setSelected(c)}>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ fontWeight:600, color:C.textPrimary }}>{c.name}</div>
                  <div style={{ fontSize:11, color:C.textTertiary, marginTop:1 }}>{c.email}</div>
                </td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{c.country}</td>
                <td style={{ padding:'12px 16px' }}><Badge label={(c.subscription?.plan || c.plan || 'N/A').charAt(0).toUpperCase()+(c.subscription?.plan || c.plan || 'N/A').slice(1)} type='primary' small /></td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(c.status, lang)}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{c.visitsUsed}/{c.visitsTotal}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary }}>{c.joinedAt}</td>
                <td style={{ padding:'12px 16px' }}><span style={{ color:C.primary, fontWeight:600, fontSize:12 }}>{tr('admin.viewBtn')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>{tr('admin.noClients')}</div>}
      </div>
    </div>
  );
}

function ClientDetail({ client, onBack, visits=[], lang='en' }) {
  const tr = (key) => t(lang, key);
  const clientVisits = visits.filter(v=>v.clientId===client.id||v.relative?.clientId===client.id);
  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {tr('admin.allClients')}
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px' }}>{client.name}</div>
              <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{client.email}</div>
            </div>
            {statusBadge(client.status, lang)}
          </div>
          {[[tr('admin.phone'),client.phone],[tr('admin.country'),client.country],[tr('admin.plan'),(client.subscription?.plan || client.plan || 'N/A').charAt(0).toUpperCase()+(client.subscription?.plan || client.plan || 'N/A').slice(1)],[tr('admin.joined'),client.joinedAt],[tr('admin.visitsUsed'),`${client.subscription?.visitsUsed || 0}/${client.subscription?.visitsPerMonth || 0}`]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.lovedOne')}</div>
          {(client.relatives?.length > 0 ? [
            [tr('settings.theirName'), client.relatives[0].name],
            [tr('admin.city'), client.relatives[0].city],
            [tr('settings.theirAddress'), client.relatives[0].address],
            [tr('admin.phone'), client.relatives[0].phone || tr('admin.notSet')],
            [tr('settings.theirAge'), client.relatives[0].age || tr('admin.notSet')],
          ] : [[tr('admin.lovedOne'), tr('admin.notSet')]]).map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginTop:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.visitHistory')} ({clientVisits.length})</div>
        {clientVisits.length===0 ? <div style={{ fontSize:13, color:C.textTertiary }}>{tr('admin.noVisitsYet')}</div> : clientVisits.map((v,i) => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<clientVisits.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.service}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{new Date(v.scheduledAt).toLocaleDateString()} · {v.nurseName||'No nurse'}</div>
            </div>
            {statusBadge(v.status, lang)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Nurses ────────────────────────────────────────────────────────────────────
function Nurses({ nurses, setNurses, onApprove, onSuspend, onReject, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => nurses.map(n => ({
    ...n,
    name: n.name || n.user?.name || 'Unknown',
    email: n.email || n.user?.email || '',
    phone: n.phone || n.user?.phone || '',
    joinedAt: n.joinedAt || n.createdAt,
  })).filter(n => {
    const nurseName = n.user?.name || n.name || '';
    const nurseEmail = n.user?.email || n.email || '';
    const matchSearch = !search || nurseName.toLowerCase().includes(search.toLowerCase()) || nurseEmail.toLowerCase().includes(search.toLowerCase());
    const matchCity = filterCity==='all' || n.city===filterCity;
    const matchStatus = filterStatus==='all' || n.status===filterStatus;
    return matchSearch && matchCity && matchStatus;
  }), [search, filterCity, filterStatus, nurses]);

  const handleApprove = (id) => onApprove(id);
  const handleSuspend = (id) => onSuspend(id);

  if (selected) return <NurseDetail nurse={nurses.find(n=>n.id===selected)} onBack={()=>setSelected(null)} onApprove={handleApprove} onSuspend={handleSuspend} onReject={onReject} lang={lang} />;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder={tr('admin.searchNurses')} /></div>
        <select style={{...inp}} value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
          <option value="all">{tr('admin.allCities')}</option>
          {['Tirana','Durrës','Elbasan','Fier','Shkodër','Sarandë'].map(c=><option key={c}>{c}</option>)}
        </select>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">{tr('admin.allStatuses')}</option>
          <option value="INCOMPLETE">{tr('admin.status.INCOMPLETE')}</option>
          <option value="PENDING">{tr('admin.status.PENDING')}</option>
          <option value="APPROVED">{tr('admin.status.APPROVED')}</option>
          <option value="REJECTED">{tr('admin.status.REJECTED')}</option>
          <option value="SUSPENDED">{tr('admin.status.SUSPENDED')}</option>
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} {tr('admin.nurseCountSuffix')}</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {[tr('admin.nurseTable.nurse'),tr('admin.nurseTable.city'),tr('admin.nurseTable.status'),tr('admin.nurseTable.rating'),tr('admin.nurseTable.visits'),tr('admin.nurseTable.license'),tr('admin.nurseTable.actions')].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((n,i) => (
              <tr key={n.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
                <td style={{ padding:'12px 16px', cursor:'pointer' }} onClick={()=>setSelected(n.id)}>
                  <div style={{ fontWeight:600, color:C.textPrimary }}>{n.user?.name || n.name || '—'}</div>
                  <div style={{ fontSize:11, color:C.textTertiary, marginTop:1 }}>{n.user?.email || n.email || '—'}</div>
                </td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{n.city || '—'}</td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(n.status, lang)}</td>
                <td style={{ padding:'12px 16px', color:n.rating>0?C.warning:C.textTertiary, fontWeight:600 }}>{n.rating>0?`${n.rating}`:tr('admin.notYetRated')}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{n.totalVisits || 0}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary, fontSize:12 }}>{n.licenseNumber || '—'}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {(n.status==='PENDING'||n.status==='INCOMPLETE') && <>
                      <button onClick={()=>handleApprove(n.id)} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:6, cursor:'pointer' }}>{tr('admin.approve')}</button>
                      <button onClick={()=>onReject(n.id, 'Rejected by admin')} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.errorLight, color:C.error, border:'none', borderRadius:6, cursor:'pointer' }}>{tr('admin.reject')}</button>
                    </>}
                    {n.status==='APPROVED' && <button onClick={()=>handleSuspend(n.id)} style={{ fontSize:11, padding:'5px 10px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:6, cursor:'pointer' }}>{tr('admin.suspend')}</button>}
                    {(n.status==='SUSPENDED'||n.status==='REJECTED') && <button onClick={()=>handleApprove(n.id)} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:6, cursor:'pointer' }}>{tr('admin.reinstate')}</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>{tr('admin.noNurses')}</div>}
      </div>
    </div>
  );
}

function NurseDetail({ nurse, onBack, onApprove, onSuspend, onReject, lang='en' }) {
  const tr = (key) => t(lang, key);
  if (!nurse) return null;
  const name = nurse.name || nurse.user?.name || 'Unknown';
  const email = nurse.email || nurse.user?.email || '';
  const phone = nurse.phone || nurse.user?.phone || '';
  const nurseVisits = (nurse.visits || []);
  let availability = [];
  try { availability = typeof nurse.availability === 'string' ? JSON.parse(nurse.availability) : (nurse.availability || []); } catch {}
  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {tr('admin.allNurses')}
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:C.textPrimary }}>{name}</div>
              <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{email}</div>
            </div>
            {statusBadge(nurse.status, lang)}
          </div>
          {[[tr('admin.phone'),phone],[tr('admin.city'),nurse.city||tr('admin.notSet')],[tr('admin.nurseTable.license'),nurse.licenseNumber||tr('admin.notSet')],[tr('onboarding.issuingAuthority'),nurse.issuingAuthority||tr('admin.notSet')],[tr('dashboard.experienceLabel'),nurse.experience||tr('admin.notSet')],[tr('admin.nurseTable.rating'),nurse.rating>0?nurse.rating:tr('admin.notYetRated')],[tr('admin.nurseTable.visits'),nurse.totalVisits||0],[tr('admin.notSubmitted'),nurse.submittedAt?new Date(nurse.submittedAt).toLocaleDateString():tr('admin.notSubmitted')],[tr('admin.joined'),nurse.createdAt?new Date(nurse.createdAt).toLocaleDateString():'']].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:v===tr('admin.notSet')||v===tr('admin.notSubmitted')?C.warning:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16, display:'flex', gap:8 }}>
            {(nurse.status==='PENDING'||nurse.status==='INCOMPLETE') && <>
              <button onClick={()=>onApprove(nurse.id)} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.secondary, color:'#fff', border:'none', borderRadius:9, cursor:'pointer' }}>{tr('admin.approve')}</button>
              <button onClick={()=>onReject(nurse.id, 'Rejected by admin')} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.errorLight, color:C.error, border:'none', borderRadius:9, cursor:'pointer' }}>{tr('admin.reject')}</button>
            </>}
            {nurse.status==='APPROVED' && <button onClick={()=>onSuspend(nurse.id)} style={{ fontSize:13, padding:'9px 18px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:9, cursor:'pointer' }}>{tr('admin.suspend')}</button>}
            {(nurse.status==='SUSPENDED'||nurse.status==='REJECTED') && <button onClick={()=>onApprove(nurse.id)} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:9, cursor:'pointer' }}>{tr('admin.reinstate')}</button>}
          </div>
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>{tr('admin.availabilityLabel')}</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
              const full = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
              const active = availability.includes(full[d]);
              return <span key={d} style={{ fontSize:12, fontWeight:600, padding:'5px 10px', borderRadius:8, background:active?C.primaryLight:C.bgSubtle, color:active?C.primary:C.textTertiary, border:`1px solid ${active?'rgba(37,99,235,0.2)':C.border}` }}>{d}</span>;
            })}
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{tr('admin.bioLabel')}</div>
          <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{nurse.bio}</div>
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.visitHistory')} ({nurseVisits.length})</div>
        {nurseVisits.length===0 ? <div style={{ fontSize:13, color:C.textTertiary }}>{tr('admin.noVisitsYet')}</div> : nurseVisits.map((v,i) => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<nurseVisits.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.clientName}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
              {v.nurseNotes && <div style={{ fontSize:11, color:C.textTertiary, marginTop:2, fontStyle:'italic' }}>{v.nurseNotes}</div>}
            </div>
            {statusBadge(v.status, lang)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Visits ────────────────────────────────────────────────────────────────────
function Visits({ visits, setVisits, nurses, onAssign, lang='en' }) {
  const tr = (key) => t(lang, key);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [assigning, setAssigning] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => visits.filter(v => {
    const matchSearch = !search || v.clientName.toLowerCase().includes(search.toLowerCase()) || (v.nurseName||'').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus==='all' || v.status===filterStatus;
    const matchCity = filterCity==='all' || v.city===filterCity;
    return matchSearch && matchStatus && matchCity;
  }), [search, filterStatus, filterCity, visits]);

  const handleAssign = (visitId, nurse) => onAssign(visitId, nurse.id);

  if (selected) {
    const v = visits.find(vv=>vv.id===selected);
    return (
      <div>
        <button onClick={()=>setSelected(null)} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          {tr('admin.allVisits')}
        </button>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:C.textPrimary }}>{v.clientName}</div>
                <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{v.service}</div>
              </div>
              {statusBadge(v.status, lang)}
            </div>
            {[[tr('admin.city'),v.city],[tr('workOrder.scheduledAt'),new Date(v.scheduledAt).toLocaleString()],[tr('admin.nurseTable.nurse'),v.nurseName||tr('admin.unassignedLabel')],[tr('admin.notes'),v.notes||'—'],[tr('admin.bpLabel'),v.bp||'N/A'],[tr('admin.glucoseLabel'),v.glucose?`${v.glucose} mmol/L`:'N/A']].map(([k,val]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
                <span style={{ color:C.textTertiary }}>{k}</span>
                <span style={{ color:C.textPrimary, fontWeight:500 }}>{val}</span>
              </div>
            ))}
            {v.nurseNotes && <div style={{ marginTop:16, background:C.bg, borderRadius:10, padding:'12px 14px', fontSize:13, color:C.textSecondary }}><strong>{tr('admin.nurseNotesLabel')}</strong> {v.nurseNotes}</div>}
          </div>
          {v.status!=='COMPLETED' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>{tr('admin.assignNurseLabel')}</div>
              {nurses.filter(n=>n.status==='APPROVED'&&(n.city===v.city||n.city===v.relative?.city)).map(n => (
                <button key={n.id} onClick={()=>handleAssign(v.id,n)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'12px 16px', background:v.nurseId===n.id?C.primaryLight:C.bg, border:`1px solid ${v.nurseId===n.id?C.primary:C.border}`, borderRadius:10, cursor:'pointer', marginBottom:8, textAlign:'left' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.user?.name || n.name || '—'}</div>
                    <div style={{ fontSize:12, color:C.textTertiary }}>{tr('admin.nurseTable.rating')} {n.rating || 'N/A'} · {n.totalVisits || 0} {tr('admin.visitCountSuffix')}</div>
                  </div>
                  {v.nurseId===n.id ? <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>{tr('admin.assigned')}</span> : <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>{tr('admin.assignBtn')}</span>}
                </button>
              ))}
              {nurses.filter(n=>n.status==='APPROVED'&&(n.city===v.city||n.city===v.relative?.city)).length===0 && <div style={{ fontSize:13, color:C.error }}>{tr('admin.noNurseInCity')}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder={tr('admin.searchVisits')} /></div>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">{tr('admin.allStatuses')}</option>
          {['UNASSIGNED','PENDING','IN_PROGRESS','COMPLETED','NO_SHOW','CANCELLED'].map(s=><option key={s}>{t(lang, 'admin.status.'+s)||s}</option>)}
        </select>
        <select style={{...inp}} value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
          <option value="all">{tr('admin.allCities')}</option>
          {['Tirana','Durrës','Elbasan','Fier','Shkodër'].map(c=><option key={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} {tr('admin.visitCountSuffix')}</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {[tr('admin.visitTable.patient'),tr('admin.visitTable.service'),tr('admin.visitTable.city'),tr('admin.visitTable.date'),tr('admin.visitTable.nurse'),tr('admin.visitTable.status'),''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v,i) => (
              <tr key={v.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
                <td style={{ padding:'12px 16px', fontWeight:600, color:C.textPrimary }}>{v.clientName}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary, fontSize:12 }}>{v.service}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{v.city}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary, fontSize:12 }}>{new Date(v.scheduledAt).toLocaleDateString()}</td>
                <td style={{ padding:'12px 16px', color:v.nurseName?C.textPrimary:C.error, fontWeight:v.nurseName?400:600 }}>{v.nurseName||tr('admin.unassignedLabel')}</td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(v.status, lang)}</td>
                <td style={{ padding:'12px 16px' }}><button onClick={()=>setSelected(v.id)} style={{ fontSize:12, fontWeight:600, color:C.primary, background:'transparent', border:'none', cursor:'pointer' }}>{tr('admin.viewBtn')}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>{tr('admin.noVisits')}</div>}
      </div>
    </div>
  );
}

// ── Alerts ────────────────────────────────────────────────────────────────────
function AlertGroup({ title, count, color, children, lang='en' }) {
  const tr = (key) => t(lang, key);
  return (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:16, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:count>0?`rgba(${color==='red'?'220,38,38':color==='yellow'?'217,119,6':'37,99,235'},0.04)`:'transparent' }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{title}</div>
        <Badge label={`${count} issue${count!==1?'s':''}`} type={count>0?(color==='red'?'error':color==='yellow'?'warning':'primary'):'default'} />
      </div>
      <div style={{ padding:'4px 0' }}>{children}</div>
    </div>
  );
}

function Alerts({ visits, nurses, setVisits, setNurses, onApprove, onSuspend, onReject, onAssign, lang='en' }) {
  const tr = (key) => t(lang, key);
  const unassigned = visits.filter(v=>v.status==='UNASSIGNED');
  const noShow = visits.filter(v=>v.status==='NO_SHOW');
  const pendingNurses = nurses.filter(n=>['PENDING','INCOMPLETE'].includes(n.status));
  const incompleteReports = visits.filter(v=>v.status==='COMPLETED'&&!v.nurseNotes);



  const handleAssignAlert = (visitId, nurseId) => onAssign(visitId, nurseId);

  return (
    <div>
      <AlertGroup title={tr('admin.unassignedLabel')} count={unassigned.length} color="red" lang={lang}>
        {unassigned.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>{tr('admin.allAssigned')}</div> : unassigned.map(v => (
          <div key={v.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {nurses.filter(n=>n.status==='APPROVED'&&(n.city===v.city||n.city===v.relative?.city)).slice(0,2).map(n => (
                <button key={n.id} onClick={()=>handleAssignAlert(v.id,n.id)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.primaryLight, color:C.primary, border:`1px solid rgba(37,99,235,0.2)`, borderRadius:8, cursor:'pointer' }}>
                  {tr('admin.assignNurse')}
                </button>
              ))}
              {nurses.filter(n=>n.status==='APPROVED'&&(n.city===v.city||n.city===v.relative?.city)).length===0 && <span style={{ fontSize:12, color:C.error }}>{tr('admin.noNurseInCity')}</span>}
            </div>
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title={tr('admin.pendingNurses')} count={pendingNurses.length} color="yellow" lang={lang}>
        {pendingNurses.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>{tr('admin.noPendingApps')}</div> : pendingNurses.map(n => (
          <div key={n.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.user?.name || n.name || '—'}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{n.city || tr('admin.cityNotSet')} · {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '—'} · {n.licenseNumber || tr('admin.licensePending')}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>onApprove(n.id)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>{tr('admin.approve')}</button>
              <button onClick={()=>onReject(n.id, 'Rejected by admin')} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.errorLight, color:C.error, border:'none', borderRadius:8, cursor:'pointer' }}>{tr('admin.reject')}</button>
            </div>
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title={t(lang,'visits.status.NO_SHOW')} count={noShow.length} color="red" lang={lang}>
        {noShow.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>{tr('admin.noNoShows')}</div> : noShow.map(v => (
          <div key={v.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
            {v.nurseNotes && <div style={{ fontSize:12, color:C.textSecondary, marginTop:4, fontStyle:'italic' }}>"{v.nurseNotes}"</div>}
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title={tr('admin.allReportsComplete')} count={incompleteReports.length} color="blue" lang={lang}>
        {incompleteReports.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>{tr('admin.allReportsComplete')}</div> : incompleteReports.map(v => (
          <div key={v.id} style={{ padding:'14px 20px' }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.nurseName} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
          </div>
        ))}
      </AlertGroup>
    </div>
  );
}

// ── Payments ──────────────────────────────────────────────────────────────────
function Payments({ payments, lang='en' }) {
  const tr = (key) => t(lang, key);
  const total = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
  const failed = payments.filter(p=>p.status==='failed');
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        {[[tr('admin.totalRevenue'),`€${total}`,C.secondary],[tr('admin.successful'),payments.filter(p=>p.status==='paid').length,C.secondary],[tr('admin.failedPayments'),failed.length,failed.length>0?C.error:C.textTertiary]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {failed.length>0 && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.error, marginBottom:4 }}>{failed.length} {tr('admin.failedPayments')}</div>
          {failed.map(p => <div key={p.id} style={{ fontSize:12, color:C.error }}>{p.clientName} · {p.plan} · €{p.amount} · {p.date}</div>)}
        </div>
      )}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{tr('admin.allTransactions')}</div>
          <button style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer' }}>{tr('admin.exportCSV')}</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {[tr('admin.paymentTable.client'),tr('admin.paymentTable.plan'),tr('admin.paymentTable.amount'),tr('admin.paymentTable.date'),tr('admin.paymentTable.status'),''].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p,i) => (
              <tr key={p.id} style={{ borderBottom:i<payments.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
                <td style={{ padding:'12px 16px', fontWeight:600, color:C.textPrimary }}>{p.clientName}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{p.plan}</td>
                <td style={{ padding:'12px 16px', fontWeight:700, color:C.textPrimary }}>€{p.amount}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary }}>{p.date}</td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(p.status, lang)}</td>
                <td style={{ padding:'12px 16px' }}>
                  {p.status==='failed' && <button style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.warningLight, color:C.warning, border:'none', borderRadius:6, cursor:'pointer' }}>{tr('admin.retry')}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AI Assistant ──────────────────────────────────────────────────────────────
function Analytics({ clients, nurses, visits, payments=[], lang='en' }) {
  const tr = (key) => t(lang, key);
  const completed = visits.filter(v=>v.status==='COMPLETED');
  const unassigned = visits.filter(v=>v.status==='UNASSIGNED');
  const approved = nurses.filter(n=>n.status==='APPROVED');
  const revenue = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+(p.amount||0),0);

  // City breakdown
  const cityMap = {};
  visits.forEach(v=>{ const c=v.relative?.city||v.city||'Unknown'; cityMap[c]=(cityMap[c]||0)+1; });
  const cities = Object.entries(cityMap).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxCity = cities[0]?.[1]||1;

  // Monthly visits (last 6 months)
  const now = new Date();
  const months = Array.from({length:6},(_,i)=>{
    const d = new Date(now.getFullYear(), now.getMonth()-5+i, 1);
    return { label:d.toLocaleString('default',{month:'short'}), year:d.getFullYear(), month:d.getMonth() };
  });
  const monthlyData = months.map(m=>({
    ...m,
    count: visits.filter(v=>{ const d=new Date(v.scheduledAt); return d.getMonth()===m.month&&d.getFullYear()===m.year; }).length
  }));
  const maxMonth = Math.max(...monthlyData.map(m=>m.count),1);

  // Service breakdown
  const svcMap = {};
  visits.forEach(v=>{ const s=v.serviceType||'Other'; svcMap[s]=(svcMap[s]||0)+1; });
  const services = Object.entries(svcMap).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const Card = ({children, style={}}) => <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, ...style }}>{children}</div>;
  const SectionTitle = ({children}) => <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:16 }}>{children}</div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
        {[[tr('admin.analyticsLabels.totalClients'),clients.length,C.primary],[tr('admin.analyticsLabels.activeNurses'),approved.length,C.secondary],[tr('admin.analyticsLabels.visitsCompleted'),completed.length,C.purple],[tr('admin.analyticsLabels.revenue'),`€${revenue}`,C.warning]].map(([label,val,color])=>(
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:800, color, letterSpacing:'-0.5px' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Monthly visits chart */}
      <Card>
        <SectionTitle>{tr('admin.visitsPerMonth')}</SectionTitle>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:120 }}>
          {monthlyData.map(m=>(
            <div key={m.label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary }}>{m.count||''}</div>
              <div style={{ width:'100%', background:C.primary, borderRadius:'4px 4px 0 0', height:`${Math.max(4,(m.count/maxMonth)*90)}px`, opacity:0.85 }} />
              <div style={{ fontSize:11, color:C.textTertiary }}>{m.label}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* City breakdown */}
        <Card>
          <SectionTitle>{tr('admin.visitsByCity')}</SectionTitle>
          {cities.length ? cities.map(([city,count])=>(
            <div key={city} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                <span style={{ color:C.textPrimary, fontWeight:500 }}>{city}</span>
                <span style={{ color:C.textTertiary }}>{count}</span>
              </div>
              <div style={{ background:C.bgSubtle, borderRadius:4, height:6 }}>
                <div style={{ background:C.secondary, borderRadius:4, height:6, width:`${(count/maxCity)*100}%` }} />
              </div>
            </div>
          )) : <div style={{ color:C.textTertiary, fontSize:13 }}>{tr('admin.noData')}</div>}
        </Card>

        {/* Service breakdown */}
        <Card>
          <SectionTitle>{tr('admin.topServices')}</SectionTitle>
          {services.length ? services.map(([svc,count],i)=>(
            <div key={svc} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:i<services.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
              <div style={{ fontSize:12, color:C.textPrimary, fontWeight:500, flex:1, marginRight:8 }}>{svc}</div>
              <span style={{ fontSize:12, fontWeight:700, color:C.primary, background:C.primaryLight, padding:'2px 8px', borderRadius:99 }}>{count}</span>
            </div>
          )) : <div style={{ color:C.textTertiary, fontSize:13 }}>{tr('admin.noData')}</div>}
        </Card>
      </div>

      {/* Nurse stats */}
      <Card>
        <SectionTitle>{tr('admin.nursePipeline')}</SectionTitle>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {[[t(lang,'admin.status.APPROVED'),nurses.filter(n=>n.status==='APPROVED').length,'#ECFDF5','#059669'],[t(lang,'admin.status.PENDING'),nurses.filter(n=>n.status==='PENDING').length,'#FFFBEB','#D97706'],[t(lang,'admin.status.INCOMPLETE'),nurses.filter(n=>n.status==='INCOMPLETE').length,'#F1F5F9','#475569'],[t(lang,'admin.status.REJECTED'),nurses.filter(n=>n.status==='REJECTED').length,'#FEF2F2','#DC2626'],[t(lang,'admin.status.SUSPENDED'),nurses.filter(n=>n.status==='SUSPENDED').length,'#F5F3FF','#7C3AED']].map(([label,count,bg,color])=>(
            <div key={label} style={{ background:bg, borderRadius:10, padding:'12px 16px', minWidth:100, textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color }}>{count}</div>
              <div style={{ fontSize:11, color, marginTop:2, fontWeight:600 }}>{label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AIAssistant({ clients, nurses, visits, payments=[], lang='en' }) {
  const tr = (key) => t(lang, key);
  const [messages, setMessages] = useState([
    { role:'assistant', content:t(lang,'admin.aiSubtitle') }
  ]);
  const [input, setInput] = useState('');

  // Free rule-based engine — no API costs
  const analyze = (q) => {
    const query = q.toLowerCase();
    const unassigned = visits.filter(v=>v.status==='UNASSIGNED');
    const pending = nurses.filter(n=>n.status==='PENDING');
    const approved = nurses.filter(n=>n.status==='APPROVED');
    const completed = visits.filter(v=>v.status==='COMPLETED');
    const noShow = visits.filter(v=>v.status==='NO_SHOW');
    const revenue = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);

    if (query.includes('unassigned')) {
      if (unassigned.length===0) return 'All visits are currently assigned. No action needed.';
      return `There are ${unassigned.length} unassigned visit${unassigned.length>1?'s':''}:\n\n${unassigned.map(v=>`• ${v.clientName} — ${v.service} in ${v.city} on ${new Date(v.scheduledAt).toLocaleDateString()}`).join('\n')}\n\nGo to the Alerts tab to assign nurses quickly.`;
    }
    if (query.includes('tirana') && (query.includes('nurse') || query.includes('available'))) {
      const tiranaApproved = approved.filter(n=>n.city==='Tirana');
      return `${tiranaApproved.length} approved nurse${tiranaApproved.length!==1?'s':''} available in Tirana:\n\n${tiranaApproved.map(n=>`• ${n.name} — Rating ${n.rating} · ${n.totalVisits} visits\n  Available: ${n.availability.slice(0,3).join(', ')}${n.availability.length>3?'...':''}`).join('\n\n')}`;
    }
    if (query.includes('nurse') && (query.includes('available') || query.includes('approved'))) {
      const byCity = {};
      approved.forEach(n=>{ if(!byCity[n.city]) byCity[n.city]=[]; byCity[n.city].push(n.name); });
      return `${approved.length} approved nurses across ${Object.keys(byCity).length} cities:\n\n${Object.entries(byCity).map(([city,ns])=>`• ${city}: ${ns.join(', ')}`).join('\n')}`;
    }
    if (query.includes('premium')) {
      const premiumClients = clients.filter(c=>c.plan==='premium');
      return `${premiumClients.length} clients on the Premium plan:\n\n${premiumClients.map(c=>`• ${c.name} (${c.country}) — ${c.status} · ${c.visitsUsed}/${c.visitsTotal} visits used`).join('\n')}`;
    }
    if (query.includes('pending') && query.includes('nurse')) {
      if (pending.length===0) return 'No nurse applications pending. All applications have been reviewed.';
      return `${pending.length} nurse application${pending.length!==1?'s':''} awaiting review:\n\n${pending.map(n=>`• ${n.name} — ${n.city} · Applied ${n.joinedAt}\n  License: ${n.licenseNumber}`).join('\n\n')}\n\nGo to the Nurses tab or Alerts to approve or reject.`;
    }
    if (query.includes('today') || query.includes('scheduled')) {
      const today = visits.filter(v=>['PENDING','IN_PROGRESS','ON_THE_WAY'].includes(v.status));
      if (today.length===0) return 'No visits scheduled or in progress right now.';
      return `${today.length} visit${today.length!==1?'s':''} currently scheduled or in progress:\n\n${today.map(v=>`• ${v.clientName} — ${v.service} in ${v.city}\n  Nurse: ${v.nurseName||'Unassigned'} · ${new Date(v.scheduledAt).toLocaleDateString()}`).join('\n\n')}`;
    }
    if (query.includes('city') && query.includes('most')) {
      const cityCounts = {};
      visits.forEach(v=>{ cityCounts[v.city]=(cityCounts[v.city]||0)+1; });
      const sorted = Object.entries(cityCounts).sort((a,b)=>b[1]-a[1]);
      return `Visit breakdown by city:\n\n${sorted.map(([city,count])=>`• ${city}: ${count} visit${count!==1?'s':''}`).join('\n')}\n\nTirana leads with ${sorted[0][1]} visits.`;
    }
    if (query.includes('revenue') || query.includes('payment') || query.includes('money')) {
      const failed = payments.filter(p=>p.status==='failed');
      return `Revenue summary:\n\n• Total collected: €${revenue}\n• Successful payments: ${payments.filter(p=>p.status==='paid').length}\n• Failed payments: ${failed.length}${failed.length>0?'\n\nFailed payments:\n'+failed.map(p=>`• ${p.clientName} — €${p.amount} (${p.date})`).join('\n'):''}`;
    }
    if (query.includes('no show') || query.includes('no-show') || query.includes('missed')) {
      if (noShow.length===0) return 'No no-shows recorded. All completed visits went ahead as planned.';
      return `${noShow.length} no-show${noShow.length!==1?'s':''} recorded:\n\n${noShow.map(v=>`• ${v.clientName} — ${v.service} in ${v.city} on ${new Date(v.scheduledAt).toLocaleDateString()}\n  Nurse: ${v.nurseName}${v.nurseNotes?'\n  Note: '+v.nurseNotes:''}`).join('\n\n')}`;
    }
    if (query.includes('client') && (query.includes('total') || query.includes('how many'))) {
      const byCountry = {};
      clients.forEach(c=>{ byCountry[c.country]=(byCountry[c.country]||0)+1; });
      return `${clients.length} total clients:\n\n• Active: ${clients.filter(c=>c.status==='ACTIVE').length}\n• Trial: ${clients.filter(c=>c.status==='TRIAL').length}\n\nBy country:\n${Object.entries(byCountry).map(([country,count])=>`• ${country}: ${count}`).join('\n')}`;
    }
    if (query.includes('summary') || query.includes('overview') || query.includes('status')) {
      return `Platform summary:\n\n• Clients: ${clients.length} (${clients.filter(c=>c.status==='ACTIVE').length} active, ${clients.filter(c=>c.status==='TRIAL').length} trial)\n• Nurses: ${nurses.length} (${approved.length} approved, ${pending.length} pending)\n• Visits: ${visits.length} total (${completed.length} completed, ${unassigned.length} unassigned)\n• Revenue: €${revenue}\n• Alerts: ${unassigned.length} unassigned visit${unassigned.length!==1?'s':''}, ${pending.length} pending nurse${pending.length!==1?'s':''}`;
    }
    if (query.includes('rating') || query.includes('best nurse') || query.includes('top nurse')) {
      const sorted = [...approved].sort((a,b)=>b.rating-a.rating);
      return `Nurses ranked by rating:\n\n${sorted.map((n,i)=>`${i+1}. ${n.name} (${n.city}) — ${n.rating} rating · ${n.totalVisits} visits`).join('\n')}`;
    }

    return `I can answer questions about:\n\n• Unassigned visits — "How many unassigned visits?"\n• Nurse availability — "Which nurses are in Tirana?"\n• Client plans — "Show premium clients"\n• Alerts — "Any pending nurse applications?"\n• Revenue — "What's our total revenue?"\n• City breakdown — "Which city has the most visits?"\n• Platform summary — "Give me an overview"\n\nTry one of the quick questions above or rephrase your question!`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    const reply = analyze(userMsg);
    setMessages(prev=>[...prev, { role:'user', content:userMsg }, { role:'assistant', content:reply }]);
  };

  const QUICK = [
    'How many unassigned visits do we have?',
    'Which nurses are available in Tirana?',
    'Show me clients on the premium plan',
    'Are there any nurse applications pending?',
    'Which city has the most visits?',
    'Give me a platform summary',
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', maxWidth:760 }}>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'16px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:C.primary }}>{tr('admin.aiTitle')}</div>
          <div style={{ fontSize:12, color:'#3B82F6', marginTop:2 }}>{tr('admin.aiSubtitle')}</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {QUICK.map(q => (
          <button key={q} onClick={()=>setInput(q)} style={{ fontSize:12, fontWeight:500, padding:'6px 12px', borderRadius:99, border:`1px solid ${C.border}`, background:C.bgWhite, color:C.textSecondary, cursor:'pointer', whiteSpace:'nowrap' }}>
            {q}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:'auto', background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:16, display:'flex', flexDirection:'column', gap:14 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection:m.role==='user'?'row-reverse':'row' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:m.role==='user'?'#1E3A5F':C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:m.role==='user'?'#93C5FD':C.primary, flexShrink:0 }}>
              {m.role==='user'?'A':'AI'}
            </div>
            <div style={{ maxWidth:'78%', background:m.role==='user'?C.primary:C.bg, borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px', padding:'12px 16px', fontSize:14, color:m.role==='user'?'#fff':C.textPrimary, lineHeight:1.7, whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder={tr('admin.aiPlaceholder')} style={{ flex:1, padding:'12px 16px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit' }} />
        <button onClick={sendMessage} disabled={!input.trim()} style={{ padding:'12px 20px', borderRadius:10, border:'none', background:C.primary, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', opacity:!input.trim()?0.5:1 }}>{tr('admin.aiSend')}</button>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function AdminSectionCard({ title, subtitle, children, lang='en' }) {
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

function AdminSettings({ lang='en' }) {
  const tr = (key) => t(lang, key);
  const DEFAULT = { payPerVisit:20, trialDays:7, basicPrice:30, standardPrice:50, premiumPrice:120 };
  const [settings, setSettings] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'saved' | 'error'
  const inp2 = { ...inp, width:'100%', boxSizing:'border-box' };

  // Load settings from backend on mount
  useEffect(() => {
    api.getSettings()
      .then(data => {
        if (data?.settings) setSettings({ ...DEFAULT, ...data.settings });
      })
      .catch(() => {}) // keep defaults on error
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.updateSettings(settings);
      setStatus('saved');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth:560 }}>
      <AdminSectionCard title={tr('admin.platformSettings')} subtitle={tr('admin.coreParams')} lang={lang}>
        {loading ? (
          <div style={{ padding:'20px 0', textAlign:'center', color:C.textTertiary, fontSize:13 }}>{tr('admin.loadingSettings')}</div>
        ) : (
          <>
            {[[tr('admin.nursePayLabel'),'payPerVisit'],[tr('admin.trialDaysLabel'),'trialDays'],[tr('admin.basicPriceLabel'),'basicPrice'],[tr('admin.standardPriceLabel'),'standardPrice'],[tr('admin.premiumPriceLabel'),'premiumPrice']].map(([label,key]) => (
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.borderSubtle}` }}>
                <label style={{ fontSize:14, color:C.textPrimary }}>{label}</label>
                <input type="number" value={settings[key]} onChange={e=>setSettings({...settings,[key]:Number(e.target.value)})} style={{ ...inp, width:90, textAlign:'center' }} />
              </div>
            ))}
            <div style={{ marginTop:20, display:'flex', alignItems:'center', gap:14 }}>
              <button onClick={handleSave} disabled={saving} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:saving?'not-allowed':'pointer', opacity:saving?0.7:1 }}>
                {saving ? tr('dashboard.saving') : tr('admin.saveSettings')}
              </button>
              {status==='saved' && <span style={{ fontSize:13, color:C.secondary, fontWeight:600 }}>{tr('admin.settingsSaved')}</span>}
              {status==='error' && <span style={{ fontSize:13, color:C.error, fontWeight:600 }}>{tr('admin.settingsFailed')}</span>}
            </div>
          </>
        )}
      </AdminSectionCard>

      <AdminSectionCard title={tr('admin.adminProfile')} subtitle={tr('admin.accountDetails')} lang={lang}>
        {[[tr('settings.fullName'),'Vonaxity Admin'],[tr('login.email'),'admin@vonaxity.com'],['Role','Super Admin']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:14 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </AdminSectionCard>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPage({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const tr = (key) => t(lang, key);
  const switchLang = (l) => { document.cookie=`vonaxity-locale=${l};path=/;max-age=31536000`; const path = window.location.pathname.replace(/^\/(en|sq)/,`/${l}`); window.location.href = path; };
  const [active, setActive] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [nurses, setNurses] = useState([]);
  const [visits, setVisits] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [nursesData, usersData, visitsData, paymentsData] = await Promise.all([
        api.getNurses().catch(()=>({ nurses:[] })),
        api.getUsers().catch(()=>({ users:[] })),
        api.getVisits().catch(()=>({ visits:[] })),
        api.getPayments().catch(()=>({ payments:[] })),
      ]);
      setNurses((nursesData?.nurses || []).map(n => ({
        ...n,
        name: n.name || n.user?.name || 'Unknown',
        email: n.email || n.user?.email || '',
        phone: n.phone || n.user?.phone || '',
        city: n.city || '',
        status: n.status || 'INCOMPLETE',
        joinedAt: n.joinedAt || (n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'N/A'),
        rating: n.rating || 0,
        totalVisits: n.totalVisits || 0,
        licenseNumber: n.licenseNumber || '',
      })));
      setClients((usersData?.users || []).map(c => ({
        ...c,
        name: c.name || 'Unknown',
        email: c.email || '',
        phone: c.phone || '',
        country: c.country || '',
        status: c.status || 'ACTIVE',
        joinedAt: c.joinedAt || (c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'),
        plan: c.subscription?.plan || c.plan || 'N/A',
        visitsUsed: c.subscription?.visitsUsed || 0,
        visitsTotal: c.subscription?.visitsPerMonth || 0,
      })));
      const rawVisits = visitsData?.visits || [];
      setVisits(rawVisits.map(v=>({ ...v, clientName:v.clientName||v.relative?.name||'Unknown', service:v.service||v.serviceType||'Unknown', nurseName:v.nurseName||v.nurse?.user?.name||null, nurseId:v.nurseId||v.nurse?.id||null })));
      setPayments(paymentsData?.payments || []);
    } catch (err) { console.error('Admin load error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (nurseId) => {
    try { await api.approveNurse(nurseId); setNurses(prev=>prev.map(n=>n.id===nurseId?{...n,status:'APPROVED'}:n)); }
    catch (err) { setActionError(err.message || 'Action failed. Please try again.'); }
  };
  const handleSuspend = async (nurseId) => {
    try { await api.suspendNurse(nurseId); setNurses(prev=>prev.map(n=>n.id===nurseId?{...n,status:'SUSPENDED'}:n)); }
    catch (err) { setActionError(err.message || 'Action failed. Please try again.'); }
  };
  const handleReject = async (nurseId, reason) => {
    try { await api.rejectNurse(nurseId, { reason }); setNurses(prev=>prev.map(n=>n.id===nurseId?{...n,status:'REJECTED',rejectionReason:reason}:n)); }
    catch (err) { setActionError(err.message || 'Action failed. Please try again.'); }
  };
  const handleAssign = async (visitId, nurseId) => {
    try { await api.updateVisit(visitId,{nurseId,status:'PENDING'}); await loadData(); }
    catch (err) { setActionError(err.message || 'Action failed. Please try again.'); }
  };
  const logout = () => {
    localStorage.removeItem('vonaxity-token');
    document.cookie='vonaxity-token=;path=/;max-age=0';
    document.cookie='vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const alertCount = visits.filter(v=>v.status==='UNASSIGNED').length + nurses.filter(n=>n.status==='PENDING').length;
  // Auto-clear action errors
  if (actionError) setTimeout(() => setActionError(''), 4000);
  const _AL = ADMIN_LABELS[lang] || ADMIN_LABELS.en;
  const TITLES = { overview:_AL.overview, clients:_AL.clients, nurses:_AL.nurses, visits:_AL.visits, alerts:_AL.alerts, payments:_AL.payments, ai:_AL.ai, settings:_AL.settings };
  const ADMIN_NAV_BOTTOM = NAV.slice(0,4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}body{margin:0;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @media(max-width:768px){
          .admin-cont{padding:16px 16px 140px!important;}
          .admin-ham{display:flex!important;}
          .admin-tabs{display:flex!important;}
        }
      `}</style>
      <div style={{ display:'flex', minHeight:'100vh', fontFamily:F, background:'#F8FAFC' }}>
        <AdminSidebar active={active} setActive={setActive} onLogout={logout} alertCount={alertCount} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} />
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ padding:'0 24px', height:58, borderBottom:'1px solid #E2E8F0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FFFFFF', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={()=>setSidebarOpen(true)} className="admin-ham" style={{ display:'none', flexDirection:'column', gap:4, background:'transparent', border:'none', cursor:'pointer', padding:'6px' }}>
                <span style={{ display:'block',width:20,height:2,background:'#0F172A',borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:'#0F172A',borderRadius:2 }}/>
                <span style={{ display:'block',width:20,height:2,background:'#0F172A',borderRadius:2 }}/>
              </button>
              <div style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{TITLES[active]}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {actionError && (
                <div style={{ fontSize:12, fontWeight:600, padding:'6px 12px', background:'#FEF2F2', color:'#DC2626', borderRadius:8, border:'1px solid #FECACA' }}>{actionError}</div>
              )}
              {alertCount>0 && <button onClick={()=>setActive('alerts')} style={{ fontSize:12,fontWeight:700,padding:'5px 12px',background:'#FEF2F2',color:'#DC2626',border:'none',borderRadius:8,cursor:'pointer',fontFamily:F }}>{alertCount} {tr('admin.alerts')}</button>}
              <button onClick={loadData} style={{ fontSize:12,fontWeight:600,padding:'5px 12px',background:'#F1F5F9',color:'#475569',border:'1px solid #E2E8F0',borderRadius:8,cursor:'pointer',fontFamily:F }}>↻ {tr('admin.refresh')}</button>
              <button onClick={()=>setActive('ai')} style={{ fontSize:12,fontWeight:700,padding:'5px 12px',background:'#F5F3FF',color:'#7C3AED',border:'1px solid rgba(124,58,237,0.2)',borderRadius:8,cursor:'pointer',fontFamily:F }}>{tr('admin.ai')}</button>
              <div style={{ display:'flex', background:'#F1F5F9', borderRadius:8, padding:3, border:'1px solid #E2E8F0' }}>
                {['en','sq'].map(l=>(
                  <button key={l} onClick={()=>switchLang(l)} style={{ padding:'4px 10px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background:lang===l?'#2563EB':'transparent', color:lang===l?'#fff':'#475569', fontFamily:F }}>{l.toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
          <main className="admin-cont" style={{ flex:1, padding:24, overflowY:'auto' }}>
            {loading ? (
              <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:200 }}>
                <div style={{ width:32,height:32,borderRadius:'50%',border:'3px solid #EFF6FF',borderTopColor:'#2563EB',animation:'spin 0.8s linear infinite' }}/>
              </div>
            ) : (
              <>
                {active==='overview' && <Overview setActive={setActive} nurses={nurses} clients={clients} visits={visits} payments={payments} lang={lang} />}
                {active==='clients' && <Clients clients={clients} visits={visits} lang={lang} />}
                {active==='nurses' && <Nurses nurses={nurses} setNurses={setNurses} onApprove={handleApprove} onSuspend={handleSuspend} onReject={handleReject} lang={lang} />}
                {active==='visits' && <Visits visits={visits} setVisits={setVisits} nurses={nurses} onAssign={handleAssign} lang={lang} />}
                {active==='alerts' && <Alerts visits={visits} nurses={nurses} setVisits={setVisits} setNurses={setNurses} onApprove={handleApprove} onSuspend={handleSuspend} onReject={handleReject} onAssign={handleAssign} lang={lang} />}
                {active==='payments' && <Payments payments={payments} lang={lang} />}
                {active==='analytics' && <Analytics clients={clients} nurses={nurses} visits={visits} payments={payments} lang={lang} />}
                {active==='ai' && <AIAssistant clients={clients} nurses={nurses} visits={visits} payments={payments} lang={lang} />}
                {active==='settings' && <AdminSettings lang={lang} />}
              </>
            )}
          </main>
        </div>
        <div className="admin-tabs" style={{ display:'none', position:'fixed', bottom:0, left:0, right:0, background:'#0F172A', borderTop:'1px solid rgba(255,255,255,0.08)', zIndex:48, padding:'8px 0 env(safe-area-inset-bottom,8px)' }}>
          <button onClick={()=>setSidebarOpen(true)} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,border:'none',background:'transparent',color:'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:10,fontWeight:500,fontFamily:F,padding:'4px 2px' }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            {tr('admin.menu')}
          </button>
          {ADMIN_NAV_BOTTOM.map(item=>(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,border:'none',background:'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:10,fontWeight:active===item.id?700:500,fontFamily:F,padding:'4px 2px',position:'relative' }}>
              {item.icon}
              {item.id==='alerts'&&alertCount>0&&<span style={{ position:'absolute',top:2,right:'50%',marginRight:-14,width:14,height:14,background:'#DC2626',color:'#fff',borderRadius:99,fontSize:8,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center' }}>{alertCount}</span>}
              <span>{(ADMIN_LABELS[lang]||ADMIN_LABELS.en)[item.id]||item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}