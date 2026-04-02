'use client';
import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/translations';

const C = { teal: '#0e7490', sage: '#16a34a', border: '#e7e5e4', neutralMid: '#78716c' };

export default function Nav({ lang = 'en' }) {
  const links = [
    { label: t(lang,'nav.howItWorks'), href: `/${lang}/how-it-works` },
    { label: t(lang,'nav.services'), href: `/${lang}/services` },
    { label: t(lang,'nav.pricing'), href: `/${lang}/pricing` },
    { label: t(lang,'nav.about'), href: `/${lang}/about` },
    { label: t(lang,'nav.contact'), href: `/${lang}/contact` },
  ];

  const switchLang = (l) => {
    document.cookie = `vonaxity-locale=${l};path=/;max-age=31536000`;
    const path = window.location.pathname.replace(/^\/(en|sq)/, `/${l}`);
    window.location.href = path;
  };

  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link href={`/${lang}`} style={{ fontSize: 22, fontWeight: 700, color: C.teal, fontFamily: 'Georgia,serif', textDecoration: 'none' }}>
          Von<span style={{ color: C.sage }}>ax</span>ity
        </Link>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 14, color: C.neutralMid, textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#f8f7f4', borderRadius: 8, padding: 3, border: `1px solid ${C.border}` }}>
            {['en','sq'].map(l => (
              <button key={l} onClick={() => switchLang(l)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: lang===l?C.teal:'transparent', color: lang===l?'#fff':C.neutralMid }}>
                {l==='en'?'🇬🇧 EN':'🇦🇱 SQ'}
              </button>
            ))}
          </div>
          <Link href={`/${lang}/login`}>
            <button style={{ fontSize: 13, padding: '8px 16px', borderRadius: 8, border: `2px solid ${C.teal}`, background: 'transparent', color: C.teal, cursor: 'pointer', fontWeight: 700 }}>
              {t(lang,'nav.signIn')}
            </button>
          </Link>
          <Link href={`/${lang}/signup`}>
            <button style={{ fontSize: 13, padding: '8px 16px', borderRadius: 8, border: 'none', background: C.teal, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>
              {t(lang,'nav.getStarted')}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
