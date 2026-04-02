import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a',
  neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4',
};

const SERVICES = [
  { icon: '❤️', title: 'Blood Pressure Check', desc: 'Regular monitoring for hypertension and cardiovascular health.' },
  { icon: '🩸', title: 'Glucose Check', desc: 'Accurate blood sugar monitoring for diabetic patients.' },
  { icon: '📊', title: 'Vitals Monitoring', desc: 'Full vitals — heart rate, temperature, oxygen, respiratory rate.' },
  { icon: '🧪', title: 'Blood Work', desc: 'In-home sample collection sent to certified labs.' },
  { icon: '👁️', title: 'Welfare Check', desc: 'A caring visit to ensure your loved one is safe and well.' },
  { icon: '🏥', title: 'General Nurse Visit', desc: 'Comprehensive home nursing for any non-emergency need.' },
];

const PLANS = [
  { name: 'Basic', price: '€30', visits: '1 visit/month', featured: false },
  { name: 'Standard', price: '€50', visits: '2 visits/month', featured: true },
  { name: 'Premium', price: '€120', visits: '4 visits/month', featured: false },
];

const CITIES = ['Tirana', 'Durrës', 'Elbasan', 'Fier', 'Berat', 'Sarandë', 'Kukës', 'Shkodër'];

const FAQS = [
  { q: 'Is Vonaxity for emergencies?', a: 'No. For emergencies in Albania, call 127 immediately. Vonaxity is non-emergency care only.' },
  { q: 'Can I book from outside Albania?', a: 'Yes — that is exactly what we are built for. Book online, a nurse visits your relative in Albania.' },
  { q: 'How are nurses verified?', a: 'Every nurse is licensed, background-checked, and verified before their first visit.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, anytime with no penalties. We offer a 7-day free trial.' },
];

export default function HomePage({ params }) {
  const lang = params.lang || 'en';
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: C.white }}>
      <Nav lang={lang} />

      {/* Hero */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.teal, background: C.tealLight, padding: '5px 12px', borderRadius: 20, marginBottom: 16 }}>
            🇦🇱 Serving Albania · Est. 2024
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 20px' }}>
            Care for your loved ones<br />
            <span style={{ color: C.teal }}>wherever you are.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: C.neutralMid, lineHeight: 1.7, maxWidth: 540, margin: '0 0 36px' }}>
            Vonaxity brings professional nurse home visits to your family in Albania. Book from anywhere in the world. Trusted care, delivered to their door.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href={`/${lang}/signup`}>
              <button style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '16px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                Care for a Loved One
              </button>
            </Link>
            <Link href={`/${lang}/how-it-works`}>
              <button style={{ background: 'transparent', color: C.teal, border: `2px solid ${C.teal}`, borderRadius: 10, padding: '15px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                See How It Works
              </button>
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[['500+', 'Families served'], ['8', 'Cities covered'], ['100%', 'Verified nurses']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.teal, letterSpacing: '-1px' }}>{n}</div>
                <div style={{ fontSize: 13, color: C.neutralMid }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '80px 24px', background: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>
              Professional care, at home
            </h2>
            <p style={{ fontSize: 16, color: C.neutralMid, maxWidth: 480, margin: '0 auto' }}>
              Our certified nurses perform a full range of non-emergency health services at your family's door.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
            {SERVICES.map((s) => (
              <div key={s.title} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: '16px 20px', background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <p style={{ fontSize: 14, color: '#92400e', margin: 0 }}>
              <strong>Important:</strong> Vonaxity is non-emergency care only. For emergencies in Albania, call <strong>127</strong> immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 24px', background: C.tealLight }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>
            Plans for every family
          </h2>
          <p style={{ fontSize: 16, color: C.neutralMid, marginBottom: 40 }}>No hidden fees. Cancel anytime. 7-day free trial.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18, marginBottom: 20 }}>
            {PLANS.map((p) => (
              <div key={p.name} style={{ background: C.white, borderRadius: 18, border: p.featured ? `2px solid ${C.teal}` : `1px solid ${C.border}`, padding: '28px 24px', position: 'relative', boxShadow: p.featured ? '0 8px 32px rgba(8,145,178,0.15)' : 'none' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.teal, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>
                    MOST POPULAR
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralMid, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: C.neutralDark, letterSpacing: '-1.5px', marginBottom: 6 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, background: C.tealLight, display: 'inline-block', padding: '3px 12px', borderRadius: 20, marginBottom: 24 }}>{p.visits}</div>
                <br />
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured ? 'none' : `2px solid ${C.teal}`, background: p.featured ? C.teal : 'transparent', color: p.featured ? '#fff' : C.teal, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section style={{ padding: '80px 24px', background: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>
            Available in 8 Albanian cities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12, marginTop: 36 }}>
            {CITIES.map((city) => (
              <div key={city} style={{ background: C.neutral, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.sage, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: C.neutral }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 36px', textAlign: 'center', letterSpacing: '-0.8px' }}>
            Common questions
          </h2>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 20px', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.neutralDark, marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.neutralMid, lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Link href={`/${lang}/faq`} style={{ color: C.teal, fontWeight: 600, fontSize: 14 }}>View all FAQs →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: `linear-gradient(135deg,${C.teal},#164e63)`, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 16, letterSpacing: '-1px' }}>
          Your family deserves the best care.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
          7-day free trial. No card required. Cancel anytime.
        </p>
        <Link href={`/${lang}/signup`}>
          <button style={{ background: '#fff', color: C.teal, border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Choose Your Plan
          </button>
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
