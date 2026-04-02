'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', primaryDark:'#1D4ED8', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6', dark:'#111827' };

const MOCK = {
  user: { name:'Arta Murati', email:'client@test.com', plan:'Standard', country:'UK' },
  relative: { name:'Fatmira Murati', city:'Tirana', address:'Rruga e Elbasanit 14', nurse:'Elona Berberi' },
  visits: [
    { id:1, date:'Dec 20, 2024', time:'10:00 AM', service:'Blood Pressure + Glucose', status:'upcoming', nurse:'Elona Berberi' },
    { id:2, date:'Nov 28, 2024', time:'10:00 AM', service:'Blood Pressure Check', status:'completed', nurse:'Elona Berberi', bp:'128/82', glucose:'5.4', notes:'Patient in good spirits. BP slightly elevated.' },
  ],
};

const NAV = [
  { id:'overview', label:'Overview', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { id:'visits', label:'My Visits', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:'subscription', label:'Subscription', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
  { id:'settings', label:'Settings', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

function Sidebar({ active, setActive, lang, onLogout }) {
  return (
    <div style={{ width:220, background:C.dark, display:'flex', flexDirection:'column', minHeight:'100vh', position:'sticky', top:0, flexShrink:0 }}>
      <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:18, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:20 }}>Vonaxity</div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'#1E3A5F', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#93C5FD' }}>
            {MOCK.user.name.split(' ').map(w=>w[0]).join('')}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{MOCK.user.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>Client</div>
          </div>
        </div>
      </div>
      <nav style={{ flex:1, padding:'12px 10px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:'none', background:active===item.id?'rgba(37,99,235,0.2)':'transparent', color:active===item.id?'#93C5FD':'rgba(255,255,255,0.45)', cursor:'pointer', fontSize:13, fontWeight:active===item.id?600:400, marginBottom:2, textAlign:'left', transition:'all 0.15s' }}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding:'12px 16px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onLogout} style={{ fontSize:12, color:'rgba(255,255,255,0.3)', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>{t(lang,'dashboard.signOut')}</button>
      </div>
    </div>
  );
}

function Overview({ lang }) {
  return (
    <div>
      <div style={{ background:C.primaryLight, borderRadius:14, border:`1px solid rgba(37,99,235,0.15)`, padding:'18px 22px', marginBottom:28, display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:600, color:C.primary }}>Next visit — Dec 20 at 10:00 AM</div>
          <div style={{ fontSize:13, color:'#3B82F6', marginTop:2 }}>Elona Berberi · Blood pressure + glucose · {MOCK.relative.name}</div>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14, marginBottom:28 }}>
        {[['Plan',MOCK.user.plan,C.primary],['Visits used','1 / 2',C.textPrimary],['Next visit','Dec 20',C.secondary],['Last BP','128/82',C.warning]].map(([label,value,color]) => (
          <div key={label} style={{ background:C.bgWhite, borderRadius:12, border:`1px solid ${C.border}`, padding:'16px 18px' }}>
            <div style={{ fontSize:11, color:C.textTertiary, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', marginBottom:8 }}>{label}</div>
            <div style={{ fontSize:20, fontWeight:700, color, letterSpacing:'-0.5px' }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:18 }}>Loved one details</div>
        {[['Name',MOCK.relative.name],['City',MOCK.relative.city],['Address',MOCK.relative.address],['Assigned nurse',MOCK.relative.nurse]].map(([k,v]) => (
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.borderSubtle}`, fontSize:14 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visits({ lang }) {
  return (
    <div>
      {MOCK.visits.map(v => (
        <div key={v.id} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:'20px 22px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{v.service}</div>
              <div style={{ fontSize:13, color:C.textTertiary }}>{v.date} at {v.time} · {v.nurse}</div>
            </div>
            <span style={{ fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:99, background:v.status==='completed'?C.secondaryLight:C.primaryLight, color:v.status==='completed'?C.secondary:C.primary, height:'fit-content' }}>
              {v.status==='completed'?'Completed':'Upcoming'}
            </span>
          </div>
          {v.status==='completed' && (
            <div style={{ background:C.bg, borderRadius:10, padding:'12px 16px', fontSize:13 }}>
              <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:6 }}>
                {v.bp&&<span style={{ color:C.textSecondary }}><strong style={{ color:C.textPrimary }}>BP</strong> {v.bp}</span>}
                {v.glucose&&<span style={{ color:C.textSecondary }}><strong style={{ color:C.textPrimary }}>Glucose</strong> {v.glucose} mmol/L</span>}
              </div>
              <div style={{ color:C.textSecondary }}>{v.notes}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const logout = () => { document.cookie='vonaxity-token=;path=/;max-age=0'; document.cookie='vonaxity-role=;path=/;max-age=0'; router.push(`/${lang}/login`); };
  const titles = { overview:'Dashboard', visits:'My Visits', subscription:'Subscription', settings:'Settings' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Sidebar active={active} setActive={setActive} lang={lang} onLogout={logout} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'0 28px', height:60, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:C.bgWhite, flexShrink:0 }}>
          <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary }}>{titles[active]}</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }} />
            {MOCK.user.plan} Plan
          </div>
        </div>
        <main style={{ flex:1, padding:28, overflowY:'auto', maxWidth:760, width:'100%' }}>
          {active==='overview'&&<Overview lang={lang} />}
          {active==='visits'&&<Visits lang={lang} />}
          {active==='subscription'&&(
            <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28 }}>
              <div style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>Standard Plan</div>
              <div style={{ fontSize:15, color:C.primary, fontWeight:500, marginBottom:24 }}>€50/month · 2 visits</div>
              <button style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px 24px', fontSize:14, fontWeight:600, cursor:'pointer' }}>Upgrade to Premium</button>
            </div>
          )}
          {active==='settings'&&<div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:28, fontSize:14, color:C.textTertiary }}>Account settings coming in Phase 3.</div>}
        </main>
      </div>
    </div>
  );
}
