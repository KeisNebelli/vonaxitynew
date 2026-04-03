import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NurseAvatar, { StarRating } from '@/components/ui/NurseAvatar';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

const NURSES = [
  { id:1, name:'Elona Berberi', city:'Tirana', rating:4.9, reviews:23, visits:47, bio:'Specialised in cardiovascular monitoring and diabetic care. 6 years of home nursing experience across Tirana.', specialties:['Blood Pressure','Glucose Monitoring','Vitals'], languages:['Albanian','English'], available:true, experience:'6 years' },
  { id:2, name:'Mirjeta Doshi', city:'Durrës', rating:4.7, reviews:18, visits:31, bio:'Experienced in post-surgical care and elderly welfare checks. Compassionate approach with elderly patients.', specialties:['Welfare Check','Blood Work','Vitals'], languages:['Albanian','Italian'], available:true, experience:'4 years' },
  { id:3, name:'Fatjona Leka', city:'Fier', rating:4.9, reviews:14, visits:22, bio:'Dedicated to preventive care and health education. Works closely with families to ensure the best outcomes.', specialties:['Blood Pressure','Welfare Check','General'], languages:['Albanian','Greek'], available:true, experience:'5 years' },
  { id:4, name:'Arba Hoxha', city:'Elbasan', rating:4.6, reviews:11, visits:19, bio:'Skilled in blood work collection and laboratory coordination. Calm and professional in all interactions.', specialties:['Blood Work','Glucose Monitoring','Vitals'], languages:['Albanian'], available:true, experience:'3 years' },
  { id:5, name:'Diona Krasniqi', city:'Shkodër', rating:4.8, reviews:9, visits:15, bio:'Passionate about bringing quality healthcare to underserved areas. Specialises in chronic condition monitoring.', specialties:['Blood Pressure','Glucose Monitoring','Blood Work'], languages:['Albanian','English'], available:false, experience:'4 years' },
  { id:6, name:'Besa Marku', city:'Tirana', rating:4.7, reviews:16, visits:28, bio:'Experienced paediatric and geriatric nurse. Known for her warm and reassuring manner with patients.', specialties:['Welfare Check','Vitals','General'], languages:['Albanian','English'], available:true, experience:'7 years' },
];

const CITIES = ['All cities', 'Tirana', 'Durrës', 'Elbasan', 'Fier', 'Shkodër'];

function ShieldIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function MapPinIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function BriefcaseIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>; }

