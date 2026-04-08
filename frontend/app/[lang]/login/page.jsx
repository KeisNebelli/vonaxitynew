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

        <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:8 }}>{t(uiLang,'login.title')}</h1>
        <p style={{ fontSize:14, color:C.textTertiary, marginBottom:28 }}>
          {t(uiLang,'login.noAccount')} <Link href={`/${lang}/signup`} style={{ color:C.primary, fontWeight:600 }}>{t(uiLang,'login.signUp')}</Link>
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(uiLang,'login.email')}</label>
            <input style={inp} type="email" placeholder="you@email.com" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          </div>
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{t(uiLang,'login.password')}</label>
            <input style={inp} type="password" placeholder="••••••••" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          </div>
          {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'11px 14px', fontSize:13, color:C.error, marginBottom:16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
            {loading ? t(uiLang,'login.loading') : t(uiLang,'login.submit')}
          </button>
        </form>

        <div style={{ marginTop:24, background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 16px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', marginBottom:10 }}>TEST ACCOUNTS</div>
          {[['client@test.com','test123','Client'],['nurse@test.com','test123','Nurse'],['admin@test.com','test123','Admin']].map(([email,pass,role]) => (
            <div key={role} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:C.textSecondary, marginBottom:6 }}>
              <span><strong style={{ color:C.textPrimary }}>{role}</strong> · {email}</span>
              <button onClick={()=>setForm({email,password:pass})} style={{ fontSize:11, padding:'3px 10px', borderRadius:6, border:`1px solid ${C.border}`, background:C.bgWhite, cursor:'pointer', color:C.primary, fontWeight:600 }}>
                {t(uiLang,'login.fill')}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop:16, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:9, padding:'11px 14px', fontSize:12, color:'#92400E' }}>
          Non-emergency care only. Emergency in Albania: <strong>127</strong>
        </div>
      </div>
    </div>
  );
}
