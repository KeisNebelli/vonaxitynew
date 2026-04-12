import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const S = { page:{ minHeight:'100vh', background:'#FAFAF9', fontFamily:"'Inter',system-ui,sans-serif" }, nav:{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 24px', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }, body:{ maxWidth:720, margin:'0 auto', padding:'48px 24px 80px' }, h1:{ fontSize:32, fontWeight:800, color:'#0F172A', letterSpacing:'-0.5px', marginBottom:8 }, h2:{ fontSize:18, fontWeight:700, color:'#0F172A', marginTop:36, marginBottom:12 }, p:{ fontSize:15, color:'#475569', lineHeight:1.8, marginBottom:16 }, date:{ fontSize:13, color:'#94A3B8', marginBottom:40 } };

export default function PrivacyPage({ params }) {
  const lang = params.lang || 'en';
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link href={`/${lang}`} style={{ fontSize:18, fontWeight:700, color:'#2563EB', textDecoration:'none' }}>Vonaxity</Link>
        <Link href={`/${lang}/login`} style={{ fontSize:14, color:'#475569', textDecoration:'none' }}>Sign in</Link>
      </nav>
      <div style={S.body}>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={S.date}>Last updated: April 2026</p>

        <h2 style={S.h2}>1. Information we collect</h2>
        <p style={S.p}>We collect information you provide directly: name, email, phone number, address, and health-related information about your relatives. We also collect usage data such as pages visited and actions taken on the platform.</p>

        <h2 style={S.h2}>2. How we use your information</h2>
        <p style={S.p}>We use your information to provide and improve the Service, match clients with nurses, send health reports and notifications, process payments, and comply with legal obligations.</p>

        <h2 style={S.h2}>3. Health data</h2>
        <p style={S.p}>Health information about your relatives (vitals, medical notes) is treated with the highest level of confidentiality. It is only accessible to you, the assigned nurse, and Vonaxity administrators. We never sell health data to third parties.</p>

        <h2 style={S.h2}>4. Data sharing</h2>
        <p style={S.p}>We do not sell your personal data. We share data only with: nurses assigned to your visits, payment processors (Stripe), email service providers (Resend), and file storage providers (Cloudinary). All partners are bound by data protection agreements.</p>

        <h2 style={S.h2}>5. Data retention</h2>
        <p style={S.p}>We retain your account data for as long as your account is active. Health reports are retained for 5 years to support continuity of care. You may request deletion of your account and data at any time.</p>

        <h2 style={S.h2}>6. Your rights (GDPR)</h2>
        <p style={S.p}>If you are located in the European Union or UK, you have the right to access, correct, delete, or export your personal data. You also have the right to object to processing and to withdraw consent at any time. Contact us at <a href="mailto:hello@vonaxity.com" style={{ color:'#2563EB' }}>hello@vonaxity.com</a> to exercise these rights.</p>

        <h2 style={S.h2}>7. Cookies</h2>
        <p style={S.p}>We use essential cookies for authentication and session management. We use analytics cookies to understand how users interact with the platform. You can manage cookie preferences through our cookie banner.</p>

        <h2 style={S.h2}>8. Security</h2>
        <p style={S.p}>We use industry-standard encryption (TLS) for data in transit and encrypt sensitive data at rest. Access to personal data is restricted to authorized personnel only.</p>

        <h2 style={S.h2}>9. Children's privacy</h2>
        <p style={S.p}>The Service is not directed to children under 18. We do not knowingly collect personal information from children.</p>

        <h2 style={S.h2}>10. Contact</h2>
        <p style={S.p}>For privacy questions or to exercise your rights, contact us at <a href="mailto:hello@vonaxity.com" style={{ color:'#2563EB' }}>hello@vonaxity.com</a>.</p>
      </div>
      <Footer lang={lang} />
    </div>
  );
}
