import Link from 'next/link';
import { t } from '@/translations';

export default function Footer({ lang = 'en' }) {
  const companyLinks = [
    [t(lang, 'footer.companyLinks')[0] || 'About Us', `/${lang}/about`],
    [t(lang, 'footer.companyLinks')[1] || 'Pricing', `/${lang}/pricing`],
    [t(lang, 'footer.companyLinks')[2] || 'FAQ', `/${lang}/faq`],
    [t(lang, 'footer.companyLinks')[3] || 'Contact', `/${lang}/contact`],
    [t(lang, 'footer.ourNurses'), `/${lang}/nurses`],
  ];
  const serviceItems = t(lang, 'services.items');
  const services = Array.isArray(serviceItems) ? serviceItems.map(s => s.title) : [];

  const linkColor = 'rgba(187,247,208,0.7)';
  const headingColor = 'rgba(167,243,208,0.55)';

  return (
    <footer style={{ background: 'linear-gradient(180deg, #051a0e 0%, #071510 100%)', color: 'rgba(255,255,255,0.7)', padding: '56px 24px 32px' }}>
      <style>{`.vx-footer-svc-link:hover { color: #fff !important; }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            {/* Logo with cross accent */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="7" y="1" width="8" height="20" rx="3.5" fill="rgba(52,211,153,0.35)" stroke="#34d399" strokeWidth="1.5"/>
                <rect x="1" y="7" width="20" height="8" rx="3.5" fill="rgba(52,211,153,0.35)" stroke="#34d399" strokeWidth="1.5"/>
              </svg>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>Vonaxity</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 220 }}>{t(lang, 'footer.tagline')}</p>
            <div style={{ marginTop: 20, background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#FCA5A5', letterSpacing: '0.5px', marginBottom: 3 }}>{t(lang, 'footer.emergency')}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#FCA5A5' }}>{t(lang, 'footer.emergencyCall')}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.services')}</div>
            {services.map((s) => <Link key={s} href={`/${lang}/services`} className="vx-footer-svc-link" style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{s}</Link>)}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.company')}</div>
            {companyLinks.map(([label, href]) => (
              <Link key={href} href={href} style={{ display: 'block', fontSize: 13, marginBottom: 10, color: linkColor, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.contact')}</div>
            <a href="mailto:hello@vonaxity.com" style={{ display:'block', fontSize: 13, marginBottom: 10, color: linkColor, textDecoration:'none' }}>hello@vonaxity.com</a>
            <a href="https://wa.me/message/vonaxity" target="_blank" rel="noopener noreferrer" style={{ display:'block', fontSize: 13, color: linkColor, textDecoration:'none' }}>{t(lang, 'footer.whatsapp')}</a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(52,211,153,0.12)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t(lang, 'footer.copyright')}</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            <Link href={`/${lang}/privacy`} style={{ color:'rgba(255,255,255,0.45)', textDecoration:'none' }}>{t(lang, 'footer.privacy')}</Link>
            <Link href={`/${lang}/terms`} style={{ color:'rgba(255,255,255,0.45)', textDecoration:'none' }}>{t(lang, 'footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
