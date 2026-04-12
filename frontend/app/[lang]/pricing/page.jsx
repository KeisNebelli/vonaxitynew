import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

async function getPricing() {
  try {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
    const res = await fetch(`${BASE}/settings/public`, { next: { revalidate: 300 } }); // cache 5 min
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return { basicPrice:30, standardPrice:50, premiumPrice:120, basicVisits:1, standardVisits:2, premiumVisits:4 };
  }
}

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

export default async function PricingPage({ params }) {
  const lang = params.lang || 'en';
  const pricing = await getPricing();

  const PLANS = [
    { name:'Basic', price:pricing.basicPrice, visits:pricing.basicVisits, featured:false, features:['Blood pressure checks','Glucose monitoring','Full vitals','Post-visit health report','Email support'] },
    { name:'Standard', price:pricing.standardPrice, visits:pricing.standardVisits, featured:true, features:['Blood pressure checks','Glucose monitoring','Full vitals','Post-visit health reports','Priority scheduling','WhatsApp support'] },
    { name:'Premium', price:pricing.premiumPrice, visits:pricing.premiumVisits, featured:false, features:['Blood pressure checks','Glucose monitoring','Full vitals','Priority nurse matching','Monthly health summary','Multi-relative profiles','24/7 WhatsApp support'] },
  ];
  const PLANS_SQ = [
    { name:'Basic', price:pricing.basicPrice, visits:pricing.basicVisits, featured:false, features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Raport shëndetësor','Mbështetje email'] },
    { name:'Standard', price:pricing.standardPrice, visits:pricing.standardVisits, featured:true, features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Planifikim prioritar','Mbështetje WhatsApp'] },
    { name:'Premium', price:pricing.premiumPrice, visits:pricing.premiumVisits, featured:false, features:['Kontrolli i presionit','Monitorimi i glukozës','Shenjat vitale','Caktim prioritar infermiereje','Përmbledhje mujore','Profilet e shumta'] },
  ];

  const plans = lang === 'sq' ? PLANS_SQ : PLANS;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />
      <section style={{ padding:'72px 24px', background:C.bgWhite, textAlign:'center' }}>
        <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>{t(lang,'pricing.tag')}</div>
        <h1 style={{ fontSize:'clamp(30px,5vw,50px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:12 }}>{t(lang,'pricing.title')}</h1>
        <p style={{ fontSize:17, color:C.textSecondary, maxWidth:440, margin:'0 auto' }}>{t(lang,'pricing.subtitle')}</p>
      </section>
      <section style={{ padding:'60px 24px 80px', background:C.primaryLight }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
            {plans.map(p => (
              <div key={p.name} style={{ background:C.bgWhite, borderRadius:20, border:p.featured?`2px solid ${C.primary}`:`1px solid ${C.border}`, padding:'28px 24px', position:'relative', boxShadow:p.featured?'0 8px 32px rgba(37,99,235,0.12)':'none' }}>
                {p.featured && <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:C.primary, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 14px', borderRadius:99, whiteSpace:'nowrap' }}>{t(lang,'pricing.mostPopular')}</div>}
                <div style={{ fontSize:13, fontWeight:600, color:C.textTertiary, marginBottom:8 }}>{p.name}</div>
                <div style={{ fontSize:44, fontWeight:700, color:C.textPrimary, letterSpacing:'-2px', marginBottom:4 }}>€{p.price}</div>
                <div style={{ fontSize:13, color:C.textTertiary, marginBottom:16 }}>{t(lang,'pricing.perMonth')}</div>
                <div style={{ fontSize:13, fontWeight:600, color:C.primary, background:C.primaryLight, display:'inline-block', padding:'4px 12px', borderRadius:99, marginBottom:24 }}>
                  {p.visits} {p.visits===1?t(lang,'pricing.visitMonth'):t(lang,'pricing.visitsMonth')}
                </div>
                <ul style={{ listStyle:'none', padding:0, margin:'0 0 24px' }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:C.textSecondary, padding:'6px 0', borderBottom:`1px solid #F9FAFB` }}>
                      <CheckIcon />{f}
                    </li>
                  ))}
                </ul>
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width:'100%', padding:'12px', borderRadius:10, border:p.featured?'none':`2px solid ${C.primary}`, background:p.featured?C.primary:'transparent', color:p.featured?'#fff':C.primary, fontSize:14, fontWeight:600, cursor:'pointer' }}>
                    {t(lang,'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize:11, color:C.textTertiary, textAlign:'center', marginTop:10 }}>{t(lang,'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:32, background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', gap:12, alignItems:'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p style={{ fontSize:13, color:'#92400E', margin:0 }}>Non-emergency care only. Emergency in Albania: <strong>127</strong></p>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
