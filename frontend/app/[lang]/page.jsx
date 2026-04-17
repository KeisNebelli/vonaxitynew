import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';
import HeroIllustration from '@/components/visuals/HeroIllustration';
import AlbaniaMap from '@/components/visuals/AlbaniaMap';
import { StepIcon, TrustIcon } from '@/components/visuals/StepIcons';

const C = {
  primary: '#2563EB', primaryLight: '#EFF6FF', primaryDark: '#1D4ED8',
  secondary: '#059669', secondaryLight: '#ECFDF5',
  bg: '#FAFAF9', bgWhite: '#FFFFFF', bgSubtle: '#F5F5F4',
  textPrimary: '#111827', textSecondary: '#6B7280', textTertiary: '#9CA3AF',
  border: '#E5E7EB', borderSubtle: '#F3F4F6',
  warning: '#D97706', warningLight: '#FFFBEB',
};

const CITIES = [
  { name: 'Tirana', note: { en: 'Capital · Most nurses', sq: 'Kryeqyteti' } },
  { name: 'Durrës', note: { en: 'Coastal city', sq: 'Bregdetar' } },
  { name: 'Elbasan', note: { en: 'Central Albania', sq: 'Shqipëria qendrore' } },
  { name: 'Fier', note: { en: 'Southern hub', sq: 'Jugu' } },
  { name: 'Berat', note: { en: 'UNESCO city', sq: 'UNESCO' } },
  { name: 'Sarandë', note: { en: 'Riviera region', sq: 'Riviera' } },
  { name: 'Kukës', note: { en: 'Northern Albania', sq: 'Veriu' } },
  { name: 'Shkodër', note: { en: 'Northern hub', sq: 'Veri-qendër' } },
];

const DEFAULT_PRICING = { basicPrice: 30, standardPrice: 50, premiumPrice: 120, basicVisits: 1, standardVisits: 2, premiumVisits: 4 };

const TRUST_ICONS = [<ShieldIcon />, <CheckIcon />, <HomeIcon />, <GlobeIcon />];

function ShieldIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function CheckIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
function HomeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function GlobeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>;
}
function HeartIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
}
function ActivityIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function ClipboardIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>;
}
function DropletIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>;
}
function UsersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function FileTextIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
}
function WarningIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

const SERVICE_ITEMS = [
  { Icon: ActivityIcon, titleKey: 0, descKey: 0 },
  { Icon: DropletIcon, titleKey: 1, descKey: 1 },
  { Icon: HeartIcon, titleKey: 2, descKey: 2 },
  { Icon: ClipboardIcon, titleKey: 3, descKey: 3 },
  { Icon: UsersIcon, titleKey: 4, descKey: 4 },
  { Icon: FileTextIcon, titleKey: 5, descKey: 5 },
];

const TAG = ({ children }) => (
  <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: C.primary, background: C.primaryLight, padding: '5px 12px', borderRadius: '99px', marginBottom: 16 }}>
    {children}
  </div>
);

