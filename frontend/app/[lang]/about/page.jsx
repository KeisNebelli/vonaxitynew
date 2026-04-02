// about/page.jsx
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4' };
  return (
    <div style={{ fontFamily: 'system-ui,sans-serif' }}>
      <Nav lang={lang} />
      <section style={{ padding: '72px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: C.neutralDark, fontFamily: 'Georgia,serif', marginBottom: 20, letterSpacing: '-1.5px' }}>We built Vonaxity because we needed it ourselves.</h1>
          <p style={{ fontSize: 17, color: C.neutralMid, lineHeight: 1.75, marginBottom: 16 }}>In 2022, one of our founders was living in London when his mother in Tirana fell ill. He spent three weeks trying to arrange a simple nurse visit from 2,000 miles away. It was nearly impossible.</p>
          <p style={{ fontSize: 17, color: C.neutralMid, lineHeight: 1.75, marginBottom: 32 }}>He came back to Albania, built a team, and created the platform he had been looking for. Vonaxity is that platform.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
            {[['❤️', 'Family first', 'Every decision starts with: what would we want for our own parents?'], ['🎓', 'Clinical excellence', 'Licensed, verified nurses. No exceptions.'], ['🌍', 'Built for diaspora', 'We understand what it means to care from a distance.'], ['🇦🇱', 'Proud Albanian', 'Albania deserves world-class home healthcare. We are building it.']].map(([icon, title, desc]) => (
              <div key={title} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '20px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
