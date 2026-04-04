'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', error:'#DC2626', errorLight:'#FEF2F2' };

const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

export default function NurseSignup({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
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
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'36px 32px', maxWidth:460, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <Link href={`/${lang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:8 }}>Vonaxity</Link>
        <div style={{ fontSize:11, fontWeight:700, color:C.secondary, letterSpacing:'1px', textTransform:'uppercase', marginBottom:24 }}>Nurse account</div>

        <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Create your account</h2>
        <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24, lineHeight:1.6 }}>
          Quick signup — you'll complete your profile and verification inside the dashboard after login.
        </p>

        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>Full name</label>
          <input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full legal name" />
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>Email address</label>
          <input style={inp} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" />
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>Phone number</label>
          <input style={inp} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+355 69 000 0000" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>Password</label>
            <input style={inp} type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 8 characters" />
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>Confirm password</label>
            <input style={{...inp, borderColor:form.confirm&&form.password!==form.confirm?C.error:C.border}} type="password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} placeholder="Repeat password" />
          </div>
        </div>
        {form.confirm && form.password !== form.confirm && <div style={{ fontSize:12, color:C.error, marginBottom:12 }}>Passwords do not match</div>}

        <div style={{ background:C.secondaryLight, borderRadius:10, padding:'12px 14px', marginBottom:20, fontSize:13, color:'#065F46' }}>
          After signup you will complete your profile, upload credentials, and submit for admin approval before receiving any bookings.
        </div>

        {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:14, fontSize:13, color:C.error }}>{error}</div>}

        <button onClick={submit} disabled={!valid||loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid||loading?0.5:1, marginBottom:16 }}>
          {loading ? 'Creating account...' : 'Create nurse account'}
        </button>

        <div style={{ textAlign:'center', fontSize:13, color:C.textTertiary }}>
          Already have an account? <Link href={`/${lang}/login`} style={{ color:C.primary, fontWeight:600 }}>Sign in</Link>
        </div>
        <div style={{ textAlign:'center', marginTop:8 }}>
          <Link href={`/${lang}/signup`} style={{ fontSize:12, color:C.textTertiary }}>← Back to account type</Link>
        </div>
      </div>
    </div>
  );
}
