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

  // Warm cream palette — calm, premium, healthcare-oriented
  const bg         = 'linear-gradient(180deg, #F8F5F0 0%, #F2EDE7 100%)';
  const textMain   = '#3D4F4E';         // warm charcoal
  const textSub    = '#7A8C8A';         // soft warm sage-gray
  const headingColor = '#8FA9A5';       // muted sage for column headings
  const linkColor  = '#5A7874';         // warm teal-charcoal for links
  const borderTop  = '#E8DFD4';         // warm cream border

  return (
    <footer style={{ background: bg, color: textMain, padding: '56px 24px 32px', borderTop: `1px solid ${borderTop}` }}>
      <style>{`.vx-footer-svc-link:hover { color: #0D9488 !important; } .vx-footer-lnk:hover { color: #0D9488 !important; }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            {/* Logo with warm teal cross */}
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#2563EB', letterSpacing: '-0.5px' }}>Vonaxity</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: textSub, maxWidth: 220 }}>{t(lang, 'footer.tagline')}</p>
            <div style={{ marginTop: 20, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#B91C1C', letterSpacing: '0.5px', marginBottom: 3 }}>{t(lang, 'footer.emergency')}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#B91C1C' }}>{t(lang, 'footer.emergencyCall')}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.services')}</div>
            {services.map((s) => <Link key={s} href={`/${lang}/services`} className="vx-footer-svc-link" style={{ display: 'block', fontSize: 13, marginBottom: 10, color: textSub, textDecoration: 'none' }}>{s}</Link>)}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.company')}</div>
            {companyLinks.map(([label, href]) => (
              <Link key={href} href={href} className="vx-footer-lnk" style={{ display: 'block', fontSize: 13, marginBottom: 10, color: linkColor, textDecoration: 'none' }}>{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: headingColor, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 16 }}>{t(lang, 'footer.contact')}</div>
            <a href="mailto:hello@vonaxity.com" className="vx-footer-lnk" style={{ display:'block', fontSize: 13, marginBottom: 10, color: linkColor, textDecoration:'none' }}>hello@vonaxity.com</a>
            <a href="https://wa.me/message/vonaxity" target="_blank" rel="noopener noreferrer" className="vx-footer-lnk" style={{ display:'block', fontSize: 13, color: linkColor, textDecoration:'none' }}>{t(lang, 'footer.whatsapp')}</a>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${borderTop}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#AABAAE' }}>{t(lang, 'footer.copyright')}</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            <Link href={`/${lang}/privacy`} className="vx-footer-lnk" style={{ color: textSub, textDecoration:'none' }}>{t(lang, 'footer.privacy')}</Link>
            <Link href={`/${lang}/terms`} className="vx-footer-lnk" style={{ color: textSub, textDecoration:'none' }}>{t(lang, 'footer.terms')}</Link>
            <Link href={`/${lang}/disclaimer`} className="vx-footer-lnk" style={{ color: textSub, textDecoration:'none' }}>{lang === 'sq' ? 'Mohim Përgjegjësie' : 'Disclaimer'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
