'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:'📊' },
  { id:'visits', label:'My Visits', icon:'🗓️' },
  { id:'map', label:'Navigation', icon:'🗺️' },
  { id:'complete', label:'Complete Visit', icon:'📝' },
  { id:'earnings', label:'Earnings', icon:'💰' },
  { id:'profile', label:'Profile', icon:'👤' },
];

// Helper to format visit for VisitLocationCard
function formatVisit(v) {
  return {
    id: v.id,
    clientName: v.relative?.name || 'Patient',
    address: v.relative?.address || '',
    lat: null, lng: null, // Real coords would come from geocoding
    service: v.serviceType,
    date: new Date(v.scheduledAt).toISOString().split('T')[0],
    time: new Date(v.scheduledAt).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' }),
    status: v.status.toLowerCase(),
    notes: v.notes || '',
    phone: v.relative?.phone || '',
    age: v.relative?.age || null,
  };
}

function Sidebar({ nurse, collapsed, setCollapsed, active, setActive, onLogout }) {
  const initials = nurse?.user?.name ? nurse.user.name.split(' ').map(w=>w[0]).join('') : 'N';
  return (
    <div style={{ width:collapsed?58:210, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && <div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {collapsed?'›':'‹'}
        </button>
      </div>
      {!collapsed && nurse && (
        <div style={{ padding:'14px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#93C5FD', flexShrink:0 }}>{initials}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{nurse.user?.name}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'#6EE7B7', background:'rgba(16,185,129,0.12)', padding:'2px 8px', borderRadius:99, marginTop:3 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#34D399' }}/>{nurse.status}
              </div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ flex:1, padding:'10px 8px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'10px 12px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start' }}>
            <span style={{ fontSize:16 }}>{item.icon}</span>{!collapsed&&<span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed && <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}><button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button></div>}
    </div>
  );
}

function Dashboard({ nurse, visits, setActive, setSelectedVisit }) {
  const today = visits.filter(v => {
    const d = new Date(v.scheduledAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  return (
    <div>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'18px 22px', marginBottom:28, display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>Good morning, {nurse?.user?.name?.split(' ')[0] || 'Nurse'}</div>
          <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{today.length} visits today · {nurse?.city}</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[["Today",today.length,C.primary],['Total',nurse?.totalVisits||0,C.secondary],['Rating',nurse?.rating||'N/A',C.warning],['Earnings',`€${nurse?.totalEarnings||0}`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      {today.length > 0 && (
        <DailyRouteCard visits={today.map(formatVisit)} onVisitSelect={(v) => { setSelectedVisit(visits.find(vv=>vv.id===v.id)); setActive('map'); }} />
      )}
      <div style={{ marginTop:16, background:C.warningLight, border:`1px solid #FDE68A`, borderRadius:10, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style={{ fontSize:13, color:'#92400E' }}>Non-emergency care only. Emergency: call <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ visits, setActive, setSelectedVisit, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all' ? visits : visits.filter(v => {
    if (filter==='upcoming') return !['COMPLETED','CANCELLED','NO_SHOW'].includes(v.status);
    if (filter==='completed') return v.status==='COMPLETED';
    return true;
  });
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','upcoming','completed'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ fontSize:12, fontWeight:600, padding:'7px 16px', borderRadius:99, border:'none', cursor:'pointer', background:filter===f?C.primary:C.bgWhite, color:filter===f?'#fff':C.textSecondary, border:filter===f?'none':`1px solid ${C.border}` }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No visits found.</div>
      ) : filtered.map(v => (
        <div key={v.id} style={{ marginBottom:14 }}>
          <VisitLocationCard
            visit={formatVisit(v)}
            compact={v.status==='COMPLETED'}
            onStatusChange={(id, status) => onStatusChange(id, status.toUpperCase())}
            onComplete={(id) => { setSelectedVisit(visits.find(vv=>vv.id===id)); setActive('complete'); }}
          />
        </div>
      ))}
    </div>
  );
}

function MapView({ visits, selectedVisit, setActive, setSelectedVisit, onStatusChange }) {
  const upcoming = visits.filter(v => !['COMPLETED','CANCELLED','NO_SHOW'].includes(v.status));
  const [selected, setSelected] = useState(selectedVisit || upcoming[0]);
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {upcoming.map(v => (
          <button key={v.id} onClick={()=>setSelected(v)} style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:10, border:'none', cursor:'pointer', background:selected?.id===v.id?C.primary:C.bgWhite, color:selected?.id===v.id?'#fff':C.textSecondary, border:selected?.id===v.id?'none':`1px solid ${C.border}` }}>
            {new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} · {v.relative?.name?.split(' ')[0] || 'Patient'}
          </button>
        ))}
      </div>
      {selected && (
        <VisitLocationCard
          visit={formatVisit(selected)}
          onStatusChange={(id, status) => onStatusChange(id, status.toUpperCase())}
          onComplete={(id) => { setSelectedVisit(visits.find(vv=>vv.id===id)); setActive('complete'); }}
        />
      )}
      {upcoming.length === 0 && <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, textAlign:'center', color:C.textTertiary, fontSize:14 }}>No upcoming visits today.</div>}
    </div>
  );
}

function CompleteVisit({ visit, setActive, onComplete }) {
  const [form, setForm] = useState({ bp:'', hr:'', glucose:'', temp:'', oxygen:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inp = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  if (!visit) return <div style={{ padding:28, color:C.textTertiary, fontSize:14 }}>Select a visit to complete from the Visits tab.</div>;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.completeVisit(visit.id, {
        bp: form.bp, hr: form.hr ? parseInt(form.hr) : null,
        glucose: form.glucose ? parseFloat(form.glucose) : null,
        temperature: form.temp ? parseFloat(form.temp) : null,
        oxygenSat: form.oxygen ? parseFloat(form.oxygen) : null,
        nurseNotes: form.notes,
      });
      setSubmitted(true);
      onComplete?.();
    } catch (err) {
      alert('Failed to submit: ' + err.message);
    } finally { setSubmitting(false); }
  };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:10 }}>Report submitted</h3>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Health report for <strong>{visit.relative?.name}</strong> saved.</p>
      <button onClick={() => { setSubmitted(false); setActive('visits'); }} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:600, cursor:'pointer' }}>Back to visits</button>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.primaryLight, borderRadius:12, padding:'14px 18px', marginBottom:24, border:`1px solid rgba(37,99,235,0.15)` }}>
        <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>{visit.relative?.name || 'Patient'}</div>
        <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{visit.serviceType} · {new Date(visit.scheduledAt).toLocaleDateString()}</div>
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
        <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Describe the visit, patient condition..." style={{...inp,minHeight:100,resize:'vertical'}} />
      </div>
      <button onClick={handleSubmit} disabled={submitting} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:submitting?0.7:1 }}>
        {submitting ? 'Submitting...' : 'Submit visit report'}
      </button>
    </div>
  );
}

