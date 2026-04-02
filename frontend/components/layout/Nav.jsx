'use client';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  primary: '#2563EB', textPrimary: '#111827',
  textSecondary: '#6B7280', border: '#E5E7EB',
  bg: '#FAFAF9', bgWhite: '#FFFFFF',
};

export default function Nav({ lang = 'en' }) {
  const links = [
    { label: t(lang, 'nav.howItWorks'), href: `/${lang}/how-it-works` },
    { label: t(lang, 'nav.services'), href: `/${lang}/services` },
    { label: t(lang, 'nav.pricing'), href: `/${lang}/pricing` },
    { label: t(lang, 'nav.about'), href: `/${lang}/about` },
    { label: t(lang, 'nav.contact'), href: `/${lang}/contact` },
  ];

  const switchLang = (l) => {
    document.cookie = `vonaxity-locale=${l};path=/;max-age=31536000`;
    const path = window.location.pathname.replace(/^\/(en|sq)/, `/${l}`);
    window.location.href = path;
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        <Link href={`/${lang}`} style={{ fontSize: 20, fontWeight: 700, color: C.primary, letterSpacing: '-0.5px', textDecoration: 'none' }}>
          Vonaxity
        </Link>

        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 14, color: C.textSecondary, fontWeight: 500, textDecoration: 'none', transition: 'color 0.15s' }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#F5F5F4', borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
            {['en', 'sq'].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px', background: lang === l ? C.primary : 'transparent', color: lang === l ? '#fff' : C.textSecondary, transition: 'all 0.15s' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <Link href={`/${lang}/login`}>
            <button style={{ fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 8, border: 'none', background: 'transparent', color: C.textPrimary, cursor: 'pointer' }}>
              {t(lang, 'nav.signIn')}
            </button>
          </Link>

          <Link href={`/${lang}/signup`}>
            <button style={{ fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 8, border: 'none', background: C.primary, color: '#fff', cursor: 'pointer', boxShadow: '0 1px 3px rgba(37,99,235,0.3)' }}>
              {t(lang, 'nav.getStarted')}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