export default function NursesPage({ params }) {
  const lang = params.lang || 'en';
  const available = NURSES.filter(n => n.available);

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* Hero */}
      <section style={{ padding:'72px 24px 56px', background:C.bgWhite, textAlign:'center' }}>
        <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, marginBottom:16 }}>
          Our nurses
        </div>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:700, color:C.textPrimary, letterSpacing:'-1px', marginBottom:12 }}>
          Meet your care team
        </h1>
        <p style={{ fontSize:17, color:C.textSecondary, maxWidth:480, margin:'0 auto 40px', lineHeight:1.7 }}>
          Every Vonaxity nurse is licensed, background-checked, and verified before their first visit. Real people, real care.
        </p>

        {/* Trust badges */}
        <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
          {[['Licensed & verified','Every nurse holds a valid Albanian nursing license'],['Background checked','Criminal record check before joining'],['Ongoing training','Regular clinical skills updates']].map(([title, sub]) => (
            <div key={title} style={{ display:'flex', alignItems:'center', gap:10, background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'10px 16px' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', color:C.primary, flexShrink:0 }}><ShieldIcon /></div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.textPrimary }}>{title}</div>
                <div style={{ fontSize:11, color:C.textTertiary, marginTop:1 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background:C.primaryLight, borderTop:`1px solid rgba(37,99,235,0.1)`, borderBottom:`1px solid rgba(37,99,235,0.1)`, padding:'20px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:20 }}>
          {[['6+','Verified nurses'],['4.8','Average rating'],['8','Cities covered'],['150+','Visits completed']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:700, color:C.primary, letterSpacing:'-1px' }}>{n}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Nurse grid */}
      <section style={{ padding:'56px 24px 80px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
            {NURSES.map(nurse => (
              <div key={nurse.id} style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s' }}>
                {/* Card header */}
                <div style={{ padding:'24px 24px 0' }}>
                  <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:16 }}>
                    <NurseAvatar name={nurse.name} size={64} verified={nurse.available} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:17, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px', marginBottom:4 }}>{nurse.name}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textTertiary, marginBottom:6 }}>
                        <span style={{ color:C.textTertiary }}><MapPinIcon /></span> {nurse.city}
                        <span style={{ margin:'0 4px', color:C.border }}>·</span>
                        <span style={{ color:C.textTertiary }}><BriefcaseIcon /></span> {nurse.experience}
                      </div>
                      <StarRating rating={nurse.rating} size={13} />
                      <div style={{ fontSize:11, color:C.textTertiary, marginTop:2 }}>{nurse.reviews} reviews · {nurse.visits} visits</div>
                    </div>
                    <div style={{ flexShrink:0 }}>
                      {nurse.available ? (
                        <span style={{ fontSize:11, fontWeight:700, color:C.secondary, background:C.secondaryLight, padding:'4px 10px', borderRadius:99, display:'inline-flex', alignItems:'center', gap:4 }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }} />Available
                        </span>
                      ) : (
                        <span style={{ fontSize:11, fontWeight:600, color:C.textTertiary, background:C.bgSubtle, padding:'4px 10px', borderRadius:99 }}>Unavailable</span>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7, marginBottom:16 }}>{nurse.bio}</p>

                  {/* Specialties */}
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
                    {nurse.specialties.map(s => (
                      <span key={s} style={{ fontSize:11, fontWeight:600, color:C.primary, background:C.primaryLight, padding:'4px 10px', borderRadius:99 }}>{s}</span>
                    ))}
                  </div>

                  {/* Languages */}
                  <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:20 }}>
                    <span style={{ fontSize:11, color:C.textTertiary }}>Speaks:</span>
                    {nurse.languages.map(l => (
                      <span key={l} style={{ fontSize:11, fontWeight:500, color:C.textSecondary, background:C.bgSubtle, padding:'3px 8px', borderRadius:6 }}>{l}</span>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ borderTop:`1px solid ${C.border}`, padding:'16px 24px', display:'flex', gap:10 }}>
                  <Link href={`/${lang}/nurses/${nurse.id}`} style={{ flex:1 }}>
                    <button style={{ width:'100%', fontSize:13, fontWeight:600, padding:'10px', borderRadius:9, border:`1.5px solid ${C.border}`, background:C.bgWhite, color:C.textPrimary, cursor:'pointer' }}>
                      View profile
                    </button>
                  </Link>
                  {nurse.available && (
                    <Link href={`/${lang}/signup`} style={{ flex:1 }}>
                      <button style={{ width:'100%', fontSize:13, fontWeight:600, padding:'10px', borderRadius:9, border:'none', background:C.primary, color:'#fff', cursor:'pointer' }}>
                        Book visit
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'72px 24px', background:'#1E3A5F', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:700, color:'#fff', letterSpacing:'-1px', marginBottom:12 }}>
          Ready to book a nurse visit?
        </h2>
        <p style={{ fontSize:16, color:'rgba(255,255,255,0.6)', marginBottom:32, maxWidth:400, margin:'0 auto 32px' }}>
          7-day free trial. A verified nurse at your loved one's door within days.
        </p>
        <Link href={`/${lang}/signup`}>
          <button style={{ background:'#fff', color:'#1E3A5F', border:'none', borderRadius:10, padding:'14px 36px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
            Choose your plan
          </button>
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
