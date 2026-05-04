'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', error:'#DC2626', errorLight:'#FEF2F2' };

const TR = {
  en: {
    nurseAccount: 'Nurse account',
    createAccount: 'Create your account',
    subtitle: 'Quick signup — complete your profile and verification inside the dashboard after login.',
    fullName: 'Full name', fullNamePh: 'Your full legal name',
    email: 'Email address',
    phone: 'Phone number',
    password: 'Password', passwordPh: 'Min 8 characters',
    confirmPassword: 'Confirm password', confirmPh: 'Repeat password',
    passwordMismatch: 'Passwords do not match',
    onboardingInfo: 'After signup you will complete your profile, upload credentials, and submit for admin approval before receiving any bookings.',
    loading: 'Creating account...', submit: 'Create nurse account',
    alreadyAccount: 'Already have an account?', signIn: 'Sign in',
    backToSignup: '← Back to account type',
    registrationFailed: 'Registration failed',
    panelHeadline: 'Join our care team',
    panelSub: 'Manage visits, set your availability, and grow your practice with Vonaxity.',
  },
  sq: {
    nurseAccount: 'Llogari infermieri',
    createAccount: 'Krijoni llogarinë tuaj',
    subtitle: 'Regjistrim i shpejtë — plotësoni profilin dhe verifikimin brenda panelit pas hyrjes.',
    fullName: 'Emri i plotë', fullNamePh: 'Emri juaj i plotë ligjor',
    email: 'Adresa e email-it',
    phone: 'Numri i telefonit',
    password: 'Fjalëkalimi', passwordPh: 'Min 8 karaktere',
    confirmPassword: 'Konfirmo fjalëkalimin', confirmPh: 'Përsërit fjalëkalimin',
    passwordMismatch: 'Fjalëkalimet nuk përputhen',
    onboardingInfo: 'Pas regjistrimit do të plotësoni profilin, ngarkoni kredencialet dhe dorëzoni për aprovim nga admini para se të merrni rezervime.',
    loading: 'Duke krijuar llogarinë...', submit: 'Krijo llogari infermieri',
    alreadyAccount: 'Keni llogari?', signIn: 'Hyni',
    backToSignup: '← Kthehu te llojet e llogarisë',
    registrationFailed: 'Regjistrimi dështoi',
    panelHeadline: 'Bashkohuni me ekipin tonë',
    panelSub: 'Menaxhoni vizitat, vendosni disponueshmërinë dhe zgjeroni praktikën tuaj.',
  },
};

export default function NurseSignup({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const tr = TR[lang] || TR.en;
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = form.name && form.email && form.phone && form.password && form.confirm && form.password === form.confirm && form.password.length >= 8;

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:'#fff', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s' };

  const submit = async () => {
    if (!valid) return;
    setLoading(true); setError('');
    try {
      const data = await api.registerNurse({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=NURSE;path=/;max-age=604800`;
      router.push(`/${lang}/nurse`);
    } catch (err) {
      setError(err.message || tr.registrationFailed);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .ns-inp:focus { border-color:#2563EB!important; box-shadow:0 0 0 3px #2563EB22!important; }
        .ns-btn:not(:disabled):hover { background:#1D4ED8!important; transform:translateY(-1px); }
        .ns-btn { transition:all 0.15s; }
        @media(max-width:480px){.ns-pw-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── Left illustration panel ── */}
      <div style={{ position:'relative', width:'42%', flexShrink:0, overflow:'hidden', background:'#1e3a5f' }}>
        <img src="/nurselandingpage.png" alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
        {/* blue wash */}
        <div style={{ position:'absolute', inset:0, background:'rgba(30,58,95,0.55)' }} />
        {/* radial vignette */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(30,58,95,0.1) 0%, rgba(30,58,95,0.52) 100%)' }} />

        <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'36px 40px', animation:'fadeUp 0.6s ease both' }}>
          {/* logo */}
          <Link href={`/${lang}`} style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textDecoration:'none', textShadow:'0 2px 10px rgba(0,0,0,0.2)' }}>Vonaxity</Link>

          {/* center copy */}
          <div>
            {/* nurse badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', borderRadius:99, background:'rgba(255,255,255,0.16)', border:'1.5px solid rgba(255,255,255,0.3)', marginBottom:20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <span style={{ fontSize:12, fontWeight:700, color:'#fff', letterSpacing:'0.5px', textTransform:'uppercase' }}>{tr.nurseAccount}</span>
            </div>
            <div style={{ fontSize:36, fontWeight:900, color:'#fff', letterSpacing:'-0.8px', lineHeight:1.15, textShadow:'0 2px 20px rgba(0,0,0,0.35)', marginBottom:12 }}>{tr.panelHeadline}</div>
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.82)', lineHeight:1.65, maxWidth:280 }}>{tr.panelSub}</div>

            {/* perks */}
            <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:10 }}>
              {['Flexible schedule','Earn per visit','Admin-verified profile'].map(perk => (
                <div key={perk} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:22, height:22, borderRadius:99, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span style={{ fontSize:14, color:'rgba(255,255,255,0.88)', fontWeight:500 }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', letterSpacing:'0.2px' }}>vonaxity.com · Albania</div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, overflowY:'auto', display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 40px', background:'#FAFAFA' }}>
        <div style={{ width:'100%', maxWidth:420, animation:'fadeUp 0.5s ease both' }}>

          <h2 style={{ fontSize:26, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>{tr.createAccount}</h2>
          <p style={{ fontSize:14, color:C.textSecondary, marginBottom:28, lineHeight:1.6 }}>{tr.subtitle}</p>

          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>{tr.fullName}</label>
            <input className="ns-inp" style={inp} name="name" autoComplete="name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={tr.fullNamePh} />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>{tr.email}</label>
            <input className="ns-inp" style={inp} type="email" name="email" autoComplete="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>{tr.phone}</label>
            <input className="ns-inp" style={inp} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+355 69 000 0000" />
          </div>
          <div className="ns-pw-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>{tr.password}</label>
              <input className="ns-inp" style={inp} type="password" name="password" autoComplete="new-password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder={tr.passwordPh} />
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.4px' }}>{tr.confirmPassword}</label>
              <input className="ns-inp" style={{...inp, borderColor:form.confirm&&form.password!==form.confirm?C.error:C.border}} type="password" name="confirm-password" autoComplete="new-password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} placeholder={tr.confirmPh} />
            </div>
          </div>
          {form.confirm && form.password !== form.confirm && (
            <div style={{ fontSize:12, color:C.error, marginBottom:12 }}>{tr.passwordMismatch}</div>
          )}

          <div style={{ background:C.secondaryLight, borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:13, color:'#065F46', lineHeight:1.55 }}>
            {tr.onboardingInfo}
          </div>

          {error && (
            <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13, color:C.error }}>{error}</div>
          )}

          <button className="ns-btn" onClick={submit} disabled={!valid||loading}
            style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:11, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', opacity:!valid||loading?0.45:1, marginBottom:20 }}>
            {loading ? tr.loading : tr.submit}
          </button>

          <div style={{ textAlign:'center', fontSize:13, color:C.textTertiary }}>
            {tr.alreadyAccount} <Link href={`/${lang}/login`} style={{ color:C.primary, fontWeight:600 }}>{tr.signIn}</Link>
          </div>
          <div style={{ textAlign:'center', marginTop:8 }}>
            <Link href={`/${lang}/signup`} style={{ fontSize:12, color:C.textTertiary }}>{tr.backToSignup}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
