'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', secondary:'#059669', secondaryLight:'#ECFDF5' };

const TR = {
  en: {
    title:'Set new password',
    subtitle:'Choose a strong password for your account.',
    newPassword:'New password', confirmPassword:'Confirm password',
    minChars:'Min. 8 characters', repeatPassword:'Repeat your password',
    updateBtn:'Update password', updating:'Updating...',
    done:'Password updated',
    doneDesc:'Your password has been reset successfully.',
    signIn:'Sign in →',
    invalidLink:'Invalid link',
    invalidLinkDesc:'This reset link is invalid. Please request a new one.',
    requestNew:'Request new link →',
    tooShort:'Password must be at least 8 characters.',
    noMatch:'Passwords do not match.',
    noToken:'Invalid reset link. Please request a new one.',
    failed:'Failed to reset password. The link may have expired.',
    loading:'Loading...',
  },
  sq: {
    title:'Vendosni fjalëkalimin e ri',
    subtitle:'Zgjidhni një fjalëkalim të fortë për llogarinë tuaj.',
    newPassword:'Fjalëkalimi i ri', confirmPassword:'Konfirmoni fjalëkalimin',
    minChars:'Min. 8 karaktere', repeatPassword:'Përsëritni fjalëkalimin',
    updateBtn:'Përditëso fjalëkalimin', updating:'Duke përditësuar...',
    done:'Fjalëkalimi u përditësua',
    doneDesc:'Fjalëkalimi juaj u rivendos me sukses.',
    signIn:'Hyr →',
    invalidLink:'Lidhje e pavlefshme',
    invalidLinkDesc:'Kjo lidhje rivendosjeje është e pavlefshme. Kërkoni një të re.',
    requestNew:'Kërko lidhje të re →',
    tooShort:'Fjalëkalimi duhet të ketë të paktën 8 karaktere.',
    noMatch:'Fjalëkalimet nuk përputhen.',
    noToken:'Lidhje e pavlefshme. Ju lutemi kërkoni një të re.',
    failed:'Rivendosja dështoi. Lidhja mund të ketë skaduar.',
    loading:'Duke ngarkuar...',
  },
};

function ResetForm({ lang }) {
  const tr = (key) => TR[lang]?.[key] || TR.en[key] || key;
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleSubmit = async () => {
    if (!password || password.length < 8) return setError(tr('tooShort'));
    if (password !== confirm) return setError(tr('noMatch'));
    if (!token) return setError(tr('noToken'));
    setLoading(true); setError('');
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || tr('failed'));
    } finally { setLoading(false); }
  };

  if (!token) return (
    <div>
      <h2 style={{ fontSize:20, fontWeight:700, color:'#DC2626', marginBottom:8 }}>{tr('invalidLink')}</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:20 }}>{tr('invalidLinkDesc')}</p>
      <Link href={`/${lang}/forgot-password`} style={{ color:C.primary, fontWeight:600, fontSize:14 }}>{tr('requestNew')}</Link>
    </div>
  );

  if (done) return (
    <div>
      <div style={{ width:56, height:56, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>{tr('done')}</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>{tr('doneDesc')}</p>
      <Link href={`/${lang}/login`} style={{ display:'inline-block', background:C.primary, color:'#fff', textDecoration:'none', padding:'12px 28px', borderRadius:10, fontWeight:600, fontSize:14 }}>{tr('signIn')}</Link>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>{tr('title')}</h1>
      <p style={{ fontSize:14, color:C.textTertiary, marginBottom:28 }}>{tr('subtitle')}</p>
      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('newPassword')}</label>
        <input style={inp} type="password" placeholder={tr('minChars')} value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:13, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{tr('confirmPassword')}</label>
        <input style={inp} type="password" placeholder={tr('repeatPassword')} value={confirm} onChange={e=>setConfirm(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSubmit()} />
      </div>
      {error && <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:9, padding:'11px 14px', fontSize:13, color:'#DC2626', marginBottom:16 }}>{error}</div>}
      <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
        {loading ? tr('updating') : tr('updateBtn')}
      </button>
    </div>
  );
}

export default function ResetPasswordPage({ params }) {
  const lang = params.lang || 'en';
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, padding:24 }}>
      <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px 36px', maxWidth:420, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
        <Link href={`/${lang}/login`} style={{ fontSize:20, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', display:'block', marginBottom:32 }}>Vonaxity</Link>
        <Suspense fallback={<div style={{ color:C.textTertiary, fontSize:14 }}>{TR[lang]?.loading || 'Loading...'}</div>}>
          <ResetForm lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}
