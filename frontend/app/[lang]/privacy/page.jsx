import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const TR = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: April 2026',
    signIn: 'Sign in',
    sections: [
      { h: '1. Information we collect', p: 'We collect information you provide directly: name, email, phone number, address, and health-related information about your relatives. We also collect usage data such as pages visited and actions taken on the platform.' },
      { h: '2. How we use your information', p: 'We use your information to provide and improve the Service, match clients with nurses, send health reports and notifications, process payments, and comply with legal obligations.' },
      { h: '3. Health data', p: 'Health information about your relatives (vitals, medical notes) is treated with the highest level of confidentiality. It is only accessible to you, the assigned nurse, and Vonaxity administrators. We never sell health data to third parties.' },
      { h: '4. Data sharing', p: 'We do not sell your personal data. We share data only with: nurses assigned to your visits, payment processors (Stripe), email service providers (Resend), and file storage providers (Cloudinary). All partners are bound by data protection agreements.' },
      { h: '5. Data retention', p: 'We retain your account data for as long as your account is active. Health reports are retained for 5 years to support continuity of care. You may request deletion of your account and data at any time.' },
      { h: '6. Your rights (GDPR)', p: 'If you are located in the European Union or UK, you have the right to access, correct, delete, or export your personal data. You also have the right to object to processing and to withdraw consent at any time. Contact us at hello@vonaxity.com to exercise these rights.' },
      { h: '7. Cookies', p: 'We use essential cookies for authentication and session management. We use analytics cookies to understand how users interact with the platform. You can manage cookie preferences through our cookie banner.' },
      { h: '8. Security', p: 'We use industry-standard encryption (TLS) for data in transit and encrypt sensitive data at rest. Access to personal data is restricted to authorized personnel only.' },
      { h: "9. Children's privacy", p: 'The Service is not directed to children under 18. We do not knowingly collect personal information from children.' },
      { h: '10. Contact', p: 'For privacy questions or to exercise your rights, contact us at hello@vonaxity.com.' },
    ],
  },
  sq: {
    title: 'Politika e Privatësisë',
    updated: 'Përditësuar së fundmi: Prill 2026',
    signIn: 'Hyr',
    sections: [
      { h: '1. Informacioni që mbledhim', p: 'Mbledhim informacionin që ju jepni drejtpërdrejt: emrin, emailin, numrin e telefonit, adresën dhe informacionin shëndetësor rreth të afërmve tuaj. Mbledhim gjithashtu të dhëna përdorimi si faqet e vizituara dhe veprimet e kryera në platformë.' },
      { h: '2. Si e përdorim informacionin tuaj', p: 'Përdorim informacionin tuaj për të ofruar dhe përmirësuar Shërbimin, për të lidhur klientët me infermierët, për të dërguar raporte shëndetësore dhe njoftime, për të procesuar pagesat dhe për të respektuar detyrimet ligjore.' },
      { h: '3. Të dhënat shëndetësore', p: 'Informacioni shëndetësor rreth të afërmve tuaj (shenjat vitale, shënimet mjekësore) trajtohet me nivelin më të lartë të konfidencialitetit. Është i aksesueshëm vetëm nga ju, infermierja e caktuar dhe administratorët e Vonaxity-t. Nuk shesim kurrë të dhëna shëndetësore te palët e treta.' },
      { h: '4. Ndarja e të dhënave', p: 'Nuk shesim të dhënat tuaja personale. Ndajmë të dhënat vetëm me: infermierët e caktuar për vizitat tuaja, procesuesit e pagesave (Stripe), ofruesit e shërbimeve email (Resend) dhe ofruesit e ruajtjes së skedarëve (Cloudinary). Të gjithë partnerët janë të lidhur me marrëveshje mbrojtjeje të të dhënave.' },
      { h: '5. Ruajtja e të dhënave', p: 'Ruajmë të dhënat e llogarisë suaj për aq kohë sa llogaria juaj është aktive. Raportet shëndetësore ruhen për 5 vjet për të mbështetur vazhdimësinë e kujdesit. Mund të kërkoni fshirjen e llogarisë dhe të dhënave tuaja në çdo kohë.' },
      { h: '6. Të drejtat tuaja (GDPR)', p: 'Nëse ndodheni në Bashkimin Europian ose Mbretërinë e Bashkuar, keni të drejtë të aksesoni, korrigjoni, fshini ose eksportoni të dhënat tuaja personale. Keni gjithashtu të drejtë të kundërshtoni përpunimin dhe të tërhiqni pëlqimin në çdo kohë. Na kontaktoni në hello@vonaxity.com për të ushtruar këto të drejta.' },
      { h: '7. Cookies', p: 'Përdorim cookies thelbësore për autentifikimin dhe menaxhimin e sesioneve. Përdorim cookies analitike për të kuptuar se si ndërveprojnë përdoruesit me platformën. Mund të menaxhoni preferencat e cookies përmes banderolës sonë.' },
      { h: '8. Siguria', p: 'Përdorim enkriptim standard të industrisë (TLS) për të dhënat në tranzit dhe enkriptojmë të dhënat e ndjeshme në qetësi. Aksesi ndaj të dhënave personale është i kufizuar vetëm për personelin e autorizuar.' },
      { h: '9. Privatësia e fëmijëve', p: 'Shërbimi nuk është i drejtuar ndaj fëmijëve nën 18 vjeç. Nuk mbledhim me dashje informacion personal nga fëmijët.' },
      { h: '10. Kontakt', p: 'Për pyetje rreth privatësisë ose për të ushtruar të drejtat tuaja, na kontaktoni në hello@vonaxity.com.' },
    ],
  },
};

const S = { page:{ minHeight:'100vh', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif" }, nav:{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }, body:{ maxWidth:720, margin:'0 auto', padding:'48px 24px 80px' }, h1:{ fontSize:32, fontWeight:800, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:8 }, h2:{ fontSize:18, fontWeight:700, color:'#0F172A', marginTop:36, marginBottom:12 }, p:{ fontSize:15, color:'#475569', lineHeight:1.8, marginBottom:16 }, date:{ fontSize:13, color:'#94A3B8', marginBottom:40 } };

export default function PrivacyPage({ params }) {
  const lang = params.lang || 'en';
  const tr = TR[lang] || TR.en;
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link href={`/${lang}`} style={{ fontSize:18, fontWeight:700, color:'#2563EB', textDecoration:'none' }}>Vonaxity</Link>
        <Link href={`/${lang}/login`} style={{ fontSize:14, color:'#475569', textDecoration:'none' }}>{tr.signIn}</Link>
      </nav>
      <div style={S.body}>
        <h1 style={S.h1}>{tr.title}</h1>
        <p style={S.date}>{tr.updated}</p>
        {tr.sections.map((s, i) => (
          <div key={i}>
            <h2 style={S.h2}>{s.h}</h2>
            <p style={S.p}>{s.p.includes('hello@vonaxity.com') ? (
              <>
                {s.p.split('hello@vonaxity.com')[0]}
                <a href="mailto:hello@vonaxity.com" style={{ color:'#2563EB' }}>hello@vonaxity.com</a>
                {s.p.split('hello@vonaxity.com')[1]}
              </>
            ) : s.p}</p>
          </div>
        ))}
      </div>
      <Footer lang={lang} />
    </div>
  );
}
