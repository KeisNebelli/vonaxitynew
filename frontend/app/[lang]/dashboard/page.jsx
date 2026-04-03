'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

// ── Mock data for demo ─────────────────────────────────────────────────────────
const MOCK = {
  user: { name:'Arta Murati', email:'client@test.com', phone:'+44 7700 000000', country:'United Kingdom', city:'London', plan:'Standard', status:'TRIAL' },
  relative: { id:'rel1', name:'Fatmira Murati', city:'Tirana', address:'Rruga e Elbasanit 14', phone:'+355690001111', age:74, healthNotes:'Diabetes Type 2. Takes Metformin daily.' },
  subscription: { plan:'standard', status:'TRIAL', visitsPerMonth:2, visitsUsed:1, trialEndsAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
  visits: [
    { id:'v1', serviceType:'Blood Pressure + Glucose Check', scheduledAt:'2024-12-20T10:00:00Z', status:'PENDING', nurse:{ user:{ name:'Elona Berberi' } }, relative:{ name:'Fatmira Murati' }, bpSystolic:null, bpDiastolic:null, glucose:null },
    { id:'v2', serviceType:'Blood Pressure Check', scheduledAt:'2024-11-28T10:00:00Z', status:'COMPLETED', nurse:{ user:{ name:'Elona Berberi' } }, relative:{ name:'Fatmira Murati' }, bpSystolic:128, bpDiastolic:82, glucose:5.4, nurseNotes:'Patient in good spirits. BP slightly elevated, advised to reduce salt.' },
  ],
};

const NAV = [
  { id:'overview', label:'Overview', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'visits', label:'My Visits', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'subscription', label:'Subscription', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'settings', label:'Settings', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

function Sidebar({ user, active, setActive, lang, onLogout }) {
  const initials = user?.name ? user.name.split(' ').map(w=>w[0]).join('') : '?';
  return (
    <div style={{ width:220, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, flexShrink:0 }}>
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:20 }}>Vonaxity</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#93C5FD' }}>{initials}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{user?.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Client</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'12px 10px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, textAlign:'left' }}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Sign out</button>
      </div>
    </div>
  );
}

function Overview({ user, visits, lang }) {
  const upcoming = visits.filter(v => !['COMPLETED','CANCELLED','NO_SHOW'].includes(v.status));
  const completed = visits.filter(v => v.status === 'COMPLETED');
  const nextVisit = upcoming[0];
  const lastVisit = completed[0];

  return (
    <div>
      {nextVisit && (
        <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'18px 22px', marginBottom:28, display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>Next visit — {new Date(nextVisit.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short'})} at {new Date(nextVisit.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>{nextVisit.nurse?.user?.name} · {nextVisit.serviceType} · {nextVisit.relative?.name}</div>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
        {[
          ['Plan', MOCK.subscription.plan.charAt(0).toUpperCase()+MOCK.subscription.plan.slice(1), C.primary],
          ['Visits used', `${MOCK.subscription.visitsUsed} / ${MOCK.subscription.visitsPerMonth}`, C.textPrimary],
          ['Completed', completed.length, C.secondary],
          ['Last BP', lastVisit?.bpSystolic ? `${lastVisit.bpSystolic}/${lastVisit.bpDiastolic}` : 'N/A', C.warning],
        ].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, color:C.textTertiary, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:20, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:18 }}>Loved one details</div>
        {[['Name',MOCK.relative.name],['City',MOCK.relative.city],['Address',MOCK.relative.address],['Nurse',nextVisit?.nurse?.user?.name||'Being assigned']].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:14 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visits({ visits }) {
  return (
    <div>
      {visits.map(v => (
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{v.serviceType}</div>
              <div style={{ fontSize:13, color:C.textTertiary }}>{new Date(v.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {v.nurse?.user?.name}</div>
            </div>
            <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:99, background:v.status==='COMPLETED'?C.secondaryLight:C.primaryLight, color:v.status==='COMPLETED'?C.secondary:C.primary, height:'fit-content' }}>{v.status}</span>
          </div>
          {v.status==='COMPLETED' && (
            <div style={{ background:C.bg, borderRadius:10, padding:'12px 16px', fontSize:13 }}>
              <div style={{ display:'flex', gap:20, marginBottom:v.nurseNotes?6:0 }}>
                {v.bpSystolic && <span><strong style={{ color:C.textPrimary }}>BP</strong> <span style={{ color:C.textSecondary }}>{v.bpSystolic}/{v.bpDiastolic}</span></span>}
                {v.glucose && <span><strong style={{ color:C.textPrimary }}>Glucose</strong> <span style={{ color:C.textSecondary }}>{v.glucose} mmol/L</span></span>}
              </div>
              {v.nurseNotes && <div style={{ color:C.textSecondary }}>{v.nurseNotes}</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function Settings({ user, relative, lang }) {
  const [profile, setProfile] = useState({ name:user.name, email:user.email, phone:user.phone||'', country:user.country||'', city:user.city||'' });
  const [rel, setRel] = useState({ name:relative?.name||'', city:relative?.city||'', address:relative?.address||'', phone:relative?.phone||'', age:relative?.age||'', healthNotes:relative?.healthNotes||'' });
  const [password, setPassword] = useState({ current:'', newPass:'', confirm:'' });
  const [contact, setContact] = useState({ preferredContact:'email', emergencyName:'', emergencyPhone:'' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null); // 'success' | 'error' | null
  const [passStatus, setPassStatus] = useState(null);
  const [passError, setPassError] = useState('');

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const COUNTRIES = ['United Kingdom','Italy','Germany','Greece','USA','Albania','Other'];
  const CITIES_AL = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];

  const handleSaveProfile = async () => {
    setSaving(true); setProfileStatus(null);
    try {
      await api.updateProfile({ name:profile.name, phone:profile.phone, country:profile.country, city:profile.city });
      await api.updateRelative(relative?.id||'', { name:relative.name, city:relative.city, address:relative.address, phone:relative.phone, age:relative.age||null, healthNotes:relative.healthNotes });
      setProfileStatus('success');
      setTimeout(() => setProfileStatus(null), 4000);
    } catch (err) {
      setProfileStatus('error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPassError('');
    if (!password.current || !password.newPass || !password.confirm) return setPassError('All fields required');
    if (password.newPass.length < 8) return setPassError('New password must be at least 8 characters');
    if (password.newPass !== password.confirm) return setPassError('Passwords do not match');
    setSavingPass(true); setPassStatus(null);
    try {
      await api.updatePassword({ currentPassword:password.current, newPassword:password.newPass });
      setPassword({ current:'', newPass:'', confirm:'' });
      setPassStatus('success');
      setTimeout(() => setPassStatus(null), 4000);
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
      <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6, letterSpacing:'0.2px' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth:620 }}>

      {/* Profile info */}
      <SectionCard title="Profile information" subtitle="Your personal account details">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Full name">
            <input style={inp} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="Your full name" />
          </Field>
          <Field label="Email address">
            <input style={{...inp,background:C.bgSubtle,color:C.textTertiary}} value={profile.email} disabled placeholder="Email" />
          </Field>
          <Field label="Phone number">
            <input style={inp} value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} placeholder="+44 7700 000000" />
          </Field>
          <Field label="Country you live in">
            <select style={{...inp}} value={profile.country} onChange={e=>setProfile({...profile,country:e.target.value})}>
              <option value="">Select country</option>
              {COUNTRIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      {/* Loved one details */}
      <SectionCard title="Loved one details" subtitle="The person receiving care in Albania">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Their full name">
            <input style={inp} value={rel.name} onChange={e=>setRel({...rel,name:e.target.value})} />
          </Field>
          <Field label="Their age">
            <input style={inp} type="number" value={rel.age} onChange={e=>setRel({...rel,age:e.target.value})} placeholder="e.g. 74" />
          </Field>
          <Field label="City in Albania">
            <select style={{...inp}} value={rel.city} onChange={e=>setRel({...rel,city:e.target.value})}>
              <option value="">Select city</option>
              {CITIES_AL.map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Their phone">
            <input style={inp} value={rel.phone} onChange={e=>setRel({...rel,phone:e.target.value})} placeholder="+355 69 000 0000" />
          </Field>
        </div>
        <Field label="Home address">
          <input style={inp} value={rel.address} onChange={e=>setRel({...rel,address:e.target.value})} placeholder="Street address in Albania" />
        </Field>
        <Field label="Health notes (optional)">
          <textarea style={{...inp,minHeight:80,resize:'vertical'}} value={rel.healthNotes} onChange={e=>setRel({...rel,healthNotes:e.target.value})} placeholder="e.g. Diabetes Type 2, takes Metformin daily..." />
        </Field>
      </SectionCard>

      {/* Contact preferences */}
      <SectionCard title="Contact preferences" subtitle="How should we reach you about visits?">
        <Field label="Preferred contact method">
          <div style={{ display:'flex', gap:10 }}>
            {['email','phone','whatsapp'].map(method => (
              <button key={method} onClick={()=>setContact({...contact,preferredContact:method})} style={{ flex:1, padding:'10px', borderRadius:9, border:`1.5px solid ${contact.preferredContact===method?C.primary:C.border}`, background:contact.preferredContact===method?C.primaryLight:'transparent', color:contact.preferredContact===method?C.primary:C.textSecondary, fontSize:13, fontWeight:600, cursor:'pointer', textTransform:'capitalize' }}>
                {method}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label="Emergency contact name">
            <input style={inp} value={contact.emergencyName} onChange={e=>setContact({...contact,emergencyName:e.target.value})} placeholder="Contact name" />
          </Field>
          <Field label="Emergency contact phone">
            <input style={inp} value={contact.emergencyPhone} onChange={e=>setContact({...contact,emergencyPhone:e.target.value})} placeholder="+44 7700 000000" />
          </Field>
        </div>
      </SectionCard>

      {/* Save button */}
      {profileStatus==='success' && (
        <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:C.secondary }}>Changes saved successfully!</span>
        </div>
      )}
      {profileStatus==='error' && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <span style={{ fontSize:14, color:C.error }}>Failed to save. Please try again.</span>
        </div>
      )}
      <button onClick={handleSaveProfile} disabled={saving} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:28, opacity:saving?0.7:1, boxShadow:'0 2px 8px rgba(37,99,235,0.2)' }}>
        {saving ? 'Saving changes...' : 'Save changes'}
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
        {passStatus==='success' && <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.secondary, fontWeight:600 }}>Password updated successfully!</div>}
        <button onClick={handleChangePassword} disabled={savingPass} style={{ background:C.bgSubtle, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:savingPass?0.7:1 }}>
          {savingPass ? 'Updating...' : 'Update password'}
        </button>
      </SectionCard>

      {/* Subscription overview */}
      <SectionCard title="Subscription overview" subtitle="Your current plan and billing status">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:16 }}>
          {[
            ['Plan', MOCK.subscription.plan.charAt(0).toUpperCase()+MOCK.subscription.plan.slice(1), C.primary],
            ['Status', MOCK.subscription.status, MOCK.subscription.status==='ACTIVE'?C.secondary:C.warning],
            ['Visits/month', MOCK.subscription.visitsPerMonth, C.textPrimary],
            ['Used this month', MOCK.subscription.visitsUsed, C.textPrimary],
          ].map(([label,value,color]) => (
            <div key={label} style={{ background:C.bgSubtle, borderRadius:10, padding:'12px 14px' }}>
              <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
              <div style={{ fontSize:16, fontWeight:700, color }}>{value}</div>
            </div>
          ))}
        </div>
        {MOCK.subscription.trialEndsAt && (
          <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:9, padding:'10px 14px', fontSize:13, color:'#92400E' }}>
            Trial ends on <strong>{new Date(MOCK.subscription.trialEndsAt).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</strong>. Add payment method to continue.
          </div>
        )}
      </SectionCard>

      {/* Danger zone */}
      <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid #FECACA`, padding:'24px', marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.error, marginBottom:6 }}>Danger zone</div>
        <div style={{ fontSize:13, color:C.textSecondary, marginBottom:16 }}>These actions cannot be undone. Please be certain.</div>
        <button style={{ background:C.errorLight, color:C.error, border:`1.5px solid #FECACA`, borderRadius:9, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Cancel subscription
        </button>
      </div>

    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [realUser, setRealUser] = useState(null);
  const [realVisits, setRealVisits] = useState([]);
  const [realRelatives, setRealRelatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [meData, visitsData] = await Promise.all([api.me(), api.getVisits()]);
        if (meData?.user) setRealUser(meData.user);
        if (visitsData?.visits) setRealVisits(visitsData.visits);
        // Use relatives from /me response
        if (meData?.user?.relatives?.length > 0) {
          setRealRelatives(meData.user.relatives);
        } else {
          const relMap = {};
          (visitsData?.visits || []).forEach(v => { if (v.relative) relMap[v.relative.id] = v.relative; });
          setRealRelatives(Object.values(relMap));
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  // Use real data if available, fall back to mock for display
  const user = realUser ? {
    name: realUser.name,
    email: realUser.email,
    phone: realUser.phone || '',
    country: realUser.country || '',
    city: realUser.city || '',
    plan: realUser.subscription?.plan || 'standard',
    status: realUser.status,
  } : MOCK.user;

  const visits = realVisits.length > 0 ? realVisits : MOCK.visits;
  const subscription = realUser?.subscription || MOCK.subscription;
  const relative = realRelatives[0] || MOCK.relative;

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { overview:'Dashboard', visits:'My Visits', subscription:'Subscription', settings:'Account Settings' };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ fontSize:14, color:C.textTertiary }}>Loading your dashboard...</div>
    </div>
  );

  const planName = (subscription?.plan || 'standard').charAt(0).toUpperCase() + (subscription?.plan || 'standard').slice(1);

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar user={user} active={active} setActive={setActive} lang={lang} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }} />
            {planName} Plan
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:760, width:'100%' }}>
          {active==='overview' && <Overview user={user} visits={visits} lang={lang} />}
          {active==='visits' && <Visits visits={visits} />}
          {active==='subscription' && (
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28 }}>
              <div style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>{planName} Plan</div>
              <div style={{ fontSize:15, color:C.primary, fontWeight:500, marginBottom:8 }}>
                {subscription?.visitsPerMonth || 2} visit{subscription?.visitsPerMonth !== 1 ? 's' : ''}/month
              </div>
              <div style={{ fontSize:13, color:C.textTertiary, marginBottom:24 }}>
                Status: <strong style={{ color:subscription?.status==='ACTIVE'?C.secondary:C.warning }}>{subscription?.status || 'TRIAL'}</strong>
                {subscription?.trialEndsAt && ` · Trial ends ${new Date(subscription.trialEndsAt).toLocaleDateString()}`}
              </div>
              <button style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}>Upgrade to Premium</button>
            </div>
          )}
          {active==='settings' && <Settings user={user} relative={relative} lang={lang} />}
        </main>
      </div>
    </div>
  );
}
