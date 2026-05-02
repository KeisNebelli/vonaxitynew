'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '@/translations';

const C = { primary:'#2563EB', textPrimary:'#111827', textSecondary:'#6B7280', border:'#E5E7EB' };

/* Section-to-nav mapping — order matters for IntersectionObserver */
const SECTIONS = [
  { id: 'how-it-works', labelKey: 'nav.howItWorks' },
  { id: 'services',     labelKey: 'nav.services'   },
  { id: 'our-nurses',   labelKey: 'nav.ourNurses'  },
  { id: 'pricing',      labelKey: 'nav.pricing'    },
  { id: 'about',        labelKey: 'nav.about'      },
];

const NAV_HEIGHT = 64; // px — keep in sync with .vx-nav-bar height

export default function Nav({ lang = 'en' }) {
  const [open, setOpen]       = useState(false);
  const [active, setActive]   = useState('');
  const pathname              = usePathname();
  const isHome                = pathname === `/${lang}` || pathname === `/${lang}/`;
  const rafRef                = useRef(null);

  /* ── Active section tracking via IntersectionObserver ── */
  useEffect(() => {
    if (!isHome) return;

    /* We watch each section. When one enters the "reading zone"
       (top quarter of the viewport) we mark it active.          */
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: `-${NAV_HEIGHT}px 0px -60% 0px`, threshold: 0 },
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);

    return () => observers.forEach(o => o.disconnect());
  }, [isHome, pathname]);

  /* ── Smooth scroll helper ── */
  const scrollTo = (e, id) => {
    if (!isHome) return; // fall through to Link href
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 12;
    window.scrollTo({ top, behavior: 'smooth' });
    setActive(id);
    setOpen(false);
  };

  /* ── Close mobile menu on resize to desktop ── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Build href: hash on home page, cross-page otherwise ── */
  const href = (id) => isHome ? `#${id}` : `/${lang}#${id}`;

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
          height: ${NAV_HEIGHT}px;
        }
        .vx-logo {
          font-size: 20px;
          font-weight: 700;
          color: #2563EB;
          letter-spacing: -0.5px;
          text-decoration: none;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .vx-desktop-links {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        /* ── nav link base ── */
        .vx-nav-link {
          position: relative;
          font-size: 14px;
          color: #6B7280;
          font-weight: 500;
          text-decoration: none;
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.16s ease, background 0.16s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          font-family: inherit;
        }
        .vx-nav-link:hover {
          color: #111827;
          background: rgba(37,99,235,0.05);
        }
        /* ── active pill ── */
        .vx-nav-link.vx-active {
          color: #2563EB;
          background: rgba(37,99,235,0.08);
          font-weight: 600;
        }
        /* ── animated underline on active ── */
        .vx-nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 12px;
          right: 12px;
          height: 2px;
          border-radius: 2px;
          background: #2563EB;
          transform: scaleX(0);
          transition: transform 0.22s cubic-bezier(0.4,0,0.2,1);
          transform-origin: left;
        }
        .vx-nav-link.vx-active::after {
          transform: scaleX(1);
        }
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
          transition: background 0.15s, color 0.15s;
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
          transition: background 0.15s;
        }
        .vx-signin-btn:hover { background: #F5F5F4; }
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
          transition: background 0.15s, box-shadow 0.15s;
        }
        .vx-getstarted-btn:hover { background: #1D4ED8; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
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
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        /* ── mobile menu ── */
        .vx-mobile-menu {
          display: none;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(16px);
          border-top: 1px solid #E5E7EB;
          padding: 8px 20px 24px;
        }
        /* mobile nav link */
        .vx-mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 16px;
          color: #111827;
          font-weight: 500;
          padding: 14px 0;
          border-bottom: 1px solid #F3F4F6;
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          font-family: inherit;
          transition: color 0.15s;
        }
        .vx-mobile-nav-link:hover { color: #2563EB; }
        .vx-mobile-nav-link.vx-active {
          color: #2563EB;
          font-weight: 600;
        }
        .vx-mobile-nav-link.vx-active::after {
          content: '●';
          font-size: 7px;
          color: #2563EB;
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
          .vx-desktop-cta   { display: none !important; }
          .vx-hamburger      { display: flex !important; }
          .vx-mobile-menu    { display: block; }
          .vx-mobile-menu.closed { display: none; }
        }
      `}</style>

      <nav className="vx-nav-bar">
        <div className="vx-nav-inner">
          {/* Logo */}
          <Link href={`/${lang}`} className="vx-logo">
            Vonaxity
          </Link>

          {/* Desktop links */}
          <div className="vx-desktop-links">
            {SECTIONS.map(({ id, labelKey }) => (
              <a
                key={id}
                href={href(id)}
                onClick={(e) => scrollTo(e, id)}
                className={`vx-nav-link${active === id ? ' vx-active' : ''}`}
              >
                {t(lang, labelKey)}
              </a>
            ))}
          </div>

          {/* Right: lang + CTA */}
          <div className="vx-right">
            <div className="vx-lang">
              {['en','sq'].map(l => (
                <button key={l} onClick={() => switchLang(l)} className="vx-lang-btn"
                  style={{ background: lang===l ? C.primary : 'transparent', color: lang===l ? '#fff' : C.textSecondary }}>
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
            <button className="vx-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
              <span style={{ transform: open ? 'rotate(45deg) translate(5px,5px)'  : 'none' }}/>
              <span style={{ opacity: open ? 0 : 1 }}/>
              <span style={{ transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`vx-mobile-menu${open ? '' : ' closed'}`}>
          {SECTIONS.map(({ id, labelKey }) => (
            <a
              key={id}
              href={href(id)}
              onClick={(e) => scrollTo(e, id)}
              className={`vx-mobile-nav-link${active === id ? ' vx-active' : ''}`}
            >
              {t(lang, labelKey)}
            </a>
          ))}
          <div className="vx-mobile-btns">
            <Link href={`/${lang}/login`} style={{ flex:1 }} onClick={() => setOpen(false)}>
              <button className="vx-mobile-signin" style={{ width:'100%' }}>{t(lang,'nav.signIn')}</button>
            </Link>
            <Link href={`/${lang}/signup`} style={{ flex:1 }} onClick={() => setOpen(false)}>
              <button className="vx-mobile-getstarted" style={{ width:'100%' }}>{t(lang,'nav.getStarted')}</button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
