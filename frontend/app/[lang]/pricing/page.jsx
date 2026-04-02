import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const PLANS = [
  { name:'Basic',price:30,visits:1,featured:false,features:['blood_pressure','glucose','vitals','report','email'] },
  { name:'Standard',price:50,visits:2,featured:true,features:['blood_pressure','glucose','vitals','report','priority','whatsapp'] },
  { name:'Premium',price:120,visits:4,featured:false,features:['blood_pressure','glucose','vitals','report','priority','whatsapp','nurse_match','monthly_summary'] },
];

export default function PricingPage({ params }) {
  const lang = params.lang || 'en';
  const C = { teal:'#0e7490',tealLight:'#e0f2fe',sage:'#16a34a',neutral:'#f8f7f4',neutralDark:'#1c1917',neutralMid:'#78716c',white:'#ffffff',border:'#e7e5e4' };

  const planFeatures = {
    en: { blood_pressure:'Blood pressure checks',glucose:'Glucose monitoring',vitals:'Full vitals',report:'Post-visit health report',email:'Email support',priority:'Priority scheduling',whatsapp:'WhatsApp support',nurse_match:'Priority nurse matching',monthly_summary:'Monthly health summary' },
    sq: { blood_pressure:'Kontrolli i presionit',glucose:'Monitorimi i glukozës',vitals:'Shenjat vitale',report:'Raport shëndetësor',email:'Mbështetje me email',priority:'Planifikim prioritar',whatsapp:'Mbështetje WhatsApp',nurse_match:'Caktim prioritar infermiereje',monthly_summary:'Përmbledhje mujore shëndetësore' }
  };

  return (
    <div style={{ fontFamily:'system-ui,sans-serif',background:C.white }}>
      <Nav lang={lang} />
      <section style={{ padding:'72px 24px',background:'linear-gradient(155deg,#f0f9ff,#f8f7f4,#f0fdf4)',textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(30px,5vw,52px)',fontWeight:800,color:C.neutralDark,fontFamily:'Georgia,serif',marginBottom:12,letterSpacing:'-1.5px' }}>{t(lang,'pricing.title')}</h1>
        <p style={{ fontSize:17,color:C.neutralMid,maxWidth:440,margin:'0 auto' }}>{t(lang,'pricing.subtitle')}</p>
      </section>
      <section style={{ padding:'60px 24px',background:C.tealLight }}>
        <div style={{ maxWidth:1000,margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:20 }}>
            {PLANS.map(p => (
              <div key={p.name} style={{ background:C.white,borderRadius:18,border:p.featured?`2px solid ${C.teal}`:`1px solid ${C.border}`,padding:'28px 24px',position:'relative',boxShadow:p.featured?'0 8px 32px rgba(8,145,178,0.14)':'none' }}>
                {p.featured && <div style={{ position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:C.teal,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:20 }}>{t(lang,'pricing.mostPopular')}</div>}
                <div style={{ fontSize:14,fontWeight:700,color:C.neutralMid,marginBottom:6 }}>{p.name}</div>
                <div style={{ fontSize:42,fontWeight:800,color:C.neutralDark,letterSpacing:'-1.5px',marginBottom:4 }}>€{p.price}</div>
                <div style={{ fontSize:13,color:C.neutralMid,marginBottom:16 }}>{t(lang,'pricing.perMonth')}</div>
                <div style={{ fontSize:12,color:C.teal,fontWeight:600,background:C.tealLight,display:'inline-block',padding:'3px 12px',borderRadius:20,marginBottom:20 }}>
                  {p.visits} {p.visits===1?t(lang,'pricing.visitMonth'):t(lang,'pricing.visitsMonth')}
                </div>
                <ul style={{ listStyle:'none',marginBottom:24,padding:0 }}>
                  {p.features.map(f => <li key={f} style={{ fontSize:13,color:C.neutralMid,padding:'5px 0',borderBottom:`1px solid ${C.border}`,display:'flex',gap:8 }}><span style={{ color:C.sage,fontWeight:700 }}>✓</span>{(planFeatures[lang]||planFeatures.en)[f]}</li>)}
                </ul>
                <Link href={`/${lang}/signup?plan=${p.name.toLowerCase()}`}>
                  <button style={{ width:'100%',padding:'12px',borderRadius:10,border:p.featured?'none':`2px solid ${C.teal}`,background:p.featured?C.teal:'transparent',color:p.featured?'#fff':C.teal,fontSize:14,fontWeight:700,cursor:'pointer' }}>
                    {t(lang,'pricing.getStarted')}
                  </button>
                </Link>
                <div style={{ fontSize:12,color:C.neutralMid,textAlign:'center',marginTop:8 }}>{t(lang,'pricing.trialNote')}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
