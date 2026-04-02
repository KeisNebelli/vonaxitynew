'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', primaryDark:'#1D4ED8', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', purpleLight:'#F5F3FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const USERS = [
  { id:1, name:'Arta Murati', email:'client@test.com', country:'UK', city:'Tirana', plan:'Standard', status:'active', visits:4, paid:200 },
  { id:2, name:'Besnik Kola', email:'besnik@test.com', country:'Italy', city:'Durrës', plan:'Premium', status:'active', visits:8, paid:480 },
  { id:3, name:'Donika Cela', email:'donika@test.com', country:'USA', city:'Shkodër', plan:'Premium', status:'trial', visits:0, paid:0 },
];
const NURSES = [
  { id:1, name:'Elona Berberi', email:'nurse@test.com', city:'Tirana', status:'approved', rating:4.8, visits:47, earnings:940 },
  { id:2, name:'Mirjeta Doshi', email:'mirjeta@test.com', city:'Durrës', status:'approved', rating:4.6, visits:31, earnings:620 },
  { id:3, name:'Arjana Teli', email:'arjana@test.com', city:'Tirana', status:'pending', rating:0, visits:0, earnings:0 },
];
const VISITS = [
  { id:1, client:'Fatmira Murati', nurse:'Elona Berberi', city:'Tirana', service:'BP + Glucose', date:'Dec 20', status:'upcoming' },
  { id:2, client:'Shqipe Kola', nurse:'Mirjeta Doshi', city:'Durrës', service:'Welfare Check', date:'Dec 19', status:'completed' },
  { id:3, client:'Ndrek Hoxha', nurse:null, city:'Tirana', service:'Blood Work', date:'Dec 22', status:'unassigned' },
];
const PAYMENTS = [
  { id:1, user:'Besnik Kola', plan:'Premium', amount:120, date:'Dec 1', status:'paid' },
  { id:2, user:'Arta Murati', plan:'Standard', amount:50, date:'Dec 1', status:'paid' },
  { id:3, user:'Gjon Marku', plan:'Standard', amount:50, date:'Nov 22', status:'failed' },
];

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

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <div style={{ width:collapsed?58:210, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed&&<div><div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div><div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.25)', letterSpacing:'2px', marginTop:2 }}>ADMIN</div></div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {collapsed?'›':'‹'}
        </button>
      </div>
      <nav style={{ flex:1, padding:'12px 8px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'11px 14px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start', letterSpacing:'-0.1px' }}>
            {!collapsed&&<span>{item.label}</span>}
            {collapsed&&<span style={{ fontSize:10, fontWeight:700 }}>{item.label.slice(0,2).toUpperCase()}</span>}
          </button>
        ))}
      </nav>
      {!collapsed&&<div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}><button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button></div>}
    </div>
  );
}

