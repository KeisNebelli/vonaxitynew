import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const TR = {
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: April 2026',
    signIn: 'Sign in',
    sections: [
      { h: '1. Acceptance of terms', p: 'By accessing or using Vonaxity ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.' },
      { h: '2. Description of service', p: 'Vonaxity is a platform that connects diaspora families with certified home nurses in Albania. We facilitate the booking, coordination, and reporting of home nurse visits. Vonaxity is not a healthcare provider and does not provide medical advice.' },
      { h: '3. Eligibility', p: 'You must be at least 18 years of age to use this Service. By using the Service, you represent that you are 18 or older and have the legal capacity to enter into these terms.' },
      { h: '4. User accounts', p: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.' },
      { h: '5. Nurse verification', p: 'All nurses on the Vonaxity platform are required to submit their nursing diploma and professional license for verification. However, Vonaxity does not guarantee the accuracy of submitted credentials and recommends clients exercise their own judgment.' },
      { h: '6. Payments and subscriptions', p: 'Vonaxity offers monthly subscription plans. Subscriptions renew automatically unless cancelled. Refunds are handled on a case-by-case basis. Please contact support for refund requests.' },
      { h: '7. Health information', p: 'Health reports generated through Vonaxity are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. Always consult a qualified physician for medical decisions.' },
      { h: '8. Limitation of liability', p: 'Vonaxity shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the 3 months preceding the claim.' },
      { h: '9. Privacy', p: 'Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.', privacyLink: true },
      { h: '10. Changes to terms', p: 'We reserve the right to modify these Terms at any time. We will notify users of material changes via email. Continued use of the Service after changes constitutes acceptance of the new Terms.' },
      { h: '11. Contact', p: 'For questions about these Terms, please contact us at hello@vonaxity.com.' },
    ],
  },
  sq: {
    title: 'Kushtet e Shërbimit',
    updated: 'Përditësuar së fundmi: Prill 2026',
    signIn: 'Hyr',
    sections: [
      { h: '1. Pranimi i kushteve', p: 'Duke aksesuar ose përdorur Vonaxity ("Shërbimi"), ju pranoni të jeni të lidhur me këto Kushte Shërbimi. Nëse nuk jeni dakord me këto kushte, ju lutemi mos e përdorni Shërbimin.' },
      { h: '2. Përshkrimi i shërbimit', p: 'Vonaxity është një platformë që lidh familjet e diasporës me infermierë të certifikuar shtëpiakë në Shqipëri. Ne lehtësojmë rezervimin, koordinimin dhe raportimin e vizitave infermierësh në shtëpi. Vonaxity nuk është ofrues i kujdesit shëndetësor dhe nuk ofron këshilla mjekësore.' },
      { h: '3. Kriteret e pranimit', p: 'Duhet të jeni të paktën 18 vjeç për të përdorur këtë Shërbim. Duke përdorur Shërbimin, deklaroni se jeni 18 vjeç ose më të vjetër dhe keni kapacitetin ligjor për të hyrë në këto kushte.' },
      { h: '4. Llogaritë e përdoruesve', p: 'Jeni përgjegjës për ruajtjen e konfidencialitetit të kredencialeve të llogarisë suaj dhe për të gjitha aktivitetet që ndodhin nën llogarinë tuaj. Jeni dakord të na njoftoni menjëherë për çdo përdorim të paautorizuar të llogarisë suaj.' },
      { h: '5. Verifikimi i infermierëve', p: 'Të gjithë infermierët në platformën Vonaxity janë të detyruar të dorëzojnë diplomën e infermierisë dhe licencën profesionale për verifikim. Megjithatë, Vonaxity nuk garanton saktësinë e kredencialeve të dorëzuara dhe rekomandon klientët të ushtrojnë gjykimin e tyre.' },
      { h: '6. Pagesat dhe abonimi', p: 'Vonaxity ofron plane mujore abonimi. Abonimet ripërtërihen automatikisht nëse nuk anulohen. Rimbursimi trajtohet rast pas rasti. Ju lutemi kontaktoni mbështetjen për kërkesa rimbursimi.' },
      { h: '7. Informacioni shëndetësor', p: 'Raportet shëndetësore të gjeneruara përmes Vonaxity janë vetëm për qëllime informacionale dhe nuk përbëjnë këshilla mjekësore, diagnozë ose trajtim. Konsultohuni gjithmonë me një mjek të kualifikuar për vendime mjekësore.' },
      { h: '8. Kufizimi i përgjegjësisë', p: 'Vonaxity nuk do të jetë përgjegjës për dëmet indirekte, aksidentale, speciale ose pasojë që rrjedhin nga përdorimi juaj i Shërbimit. Përgjegjësia jonë totale nuk do të kalojë shumën që keni paguar në 3 muajt para kërkesës.' },
      { h: '9. Privatësia', p: 'Përdorimi juaj i Shërbimit rregullohet gjithashtu nga Politika jonë e Privatësisë, e cila është e incorporuar në këto Kushte me referencë.', privacyLink: true },
      { h: '10. Ndryshimet e kushteve', p: 'Ne rezervojmë të drejtën të modifikojmë këto Kushte në çdo kohë. Do të njoftojmë përdoruesit e ndryshimeve materiale me email. Vazhdimi i përdorimit të Shërbimit pas ndryshimeve përbën pranimin e Kushteve të reja.' },
      { h: '11. Kontakt', p: 'Për pyetje rreth këtyre Kushteve, na kontaktoni në hello@vonaxity.com.' },
    ],
  },
};

const S = { page:{ minHeight:'100vh', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif" }, nav:{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }, body:{ maxWidth:720, margin:'0 auto', padding:'48px 24px 80px' }, h1:{ fontSize:32, fontWeight:800, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:8 }, h2:{ fontSize:18, fontWeight:700, color:'#0F172A', marginTop:36, marginBottom:12 }, p:{ fontSize:15, color:'#475569', lineHeight:1.8, marginBottom:16 }, date:{ fontSize:13, color:'#94A3B8', marginBottom:40 } };

export default function TermsPage({ params }) {
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
            {s.privacyLink ? (
              <p style={S.p}>
                {s.p.split('Privacy Policy')[0]}
                <Link href={`/${lang}/privacy`} style={{ color:'#2563EB' }}>{t(lang, 'footer.privacy')}</Link>
                {s.p.split('Privacy Policy')[1]}
              </p>
            ) : s.p.includes('hello@vonaxity.com') ? (
              <p style={S.p}>
                {s.p.split('hello@vonaxity.com')[0]}
                <a href="mailto:hello@vonaxity.com" style={{ color:'#2563EB' }}>hello@vonaxity.com</a>
                {s.p.split('hello@vonaxity.com')[1]}
              </p>
            ) : (
              <p style={S.p}>{s.p}</p>
            )}
          </div>
        ))}
      </div>
      <Footer lang={lang} />
    </div>
  );
}
