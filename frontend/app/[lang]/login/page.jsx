'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

// Drop your illustration files into /frontend/public/ and update these paths
const ILLUSTRATIONS = {
  CLIENT: '/family-login.png',   // young couple + elderly parents illustration
  NURSE:  '/nurse-login.png',    // nurse with stethoscope illustration
};

const TR = {
  en: {
    clientTitle: 'I need care',
    clientSub: 'Book trusted home nursing care for your loved ones',
    nurseTitle: 'I\'m a Nurse',
    nurseSub: 'Manage your visits and grow your practice',
    continue: 'Continue →',
    back: '← Back',
    welcomeBack: 'Welcome back',
    signingInAs: 'Signing in as',
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
  },
  sq: {
    clientTitle: 'Kam nevojë për kujdes',
    clientSub: 'Rezervoni kujdes infermieror për të afërmit tuaj',
    nurseTitle: 'Jam Infermiere',
    nurseSub: 'Menaxhoni vizitat dhe zgjeroni praktikën tuaj',
    continue: 'Vazhdo →',
    back: '← Mbrapa',
    welcomeBack: 'Mirë se keni ardhur',
    signingInAs: 'Duke hyrë si',
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
  },
};

export default function LoginPage({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [uiLang, setUiLang] = useState(lang);
  const [role, setRole] = useState(null); // null | 'CLIENT' | 'NURSE'
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(null);

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

  /* ── Role picker ─────────────────────────────────────────── */
  if (!role) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:'system-ui,sans-serif', background:'#F8FAFF' }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          .rp-panel { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; cursor:pointer; transition:flex 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s; position:relative; overflow:hidden; }
          .rp-panel:hover { flex:1.14; }
          .rp-panel:hover .rp-footer { transform:translateY(-4px); }
          .rp-panel:hover .rp-illus { transform:scale(1.04); }
          .rp-illus { transition:transform 0.4s cubic-bezier(0.4,0,0.2,1); }
          .rp-footer { transition:transform 0.25s ease; }
          .rp-btn:hover { opacity:0.9; transform:translateY(-1px); }
          .rp-btn { transition:opacity 0.15s, transform 0.15s; }
          .rp-content { animation: fadeUp 0.5s ease both; }
        `}</style>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 32px', flexShrink:0 }}>
          <span style={{ fontSize:22, fontWeight:900, color:'#2563EB', letterSpacing:'-0.5px' }}>Vonaxity</span>
          <div style={{ display:'flex', background:'#EFF6FF', borderRadius:10, padding:3, border:'1px solid #DBEAFE' }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 14px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?'#2563EB':'transparent', color:uiLang===l?'#fff':'#93C5FD', fontFamily:'inherit', transition:'all 0.15s' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Headline */}
        <div className="rp-content" style={{ textAlign:'center', padding:'8px 24px 24px', flexShrink:0 }}>
          <div style={{ fontSize:28, fontWeight:900, color:'#111827', letterSpacing:'-0.5px', marginBottom:6 }}>
            {uiLang==='sq' ? 'Kush jeni ju?' : 'Who are you?'}
          </div>
          <div style={{ fontSize:15, color:'#6B7280' }}>
            {uiLang==='sq' ? 'Zgjidhni rolin tuaj për të vazhduar' : 'Select your role to continue'}
          </div>
        </div>

        {/* Two panels */}
        <div style={{ display:'flex', flex:1, gap:16, padding:'0 24px 32px', minHeight:0 }}>

          {/* CLIENT panel */}
          <div className="rp-panel" onClick={() => setRole('CLIENT')}
            style={{ background:'linear-gradient(160deg,#ECFDF5 0%,#D1FAE5 100%)', borderRadius:24, border:'2px solid #A7F3D0', boxShadow:'0 4px 24px rgba(5,150,105,0.10)' }}>
            {/* Illustration */}
            <img className="rp-illus" src={ILLUSTRATIONS.CLIENT} alt="Family" style={{ width:'85%', maxWidth:340, objectFit:'contain', marginBottom:0, display:'block' }} />
            {/* Footer card */}
            <div className="rp-footer" style={{ width:'100%', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)', borderTop:'1.5px solid rgba(167,243,208,0.6)', padding:'20px 28px 24px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:900, color:'#065F46', marginBottom:6, letterSpacing:'-0.3px' }}>{tr('clientTitle')}</div>
              <div style={{ fontSize:13, color:'#059669', marginBottom:16, lineHeight:1.5 }}>{tr('clientSub')}</div>
              <button className="rp-btn" style={{ background:'#059669', color:'#fff', border:'none', borderRadius:12, padding:'12px 36px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(5,150,105,0.3)' }}>
                {tr('continue')}
              </button>
            </div>
          </div>

          {/* NURSE panel */}
          <div className="rp-panel" onClick={() => setRole('NURSE')}
            style={{ background:'linear-gradient(160deg,#EFF6FF 0%,#DBEAFE 100%)', borderRadius:24, border:'2px solid #BFDBFE', boxShadow:'0 4px 24px rgba(37,99,235,0.10)' }}>
            <img className="rp-illus" src={ILLUSTRATIONS.NURSE} alt="Nurse" style={{ width:'80%', maxWidth:300, objectFit:'contain', marginBottom:0, display:'block' }} />
            <div className="rp-footer" style={{ width:'100%', background:'rgba(255,255,255,0.85)', backdropFilter:'blur(8px)', borderTop:'1.5px solid rgba(191,219,254,0.6)', padding:'20px 28px 24px', textAlign:'center' }}>
              <div style={{ fontSize:22, fontWeight:900, color:'#1e3a5f', marginBottom:6, letterSpacing:'-0.3px' }}>{tr('nurseTitle')}</div>
              <div style={{ fontSize:13, color:'#2563EB', marginBottom:16, lineHeight:1.5 }}>{tr('nurseSub')}</div>
              <button className="rp-btn" style={{ background:'#2563EB', color:'#fff', border:'none', borderRadius:12, padding:'12px 36px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 14px rgba(37,99,235,0.28)' }}>
                {tr('continue')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login form (after role selected) ───────────────────── */
  const isNurse = role === 'NURSE';
  const accent = isNurse ? '#2563EB' : '#059669';
  const accentDark = isNurse ? '#1D4ED8' : '#047857';
  const bgGrad = isNurse ? 'linear-gradient(160deg,#EFF6FF 0%,#DBEAFE 100%)' : 'linear-gradient(160deg,#ECFDF5 0%,#D1FAE5 100%)';

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:'system-ui,sans-serif', background:bgGrad }}>
      <style>{`
        @keyframes formIn { from { opacity:0; transform:translateY(20px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .lf-card { animation: formIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        .lf-inp:focus { border-color:${accent} !important; box-shadow:0 0 0 3px ${accent}22 !important; outline:none; }
        .lf-btn:hover { background:${accentDark} !important; }
      `}</style>

      {/* Left side — illustration */}
      <div style={{ flex:1, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'40px 0 0', minWidth:0 }}>
        <img src={ILLUSTRATIONS[role]} alt={isNurse?'Nurse':'Family'} style={{ maxWidth:'88%', maxHeight:'85vh', objectFit:'contain', display:'block' }} />
      </div>

      {/* Right side — form */}
      <div style={{ width:460, display:'flex', flexDirection:'column', justifyContent:'center', padding:'32px 40px', flexShrink:0 }}>

        {/* Top nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <button onClick={() => { setRole(null); setError(''); }} style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.7)', border:`1px solid ${accent}33`, borderRadius:10, padding:'7px 14px', color:accent, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            {tr('back')}
          </button>
          <div style={{ display:'flex', background:'rgba(255,255,255,0.7)', borderRadius:10, padding:3, border:`1px solid ${accent}22` }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 12px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?accent:'transparent', color:uiLang===l?'#fff':accent, fontFamily:'inherit', transition:'all 0.15s' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Logo + role chip */}
        <div style={{ marginBottom:32 }}>
          <span style={{ fontSize:22, fontWeight:900, color:accent, letterSpacing:'-0.5px' }}>Vonaxity</span>
          <div style={{ marginTop:6, display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, padding:'4px 11px', borderRadius:99, background: isNurse ? '#EFF6FF' : '#ECFDF5', color:accent, border:`1.5px solid ${accent}33`, marginLeft:10 }}>
            <svg width="8" height="8" fill={accent} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/></svg>
            {isNurse ? tr('nurse') : tr('client')}
          </div>
        </div>

        <h1 style={{ fontSize:24, fontWeight:800, color:'#111827', letterSpacing:'-0.5px', marginBottom:6 }}>{tr('welcomeBack')}</h1>
        <p style={{ fontSize:14, color:'#6B7280', marginBottom:28 }}>
          {tr('noAccount')} <Link href={`/${lang}/signup`} style={{ color:accent, fontWeight:600 }}>{tr('signUp')}</Link>
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('email')}</label>
            <input
              className="lf-inp"
              style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#fff', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' }}
              type="email" name="email" autoComplete="email" placeholder="you@email.com" required
              value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:700, color:'#374151', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('password')}</label>
            <input
              className="lf-inp"
              style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#fff', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s, box-shadow 0.15s' }}
              type="password" name="password" autoComplete="current-password" placeholder="••••••••" required
              value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
            />
            <div style={{ textAlign:'right', marginTop:7 }}>
              <Link href={`/${lang}/forgot-password`} style={{ fontSize:12, color:accent, fontWeight:500 }}>{tr('forgotPassword')}</Link>
            </div>
          </div>

          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'11px 14px', fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>
          )}

          <button type="submit" disabled={loading} className="lf-btn"
            style={{ width:'100%', background:accent, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700, cursor:loading?'not-allowed':'pointer', opacity:loading?0.75:1, fontFamily:'inherit', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {loading
              ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 0.8s linear infinite' }}><path d="M12 2a10 10 0 0110 10"/><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/></svg>{tr('loading')}</>
              : tr('submit')
            }
          </button>
        </form>

        {isNurse && (
          <div style={{ marginTop:16, textAlign:'center', fontSize:13, color:'#6B7280' }}>
            {tr('or')} <Link href={`/${lang}/nurse-signup`} style={{ color:accent, fontWeight:600 }}>{tr('nurseSignup')}</Link>
          </div>
        )}

        <div style={{ marginTop:16, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'11px 14px', fontSize:12, color:'#92400E' }}>
          {tr('nonEmergency')} <strong>127</strong>
        </div>
      </div>
    </div>
  );
}