function Overview({ setActive }) {
  const revenue = PAYMENTS.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
  const unassigned = VISITS.filter(v=>v.status==='unassigned').length;
  const pending = NURSES.filter(n=>n.status==='pending').length;
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
        {[['Clients',USERS.length,C.primary],['Nurses',NURSES.length,C.purple],['Active subs',USERS.filter(u=>u.status==='active').length,C.secondary],['Revenue',`€${revenue}`,C.secondary],['Unassigned',unassigned,unassigned>0?C.error:C.textTertiary]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {unassigned>0&&<div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:12, padding:'14px 18px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, fontWeight:600, color:C.error }}>{unassigned} visit{unassigned>1?'s':''} need a nurse assigned</span>
        <button onClick={()=>setActive('visits')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.error, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Assign now</button>
      </div>}
      {pending>0&&<div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, fontWeight:600, color:C.warning }}>{pending} nurse application{pending>1?'s':''} pending review</span>
        <button onClick={()=>setActive('nurses')} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', background:C.warning, color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>Review</button>
      </div>}
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:18 }}>Recent visits</div>
        {VISITS.slice(0,3).map(v => (
          <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{v.client}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{v.service} · {v.city} · {v.date}</div>
              <div style={{ fontSize:12, color:v.nurse?C.textTertiary:C.error, marginTop:1, fontWeight:v.nurse?400:600 }}>{v.nurse?`Nurse: ${v.nurse}`:'No nurse assigned'}</div>
            </div>
            <Badge label={v.status==='completed'?'Completed':v.status==='unassigned'?'Unassigned':'Upcoming'} type={v.status==='completed'?'success':v.status==='unassigned'?'error':'primary'} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NurseManagement() {
  const [nurses, setNurses] = useState(NURSES);
  const update = (id, status) => setNurses(nurses.map(n=>n.id===id?{...n,status}:n));
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
        <button style={{ fontSize:13, fontWeight:600, padding:'9px 18px', background:C.primary, color:'#fff', border:'none', borderRadius:9, cursor:'pointer' }}>Add nurse</button>
      </div>
      {nurses.map(n => (
        <div key={n.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:n.status==='approved'?C.primaryLight:n.status==='pending'?C.warningLight:C.errorLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:n.status==='approved'?C.primary:n.status==='pending'?C.warning:C.error, flexShrink:0 }}>
                {n.name.split(' ').map(w=>w[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{n.name}</div>
                <div style={{ fontSize:12, color:C.textTertiary, marginBottom:6 }}>{n.email} · {n.city}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <Badge label={n.status==='approved'?'Approved':n.status==='pending'?'Pending review':'Suspended'} type={n.status==='approved'?'success':n.status==='pending'?'warning':'error'} />
                  {n.rating>0&&<span style={{ fontSize:12, color:C.warning, fontWeight:600 }}>{n.rating} rating</span>}
                  {n.visits>0&&<span style={{ fontSize:12, color:C.textTertiary }}>{n.visits} visits · €{n.earnings}</span>}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {n.status==='pending'&&<><button onClick={()=>update(n.id,'approved')} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>Approve</button><button onClick={()=>update(n.id,'suspended')} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.errorLight, color:C.error, border:'none', borderRadius:8, cursor:'pointer' }}>Reject</button></>}
              {n.status==='approved'&&<button onClick={()=>update(n.id,'suspended')} style={{ fontSize:12, padding:'8px 16px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer' }}>Suspend</button>}
              {n.status==='suspended'&&<button onClick={()=>update(n.id,'approved')} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:C.secondaryLight, color:C.secondary, border:'none', borderRadius:8, cursor:'pointer' }}>Reinstate</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VisitManagement() {
  const [visits, setVisits] = useState(VISITS);
  const [assigning, setAssigning] = useState(null);
  const assign = (visitId, nurse) => { setVisits(visits.map(v=>v.id===visitId?{...v,nurse,status:'upcoming'}:v)); setAssigning(null); };
  return (
    <div>
      {visits.map(v => (
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${v.status==='unassigned'?'#FECACA':C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{v.client}</div>
              <div style={{ fontSize:13, color:C.textSecondary, marginBottom:4 }}>{v.service} · {v.date} · {v.city}</div>
              <div style={{ fontSize:13, color:v.nurse?C.textTertiary:C.error, fontWeight:v.nurse?400:600 }}>{v.nurse?`Nurse: ${v.nurse}`:'No nurse assigned'}</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setAssigning(assigning===v.id?null:v.id)} style={{ fontSize:12, fontWeight:600, padding:'8px 16px', background:v.status==='unassigned'?C.primary:C.bgSubtle, color:v.status==='unassigned'?'#fff':C.textSecondary, border:`1px solid ${v.status==='unassigned'?'transparent':C.border}`, borderRadius:8, cursor:'pointer' }}>
                {v.status==='unassigned'?'Assign nurse':'Reassign'}
              </button>
              <button style={{ fontSize:12, padding:'8px 14px', background:C.errorLight, color:C.error, border:'none', borderRadius:8, cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
          {assigning===v.id&&(
            <div style={{ marginTop:14, background:C.bg, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>Select nurse for {v.city}</div>
              {NURSES.filter(n=>n.status==='approved'&&n.city===v.city).map(n => (
                <button key={n.id} onClick={()=>assign(v.id,n.name)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'11px 16px', background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:9, cursor:'pointer', marginBottom:8, textAlign:'left' }}>
                  <div><div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{n.name}</div><div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{n.rating} rating · {n.visits} visits</div></div>
                  <span style={{ fontSize:13, fontWeight:600, color:C.primary }}>Assign →</span>
                </button>
              ))}
              {NURSES.filter(n=>n.status==='approved'&&n.city===v.city).length===0&&<div style={{ fontSize:13, color:C.error }}>No approved nurses available in {v.city}.</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Payments() {
  const total = PAYMENTS.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:24 }}>
        {[['Revenue',`€${total}`,C.secondary],['Successful',PAYMENTS.filter(p=>p.status==='paid').length,C.secondary],['Failed',PAYMENTS.filter(p=>p.status==='failed').length,C.error]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>All transactions</div>
          <button style={{ fontSize:12, fontWeight:600, padding:'7px 14px', background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer' }}>Export CSV</button>
        </div>
        {PAYMENTS.map((p,i) => (
          <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 22px', borderBottom:i<PAYMENTS.length-1?`1px solid ${C.borderSubtle}`:'none' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{p.user}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{p.date} · {p.plan}</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary }}>€{p.amount}</div>
              <Badge label={p.status==='paid'?'Paid':'Failed'} type={p.status==='paid'?'success':'error'} />
              {p.status==='failed'&&<button style={{ fontSize:11, fontWeight:600, padding:'5px 12px', background:C.warningLight, color:C.warning, border:'none', borderRadius:6, cursor:'pointer' }}>Retry</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [s, setS] = useState({ payPerVisit:20, trialDays:7, basicPrice:30, standardPrice:50, premiumPrice:120 });
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ maxWidth:520 }}>
      {[['Nurse pay per visit (€)','payPerVisit'],['Trial period (days)','trialDays'],['Basic plan price (€)','basicPrice'],['Standard plan price (€)','standardPrice'],['Premium plan price (€)','premiumPrice']].map(([label,key]) => (
        <div key={key} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'14px 18px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <label style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{label}</label>
          <input type="number" value={s[key]} onChange={e=>setS({...s,[key]:Number(e.target.value)})} style={{ width:80, padding:'8px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:14, fontWeight:600, textAlign:'center', outline:'none', fontFamily:'inherit' }} />
        </div>
      ))}
      <button onClick={()=>setSaved(true)} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:14, fontWeight:600, cursor:'pointer', marginTop:8 }}>
        {saved?'Saved':'Save settings'}
      </button>
    </div>
  );
}

export default function AdminPage({ params }) {
  const lang = params?.lang||'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const logout = () => { document.cookie='vonaxity-token=;path=/;max-age=0'; document.cookie='vonaxity-role=;path=/;max-age=0'; router.push(`/${lang}/login`); };
  const titles = { overview:'Admin Overview', nurses:'Nurse Management', users:'Client Management', visits:'Visit Management', payments:'Payments', settings:'Settings' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            {VISITS.filter(v=>v.status==='unassigned').length>0&&(
              <button onClick={()=>setActive('visits')} style={{ fontSize:12, fontWeight:600, padding:'6px 12px', background:C.errorLight, color:C.error, border:'none', borderRadius:7, cursor:'pointer' }}>
                {VISITS.filter(v=>v.status==='unassigned').length} unassigned
              </button>
            )}
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#93C5FD' }}>A</div>
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto' }}>
          {active==='overview'&&<Overview setActive={setActive} />}
          {active==='nurses'&&<NurseManagement />}
          {active==='users'&&(
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, overflow:'hidden' }}>
              {USERS.map((u,i) => (
                <div key={u.id} style={{ padding:'16px 22px', borderBottom:i<USERS.length-1?`1px solid ${C.borderSubtle}`:'none', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{u.name}</div>
                    <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{u.email} · {u.country} → {u.city}</div>
                    <div style={{ fontSize:12, color:C.textTertiary, marginTop:1 }}>{u.visits} visits · €{u.paid} paid</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Badge label={u.plan} type={u.plan==='Premium'?'warning':u.plan==='Standard'?'purple':'primary'} />
                    <Badge label={u.status==='active'?'Active':u.status==='trial'?'Trial':'Cancelled'} type={u.status==='active'?'success':u.status==='trial'?'purple':'default'} />
                    <button style={{ fontSize:11, fontWeight:600, padding:'5px 12px', background:C.primaryLight, color:C.primary, border:'none', borderRadius:6, cursor:'pointer' }}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {active==='visits'&&<VisitManagement />}
          {active==='payments'&&<Payments />}
          {active==='settings'&&<Settings />}
        </main>
      </div>
    </div>
  );
}
