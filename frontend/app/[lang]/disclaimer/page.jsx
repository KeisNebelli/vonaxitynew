'use client';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';

const C = {
  primary:'#2563EB', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4',
  textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF',
  border:'#E5E7EB', warning:'#92400E', warningBg:'#FFFBEB', warningBorder:'#FDE68A',
};

const CONTENT = {
  en: {
    tag: 'Legal',
    title: 'Disclaimer',
    lastUpdated: 'Last updated: May 2026',
    intro: 'Vonaxity is a non-emergency healthcare service platform designed to connect clients with independent healthcare providers, including licensed nurses, and to facilitate access to home-based care, lab services, and health record management tools. Please read this disclaimer carefully before using our platform, website, or services. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by the terms set out below.',
    sections: [
      {
        title: '1. Non-Emergency Services Only',
        body: 'Vonaxity is not an emergency service. In the event of a medical emergency, users must immediately contact their local emergency services. If you or someone in your care is experiencing a medical emergency, call the Albanian Emergency Number 127 immediately or proceed to the nearest emergency facility. Do not use this platform to seek emergency care. Vonaxity accepts no liability for harm arising from delayed emergency response due to use of this platform.',
        highlight: true,
      },
      {
        title: '2. No Medical Advice',
        body: 'Vonaxity does not provide medical advice, diagnosis, or treatment. All medical decisions should be made in consultation with a qualified and licensed healthcare professional. The information, content, and services provided through the Vonaxity platform are for informational and coordination purposes only. Never disregard professional medical advice or delay seeking it because of something you have read or received through this platform.',
      },
      {
        title: '3. Independent Professionals',
        body: 'While Vonaxity conducts a verification process for healthcare professionals prior to approval on the platform, all providers operate as independent professionals. Vonaxity does not directly employ, supervise, or control the medical decisions, actions, or conduct of any healthcare provider. Any care provided is the sole responsibility of the individual provider and the patient. Any contractual or care relationship is solely between the client and the independent professional.',
      },
      {
        title: '4. Verification & Credentialing',
        body: 'Users are encouraged to independently verify the identity and credentials of any caregiver prior to receiving services. While Vonaxity takes reasonable steps to verify professional licenses from the Order of Nurses of Albania, Vonaxity does not guarantee the accuracy, completeness, or current validity of any professional\'s credentials at the time of service delivery.',
      },
      {
        title: '5. Limitation of Liability',
        body: 'To the fullest extent permitted by applicable law, Vonaxity, its founders, directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from: (a) the use or inability to use the platform; (b) any care services provided or not provided by independent professionals; (c) any errors or omissions in platform content; (d) unauthorized access to or alteration of your data; or (e) any other matter relating to the platform or services.',
      },
      {
        title: '6. No Guarantee of Outcomes',
        body: 'Vonaxity makes no representations or warranties, express or implied, regarding the outcome of any care service. Health outcomes depend on many factors outside Vonaxity\'s control, including the patient\'s medical condition, compliance with care instructions, and the professional judgment of the independent nurse. Vonaxity does not guarantee any specific health results.',
      },
      {
        title: '7. Platform Availability',
        body: 'Vonaxity does not guarantee uninterrupted, error-free access to the platform at all times. The platform may be temporarily unavailable due to maintenance, technical issues, or circumstances beyond our control. Vonaxity shall not be liable for any loss or inconvenience caused by platform downtime.',
      },
      {
        title: '8. Privacy & Data',
        body: 'The collection and use of personal and health-related information through the Vonaxity platform is governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described therein. We handle all personal data in accordance with applicable Albanian data protection legislation.',
      },
      {
        title: '9. Governing Law',
        body: 'This disclaimer and any disputes arising in connection with it shall be governed by and construed in accordance with the laws of the Republic of Albania. Any disputes shall be subject to the exclusive jurisdiction of the competent courts of Albania.',
      },
      {
        title: '10. Changes to This Disclaimer',
        body: 'Vonaxity reserves the right to update or modify this disclaimer at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the revised disclaimer. We encourage you to review this page periodically.',
      },
      {
        title: '11. Contact',
        body: 'If you have any questions about this disclaimer or our services, please contact us via WhatsApp or through our website. We are committed to transparency and will do our best to address your concerns promptly.',
      },
    ],
  },
  sq: {
    tag: 'Ligjore',
    title: 'Mohim Përgjegjësie',
    lastUpdated: 'Përditësuar: Maj 2026',
    intro: 'Vonaxity është një platformë shërbimesh shëndetësore jo-urgjente e projektuar për të lidhur klientët me ofrues të pavarur të kujdesit shëndetësor, duke përfshirë infermierë të licencuar, dhe për të lehtësuar qasjen në kujdesin e bazuar në shtëpi, shërbimet laboratorike dhe mjetet e menaxhimit të të dhënave shëndetësore. Ju lutemi lexoni me kujdes këtë mohim para se të përdorni platformën, faqen e internetit ose shërbimet tona. Duke hyrë ose përdorur shërbimet tona, ju pranoni që keni lexuar, kuptuar dhe jeni dakord të jeni të lidhur nga kushtet e mëposhtme.',
    sections: [
      {
        title: '1. Vetëm Shërbime Jo-Urgjente',
        body: 'Vonaxity nuk është një shërbim urgjence. Në rast të një urgjence mjekësore, përdoruesit duhet të kontaktojnë menjëherë shërbimet lokale të urgjencës. Nëse ju ose dikush nën kujdesin tuaj po përjeton një urgjencë mjekësore, thirrni menjëherë Numrin e Urgjencës Shqiptare 127 ose shkoni në objektin e urgjencës më të afërt. Mos e përdorni këtë platformë për të kërkuar kujdes urgjent. Vonaxity nuk pranon asnjë përgjegjësi për dëmet që rezultojnë nga vonesa e reagimit ndaj urgjencës.',
        highlight: true,
      },
      {
        title: '2. Pa Këshilla Mjekësore',
        body: 'Vonaxity nuk ofron këshilla mjekësore, diagnozë ose trajtim. Të gjitha vendimet mjekësore duhet të merren në konsultim me një profesionist të kualifikuar dhe të licencuar të kujdesit shëndetësor. Informacioni, përmbajtja dhe shërbimet e ofruara përmes platformës Vonaxity janë vetëm për qëllime informative dhe koordinimi. Mos e injoroni kurrë këshillën mjekësore profesionale ose vononi kërkimin e saj.',
      },
      {
        title: '3. Profesionistë të Pavarur',
        body: 'Ndërsa Vonaxity kryen një proces verifikimi për profesionistët e kujdesit shëndetësor para aprovimit në platformë, të gjithë ofruesit operojnë si profesionistë të pavarur. Vonaxity nuk punëson, mbikëqyr ose kontrollon drejtpërdrejt vendimet mjekësore, veprimet ose sjelljen e asnjë ofruesi të kujdesit shëndetësor. Çdo kujdes i ofruar është përgjegjësi e vetme e ofruesit individual dhe pacientit. Çdo marrëdhënie kujdesi është vetëm midis klientit dhe profesionistit të pavarur.',
      },
      {
        title: '4. Verifikimi dhe Kredencialet',
        body: 'Përdoruesit inkurajohen të verifikojnë në mënyrë të pavarur identitetin dhe kredencialet e çdo kujdestari para se të marrin shërbime. Ndërsa Vonaxity merr hapa të arsyeshëm për të verifikuar licencat profesionale nga Urdhri i Infermierëve të Shqipërisë, Vonaxity nuk garanton saktësinë, plotësinë ose vlefshmërinë aktuale të kredencialeve të çdo profesionisti në kohën e ofrimit të shërbimit.',
      },
      {
        title: '5. Kufizimi i Përgjegjësisë',
        body: 'Në masën maksimale të lejuar nga ligji i aplikueshëm, Vonaxity, themeluesit, drejtorët, punonjësit dhe bashkëpunëtorët e saj nuk do të jenë përgjegjës për asnjë dëm të drejtpërdrejtë, të tërthortë, aksidental, të veçantë, pasojë ose ndëshkues që lind nga: (a) përdorimi ose pamundësia e përdorimit të platformës; (b) çdo shërbim kujdesi i ofruar ose jo nga profesionistë të pavarur; (c) çdo gabim ose lëshim në përmbajtjen e platformës; ose (d) çdo çështje tjetër që lidhet me platformën ose shërbimet.',
      },
      {
        title: '6. Pa Garanci të Rezultateve',
        body: 'Vonaxity nuk bën asnjë përfaqësim ose garanci, të shprehur ose të nënkuptuar, në lidhje me rezultatin e çdo shërbimi kujdesi. Rezultatet shëndetësore varen nga shumë faktorë jashtë kontrollit të Vonaxity, duke përfshirë gjendjen mjekësore të pacientit, respektimin e udhëzimeve të kujdesit dhe gjykimin profesional të infermierës së pavarur.',
      },
      {
        title: '7. Disponueshmëria e Platformës',
        body: 'Vonaxity nuk garanton qasje të pandërprerë dhe pa gabime në platformë në çdo kohë. Platforma mund të jetë përkohësisht e padisponueshme për shkak të mirëmbajtjes, problemeve teknike ose rrethanave jashtë kontrollit tonë. Vonaxity nuk do të jetë përgjegjëse për asnjë humbje ose shqetësim të shkaktuar nga ndërprerja e platformës.',
      },
      {
        title: '8. Privatësia dhe të Dhënat',
        body: 'Mbledhja dhe përdorimi i informacionit personal dhe shëndetësor përmes platformës Vonaxity rregullohet nga Politika jonë e Privatësisë. Duke përdorur shërbimet tona, ju jepni pëlqimin për mbledhjen dhe përdorimin e informacionit tuaj siç përshkruhet aty. Ne trajtojmë të gjitha të dhënat personale në përputhje me legjislacionin shqiptar të aplikueshëm për mbrojtjen e të dhënave.',
      },
      {
        title: '9. Ligji Rregullues',
        body: 'Ky mohim përgjegjësie dhe çdo mosmarrëveshje që lind në lidhje me të do të rregullohet dhe interpretohet në përputhje me ligjet e Republikës së Shqipërisë. Çdo mosmarrëveshje do t\'i nënshtrohet juridiksionit ekskluziv të gjykatave kompetente të Shqipërisë.',
      },
      {
        title: '10. Ndryshimet në këtë Mohim',
        body: 'Vonaxity rezervon të drejtën të përditësojë ose modifikojë këtë mohim në çdo kohë pa njoftim paraprak. Përdorimi i vazhdueshëm i platformës pas çdo ndryshimi përbën pranimin tuaj të mohimit të rishikuar.',
      },
      {
        title: '11. Kontakti',
        body: 'Nëse keni pyetje rreth këtij mohimi ose shërbimeve tona, ju lutemi na kontaktoni përmes WhatsApp ose faqes sonë të internetit. Jemi të përkushtuar ndaj transparencës dhe do të bëjmë çmos për t\'u adresuar shqetësimet tuaja menjëherë.',
      },
    ],
  },
};

