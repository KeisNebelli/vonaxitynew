'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', purpleLight:'#F5F3FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const NAV_ITEMS = [
  { id:'overview', label:'Overview' },
  { id:'nurses', label:'Nurses' },
  { id:'users', label:'Clients' },
  { id:'visits', label:'Visits' },
  { id:'payments', label:'Payments' },
  { id:'settings', label:'Settings' },
];

const Badge = ({ label, type='default' }) => {
  const types = { default:[C.bgSubtle,C.textSecondary], success:[C.secondaryLight,C.secondary], warning:[C.warningLight,C.warning], error:[C.errorLight,C.error], primary:[C.primaryLight,C.primary], purple:[C.purpleLight,C.purple] };
  const [bg,color] = types[type]||types.default;
  return <span style={{ fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:99, background:bg, color, display:'inline-block', whiteSpace:'nowrap' }}>{label}</span>;
};

function Sidebar({ collapsed, setCollapsed, active, setActive, onLogout }) {
  return (
    <div style={{ width:collapsed?58:210, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && <div><div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div><div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'2px', marginTop:2 }}>ADMIN</div></div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>{collapsed?'›':'‹'}</button>
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'11px 14px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start' }}>
            {!collapsed&&<span>{item.label}</span>}
            {collapsed&&<span style={{ fontSize:10, fontWeight:700 }}>{item.label.slice(0,2).toUpperCase()}</span>}
          </button>
        ))}
      </nav>
      {!collapsed&&<div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}><button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button></div>}
    </div>
  );
}

function Overview({ nurses, users, visits, setActive, analytics }) {
  const unassigned = visits.filter(v => v.status === 'UNASSIGNED').length;
  const pending = nurses.filter(n => n.status === 'PENDING').length;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
        {[['Clients',users.length,C.primary],['Nurses',nurses.length,C.purple],['Active subs',users.filter(u=>u.status==='ACTIVE').length,C.secondary],['Unassigned',unassigned,unassigned>0?C.error:C.textTertiary]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {unassigned > 0 && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:600, color:C.error }}>{unassigned} visit{unassigned>1?'s':''} need a nurse assigned</span>
          <button onClick={()=>setActive('visits')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.error, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Assign now</button>
        </div>
      )}
      {pending > 0 && (
        <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:600, color:C.warning }}>{pending} nurse application{pending>1?'s':''} pending review</span>
          <button onClick={()=>setActive('nurses')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.warning, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Review</button>
        </div>
      )}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:18 }}>Recent visits</div>
        {visits.slice(0,5).map((v,i) => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<4?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.relative?.name || 'Patient'}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.serviceType} · {v.relative?.city} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
              <div style={{ fontSize:12, color:v.nurse?C.textTertiary:C.error, marginTop:1, fontWeight:v.nurse?400:600 }}>{v.nurse?`Nurse: ${v.nurse.user?.name}`:'No nurse assigned'}</div>
            </div>
            <Badge label={v.status} type={v.status==='COMPLETED'?'success':v.status==='UNASSIGNED'?'error':'primary'} />
          </div>
        ))}
        {visits.length === 0 && <div style={{ fontSize:13, color:C.textTertiary }}>No visits yet.</div>}
      </div>
    </div>
  );
}

function NurseManagement({ nurses, onApprove, onSuspend }) {
  return (
    <div>
      {nurses.map(n => (
        <div key={n.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:n.status==='APPROVED'?C.primaryLight:n.status==='PENDING'?C.warningLight:C.errorLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:n.status==='APPROVED'?C.primary:n.status==='PENDING'?C.warning:C.error, flexShrink:0 }}>
                {n.user?.name?.split(' ').map(w=>w[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{n.user?.name}</div>
                <div style={{ fontSize:12, color:C.textTertiary, marginBottom:6 }}>{n.user?.email} · {n.city}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <Badge label={n.status} type={n.status==='APPROVED'?'success':n.status==='PENDING'?'warning':'error'} />
                  {n.rating > 0 && <span style={{ fontSize:12, color:C.warning, fontWeight:600 }}>★ {n.rating}</span>}
                  <span style={{ fontSize:12, color:C.textTertiary }}>{n.totalVisits} visits · €{n.totalEarnings}</span>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {n.status==='PENDING' && <>
                <button onClick={()=>onApprove(n.id)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>Approve</button>
                <button onClick={()=>onSuspend(n.id)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.errorLight, color:C.error, border:'none', borderRadius:8, cursor:'pointer' }}>Reject</button>
              </>}
              {n.status==='APPROVED' && <button onClick={()=>onSuspend(n.id)} style={{ fontSize:12, padding:'8px 16px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer' }}>Suspend</button>}
              {n.status==='SUSPENDED' && <button onClick={()=>onApprove(n.id)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>Reinstate</button>}
            </div>
          </div>
        </div>
      ))}
      {nurses.length === 0 && <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No nurses yet.</div>}
    </div>
  );
}

function VisitManagement({ visits, nurses, onAssign }) {
  const [assigning, setAssigning] = useState(null);
  return (
    <div>
      {visits.map(v => (
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${v.status==='UNASSIGNED'?'#FECACA':C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{v.relative?.name || 'Patient'}</div>
              <div style={{ fontSize:13, color:C.textSecondary, marginBottom:4 }}>{v.serviceType} · {new Date(v.scheduledAt).toLocaleDateString()} · {v.relative?.city}</div>
              <div style={{ fontSize:13, color:v.nurse?C.textTertiary:C.error, fontWeight:v.nurse?400:600 }}>{v.nurse?`Nurse: ${v.nurse.user?.name}`:'No nurse assigned'}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <Badge label={v.status} type={v.status==='COMPLETED'?'success':v.status==='UNASSIGNED'?'error':'primary'} />
              {v.status !== 'COMPLETED' && (
                <button onClick={()=>setAssigning(assigning===v.id?null:v.id)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:v.status==='UNASSIGNED'?C.primary:C.bgSubtle, color:v.status==='UNASSIGNED'?'#fff':C.textSecondary, border:`1px solid ${v.status==='UNASSIGNED'?'transparent':C.border}`, borderRadius:8, cursor:'pointer' }}>
                  {v.status==='UNASSIGNED'?'Assign nurse':'Reassign'}
                </button>
              )}
            </div>
          </div>
          {assigning===v.id && (
            <div style={{ marginTop:14, background:C.bg, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>Select nurse for {v.relative?.city}</div>
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.relative?.city).map(n => (
                <button key={n.id} onClick={()=>{ onAssign(v.id, n.id); setAssigning(null); }} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'11px 16px', background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:9, cursor:'pointer', marginBottom:8, textAlign:'left' }}>
                  <div><div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.user?.name}</div><div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>★ {n.rating} · {n.totalVisits} visits</div></div>
                  <span style={{ fontSize:13, fontWeight:600, color:C.primary }}>Assign →</span>
                </button>
              ))}
              {nurses.filter(n=>n.status==='APPROVED'&&n.city===v.relative?.city).length===0 && <div style={{ fontSize:13, color:C.error }}>No approved nurses in {v.relative?.city}.</div>}
            </div>
          )}
        </div>
      ))}
      {visits.length === 0 && <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No visits yet.</div>}
    </div>
  );
}

