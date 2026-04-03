'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import VisitLocationCard, { DailyRouteCard } from '@/components/map/VisitLocationCard';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const MOCK_NURSE = { name:'Elona Berberi', email:'nurse@test.com', phone:'+355690001111', city:'Tirana', initials:'EB', rating:4.8, totalVisits:47, totalEarnings:940, payRatePerVisit:20, licenseNumber:'ALB-NURSE-2024-001', bio:'Specialised in cardiovascular monitoring and diabetic care. 6 years of home nursing experience across Tirana.', specialties:['Blood Pressure','Glucose Monitoring','Vitals'], languages:['Albanian','English'], availability:['Monday','Tuesday','Wednesday','Friday'] };

const MOCK_VISITS = [
  { id:'v1', relative:{ name:'Fatmira Murati', address:'Rruga e Elbasanit 14, Tirana', phone:'+355690001111', age:74, city:'Tirana' }, serviceType:'Blood Pressure + Glucose Check', scheduledAt:'2024-12-20T10:00:00Z', status:'PENDING', notes:'Patient has diabetes. Bring glucose kit. Ring doorbell twice.' },
  { id:'v2', relative:{ name:'Besnik Kola', address:'Bulevardi Bajram Curri 5, Tirana', phone:'+355690002222', age:68, city:'Tirana' }, serviceType:'Vitals Monitoring', scheduledAt:'2024-12-20T14:30:00Z', status:'PENDING', notes:'Post-surgery check. 3rd floor.' },
  { id:'v3', relative:{ name:'Lirije Hoxha', address:'Rruga Myslym Shyri 22, Tirana', phone:'+355690003333', age:81, city:'Tirana' }, serviceType:'Welfare Check', scheduledAt:'2024-12-19T09:00:00Z', status:'COMPLETED', notes:'', bpSystolic:126, bpDiastolic:80, glucose:5.2, nurseNotes:'Patient well. Mild fatigue.' },
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const CITIES = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];
const SPECIALTIES_LIST = ['Blood Pressure','Glucose Monitoring','Vitals','Blood Work','Welfare Check','General Nursing','Post-surgical Care','Paediatric Care'];

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'visits', label:'My Visits', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'map', label:'Navigation', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> },
  { id:'complete', label:'Complete Visit', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { id:'earnings', label:'Earnings', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
  { id:'profile', label:'My Profile', icon:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

function formatVisit(v) {
  return {
    id: v.id,
    clientName: v.relative?.name || 'Patient',
    address: v.relative?.address || '',
    lat: null, lng: null,
    service: v.serviceType,
    date: new Date(v.scheduledAt).toISOString().split('T')[0],
    time: new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),
    status: v.status.toLowerCase(),
    notes: v.notes || '',
    phone: v.relative?.phone || '',
    age: v.relative?.age || null,
  };
}

function Sidebar({ nurse, collapsed, setCollapsed, active, setActive, onLogout }) {
  return (
    <div style={{ width:collapsed?58:210, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, transition:'width 0.2s', flexShrink:0 }}>
      <div style={{ padding:'18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {!collapsed && <div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px' }}>Vonaxity</div>}
        <button onClick={()=>setCollapsed(!collapsed)} style={{ background:'rgba(255,255,255,0.08)', border:'none', color:'rgba(255,255,255,0.5)', borderRadius:7, width:28, height:28, cursor:'pointer', fontSize:12, display:'flex', alignItems:'center', justifyContent:'center' }}>{collapsed?'›':'‹'}</button>
      </div>
      {!collapsed && (
        <div style={{ padding:'14px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#93C5FD', flexShrink:0 }}>{nurse.initials}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{nurse.name}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'#6EE7B7', background:'rgba(16,185,129,0.12)', padding:'2px 8px', borderRadius:99, marginTop:3 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#34D399' }}/>Approved
              </div>
            </div>
          </div>
        </div>
      )}
      <nav style={{ padding:'10px 8px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:collapsed?'10px 0':'10px 12px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, justifyContent:collapsed?'center':'flex-start' }}>
            {item.icon}{!collapsed&&<span>{item.label}</span>}
          </button>
        ))}
        {!collapsed && (
          <div style={{ marginTop:8, paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.25)', background:'transparent', border:'none', cursor:'pointer', padding:'8px 12px' }}>Sign out</button>
          </div>
        )}
      </nav>
    </div>
}

