import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  primary: '#2563EB', primaryLight: '#EFF6FF', primaryDark: '#1D4ED8',
  secondary: '#059669', secondaryLight: '#ECFDF5',
  bg: '#F8FAFC', bgWhite: '#FFFFFF', bgSubtle: '#F1F5F9',
  textPrimary: '#0F172A', textSecondary: '#475569', textTertiary: '#94A3B8',
  border: '#E2E8F0',
  warning: '#D97706', warningLight: '#FFFBEB',
  dark: '#0F172A',
};

const DEFAULT_PRICING = {
  basicPrice: 30, standardPrice: 50, premiumPrice: 120,
  basicVisits: 1, standardVisits: 2, premiumVisits: 4,
};

const CITY_DOTS = [
  { name: 'Shkodër',  x: 78,  y: 52,  active: true  },
  { name: 'Durrës',   x: 52,  y: 102, active: true  },
  { name: 'Tirana',   x: 92,  y: 112, active: true  },
  { name: 'Elbasan',  x: 108, y: 132, active: true  },
  { name: 'Fier',     x: 68,  y: 168, active: true  },
  { name: 'Berat',    x: 90,  y: 188, active: false },
  { name: 'Vlorë',    x: 60,  y: 215, active: false },
  { name: 'Sarandë',  x: 78,  y: 250, active: false },
];

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

