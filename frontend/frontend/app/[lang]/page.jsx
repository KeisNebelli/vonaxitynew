import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a',
  neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4',
};

const CITIES = [
  { key: 'Tirana', tag: { en: 'Capital · Most nurses', sq: 'Kryeqyteti · Infermierë të shumtë' } },
  { key: 'Durrës', tag: { en: 'Coastal city', sq: 'Qyteti bregdetar' } },
  { key: 'Elbasan', tag: { en: 'Central Albania', sq: 'Shqipëria qendrore' } },
  { key: 'Fier', tag: { en: 'Southern hub', sq: 'Qendër jugore' } },
  { key: 'Berat', tag: { en: 'UNESCO city', sq: 'Qyteti UNESCO' } },
  { key: 'Sarandë', tag: { en: 'Riviera region', sq: 'Rajoni i Rivierës' } },
  { key: 'Kukës', tag: { en: 'Northern Albania', sq: 'Shqipëria veriore' } },
  { key: 'Shkodër', tag: { en: 'Northern hub', sq: 'Qendër veriore' } },
];

const PLANS = [
  { name: 'Basic', price: '€30', visits: 1, featured: false },
  { name: 'Standard', price: '€50', visits: 2, featured: true },
  { name: 'Premium', price: '€120', visits: 4, featured: false },
];

const ICONS = ['❤️','🩸','📊','🧪','👁️','🏥'];

export default function HomePage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');
  const faqs = t(lang, 'faq.items');
  const steps = t(lang, 'howItWorks.steps');

  return (
    <div style={{ fontFamily: 'system-ui,sans-serif', background: C.white }}>
      <Nav lang={lang} />
      <section style={{ padding: '80px 24px', background: 'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: C.teal, background: C.tealLight, padding: '5px 12px', borderRadius: 20, marginBottom: 16 }}>{t(lang, 'hero.badge')}</div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 20px' }}>
            {t(lang, 'hero.headline1')}<br /><span style={{ color: C.teal }}>{t(lang, 'hero.headline2')}</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', color: C.neutralMid, lineHeight: 1.7, maxWidth: 540, margin: '0 0 36px' }}>{t(lang, 'hero.subtitle')}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href={`/${lang}/signup`}><button style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '16px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{t(lang, 'hero.cta1')}</button></Link>
            <Link href={`/${lang}/how-it-works`}><button style={{ background: 'transparent', color: C.teal, border: `2px solid ${C.teal}`, borderRadius: 10, padding: '15px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{t(lang, 'hero.cta2')}</button></Link>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[['500+', t(lang,'hero.stat1')],['8',t(lang,'hero.stat2')],['100%',t(lang,'hero.stat3')]].map(([n,l]) => (
              <div key={l}><div style={{ fontSize: 28, fontWeight: 800, color: C.teal, letterSpacing: '-1px' }}>{n}</div><div style={{ fontSize: 13, color: C.neutralMid }}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: C.neutral }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>{t(lang,'howItWorks.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            {Array.isArray(steps) && steps.slice(0,4).map((s,i) => (
              <div key={i} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 22 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '1.5px', marginBottom: 8 }}>STEP {s.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>{t(lang,'services.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
            {ICONS.map((icon,i) => (
              <div key={i} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '22px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 5 }}>{Array.isArray(services) && services[i]?.title}</div>
                  <div style={{ fontSize: 13, color: C.neutralMid, lineHeight: 1.6 }}>{Array.isArray(services) && services[i]?.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: '16px 20px', background: '#fff7ed', borderRadius: 12, border: '1px solid #fed7aa', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span>⚠️</span>
            <p style={{ fontSize: 14, color: '#92400e', margin: 0 }}><strong>{lang==='sq'?'E rëndësishme':'Important'}:</strong> {t(lang,'services.emergency')} <strong>127</strong> {t(lang,'services.immediately')}</p>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: C.tealLight }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 12px', letterSpacing: '-0.8px' }}>{t(lang,'pricing.title')}</h2>
          <p style={{ fontSize: 16, color: C.neutralMid, marginBottom: 40 }}>{t(lang,'pricing.subtitle')}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 18 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background: C.white, borderRadius: 18, border: p.featured?`2px solid ${C.teal}`:`1px solid ${C.border}`, padding: '28px 24px', position: 'relative' }}>
                {p.featured && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: C.teal, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>{t(lang,'pricing.mostPopular')}</div>}
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralMid, marginBottom: 8 }}>{p.name}</div>
                <div style={{ fontSize: 42, fontWeight: 800, color: C.neutralDark, letterSpacing: '-1.5px', marginBottom: 4 }}>{p.price}</div>
                <div style={{ fontSize: 13, color: C.neutralMid, marginBottom: 8 }}>{t(lang,'pricing.perMonth')}</div>
                <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, background: C.tealLight, display: 'inline-block', padding: '3px 12px', borderRadius: 20, marginBottom: 20 }}>{p.visits} {p.visits===1?t(lang,'pricing.visitMonth'):t(lang,'pricing.visitsMonth')}</div>
                <br />
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}><button style={{ width: '100%', padding: '12px', borderRadius: 10, border: p.featured?'none':`2px solid ${C.teal}`, background: p.featured?C.teal:'transparent', color: p.featured?'#fff':C.teal, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>{t(lang,'pricing.getStarted')}</button></Link>
                <div style={{ fontSize: 12, color: C.neutralMid, marginTop: 8 }}>{t(lang,'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: C.white }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 36px', letterSpacing: '-0.8px' }}>{t(lang,'cities.title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
            {CITIES.map(city => (
              <div key={city.key} style={{ background: C.neutral, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.sage, flexShrink: 0 }} />
                <div><div style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{city.key}</div><div style={{ fontSize: 11, color: C.neutralMid }}>{city.tag[lang]||city.tag.en}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: C.neutral }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: C.neutralDark, fontFamily: 'Georgia,serif', margin: '0 0 36px', textAlign: 'center', letterSpacing: '-0.8px' }}>{t(lang,'faq.title')}</h2>
          {Array.isArray(faqs) && faqs.slice(0,4).map((f,i) => (
            <div key={i} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '18px 20px', marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.neutralDark, marginBottom: 8 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: C.neutralMid, lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: 20 }}><Link href={`/${lang}/faq`} style={{ color: C.teal, fontWeight: 600, fontSize: 14 }}>{t(lang,'faq.viewAll')}</Link></div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: `linear-gradient(135deg,${C.teal},#164e63)`, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 16, letterSpacing: '-1px' }}>{t(lang,'cta.title')}</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>{t(lang,'cta.subtitle')}</p>
        <Link href={`/${lang}/signup`}><button style={{ background: '#fff', color: C.teal, border: 'none', borderRadius: 10, padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{t(lang,'cta.btn1')}</button></Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