export default function AdminPage({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [users, setUsers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [nursesData, usersData, visitsData, paymentsData] = await Promise.all([
        api.getNurses(),
        api.getUsers(),
        api.getVisits(),
        api.getPayments(),
      ]);
      setNurses(nursesData.nurses || []);
      setUsers(usersData.users || []);
      setVisits(visitsData.visits || []);
      setPayments(paymentsData.payments || []);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (nurseId) => {
    try {
      await api.approveNurse(nurseId);
      setNurses(prev => prev.map(n => n.id===nurseId ? {...n, status:'APPROVED'} : n));
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleSuspend = async (nurseId) => {
    try {
      await api.suspendNurse(nurseId);
      setNurses(prev => prev.map(n => n.id===nurseId ? {...n, status:'SUSPENDED'} : n));
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const handleAssign = async (visitId, nurseId) => {
    try {
      await api.updateVisit(visitId, { nurseId, status: 'PENDING' });
      await loadData();
    } catch (err) { alert('Failed: ' + err.message); }
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ fontSize:14, color:C.textTertiary }}>Loading admin dashboard...</div>
    </div>
  );

  const titles = { overview:'Admin Overview', nurses:'Nurse Management', users:'Client Management', visits:'Visit Management', payments:'Payments', settings:'Settings' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {visits.filter(v=>v.status==='UNASSIGNED').length>0 && (
              <button onClick={()=>setActive('visits')} style={{ fontSize:12, fontWeight:600, padding:'6px 12px', background:C.errorLight, color:C.error, border:'none', borderRadius:7, cursor:'pointer' }}>
                {visits.filter(v=>v.status==='UNASSIGNED').length} unassigned
              </button>
            )}
            <button onClick={loadData} style={{ fontSize:12, fontWeight:600, padding:'6px 12px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:7, cursor:'pointer' }}>Refresh</button>
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto' }}>
          {active==='overview' && <Overview nurses={nurses} users={users} visits={visits} setActive={setActive} />}
          {active==='nurses' && <NurseManagement nurses={nurses} onApprove={handleApprove} onSuspend={handleSuspend} />}
          {active==='users' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
              {users.map((u,i) => (
                <div key={u.id} style={{ padding:'16px 22px', borderBottom:i<users.length-1?`1px solid ${C.borderSubtle}`:'none', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{u.name}</div>
                    <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{u.email} · {u.country}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Badge label={u.subscription?.plan||'N/A'} type='primary' />
                    <Badge label={u.status} type={u.status==='ACTIVE'?'success':u.status==='TRIAL'?'warning':'default'} />
                  </div>
                </div>
              ))}
              {users.length===0 && <div style={{ padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No clients yet.</div>}
            </div>
          )}
          {active==='visits' && <VisitManagement visits={visits} nurses={nurses} onAssign={handleAssign} />}
          {active==='payments' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Payment history</div>
              {payments.map((p,i) => (
                <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:i<payments.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{p.user?.name}</div>
                    <div style={{ fontSize:12, color:C.textTertiary }}>{new Date(p.createdAt).toLocaleDateString()} · {p.description}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>€{p.amount}</span>
                    <Badge label={p.status} type={p.status==='PAID'?'success':'error'} />
                  </div>
                </div>
              ))}
              {payments.length===0 && <div style={{ fontSize:13, color:C.textTertiary }}>No payments yet.</div>}
            </div>
          )}
          {active==='settings' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, fontSize:14, color:C.textTertiary }}>
              Platform settings coming in Phase 4.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