// Hero right panel — replaces stock photo
function CoveragePanel() {
  return (
    <div style={{ background: C.dark, borderRadius: 22, overflow: 'hidden', boxShadow: '0 24px 64px rgba(15,23,42,0.22)' }}>
      <div style={{ padding: '24px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px #22C55E' }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase' }}>Active in Albania</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
          8 cities covered.<br />
          <span style={{ color: '#60A5FA' }}>Care at home.</span>
        </div>
      </div>

      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {CITY_DOTS.map(city => (
            <div key={city.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: city.active ? '#22C55E' : 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: city.active ? 600 : 400, color: city.active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}>
                {city.name}{!city.active && <span style={{ fontSize: 11, marginLeft: 4, color: 'rgba(255,255,255,0.2)' }}>soon</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>Sample visit report</div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Blood pressure + vitals</span>
            <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.12)', color: '#4ADE80', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Completed</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['BP', '118/76', 'mmHg'], ['HR', '72', 'bpm'], ['SpO₂', '98%', '']].map(([k, v, u]) => (
              <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>{v}</div>
                {u && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{u}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Full health report emailed after every visit</span>
      </div>
    </div>
  );
}

export default async function HomePage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');
  const faqs = t(lang, 'faq.items');
  const steps = t(lang, 'howItWorks.steps');

  const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
  let pricing = DEFAULT_PRICING;
  try {
    const res = await fetch(`${BASE}/settings/public`, { next: { revalidate: 300 } });
    if (res.ok) pricing = await res.json();
  } catch {}

  const PLANS = [
    {
      name: 'Basic', price: pricing.basicPrice, visits: pricing.basicVisits, featured: false,
      features: ['1 nurse visit/month', 'Blood pressure & vitals', 'Health report by email', 'Email support'],
    },
    {
      name: 'Standard', price: pricing.standardPrice, visits: pricing.standardVisits, featured: true,
      features: ['2 nurse visits/month', 'Full vitals & glucose', 'Health reports by email', 'Priority scheduling', 'WhatsApp support'],
    },
    {
      name: 'Premium', price: pricing.premiumPrice, visits: pricing.premiumVisits, featured: false,
      features: ['4 nurse visits/month', 'Full vitals & glucose', 'Monthly health summary', 'Priority nurse matching', 'Multi-relative care', '24/7 WhatsApp support'],
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg }}>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding: '88px 24px 100px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 56, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: C.secondary, background: C.secondaryLight, padding: '5px 12px', borderRadius: 99, marginBottom: 24, border: '1px solid #A7F3D0' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.secondary }} />
              Available in Albania
            </div>
            <h1 style={{ fontSize: 'clamp(40px,5vw,58px)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-2px', color: C.textPrimary, margin: '0 0 22px' }}>
              {t(lang, 'hero.headline1')}<br />
              <span style={{ color: C.primary }}>{t(lang, 'hero.headline2')}</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.textSecondary, maxWidth: 460, margin: '0 0 36px' }}>
              {t(lang, 'hero.subtitle')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href={`/${lang}/signup`}>
                <button style={{ fontSize: 15, fontWeight: 700, padding: '14px 28px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', cursor: 'pointer', letterSpacing: '-0.2px' }}>
                  {t(lang, 'hero.cta1')}
                </button>
              </Link>
              <Link href={`/${lang}/how-it-works`}>
                <button style={{ fontSize: 15, fontWeight: 600, padding: '13px 24px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: 'transparent', color: C.textPrimary, cursor: 'pointer', letterSpacing: '-0.2px' }}>
                  {t(lang, 'hero.cta2')}
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 32, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
              {[['8', 'Cities covered'], ['Licensed', 'Nurses only'], ['Report', 'After every visit']].map(([n, l]) => (
                <div key={l} style={{ paddingTop: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, letterSpacing: '-0.5px', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.4px', fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <CoveragePanel />
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 10px', letterSpacing: '-1px' }}>{t(lang, 'howItWorks.title')}</h2>
            <p style={{ fontSize: 15, color: C.textSecondary, maxWidth: 480 }}>{t(lang, 'howItWorks.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 2, background: C.border, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            {Array.isArray(steps) && steps.slice(0, 4).map((s, i) => (
              <div key={i} style={{ background: C.bgWhite, padding: '28px 24px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, letterSpacing: '1.5px', marginBottom: 16 }}>0{i + 1}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding: '80px 24px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 10px', letterSpacing: '-1px' }}>{t(lang, 'services.title')}</h2>
            <p style={{ fontSize: 15, color: C.textSecondary, maxWidth: 480 }}>{t(lang, 'services.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12, marginBottom: 24 }}>
            {Array.isArray(services) && services.map(({ title, desc }, i) => (
              <div key={i} style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, padding: '20px 18px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background: C.warningLight, border: `1px solid #FDE68A`, borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><WarningIcon /></div>
            <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              <strong>{t(lang, 'services.nonEmergencyStrong')}</strong>{' '}{t(lang, 'services.emergency')} <strong>127</strong> {t(lang, 'services.immediately')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '80px 24px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 10px', letterSpacing: '-1px' }}>{t(lang, 'pricing.title')}</h2>
            <p style={{ fontSize: 15, color: C.textSecondary }}>{t(lang, 'pricing.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: p.featured ? C.primary : C.bgWhite, borderRadius: 18, border: p.featured ? 'none' : `1px solid ${C.border}`, padding: '28px 24px', position: 'relative', boxShadow: p.featured ? '0 16px 48px rgba(37,99,235,0.18)' : 'none' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.dark, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                    {t(lang, 'pricing.mostPopular')}
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: p.featured ? 'rgba(255,255,255,0.5)' : C.textTertiary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.name}</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: p.featured ? '#fff' : C.textPrimary, letterSpacing: '-2px', lineHeight: 1, marginBottom: 2 }}>€{p.price}</div>
                <div style={{ fontSize: 13, color: p.featured ? 'rgba(255,255,255,0.45)' : C.textTertiary, marginBottom: 24 }}>{t(lang, 'pricing.perMonth')}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: p.featured ? 'rgba(255,255,255,0.8)' : C.textSecondary, padding: '5px 0', borderBottom: `1px solid ${p.featured ? 'rgba(255,255,255,0.08)' : C.border}` }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={p.featured ? 'rgba(255,255,255,0.7)' : '#059669'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured ? 'none' : `1.5px solid ${C.border}`, background: p.featured ? '#fff' : 'transparent', color: p.featured ? C.primary : C.textPrimary, fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.2px' }}>
                    {t(lang, 'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize: 11, color: p.featured ? 'rgba(255,255,255,0.35)' : C.textTertiary, textAlign: 'center', marginTop: 10 }}>{t(lang, 'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities ── */}
      <section style={{ padding: '80px 24px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: C.textPrimary, margin: '0 0 14px', letterSpacing: '-1px' }}>{t(lang, 'cities.title')}</h2>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 32, maxWidth: 400 }}>{t(lang, 'cities.subtitle')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                {CITY_DOTS.map(city => (
                  <div key={city.name} style={{ borderRadius: 10, border: `1px solid ${C.border}`, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 9, background: city.active ? C.bgWhite : C.bg }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: city.active ? C.secondary : C.textTertiary, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: city.active ? C.textPrimary : C.textTertiary }}>{city.name}</div>
                      <div style={{ fontSize: 11, color: C.textTertiary }}>{city.active ? 'Active' : 'Coming soon'}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary }}>
                {t(lang, 'cities.expansion')}{' '}
                <Link href={`/${lang}/contact`} style={{ color: C.primary, fontWeight: 600, textDecoration: 'none' }}>{t(lang, 'cities.waitlist')}</Link>
              </div>
            </div>

            {/* Albania outline SVG — no API key required */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: C.primaryLight, borderRadius: 20, padding: '32px 40px', border: `1px solid rgba(37,99,235,0.1)`, display: 'inline-block' }}>
                <svg viewBox="0 0 180 290" width="160" style={{ display: 'block', overflow: 'visible' }}>
                  {/* Albania silhouette */}
                  <path d="M90 8 L108 14 L128 30 L140 50 L138 70 L148 88 L152 110 L148 132 L152 155 L142 180 L128 208 L112 238 L98 268 L88 258 L68 228 L50 200 L38 172 L34 148 L40 128 L34 108 L38 88 L32 68 L44 46 L60 28 L78 16 Z"
                    fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5" strokeLinejoin="round" />
                  {/* City dots */}
                  {CITY_DOTS.map(city => (
                    <g key={city.name}>
                      {city.active && <circle cx={city.x} cy={city.y} r="10" fill="#2563EB" opacity="0.12" />}
                      <circle cx={city.x} cy={city.y} r={city.active ? 5 : 3.5} fill={city.active ? '#2563EB' : '#CBD5E1'} stroke="#fff" strokeWidth="1.5" />
                      <text x={city.x + 8} y={city.y + 4} fontSize="9" fontFamily="Inter, system-ui" fill={city.active ? '#1D4ED8' : '#94A3B8'} fontWeight={city.active ? '600' : '400'}>{city.name}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: C.textPrimary, margin: 0, letterSpacing: '-1px' }}>{t(lang, 'faq.title')}</h2>
          </div>
          {Array.isArray(faqs) && faqs.slice(0, 5).map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}`, padding: '20px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 7 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.75 }}>{f.a}</div>
            </div>
          ))}
          <div style={{ marginTop: 28 }}>
            <Link href={`/${lang}/faq`} style={{ fontSize: 14, fontWeight: 600, color: C.primary, textDecoration: 'none' }}>{t(lang, 'faq.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 24px', background: C.dark }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-1.5px', lineHeight: 1.1 }}>{t(lang, 'cta.title')}</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', maxWidth: 360, margin: '0 auto 36px', lineHeight: 1.7 }}>{t(lang, 'cta.subtitle')}</p>
          <Link href={`/${lang}/signup`}>
            <button style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.2px' }}>
              {t(lang, 'cta.btn1')}
            </button>
          </Link>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
