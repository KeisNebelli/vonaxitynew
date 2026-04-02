import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NurseAvatar, { StarRating } from '@/components/ui/NurseAvatar';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const NURSES = [
  { id:'1', name:'Elona Berberi', city:'Tirana', rating:4.9, reviews:23, visits:47, bio:'Specialised in cardiovascular monitoring and diabetic care. I have been a home nurse for 6 years, working with elderly patients across Tirana. My approach is calm, thorough, and family-focused — I understand that when you book a visit from abroad, trust is everything.', specialties:['Blood Pressure','Glucose Monitoring','Vitals','General Nursing'], languages:['Albanian','English'], available:true, experience:'6 years', joined:'March 2023', license:'ALB-NURSE-2024-001', reviews_list:[{ client:'Arta M.', rating:5, comment:'Elona was professional, kind and thorough. My mother felt very comfortable.', date:'Nov 28' },{ client:'Besnik K.', rating:5, comment:'Excellent service. Very punctual and explained everything clearly.', date:'Nov 10' },{ client:'Entela H.', rating:4, comment:'Good visit. Would appreciate a bit more detail in the report.', date:'Oct 22' }] },
  { id:'2', name:'Mirjeta Doshi', city:'Durrës', rating:4.7, reviews:18, visits:31, bio:'Experienced in post-surgical care and elderly welfare checks. I bring compassion and clinical precision to every home visit in Durrës and surrounding areas.', specialties:['Welfare Check','Blood Work','Vitals'], languages:['Albanian','Italian'], available:true, experience:'4 years', joined:'June 2023', license:'ALB-NURSE-2024-002', reviews_list:[{ client:'Gjon M.', rating:5, comment:'Mirjeta was fantastic. Arrived on time and was very thorough.', date:'Oct 15' }] },
  { id:'3', name:'Fatjona Leka', city:'Fier', rating:4.9, reviews:14, visits:22, bio:'Dedicated to preventive care and health education. I work closely with families to ensure the best health outcomes for their loved ones in Fier.', specialties:['Blood Pressure','Welfare Check','General'], languages:['Albanian','Greek'], available:true, experience:'5 years', joined:'August 2023', license:'ALB-NURSE-2024-003', reviews_list:[] },
  { id:'4', name:'Arba Hoxha', city:'Elbasan', rating:4.6, reviews:11, visits:19, bio:'Skilled in blood work collection and laboratory coordination. Professional and calm in all patient interactions.', specialties:['Blood Work','Glucose Monitoring','Vitals'], languages:['Albanian'], available:true, experience:'3 years', joined:'October 2023', license:'ALB-NURSE-2024-004', reviews_list:[] },
  { id:'5', name:'Diona Krasniqi', city:'Shkodër', rating:4.8, reviews:9, visits:15, bio:'Passionate about bringing quality healthcare to underserved areas. Specialises in chronic condition monitoring.', specialties:['Blood Pressure','Glucose Monitoring','Blood Work'], languages:['Albanian','English'], available:false, experience:'4 years', joined:'September 2023', license:'ALB-NURSE-2024-005', reviews_list:[] },
  { id:'6', name:'Besa Marku', city:'Tirana', rating:4.7, reviews:16, visits:28, bio:'Experienced in both paediatric and geriatric nursing. Known for her warm and reassuring manner with patients and families.', specialties:['Welfare Check','Vitals','General'], languages:['Albanian','English'], available:true, experience:'7 years', joined:'January 2023', license:'ALB-NURSE-2024-006', reviews_list:[] },
];

function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>; }
function MapPinIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function BriefcaseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>; }
function ShieldIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function CalendarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }

