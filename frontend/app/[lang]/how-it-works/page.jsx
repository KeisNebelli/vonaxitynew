import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';
import { StepIcon, TrustIcon } from '@/components/visuals/StepIcons';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const TRUST = [
  { type:'shield', title:'Licensed nurses', sub:'Every nurse holds a valid Albanian nursing license' },
  { type:'check', title:'Background checked', sub:'Criminal record check before joining Vonaxity' },
  { type:'heart', title:'Compassionate care', sub:'Trained to work with elderly and vulnerable patients' },
  { type:'star', title:'Rated by families', sub:'Average rating of 4.8 stars from client families' },
  { type:'globe', title:'International families', sub:'Supporting diaspora from UK, Italy, Germany & more' },
  { type:'home', title:'Home visits only', sub:'We come to your loved one. No travel required.' },
];

export default function HowItWorksPage({ params }) {
  const lang = params.lang || 'en';
  const steps = t(lang, 'howItWorks.steps');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />
      <section style={{ padding:'80px 24px', background:C.bgWhite, textAlign:'center' }}>
        <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>{t(lang,'howItWorks.tag')}</div>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:12 }}>{t(lang,'howItWorks.title')}</h1>
        <p style={{ fontSize:17, color:C.textSecondary, maxWidth:480, margin:'0 auto' }}>{t(lang,'howItWorks.subtitle')}</p>
      </section>

      <section style={{ padding:'40px 24px 64px', background:C.bg }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:60 }}>
            {Array.isArray(steps) && steps.map((s,i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'28px 24px' }}>
                <div style={{ marginBottom:18 }}><StepIcon step={s.num} size={52} /></div>
                <div style={{ display:'inline-block', fontSize:11, fontWeight:700, color:C.primary, letterSpacing:'1.5px', background:C.primaryLight, padding:'3px 10px', borderRadius:99, marginBottom:12 }}>STEP {s.num}</div>
                <div style={{ fontSize:16, fontWeight:600, color:C.textPrimary, marginBottom:10, lineHeight:1.4 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Trust section */}
          <div style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, padding:'40px', marginBottom:40 }}>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99, marginBottom:12 }}>Why trust us</div>
              <h2 style={{ fontSize:28, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', margin:0 }}>Built on trust, verified at every step</h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
              {TRUST.map((item,i) => (
                <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <TrustIcon type={item.type} size={44} />
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4 }}>{item.title}</div>
                    <div style={{ fontSize:12, color:C.textTertiary, lineHeight:1.6 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:'#1E3A5F', borderRadius:18, padding:'40px', textAlign:'center' }}>
            <h2 style={{ fontSize:26, fontWeight:700, color:'#fff', letterSpacing:'-0.5px', marginBottom:12 }}>{t(lang,'cta.title')}</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.6)', marginBottom:28 }}>{t(lang,'cta.subtitle')}</p>
            <Link href={`/${lang}/signup`}><button style={{ background:'#fff', color:'#1E3A5F', border:'none', borderRadius:10, padding:'14px 32px', fontSize:15, fontWeight:700, cursor:'pointer' }}>{t(lang,'cta.btn1')}</button></Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
