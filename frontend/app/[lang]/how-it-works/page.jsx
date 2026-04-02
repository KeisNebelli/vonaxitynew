import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function HowItWorksPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };

  const steps = [
    { num: '01', icon: '📋', title: 'Choose your plan', desc: 'Select Basic, Standard, or Premium. All plans include a 7-day free trial and access to all 6 nurse services.' },
    { num: '02', icon: '👤', title: 'Tell us about your loved one', desc: 'Enter your relative\'s name, address in Albania, city, and the services they need. Add any health notes for the nurse.' },
    { num: '03', icon: '🔍', title: 'We match a certified nurse', desc: 'Our system matches the nearest available, approved nurse in your city. Premium subscribers can request their preferred nurse.' },
    { num: '04', icon: '🗓️', title: 'Schedule the visit', desc: 'We contact your loved one to confirm the visit time. Standard scheduling: 3–5 days. Priority scheduling: 1–2 days.' },
    { num: '05', icon: '🏠', title: 'The nurse visits at home', desc: 'The nurse arrives with all equipment and performs the agreed health services. A typical visit lasts 30–60 minutes.' },
    { num: '06', icon: '📱', title: 'You receive a health report', desc: 'Within hours you receive a full health report by email — vitals, nurse observations, and recommendations.' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px' }}>How Vonaxity works</h1>
        <p style={{ fontSize: 17, color: C.neutralMid, maxWidth: 480, margin: '0 auto' }}>From choosing a plan to receiving your first health report — here is the complete process.</p>
      </section>
      <section style={{ padding: '64px 24px', background: C.white }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {steps.map((s) => (
              <div key={s.num} style={{ background: C.neutral, borderRadius: 14, border: `1px solid ${C.border}`, padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 64, opacity: 0.06, fontFamily: 'Georgia', fontWeight: 900 }}>{s.num}</div>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '1.5px', marginBottom: 6 }}>STEP {s.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48, background: `linear-gradient(135deg,${C.teal},#164e63)`, borderRadius: 16, padding: '36px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 12 }}>Ready to get started?</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 24 }}>7-day free trial. No card required. First visit scheduled within days.</p>
            <Link href={`/${lang}/signup`}>
              <button style={{ background: '#fff', color: C.teal, border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Choose Your Plan</button>
            </Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
