import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const ICONS = [
  <svg key="1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  <svg key="3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  <svg key="4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  <svg key="5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  <svg key="6" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
];

export default function ServicesPage({ params }) {
  const lang = params.lang || 'en';
  const services = t(lang, 'services.items');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif" }}>
      <Nav lang={lang} />

      {/* Hero */}
      <section style={{ position:'relative', height:'400px', overflow:'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1400&q=80&auto=format&fit=crop"
          alt="Professional nurse home care services"
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 30%' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(37,99,235,0.75) 0%, rgba(15,23,42,0.6) 100%)' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
          <div>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.85)', background:'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:99, marginBottom:16, border:'1px solid rgba(255,255,255,0.2)' }}>{t(lang,'services.tag')}</div>
            <h1 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, maxWidth:640, margin:'0 auto 16px' }}>{t(lang,'services.title')}</h1>
            <p style={{ fontSize:17, color:'rgba(255,255,255,0.8)', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>{t(lang,'services.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Split section - image + trust message */}
      <section style={{ background:C.bgWhite, padding:'0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:320 }}>
          <div style={{ overflow:'hidden' }}>
            <img
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=700&q=80&auto=format&fit=crop"
              alt="Nurse with patient"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
            />
          </div>
          <div style={{ padding:'48px 48px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:C.primary, marginBottom:16 }}>Certified & verified</div>
            <h2 style={{ fontSize:'clamp(22px,3vw,34px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:16, lineHeight:1.2 }}>Care you can trust, delivered at home</h2>
            <p style={{ fontSize:15, color:C.textSecondary, lineHeight:1.8, marginBottom:24 }}>Every Vonaxity nurse holds a valid license from the Order of Nurses of Albania. We verify credentials, conduct background checks, and monitor every visit so your family is always safe.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['100% licensed & verified nurses','Health report after every visit','Available in 8 Albanian cities'].map((item,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textPrimary, fontWeight:500 }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section style={{ padding:'60px 24px 80px', background:C.bg }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:12 }}>All services included</h2>
            <p style={{ fontSize:15, color:C.textSecondary }}>Every plan includes access to all services below.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(290px,1fr))', gap:16, marginBottom:32 }}>
            {ICONS.map((icon,i) => (
              <div key={i} style={{ background:C.bgWhite, borderRadius:14, border:`1px solid ${C.border}`, padding:24, transition:'box-shadow 0.15s' }}>
                <div style={{ width:44, height:44, borderRadius:11, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>{icon}</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.textPrimary, marginBottom:8 }}>{Array.isArray(services)&&services[i]?.title}</div>
                <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65 }}>{Array.isArray(services)&&services[i]?.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'14px 18px', display:'flex', gap:12, alignItems:'center', marginBottom:32 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p style={{ fontSize:13, color:'#92400E', margin:0 }}><strong>Non-emergency care only.</strong> {t(lang,'services.emergency')} <strong>127</strong> {t(lang,'services.immediately')}</p>
          </div>
          <div style={{ textAlign:'center' }}>
            <Link href={`/${lang}/signup`}><button style={{ background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'14px 36px', fontSize:15, fontWeight:600, cursor:'pointer' }}>{t(lang,'nav.getStarted')}</button></Link>
          </div>
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}
