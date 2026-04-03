'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', purpleLight:'#F5F3FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const MOCK_NURSE = { name:'Elona Berberi', city:'Tirana', initials:'EB', rating:4.8, totalVisits:47, earnings:{ total:940, pending:120, thisMonth:200 } };
const MOCK_VISITS = [
  { id:1, clientName:'Fatmira Murati', address:'Rruga e Elbasanit 14, Tirana', lat:41.3275, lng:19.8187, service:'Blood Pressure + Glucose Check', date:'2024-12-20', time:'10:00', status:'upcoming', notes:'Patient has diabetes. Bring glucose kit. Ring doorbell twice.', phone:'+355690001111', age:74 },
  { id:2, clientName:'Besnik Kola', address:'Bulevardi Bajram Curri 5, Tirana', lat:41.3317, lng:19.8319, service:'Vitals Monitoring', date:'2024-12-20', time:'14:30', status:'upcoming', notes:'Post-surgery check. 3rd floor.', phone:'+355690002222', age:68 },
  { id:3, clientName:'Lirije Hoxha', address:'Rruga Myslym Shyri 22, Tirana', lat:41.3248, lng:19.8227, service:'Welfare Check', date:'2024-12-19', time:'09:00', status:'completed', notes:'', phone:'+355690003333', age:81, vitals:{ bp:'126/80', hr:'72', glucose:'5.2', notes:'Patient well. Mild fatigue.' } },
];

const NavIcon = ({ d, d2 }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/>{d2&&<path d={d2}/>}</svg>;

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:<NavIcon d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" d2="M9 22V12h6v10"/> },
  { id:'visits', label:'My Visits', icon:<NavIcon d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2"/> },
  { id:'map', label:'Navigation', icon:<NavIcon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/> },
  { id:'complete', label:'Complete Visit', icon:<NavIcon d="M9 11l3 3L22 4" d2="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/> },
  { id:'earnings', label:'Earnings', icon:<NavIcon d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/> },
  { id:'profile', label:'Profile', icon:<NavIcon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" d2="M12 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/> },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <div style={{ width:collapsed?58:210, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && <div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {collapsed?'›':'‹'}
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding:'14px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#93C5FD', flexShrink:0 }}>{MOCK_NURSE.initials}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{MOCK_NURSE.name}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'#6EE7B7', background:'rgba(16,185,129,0.12)', padding:'2px 8px', borderRadius:99, marginTop:3 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#34D399' }}/>Approved
              </div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ flex:1, padding:'10px 8px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'10px 12px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start', transition:'all 0.15s' }}>
            {item.icon}{!collapsed&&<span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed && <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}><button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button></div>}
    </div>
  );
}

function Dashboard({ setActive, setSelectedVisit }) {
  const today = MOCK_VISITS.filter(v=>v.date==='2024-12-20');
  return (
    <div>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'18px 22px', marginBottom:28, display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>Good morning, {MOCK_NURSE.name}</div>
          <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{today.length} visits today · First at {today[0]?.time}</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[["Today's visits",today.length,C.primary],['Total completed',MOCK_NURSE.totalVisits,C.secondary],['Rating',MOCK_NURSE.rating,C.warning],['This month',`€${MOCK_NURSE.earnings.thisMonth}`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <DailyRouteCard visits={today} onVisitSelect={(v)=>{setSelectedVisit(v);setActive('map');}} />
      <div style={{ marginTop:16, background:C.warningLight, border:`1px solid #FDE68A`, borderRadius:10, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style={{ fontSize:13, color:'#92400E' }}>Non-emergency care only. Emergency: call <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all'?MOCK_VISITS:MOCK_VISITS.filter(v=>v.status===filter);
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','upcoming','completed'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', borderRadius:99, border:'none', cursor:'pointer', background:filter===f?C.primary:C.bgWhite, color:filter===f?'#fff':C.textSecondary, border:filter===f?'none':`1px solid ${C.border}` }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {filtered.map(v => <VisitLocationCard key={v.id} visit={v} compact={v.status==='completed'} onStatusChange={(id,status)=>console.log('Status:',id,status)} onComplete={(id)=>{setSelectedVisit(MOCK_VISITS.find(v=>v.id===id));setActive('complete');}} />)}
      </div>
    </div>
  );
}

function MapView({ selectedVisit, setActive, setSelectedVisit }) {
  const [selected, setSelected] = useState(selectedVisit||MOCK_VISITS[0]);
  const today = MOCK_VISITS.filter(v=>v.date==='2024-12-20');
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {today.map(v => <button key={v.id} onClick={()=>setSelected(v)} style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:10, border:'none', cursor:'pointer', background:selected?.id===v.id?C.primary:C.bgWhite, color:selected?.id===v.id?'#fff':C.textSecondary, border:selected?.id===v.id?'none':`1px solid ${C.border}` }}>{v.time} · {v.clientName.split(' ')[0]}</button>)}
      </div>
      {selected && <VisitLocationCard visit={selected} onStatusChange={(id,status)=>console.log(id,status)} onComplete={(id)=>{setSelectedVisit(MOCK_VISITS.find(v=>v.id===id));setActive('complete');}} />}
    </div>
  );
}

