'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const PHOTOS = {
  CLIENT: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80',
  NURSE:  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&q=80',
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
      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui,sans-serif', position: 'relative' }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
          .rp-panel { flex:1; position:relative; overflow:hidden; cursor:pointer; transition:flex 0.45s cubic-bezier(0.4,0,0.2,1); }
          .rp-panel:hover { flex:1.18; }
          .rp-panel:hover .rp-overlay { opacity:0.62 !important; }
          .rp-panel:hover .rp-btn { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.25) !important; }
          .rp-content { animation: fadeUp 0.55s ease both; }
        `}</style>

        {/* Language toggle — top center */}
        <div style={{ position:'absolute', top:20, left:'50%', transform:'translateX(-50%)', zIndex:20, display:'flex', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(8px)', borderRadius:10, padding:3, border:'1px solid rgba(255,255,255,0.15)' }}>
          {['en','sq'].map(l => (
            <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 14px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?'rgba(255,255,255,0.95)':'transparent', color:uiLang===l?'#1e3a5f':'rgba(255,255,255,0.7)', fontFamily:'inherit', transition:'all 0.15s' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Logo — top left */}
        <div style={{ position:'absolute', top:22, left:28, zIndex:20 }}>
          <span style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>Vonaxity</span>
        </div>

        {/* CLIENT panel */}
        <div
          className="rp-panel"
          onClick={() => setRole('CLIENT')}
          onMouseEnter={() => setHovered('CLIENT')}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Background photo */}
          <div style={{ position:'absolute', inset:0, backgroundImage:`url(${PHOTOS.CLIENT})`, backgroundSize:'cover', backgroundPosition:'center', transition:'transform 0.6s ease' }}/>
          {/* Overlay */}
          <div className="rp-overlay" style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(5,150,105,0.80) 0%,rgba(16,185,129,0.68) 100%)', opacity:0.72, transition:'opacity 0.3s' }}/>
          {/* Content */}
          <div className="rp-content" style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 48px', textAlign:'center', gap:20 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'rgba(255,255,255,0.18)', border:'2px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)' }}>
              <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:10, textShadow:'0 2px 16px rgba(0,0,0,0.2)', lineHeight:1.1 }}>{tr('clientTitle')}</div>
              <div style={{ fontSize:15, color:'rgba(255,255,255,0.88)', lineHeight:1.55, maxWidth:280 }}>{tr('clientSub')}</div>
            </div>
            <button className="rp-btn" style={{ marginTop:8, background:'#fff', color:'#059669', border:'none', borderRadius:14, padding:'13px 32px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(0,0,0,0.18)', transition:'transform 0.2s, box-shadow 0.2s', letterSpacing:'0.1px' }}>
              {tr('continue')}
            </button>
          </div>
        </div>

        {/* Divider line */}
        <div style={{ width:2, background:'rgba(255,255,255,0.25)', zIndex:10, flexShrink:0 }}/>

        {/* NURSE panel */}
        <div
          className="rp-panel"
          onClick={() => setRole('NURSE')}
          onMouseEnter={() => setHovered('NURSE')}
          onMouseLeave={() => setHovered(null)}
        >
          <div style={{ position:'absolute', inset:0, backgroundImage:`url(${PHOTOS.NURSE})`, backgroundSize:'cover', backgroundPosition:'center top', transition:'transform 0.6s ease' }}/>
          <div className="rp-overlay" style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,rgba(30,58,95,0.82) 0%,rgba(37,99,235,0.72) 100%)', opacity:0.78, transition:'opacity 0.3s' }}/>
          <div className="rp-content" style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 48px', textAlign:'center', gap:20 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'rgba(255,255,255,0.18)', border:'2px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)' }}>
              <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:32, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', marginBottom:10, textShadow:'0 2px 16px rgba(0,0,0,0.2)', lineHeight:1.1 }}>{tr('nurseTitle')}</div>
              <div style={{ fontSize:15, color:'rgba(255,255,255,0.88)', lineHeight:1.55, maxWidth:280 }}>{tr('nurseSub')}</div>
            </div>
            <button className="rp-btn" style={{ marginTop:8, background:'#fff', color:'#2563EB', border:'none', borderRadius:14, padding:'13px 32px', fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 16px rgba(0,0,0,0.18)', transition:'transform 0.2s, box-shadow 0.2s', letterSpacing:'0.1px' }}>
              {tr('continue')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Login form (after role selected) ───────────────────── */
  const isNurse = role === 'NURSE';
  const accent = isNurse ? '#2563EB' : '#059669';
  const accentDark = isNurse ? '#1D4ED8' : '#047857';
  const photo = PHOTOS[role];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui,sans-serif', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes formIn { from { opacity:0; transform:translateY(20px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        .lf-card { animation: formIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        .lf-inp:focus { border-color:${accent} !important; box-shadow:0 0 0 3px ${accent}22 !important; outline:none; }
        .lf-btn:hover { background:${accentDark} !important; }
      `}</style>

      {/* Full-bleed blurred background */}
      <div style={{ position:'absolute', inset:0, backgroundImage:`url(${photo})`, backgroundSize:'cover', backgroundPosition:'center top', filter:'blur(12px)', transform:'scale(1.08)' }}/>
      <div style={{ position:'absolute', inset:0, background: isNurse ? 'rgba(15,30,60,0.72)' : 'rgba(5,70,40,0.70)' }}/>

      {/* Back button */}
      <button onClick={() => { setRole(null); setError(''); }} style={{ position:'absolute', top:22, left:24, zIndex:10, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:10, padding:'8px 16px', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', gap:6 }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        {tr('back')}
      </button>

      {/* Lang toggle */}
      <div style={{ position:'absolute', top:22, right:24, zIndex:10, display:'flex', background:'rgba(0,0,0,0.3)', backdropFilter:'blur(8px)', borderRadius:10, padding:3, border:'1px solid rgba(255,255,255,0.15)' }}>
        {['en','sq'].map(l => (
          <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 12px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?'rgba(255,255,255,0.95)':'transparent', color:uiLang===l?'#1e3a5f':'rgba(255,255,255,0.7)', fontFamily:'inherit', transition:'all 0.15s' }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="lf-card" style={{ position:'relative', zIndex:2, background:'rgba(255,255,255,0.97)', borderRadius:24, padding:'38px 36px', maxWidth:420, width:'100%', margin:24, boxShadow:'0 24px 64px rgba(0,0,0,0.28)', backdropFilter:'blur(2px)' }}>

        {/* Role chip + logo */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <span style={{ fontSize:20, fontWeight:900, color:accent, letterSpacing:'-0.5px' }}>Vonaxity</span>
          <span style={{ fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:99, background: isNurse ? '#EFF6FF' : '#ECFDF5', color:accent, border:`1.5px solid ${accent}33`, display:'flex', alignItems:'center', gap:5 }}>
            <svg width="10" height="10" fill={accent} viewBox="0 0 24 24"><circle cx="12" cy="12" r="12"/></svg>
            {isNurse ? tr('nurse') : tr('client')}
          </span>
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
