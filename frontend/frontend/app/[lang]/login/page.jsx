'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { t } from '@/translations';

const C = { teal:'#0e7490',sage:'#16a34a',border:'#e7e5e4',neutralDark:'#1c1917',neutralMid:'#78716c',neutral:'#f8f7f4' };

export default function LoginPage({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [form, setForm] = useState({ email:'',password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.login(form);
      document.cookie = `vonaxity-role=${data.user.role};path=/;max-age=604800`;
      document.cookie = `vonaxity-token=set;path=/;max-age=604800`;
      const redirectMap = { CLIENT:`/${lang}/dashboard`,NURSE:`/${lang}/nurse`,ADMIN:`/${lang}/admin` };
      window.location.href = redirectMap[data.user.role] || `/${lang}/dashboard`;
    } catch(err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%',padding:'12px 14px',borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:14,fontFamily:'inherit',outline:'none',marginBottom:14,boxSizing:'border-box' };

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.neutral,padding:24 }}>
      <div style={{ background:'#fff',borderRadius:20,border:`1px solid ${C.border}`,padding:'36px 32px',maxWidth:420,width:'100%',boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <Link href={`/${lang}`} style={{ fontSize:22,fontWeight:700,color:C.teal,fontFamily:'Georgia,serif',textDecoration:'none',display:'block',marginBottom:24 }}>
          Von<span style={{ color:C.sage }}>ax</span>ity
        </Link>
        <h1 style={{ fontSize:22,fontWeight:700,color:C.neutralDark,marginBottom:24 }}>{t(lang,'login.title')}</h1>
        <form onSubmit={handleLogin}>
          <label style={{ fontSize:12,fontWeight:600,color:C.neutralDark,display:'block',marginBottom:5 }}>{t(lang,'login.email')}</label>
          <input style={inp} type="email" placeholder="you@email.com" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
          <label style={{ fontSize:12,fontWeight:600,color:C.neutralDark,display:'block',marginBottom:5 }}>{t(lang,'login.password')}</label>
          <input style={{...inp,marginBottom:20}} type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
          {error && <div style={{ background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#dc2626',marginBottom:16 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%',background:C.teal,color:'#fff',border:'none',borderRadius:10,padding:'14px',fontSize:15,fontWeight:700,cursor:'pointer',opacity:loading?0.7:1 }}>
            {loading ? t(lang,'login.loading') : t(lang,'login.submit')}
          </button>
        </form>
        <div style={{ marginTop:20,fontSize:13,color:C.neutralMid,textAlign:'center' }}>
          {t(lang,'login.noAccount')} <Link href={`/${lang}/signup`} style={{ color:C.teal,fontWeight:600 }}>{t(lang,'login.signUp')}</Link>
        </div>
        <div style={{ marginTop:20,background:C.neutral,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px' }}>
          <div style={{ fontSize:11,fontWeight:700,color:C.neutralMid,marginBottom:8 }}>{t(lang,'login.testAccounts')}</div>
          {[['client@test.com','test123','Client'],['nurse@test.com','test123','Nurse'],['admin@test.com','test123','Admin']].map(([email,pass,role]) => (
            <div key={role} style={{ fontSize:12,color:C.neutralMid,marginBottom:4 }}>
              <strong style={{ color:C.neutralDark }}>{role}:</strong> {email} / {pass}
              <button onClick={() => setForm({email,password:pass})} style={{ marginLeft:8,fontSize:11,padding:'2px 8px',borderRadius:6,border:`1px solid ${C.border}`,background:'#fff',cursor:'pointer',color:C.teal }}>
                {t(lang,'login.fill')}
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16,background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 14px',fontSize:12,color:'#991b1b',textAlign:'center' }}>
          ⚠️ {t(lang,'login.emergency')} <strong>127</strong>
        </div>
      </div>
    </div>
  );
}
