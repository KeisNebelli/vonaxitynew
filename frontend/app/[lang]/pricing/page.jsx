import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function PricingPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };

  const plans = [
    { name: 'Basic', price: 30, visits: 1, features: ['1 home visit/month', 'All 6 services', 'Post-visit health report', 'Email support'], featured: false },
    { name: 'Standard', price: 50, visits: 2, features: ['2 home visits/month', 'All 6 services', 'Post-visit health reports', 'Priority scheduling', 'WhatsApp support'], featured: true },
    { name: 'Premium', price: 120, visits: 4, features: ['4 home visits/month', 'All 6 services', 'Priority nurse matching', 'Monthly health summary', 'Multi-relative profiles', '24/7 WhatsApp support'], featured: false },
  ];

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: C.white }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px' }}>Simple, transparent pricing</h1>
        <p style={{ fontSize: 17, color: C.neutralMid, maxWidth: 440, margin: '0 auto' }}>No hidden fees. No contracts. Cancel anytime. 7-day free trial on all plans.</p>
      </section>
      <section style={{ padding: '60px 24px', background: C.tealLight }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {plans.map(p => (
              <div key={p.name} style={{ background: C.white, borderRadius: 18, border: p.featured ? `2px solid ${C.teal}` : `1px solid ${C.border}`, padding: '28px 24px', position: 'relative', boxShadow: p.featured ? '0 8px 32px rgba(8,145,178,0.14)' : 'none' }}>
                {p.featured && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.teal, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>MOST POPULAR</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralMid, marginBottom: 6 }}>{p.name}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: C.neutralDark, letterSpacing: '-1.5px', marginBottom: 4 }}>€{p.price}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, marginBottom: 20 }}>per month · {p.visits} visit{p.visits > 1 ? 's' : ''}</div>
                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {p.features.map(f => <li key={f} style={{ fontSize: 13, color: C.neutralMid, padding: '5px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}><span style={{ color: C.sage, fontWeight: 700 }}>✓</span>{f}</li>)}
                </ul>
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured ? 'none' : `2px solid ${C.teal}`, background: p.featured ? C.teal : 'transparent', color: p.featured ? '#fff' : C.teal, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Start free trial
                  </button>
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: C.teal, marginTop: 20 }}>⚠️ Vonaxity is non-emergency care only. Emergencies in Albania: call <strong>127</strong></p>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
