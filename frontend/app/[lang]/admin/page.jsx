'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

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

const statusBadge = (status) => {
  const map = {
    ACTIVE:'success', APPROVED:'success', COMPLETED:'success', paid:'success',
    TRIAL:'warning', PENDING:'warning', pending:'warning',
    SUSPENDED:'error', UNASSIGNED:'error', NO_SHOW:'error', CANCELLED:'error', failed:'error',
    IN_PROGRESS:'primary', ON_THE_WAY:'primary',
  };
  return <Badge label={status} type={map[status]||'default'} />;
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
  { id:'alerts', label:'Alerts', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>, badge: MOCK_VISITS.filter(v=>v.status==='UNASSIGNED').length },
  { id:'payments', label:'Payments', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'ai', label:'AI Assistant', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>, highlight:true },
  { id:'settings', label:'Settings', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  const alertCount = MOCK_VISITS.filter(v=>v.status==='UNASSIGNED').length;
  return (
    <div style={{ width:collapsed?58:220, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'2px', marginTop:1 }}>ADMIN CRM</div>
          </div>
        )}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>{collapsed?'›':'‹'}</button>
      </div>
      <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'10px 12px', borderRadius:9, border:'none', background:active===item.id?(item.highlight?'rgba(124,58,237,0.25)':'rgba(37,99,235,0.2)'):'transparent', color:active===item.id?(item.highlight?'#C4B5FD':'#93C5FD'):'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start', position:'relative' }}>
            {item.icon}
            {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
            {!collapsed && item.badge > 0 && <span style={{ fontSize:10, fontWeight:700, background:C.error, color:'#fff', borderRadius:99, padding:'2px 6px', minWidth:18, textAlign:'center' }}>{item.badge}</span>}
            {collapsed && item.badge > 0 && <span style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:C.error }} />}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>admin@vonaxity.com</div>
          <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────
