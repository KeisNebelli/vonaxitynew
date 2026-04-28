'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', error:'#DC2626', errorLight:'#FEF2F2' };

export default function LoginPage({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [uiLang, setUiLang] = useState(lang || 'en');
  const switchLang = (l) => { setUiLang(l); document.cookie=`vonaxity-locale=${l};path=/;max-age=31536000`; localStorage.setItem('vonaxity-lang',l); };

  // Inline translations as fallback in case t() fails
  const TR = {
    en: { title:'Welcome back', noAccount:"Don't have an account?", signUp:'Sign up', email:'Email address', password:'Password', submit:'Sign in', loading:'Signing in...', fill:'Fill', forgotPassword:'Forgot password?', nonEmergency:'Non-emergency care only. Emergency in Albania:' },
    sq: { title:'Mirë se keni ardhur', noAccount:'Nuk keni llogari?', signUp:'Regjistrohu', email:'Adresa e email-it', password:'Fjalëkalimi', submit:'Hyr', loading:'Duke hyrë...', fill:'Plotëso', forgotPassword:'Keni harruar fjalëkalimin?', nonEmergency:'Vetëm kujdes jo-urgjent. Urgjencë në Shqipëri:' },
  };
  const tr = (key) => TR[uiLang]?.[key] || TR.en[key] || key;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.login(form);
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=${data.user.role};path=/;max-age=604800`;
      document.cookie = `vonaxity-token=set;path=/;max-age=604800`;
      const redirectMap = { CLIENT:`/${lang}/dashboard`, NURSE:`/${lang}/nurse`, ADMIN:`/${lang}/admin` };
      window.location.href = redirectMap[data.user.role] || `/${lang}/dashboard`;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, padding:24 }}>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px 36px', maxWidth:420, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <Link href={`/${uiLang}`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px' }}>Vonaxity</Link>
          <div style={{ display:'flex', background:'#F5F5F4', borderRadius:8, padding:3, border:`1px solid ${C.border}` }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={()=>switchLang(l)} style={{ padding:'4px 10px', borderRadius:6, border:'none', fontSize:11, fontWeight:700, cursor:'pointer', background:uiLang===l?C.primary:'transparent', color:uiLang===l?'#fff':C.textSecondary, fontFamily:'inherit' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:8 }}>{tr('title')}</h1>
        <p style={{ fontSize:14, color:C.textTertiary, marginBottom:28 }}>
          {tr('noAccount')} <Link href={`/${lang}/signup`} style={{ color:C.primary, fontWeight:600 }}>{tr('signUp')}</Link>
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('email')}</label>
            <input style={inp} type="email" name="email" autoComplete="email" placeholder="you@email.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('password')}</label>
            <input style={inp} type="password" name="password" autoComplete="current-password" placeholder="••••••••" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
            <div style={{ textAlign:'right', marginTop:6 }}>
              <Link href={`/${lang}/forgot-password`} style={{ fontSize:12, color:C.primary, fontWeight:500 }}>{tr('forgotPassword')}</Link>
            </div>
          </div>
          {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'11px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
            {loading ? tr('loading') : tr('submit')}
          </button>
        </form>


        <div style={{ marginTop:16, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'11px 14px', fontSize:12, color:'#92400E' }}>
          {tr('nonEmergency')} <strong>127</strong>
        </div>
      </div>
    </div>
  );
}