function CompleteVisit({ visit, setActive }) {
  const v = visit||MOCK_VISITS[0];
  const [form, setForm] = useState({ bp:'', hr:'', glucose:'', temp:'', oxygen:'', notes:'' });
  const [submitted, setSubmitted] = useState(false);
  const inp = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:10 }}>Report submitted</h3>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Health report for <strong>{v.clientName}</strong> sent to family.</p>
      <button onClick={()=>{setSubmitted(false);setActive('visits');}} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:600, cursor:'pointer' }}>Back to visits</button>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.primaryLight, borderRadius:12, padding:'14px 18px', marginBottom:24, border:`1px solid rgba(37,99,235,0.15)` }}>
        <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>{v.clientName}</div>
        <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{v.service} · {v.date} at {v.time}</div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Vitals</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {[['bp','Blood Pressure','128/82'],['hr','Heart Rate (bpm)','72'],['glucose','Glucose (mmol/L)','5.4'],['temp','Temperature (°C)','36.8'],['oxygen','O₂ Saturation (%)','97']].map(([key,label,ph]) => (
            <div key={key}>
              <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:5 }}>{label}</label>
              <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={`e.g. ${ph}`} style={inp} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, marginBottom:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>Nurse notes</div>
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Describe the visit, patient condition, observations and recommendations..." style={{...inp,minHeight:100,resize:'vertical'}} />
      </div>
      <button onClick={()=>setSubmitted(true)} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' }}>
        Submit visit report
      </button>
    </div>
  );
}

function Earnings() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[['Total earned',`€${MOCK_NURSE.earnings.total}`,C.secondary],['Pending',`€${MOCK_NURSE.earnings.pending}`,C.warning],['This month',`€${MOCK_NURSE.earnings.thisMonth}`,C.primary],['Total visits',MOCK_NURSE.totalVisits,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Payment history</div>
        <div style={{ fontSize:12, color:C.textTertiary, marginBottom:20 }}>Pay rate: <strong style={{ color:C.textPrimary }}>€20 per visit</strong> · Processed weekly</div>
        {[['Dec 10–14',4,80,'paid'],['Dec 3–7',3,60,'paid'],['Nov 26–30',4,80,'pending']].map(([period,visits,amount,status],i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{period}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{visits} visits · €20/visit</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary }}>€{amount}</div>
              <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:99, background:status==='paid'?C.secondaryLight:C.warningLight, color:status==='paid'?C.secondary:C.warning }}>
                {status==='paid'?'Paid':'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NursePage({ params }) {
  const lang = params?.lang||'en';
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const logout = () => { document.cookie='vonaxity-token=;path=/;max-age=0'; document.cookie='vonaxity-role=;path=/;max-age=0'; router.push(`/${lang}/login`); };
  const titles = { dashboard:'Nurse Dashboard', visits:'My Visits', map:'Navigation', complete:'Complete Visit', earnings:'Earnings', profile:'Profile' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }}/>On duty
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:720, width:'100%' }}>
          {active==='dashboard'&&<Dashboard setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='visits'&&<Visits setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='map'&&<MapView selectedVisit={selectedVisit} setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='complete'&&<CompleteVisit visit={selectedVisit} setActive={setActive} />}
          {active==='earnings'&&<Earnings />}
          {active==='profile'&&<div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, fontSize:14, color:C.textTertiary }}>Profile editing coming in Phase 3.</div>}
        </main>
      </div>
    </div>
  );
}
