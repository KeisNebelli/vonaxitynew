import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function ServicesPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4', sage: '#16a34a' };

  const services = [
    { icon: '❤️', title: 'Blood Pressure Check', desc: 'Regular monitoring to track hypertension and cardiovascular health. Results recorded in every visit report.' },
    { icon: '🩸', title: 'Glucose Check', desc: 'Accurate blood sugar monitoring for diabetic patients. Essential for anyone managing their metabolic health.' },
    { icon: '📊', title: 'Vitals Monitoring', desc: 'Full vitals check — heart rate, temperature, oxygen saturation, and respiratory rate — at every visit.' },
    { icon: '🧪', title: 'Blood Work & Sample Collection', desc: 'In-home sample collection sent to certified labs. No hospital queues, no transport required.' },
    { icon: '👁️', title: 'Welfare Check', desc: 'A caring visit to ensure your loved one is well, safe, and comfortable in their daily routine.' },
    { icon: '🏥', title: 'General Nurse Visit', desc: 'Comprehensive home nursing for any non-emergency health need or concern.' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px 80px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 12, letterSpacing: '-1.5px' }}>Our nursing services</h1>
            <p style={{ fontSize: 17, color: C.neutralMid, maxWidth: 480, margin: '0 auto' }}>All services performed in your loved one's home by certified Albanian nurses.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18, marginBottom: 32 }}>
            {services.map(s => (
              <div key={s.title} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 22, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 32 }}>
            <span>⚠️</span>
            <p style={{ fontSize: 14, color: '#92400e', margin: 0 }}><strong>Important:</strong> Vonaxity is non-emergency care only. For emergencies in Albania, call <strong>127</strong> immediately.</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href={`/${lang}/signup`}>
              <button style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Book a nurse visit →</button>
            </Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