export default function NurseProfilePage({ params }) {
  const lang = params.lang || 'en';
  const nurse = NURSES.find(n => n.id === params.id) || NURSES[0];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* Back link */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'20px 24px 0' }}>
        <Link href={`/${lang}/nurses`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, fontWeight:500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          All nurses
        </Link>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'24px 24px 80px', display:'grid', gridTemplateColumns:'1fr 300px', gap:28, alignItems:'start' }}>

        {/* Left column */}
        <div>
          {/* Profile header */}
          <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'28px', marginBottom:20 }}>
            <div style={{ display:'flex', gap:20, alignItems:'flex-start', marginBottom:24 }}>
              <NurseAvatar name={nurse.name} size={80} verified={nurse.available} />
              <div>
                <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>{nurse.name}</h1>
                <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:10 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}><MapPinIcon />{nurse.city}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}><BriefcaseIcon />{nurse.experience} experience</span>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}><CalendarIcon />Since {nurse.joined}</span>
                </div>
                <StarRating rating={nurse.rating} size={15} />
                <div style={{ fontSize:12, color:C.textTertiary, marginTop:3 }}>{nurse.reviews} reviews · {nurse.visits} visits completed</div>
              </div>
              {nurse.available ? (
                <span style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color:C.secondary, background:C.secondaryLight, padding:'6px 14px', borderRadius:99, display:'inline-flex', alignItems:'center', gap:5, flexShrink:0 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:C.secondary }}/>Available
                </span>
              ) : (
                <span style={{ marginLeft:'auto', fontSize:12, fontWeight:600, color:C.textTertiary, background:C.bgSubtle, padding:'6px 14px', borderRadius:99, flexShrink:0 }}>Unavailable</span>
              )}
            </div>

            <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:10 }}>About</h3>
              <p style={{ fontSize:14, color:C.textSecondary, lineHeight:1.8, margin:0 }}>{nurse.bio}</p>
            </div>
          </div>

          {/* Credentials */}
          <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Credentials & verification</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[['Albanian nursing license','Verified · '+nurse.license],['Background check','Cleared'],['Identity verification','Confirmed'],['Clinical skills assessment','Passed']].map(([label,val]) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:C.textPrimary }}>
                    <span style={{ color:C.secondary }}><ShieldIcon /></span>{label}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:C.secondary }}>
                    <CheckIcon />{val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {nurse.reviews_list && nurse.reviews_list.length > 0 && (
            <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'24px' }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Client reviews</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {nurse.reviews_list.map((r, i) => (
                  <div key={i} style={{ padding:'16px', background:C.bg, borderRadius:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                      <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{r.client}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <StarRating rating={r.rating} size={12} />
                        <span style={{ fontSize:12, color:C.textTertiary }}>{r.date}</span>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7, margin:0 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ position:'sticky', top:80 }}>
          <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'24px', marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:16 }}>Specialties</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
              {nurse.specialties.map(s => (
                <span key={s} style={{ fontSize:12, fontWeight:600, color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99 }}>{s}</span>
              ))}
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>Languages</div>
            <div style={{ display:'flex', gap:8, marginBottom:24 }}>
              {nurse.languages.map(l => (
                <span key={l} style={{ fontSize:12, fontWeight:500, color:C.textSecondary, background:C.bgSubtle, padding:'4px 10px', borderRadius:6 }}>{l}</span>
              ))}
            </div>
            {nurse.available ? (
              <Link href={`/${lang}/signup`}>
                <button style={{ width:'100%', background:C.primary, color:'#fff', border:'none', borderRadius:10, padding:'13px', fontSize:14, fontWeight:600, cursor:'pointer', marginBottom:10, boxShadow:'0 2px 8px rgba(37,99,235,0.2)' }}>
                  Book a visit
                </button>
              </Link>
            ) : (
              <button disabled style={{ width:'100%', background:C.bgSubtle, color:C.textTertiary, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px', fontSize:14, fontWeight:600, cursor:'not-allowed', marginBottom:10 }}>
                Currently unavailable
              </button>
            )}
            <Link href={`/${lang}/nurses`}>
              <button style={{ width:'100%', background:'transparent', color:C.textSecondary, border:`1.5px solid ${C.border}`, borderRadius:10, padding:'12px', fontSize:14, fontWeight:600, cursor:'pointer' }}>
                View all nurses
              </button>
            </Link>
          </div>

          <div style={{ background:C.primaryLight, border:`1px solid rgba(37,99,235,0.15)`, borderRadius:14, padding:'16px 18px' }}>
            <div style={{ fontSize:13, fontWeight:600, color:C.primary, marginBottom:6 }}>Not sure which nurse to choose?</div>
            <div style={{ fontSize:12, color:'#3B82F6', lineHeight:1.6 }}>We automatically match you with the best available nurse in your city when you sign up.</div>
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