export default function NursePage({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [nurse, setNurse] = useState(null);
  const [visits, setVisits] = useState([]);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [nurseData, visitsData] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/nurses/me`, { credentials:'include' }).then(r=>r.json()),
        api.getVisits(),
      ]);
      if (nurseData.nurse) setNurse(nurseData.nurse);
      setVisits(visitsData.visits || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleStatusChange = async (visitId, newStatus) => {
    try {
      await api.updateVisit(visitId, { status: newStatus });
      setVisits(prev => prev.map(v => v.id === visitId ? {...v, status: newStatus} : v));
    } catch (err) { console.error('Status update failed:', err); }
  };

  const logout = async () => {
    try { await api.logout(); } catch {}
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { dashboard:'Nurse Dashboard', visits:'My Visits', map:'Navigation', complete:'Complete Visit', earnings:'Earnings', profile:'Profile' };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ fontSize:14, color:C.textTertiary }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar nurse={nurse} collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }}/>On duty
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:720, width:'100%' }}>
          {active==='dashboard' && <Dashboard nurse={nurse} visits={visits} setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='visits' && <Visits visits={visits} setActive={setActive} setSelectedVisit={setSelectedVisit} onStatusChange={handleStatusChange} />}
          {active==='map' && <MapView visits={visits} selectedVisit={selectedVisit} setActive={setActive} setSelectedVisit={setSelectedVisit} onStatusChange={handleStatusChange} />}
          {active==='complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} onComplete={loadData} />}
          {active==='earnings' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
                {[['Total earned',`€${nurse?.totalEarnings||0}`,C.secondary],['Total visits',nurse?.totalVisits||0,C.primary],['Rating',nurse?.rating||'N/A',C.warning],['Pay rate',`€${nurse?.payRatePerVisit||20}/visit`,C.purple]].map(([label,value,color]) => (
                  <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
                    <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, fontSize:14, color:C.textTertiary }}>Payment history and payouts coming in Phase 4.</div>
            </div>
          )}
          {active==='profile' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
              <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Profile</div>
              {[['Name',nurse?.user?.name],['Email',nurse?.user?.email],['City',nurse?.city],['License',nurse?.licenseNumber||'Not set'],['Status',nurse?.status]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:14 }}>
                  <span style={{ color:C.textTertiary }}>{k}</span>
                  <span style={{ color:C.textPrimary, fontWeight:500 }}>{v || 'N/A'}</span>
                </div>
              ))}
              <div style={{ marginTop:16, fontSize:13, color:C.textTertiary }}>Profile editing coming in Phase 4.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