function Dashboard({ setActive, setSelectedVisit }) {
  const today = MOCK_VISITS.filter(v => v.status !== 'COMPLETED');
  return (
    <div>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'18px 22px', marginBottom:28, display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>Good morning, {MOCK_NURSE.name.split(' ')[0]}</div>
          <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{today.length} visits today · {MOCK_NURSE.city}</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[["Today",today.length,C.primary],['Total',MOCK_NURSE.totalVisits,C.secondary],['Rating',MOCK_NURSE.rating,C.warning],['This month',`€${MOCK_NURSE.payRatePerVisit * today.length * 4}`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <DailyRouteCard visits={today.map(formatVisit)} onVisitSelect={(v)=>{ setSelectedVisit(MOCK_VISITS.find(vv=>vv.id===v.id)); setActive('map'); }} />
      <div style={{ marginTop:16, background:C.warningLight, border:`1px solid #FDE68A`, borderRadius:10, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span style={{ fontSize:13, color:'#92400E' }}>Non-emergency care only. Emergency: call <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter==='all'?MOCK_VISITS:MOCK_VISITS.filter(v=>filter==='upcoming'?v.status!=='COMPLETED':v.status==='COMPLETED');
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
        {filtered.map(v => (
          <VisitLocationCard key={v.id} visit={formatVisit(v)} compact={v.status==='COMPLETED'}
            onStatusChange={(id,status)=>console.log('Status:',id,status)}
            onComplete={(id)=>{ setSelectedVisit(MOCK_VISITS.find(v=>v.id===id)); setActive('complete'); }} />
        ))}
      </div>
    </div>
  );
}

function MapView({ selectedVisit, setActive, setSelectedVisit }) {
  const upcoming = MOCK_VISITS.filter(v=>v.status!=='COMPLETED');
  const [selected, setSelected] = useState(selectedVisit||upcoming[0]);
  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {upcoming.map(v => (
          <button key={v.id} onClick={()=>setSelected(v)} style={{ fontSize:13, fontWeight:600, padding:'8px 18px', borderRadius:10, border:'none', cursor:'pointer', background:selected?.id===v.id?C.primary:C.bgWhite, color:selected?.id===v.id?'#fff':C.textSecondary, border:selected?.id===v.id?'none':`1px solid ${C.border}` }}>
            {new Date(v.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})} · {v.relative?.name?.split(' ')[0]}
          </button>
        ))}
      </div>
      {selected && <VisitLocationCard visit={formatVisit(selected)} onStatusChange={(id,status)=>console.log(id,status)} onComplete={(id)=>{ setSelectedVisit(MOCK_VISITS.find(v=>v.id===id)); setActive('complete'); }} />}
    </div>
  );
}

function CompleteVisit({ visit, setActive }) {
  const v = visit || MOCK_VISITS[0];
  const [form, setForm] = useState({ bp:'', hr:'', glucose:'', temp:'', oxygen:'', notes:'' });
  const [submitted, setSubmitted] = useState(false);
  const inp = { width:'100%', padding:'10px 13px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ width:64, height:64, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:10 }}>Report submitted</h3>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Health report for <strong>{v.relative?.name}</strong> saved successfully.</p>
      <button onClick={()=>{ setSubmitted(false); setActive('visits'); }} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 28px', fontSize:14, fontWeight:600, cursor:'pointer' }}>Back to visits</button>
    </div>
  );

  return (
    <div style={{ maxWidth:560 }}>
      <div style={{ background:C.primaryLight, borderRadius:12, padding:'14px 18px', marginBottom:24, border:`1px solid rgba(37,99,235,0.15)` }}>
        <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>{v.relative?.name}</div>
        <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{v.serviceType} · {new Date(v.scheduledAt).toLocaleDateString()}</div>
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
      <button onClick={()=>setSubmitted(true)} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer' }}>Submit visit report</button>
    </div>
  );
}

function Earnings() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:24 }}>
        {[['Total earned',`€${MOCK_NURSE.totalEarnings}`,C.secondary],['Total visits',MOCK_NURSE.totalVisits,C.primary],['Rating',MOCK_NURSE.rating,C.warning],['Pay rate',`€${MOCK_NURSE.payRatePerVisit}/visit`,C.purple]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:22, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:6 }}>Payment history</div>
        <div style={{ fontSize:12, color:C.textTertiary, marginBottom:20 }}>Pay rate: <strong style={{ color:C.textPrimary }}>€{MOCK_NURSE.payRatePerVisit} per visit</strong> · Processed weekly</div>
        {[['Dec 10–14',4,80,'paid'],['Dec 3–7',3,60,'paid'],['Nov 26–30',4,80,'pending']].map(([period,visits,amount,status],i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:`1px solid ${C.borderSubtle}` }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:C.textPrimary }}>{period}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{visits} visits · €{MOCK_NURSE.payRatePerVisit}/visit</div>
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

