'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';
import Settings from './settings';

const C = { primary:'#2563EB',primaryLight:'#EFF6FF',primaryDark:'#1D4ED8',secondary:'#059669',secondaryLight:'#ECFDF5',warning:'#D97706',warningLight:'#FFFBEB',error:'#DC2626',errorLight:'#FEF2F2',purple:'#7C3AED',purpleLight:'#F5F3FF',bg:'#F8FAFC',bgWhite:'#FFFFFF',bgSubtle:'#F1F5F9',textPrimary:'#0F172A',textSecondary:'#475569',textTertiary:'#94A3B8',border:'#E2E8F0',borderSubtle:'#F1F5F9',sidebarBg:'#0F172A' };
const F = "'DM Sans','Inter',system-ui,sans-serif";
const SSM = '0 1px 3px rgba(15,23,42,0.06)';
const SMD = '0 4px 12px rgba(15,23,42,0.08)';

const MOCK = {
  user:{ name:'Keis Nebelli', email:'client@test.com', phone:'+44 7700 000000', country:'United Kingdom', subscription:{ plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:1 } },
  relative:{ id:'rel1', name:'Fatmira Murati', city:'Tirana', address:'Rruga e Elbasanit 14', phone:'+355690001111', age:74 },
  visits:[
    { id:'v1', serviceType:'Blood Pressure + Glucose Check', scheduledAt:'2024-12-20T10:00:00Z', status:'PENDING', nurse:{ user:{ name:'Elona Berberi' } } },
    { id:'v2', serviceType:'Blood Pressure Check', scheduledAt:'2024-11-28T10:00:00Z', status:'COMPLETED', nurse:{ user:{ name:'Elona Berberi' } }, bpSystolic:128, bpDiastolic:82, glucose:5.4, nurseNotes:'Patient in good spirits.' },
  ],
};

const SERVICES = ['Blood Pressure Check','Glucose Monitoring','Vitals Check','Blood Work Collection','Welfare Check','Post-surgical Care'];

