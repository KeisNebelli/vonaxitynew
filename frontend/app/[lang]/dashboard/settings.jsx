'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { t } from '@/translations';
const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6' };
const CITIES_AL = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];
const COUNTRIES = ['United Kingdom','Italy','Germany','Greece','USA','Albania','Other'];

// Defined OUTSIDE component to prevent remounting on every keystroke
function SectionCard({ title, subtitle, children }) {
  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize:13, color:C.textTertiary, marginTop:3 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

export default function Settings({ initialUser, initialRelative, lang = 'en' }) {
  const tr = (key) => t(lang, key);
  const [profile, setProfile] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    phone: initialUser?.phone || '',
    country: initialUser?.country || '',
    city: initialUser?.city || '',
  });
  const [rel, setRel] = useState({
    name: initialRelative?.name || '',
    city: initialRelative?.city || '',
    address: initialRelative?.address || '',
    phone: initialRelative?.phone || '',
    age: initialRelative?.age || '',
    healthNotes: initialRelative?.healthNotes || '',
  });
  const [password, setPassword] = useState({ current:'', newPass:'', confirm:'' });
  const [contact, setContact] = useState({ preferredContact:'email', emergencyName:'', emergencyPhone:'' });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);
  const [passStatus, setPassStatus] = useState(null);
  const [passError, setPassError] = useState('');

  const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

  const handleSaveProfile = async () => {
    setSaving(true); setProfileStatus(null);
    try {
      await api.updateProfile({ name:profile.name, phone:profile.phone, country:profile.country, city:profile.city });
      if (initialRelative?.id) {
        await api.updateRelative(initialRelative.id, { name:rel.name, city:rel.city, address:rel.address, phone:rel.phone, age:rel.age||null, healthNotes:rel.healthNotes });
      }
      setProfileStatus('success');
      setTimeout(() => setProfileStatus(null), 4000);
    } catch (err) {
      setProfileStatus('error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    setPassError('');
    if (!password.current || !password.newPass || !password.confirm) return setPassError(tr("settings.allRequired"));
    if (password.newPass.length < 8) return setPassError(tr("settings.passLength"));
    if (password.newPass !== password.confirm) return setPassError(tr("settings.passMismatch"));
    setSavingPass(true);
    try {
      await api.updatePassword({ currentPassword:password.current, newPassword:password.newPass });
      setPassword({ current:'', newPass:'', confirm:'' });
      setPassStatus('success');
      setTimeout(() => setPassStatus(null), 4000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password');
    } finally { setSavingPass(false); }
  };

  return (
    <div style={{ maxWidth:620 }}>
      <SectionCard title={tr("settings.profileInfo")} subtitle={tr("settings.profileSub")}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label={tr("settings.fullName")}>
            <input style={inp} value={profile.name} onChange={e => setProfile(p => ({...p, name:e.target.value}))} placeholder="Your full name" />
          </Field>
          <Field label={tr("settings.email")}>
            <input style={{...inp, background:C.bgSubtle, color:C.textTertiary}} value={profile.email} disabled />
          </Field>
          <Field label={tr("settings.phone")}>
            <input style={inp} value={profile.phone} onChange={e => setProfile(p => ({...p, phone:e.target.value}))} placeholder="+44 7700 000000" />
          </Field>
          <Field label={tr("settings.country")}>
            <select style={inp} value={profile.country} onChange={e => setProfile(p => ({...p, country:e.target.value}))}>
              <option value="">Select country</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard title={tr("settings.lovedOneTitle")} subtitle={tr("settings.lovedOneSub")}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label={tr("settings.theirName")}>
            <input style={inp} value={rel.name} onChange={e => setRel(r => ({...r, name:e.target.value}))} />
          </Field>
          <Field label={tr("settings.theirAge")}>
            <input style={inp} type="number" value={rel.age} onChange={e => setRel(r => ({...r, age:e.target.value}))} placeholder="e.g. 74" />
          </Field>
          <Field label={tr("settings.theirCity")}>
            <select style={inp} value={rel.city} onChange={e => setRel(r => ({...r, city:e.target.value}))}>
              <option value="">Select city</option>
              {CITIES_AL.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label={tr("settings.theirPhone")}>
            <input style={inp} value={rel.phone} onChange={e => setRel(r => ({...r, phone:e.target.value}))} placeholder="+355 69 000 0000" />
          </Field>
        </div>
        <Field label={tr("settings.homeAddress")}>
          <input style={inp} value={rel.address} onChange={e => setRel(r => ({...r, address:e.target.value}))} placeholder="Street address in Albania" />
        </Field>
        <Field label={tr("settings.healthNotes")}>
          <textarea style={{...inp, minHeight:80, resize:'vertical'}} value={rel.healthNotes} onChange={e => setRel(r => ({...r, healthNotes:e.target.value}))} placeholder="e.g. Diabetes Type 2, takes Metformin daily..." />
        </Field>
      </SectionCard>

      <SectionCard title={tr("settings.contactPref")} subtitle={tr("settings.contactSub")}>
        <Field label={tr("settings.preferredContact")}>
          <div style={{ display:'flex', gap:10 }}>
            {['email','phone','whatsapp'].map(method => (
              <button key={method} onClick={() => setContact(c => ({...c, preferredContact:method}))} style={{ flex:1, padding:'10px', borderRadius:9, border:`1.5px solid ${contact.preferredContact===method?C.primary:C.border}`, background:contact.preferredContact===method?C.primaryLight:'transparent', color:contact.preferredContact===method?C.primary:C.textSecondary, fontSize:13, fontWeight:600, cursor:'pointer', textTransform:'capitalize' }}>
                {method}
              </button>
            ))}
          </div>
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label={tr("settings.emergencyName")}>
            <input style={inp} value={contact.emergencyName} onChange={e => setContact(c => ({...c, emergencyName:e.target.value}))} placeholder="Contact name" />
          </Field>
          <Field label={tr("settings.emergencyPhone")}>
            <input style={inp} value={contact.emergencyPhone} onChange={e => setContact(c => ({...c, emergencyPhone:e.target.value}))} placeholder="+44 7700 000000" />
          </Field>
        </div>
      </SectionCard>

      {profileStatus==='success' && (
        <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:10, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:C.secondary }}>Changes saved successfully!</span>
        </div>
      )}
      {profileStatus==='error' && (
        <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <span style={{ fontSize:14, color:C.error }}>Failed to save. Please try again.</span>
        </div>
      )}
      <button onClick={handleSaveProfile} disabled={saving} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:12, padding:'14px', fontSize:15, fontWeight:600, cursor:'pointer', marginBottom:28, opacity:saving?0.7:1 }}>
        {saving ? tr("settings.saving") : tr("settings.saveChanges")}
      </button>

      <SectionCard title={tr("settings.security")} subtitle={tr("settings.securitySub")}>
        <Field label={tr("settings.currentPassword")}>
          <input style={inp} type="password" value={password.current} onChange={e => setPassword(p => ({...p, current:e.target.value}))} placeholder="••••••••" />
        </Field>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Field label={tr("settings.newPassword")}>
            <input style={inp} type="password" value={password.newPass} onChange={e => setPassword(p => ({...p, newPass:e.target.value}))} placeholder="Min 8 characters" />
          </Field>
          <Field label={tr("settings.confirmPassword")}>
            <input style={inp} type="password" value={password.confirm} onChange={e => setPassword(p => ({...p, confirm:e.target.value}))} placeholder="Repeat password" />
          </Field>
        </div>
        {passError && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.error }}>{passError}</div>}
        {passStatus==='success' && <div style={{ background:C.secondaryLight, border:`1px solid #A7F3D0`, borderRadius:8, padding:'10px 14px', marginBottom:12, fontSize:13, color:C.secondary, fontWeight:600 }}>Password updated successfully!</div>}
        <button onClick={handleChangePassword} disabled={savingPass} style={{ background:C.bgSubtle, color:C.textPrimary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'11px 24px', fontSize:14, fontWeight:600, cursor:'pointer', opacity:savingPass?0.7:1 }}>
          {savingPass ? tr("settings.updating") : tr("settings.updatePassword")}
        </button>
      </SectionCard>

      <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid #FECACA`, padding:'24px', marginBottom:20 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.error, marginBottom:6 }}>Danger zone</div>
        <div style={{ fontSize:13, color:C.textSecondary, marginBottom:16 }}>These actions cannot be undone.</div>
        <button style={{ background:C.errorLight, color:C.error, border:`1.5px solid #FECACA`, borderRadius:9, padding:'10px 20px', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          Cancel subscription
        </button>
      </div>
    </div>
  );
}