export default function DisclaimerPage({ params }) {
  const lang = params?.lang || 'en';
  const c = CONTENT[lang] || CONTENT.en;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background: C.bg, minHeight:'100vh' }}>
      <Nav lang={lang} />

      {/* Hero */}
      <section style={{ padding:'72px 24px 80px', background:'linear-gradient(135deg,#0F172A 0%,#1E3A5F 55%,#1D4ED8 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.06, pointerEvents:'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="dg" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dg)"/>
          </svg>
        </div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,0.95)', background:'rgba(37,99,235,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:16, border:'1px solid rgba(147,197,253,0.2)' }}>
            {c.tag}
          </div>
          <h1 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:12 }}>
            {c.title}
          </h1>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', margin:0 }}>{c.lastUpdated}</p>
        </div>
      </section>

      {/* Emergency Banner */}
      <div style={{ background:'#7F1D1D', borderBottom:'1px solid #991B1B' }}>
        <div style={{ maxWidth:800, margin:'0 auto', padding:'14px 24px', display:'flex', alignItems:'center', gap:12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p style={{ margin:0, fontSize:14, fontWeight:600, color:'#FCA5A5' }}>
            {lang === 'sq'
              ? 'Vonaxity nuk ofron shërbime urgjente. Nëse keni një urgjencë mjekësore, thirrni menjëherë '
              : 'Vonaxity does not provide emergency services. If you have a medical emergency, call '}
            <strong style={{ color:'#fff' }}>127</strong>
            {lang === 'sq' ? '.' : ' immediately.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <section style={{ padding:'64px 24px 96px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>

          {/* Intro */}
          <p style={{ fontSize:16, color:C.textSecondary, lineHeight:1.85, marginBottom:48, padding:'24px 28px', background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, borderLeft:`4px solid ${C.primary}` }}>
            {c.intro}
          </p>

          {/* Sections */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {c.sections.map((sec, i) => (
              <div key={i} style={{
                background: sec.highlight ? C.warningBg : C.bgWhite,
                border: `1px solid ${sec.highlight ? C.warningBorder : C.border}`,
                borderRadius: 16,
                padding: '28px 32px',
                borderLeft: `4px solid ${sec.highlight ? '#D97706' : C.primary}`,
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:12 }}>
                  {sec.highlight && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:2 }}>
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  )}
                  <h2 style={{ fontSize:16, fontWeight:800, color: sec.highlight ? C.warning : C.textPrimary, margin:0, letterSpacing:'-0.3px' }}>
                    {sec.title}
                  </h2>
                </div>
                <p style={{ fontSize:14, color: sec.highlight ? '#78350F' : C.textSecondary, lineHeight:1.85, margin:0 }}>
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop:48, padding:'20px 24px', background:C.bgSubtle, borderRadius:12, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <p style={{ fontSize:13, color:C.textTertiary, margin:0, lineHeight:1.7 }}>
              {lang === 'sq'
                ? 'Vonaxity SH.P.K. · Durrës, Shqipëri · Themeluar 2025 · Të gjitha të drejtat e rezervuara.'
                : 'Vonaxity L.L.C. · Durrës, Albania · Founded 2025 · All rights reserved.'}
            </p>
          </div>

        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