const makeNAV = (tr) => [
  { id:'overview', label:tr('dashboard.overview'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'book', label:'Book Visit', icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { id:'visits', label:tr('dashboard.myVisits'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'subscription', label:tr('dashboard.subscription'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'settings', label:tr('dashboard.settings'), icon:<svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

function Badge({ s }) {
  const m = { COMPLETED:[C.secondaryLight,'#059669'], PENDING:[C.primaryLight,C.primary], ACCEPTED:[C.secondaryLight,C.secondary], CANCELLED:[C.bgSubtle,C.textTertiary], UNASSIGNED:[C.warningLight,C.warning], REJECTED:[C.errorLight,C.error] };
  const [bg,col] = m[s]||[C.bgSubtle,C.textTertiary];
  return <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:bg, color:col, textTransform:'uppercase', whiteSpace:'nowrap' }}>{s}</span>;
}

function Overview({ user, visits, relative, lang, onBook }) {
  const tr = (key) => t(lang, key);
  const upcoming = visits.filter(v=>!['COMPLETED','CANCELLED'].includes(v.status));
  const completed = visits.filter(v=>v.status==='COMPLETED');
  const next = upcoming[0], last = completed[0];
  const sub = user?.subscription || MOCK.user.subscription;
  const planLabel = (sub?.plan||'standard').charAt(0).toUpperCase()+(sub?.plan||'standard').slice(1);
  return (
    <div>
      {next ? (
        <div style={{ background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, borderRadius:16, padding:'20px 22px', marginBottom:20, color:'#fff', boxShadow:SMD, display:'flex', gap:14, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ width:46,height:46,borderRadius:13,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div style={{ flex:1, minWidth:160 }}>
            <div style={{ fontSize:10, fontWeight:700, opacity:.65, letterSpacing:'1px', textTransform:'uppercase', marginBottom:4 }}>Next Visit</div>
            <div style={{ fontSize:16, fontWeight:700, marginBottom:3 }}>{new Date(next.scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})} at {new Date(next.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{ fontSize:12, opacity:.8 }}>{next.nurse?.user?.name||'Nurse TBC'} · {next.serviceType}</div>
          </div>
          <Badge s={next.status} />
        </div>
      ) : (
        <div style={{ background:C.primaryLight, border:`1px solid rgba(37,99,235,0.15)`, borderRadius:16, padding:'20px 22px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.primary, marginBottom:4 }}>No upcoming visits</div>
            <div style={{ fontSize:13, color:C.textSecondary }}>Book a nurse visit for your loved one in Albania.</div>
          </div>
          <button onClick={onBook} style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'11px 20px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:F }}>Book a visit →</button>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:20 }}>
        {[['Plan',planLabel,C.primary,''],[tr('dashboard.visitsUsed'),`${sub?.visitsUsed||0}/${sub?.visitsPerMonth||2}`,C.textPrimary,'this month'],[tr('dashboard.completed'),completed.length,C.secondary,'total'],[tr('dashboard.lastBP'),last?.bpSystolic?`${last.bpSystolic}/${last.bpDiastolic}`:'—',last?.bpSystolic?C.warning:C.textTertiary,last?.bpSystolic?'mmHg':'']].map(([label,val,color,sub2])=>(
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
            <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>Loved one receiving care</div>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99, background:C.secondaryLight, color:C.secondary }}>Active</span>
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

function BookVisit({ relative, subscription, onSuccess, onCancel }) {
  const [form, setForm] = useState({ serviceType: SERVICES[0], scheduledAt: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleSubmit = async () => {
    if (!form.scheduledAt) return setError('Please select a date and time.');
    if (!relative) return setError('You need to add a loved one first in Settings.');
    setLoading(true); setError('');
    try {
      await api.createVisit({ relativeId: relative.id, serviceType: form.serviceType, scheduledAt: form.scheduledAt, notes: form.notes });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to book visit. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:28, boxShadow:SSM, maxWidth:520 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px' }}>Book a nurse visit</div>
          <div style={{ fontSize:13, color:C.textSecondary, marginTop:3 }}>
            {relative ? `For ${relative.name} in ${relative.city}` : 'Add a loved one in Settings first'}
          </div>
          {subscription && (
            <div style={{ fontSize:12, fontWeight:600, marginTop:4, color: subscription.visitsUsed >= subscription.visitsPerMonth ? '#DC2626' : '#059669' }}>
              {subscription.visitsPerMonth - subscription.visitsUsed} visit{subscription.visitsPerMonth - subscription.visitsUsed !== 1 ? 's' : ''} remaining this month
            </div>
          )}
        </div>
        <button onClick={onCancel} style={{ background:C.bgSubtle, border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.textSecondary, fontSize:16 }}>✕</button>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>Service type</label>
        <select style={inp} value={form.serviceType} onChange={e=>setForm({...form, serviceType:e.target.value})}>
          {SERVICES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>Date & time</label>
        <input type="datetime-local" style={inp} value={form.scheduledAt} onChange={e=>setForm({...form, scheduledAt:e.target.value})} min={new Date().toISOString().slice(0,16)} />
      </div>

      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.3px' }}>Notes for the nurse (optional)</label>
        <textarea style={{ ...inp, height:90, resize:'vertical' }} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Any specific health concerns, medication info, access instructions..." />
      </div>

      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}

      <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:9, padding:'10px 14px', fontSize:12, color:'#92400E', marginBottom:20 }}>
        After booking, approved nurses in {relative?.city||'your city'} will apply. You choose who gets the job.
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, background:C.bgSubtle, color:C.textSecondary, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:F }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading||!relative||(subscription&&subscription.visitsUsed>=subscription.visitsPerMonth)} style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:14, fontWeight:700, cursor:(loading||!relative||(subscription&&subscription.visitsUsed>=subscription.visitsPerMonth))?'not-allowed':'pointer', opacity:(loading||!relative||(subscription&&subscription.visitsUsed>=subscription.visitsPerMonth))?0.7:1, fontFamily:F }}>
          {loading ? 'Booking...' : 'Book visit →'}
        </button>
      </div>
    </div>
  );
}

function Applicants({ visitId, visitInfo, onBack, onSelect }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getApplicants(visitId)
      .then(d => setApplicants(d.applications||[]))
      .catch(() => setError('Failed to load applicants'))
      .finally(() => setLoading(false));
  }, [visitId]);

  const handleSelect = async (nurseId) => {
    setSelecting(nurseId);
    try {
      await api.selectNurse(visitId, nurseId);
      onSelect();
    } catch (err) {
      setError(err.message || 'Failed to select nurse');
      setSelecting(null);
    }
  };

  return (
    <div>
      <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, background:'transparent', border:'none', cursor:'pointer', marginBottom:20, padding:0, fontWeight:500, fontFamily:F }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to visits
      </button>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'16px 20px', marginBottom:20, boxShadow:SSM }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{visitInfo?.serviceType}</div>
        <div style={{ fontSize:12, color:C.textTertiary, marginTop:3 }}>{visitInfo?.scheduledAt ? new Date(visitInfo.scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : ''}</div>
      </div>

      {loading && <div style={{ textAlign:'center', padding:40, color:C.textTertiary, fontSize:14 }}>Loading applicants...</div>}
      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
      {!loading && applicants.length === 0 && (
        <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'40px 24px', textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
          <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>No applicants yet</div>
          <div style={{ fontSize:13, color:C.textSecondary }}>Nurses in the area will apply soon. Check back in a few hours.</div>
        </div>
      )}
      {applicants.map(a => (
        <div key={a.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px', marginBottom:12, boxShadow:SSM }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:16 }}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:48, height:48, borderRadius:13, background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff', flexShrink:0 }}>
                {(a.nurse.name||'N').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{a.nurse.name}</div>
                <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{a.nurse.city} · License: {a.nurse.licenseNumber||'Verified'}</div>
              </div>
            </div>
            <Badge s={a.status} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
            {[['Rating', a.nurse.rating>0?`${a.nurse.rating}/5`:'New',''],['Visits', a.nurse.totalVisits||0,'completed'],['Experience', a.nurse.experience||'—','']].map(([k,v,sub])=>(
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
              {selecting===a.nurse.id ? 'Selecting...' : `Select ${a.nurse.name} →`}
            </button>
          )}
          {a.status === 'ACCEPTED' && <div style={{ background:C.secondaryLight, borderRadius:9, padding:'10px 14px', fontSize:13, color:C.secondary, fontWeight:600, textAlign:'center' }}>✓ You selected this nurse</div>}
        </div>
      ))}
    </div>
  );
}

function Visits({ visits, lang, onViewApplicants }) {
  const tr = (key) => t(lang, key);
  if (!visits.length) return (
    <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'48px 24px', textAlign:'center', color:C.textTertiary }}>
      {tr('dashboard.noVisits')}
    </div>
  );
  return (
    <div>
      {visits.map(v=>(
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'18px 20px', marginBottom:12, boxShadow:SSM }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12, marginBottom:v.bpSystolic||v.status==='UNASSIGNED'?14:0 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{v.serviceType}</div>
              <div style={{ fontSize:12, color:C.textTertiary }}>{new Date(v.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {v.nurse?.user?.name||tr('visits.nurseTBC')}</div>
            </div>
            <Badge s={v.status}/>
          </div>
          {v.bpSystolic && (
            <div style={{ background:C.bgSubtle, borderRadius:10, padding:'12px 16px', display:'flex', gap:20, flexWrap:'wrap', marginBottom:v.status==='UNASSIGNED'?12:0 }}>
              <div><div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>Blood Pressure</div><div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{v.bpSystolic}/{v.bpDiastolic} <span style={{ fontSize:10, color:C.textTertiary }}>mmHg</span></div></div>
              {v.glucose && <div><div style={{ fontSize:9, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:3 }}>Glucose</div><div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{v.glucose} <span style={{ fontSize:10, color:C.textTertiary }}>mmol/L</span></div></div>}
              {v.nurseNotes && <div style={{ width:'100%', borderTop:`1px solid ${C.border}`, paddingTop:8, marginTop:4, fontSize:12, color:C.textSecondary, fontStyle:'italic' }}>"{v.nurseNotes}"</div>}
            </div>
          )}
          {v.status === 'UNASSIGNED' && (
            <button onClick={()=>onViewApplicants(v)} style={{ width:'100%', background:C.primaryLight, color:C.primary, border:`1px solid rgba(37,99,235,0.2)`, borderRadius:9, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, marginTop:4 }}>
              View applicants →
            </button>
          )}
        </div>
      ))}
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

  const TITLES = { overview:tr('dashboard.title'), book:'Book a Visit', visits:tr('dashboard.myVisits'), subscription:tr('dashboard.subscription'), settings:tr('dashboard.settings') };

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
  const relativeDisplay = r || MOCK.relative;
  const plan = (userData.subscription?.plan||'standard').charAt(0).toUpperCase()+(userData.subscription?.plan||'standard').slice(1);
  const isTrial = userData.subscription?.status === 'TRIAL';
  const initials = (userData.name||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const handleBookSuccess = async () => {
    const visitsData = await api.getVisits().catch(()=>({ visits:[] }));
    setVisits(visitsData?.visits || []);
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
          <div style={{ padding:'22px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:17,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',marginBottom:14 }}>Vonaxity</div>
            <div style={{ display:'flex',alignItems:'center',gap:9 }}>
              <div style={{ width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0 }}>{initials}</div>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:'#fff' }}>{userData.name}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,0.35)' }}>Client · {plan}</div>
              </div>
            </div>
          </div>
          <nav style={{ flex:1,padding:'10px',overflowY:'auto' }}>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>{ setActive(item.id); setViewingApplicants(null); }}
                style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',background:active===item.id?'rgba(37,99,235,0.22)':'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:13,fontWeight:active===item.id?700:500,marginBottom:2,textAlign:'left',fontFamily:F }}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={logout} style={{ fontSize:12,color:'rgba(255,255,255,0.3)',background:'transparent',border:'none',cursor:'pointer',fontFamily:F,padding:0 }}>{tr('dashboard.signOut')}</button>
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
              <button key={item.id} onClick={()=>{ setActive(item.id); setSidebarOpen(false); setViewingApplicants(null); }} style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 14px',borderRadius:10,border:'none',background:active===item.id?'rgba(37,99,235,0.22)':'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:14,fontWeight:active===item.id?700:500,marginBottom:2,textAlign:'left',fontFamily:F }}>
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
              <div style={{ fontSize:16,fontWeight:700,color:C.textPrimary }}>{viewingApplicants ? 'Nurse Applicants' : TITLES[active]}</div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
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
              />
            ) : (
              <>
                {active==='overview' && <Overview user={userData} visits={visits} relative={relativeDisplay} lang={lang} onBook={()=>setActive('book')}/>}
                {active==='book' && <BookVisit relative={relative} subscription={userData?.subscription} onSuccess={handleBookSuccess} onCancel={()=>setActive('overview')} />}
                {active==='visits' && <Visits visits={visits} lang={lang} onViewApplicants={(v)=>setViewingApplicants(v)} />}
                {active==='subscription' && (
                  <div style={{ background:C.bgWhite,borderRadius:16,border:`1px solid ${C.border}`,padding:28,boxShadow:SSM }}>
                    <div style={{ fontSize:24,fontWeight:800,color:C.textPrimary,marginBottom:6 }}>{plan} Plan</div>
                    <div style={{ fontSize:15,color:C.primary,fontWeight:600,marginBottom:4 }}>{userData.subscription?.visitsPerMonth||2} nurse visits per month</div>
                    <div style={{ fontSize:13,color:C.textSecondary,marginBottom:28 }}>Status: <span style={{ fontWeight:700,color:isTrial?C.purple:C.secondary }}>{userData.subscription?.status||'TRIAL'}</span></div>
                    <button style={{ background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,color:'#fff',border:'none',borderRadius:11,padding:'13px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:F }}>Upgrade to Premium →</button>
                  </div>
                )}
                {active==='settings' && <Settings key="settings-page" initialUser={userData} initialRelative={relative} lang={lang}/>}
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