function Overview({ setActive }) {
  const unassigned = MOCK_VISITS.filter(v=>v.status==='UNASSIGNED');
  const pending = MOCK_NURSES.filter(n=>n.status==='PENDING');
  const todayVisits = MOCK_VISITS.filter(v=>['PENDING','IN_PROGRESS','ON_THE_WAY'].includes(v.status));
  const revenue = MOCK_PAYMENTS.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);

  return (
    <div>
      {/* Metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
        {[
          ['Total clients', MOCK_CLIENTS.length, C.primary, 'clients'],
          ['Active nurses', MOCK_NURSES.filter(n=>n.status==='APPROVED').length, C.secondary, 'nurses'],
          ['Visits today', todayVisits.length, C.purple, 'visits'],
          ['Unassigned', unassigned.length, unassigned.length>0?C.error:C.textTertiary, 'alerts'],
          ['Revenue', `€${revenue}`, C.secondary, 'payments'],
          ['Pending nurses', pending.length, pending.length>0?C.warning:C.textTertiary, 'nurses'],
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
              <div style={{ fontSize:14, fontWeight:600, color:C.error }}>{unassigned.length} visit{unassigned.length>1?'s':''} need a nurse assigned</div>
              <button onClick={()=>setActive('alerts')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.error, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Fix now</button>
            </div>
          )}
          {pending.length > 0 && (
            <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.warning }}>{pending.length} nurse application{pending.length>1?'s':''} awaiting review</div>
              <button onClick={()=>setActive('nurses')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.warning, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Review</button>
            </div>
          )}
        </div>
      )}

      {/* Recent visits */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Recent visits</div>
          {MOCK_VISITS.slice(0,4).map((v,i) => (
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
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Recent payments</div>
          {MOCK_PAYMENTS.slice(0,4).map((p,i) => (
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
function Clients() {
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => MOCK_CLIENTS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan==='all' || c.plan===filterPlan;
    const matchStatus = filterStatus==='all' || c.status===filterStatus;
    return matchSearch && matchPlan && matchStatus;
  }), [search, filterPlan, filterStatus]);

  if (selected) return <ClientDetail client={selected} onBack={()=>setSelected(null)} />;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder="Search clients..." /></div>
        <select style={{...inp}} value={filterPlan} onChange={e=>setFilterPlan(e.target.value)}>
          <option value="all">All plans</option>
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} clients</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {['Client','Country','Plan','Status','Visits used','Joined',''].map(h => (
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
                <td style={{ padding:'12px 16px' }}><Badge label={c.plan.charAt(0).toUpperCase()+c.plan.slice(1)} type='primary' small /></td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(c.status)}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{c.visitsUsed}/{c.visitsTotal}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary }}>{c.joinedAt}</td>
                <td style={{ padding:'12px 16px' }}><span style={{ color:C.primary, fontWeight:600, fontSize:12 }}>View →</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No clients found.</div>}
      </div>
    </div>
  );
}

function ClientDetail({ client, onBack }) {
  const clientVisits = MOCK_VISITS.filter(v=>v.clientId===client.id);
  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        All clients
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px' }}>{client.name}</div>
              <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{client.email}</div>
            </div>
            {statusBadge(client.status)}
          </div>
          {[['Phone',client.phone],['Country',client.country],['Plan',client.plan.charAt(0).toUpperCase()+client.plan.slice(1)],['Joined',client.joinedAt],['Visits used',`${client.visitsUsed}/${client.visitsTotal}`]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Loved one</div>
          {[['Name',client.relative.name],['City',client.relative.city],['Address',client.relative.address],['Phone',client.relative.phone],['Age',client.relative.age]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginTop:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Visit history ({clientVisits.length})</div>
        {clientVisits.length===0 ? <div style={{ fontSize:13, color:C.textTertiary }}>No visits yet.</div> : clientVisits.map((v,i) => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<clientVisits.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.service}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{new Date(v.scheduledAt).toLocaleDateString()} · {v.nurseName||'No nurse'}</div>
            </div>
            {statusBadge(v.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Nurses ────────────────────────────────────────────────────────────────────
function Nurses({ nurses, setNurses }) {
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => nurses.filter(n => {
    const matchSearch = !search || n.name.toLowerCase().includes(search.toLowerCase()) || n.email.toLowerCase().includes(search.toLowerCase());
    const matchCity = filterCity==='all' || n.city===filterCity;
    const matchStatus = filterStatus==='all' || n.status===filterStatus;
    return matchSearch && matchCity && matchStatus;
  }), [search, filterCity, filterStatus, nurses]);

  const handleApprove = (id) => setNurses(prev=>prev.map(n=>n.id===id?{...n,status:'APPROVED'}:n));
  const handleSuspend = (id) => setNurses(prev=>prev.map(n=>n.id===id?{...n,status:'SUSPENDED'}:n));

  if (selected) return <NurseDetail nurse={nurses.find(n=>n.id===selected)} onBack={()=>setSelected(null)} onApprove={handleApprove} onSuspend={handleSuspend} />;

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder="Search nurses..." /></div>
        <select style={{...inp}} value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
          <option value="all">All cities</option>
          {['Tirana','Durrës','Elbasan','Fier','Shkodër','Sarandë'].map(c=><option key={c}>{c}</option>)}
        </select>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} nurses</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {['Nurse','City','Status','Rating','Visits','License','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((n,i) => (
              <tr key={n.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
                <td style={{ padding:'12px 16px', cursor:'pointer' }} onClick={()=>setSelected(n.id)}>
                  <div style={{ fontWeight:600, color:C.textPrimary }}>{n.name}</div>
                  <div style={{ fontSize:11, color:C.textTertiary, marginTop:1 }}>{n.email}</div>
                </td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{n.city}</td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(n.status)}</td>
                <td style={{ padding:'12px 16px', color:n.rating>0?C.warning:C.textTertiary, fontWeight:600 }}>{n.rating>0?`${n.rating}`:'N/A'}</td>
                <td style={{ padding:'12px 16px', color:C.textSecondary }}>{n.totalVisits}</td>
                <td style={{ padding:'12px 16px', color:C.textTertiary, fontSize:12 }}>{n.licenseNumber}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {n.status==='PENDING' && <>
                      <button onClick={()=>handleApprove(n.id)} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:6, cursor:'pointer' }}>Approve</button>
                      <button onClick={()=>handleSuspend(n.id)} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.errorLight, color:C.error, border:'none', borderRadius:6, cursor:'pointer' }}>Reject</button>
                    </>}
                    {n.status==='APPROVED' && <button onClick={()=>handleSuspend(n.id)} style={{ fontSize:11, padding:'5px 10px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:6, cursor:'pointer' }}>Suspend</button>}
                    {n.status==='SUSPENDED' && <button onClick={()=>handleApprove(n.id)} style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:6, cursor:'pointer' }}>Reinstate</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No nurses found.</div>}
      </div>
    </div>
  );
}

function NurseDetail({ nurse, onBack, onApprove, onSuspend }) {
  if (!nurse) return null;
  const nurseVisits = MOCK_VISITS.filter(v=>v.nurseId===nurse.id);
  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        All nurses
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
            <div>
              <div style={{ fontSize:20, fontWeight:700, color:C.textPrimary }}>{nurse.name}</div>
              <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{nurse.email}</div>
            </div>
            {statusBadge(nurse.status)}
          </div>
          {[['Phone',nurse.phone],['City',nurse.city],['License',nurse.licenseNumber],['Rating',nurse.rating>0?nurse.rating:'Not yet rated'],['Total visits',nurse.totalVisits],['Total earnings',`€${nurse.totalEarnings}`],['Joined',nurse.joinedAt]].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
              <span style={{ color:C.textTertiary }}>{k}</span>
              <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16, display:'flex', gap:8 }}>
            {nurse.status==='PENDING' && <>
              <button onClick={()=>onApprove(nurse.id)} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.secondary, color:'#fff', border:'none', borderRadius:9, cursor:'pointer' }}>Approve nurse</button>
              <button onClick={()=>onSuspend(nurse.id)} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.errorLight, color:C.error, border:'none', borderRadius:9, cursor:'pointer' }}>Reject</button>
            </>}
            {nurse.status==='APPROVED' && <button onClick={()=>onSuspend(nurse.id)} style={{ fontSize:13, padding:'9px 18px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:9, cursor:'pointer' }}>Suspend account</button>}
            {nurse.status==='SUSPENDED' && <button onClick={()=>onApprove(nurse.id)} style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:9, cursor:'pointer' }}>Reinstate</button>}
          </div>
        </div>
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>Availability</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => {
              const full = {Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
              const active = nurse.availability.includes(full[d]);
              return <span key={d} style={{ fontSize:12, fontWeight:600, padding:'5px 10px', borderRadius:8, background:active?C.primaryLight:C.bgSubtle, color:active?C.primary:C.textTertiary, border:`1px solid ${active?'rgba(37,99,235,0.2)':C.border}` }}>{d}</span>;
            })}
          </div>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>Bio</div>
          <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{nurse.bio}</div>
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Visit history ({nurseVisits.length})</div>
        {nurseVisits.length===0 ? <div style={{ fontSize:13, color:C.textTertiary }}>No visits yet.</div> : nurseVisits.map((v,i) => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<nurseVisits.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.clientName}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
              {v.nurseNotes && <div style={{ fontSize:11, color:C.textTertiary, marginTop:2, fontStyle:'italic' }}>{v.nurseNotes}</div>}
            </div>
            {statusBadge(v.status)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Visits ────────────────────────────────────────────────────────────────────
function Visits({ visits, setVisits, nurses }) {
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

  const handleAssign = (visitId, nurse) => {
    setVisits(prev=>prev.map(v=>v.id===visitId?{...v,nurseId:nurse.id,nurseName:nurse.name,status:'PENDING'}:v));
    setAssigning(null);
  };

  if (selected) {
    const v = visits.find(vv=>vv.id===selected);
    return (
      <div>
        <button onClick={()=>setSelected(null)} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          All visits
        </button>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:18, fontWeight:700, color:C.textPrimary }}>{v.clientName}</div>
                <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{v.service}</div>
              </div>
              {statusBadge(v.status)}
            </div>
            {[['City',v.city],['Scheduled',new Date(v.scheduledAt).toLocaleString()],['Nurse',v.nurseName||'Unassigned'],['Notes',v.notes||'None'],['BP',v.bp||'N/A'],['Glucose',v.glucose?`${v.glucose} mmol/L`:'N/A']].map(([k,val]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:13 }}>
                <span style={{ color:C.textTertiary }}>{k}</span>
                <span style={{ color:C.textPrimary, fontWeight:500 }}>{val}</span>
              </div>
            ))}
            {v.nurseNotes && <div style={{ marginTop:16, background:C.bg, borderRadius:10, padding:'12px 14px', fontSize:13, color:C.textSecondary }}><strong>Nurse notes:</strong> {v.nurseNotes}</div>}
          </div>
          {v.status!=='COMPLETED' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Assign nurse</div>
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.city).map(n => (
                <button key={n.id} onClick={()=>handleAssign(v.id,n)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'12px 16px', background:v.nurseId===n.id?C.primaryLight:C.bg, border:`1px solid ${v.nurseId===n.id?C.primary:C.border}`, borderRadius:10, cursor:'pointer', marginBottom:8, textAlign:'left' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.name}</div>
                    <div style={{ fontSize:12, color:C.textTertiary }}>Rating {n.rating} · {n.totalVisits} visits</div>
                  </div>
                  {v.nurseId===n.id ? <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>Assigned</span> : <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>Assign →</span>}
                </button>
              ))}
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.city).length===0 && <div style={{ fontSize:13, color:C.error }}>No approved nurses in {v.city}.</div>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ flex:'1 1 220px' }}><SearchInput value={search} onChange={setSearch} placeholder="Search visits..." /></div>
        <select style={{...inp}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {['UNASSIGNED','PENDING','IN_PROGRESS','COMPLETED','NO_SHOW','CANCELLED'].map(s=><option key={s}>{s}</option>)}
        </select>
        <select style={{...inp}} value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
          <option value="all">All cities</option>
          {['Tirana','Durrës','Elbasan','Fier','Shkodër'].map(c=><option key={c}>{c}</option>)}
        </select>
        <span style={{ fontSize:12, color:C.textTertiary }}>{filtered.length} visits</span>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {['Patient','Service','City','Date','Nurse','Status',''].map(h => (
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
                <td style={{ padding:'12px 16px', color:v.nurseName?C.textPrimary:C.error, fontWeight:v.nurseName?400:600 }}>{v.nurseName||'Unassigned'}</td>
                <td style={{ padding:'12px 16px' }}>{statusBadge(v.status)}</td>
                <td style={{ padding:'12px 16px' }}><button onClick={()=>setSelected(v.id)} style={{ fontSize:12, fontWeight:600, color:C.primary, background:'transparent', border:'none', cursor:'pointer' }}>View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No visits found.</div>}
      </div>
    </div>
  );
}

// ── Alerts ────────────────────────────────────────────────────────────────────
function Alerts({ visits, nurses, setVisits, setNurses }) {
  const unassigned = visits.filter(v=>v.status==='UNASSIGNED');
  const noShow = visits.filter(v=>v.status==='NO_SHOW');
  const pendingNurses = nurses.filter(n=>n.status==='PENDING');
  const incompleteReports = visits.filter(v=>v.status==='COMPLETED'&&!v.nurseNotes);

  const AlertGroup = ({ title, count, color, children }) => (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, marginBottom:16, overflow:'hidden' }}>
      <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', background:count>0?`rgba(${color==='red'?'220,38,38':color==='yellow'?'217,119,6':'37,99,235'},0.04)`:'transparent' }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{title}</div>
        <Badge label={`${count} issue${count!==1?'s':''}`} type={count>0?(color==='red'?'error':color==='yellow'?'warning':'primary'):'default'} />
      </div>
      <div style={{ padding:'4px 0' }}>{children}</div>
    </div>
  );

  const handleAssignAlert = (visitId, nurseId) => {
    const nurse = nurses.find(n=>n.id===nurseId);
    setVisits(prev=>prev.map(v=>v.id===visitId?{...v,nurseId,nurseName:nurse?.name,status:'PENDING'}:v));
  };

  return (
    <div>
      <AlertGroup title="Unassigned visits" count={unassigned.length} color="red">
        {unassigned.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>All visits are assigned.</div> : unassigned.map(v => (
          <div key={v.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.city).slice(0,2).map(n => (
                <button key={n.id} onClick={()=>handleAssignAlert(v.id,n.id)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.primaryLight, color:C.primary, border:`1px solid rgba(37,99,235,0.2)`, borderRadius:8, cursor:'pointer' }}>
                  Assign {n.name.split(' ')[0]}
                </button>
              ))}
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.city).length===0 && <span style={{ fontSize:12, color:C.error }}>No nurses in {v.city}</span>}
            </div>
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title="Pending nurse applications" count={pendingNurses.length} color="yellow">
        {pendingNurses.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>No pending applications.</div> : pendingNurses.map(n => (
          <div key={n.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.name}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{n.city} · Applied {n.joinedAt} · {n.licenseNumber}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setNurses(prev=>prev.map(nn=>nn.id===n.id?{...nn,status:'APPROVED'}:nn))} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>Approve</button>
              <button onClick={()=>setNurses(prev=>prev.map(nn=>nn.id===n.id?{...nn,status:'SUSPENDED'}:nn))} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.errorLight, color:C.error, border:'none', borderRadius:8, cursor:'pointer' }}>Reject</button>
            </div>
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title="No-show visits" count={noShow.length} color="red">
        {noShow.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>No no-shows.</div> : noShow.map(v => (
          <div key={v.id} style={{ padding:'14px 20px', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
            {v.nurseNotes && <div style={{ fontSize:12, color:C.textSecondary, marginTop:4, fontStyle:'italic' }}>"{v.nurseNotes}"</div>}
          </div>
        ))}
      </AlertGroup>

      <AlertGroup title="Missing nurse reports" count={incompleteReports.length} color="blue">
        {incompleteReports.length===0 ? <div style={{ padding:'16px 20px', fontSize:13, color:C.textTertiary }}>All completed visits have reports.</div> : incompleteReports.map(v => (
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
function Payments() {
  const total = MOCK_PAYMENTS.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
  const failed = MOCK_PAYMENTS.filter(p=>p.status==='failed');
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        {[['Total revenue',`€${total}`,C.secondary],['Successful',payments.filter(p=>p.status==='paid').length,C.secondary],['Failed',failed.length,failed.length>0?C.error:C.textTertiary]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:24, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {failed.length>0 && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.error, marginBottom:4 }}>{failed.length} failed payment{failed.length>1?'s':''}</div>
          {failed.map(p => <div key={p.id} style={{ fontSize:12, color:C.error }}>{p.clientName} · {p.plan} · €{p.amount} · {p.date}</div>)}
        </div>
      )}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>All transactions</div>
          <button style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer' }}>Export CSV</button>
        </div>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:C.bgSubtle }}>
              {['Client','Plan','Amount','Date','Status',''].map(h => (
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
                <td style={{ padding:'12px 16px' }}>{statusBadge(p.status)}</td>
                <td style={{ padding:'12px 16px' }}>
                  {p.status==='failed' && <button style={{ fontSize:11, fontWeight:600, padding:'5px 10px', background:C.warningLight, color:C.warning, border:'none', borderRadius:6, cursor:'pointer' }}>Retry</button>}
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
function AIAssistant({ clients, nurses, visits }) {
  const [messages, setMessages] = useState([
    { role:'assistant', content:"Hi! I'm the Vonaxity AI assistant. I can help you analyze your platform data, answer questions about clients and nurses, and help you manage day-to-day operations. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const CONTEXT = `
You are the internal AI assistant for Vonaxity, a home nurse visit platform in Albania.
You have access to the following platform data:

CLIENTS (${clients.length} total):
${clients.map(c=>`- ${c.name} (${c.country}, ${c.plan} plan, ${c.status}), relative: ${c.relative.name} in ${c.relative.city}`).join('\n')}

NURSES (${nurses.length} total):
${nurses.map(n=>`- ${n.name} (${n.city}, ${n.status}, rating: ${n.rating}, ${n.totalVisits} visits)`).join('\n')}

VISITS (${visits.length} total):
${visits.map(v=>`- ${v.clientName} → ${v.service} in ${v.city} on ${new Date(v.scheduledAt).toLocaleDateString()}, nurse: ${v.nurseName||'UNASSIGNED'}, status: ${v.status}`).join('\n')}

ALERTS:
- Unassigned visits: ${visits.filter(v=>v.status==='UNASSIGNED').length}
- Pending nurse approvals: ${nurses.filter(n=>n.status==='PENDING').length}
- No-shows: ${visits.filter(v=>v.status==='NO_SHOW').length}

Answer questions about this data. Be concise, helpful, and operational. Format numbers clearly.
If asked to take actions, explain what action should be taken and who to contact.
  `.trim();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev=>[...prev,{ role:'user', content:userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system: CONTEXT,
          messages:[
            ...messages.filter(m=>m.role!=='assistant'||messages.indexOf(m)>0).map(m=>({ role:m.role, content:m.content })),
            { role:'user', content:userMsg }
          ],
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not generate a response.';
      setMessages(prev=>[...prev,{ role:'assistant', content:reply }]);
    } catch (err) {
      setMessages(prev=>[...prev,{ role:'assistant', content:'Connection error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const QUICK = [
    'How many unassigned visits do we have?',
    'Which nurses are available in Tirana?',
    'Show me clients on the premium plan',
    'What visits are scheduled for today?',
    'Are there any nurse applications pending?',
    'Which city has the most visits?',
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', maxWidth:760 }}>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'16px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:C.primary }}>Vonaxity AI Assistant</div>
          <div style={{ fontSize:12, color:'#3B82F6', marginTop:2 }}>Powered by Claude · Has access to all platform data</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
        {QUICK.map(q => (
          <button key={q} onClick={()=>{ setInput(q); }} style={{ fontSize:12, fontWeight:500, padding:'6px 12px', borderRadius:99, border:`1px solid ${C.border}`, background:C.bgWhite, color:C.textSecondary, cursor:'pointer', whiteSpace:'nowrap' }}>
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:16, display:'flex', flexDirection:'column', gap:14 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection:m.role==='user'?'row-reverse':'row' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:m.role==='user'?'#1E3A5F':C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:m.role==='user'?'#93C5FD':C.primary, flexShrink:0 }}>
              {m.role==='user'?'A':'AI'}
            </div>
            <div style={{ maxWidth:'75%', background:m.role==='user'?C.primary:C.bg, borderRadius:m.role==='user'?'14px 14px 4px 14px':'14px 14px 14px 4px', padding:'12px 16px', fontSize:14, color:m.role==='user'?'#fff':C.textPrimary, lineHeight:1.65, whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:C.primary }}>AI</div>
            <div style={{ background:C.bg, borderRadius:'14px 14px 14px 4px', padding:'12px 16px', fontSize:14, color:C.textTertiary }}>Thinking...</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:10 }}>
        <input
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
          placeholder="Ask about clients, nurses, visits, revenue..."
          style={{ flex:1, padding:'12px 16px', borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit' }}
        />
        <button onClick={sendMessage} disabled={!input.trim()||loading} style={{ padding:'12px 20px', borderRadius:10, border:'none', background:C.primary, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', opacity:!input.trim()||loading?0.5:1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function AdminSettings() {
  const [settings, setSettings] = useState({ payPerVisit:20, trialDays:7, basicPrice:30, standardPrice:50, premiumPrice:120 });
  const [saved, setSaved] = useState(false);
  const inp2 = { ...inp, width:'100%', boxSizing:'border-box' };

  const SectionCard = ({ title, subtitle, children }) => (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <SectionCard title="Platform settings" subtitle="Core operational parameters">
        {[['Nurse pay per visit (€)','payPerVisit'],['Trial period (days)','trialDays'],['Basic plan price (€)','basicPrice'],['Standard plan price (€)','standardPrice'],['Premium plan price (€)','premiumPrice']].map(([label,key]) => (
          <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <label style={{ fontSize:14, color:C.textPrimary }}>{label}</label>
            <input type="number" value={settings[key]} onChange={e=>setSettings({...settings,[key]:Number(e.target.value)})} style={{ ...inp, width:90, textAlign:'center' }} />
          </div>
        ))}
        <button onClick={()=>setSaved(true)} style={{ marginTop:20, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          {saved?'Saved':'Save settings'}
        </button>
      </SectionCard>

      <SectionCard title="Admin profile" subtitle="Your account details">
        {[['Name','Vonaxity Admin'],['Email','admin@vonaxity.com'],['Role','Super Admin']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:14 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPage({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [nurses, setNurses] = useState(MOCK_NURSES);
  const [visits, setVisits] = useState(MOCK_VISITS);

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const alertCount = visits.filter(v=>v.status==='UNASSIGNED').length + nurses.filter(n=>n.status==='PENDING').length;

  const titles = { overview:'Admin Overview', clients:'Clients', nurses:'Nurses', visits:'Visits', alerts:`Alerts & Issues`, payments:'Payments', ai:'AI Assistant', settings:'Settings' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {alertCount > 0 && (
              <button onClick={()=>setActive('alerts')} style={{ fontSize:12, fontWeight:600, padding:'6px 12px', background:C.errorLight, color:C.error, border:'none', borderRadius:7, cursor:'pointer' }}>
                {alertCount} alert{alertCount>1?'s':''}
              </button>
            )}
            <button onClick={()=>setActive('ai')} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', background:C.purpleLight, color:C.purple, border:`1px solid rgba(124,58,237,0.2)`, borderRadius:7, cursor:'pointer' }}>
              AI Assistant
            </button>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#93C5FD' }}>A</div>
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto' }}>
          {active==='overview' && <Overview setActive={setActive} />}
          {active==='clients' && <Clients />}
          {active==='nurses' && <Nurses nurses={nurses} setNurses={setNurses} />}
          {active==='visits' && <Visits visits={visits} setVisits={setVisits} nurses={nurses} />}
          {active==='alerts' && <Alerts visits={visits} nurses={nurses} setVisits={setVisits} setNurses={setNurses} />}
          {active==='payments' && <Payments />}
          {active==='ai' && <AIAssistant clients={MOCK_CLIENTS} nurses={nurses} visits={visits} />}
          {active==='settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}
