'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };
const CITIES = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

function RoleSelect({ lang, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const clientFeatures = t(lang,'signup.clientFeatures');
  const nurseFeatures = t(lang,'signup.nurseFeatures');
  return (
    <div>
      <Link href={`/${lang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:28 }}>Vonaxity</Link>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:8, letterSpacing:'-0.5px' }}>{t(lang,'signup.createAccount')}</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:28, lineHeight:1.6 }}>{t(lang,'signup.chooseDesc')}</p>

      {/* Client card */}
      <div onClick={()=>onSelect('client')} onMouseEnter={()=>setHovered('client')} onMouseLeave={()=>setHovered(null)}
        style={{ border:`2px solid ${hovered==='client'?C.primary:C.border}`, borderRadius:14, padding:20, marginBottom:12, cursor:'pointer', background:hovered==='client'?C.primaryLight:C.bgWhite, transition:'all 0.15s' }}>
        <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{t(lang,'signup.clientTitle')}</div>
            <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.6 }}>{t(lang,'signup.clientFullDesc')}</div>
          </div>
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
          {Array.isArray(clientFeatures) && clientFeatures.map(tag=>(
            <span key={tag} style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:99, background:C.primaryLight, color:C.primary }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Nurse card */}
      <div onClick={()=>onSelect('nurse')} onMouseEnter={()=>setHovered('nurse')} onMouseLeave={()=>setHovered(null)}
        style={{ border:`2px solid ${hovered==='nurse'?C.secondary:C.border}`, borderRadius:14, padding:20, marginBottom:24, cursor:'pointer', background:hovered==='nurse'?C.secondaryLight:C.bgWhite, transition:'all 0.15s' }}>
        <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:4 }}>{t(lang,'signup.nurseTitle')}</div>
            <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.6 }}>{t(lang,'signup.nurseFullDesc')}</div>
          </div>
        </div>
        <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
          {Array.isArray(nurseFeatures) && nurseFeatures.map(tag=>(
            <span key={tag} style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:99, background:C.secondaryLight, color:C.secondary }}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={{ textAlign:'center', fontSize:13, color:C.textTertiary }}>
        {t(lang,'signup.alreadyAccount')} <Link href={`/${lang}/login`} style={{ color:C.primary, fontWeight:600 }}>{t(lang,'signup.signIn')}</Link>
      </div>
    </div>
  );
}

function SignupContent({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState(null); // null = role select, 'client' = client flow, 'nurse' = redirect
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', country:'', plan:searchParams.get('plan')||'standard', relativeName:'', relativeCity:'', relativeAddress:'', relativePhone:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === 'nurse') {
      router.push(`/${lang}/nurse-signup`);
    } else {
      setRole('client');
    }
  };

  const submit = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.register(form);
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=CLIENT;path=/;max-age=604800`;
      document.cookie = `vonaxity-token=set;path=/;max-age=604800`;
      window.location.href = `/${lang}/dashboard`;
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'36px 32px', maxWidth:500, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>

        {/* Show role selection if no role chosen yet */}
        {!role && <RoleSelect lang={lang} onSelect={handleRoleSelect} />}

        {/* Client signup flow */}
        {role === 'client' && <>
        <Link href={`/${lang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:28 }}>Vonaxity</Link>

        <div style={{ display:'flex', gap:6, marginBottom:32 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ flex:1, display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:step>=s?C.primary:'#F3F4F6', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {step>s ? <CheckIcon /> : <span style={{ fontSize:12, fontWeight:700, color:step>=s?'#fff':'#9CA3AF' }}>{s}</span>}
              </div>
              <div style={{ height:3, width:'100%', borderRadius:99, background:step>s?C.primary:step===s?C.primaryLight:'#F3F4F6' }} />
            </div>
          ))}
        </div>

        {step===1 && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>{t(lang,'signup.step1Title')}</h2>
            <p style={{ fontSize:13, color:C.textTertiary, marginBottom:24 }}>{t(lang,'signup.step1Subtitle')}</p>
            {[{name:'basic',price:'€30',v:1},{name:'standard',price:'€50',v:2},{name:'premium',price:'€120',v:4}].map(p => (
              <div key={p.name} onClick={()=>setForm({...form,plan:p.name})} style={{ borderRadius:12, padding:'14px 18px', marginBottom:10, cursor:'pointer', border:`2px solid ${form.plan===p.name?C.primary:C.border}`, background:form.plan===p.name?C.primaryLight:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.15s' }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, textTransform:'capitalize' }}>{p.name} · {p.v} {p.v===1?t(lang,'pricing.visitMonth'):t(lang,'pricing.visitsMonth')}</div>
                <div style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px' }}>{p.price}<span style={{ fontSize:12, fontWeight:500, color:C.textTertiary }}>{t(lang,'dashboard.perMonth')}</span></div>
              </div>
            ))}
            <button onClick={()=>setStep(2)} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', marginTop:8 }}>{t(lang,'signup.continue')}</button>
          </div>
        )}

        {step===2 && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:24 }}>{t(lang,'signup.step2Title')}</h2>
            {[[t(lang,'signup.fullName'),'name','text',t(lang,'signup.fullName')],[t(lang,'signup.email'),'email','email','you@email.com'],[t(lang,'signup.password'),'password','password','••••••••'],[t(lang,'signup.phone'),'phone','tel','+44 7700 000000']].map(([label,key,type,ph]) => (
              <div key={key} style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{label}</label>
                <input style={inp} type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
              </div>
            ))}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(lang,'signup.country')}</label>
              <select style={{...inp}} value={form.country} onChange={e=>setForm({...form,country:e.target.value})}>
                <option value="">{t(lang,'signup.country')}</option>
                {['United Kingdom','Italy','Germany','Greece','USA','Albania','Other'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setStep(1)} style={{ flex:'0 0 auto', padding:'12px 20px', borderRadius:10, border:`2px solid ${C.border}`, background:'#fff', cursor:'pointer', fontWeight:600, fontSize:14 }}>{t(lang,'signup.back')}</button>
              <button onClick={()=>setStep(3)} disabled={!form.name||!form.email||!form.password} style={{ flex:1, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:(!form.name||!form.email||!form.password)?0.4:1 }}>{t(lang,'signup.continue')}</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:24 }}>{t(lang,'signup.step3Title')}</h2>
            {[[t(lang,'signup.theirName'),'relativeName','text',t(lang,'signup.theirName')],[t(lang,'signup.theirAddress'),'relativeAddress','text',t(lang,'signup.theirAddress')],[t(lang,'signup.theirPhone'),'relativePhone','tel','+355 69 000 0000']].map(([label,key,type,ph]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{label}</label>
                <input style={inp} type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
              </div>
            ))}
            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(lang,'signup.theirCity')}</label>
              <select style={{...inp}} value={form.relativeCity} onChange={e=>setForm({...form,relativeCity:e.target.value})}>
                <option value="">{t(lang,'signup.theirCity')}</option>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:9, padding:'11px 14px', fontSize:13, color:'#DC2626', marginBottom:14 }}>{error}</div>}
            <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'11px 14px', fontSize:12, color:'#92400E', marginBottom:20 }}>
              {t(lang,'signup.nonEmergency')} <strong>127</strong>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setStep(2)} style={{ flex:'0 0 auto', padding:'12px 20px', borderRadius:10, border:`2px solid ${C.border}`, background:'#fff', cursor:'pointer', fontWeight:600, fontSize:14 }}>{t(lang,'signup.back')}</button>
              <button onClick={submit} disabled={loading||!form.relativeName||!form.relativeCity} style={{ flex:1, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'12px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
                {loading?t(lang,'signup.loading'):t(lang,'signup.submit')}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:C.textTertiary }}>
          {t(lang,'signup.alreadyAccount')} <Link href={`/${lang}/login`} style={{ color:C.primary, fontWeight:600 }}>{t(lang,'signup.signIn')}</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:8 }}>
          <button onClick={()=>setRole(null)} style={{ fontSize:12, color:C.textTertiary, background:'transparent', border:'none', cursor:'pointer' }}>{t(lang,'signup.changeAccountType')}</button>
        </div>
        </>}
      </div>
    </div>
  );
}

export default function SignupPage({ params }) {
  const lang = params?.lang || 'en';
  return <Suspense fallback={<div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#6B7280', fontSize:14 }}>{t(lang, 'signup.loading')}</div>}><SignupContent params={params} /></Suspense>;
}