export default async function HomePage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');
  const faqs = t(lang, 'faq.items');
  const steps = t(lang, 'howItWorks.steps');
  const trustTexts = t(lang, 'hero.trustItems') || [];
  const TRUST_ITEMS = trustTexts.map((item, i) => ({ ...item, icon: TRUST_ICONS[i] }));

  const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
  let pricing = DEFAULT_PRICING;
  try {
    const res = await fetch(`${BASE}/settings/public`, { next: { revalidate: 300 } });
    if (res.ok) pricing = await res.json();
  } catch {}

  const PLANS = [
    { name: 'Basic',    price: `€${pricing.basicPrice}`,    visits: pricing.basicVisits,    featured: false },
    { name: 'Standard', price: `€${pricing.standardPrice}`, visits: pricing.standardVisits, featured: true  },
    { name: 'Premium',  price: `€${pricing.premiumPrice}`,  visits: pricing.premiumVisits,  featured: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.bg }}>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding: '80px 24px 96px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 60, alignItems: 'center' }}>
          <div>
            <TAG>{t(lang, 'hero.badge')}</TAG>
            <h1 style={{ fontSize: 'clamp(38px,5vw,56px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-1.5px', color: C.textPrimary, margin: '0 0 20px' }}>
              {t(lang, 'hero.headline1')}<br />
              <span style={{ color: C.primary }}>{t(lang, 'hero.headline2')}</span>
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.textSecondary, maxWidth: 480, margin: '0 0 36px' }}>
              {t(lang, 'hero.subtitle')}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href={`/${lang}/signup`}>
                <button style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 10, border: 'none', background: C.primary, color: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
                  {t(lang, 'hero.cta1')}
                </button>
              </Link>
              <Link href={`/${lang}/how-it-works`}>
                <button style={{ fontSize: 15, fontWeight: 600, padding: '13px 28px', borderRadius: 10, border: `2px solid ${C.border}`, background: 'transparent', color: C.textPrimary, cursor: 'pointer' }}>
                  {t(lang, 'hero.cta2')}
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              {[['500+', t(lang, 'hero.stat1')], ['8', t(lang, 'hero.stat2')], ['100%', t(lang, 'hero.stat3')]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: C.primary, letterSpacing: '-1px' }}>{n}</div>
                  <div style={{ fontSize: 12, color: C.textTertiary, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero photo + floating card */}
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80"
                alt="Nurse visiting patient at home"
                style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Floating info card over the photo */}
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '16px 18px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Fatmira Murati</div>
                  <div style={{ fontSize: 12, color: C.textTertiary }}>Tirana · Age 74</div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.secondary, background: C.secondaryLight, padding: '4px 10px', borderRadius: 99 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.secondary }} />
                  {t(lang, 'hero.visitToday')}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  [t(lang, 'hero.nurseLabel'), 'Elona Berberi', true],
                  [t(lang, 'hero.timeLabel'), '10:00 AM', false],
                  [t(lang, 'hero.serviceLabel'), 'BP + glucose', false],
                ].map(([k, v, blue]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: C.textTertiary, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: blue ? C.primary : C.textPrimary }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '24px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{item.title}</div>
                <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 1 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: C.bgWhite }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <TAG>{t(lang, 'howItWorks.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'howItWorks.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {Array.isArray(steps) && steps.slice(0, 4).map((s, i) => (
              <div key={i} style={{ background: C.bgWhite, borderRadius: 18, border: `1px solid ${C.border}`, padding: '28px 22px' }}>
                <div style={{ marginBottom: 16 }}><StepIcon step={s.num} size={52} /></div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: '1.5px', marginBottom: 10 }}>STEP {s.num}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 8, lineHeight: 1.4 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48 }}>
            <TAG>{t(lang, 'services.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'services.title')}</h2>
            <p style={{ fontSize: 16, color: C.textSecondary, maxWidth: 480 }}>{t(lang, 'services.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16 }}>
            {SERVICE_ITEMS.map(({ Icon, titleKey }, i) => (
              <div key={i} style={{ background: C.bgWhite, borderRadius: 14, border: `1px solid ${C.border}`, padding: 22 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon />
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>
                  {Array.isArray(services) && services[i]?.title}
                </div>
                <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.65 }}>
                  {Array.isArray(services) && services[i]?.desc}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, background: C.warningLight, border: `1px solid #FDE68A`, borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 1 }}><WarningIcon /></div>
            <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.6 }}>
              <strong>Non-emergency care only.</strong> {t(lang, 'services.emergency')} <strong>127</strong> {t(lang, 'services.immediately')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{ padding: '80px 24px', background: C.primaryLight }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <TAG>{t(lang, 'pricing.tag')}</TAG>
          <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: '0 0 12px', letterSpacing: '-1px' }}>{t(lang, 'pricing.title')}</h2>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 48 }}>{t(lang, 'pricing.subtitle')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: C.bgWhite, borderRadius: 18, border: p.featured ? `2px solid ${C.primary}` : `1px solid ${C.border}`, padding: '28px 24px', position: 'relative' }}>
                {p.featured && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.primary, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.3px' }}>
                    {t(lang, 'pricing.mostPopular')}
                  </div>
                )}
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textTertiary, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 44, fontWeight: 700, color: C.textPrimary, letterSpacing: '-2px', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: C.textTertiary, marginBottom: 16 }}>{t(lang, 'pricing.perMonth')}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.primary, background: C.primaryLight, display: 'inline-block', padding: '4px 12px', borderRadius: 99, marginBottom: 24 }}>
                  {p.visits} {p.visits === 1 ? t(lang, 'pricing.visitMonth') : t(lang, 'pricing.visitsMonth')}
                </div>
                <br />
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured ? 'none' : `2px solid ${C.primary}`, background: p.featured ? C.primary : 'transparent', color: p.featured ? '#fff' : C.primary, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    {t(lang, 'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 10 }}>{t(lang, 'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cities with Albania Map ── */}
      <section style={{ padding:'80px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:60, alignItems:'center' }}>
            <div>
              <TAG>{t(lang,'cities.tag')}</TAG>
              <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:700, color:C.textPrimary, margin:'0 0 16px', letterSpacing:'-1px' }}>{t(lang,'cities.title')}</h2>
              <p style={{ fontSize:16, color:C.textSecondary, lineHeight:1.7, marginBottom:32, maxWidth:440 }}>{t(lang,'cities.subtitle')}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {CITIES.map(city => (
                  <div key={city.name} style={{ background:C.bg, borderRadius:12, border:`1px solid ${C.border}`, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:C.secondary, flexShrink:0 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{city.name}</div>
                      <div style={{ fontSize:11, color:C.textTertiary }}>{city.note[lang]||city.note.en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'center' }}>
              <AlbaniaMap lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <TAG>{t(lang, 'faq.tag')}</TAG>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 700, color: C.textPrimary, margin: 0, letterSpacing: '-1px' }}>{t(lang, 'faq.title')}</h2>
          </div>
          {Array.isArray(faqs) && faqs.slice(0, 4).map((f, i) => (
            <div key={i} style={{ background: C.bgWhite, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 22px', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textPrimary, marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href={`/${lang}/faq`} style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>{t(lang, 'faq.viewAll')}</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px', background: '#1E3A5F', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-1px' }}>{t(lang, 'cta.title')}</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>{t(lang, 'cta.subtitle')}</p>
        <Link href={`/${lang}/signup`}>
          <button style={{ background: '#fff', color: '#1E3A5F', border: 'none', borderRadius: 10, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {t(lang, 'cta.btn1')}
          </button>
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
