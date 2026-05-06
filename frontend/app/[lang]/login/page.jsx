'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const ILLUSTRATIONS = {
  CLIENT: '/family-care.png',
  NURSE:  '/nurse-hero.png',
};

const TR = {
  en: {
    clientTitle: 'I need care',
    clientSub: 'Book trusted home nursing care for your loved ones',
    clientFeatures: ['Verified nurses at home', 'Health reports after every visit', 'Cancel anytime'],
    nurseTitle: "I'm a Nurse",
    nurseSub: 'Manage your visits and grow your practice',
    nurseFeatures: ['Flexible schedule', 'Earn per visit', 'Admin-verified profile'],
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
    legalDisclaimer: 'Vonaxity provides non-emergency care services and does not offer medical advice. All care is provided by independent professionals. Always verify your caregiver\'s identity and consult a licensed provider for medical decisions. In emergencies, contact local emergency services immediately.',
    or: 'or',
    nurseSignup: 'Apply as a nurse',
    backToHome: '← Back to home',
  },
  sq: {
    clientTitle: 'Kam nevojë për kujdes',
    clientSub: 'Rezervoni kujdes infermieror për të afërmit tuaj',
    clientFeatures: ['Infermierë të verifikuar në shtëpi', 'Raporte shëndetësore pas çdo vizite', 'Anulim kur të dëshironi'],
    nurseTitle: 'Jam Infermiere',
    nurseSub: 'Menaxhoni vizitat dhe zgjeroni praktikën tuaj',
    nurseFeatures: ['Orar fleksibël', 'Fitoni për çdo vizitë', 'Profil i verifikuar'],
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
    legalDisclaimer: 'Vonaxity ofron shërbime kujdesi jo-urgjent dhe nuk ofron këshilla mjekësore. I gjithë kujdesi ofrohet nga profesionistë të pavarur. Gjithmonë verifikoni identitetin e kujdestarit tuaj dhe konsultohuni me një ofrues të licencuar për vendime mjekësore. Në raste urgjente, kontaktoni menjëherë shërbimet e urgjencës lokale.',
    or: 'ose',
    nurseSignup: 'Aplikoni si infermiere',
    backToHome: '← Kthehu në faqen kryesore',
  },
};

