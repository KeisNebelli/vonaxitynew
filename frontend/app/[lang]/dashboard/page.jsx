'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Settings from './settings';

const C = {
  primary:'#2563EB',primaryLight:'#EFF6FF',primaryDark:'#1D4ED8',
  secondary:'#059669',secondaryLight:'#ECFDF5',
  warning:'#D97706',warningLight:'#FFFBEB',
  error:'#DC2626',errorLight:'#FEF2F2',
  purple:'#7C3AED',purpleLight:'#F5F3FF',
  bg:'#F8FAFC',bgWhite:'#FFFFFF',bgSubtle:'#F1F5F9',
  textPrimary:'#0F172A',textSecondary:'#475569',textTertiary:'#94A3B8',
  border:'#E2E8F0',borderSubtle:'#F1F5F9',sidebarBg:'#0F172A',
};
const FONT="'DM Sans','Inter',system-ui,sans-serif";
const S_SM='0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04)';
const S_MD='0 4px 12px rgba(15,23,42,0.08),0 2px 4px rgba(15,23,42,0.04)';

const MOCK={
  user:{name:'Keis Nebelli',email:'client@test.com',phone:'+44 7700 000000',country:'United Kingdom',subscription:{plan:'standard',status:'TRIAL',visitsPerMonth:2,visitsUsed:1}},
  relative:{id:'rel1',name:'Fatmira Murati',city:'Tirana',address:'Rruga e Elbasanit 14',phone:'+355690001111',age:74,healthNotes:'Diabetes Type 2.'},
  visits:[
    {id:'v1',serviceType:'Blood Pressure + Glucose Check',scheduledAt:'2024-12-20T10:00:00Z',status:'PENDING',nurse:{user:{name:'Elona Berberi'}},relative:{name:'Fatmira Murati'}},
    {id:'v2',serviceType:'Blood Pressure Check',scheduledAt:'2024-11-28T10:00:00Z',status:'COMPLETED',nurse:{user:{name:'Elona Berberi'}},relative:{name:'Fatmira Murati'},bpSystolic:128,bpDiastolic:82,glucose:5.4,nurseNotes:'Patient in good spirits.'},
  ],
};

const NAV=[
  {id:'overview',label:'Overview',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>},
  {id:'visits',label:'My Visits',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
  {id:'subscription',label:'Subscription',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>},
  {id:'settings',label:'Settings',icon:<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>},
];

function Badge({status}){
  const m={COMPLETED:[C.secondaryLight,'#059669'],PENDING:[C.primaryLight,C.primary],CANCELLED:[C.bgSubtle,C.textTertiary],UNASSIGNED:[C.warningLight,C.warning]};
  const [bg,color]=m[status]||[C.bgSubtle,C.textTertiary];
  return <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:99,background:bg,color,letterSpacing:'0.3px',textTransform:'uppercase'}}>{status}</span>;
}

function Stat({label,value,color,sub}){
  return(
    <div style={{background:C.bgWhite,borderRadius:14,border:`1px solid ${C.border}`,padding:'20px 22px',boxShadow:S_SM}}>
      <div style={{fontSize:11,fontWeight:700,color:C.textTertiary,letterSpacing:'0.8px',textTransform:'uppercase',marginBottom:10}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color:color||C.textPrimary,letterSpacing:'-0.5px',lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:C.textTertiary,marginTop:6}}>{sub}</div>}
    </div>
  );
}

