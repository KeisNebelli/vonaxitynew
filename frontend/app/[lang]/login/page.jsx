'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const ILLUSTRATIONS = {
  CLIENT: '/family-login.png',
  NURSE:  '/nurse-login.png',
};

const TR = {
  en: {
    clientTitle: 'I need care',
    clientSub: 'Book trusted home nursing care for your loved ones',
    nurseTitle: "I'm a Nurse",
    nurseSub: 'Manage your visits and grow your practice',
    continue: 'Continue →',
    welcomeBack: 'Welcome back',
    client: 'Client',
    nurse: 'Nurse',
    noAccount: "Don't have an account?",
    signUp: 'Sign up',
    email: 'Email address',
    password: 'Password',
    submit: 'Sign in',
    loading: 'Signing in...',
    forgotPassword: 'Forgot password?',
    nonEmergency: 'Non-emergency care only. Emergency in Albania:',
    or: 'or',
    nurseSignup: 'Apply as a nurse',
    whoAreYou: 'Who are you?',
    selectRole: 'Select your role to continue',
  },
  sq: {
    clientTitle: 'Kam nevojë për kujdes',
    clientSub: 'Rezervoni kujdes infermieror për të afërmit tuaj',
    nurseTitle: 'Jam Infermiere',
    nurseSub: 'Menaxhoni vizitat dhe zgjeroni praktikën tuaj',
    continue: 'Vazhdo →',
    welcomeBack: 'Mirë se keni ardhur',
    client: 'Klient',
    nurse: 'Infermiere',
    noAccount: 'Nuk keni llogari?',
    signUp: 'Regjistrohu',
    email: 'Adresa e email-it',
    password: 'Fjalëkalimi',
    submit: 'Hyr',
    loading: 'Duke hyrë...',
    forgotPassword: 'Keni harruar fjalëkalimin?',
    nonEmergency: 'Vetëm kujdes jo-urgjent. Urgjencë në Shqipëri:',
    or: 'ose',
    nurseSignup: 'Aplikoni si infermiere',
    whoAreYou: 'Kush jeni ju?',
    selectRole: 'Zgjidhni rolin tuaj për të vazhduar',
  },
};

