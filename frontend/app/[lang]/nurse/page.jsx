'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe',
  sage: '#16a34a', sageLight: '#f0fdf4',
  amber: '#b45309', amberLight: '#fff7ed',
  red: '#dc2626', redLight: '#fef2f2',
  purple: '#7c3aed',
  neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4', darkNav: '#1e293b',
};

const MOCK_NURSE = {
  name: 'Elona Berberi', city: 'Tirana', initials: 'EB',
  rating: 4.8, totalVisits: 47,
  earnings: { total: 940, pending: 120, thisMonth: 200 },
};

const MOCK_VISITS = [
  { id:1, clientName:'Fatmira Murati', address:'Rruga e Elbasanit 14, Tirana', lat:41.3275, lng:19.8187, service:'Blood Pressure + Glucose Check', date:'2024-12-20', time:'10:00', status:'upcoming', notes:'Patient has diabetes. Bring glucose kit. Ring doorbell twice.', phone:'+355690001111', age:74 },
  { id:2, clientName:'Besnik Kola', address:'Bulevardi Bajram Curri 5, Tirana', lat:41.3317, lng:19.8319, service:'Vitals Monitoring', date:'2024-12-20', time:'14:30', status:'upcoming', notes:'Post-surgery check. Patient on 3rd floor.', phone:'+355690002222', age:68 },
  { id:3, clientName:'Lirije Hoxha', address:'Rruga Myslym Shyri 22, Tirana', lat:41.3248, lng:19.8227, service:'Welfare Check', date:'2024-12-19', time:'09:00', status:'completed', notes:'', phone:'+355690003333', age:81, vitals:{ bp:'126/80', hr:'72', glucose:'5.2', notes:'Patient well. Mild fatigue.' } },
];

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:'📊' },
  { id:'visits', label:'My Visits', icon:'🗓️' },
  { id:'map', label:'Navigation', icon:'🗺️' },
  { id:'complete', label:'Complete Visit', icon:'📝' },
  { id:'earnings', label:'Earnings', icon:'💰' },
  { id:'profile', label:'Profile', icon:'👤' },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <div style={{ width:collapsed?58:200, background:C.darkNav, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'14px 10px', borderBottom:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && <div style={{ fontSize:16, fontWeight:700, color:'#fff', fontFamily:'Georgia,serif' }}>Von<span style={{ color:'#4ade80' }}>ax</span>ity</div>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', borderRadius:6, width:26, height:26, cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {collapsed?'→':'←'}
        </button>
      </div>
      {!collapsed && (
        <div style={{ padding:'12px 12px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:C.teal, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, marginBottom:6 }}>{MOCK_NURSE.initials}</div>
          <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{MOCK_NURSE.name}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)' }}>{MOCK_NURSE.city}</div>
          <div style={{ marginTop:5, fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'rgba(74,222,128,0.15)', color:'#4ade80', display:'inline-block' }}>✓ Approved</div>
        </div>
      )}
      <nav style={{ flex:1, padding:'10px 5px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'10px 10px', borderRadius:8, border:'none', background:active===item.id?'rgba(8,145,178,0.25)':'transparent', color:active===item.id?C.tealLight:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?700:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div style={{ padding:'10px 12px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.4)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

function Dashboard({ setActive, setSelectedVisit }) {
  const today = MOCK_VISITS.filter(v => v.date === '2024-12-20');
  return (
    <div>
      <div style={{ background:C.tealLight, borderRadius:12, border:'1px solid rgba(8,145,178,0.2)', padding:'16px 20px', marginBottom:24, display:'flex', gap:12, alignItems:'center' }}>
        <span style={{ fontSize:24 }}>👋</span>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:C.teal }}>Good morning, {MOCK_NURSE.name}</div>
          <div style={{ fontSize:13, color:C.neutralMid }}>You have <strong>{today.length} visits</strong> today. First at <strong>{today[0]?.time}</strong></div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[['🗓️',"Today's visits",today.length,C.teal],['✅','Total done',MOCK_NURSE.totalVisits,C.sage],['⭐','Rating',MOCK_NURSE.rating,C.amber],['💰','This month',`€${MOCK_NURSE.earnings.thisMonth}`,C.purple]].map(([icon,label,value,color]) => (
          <div key={label} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:'14px 16px' }}>
            <div style={{ fontSize:22 }}>{icon}</div>
            <div style={{ fontSize:11, color:C.neutralMid, marginTop:6 }}>{label}</div>
            <div style={{ fontSize:18, fontWeight:700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom:20 }}>
        <DailyRouteCard visits={today} onVisitSelect={(v) => { setSelectedVisit(v); setActive('map'); }} />
      </div>
      <div style={{ background:'#fff7ed', borderRadius:10, border:'1px solid #fed7aa', padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <span>⚠️</span>
        <span style={{ fontSize:13, color:'#92400e' }}>Non-emergency care only. Emergency: call <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? MOCK_VISITS : MOCK_VISITS.filter(v => v.status===filter);
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {['all','upcoming','completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize:12, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:600, background:filter===f?C.teal:C.neutral, color:filter===f?'#fff':C.neutralMid }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {filtered.map(v => (
          <VisitLocationCard key={v.id} visit={v} compact={v.status==='completed'}
            onStatusChange={(id,status) => console.log('Status:',id,status)}
            onComplete={(id) => { setSelectedVisit(MOCK_VISITS.find(v=>v.id===id)); setActive('complete'); }} />
        ))}
      </div>
    </div>
  );
}

function MapView({ selectedVisit, setActive, setSelectedVisit }) {
  const [selected, setSelected] = useState(selectedVisit || MOCK_VISITS[0]);
  const todayVisits = MOCK_VISITS.filter(v => v.date==='2024-12-20');
  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.neutralMid, marginBottom:10 }}>SELECT VISIT</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {todayVisits.map(v => (
            <button key={v.id} onClick={() => setSelected(v)} style={{ fontSize:13, padding:'8px 16px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:600, background:selected?.id===v.id?C.teal:C.neutral, color:selected?.id===v.id?'#fff':C.neutralMid }}>
              {v.time} · {v.clientName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      {selected && (
        <VisitLocationCard visit={selected}
          onStatusChange={(id,status) => console.log('Status:',id,status)}
          onComplete={(id) => { setSelectedVisit(MOCK_VISITS.find(v=>v.id===id)); setActive('complete'); }} />
      )}
    </div>
  );
}

function CompleteVisit({ visit, setActive }) {
  const v = visit || MOCK_VISITS[0];
  const [form, setForm] = useState({ bp:'', hr:'', glucose:'', temp:'', oxygen:'', notes:'' });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
      <h3 style={{ fontSize:20, fontWeight:700, color:C.neutralDark, marginBottom:12 }}>Report submitted!</h3>
      <p style={{ fontSize:14, color:C.neutralMid, marginBottom:20 }}>Health report for <strong>{v.clientName}</strong> sent to family.</p>
      <button onClick={() => { setSubmitted(false); setActive('visits'); }} style={{ background:C.teal, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:700, cursor:'pointer' }}>Back to visits</button>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.tealLight, borderRadius:10, padding:'12px 16px', marginBottom:20, border:'1px solid rgba(8,145,178,0.2)' }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.teal }}>{v.clientName}</div>
        <div style={{ fontSize:12, color:C.neutralMid }}>{v.service} · {v.date} at {v.time}</div>
      </div>
      <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:20, marginBottom:14 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.neutralDark, marginBottom:14 }}>📊 Vitals</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[['bp','Blood Pressure','e.g. 128/82'],['hr','Heart Rate (bpm)','e.g. 72'],['glucose','Glucose (mmol/L)','e.g. 5.4'],['temp','Temperature (°C)','e.g. 36.8'],['oxygen','O₂ Saturation (%)','e.g. 97']].map(([key,label,ph]) => (
            <div key={key}>
              <label style={{ fontSize:11, fontWeight:600, color:C.neutralDark, display:'block', marginBottom:4 }}>{label}</label>
              <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.neutralDark, marginBottom:10 }}>📝 Nurse notes</div>
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Describe the visit, patient condition..." style={{ width:'100%', minHeight:90, padding:'10px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none', boxSizing:'border-box' }} />
      </div>
      <button onClick={() => setSubmitted(true)} style={{ width:'100%', background:C.teal, color:'#fff', border:'none', borderRadius:12, padding:'15px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
        ✅ Submit Visit Report
      </button>
    </div>
  );
}

function Earnings() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[['💰','Total earned',`€${MOCK_NURSE.earnings.total}`,C.sage],['⏳','Pending',`€${MOCK_NURSE.earnings.pending}`,C.amber],['📅','This month',`€${MOCK_NURSE.earnings.thisMonth}`,C.teal],['🏥','Total visits',MOCK_NURSE.totalVisits,C.purple]].map(([icon,label,value,color]) => (
          <div key={label} style={{ background:C.white, borderRadius:12, border:`1px solid ${C.border}`, padding:'14px 16px' }}>
            <div style={{ fontSize:22 }}>{icon}</div>
            <div style={{ fontSize:11, color:C.neutralMid, marginTop:6 }}>{label}</div>
            <div style={{ fontSize:18, fontWeight:700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.neutralDark, marginBottom:14 }}>Payment history</div>
        {[['Dec 10–14',4,80,'paid'],['Dec 3–7',3,60,'paid'],['Nov 26–30',4,80,'pending']].map(([period,visits,amount,status],i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.neutralDark }}>{period}</div>
              <div style={{ fontSize:12, color:C.neutralMid }}>{visits} visits · €20/visit</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ fontSize:15, fontWeight:700, color:C.neutralDark }}>€{amount}</div>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:status==='paid'?C.sageLight:C.amberLight, color:status==='paid'?C.sage:C.amber }}>
                {status==='paid'?'✓ Paid':'⏳ Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NursePage({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { dashboard:'Nurse Dashboard', visits:'My Visits', map:'🗺️ Navigation', complete:'Complete Visit', earnings:'Earnings', profile:'Profile' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'system-ui,sans-serif', background:C.neutral }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 24px', height:56, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.white, flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:700, color:C.neutralDark }}>{titles[active]}</div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:12, color:C.sage, fontWeight:600 }}>🟢 On duty</span>
            <div style={{ width:30, height:30, borderRadius:'50%', background:C.teal, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>EB</div>
          </div>
        </div>
        <main style={{ flex:1, padding:24, overflowY:'auto', maxWidth:720, width:'100%' }}>
          {active==='dashboard' && <Dashboard setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='visits' && <Visits setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='map' && <MapView selectedVisit={selectedVisit} setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} />}
          {active==='earnings' && <Earnings />}
          {active==='profile' && <div style={{ background:C.white, borderRadius:14, border:`1px solid ${C.border}`, padding:24, fontSize:14, color:C.neutralMid }}>Profile editing coming in Phase 3.</div>}
        </main>
      </div>
    </div>
  );
}
