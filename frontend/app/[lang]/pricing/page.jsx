'use client';
import { useState, useEffect } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };
const DEFAULT_PRICING = { basicPrice:30, standardPrice:50, premiumPrice:120, basicVisits:1, standardVisits:2, premiumVisits:4 };

function CheckIcon({ color = '#059669' }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

const TRUST_ITEMS = {
  en: ['7-day free trial', 'Cancel anytime', 'No hidden fees'],
  sq: ['7 ditë provë falas', 'Anulim kur të dëshironi', 'Pa tarifa të fshehura'],
};

const FAQ_ITEMS = {
  en: [
    { q: 'Can I change my plan?', a: 'Yes — upgrade or downgrade anytime. Changes take effect at the next billing cycle.' },
    { q: 'What happens after the free trial?', a: 'You\'ll be prompted to add a payment method. No charge until the trial ends.' },
    { q: 'Is there a long-term contract?', a: 'No. All plans are month-to-month with no lock-in.' },
  ],
  sq: [
    { q: 'A mund ta ndryshoj planin?', a: 'Po — rriteni ose uleni planin kur të dëshironi. Ndryshimet hyjnë në fuqi nga cikli i ardhshëm.' },
    { q: 'Çfarë ndodh pas provës falas?', a: 'Do t\'ju kërkohet të shtoni metodën e pagesës. Nuk ka tarifë deri në fund të periudhës së provës.' },
    { q: 'A ka kontratë afatgjatë?', a: 'Jo. Të gjitha planet janë mujore pa asnjë detyrim.' },
  ],
};

export default function PricingPage({ params }) {
  const lang = params.lang || 'en';
  const [pricing, setPricing] = useState(DEFAULT_PRICING);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
    fetch(`${BASE}/settings/public`)
      .then(r => r.json())
      .then(data => setPricing(data))
      .catch(() => setPricing(DEFAULT_PRICING));
  }, []);

  const PLANS = [
    { name:'Basic', price:pricing.basicPrice, visits:pricing.basicVisits, featured:false,
      features:['Blood pressure checks','Glucose monitoring','Full vitals','Post-visit health report','Email support'] },
    { name:'Standard', price:pricing.standardPrice, visits:pricing.standardVisits, featured:true,
      features:['Blood pressure checks','Glucose monitoring','Full vitals','Post-visit health reports','Priority scheduling','WhatsApp support'] },
    { name:'Premium', price:pricing.premiumPrice, visits:pricing.premiumVisits, featured:false,
      features:['Blood pressure checks','Glucose monitoring','Full vitals','Priority nurse matching','Monthly health summary','Multi-relative profiles','24/7 WhatsApp support'] },
  ];
  const PLANS_SQ = [
    { name:'Basic', price:pricing.basicPrice, visits:pricing.basicVisits, featured:false,
      features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Raport shëndetësor','Mbështetje email'] },
    { name:'Standard', price:pricing.standardPrice, visits:pricing.standardVisits, featured:true,
      features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Planifikim prioritar','Mbështetje WhatsApp'] },
    { name:'Premium', price:pricing.premiumPrice, visits:pricing.premiumVisits, featured:false,
      features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Caktim prioritar infermiereje','Përmbledhje mujore','Profilet e shumta','Mbështetje 24/7 WhatsApp'] },
  ];

  const plans = lang === 'sq' ? PLANS_SQ : PLANS;
  const faqs = FAQ_ITEMS[lang] || FAQ_ITEMS.en;
  const trust = TRUST_ITEMS[lang] || TRUST_ITEMS.en;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <style>{`
        .px-plan-card { transition: transform 0.2s, box-shadow 0.2s; }
        .px-plan-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
        .px-plan-card.featured:hover { box-shadow: 0 12px 48px rgba(37,99,235,0.22) !important; }
        .px-faq-row { cursor: pointer; transition: background 0.15s; border-radius: 14px; }
        .px-faq-row:hover { background: #F5F5F4; }
      `}</style>
      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'88px 24px 120px', background:'linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #1D4ED8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Grid pattern */}
        <div style={{ position:'absolute', inset:0, opacity:0.06 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="pg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#pg)"/>
          </svg>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:20, border:'1px solid rgba(147,197,253,0.2)' }}>
            {t(lang,'pricing.tag')}
          </div>
          <h1 style={{ fontSize:'clamp(32px,5vw,54px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', lineHeight:1.1, marginBottom:16 }}>
            {t(lang,'pricing.title')}
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.68)', maxWidth:460, margin:'0 auto 36px', lineHeight:1.75 }}>
            {t(lang,'pricing.subtitle')}
          </p>
          {/* Trust pills */}
          <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
            {trust.map(item => (
              <div key={item} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:99, padding:'7px 16px', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.88)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans (pulled up to overlap hero) ── */}
      <section style={{ padding:'0 24px 72px', marginTop:-60 }}>
        <div style={{ maxWidth:980, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
            {plans.map(p => (
              <div key={p.name} className={`px-plan-card${p.featured?' featured':''}`} style={{
                background: C.bgWhite,
                borderRadius: 20,
                border: p.featured ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                padding: '32px 28px',
                position: 'relative',
                boxShadow: p.featured ? '0 8px 40px rgba(37,99,235,0.14)' : '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                {p.featured && (
                  <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:C.primary, color:'#fff', fontSize:11, fontWeight:700, padding:'5px 16px', borderRadius:99, whiteSpace:'nowrap', letterSpacing:'0.3px' }}>
                    {t(lang,'pricing.mostPopular')}
                  </div>
                )}
                <div style={{ fontSize:13, fontWeight:700, color: p.featured ? C.primary : C.textTertiary, marginBottom:12, textTransform:'uppercase', letterSpacing:'0.5px' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:4 }}>
                  <span style={{ fontSize:52, fontWeight:800, color:C.textPrimary, letterSpacing:'-3px', lineHeight:1 }}>€{p.price}</span>
                </div>
                <div style={{ fontSize:13, color:C.textTertiary, marginBottom:20 }}>{t(lang,'pricing.perMonth')}</div>
                <div style={{ fontSize:13, fontWeight:700, color: p.featured ? '#fff' : C.primary, background: p.featured ? C.primary : C.primaryLight, display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, marginBottom:28 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {p.visits} {p.visits===1 ? t(lang,'pricing.visitMonth') : t(lang,'pricing.visitsMonth')}
                </div>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 28px' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:C.textSecondary, padding:'7px 0', borderBottom:`1px solid ${C.borderSubtle || '#F9FAFB'}` }}>
                      <div style={{ flexShrink:0 }}><CheckIcon color={p.featured ? C.primary : C.secondary} /></div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width:'100%', padding:'13px', borderRadius:11, border: p.featured ? 'none' : `2px solid ${C.primary}`, background: p.featured ? C.primary : 'transparent', color: p.featured ? '#fff' : C.primary, fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'0.1px' }}>
                    {t(lang,'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize:11, color:C.textTertiary, textAlign:'center', marginTop:12 }}>{t(lang,'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:'0 24px 80px' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:20, textAlign:'center' }}>
            {lang === 'sq' ? 'Pyetje të shpeshta' : 'Common questions'}
          </h2>
          {faqs.map((f, i) => (
            <div key={i} className="px-faq-row" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding:'18px 20px', marginBottom:6, background: openFaq === i ? '#F5F5F4' : C.bgWhite, border:`1px solid ${C.border}`, borderRadius:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}>
                <span style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{f.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, transform: openFaq===i ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {openFaq === i && <p style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7, margin:'12px 0 0' }}>{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── Non-emergency note ── */}
      <section style={{ padding:'0 24px 80px' }}>
        <div style={{ maxWidth:640, margin:'0 auto', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', gap:12, alignItems:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p style={{ fontSize:13, color:'#92400E', margin:0 }}>{t(lang, 'signup.nonEmergency')} <strong>127</strong></p>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