export default function LoginPage({ params }) {
  const lang = params.lang || 'en';
  const [uiLang, setUiLang] = useState(lang);
  const [role, setRole] = useState(null); // null | 'CLIENT' | 'NURSE'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tr = (key) => TR[uiLang]?.[key] || TR.en[key] || key;
  const switchLang = (l) => {
    setUiLang(l);
    document.cookie = `vonaxity-locale=${l};path=/;max-age=31536000`;
    localStorage.setItem('vonaxity-lang', l);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.login(form);
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=${data.user.role};path=/;max-age=604800`;
      document.cookie = `vonaxity-token=set;path=/;max-age=604800`;
      const redirectMap = { CLIENT: `/${lang}/dashboard`, NURSE: `/${lang}/nurse`, ADMIN: `/${lang}/admin` };
      window.location.href = redirectMap[data.user.role] || `/${lang}/dashboard`;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const isNurse = role === 'NURSE';
  const accent = isNurse ? '#2563EB' : '#059669';
  const accentDark = isNurse ? '#1D4ED8' : '#047857';

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:'system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .rp-panel { flex:1; cursor:pointer; transition:flex 0.4s cubic-bezier(0.4,0,0.2,1); position:relative; overflow:hidden; }
        .rp-panel:hover { flex:1.14; }
        .rp-panel:hover .rp-illus { transform:scale(1.05); }
        .rp-panel:hover .rp-btn { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.18)!important; }
        .rp-illus { transition:transform 0.4s cubic-bezier(0.4,0,0.2,1); }
        .rp-btn { transition:transform 0.2s,box-shadow 0.2s; }
        .lf-inp:focus { border-color:${accent}!important; box-shadow:0 0 0 3px ${accent}22!important; outline:none; }
        .lf-btn:hover { background:${accentDark}!important; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 28px' }}>
        <Link href={`/${lang}`} style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textDecoration:'none', textShadow:'0 2px 10px rgba(0,0,0,0.25)' }}>
          Vonaxity
        </Link>
        <div style={{ display:'flex', background:'rgba(0,0,0,0.28)', backdropFilter:'blur(8px)', borderRadius:10, padding:3, border:'1px solid rgba(255,255,255,0.18)' }}>
          {['en','sq'].map(l => (
            <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 13px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?'rgba(255,255,255,0.92)':'transparent', color:uiLang===l?'#1e3a5f':'rgba(255,255,255,0.75)', fontFamily:'inherit', transition:'all 0.15s' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Split panels (always visible) ── */}
      <div style={{ display:'flex', flex:1, minHeight:'100vh' }}>

        {/* CLIENT panel */}
        <div className="rp-panel" onClick={() => { setRole('CLIENT'); setError(''); }}
          style={{ background:'linear-gradient(160deg,#064e3b 0%,#059669 100%)' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.13 }}>
            <svg width="100%" height="100%"><defs><pattern id="gd" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#gd)"/></svg>
          </div>
          <img className="rp-illus" src={ILLUSTRATIONS.CLIENT} alt="Family" style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'80%', maxWidth:380, objectFit:'contain', display:'block', opacity:0.9 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(6,78,59,0.55) 0%, transparent 60%)' }}/>
          <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'0 40px 60px', textAlign:'center', gap:14, animation:'fadeUp 0.5s ease both' }}>
            <div style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', lineHeight:1.1, textShadow:'0 2px 16px rgba(0,0,0,0.3)' }}>{tr('clientTitle')}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.55, maxWidth:260 }}>{tr('clientSub')}</div>
            <button className="rp-btn" style={{ background:'#fff', color:'#059669', border:'none', borderRadius:14, padding:'13px 36px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
              {tr('continue')}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width:3, background:'rgba(255,255,255,0.2)', zIndex:5, flexShrink:0 }}/>

        {/* NURSE panel */}
        <div className="rp-panel" onClick={() => { setRole('NURSE'); setError(''); }}
          style={{ background:'linear-gradient(160deg,#1e3a5f 0%,#2563EB 100%)' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.10 }}>
            <svg width="100%" height="100%"><defs><pattern id="bd" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#bd)"/></svg>
          </div>
          <img className="rp-illus" src={ILLUSTRATIONS.NURSE} alt="Nurse" style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'75%', maxWidth:340, objectFit:'contain', display:'block', opacity:0.9 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(30,58,95,0.55) 0%, transparent 60%)' }}/>
          <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:'0 40px 60px', textAlign:'center', gap:14, animation:'fadeUp 0.5s ease both' }}>
            <div style={{ fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', lineHeight:1.1, textShadow:'0 2px 16px rgba(0,0,0,0.3)' }}>{tr('nurseTitle')}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.85)', lineHeight:1.55, maxWidth:260 }}>{tr('nurseSub')}</div>
            <button className="rp-btn" style={{ background:'#fff', color:'#2563EB', border:'none', borderRadius:14, padding:'13px 36px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
              {tr('continue')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Login modal overlay — click outside to close ── */}
      {role && (
        <div
          onClick={() => { setRole(null); setError(''); }}
          style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', padding:24 }}
        >
          {/* Stop propagation so clicking the card itself doesn't close */}
          <div onClick={e => e.stopPropagation()}
            style={{ background:'#fff', borderRadius:24, padding:'36px', width:'100%', maxWidth:420, boxShadow:'0 24px 64px rgba(0,0,0,0.3)', animation:'modalIn 0.3s cubic-bezier(0.4,0,0.2,1) both' }}>

            {/* Header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <div>
                <div style={{ fontSize:20, fontWeight:900, color:accent, letterSpacing:'-0.3px' }}>Vonaxity</div>
                <div style={{ fontSize:12, fontWeight:700, marginTop:4, display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:99, background: isNurse?'#EFF6FF':'#ECFDF5', color:accent, border:`1.5px solid ${accent}33` }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:accent, display:'inline-block' }}/>
                  {isNurse ? tr('nurse') : tr('client')}
                </div>
              </div>
              {/* Close X */}
              <button onClick={() => { setRole(null); setError(''); }}
                style={{ width:34, height:34, borderRadius:99, border:`1.5px solid #E5E7EB`, background:'#F9FAFB', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#6B7280', fontFamily:'inherit' }}>
                ✕
              </button>
            </div>

            <h2 style={{ fontSize:22, fontWeight:800, color:'#111827', letterSpacing:'-0.4px', marginBottom:6 }}>{tr('welcomeBack')}</h2>
            <p style={{ fontSize:13, color:'#6B7280', marginBottom:24 }}>
              {tr('noAccount')} <Link href={`/${lang}/signup`} style={{ color:accent, fontWeight:600 }}>{tr('signUp')}</Link>
            </p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('email')}</label>
                <input className="lf-inp"
                  style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#fff', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s,box-shadow 0.15s' }}
                  type="email" name="email" autoComplete="email" placeholder="you@email.com" required
                  value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'#374151', display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('password')}</label>
                <input className="lf-inp"
                  style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#fff', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s,box-shadow 0.15s' }}
                  type="password" name="password" autoComplete="current-password" placeholder="••••••••" required
                  value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
                <div style={{ textAlign:'right', marginTop:6 }}>
                  <Link href={`/${lang}/forgot-password`} style={{ fontSize:12, color:accent, fontWeight:500 }}>{tr('forgotPassword')}</Link>
                </div>
              </div>

              {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#DC2626', marginBottom:14 }}>{error}</div>}

              <button type="submit" disabled={loading} className="lf-btn"
                style={{ width:'100%', background:accent, color:'#fff', border:'none', borderRadius:12, padding:'13px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.75:1, fontFamily:'inherit', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {loading
                  ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 0.8s linear infinite'}}><path d="M12 2a10 10 0 0110 10"/><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/></svg>{tr('loading')}</>
                  : tr('submit')
                }
              </button>
            </form>

            {isNurse && (
              <div style={{ marginTop:14, textAlign:'center', fontSize:13, color:'#6B7280' }}>
                {tr('or')} <Link href={`/${lang}/nurse-signup`} style={{ color:accent, fontWeight:600 }}>{tr('nurseSignup')}</Link>
              </div>
            )}

            <div style={{ marginTop:14, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#92400E' }}>
              {tr('nonEmergency')} <strong>127</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
