'use client';
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', secondary:'#059669', secondaryLight:'#ECFDF5' };

const TR = {
  en: {
    title:'Forgot your password?',
    subtitle:"Enter your email and we'll send you a reset link.",
    emailLabel:'Email address',
    sendBtn:'Send reset link', sending:'Sending...',
    backToLogin:'← Back to login',
    checkEmail:'Check your email',
    checkEmailDesc:'We sent a password reset link to',
    checkEmailDesc2:'Check your inbox and click the link.',
    enterEmail:'Please enter your email address.',
    failed:'Failed to send reset email.',
  },
  sq: {
    title:'Keni harruar fjalëkalimin?',
    subtitle:'Futni emailin tuaj dhe do t\'ju dërgojmë një lidhje për rivendosjen e fjalëkalimit.',
    emailLabel:'Adresa e email-it',
    sendBtn:'Dërgo lidhjen e rivendosjes', sending:'Duke dërguar...',
    backToLogin:'← Kthehu te hyrja',
    checkEmail:'Kontrolloni email-in tuaj',
    checkEmailDesc:'Ne dërguam një lidhje rivendosjeje te',
    checkEmailDesc2:'Kontrolloni kutinë hyrëse dhe klikoni lidhjen.',
    enterEmail:'Ju lutemi futni adresën e email-it.',
    failed:'Dërgimi i email-it dështoi.',
  },
};

export default function ForgotPasswordPage({ params }) {
  const lang = params.lang || 'en';
  const tr = (key) => TR[lang]?.[key] || TR.en[key] || key;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleSubmit = async () => {
    if (!email) return setError(tr('enterEmail'));
    setLoading(true); setError('');
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || tr('failed'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(150deg,#EFF6FF 0%,#F8FAFC 50%,#F0FDF4 100%)', padding:24 }}>
      <style>{`.fp-btn:not(:disabled):hover{background:#1D4ED8!important;transform:translateY(-1px)}.fp-btn{transition:all 0.15s}`}</style>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px 36px', maxWidth:420, width:'100%', boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
        <Link href={`/${lang}/login`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:32 }}>Vonaxity</Link>

        {sent ? (
          <div>
            <div style={{ width:56, height:56, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>{tr('checkEmail')}</h2>
            <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24, lineHeight:1.6 }}>{tr('checkEmailDesc')} <strong>{email}</strong>. {tr('checkEmailDesc2')}</p>
            <Link href={`/${lang}/login`} style={{ fontSize:14, color:C.primary, fontWeight:600 }}>{tr('backToLogin')}</Link>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>{tr('title')}</h1>
            <p style={{ fontSize:14, color:C.textTertiary, marginBottom:28 }}>{tr('subtitle')}</p>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('emailLabel')}</label>
              <input style={inp} type="email" placeholder="you@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} autoFocus />
            </div>
            {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:9, padding:'11px 14px', fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>}
            <button className="fp-btn" onClick={handleSubmit} disabled={loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1, marginBottom:16 }}>
              {loading ? tr('sending') : tr('sendBtn')}
            </button>
            <Link href={`/${lang}/login`} style={{ fontSize:13, color:C.textTertiary, display:'block', textAlign:'center' }}>{tr('backToLogin')}</Link>
          </div>
        )}
      </div>
    </div>
  );
}
