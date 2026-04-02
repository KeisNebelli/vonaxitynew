import Link from 'next/link';

export default function Footer({ lang = 'en' }) {
  const sq = lang === 'sq';
  return (
    <footer style={{ background: '#1c1917', color: 'rgba(255,255,255,0.6)', padding: '48px 24px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 36, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 10 }}>
              Von<span style={{ color: '#4ade80' }}>ax</span>ity
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', maxWidth: 200 }}>
              {sq ? 'Vizita infermierësh në shtëpi nëpër Shqipëri.' : 'Home nurse visits across Albania. Built for families who care from afar.'}
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '1px', marginBottom: 12, textTransform: 'uppercase' }}>
              {sq ? 'Shërbimet' : 'Services'}
            </div>
            {['Blood Pressure Check', 'Glucose Check', 'Vitals Monitoring', 'Blood Work', 'Welfare Check'].map((s) => (
              <div key={s} style={{ fontSize: 13, marginBottom: 6, color: 'rgba(255,255,255,0.45)' }}>{s}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '1px', marginBottom: 12, textTransform: 'uppercase' }}>
              {sq ? 'Kompania' : 'Company'}
            </div>
            {[
              [sq ? 'Rreth Nesh' : 'About Us', `/${lang}/about`],
              [sq ? 'Çmimet' : 'Pricing', `/${lang}/pricing`],
              [sq ? 'Pyetjet' : 'FAQ', `/${lang}/faq`],
              [sq ? 'Kontakti' : 'Contact', `/${lang}/contact`],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 13, marginBottom: 6, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '1px', marginBottom: 12, textTransform: 'uppercase' }}>
              {sq ? 'Kontakti' : 'Contact'}
            </div>
            <div style={{ fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,0.45)' }}>📧 hello@vonaxity.com</div>
            <div style={{ fontSize: 13, marginBottom: 8, color: 'rgba(255,255,255,0.45)' }}>💬 WhatsApp</div>
            <div style={{ marginTop: 16, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 12, color: '#fca5a5', fontWeight: 600 }}>🚨 {sq ? 'Urgjencë?' : 'Emergency?'}</div>
              <div style={{ fontSize: 13, color: '#fca5a5' }}>{sq ? 'Telefononi' : 'Call'} 127</div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 12 }}>© 2024 Vonaxity. {sq ? 'Të gjitha të drejtat.' : 'All rights reserved.'}</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            {['Privacy Policy', 'Terms of Service', 'GDPR'].map((l) => (
              <span key={l} style={{ color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
