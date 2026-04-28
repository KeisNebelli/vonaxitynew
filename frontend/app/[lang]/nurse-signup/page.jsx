'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', error:'#DC2626', errorLight:'#FEF2F2' };

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
  },
};

const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

export default function NurseSignup({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const tr = TR[lang] || TR.en;
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const valid = form.name && form.email && form.phone && form.password && form.confirm && form.password === form.confirm && form.password.length >= 8;

  const submit = async () => {
    if (!valid) return;
    setLoading(true); setError('');
    try {
      const data = await api.registerNurse({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=NURSE;path=/;max-age=604800`;
      router.push(`/${lang}/nurse`);
    } catch (err) {
      setError(err.message || tr.registrationFailed);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(150deg,#EFF6FF 0%,#F8FAFC 50%,#F0FDF4 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <style>{`.ns-btn:not(:disabled):hover{background:#1D4ED8!important;transform:translateY(-1px)}.ns-btn{transition:all 0.15s}`}</style>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'36px 32px', maxWidth:460, width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
        <Link href={`/${lang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:8 }}>Vonaxity</Link>
        <div style={{ fontSize:11, fontWeight:700, color:C.secondary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:24 }}>{tr.nurseAccount}</div>

        <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>{tr.createAccount}</h2>
        <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24, lineHeight:1.6 }}>{tr.subtitle}</p>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr.fullName}</label>
          <input style={inp} name="name" autoComplete="name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={tr.fullNamePh} />
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr.email}</label>
          <input style={inp} type="email" name="email" autoComplete="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" />
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr.phone}</label>
          <input style={inp} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+355 69 000 0000" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr.password}</label>
            <input style={inp} type="password" name="password" autoComplete="new-password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder={tr.passwordPh} />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr.confirmPassword}</label>
            <input style={{...inp, borderColor:form.confirm&&form.password!==form.confirm?C.error:C.border}} type="password" name="confirm-password" autoComplete="new-password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} placeholder={tr.confirmPh} />
          </div>
        </div>
        {form.confirm && form.password !== form.confirm && <div style={{ fontSize:12, color:C.error, marginBottom:12 }}>{tr.passwordMismatch}</div>}

        <div style={{ background:C.secondaryLight, borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:13, color:'#065F46' }}>
          {tr.onboardingInfo}
        </div>

        {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13, color:C.error }}>{error}</div>}

        <button className="ns-btn" onClick={submit} disabled={!valid||loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid||loading?0.5:1, marginBottom:16 }}>
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
  );
}
