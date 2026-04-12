import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const S = { page:{ minHeight:'100vh', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif" }, nav:{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }, body:{ maxWidth:720, margin:'0 auto', padding:'48px 24px 80px' }, h1:{ fontSize:32, fontWeight:800, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:8 }, h2:{ fontSize:18, fontWeight:700, color:'#0F172A', marginTop:36, marginBottom:12 }, p:{ fontSize:15, color:'#475569', lineHeight:1.8, marginBottom:16 }, date:{ fontSize:13, color:'#94A3B8', marginBottom:40 } };

export default function TermsPage({ params }) {
  const lang = params.lang || 'en';
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link href={`/${lang}`} style={{ fontSize:18, fontWeight:700, color:'#2563EB', textDecoration:'none' }}>Vonaxity</Link>
        <Link href={`/${lang}/login`} style={{ fontSize:14, color:'#475569', textDecoration:'none' }}>Sign in</Link>
      </nav>
      <div style={S.body}>
        <h1 style={S.h1}>Terms of Service</h1>
        <p style={S.date}>Last updated: April 2026</p>

        <h2 style={S.h2}>1. Acceptance of terms</h2>
        <p style={S.p}>By accessing or using Vonaxity ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>

        <h2 style={S.h2}>2. Description of service</h2>
        <p style={S.p}>Vonaxity is a platform that connects diaspora families with certified home nurses in Albania. We facilitate the booking, coordination, and reporting of home nurse visits. Vonaxity is not a healthcare provider and does not provide medical advice.</p>

        <h2 style={S.h2}>3. Eligibility</h2>
        <p style={S.p}>You must be at least 18 years of age to use this Service. By using the Service, you represent that you are 18 or older and have the legal capacity to enter into these terms.</p>

        <h2 style={S.h2}>4. User accounts</h2>
        <p style={S.p}>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

        <h2 style={S.h2}>5. Nurse verification</h2>
        <p style={S.p}>All nurses on the Vonaxity platform are required to submit their nursing diploma and professional license for verification. However, Vonaxity does not guarantee the accuracy of submitted credentials and recommends clients exercise their own judgment.</p>

        <h2 style={S.h2}>6. Payments and subscriptions</h2>
        <p style={S.p}>Vonaxity offers monthly subscription plans. Subscriptions renew automatically unless cancelled. Refunds are handled on a case-by-case basis. Please contact support for refund requests.</p>

        <h2 style={S.h2}>7. Health information</h2>
        <p style={S.p}>Health reports generated through Vonaxity are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. Always consult a qualified physician for medical decisions.</p>

        <h2 style={S.h2}>8. Limitation of liability</h2>
        <p style={S.p}>Vonaxity shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid in the 3 months preceding the claim.</p>

        <h2 style={S.h2}>9. Privacy</h2>
        <p style={S.p}>Your use of the Service is also governed by our <Link href={`/${lang}/privacy`} style={{ color:'#2563EB' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>

        <h2 style={S.h2}>10. Changes to terms</h2>
        <p style={S.p}>We reserve the right to modify these Terms at any time. We will notify users of material changes via email. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

        <h2 style={S.h2}>11. Contact</h2>
        <p style={S.p}>For questions about these Terms, please contact us at <a href="mailto:hello@vonaxity.com" style={{ color:'#2563EB' }}>hello@vonaxity.com</a>.</p>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