function CheckIcon({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export default function LoginPage({ params }) {
  const lang = params.lang || 'en';
  const [uiLang, setUiLang] = useState(lang);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const tr  = (key) => TR[uiLang]?.[key] || TR.en[key] || key;
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
      const redirectMap = { CLIENT:`/${lang}/dashboard`, NURSE:`/${lang}/nurse`, ADMIN:`/${lang}/admin` };
      window.location.href = redirectMap[data.user.role] || `/${lang}/dashboard`;
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const isNurse  = role === 'NURSE';
  const accent   = isNurse ? '#2563EB' : '#059669';
  const accentDk = isNurse ? '#1D4ED8' : '#047857';
  const accentLt = isNurse ? '#EFF6FF'  : '#ECFDF5';
  const clientGrad = 'linear-gradient(160deg,rgba(4,68,48,0.78) 0%,rgba(5,120,78,0.55) 100%)';
  const nurseGrad  = 'linear-gradient(160deg,rgba(17,50,130,0.78) 0%,rgba(37,99,235,0.55) 100%)';

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Inter',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .rp-panel { flex:1; cursor:pointer; transition:flex 0.45s cubic-bezier(0.4,0,0.2,1); position:relative; overflow:hidden; }
        .rp-panel:hover { flex:1.16; }
        .rp-panel:hover .rp-illus { transform:scale(1.06); }
        .rp-panel:hover .rp-cta { transform:translateY(-2px); box-shadow:0 10px 28px rgba(0,0,0,0.25)!important; }
        .rp-illus { transition:transform 0.45s cubic-bezier(0.4,0,0.2,1); }
        .rp-cta   { transition:transform 0.2s, box-shadow 0.2s; }
        .lf-inp:focus { border-color:${accent}!important; box-shadow:0 0 0 3px ${accent}20!important; outline:none; }
        .lf-btn:hover:not(:disabled) { background:${accentDk}!important; transform:translateY(-1px); }
        .lf-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:30, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 32px' }}>
        <Link href={`/${lang}`} style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.5px', textDecoration:'none', textShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
          Vonaxity
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link href={`/${lang}`} style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.7)', textDecoration:'none', background:'rgba(0,0,0,0.2)', backdropFilter:'blur(8px)', padding:'6px 14px', borderRadius:99, border:'1px solid rgba(255,255,255,0.15)' }}>
            {tr('backToHome')}
          </Link>
          <div style={{ display:'flex', background:'rgba(0,0,0,0.28)', backdropFilter:'blur(10px)', borderRadius:10, padding:3, border:'1px solid rgba(255,255,255,0.18)' }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={()=>switchLang(l)} style={{ padding:'5px 13px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', background:uiLang===l?'rgba(255,255,255,0.92)':'transparent', color:uiLang===l?'#1e3a5f':'rgba(255,255,255,0.75)', fontFamily:'inherit', transition:'all 0.15s' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Split panels ── */}
      <div style={{ display:'flex', flex:1, minHeight:'100vh' }}>

        {/* CLIENT */}
        <div className="rp-panel" onClick={() => { setRole('CLIENT'); setError(''); }} style={{ background:'#064e3b' }}>
          <img className="rp-illus" src={ILLUSTRATIONS.CLIENT} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}/>
          <div style={{ position:'absolute', inset:0, background: clientGrad, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 100%)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 44px 60px', textAlign:'center', gap:16, animation:'fadeUp 0.5s ease both' }}>
            <div style={{ width:68, height:68, borderRadius:20, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div style={{ fontSize:42, fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.05, textShadow:'0 2px 24px rgba(0,0,0,0.4)' }}>{tr('clientTitle')}</div>
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65, maxWidth:240 }}>{tr('clientSub')}</div>
            {/* Feature bullets */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4, width:'100%', maxWidth:240 }}>
              {tr('clientFeatures').map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:'rgba(255,255,255,0.9)', fontWeight:500 }}>
                  <div style={{ width:20, height:20, borderRadius:99, background:'rgba(52,211,153,0.25)', border:'1px solid rgba(52,211,153,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <CheckIcon color="#34D399"/>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <button className="rp-cta" style={{ marginTop:12, background:'#fff', color:'#059669', border:'none', borderRadius:14, padding:'14px 44px', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 20px rgba(0,0,0,0.28)', letterSpacing:'-0.2px' }}>
              {tr('continue')}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width:2, background:'rgba(255,255,255,0.2)', zIndex:5, flexShrink:0 }}/>

        {/* NURSE */}
        <div className="rp-panel" onClick={() => { setRole('NURSE'); setError(''); }} style={{ background:'#1e3a5f' }}>
          <img className="rp-illus" src={ILLUSTRATIONS.NURSE} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}/>
          <div style={{ position:'absolute', inset:0, background: nurseGrad, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 100%)', pointerEvents:'none' }}/>
          <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'100px 44px 60px', textAlign:'center', gap:16, animation:'fadeUp 0.5s ease 0.08s both' }}>
            <div style={{ width:68, height:68, borderRadius:20, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1.5px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div style={{ fontSize:42, fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.05, textShadow:'0 2px 24px rgba(0,0,0,0.4)' }}>{tr('nurseTitle')}</div>
            <div style={{ fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.65, maxWidth:240 }}>{tr('nurseSub')}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4, width:'100%', maxWidth:240 }}>
              {tr('nurseFeatures').map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:9, fontSize:13, color:'rgba(255,255,255,0.9)', fontWeight:500 }}>
                  <div style={{ width:20, height:20, borderRadius:99, background:'rgba(147,197,253,0.25)', border:'1px solid rgba(147,197,253,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <CheckIcon color="#93C5FD"/>
                  </div>
                  {f}
                </div>
              ))}
            </div>
            <button className="rp-cta" style={{ marginTop:12, background:'#fff', color:'#2563EB', border:'none', borderRadius:14, padding:'14px 44px', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 4px 20px rgba(0,0,0,0.28)', letterSpacing:'-0.2px' }}>
              {tr('continue')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Login modal ── */}
      {role && (
        <div onClick={() => { setRole(null); setError(''); }}
          style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)', padding:24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:'#fff', borderRadius:24, width:'100%', maxWidth:420, boxShadow:'0 32px 80px rgba(0,0,0,0.35)', animation:'modalIn 0.3s cubic-bezier(0.4,0,0.2,1) both', overflow:'hidden' }}>

            {/* Gradient top accent bar */}
            <div style={{ height:5, background: isNurse ? 'linear-gradient(90deg,#1D4ED8,#7C3AED)' : 'linear-gradient(90deg,#059669,#0891B2)' }}/>

            <div style={{ padding:'28px 32px 32px' }}>
              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
                <div>
                  <div style={{ fontSize:19, fontWeight:900, color:accent, letterSpacing:'-0.3px', marginBottom:6 }}>Vonaxity</div>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 12px', borderRadius:99, background:accentLt, color:accent, border:`1.5px solid ${accent}30`, fontSize:12, fontWeight:700 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:accent }}/>
                    {isNurse ? tr('nurse') : tr('client')}
                  </div>
                </div>
                <button onClick={() => { setRole(null); setError(''); }}
                  style={{ width:36, height:36, borderRadius:10, border:'1.5px solid #E5E7EB', background:'#F9FAFB', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#9CA3AF', fontFamily:'inherit', fontSize:15, transition:'all 0.15s' }}>
                  ✕
                </button>
              </div>

              <h2 style={{ fontSize:24, fontWeight:800, color:'#111827', letterSpacing:'-0.6px', marginBottom:4 }}>{tr('welcomeBack')}</h2>
              <p style={{ fontSize:13, color:'#6B7280', marginBottom:24, lineHeight:1.5 }}>
                {tr('noAccount')} <Link href={`/${lang}/signup?role=${isNurse?'nurse':'client'}`} style={{ color:accent, fontWeight:600, textDecoration:'none' }}>{tr('signUp')}</Link>
              </p>

              <form onSubmit={handleLogin}>
                {/* Email field */}
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#374151', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('email')}</label>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <input className="lf-inp"
                      style={{ width:'100%', padding:'12px 14px 12px 40px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#FAFAFA', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s,box-shadow 0.15s,background 0.15s' }}
                      type="email" autoComplete="email" placeholder="you@email.com" required
                      value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                </div>

                {/* Password field */}
                <div style={{ marginBottom:8 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:'#374151', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>{tr('password')}</label>
                  <div style={{ position:'relative' }}>
                    <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF', pointerEvents:'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    </div>
                    <input className="lf-inp"
                      style={{ width:'100%', padding:'12px 44px 12px 40px', borderRadius:11, border:'1.5px solid #E5E7EB', fontSize:14, color:'#111827', background:'#FAFAFA', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s,box-shadow 0.15s,background 0.15s' }}
                      type={showPass ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••" required
                      value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
                    <button type="button" onClick={()=>setShowPass(s=>!s)}
                      style={{ position:'absolute', right:13, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF', padding:0, display:'flex', alignItems:'center' }}>
                      {showPass
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  <div style={{ textAlign:'right', marginTop:6 }}>
                    <Link href={`/${lang}/forgot-password`} style={{ fontSize:12, color:accent, fontWeight:600, textDecoration:'none' }}>{tr('forgotPassword')}</Link>
                  </div>
                </div>

                {error && (
                  <div style={{ display:'flex', alignItems:'center', gap:9, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#DC2626', marginBottom:14 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="lf-btn"
                  style={{ width:'100%', background:accent, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginTop:6, transition:'background 0.15s,transform 0.1s', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 4px 14px ${accent}40` }}>
                  {loading
                    ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 0.8s linear infinite'}}><path d="M12 2a10 10 0 0110 10"/><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/></svg>{tr('loading')}</>
                    : tr('submit')
                  }
                </button>
              </form>

              {isNurse && (
                <div style={{ marginTop:14, textAlign:'center', fontSize:13, color:'#6B7280' }}>
                  {tr('or')} <Link href={`/${lang}/nurse-signup`} style={{ color:accent, fontWeight:600, textDecoration:'none' }}>{tr('nurseSignup')}</Link>
                </div>
              )}

              {/* Trust badges */}
              <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:20, paddingTop:16, borderTop:'1px solid #F3F4F6' }}>
                {[
                  { icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, label:'Secure login' },
                  { icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label:'Verified platform' },
                  { icon:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, label:'Non-emergency only' },
                ].map(b => (
                  <div key={b.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'#9CA3AF' }}>
                    <span style={{ color:'#D1D5DB' }}>{b.icon}</span>{b.label}
                  </div>
                ))}
              </div>

              {/* Emergency note */}
              <div style={{ marginTop:14, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', gap:9, fontSize:12, color:'#92400E' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {tr('nonEmergency')} <strong>127</strong>
              </div>

              <p style={{ marginTop:12, fontSize:11, color:'#9CA3AF', lineHeight:1.65, textAlign:'center', margin:'12px 0 0' }}>
                {tr('legalDisclaimer')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
