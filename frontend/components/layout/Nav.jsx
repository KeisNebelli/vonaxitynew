'use client';
import { useState } from 'react';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', textPrimary:'#111827', textSecondary:'#6B7280', border:'#E5E7EB' };

export default function Nav({ lang = 'en' }) {
  const [open, setOpen] = useState(false);

  const links = [
    { label: t(lang, 'nav.howItWorks'), href: `/${lang}/how-it-works` },
    { label: t(lang, 'nav.services'), href: `/${lang}/services` },
    { label: lang === 'sq' ? 'Infermierët' : 'Our Nurses', href: `/${lang}/nurses` },
    { label: t(lang, 'nav.pricing'), href: `/${lang}/pricing` },
    { label: t(lang, 'nav.about'), href: `/${lang}/about` },
  ];

  const switchLang = (l) => {
    document.cookie = `vonaxity-locale=${l};path=/;max-age=31536000`;
    const path = window.location.pathname.replace(/^\/(en|sq)/, `/${l}`);
    window.location.href = path;
  };

  return (
    <>
      <style>{`
        .vx-nav-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #E5E7EB;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .vx-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .vx-logo {
          font-size: 20px;
          font-weight: 700;
          color: #2563EB;
          letter-spacing: -0.5px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .vx-desktop-links {
          display: flex;
          gap: 24px;
          align-items: center;
        }
        .vx-desktop-link {
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
        }
        .vx-desktop-link:hover { color: #111827; }
        .vx-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .vx-lang {
          display: flex;
          background: #F5F5F4;
          border-radius: 8px;
          padding: 3px;
          border: 1px solid #E5E7EB;
        }
        .vx-lang-btn {
          padding: 4px 10px;
          border-radius: 6px;
          border: none;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.3px;
          font-family: inherit;
        }
        .vx-signin-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #111827;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }
        .vx-getstarted-btn {
          font-size: 13px;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 8px;
          border: none;
          background: #2563EB;
          color: #fff;
          cursor: pointer;
          white-space: nowrap;
          font-family: inherit;
        }
        .vx-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        .vx-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #111827;
          border-radius: 2px;
          transition: all 0.2s;
        }
        .vx-mobile-menu {
          display: none;
          background: #fff;
          border-top: 1px solid #E5E7EB;
          padding: 8px 20px 24px;
        }
        .vx-mobile-link {
          display: block;
          font-size: 16px;
          color: #111827;
          font-weight: 500;
          padding: 14px 0;
          border-bottom: 1px solid #F3F4F6;
          text-decoration: none;
        }
        .vx-mobile-btns {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .vx-mobile-signin {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          padding: 13px;
          border-radius: 10px;
          border: 1.5px solid #E5E7EB;
          background: transparent;
          color: #111827;
          cursor: pointer;
          font-family: inherit;
        }
        .vx-mobile-getstarted {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #2563EB;
          color: #fff;
          cursor: pointer;
          font-family: inherit;
        }
        @media (max-width: 768px) {
          .vx-desktop-links { display: none !important; }
          .vx-desktop-cta { display: none !important; }
          .vx-hamburger { display: flex !important; }
          .vx-mobile-menu { display: block; }
          .vx-mobile-menu.closed { display: none; }
        }
      `}</style>

      <nav className="vx-nav-bar">
        <div className="vx-nav-inner">
          <Link href={`/${lang}`} className="vx-logo">Vonaxity</Link>

          {/* Desktop links */}
          <div className="vx-desktop-links">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="vx-desktop-link">{l.label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="vx-right">
            <div className="vx-lang">
              {['en','sq'].map(l => (
                <button key={l} onClick={()=>switchLang(l)} className="vx-lang-btn"
                  style={{ background:lang===l?C.primary:'transparent', color:lang===l?'#fff':C.textSecondary }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href={`/${lang}/login`} className="vx-desktop-cta">
              <button className="vx-signin-btn">{t(lang,'nav.signIn')}</button>
            </Link>
            <Link href={`/${lang}/signup`} className="vx-desktop-cta">
              <button className="vx-getstarted-btn">{t(lang,'nav.getStarted')}</button>
            </Link>
            {/* Hamburger */}
            <button className="vx-hamburger" onClick={()=>setOpen(!open)} aria-label="Menu">
              <span style={{ transform:open?'rotate(45deg) translate(5px,5px)':'none' }}/>
              <span style={{ opacity:open?0:1 }}/>
              <span style={{ transform:open?'rotate(-45deg) translate(5px,-5px)':'none' }}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`vx-mobile-menu ${open?'':'closed'}`}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className="vx-mobile-link" onClick={()=>setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="vx-mobile-btns">
            <Link href={`/${lang}/login`} style={{ flex:1 }} onClick={()=>setOpen(false)}>
              <button className="vx-mobile-signin" style={{ width:'100%' }}>{t(lang,'nav.signIn')}</button>
            </Link>
            <Link href={`/${lang}/signup`} style={{ flex:1 }} onClick={()=>setOpen(false)}>
              <button className="vx-mobile-getstarted" style={{ width:'100%' }}>{t(lang,'nav.getStarted')}</button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
