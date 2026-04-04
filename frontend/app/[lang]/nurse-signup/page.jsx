'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const CITIES = ['Tirana','Durrës','Elbasan','Fier','Berat','Sarandë','Kukës','Shkodër'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const SERVICES = ['Blood Pressure Check','Glucose Monitoring','Vitals Monitoring','Blood Work Collection','Welfare Check','Post-surgical Care','Medication Administration','General Nursing'];
const LANGUAGES = ['Albanian','English','Italian','Greek','German','French'];
const EXPERIENCE = ['Less than 1 year','1-2 years','3-5 years','6-10 years','10+ years'];

const STEPS = [
  { num:1, label:'Account' },
  { num:2, label:'Profile' },
  { num:3, label:'Verification' },
  { num:4, label:'Availability' },
  { num:5, label:'Submit' },
];

const inp = { width:'100%', padding:'11px 14px', borderRadius:9, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textPrimary, background:C.bgWhite, outline:'none', fontFamily:'inherit', boxSizing:'border-box' };

function ProgressBar({ step }) {
  return (
    <div style={{ marginBottom:32 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        {STEPS.map(s => (
          <div key={s.num} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:step>=s.num?C.primary:C.bg, border:`2px solid ${step>=s.num?C.primary:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:step>=s.num?'#fff':C.textTertiary, marginBottom:4 }}>
              {step>s.num ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : s.num}
            </div>
            <div style={{ fontSize:10, color:step>=s.num?C.primary:C.textTertiary, fontWeight:step===s.num?600:400 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ height:3, background:C.bg, borderRadius:99, overflow:'hidden' }}>
        <div style={{ height:'100%', background:C.primary, borderRadius:99, width:`${((step-1)/4)*100}%`, transition:'width 0.3s' }} />
      </div>
    </div>
  );
}

function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.textPrimary, display:'block', marginBottom:6 }}>
        {label} {required && <span style={{ color:C.error }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize:11, color:C.textTertiary, marginTop:4 }}>{hint}</div>}
    </div>
  );
}

// Step 1: Account
function Step1({ form, setForm, onNext, error }) {
  const valid = form.name && form.email && form.password && form.confirmPassword && form.phone;
  const passMatch = form.password === form.confirmPassword;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Create your account</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Start your journey as a verified Vonaxity nurse.</p>

      <Field label="Full name" required>
        <input style={inp} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full legal name" />
      </Field>
      <Field label="Email address" required>
        <input style={inp} type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com" />
      </Field>
      <Field label="Phone number" required>
        <input style={inp} value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+355 69 000 0000" />
      </Field>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Field label="Password" required>
          <input style={inp} type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Min 8 characters" />
        </Field>
        <Field label="Confirm password" required>
          <input style={{...inp, borderColor:form.confirmPassword&&!passMatch?C.error:C.border}} type="password" value={form.confirmPassword} onChange={e=>setForm(f=>({...f,confirmPassword:e.target.value}))} placeholder="Repeat password" />
        </Field>
      </div>
      {form.confirmPassword && !passMatch && <div style={{ fontSize:13, color:C.error, marginTop:-8, marginBottom:16 }}>Passwords do not match</div>}
      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:16, fontSize:13, color:C.error }}>{error}</div>}
      <button onClick={onNext} disabled={!valid||!passMatch} style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid||!passMatch?0.5:1 }}>
        Continue →
      </button>
    </div>
  );
}

// Step 2: Profile
function Step2({ form, setForm, onNext, onBack }) {
  const toggleItem = (key, val) => setForm(f => ({ ...f, [key]: f[key].includes(val) ? f[key].filter(x=>x!==val) : [...f[key], val] }));
  const valid = form.city && form.bio && form.experience && form.services.length > 0;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Your professional profile</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Tell families about your experience and what you offer.</p>

      <Field label="City" required>
        <select style={inp} value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))}>
          <option value="">Select your city</option>
          {CITIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Years of experience" required>
        <select style={inp} value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))}>
          <option value="">Select experience</option>
          {EXPERIENCE.map(e=><option key={e}>{e}</option>)}
        </select>
      </Field>
      <Field label="Professional bio" required hint="Describe your background, approach, and what makes you a great nurse (min 50 characters)">
        <textarea style={{...inp,minHeight:90,resize:'vertical'}} value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="e.g. I am a licensed nurse with 5 years of experience specialising in elderly care and chronic condition monitoring..." />
      </Field>
      <Field label="Languages spoken">
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {LANGUAGES.map(l=>(
            <button key={l} type="button" onClick={()=>toggleItem('languages',l)} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:99, border:`1.5px solid ${form.languages.includes(l)?C.primary:C.border}`, background:form.languages.includes(l)?C.primaryLight:'transparent', color:form.languages.includes(l)?C.primary:C.textSecondary, cursor:'pointer' }}>
              {l}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Services offered" required>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {SERVICES.map(s=>(
            <button key={s} type="button" onClick={()=>toggleItem('services',s)} style={{ fontSize:12, fontWeight:600, padding:'6px 14px', borderRadius:99, border:`1.5px solid ${form.services.includes(s)?C.secondary:C.border}`, background:form.services.includes(s)?C.secondaryLight:'transparent', color:form.services.includes(s)?C.secondary:C.textSecondary, cursor:'pointer' }}>
              {s}
            </button>
          ))}
        </div>
      </Field>
      <div style={{ display:'flex', gap:10, marginTop:8 }}>
        <button onClick={onBack} style={{ flex:1, background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!valid} style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid?0.5:1 }}>Continue →</button>
      </div>
    </div>
  );
}

// Step 3: Verification
function Step3({ form, setForm, onNext, onBack }) {
  const valid = form.licenseNumber && form.issuingAuthority && form.diplomaConfirmed && form.licenseConfirmed;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Certification & verification</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:8 }}>This step is mandatory. All documents are reviewed only by Vonaxity staff.</p>

      <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:24, fontSize:13, color:'#92400E' }}>
        <strong>Required:</strong> You must provide your nursing license details and confirm you have valid credentials. Vonaxity will verify your license with the issuing authority.
      </div>

      <Field label="License number" required>
        <input style={inp} value={form.licenseNumber} onChange={e=>setForm(f=>({...f,licenseNumber:e.target.value}))} placeholder="e.g. ALB-NURSE-2024-001" />
      </Field>
      <Field label="Issuing authority" required hint="e.g. Order of Nurses of Albania (ONA)">
        <input style={inp} value={form.issuingAuthority} onChange={e=>setForm(f=>({...f,issuingAuthority:e.target.value}))} placeholder="Order of Nurses of Albania" />
      </Field>

      <div style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>Nursing diploma</div>
        <div style={{ fontSize:13, color:C.textSecondary, marginBottom:12 }}>Upload a clear photo or scan of your nursing diploma/degree certificate.</div>
        <div style={{ border:`2px dashed ${form.diplomaConfirmed?C.secondary:C.border}`, borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', background:form.diplomaConfirmed?C.secondaryLight:'transparent' }}
          onClick={()=>setForm(f=>({...f,diplomaConfirmed:!f.diplomaConfirmed,diplomaUrl:!f.diplomaConfirmed?'pending-upload':''}))}>
          {form.diplomaConfirmed ? (
            <div style={{ color:C.secondary, fontSize:14, fontWeight:600 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'block', margin:'0 auto 8px' }}><polyline points="20 6 9 17 4 12"/></svg>
              Diploma confirmed
            </div>
          ) : (
            <div style={{ color:C.textTertiary, fontSize:13 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display:'block', margin:'0 auto 8px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Click to confirm you have your diploma ready to submit
            </div>
          )}
        </div>
      </div>

      <div style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:20, marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>Professional license</div>
        <div style={{ fontSize:13, color:C.textSecondary, marginBottom:12 }}>Upload a photo of your current valid nursing license issued by the Order of Nurses of Albania.</div>
        <div style={{ border:`2px dashed ${form.licenseConfirmed?C.secondary:C.border}`, borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', background:form.licenseConfirmed?C.secondaryLight:'transparent' }}
          onClick={()=>setForm(f=>({...f,licenseConfirmed:!f.licenseConfirmed,licenseUrl:!f.licenseConfirmed?'pending-upload':''}))}>
          {form.licenseConfirmed ? (
            <div style={{ color:C.secondary, fontSize:14, fontWeight:600 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display:'block', margin:'0 auto 8px' }}><polyline points="20 6 9 17 4 12"/></svg>
              License confirmed
            </div>
          ) : (
            <div style={{ color:C.textTertiary, fontSize:13 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display:'block', margin:'0 auto 8px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Click to confirm you have your license ready to submit
            </div>
          )}
        </div>
      </div>

      <div style={{ fontSize:12, color:C.textTertiary, marginBottom:20, lineHeight:1.6 }}>
        By continuing, you confirm that all credentials provided are genuine and accurate. Providing false information may result in permanent removal from the platform.
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onBack} style={{ flex:1, background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!valid} style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid?0.5:1 }}>Continue →</button>
      </div>
    </div>
  );
}

// Step 4: Availability
function Step4({ form, setForm, onNext, onBack }) {
  const toggleDay = (day) => setForm(f => ({ ...f, availability: f.availability.includes(day) ? f.availability.filter(d=>d!==day) : [...f.availability, day] }));
  const valid = form.availability.length > 0;

  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Your availability</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Which days are you available for home visits? You can update this anytime.</p>

      <Field label="Available days" required>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {DAYS.map(day=>(
            <button key={day} type="button" onClick={()=>toggleDay(day)} style={{ padding:'10px 16px', borderRadius:10, border:`1.5px solid ${form.availability.includes(day)?C.primary:C.border}`, background:form.availability.includes(day)?C.primaryLight:'transparent', color:form.availability.includes(day)?C.primary:C.textSecondary, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              {day.slice(0,3)}
            </button>
          ))}
        </div>
        {form.availability.length > 0 && <div style={{ fontSize:12, color:C.textTertiary, marginTop:8 }}>Selected: {form.availability.join(', ')}</div>}
      </Field>

      <Field label="Typical working hours" hint="e.g. 8:00 AM – 5:00 PM">
        <input style={inp} value={form.workingHours} onChange={e=>setForm(f=>({...f,workingHours:e.target.value}))} placeholder="e.g. 8:00 AM – 5:00 PM" />
      </Field>

      <div style={{ background:C.primaryLight, borderRadius:12, padding:'14px 18px', marginBottom:24, fontSize:13, color:'#1E40AF' }}>
        You will only be assigned visits on your available days. Visits typically last 30–60 minutes.
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onBack} style={{ flex:1, background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!valid} style={{ flex:2, background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:!valid?0.5:1 }}>Continue →</button>
      </div>
    </div>
  );
}

// Step 5: Review & Submit
function Step5({ form, onSubmit, onBack, loading, error }) {
  return (
    <div>
      <h2 style={{ fontSize:22, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>Review & submit</h2>
      <p style={{ fontSize:14, color:C.textSecondary, marginBottom:24 }}>Review your application before submitting. Our team will review it within 2-3 business days.</p>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>Account</div>
        {[['Name',form.name],['Email',form.email],['Phone',form.phone]].map(([k,v])=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>Profile</div>
        {[['City',form.city],['Experience',form.experience],['Services',form.services.join(', ')||'None'],['Languages',form.languages.join(', ')||'Albanian'],['Availability',form.availability.join(', ')||'None']].map(([k,v])=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500, textAlign:'right', maxWidth:'60%' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>Verification</div>
        {[['License number',form.licenseNumber],['Issuing authority',form.issuingAuthority],['Diploma',form.diplomaConfirmed?'Confirmed':'Not confirmed'],['License doc',form.licenseConfirmed?'Confirmed':'Not confirmed']].map(([k,v])=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
            <span style={{ color:C.textTertiary }}>{k}</span>
            <span style={{ color:C.textPrimary, fontWeight:500 }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#92400E' }}>
        After submission your account will be set to <strong>Pending Verification</strong>. You will not be able to receive bookings until our admin approves your application.
      </div>

      {error && <div style={{ background:C.errorLight, border:`1px solid #FECACA`, borderRadius:9, padding:'10px 14px', marginBottom:16, fontSize:13, color:C.error }}>{error}</div>}

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onBack} disabled={loading} style={{ flex:1, background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer' }}>← Back</button>
        <button onClick={onSubmit} disabled={loading} style={{ flex:2, background:C.secondary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:15, fontWeight:600, cursor:'pointer', opacity:loading?0.7:1 }}>
          {loading ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    </div>
  );
}

// Success screen
function Success({ name }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 20px' }}>
      <div style={{ width:72, height:72, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, marginBottom:12 }}>Application submitted!</h2>
      <p style={{ fontSize:15, color:C.textSecondary, marginBottom:8, lineHeight:1.7 }}>
        Thank you, <strong>{name}</strong>. Your application is now under review.
      </p>
      <p style={{ fontSize:14, color:C.textTertiary, marginBottom:32, lineHeight:1.7 }}>
        Our team will verify your credentials within 2-3 business days. You will be notified by email once approved. Until then, you can log in to check your status.
      </p>
      <div style={{ background:C.warningLight, border:'1px solid #FDE68A', borderRadius:10, padding:'12px 16px', marginBottom:28, fontSize:13, color:'#92400E', textAlign:'left' }}>
        <strong>Status:</strong> Pending Verification — you cannot receive bookings yet.
      </div>
      <Link href="/en/nurse">
        <button style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px 32px', fontSize:15, fontWeight:600, cursor:'pointer' }}>
          Go to nurse panel
        </button>
      </Link>
    </div>
  );
}

export default function NurseSignup({ params }) {
  const lang = params?.lang || 'en';
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    // Step 1
    name:'', email:'', phone:'', password:'', confirmPassword:'',
    // Step 2
    city:'', bio:'', experience:'', languages:[], services:[],
    // Step 3
    licenseNumber:'', issuingAuthority:'', diplomaConfirmed:false, licenseConfirmed:false, diplomaUrl:'', licenseUrl:'',
    // Step 4
    availability:[], workingHours:'',
  });

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const data = await api.registerNurse({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        bio: form.bio,
        experience: form.experience,
        languages: form.languages,
        services: form.services,
        licenseNumber: form.licenseNumber,
        issuingAuthority: form.issuingAuthority,
        availability: form.availability,
        diplomaUrl: form.diplomaUrl || 'pending',
        licenseUrl: form.licenseUrl || 'pending',
      });
      if (data.token) localStorage.setItem('vonaxity-token', data.token);
      document.cookie = `vonaxity-role=NURSE;path=/;max-age=604800`;
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, fontFamily:"'Inter',system-ui,sans-serif", padding:'24px 16px' }}>
      <div style={{ maxWidth:540, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link href={`/${lang}`} style={{ fontSize:22, fontWeight:700, color:C.primary, letterSpacing:'-0.5px', textDecoration:'none', display:'block', marginBottom:8 }}>Vonaxity</Link>
          {!success && <div style={{ fontSize:13, color:C.textTertiary }}>Nurse application · Already a nurse? <Link href={`/${lang}/login`} style={{ color:C.primary, fontWeight:600 }}>Sign in</Link></div>}
        </div>

        <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'32px 28px', boxShadow:'0 4px 24px rgba(0,0,0,0.06)' }}>
          {success ? (
            <Success name={form.name} />
          ) : (
            <>
              <ProgressBar step={step} />
              {step===1 && <Step1 form={form} setForm={setForm} onNext={()=>{setError('');setStep(2);}} error={error} />}
              {step===2 && <Step2 form={form} setForm={setForm} onNext={()=>setStep(3)} onBack={()=>setStep(1)} />}
              {step===3 && <Step3 form={form} setForm={setForm} onNext={()=>setStep(4)} onBack={()=>setStep(2)} />}
              {step===4 && <Step4 form={form} setForm={setForm} onNext={()=>setStep(5)} onBack={()=>setStep(3)} />}
              {step===5 && <Step5 form={form} onSubmit={handleSubmit} onBack={()=>setStep(4)} loading={loading} error={error} />}
            </>
          )}
        </div>

        {!success && (
          <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:C.textTertiary }}>
            Looking to book care for a loved one? <Link href={`/${lang}/signup`} style={{ color:C.primary, fontWeight:600 }}>Sign up as a client</Link>
          </div>
        )}
      </div>
    </div>
  );
}