function Overview({user,visits,relative}){
  const upcoming=visits.filter(v=>!['COMPLETED','CANCELLED'].includes(v.status));
  const completed=visits.filter(v=>v.status==='COMPLETED');
  const next=upcoming[0];
  const last=completed[0];
  const sub=user?.subscription||MOCK.user.subscription;
  return(
    <div>
      {next&&(
        <div style={{background:`linear-gradient(135deg,${C.primary} 0%,${C.primaryDark} 100%)`,borderRadius:18,padding:'22px 24px',marginBottom:24,color:'#fff',boxShadow:S_MD,display:'flex',gap:16,alignItems:'center'}}>
          <div style={{width:48,height:48,borderRadius:14,background:'rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:700,opacity:.7,letterSpacing:'1px',textTransform:'uppercase',marginBottom:4}}>Next Visit</div>
            <div style={{fontSize:17,fontWeight:700}}>{new Date(next.scheduledAt).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})} at {new Date(next.scheduledAt).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</div>
            <div style={{fontSize:13,opacity:.8,marginTop:3}}>{next.nurse?.user?.name} · {next.serviceType}</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.15)',borderRadius:10,padding:'8px 14px',fontSize:12,fontWeight:700,whiteSpace:'nowrap'}}>Confirmed</div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:14,marginBottom:24}}>
        <Stat label="Plan" value={(sub?.plan||'standard').charAt(0).toUpperCase()+(sub?.plan||'standard').slice(1)} color={C.primary}/>
        <Stat label="Visits used" value={`${sub?.visitsUsed||0}/${sub?.visitsPerMonth||2}`} sub="this month"/>
        <Stat label="Completed" value={completed.length} color={C.secondary} sub="total visits"/>
        <Stat label="Last BP" value={last?.bpSystolic?`${last.bpSystolic}/${last.bpDiastolic}`:'—'} color={last?.bpSystolic?C.warning:C.textTertiary} sub={last?.bpSystolic?'mmHg':'no data yet'}/>
      </div>
      {relative&&(
        <div style={{background:C.bgWhite,borderRadius:16,border:`1px solid ${C.border}`,overflow:'hidden',boxShadow:S_SM}}>
          <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.borderSubtle}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{fontSize:14,fontWeight:700,color:C.textPrimary}}>Loved one receiving care</div>
            <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:99,background:C.secondaryLight,color:C.secondary}}>Active care</span>
          </div>
          {[['Full name',relative.name],['City',relative.city],['Address',relative.address||'—'],['Age',relative.age?`${relative.age} years`:'—'],['Assigned nurse',next?.nurse?.user?.name||'Being assigned']].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 20px',borderBottom:`1px solid ${C.borderSubtle}`}}>
              <span style={{fontSize:13,color:C.textSecondary}}>{k}</span>
              <span style={{fontSize:13,color:C.textPrimary,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Visits({visits}){
  return(
    <div>
      {visits.length===0?(
        <div style={{background:C.bgWhite,borderRadius:16,border:`1px solid ${C.border}`,padding:'48px 24px',textAlign:'center'}}>
          <div style={{fontSize:14,color:C.textTertiary}}>No visits yet</div>
        </div>
      ):visits.map(v=>(
        <div key={v.id} style={{background:C.bgWhite,borderRadius:14,border:`1px solid ${C.border}`,padding:'20px',marginBottom:12,boxShadow:S_SM}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,marginBottom:v.status==='COMPLETED'&&v.bpSystolic?14:0}}>
            <div>
              <div style={{fontSize:15,fontWeight:700,color:C.textPrimary,marginBottom:5}}>{v.serviceType}</div>
              <div style={{fontSize:13,color:C.textSecondary}}>{new Date(v.scheduledAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})} · {v.nurse?.user?.name||'Nurse TBC'}</div>
            </div>
            <Badge status={v.status}/>
          </div>
          {v.status==='COMPLETED'&&v.bpSystolic&&(
            <div style={{background:C.bgSubtle,borderRadius:10,padding:'12px 16px',display:'flex',gap:20,flexWrap:'wrap'}}>
              <div><div style={{fontSize:10,fontWeight:700,color:C.textTertiary,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:3}}>Blood Pressure</div><div style={{fontSize:15,fontWeight:700,color:C.textPrimary}}>{v.bpSystolic}/{v.bpDiastolic} <span style={{fontSize:11,color:C.textTertiary}}>mmHg</span></div></div>
              {v.glucose&&<div><div style={{fontSize:10,fontWeight:700,color:C.textTertiary,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:3}}>Glucose</div><div style={{fontSize:15,fontWeight:700,color:C.textPrimary}}>{v.glucose} <span style={{fontSize:11,color:C.textTertiary}}>mmol/L</span></div></div>}
              {v.nurseNotes&&<div style={{width:'100%',borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4,fontSize:13,color:C.textSecondary,fontStyle:'italic'}}>"{v.nurseNotes}"</div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({params}){
  const lang=params?.lang||'en';
  const router=useRouter();
  const [active,setActive]=useState('overview');
  const [user,setUser]=useState(null);
  const [visits,setVisits]=useState([]);
  const [relative,setRelative]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const load=async()=>{
      try{
        const [meData,visitsData]=await Promise.all([api.me(),api.getVisits()]);
        if(meData?.user){setUser(meData.user);if(meData.user.relatives?.[0])setRelative(meData.user.relatives[0]);}
        if(visitsData?.visits?.length>0)setVisits(visitsData.visits);
        else setVisits(MOCK.visits);
      }catch{setVisits(MOCK.visits);}
      finally{setLoading(false);}
    };
    load();
  },[]);

  const u=user||MOCK.user;
  const r=relative||MOCK.relative;
  const initials=u.name?u.name.split(' ').map(w=>w[0]).join('').slice(0,2):'??';
  const plan=(u.subscription?.plan||'standard').charAt(0).toUpperCase()+(u.subscription?.plan||'standard').slice(1);

  const logout=()=>{
    localStorage.removeItem('vonaxity-token');
    document.cookie='vonaxity-token=;path=/;max-age=0';
    document.cookie='vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  if(loading)return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg,fontFamily:FONT}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:36,height:36,borderRadius:'50%',border:`3px solid ${C.primaryLight}`,borderTopColor:C.primary,margin:'0 auto 12px'}}/>
        <div style={{fontSize:13,color:C.textTertiary}}>Loading...</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const TITLES={overview:'Dashboard',visits:'My Visits',subscription:'Subscription',settings:'Account Settings'};

  return(
    <>
      <style>{`
        *{box-sizing:border-box;}body{margin:0;}
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .dash-sidebar{display:flex!important;}.dash-tabbar{display:none!important;}.dash-content{padding:28px!important;}
        @media(max-width:768px){.dash-sidebar{display:none!important;}.dash-tabbar{display:flex!important;}.dash-content{padding:16px 16px 90px!important;}}
        .nvbtn:hover{background:rgba(255,255,255,0.08)!important;color:rgba(255,255,255,0.85)!important;}
      `}</style>
      <div style={{display:'flex',minHeight:'100vh',fontFamily:FONT,background:C.bg}}>
        {/* Sidebar */}
        <div className="dash-sidebar" style={{width:220,background:C.sidebarBg,display:'flex',flexDirection:'column',minHeight:'100vh',position:'sticky',top:0,flexShrink:0}}>
          <div style={{padding:'22px 20px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
            <div style={{fontSize:18,fontWeight:800,color:'#fff',letterSpacing:'-0.5px',marginBottom:20}}>Vonaxity</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>{initials}</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.name}</div>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.35)',marginTop:1}}>Client · {plan}</div>
              </div>
            </div>
          </div>
          <nav style={{flex:1,padding:'10px'}}>
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>setActive(item.id)} className="nvbtn"
                style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,border:'none',background:active===item.id?'rgba(37,99,235,0.2)':'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.45)',cursor:'pointer',fontSize:13,fontWeight:active===item.id?700:400,marginBottom:2,textAlign:'left',fontFamily:FONT,transition:'all 0.15s'}}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div style={{padding:'12px 16px',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
            <button onClick={logout} style={{fontSize:12,color:'rgba(255,255,255,0.3)',background:'transparent',border:'none',cursor:'pointer',padding:0,fontFamily:FONT}}>Sign out</button>
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:'flex',flexDirection:'column',minWidth:0}}>
          <div style={{padding:'0 28px',height:60,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.bgWhite,flexShrink:0}}>
            <div style={{fontSize:16,fontWeight:700,color:C.textPrimary}}>{TITLES[active]}</div>
            <span style={{fontSize:12,fontWeight:700,padding:'5px 12px',borderRadius:99,background:u.subscription?.status==='TRIAL'?C.purpleLight:C.secondaryLight,color:u.subscription?.status==='TRIAL'?C.purple:C.secondary}}>
              {u.subscription?.status||'Trial'}
            </span>
          </div>
          <main className="dash-content" style={{flex:1,overflowY:'auto',maxWidth:760,width:'100%'}}>
            {active==='overview'&&<Overview user={u} visits={visits} relative={r}/>}
            {active==='visits'&&<Visits visits={visits}/>}
            {active==='subscription'&&(
              <div style={{background:C.bgWhite,borderRadius:16,border:`1px solid ${C.border}`,padding:28,boxShadow:S_SM}}>
                <div style={{fontSize:24,fontWeight:800,color:C.textPrimary,letterSpacing:'-0.5px',marginBottom:6}}>{plan} Plan</div>
                <div style={{fontSize:15,color:C.primary,fontWeight:600,marginBottom:4}}>{u.subscription?.visitsPerMonth||2} nurse visits per month</div>
                <div style={{fontSize:13,color:C.textSecondary,marginBottom:28}}>Status: <span style={{fontWeight:700,color:u.subscription?.status==='TRIAL'?C.purple:C.secondary}}>{u.subscription?.status||'TRIAL'}</span></div>
                <button style={{background:`linear-gradient(135deg,${C.primary},${C.primaryDark})`,color:'#fff',border:'none',borderRadius:12,padding:'13px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:FONT}}>Upgrade to Premium →</button>
              </div>
            )}
            {active==='settings'&&<Settings key="settings-page" initialUser={u} initialRelative={r} lang={lang}/>}
          </main>
        </div>

        {/* Mobile tab bar */}
        <div className="dash-tabbar" style={{display:'none',position:'fixed',bottom:0,left:0,right:0,background:C.sidebarBg,borderTop:'1px solid rgba(255,255,255,0.08)',zIndex:100,padding:'8px 0 env(safe-area-inset-bottom)'}}>
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>setActive(item.id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'6px 4px',border:'none',background:'transparent',color:active===item.id?'#93C5FD':'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:10,fontWeight:active===item.id?700:400,fontFamily:FONT}}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