// ── Nurse Profile Settings ────────────────────────────────────────────────────
function NurseProfile() {
  const [profile, setProfile] = useState({ name:MOCK_NURSE.name, email:MOCK_NURSE.email, phone:MOCK_NURSE.phone, city:MOCK_NURSE.city, bio:MOCK_NURSE.bio, licenseNumber:MOCK_NURSE.licenseNumber });
  const [availability, setAvailability] = useState([...MOCK_NURSE.availability]);
  const [specialties, setSpecialties] = useState([...MOCK_NURSE.specialties]);
  const [password, setPassword] = useState({ current:'', newPass:'', confirm:'' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [passStatus, setPassStatus] = useState(null);
  const [passError, setPassError] = useState('');

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
    if (!password.current || !password.newPass || !password.confirm) return setPassError('All fields required');
    if (password.newPass.length < 8) return setPassError('Password must be at least 8 characters');
    if (password.newPass !== password.confirm) return setPassError('Passwords do not match');
    setSavingPass(true);
    try {
      await api.updatePassword({ currentPassword:password.current, newPassword:password.newPass });
      setPassword({ current:'', newPass:'', confirm:'' });
      setPassStatus('success');
      setTimeout(()=>setPassStatus(null), 4000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password');
    } finally { setSavingPass(false); }
  };

  const SectionCard = ({ title, subtitle, children }) => (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth:620 }}>

      {/* Profile info */}
      <SectionCard title="Personal information" subtitle="Your nurse account details">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Full name">
            <input style={inp} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} />
          </Field>
          <Field label="Email address">
            <input style={{...inp,background:C.bgSubtle,color:C.textTertiary}} value={profile.email} disabled />
          </Field>
          <Field label="Phone number">
            <input style={inp} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} placeholder="+355 69 000 0000" />
          </Field>
          <Field label="City">
            <select style={{...inp}} value={profile.city} onChange={e=>setProfile({...profile,city:e.target.value})}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="License number">
          <input style={inp} value={profile.licenseNumber} onChange={e=>setProfile({...profile,licenseNumber:e.target.value})} placeholder="ALB-NURSE-XXXX-XXX" />
        </Field>
        <Field label="Professional bio">
          <textarea style={{...inp,minHeight:90,resize:'vertical'}} value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} placeholder="Describe your experience and specialties..." />
        </Field>
      </SectionCard>

      {/* Availability */}
      <SectionCard title="Availability" subtitle="Which days are you available for visits?">
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {DAYS.map(day => (
            <button key={day} onClick={()=>toggleDay(day)} style={{ fontSize:13, fontWeight:600, padding:'9px 16px', borderRadius:10, border:`1.5px solid ${availability.includes(day)?C.primary:C.border}`, background:availability.includes(day)?C.primaryLight:'transparent', color:availability.includes(day)?C.primary:C.textSecondary, cursor:'pointer', transition:'all 0.15s' }}>
              {day.slice(0,3)}
            </button>
          ))}
        </div>
        <div style={{ marginTop:12, fontSize:12, color:C.textTertiary }}>
          {availability.length === 0 ? 'No days selected' : `Available: ${availability.join(', ')}`}
        </div>
      </SectionCard>

      {/* Specialties */}
      <SectionCard title="Specialties" subtitle="What services can you perform?">
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {SPECIALTIES_LIST.map(s => (
            <button key={s} onClick={()=>toggleSpecialty(s)} style={{ fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:99, border:`1.5px solid ${specialties.includes(s)?C.secondary:C.border}`, background:specialties.includes(s)?C.secondaryLight:'transparent', color:specialties.includes(s)?C.secondary:C.textSecondary, cursor:'pointer', transition:'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Stats overview */}
      <SectionCard title="Profile stats" subtitle="Your performance on Vonaxity">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:12 }}>
          {[['Rating',MOCK_NURSE.rating,C.warning],['Total visits',MOCK_NURSE.totalVisits,C.primary],['Total earned',`€${MOCK_NURSE.totalEarnings}`,C.secondary],['Status','Approved',C.secondary]].map(([label,value,color]) => (
            <div key={label} style={{ background:C.bgSubtle, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:16, fontWeight:700, color }}>{value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Save button */}
      {profileStatus==='success' && (
        <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:C.secondary }}>Profile saved successfully!</span>
        </div>
      )}
      {profileStatus==='error' && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <span style={{ fontSize:14, color:C.error }}>Failed to save. Please try again.</span>
        </div>
      )}
      <button onClick={handleSave} disabled={saving} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:28, opacity:saving?0.7:1, boxShadow:'0 2px 8px rgba(37,99,235,0.2)' }}>
        {saving ? 'Saving...' : 'Save profile'}
      </button>

      {/* Security */}
      <SectionCard title="Security" subtitle="Change your account password">
        <Field label="Current password">
          <input style={inp} type="password" value={password.current} onChange={e=>setPassword({...password,current:e.target.value})} placeholder="••••••••" />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="New password">
            <input style={inp} type="password" value={password.newPass} onChange={e=>setPassword({...password,newPass:e.target.value})} placeholder="Min 8 characters" />
          </Field>
          <Field label="Confirm new password">
            <input style={inp} type="password" value={password.confirm} onChange={e=>setPassword({...password,confirm:e.target.value})} placeholder="Repeat password" />
          </Field>
        </div>
        {passError && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.error }}>{passError}</div>}
        {passStatus==='success' && <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.secondary, fontWeight:600 }}>Password updated!</div>}
        <button onClick={handleChangePassword} disabled={savingPass} style={{ background:C.bgSubtle, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:savingPass?0.7:1 }}>
          {savingPass ? 'Updating...' : 'Update password'}
        </button>
      </SectionCard>

    </div>
  );
}

// ── Main nurse page ────────────────────────────────────────────────────────────
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

  const titles = { dashboard:'Nurse Dashboard', visits:'My Visits', map:'Navigation', complete:'Complete Visit', earnings:'Earnings', profile:'My Profile' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar nurse={MOCK_NURSE} collapsed={collapsed} setCollapsed={setCollapsed} active={active} setActive={setActive} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }}/>On duty
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:720, width:'100%' }}>
          {active==='dashboard' && <Dashboard setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='visits' && <Visits setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='map' && <MapView selectedVisit={selectedVisit} setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active==='complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} />}
          {active==='earnings' && <Earnings />}
          {active==='profile' && <NurseProfile />}
        </main>
      </div>
    </div>
  );
}
