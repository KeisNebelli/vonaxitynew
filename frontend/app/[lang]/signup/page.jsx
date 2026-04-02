'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

const C = { teal: '#0e7490', sage: '#16a34a', border: '#e7e5e4', neutralDark: '#1c1917', neutralMid: '#78716c', neutral: '#f8f7f4' };
const CITIES = ['Tirana', 'Durrës', 'Elbasan', 'Fier', 'Berat', 'Sarandë', 'Kukës', 'Shkodër'];

function SignupContent({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', country: '',
    plan: searchParams.get('plan') || 'standard',
    relativeName: '', relativeCity: '', relativeAddress: '', relativePhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inp = { width: '100%', padding: '11px 13px', borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 12, boxSizing: 'border-box' };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await api.register(form);
      document.cookie = `vonaxity-role=CLIENT;path=/;max-age=604800`;
      document.cookie = `vonaxity-token=set;path=/;max-age=604800`;
      window.location.href = `/${lang}/dashboard`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.neutral, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.border}`, padding: '32px 28px', maxWidth: 500, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <Link href={`/${lang}`} style={{ fontSize: 20, fontWeight: 700, color: C.teal, fontFamily: 'Georgia,serif', textDecoration: 'none', display: 'block', marginBottom: 20 }}>
          Von<span style={{ color: C.sage }}>ax</span>ity
        </Link>

        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? C.teal : C.border, transition: 'background 0.2s' }} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.neutralDark, marginBottom: 4 }}>Choose your plan</h2>
            <p style={{ fontSize: 13, color: C.neutralMid, marginBottom: 20 }}>7-day free trial. No card required today.</p>
            {[{ name: 'basic', price: '€30', visits: '1 visit/month' }, { name: 'standard', price: '€50', visits: '2 visits/month' }, { name: 'premium', price: '€120', visits: '4 visits/month' }].map((p) => (
              <div key={p.name} onClick={() => setForm({ ...form, plan: p.name })} style={{ borderRadius: 12, padding: '14px 16px', marginBottom: 10, cursor: 'pointer', border: `2px solid ${form.plan === p.name ? C.teal : C.border}`, background: form.plan === p.name ? '#e0f2fe' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark, textTransform: 'capitalize' }}>{p.name} — {p.visits}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.teal }}>{p.price}/mo</div>
              </div>
            ))}
            <button onClick={() => setStep(2)} style={{ width: '100%', background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 6 }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.neutralDark, marginBottom: 16 }}>Your details</h2>
            <input style={inp} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input style={inp} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input style={inp} type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input style={inp} type="tel" placeholder="Phone (WhatsApp)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <select style={{ ...inp }} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              <option value="">Your country...</option>
              {['United Kingdom', 'Italy', 'Germany', 'Greece', 'USA', 'Albania', 'Other'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button onClick={() => setStep(1)} style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 10, border: `2px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!form.name || !form.email || !form.password} style={{ flex: 1, background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: (!form.name || !form.email || !form.password) ? 0.4 : 1 }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.neutralDark, marginBottom: 16 }}>Your loved one's details</h2>
            <input style={inp} placeholder="Their full name" value={form.relativeName} onChange={(e) => setForm({ ...form, relativeName: e.target.value })} />
            <select style={{ ...inp }} value={form.relativeCity} onChange={(e) => setForm({ ...form, relativeCity: e.target.value })}>
              <option value="">City in Albania...</option>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input style={inp} placeholder="Their home address" value={form.relativeAddress} onChange={(e) => setForm({ ...form, relativeAddress: e.target.value })} />
            <input style={inp} type="tel" placeholder="Their phone number" value={form.relativePhone} onChange={(e) => setForm({ ...form, relativePhone: e.target.value })} />
            {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{error}</div>}
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400e', marginBottom: 14 }}>
              ⚠️ Vonaxity is non-emergency care only. For emergencies call <strong>127</strong>.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: '0 0 auto', padding: '12px 20px', borderRadius: 10, border: `2px solid ${C.border}`, background: '#fff', cursor: 'pointer', fontWeight: 600 }}>← Back</button>
              <button onClick={submit} disabled={loading || !form.relativeName || !form.relativeCity} style={{ flex: 1, background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Start Free Trial →'}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: C.neutralMid }}>
          Already have an account? <Link href={`/${lang}/login`} style={{ color: C.teal, fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent params={params} />
    </Suspense>
  );
}