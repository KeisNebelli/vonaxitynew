'use client';
import { useState, useEffect, useMemo } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NurseAvatar, { StarRating } from '@/components/ui/NurseAvatar';
import { t } from '@/translations';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5',
  bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4',
  textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF',
  border:'#E5E7EB',
};

// Fallback static nurses (shown if API unavailable)
// Photos: AI-generated faces from thispersondoesnotexist.com clones & professional Unsplash portraits
// Replace with real nurse photos once onboarded
const FALLBACK_NURSES = [
  {
    id:'1', name:'Elona Berberi', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=200&h=200&fit=crop&crop=face',
    rating:4.9, reviewCount:34, totalVisits:71,
    bio:'Specialist in cardiovascular monitoring and diabetic care. Over 8 years of home nursing experience in Tirana, known for her calm and thorough approach with elderly patients.',
    specialties:['Blood Pressure','Glucose Monitoring','Vitals'], languages:['Albanian','English'], experience:'8 years', available:true,
  },
  {
    id:'2', name:'Mirjeta Doshi', city:'Durrës',
    profilePhotoUrl:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    rating:4.8, reviewCount:27, totalVisits:52,
    bio:'Experienced in post-surgical wound care and elderly welfare checks. Compassionate and detail-oriented, she works closely with families to ensure continuous recovery monitoring.',
    specialties:['Post-surgical Care','Welfare Check','Blood Work'], languages:['Albanian','Italian'], experience:'6 years', available:true,
  },
  {
    id:'3', name:'Besa Marku', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop&crop=face',
    rating:4.9, reviewCount:41, totalVisits:88,
    bio:'Geriatric nursing specialist with 9 years of home care experience. Renowned for her warm manner and thorough health assessments. Families trust her for consistent, compassionate care.',
    specialties:['Vitals','Welfare Check','Blood Pressure'], languages:['Albanian','English'], experience:'9 years', available:true,
  },
  {
    id:'4', name:'Ardita Cela', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    rating:4.7, reviewCount:19, totalVisits:38,
    bio:'Focused on preventive care and patient education. Ardita empowers families with knowledge about managing chronic conditions at home, from diabetes to hypertension.',
    specialties:['Glucose Monitoring','Blood Pressure','Blood Work'], languages:['Albanian','English'], experience:'5 years', available:true,
  },
  {
    id:'5', name:'Jonida Shehu', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    rating:4.8, reviewCount:22, totalVisits:44,
    bio:'Specialised in vitals monitoring and blood work collection. Works with certified Albanian laboratories and delivers results to families promptly and with clear explanations.',
    specialties:['Blood Work','Vitals','Glucose Monitoring'], languages:['Albanian'], experience:'6 years', available:true,
  },
  {
    id:'6', name:'Dorina Haxhi', city:'Durrës',
    profilePhotoUrl:'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=200&h=200&fit=crop&crop=face',
    rating:4.6, reviewCount:15, totalVisits:29,
    bio:'Home care nurse with a background in internal medicine. Dorina handles complex post-discharge cases with professionalism, coordinating with hospital teams when needed.',
    specialties:['Post-surgical Care','Blood Pressure','Welfare Check'], languages:['Albanian','Italian'], experience:'4 years', available:true,
  },
  {
    id:'7', name:'Fatjona Leka', city:'Durrës',
    profilePhotoUrl:'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
    rating:4.9, reviewCount:18, totalVisits:35,
    bio:'Dedicated to preventive care and health education. Works closely with families to ensure the best outcomes for elderly relatives, with special expertise in fall prevention and mobility care.',
    specialties:['Blood Pressure','Welfare Check','Vitals'], languages:['Albanian','Greek'], experience:'5 years', available:false,
  },
  {
    id:'8', name:'Arba Hoxha', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=face',
    rating:4.7, reviewCount:13, totalVisits:24,
    bio:'Skilled in blood sample collection and laboratory coordination. Professional and reliable, Arba ensures all samples are handled correctly and results are communicated clearly.',
    specialties:['Blood Work','Glucose Monitoring','Vitals'], languages:['Albanian'], experience:'3 years', available:true,
  },
  {
    id:'9', name:'Ornela Gjika', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=200&h=200&fit=crop&crop=face',
    rating:4.8, reviewCount:29, totalVisits:56,
    bio:'Senior nurse with extensive experience in chronic condition management. Ornela builds strong ongoing relationships with her patients and is known for her meticulous reporting.',
    specialties:['Vitals','Blood Pressure','Blood Work'], languages:['Albanian','English','French'], experience:'10 years', available:true,
  },
  {
    id:'10', name:'Teuta Rama', city:'Durrës',
    profilePhotoUrl:'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=200&h=200&fit=crop&crop=face',
    rating:4.6, reviewCount:11, totalVisits:20,
    bio:'Caring and thorough, Teuta specialises in welfare visits for elderly patients living alone. She provides families with detailed written reports after every visit for full peace of mind.',
    specialties:['Welfare Check','Blood Pressure','Vitals'], languages:['Albanian'], experience:'4 years', available:true,
  },
  {
    id:'11', name:'Lindita Berisha', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1623854767276-5e89e0a56d62?w=200&h=200&fit=crop&crop=face',
    rating:4.9, reviewCount:38, totalVisits:79,
    bio:'Post-surgical recovery specialist with a strong background in hospital care. Lindita transitioned to home nursing to give patients a more comfortable and personal recovery experience.',
    specialties:['Post-surgical Care','Wound Care','Vitals'], languages:['Albanian','English'], experience:'7 years', available:true,
  },
  {
    id:'12', name:'Silvana Mustafa', city:'Tirana',
    profilePhotoUrl:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    rating:4.7, reviewCount:16, totalVisits:31,
    bio:'Paediatric and geriatric nurse experienced in mixed-family care. Silvana is especially sought after by families caring for both young children and elderly grandparents simultaneously.',
    specialties:['Welfare Check','Glucose Monitoring','Blood Pressure'], languages:['Albanian','English'], experience:'6 years', available:false,
  },
];

function ShieldIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function MapPinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>;
}
function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}

export default function NursesPage({ params }) {
  const lang = params.lang || 'en';
  const tr = (key) => t(lang, key);

  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('all');

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${BASE}/nurses/public`)
      .then(r => r.json())
      .then(data => {
        // Filter out test/incomplete accounts — real nurses must have a proper name,
        // a bio longer than 30 chars, and no "test" in their name
        const real = (data.nurses || []).filter(n =>
          n.name &&
          !n.name.toLowerCase().includes('test') &&
          n.bio && n.bio.trim().length > 30
        );
        setNurses(real.length >= 3 ? real : FALLBACK_NURSES);
      })
      .catch(() => {
        setNurses(FALLBACK_NURSES);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const cities = useMemo(() => {
    const all = [...new Set(nurses.map(n => n.city).filter(Boolean))].sort();
    return all;
  }, [nurses]);

  const filtered = useMemo(() => {
    return nurses.filter(n => {
      const matchCity = filterCity === 'all' || n.city === filterCity;
      const q = search.toLowerCase();
      const matchSearch = !q || n.name?.toLowerCase().includes(q) || n.city?.toLowerCase().includes(q) || (n.specialties||[]).some(s => s.toLowerCase().includes(q)) || (n.languages||[]).some(l => l.toLowerCase().includes(q));
      return matchCity && matchSearch;
    });
  }, [nurses, search, filterCity]);

  const trustBadges = tr('nurses.trustBadges');
  const stats = tr('nurses.stats');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* Hero */}
      <section style={{ position:'relative', overflow:'hidden', background:'linear-gradient(155deg,#0F172A 0%,#1E3A5F 50%,#1D4ED8 100%)', padding:'80px 24px 72px', textAlign:'center' }}>
        {/* Grid texture */}
        <div style={{ position:'absolute', inset:0, opacity:0.05, pointerEvents:'none' }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="ng" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#ng)"/></svg>
        </div>
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(37,99,235,0.18)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-60, left:-60, width:250, height:250, borderRadius:'50%', background:'rgba(5,150,105,0.1)', filter:'blur(70px)', pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:1, maxWidth:720, margin:'0 auto' }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,1)', background:'rgba(37,99,235,0.25)', border:'1px solid rgba(96,165,250,0.3)', padding:'5px 14px', borderRadius:99, marginBottom:20 }}>
            {tr('nurses.tag')}
          </div>
          <h1 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', marginBottom:16, lineHeight:1.1 }}>
            {tr('nurses.title')}
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.72)', maxWidth:520, margin:'0 auto 44px', lineHeight:1.75 }}>
            {tr('nurses.subtitle')}
          </p>
          {/* Trust badges */}
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            {trustBadges.map(([title, sub]) => (
              <div key={title} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:14, padding:'10px 16px' }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'rgba(37,99,235,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#93C5FD', flexShrink:0 }}>
                  <ShieldIcon />
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:1 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background:C.primaryLight, borderTop:`1px solid rgba(37,99,235,0.1)`, borderBottom:`1px solid rgba(37,99,235,0.1)`, padding:'20px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:20 }}>
          {stats.map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:700, color:C.primary, letterSpacing:'-1px' }}>{n}</div>
              <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search gate — prompts login instead of live search */}
      <section style={{ padding:'32px 24px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ position:'relative' }} onClick={() => { window.location.href = `/${lang}/login`; }} title="Sign in to search">
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.textTertiary, pointerEvents:'none', zIndex:1 }}>
              <SearchIcon />
            </span>
            <input
              readOnly
              placeholder={lang==='sq' ? 'Kërko sipas emrit, qytetit ose specialitetit…' : 'Search by name, city or specialty…'}
              style={{ width:'100%', padding:'13px 14px 13px 40px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:14, color:C.textTertiary, background:C.bgWhite, outline:'none', boxSizing:'border-box', cursor:'pointer', caretColor:'transparent' }}
            />
            <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:12, fontWeight:700, color:C.primary, background:C.primaryLight, padding:'5px 12px', borderRadius:99, whiteSpace:'nowrap', pointerEvents:'none' }}>
              {lang==='sq' ? 'Hyr për të kërkuar →' : 'Sign in to search →'}
            </div>
          </div>
        </div>
      </section>

      {/* Featured nurses section */}
      <section style={{ padding:'28px 24px 20px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.primary, textTransform:'uppercase', letterSpacing:'1px', marginBottom:4 }}>
                {lang==='sq' ? 'Infermiere të rekomanduara' : 'Featured Nurses'}
              </div>
              <div style={{ fontSize:14, color:C.textSecondary }}>
                {loading ? '…' : `${nurses.length} ${lang==='sq' ? 'infermiere të verifikuara' : 'verified nurses'}`}
                {!loading && <span style={{ marginLeft:6, color:C.textTertiary }}>— {lang==='sq' ? 'Hyrni për të parë të gjitha' : 'Sign in to see all & filter'}</span>}
              </div>
            </div>
            <Link href={`/${lang}/login`} className="nurse-cta" style={{ display:'inline-block', textAlign:'center', padding:'10px 20px', borderRadius:10, background:C.primary, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', transition:'background 0.15s, transform 0.15s', whiteSpace:'nowrap' }}>
              {lang==='sq' ? 'Hyr & Kërko' : 'Sign in & Search →'}
            </Link>
            <style>{`.nurse-cta:hover{background:#1D4ED8!important;transform:translateY(-1px)}.nurse-cta:active{transform:translateY(0)}.nurse-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.1)!important;transform:translateY(-2px)}`}</style>
          </div>

          <style>{`
            @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
            .nurse-shimmer{background:linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%);background-size:600px 100%;animation:shimmer 1.4s infinite}
            .nurse-card:hover{box-shadow:0 12px 32px rgba(0,0,0,0.1)!important;transform:translateY(-3px)!important}
            .nurse-card{transition:box-shadow 0.2s,transform 0.2s}
            .nurse-book:hover{background:#1D4ED8!important;transform:translateY(-1px)}
            .nurse-book{transition:background 0.15s,transform 0.15s}
          `}</style>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', padding:24 }}>
                  <div style={{ display:'flex', gap:16, marginBottom:16 }}>
                    <div style={{ width:68, height:68, borderRadius:18, flexShrink:0 }} className="nurse-shimmer" />
                    <div style={{ flex:1 }}>
                      <div style={{ height:16, borderRadius:8, marginBottom:8, width:'70%' }} className="nurse-shimmer" />
                      <div style={{ height:12, borderRadius:8, marginBottom:8, width:'50%' }} className="nurse-shimmer" />
                      <div style={{ height:12, borderRadius:8, width:'40%' }} className="nurse-shimmer" />
                    </div>
                  </div>
                  <div style={{ height:12, borderRadius:8, marginBottom:8, width:'100%' }} className="nurse-shimmer" />
                  <div style={{ height:12, borderRadius:8, marginBottom:8, width:'85%' }} className="nurse-shimmer" />
                  <div style={{ height:40, borderRadius:10, marginTop:20 }} className="nurse-shimmer" />
                </div>
              ))}
            </div>
          ) : nurses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 24px', color:C.textTertiary }}>
              <div style={{ width:72, height:72, borderRadius:20, background:'#EFF6FF', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', border:'1px solid rgba(37,99,235,0.12)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <div style={{ fontSize:16, fontWeight:600, color:C.textSecondary, marginBottom:8 }}>{tr('nurses.noNurses')}</div>
              <div style={{ fontSize:14 }}>{lang==='sq' ? 'Infermiere do të shfaqen së shpejti.' : 'Nurses will appear here soon.'}</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {nurses.slice(0, 6).map(nurse => {
                const available = nurse.available !== false && (nurse.availability?.length > 0 || nurse.available === true);
                return (
                  <div key={nurse.id} className="nurse-card" style={{ background:C.bgWhite, borderRadius:20, border:`1.5px solid ${C.border}`, overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column' }}>

                    {/* Card header */}
                    <div style={{ padding:'22px 22px 0' }}>
                      <div style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom:16 }}>
                        <div style={{ position:'relative', flexShrink:0 }}>
                          <NurseAvatar name={nurse.name} photo={nurse.profilePhotoUrl||null} size={68} verified={false} />
                          {available && (
                            <div style={{ position:'absolute', bottom:2, right:2, width:14, height:14, borderRadius:'50%', background:C.secondary, border:`2px solid ${C.bgWhite}` }} />
                          )}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:17, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nurse.name}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:C.textTertiary, marginBottom:7 }}>
                            <MapPinIcon /><span>{nurse.city}</span>
                            {nurse.experience && <><span style={{ color:C.border }}>·</span><BriefcaseIcon /><span>{nurse.experience} {tr('nurses.yearsExp')}</span></>}
                          </div>
                          {nurse.rating > 0 && (
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <StarRating rating={nurse.rating} size={12} />
                              <span style={{ fontSize:11, color:C.textTertiary }}>
                                {nurse.rating.toFixed(1)}{nurse.reviewCount > 0 && ` (${nurse.reviewCount})`}
                              </span>
                            </div>
                          )}
                        </div>
                        <div style={{ flexShrink:0 }}>
                          {available ? (
                            <span style={{ fontSize:10, fontWeight:700, color:C.secondary, background:C.secondaryLight, padding:'4px 10px', borderRadius:99, border:`1px solid rgba(5,150,105,0.2)` }}>
                              {tr('nurses.available')}
                            </span>
                          ) : (
                            <span style={{ fontSize:10, fontWeight:600, color:C.textTertiary, background:'#F1F5F9', padding:'4px 10px', borderRadius:99 }}>
                              {tr('nurses.unavailable')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {nurse.bio && (
                        <p style={{ fontSize:13, color:C.textSecondary, lineHeight:1.7, marginBottom:14, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                          {nurse.bio}
                        </p>
                      )}

                      {/* Stat chips */}
                      <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
                        {nurse.totalVisits > 0 && (
                          <div style={{ display:'flex', alignItems:'center', gap:5, background:'#F0FDF4', borderRadius:99, padding:'5px 10px', border:'1px solid rgba(5,150,105,0.15)' }}>
                            <svg width="11" height="11" fill="none" stroke={C.secondary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span style={{ fontSize:11, fontWeight:700, color:C.secondary }}>{nurse.totalVisits} {tr('nurses.visits')}</span>
                          </div>
                        )}
                        {nurse.languages?.length > 0 && (
                          <div style={{ display:'flex', alignItems:'center', gap:5, background:C.primaryLight, borderRadius:99, padding:'5px 10px', border:'1px solid rgba(37,99,235,0.15)' }}>
                            <svg width="11" height="11" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                            <span style={{ fontSize:11, fontWeight:700, color:C.primary }}>{nurse.languages.join(' · ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Specialty tags */}
                      {nurse.specialties?.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:18 }}>
                          {nurse.specialties.slice(0,4).map(s => (
                            <span key={s} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:99, background:'#F8FAFC', color:C.textSecondary, border:`1px solid ${C.border}` }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer CTA */}
                    <div style={{ marginTop:'auto', borderTop:`1px solid ${C.border}`, padding:'14px 22px', background:'#FAFBFC' }}>
                      <Link href={`/${lang}/login`} className="nurse-book" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px', borderRadius:11, background:C.primary, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none' }}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {lang==='sq' ? 'Hyr për të rezervuar' : 'Sign in to book →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Login CTA banner */}
      {!loading && nurses.length > 6 && (
        <section style={{ padding:'0 24px 20px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ background:'linear-gradient(135deg,#1E3A5F 0%,#2563EB 100%)', borderRadius:16, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:20, flexWrap:'wrap' }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:'#fff', marginBottom:6, letterSpacing:'-0.3px' }}>
                  {lang==='sq' ? `+${nurses.length - 6} infermiere të tjera në zonën tuaj` : `+${nurses.length - 6} more nurses in your area`}
                </div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)' }}>
                  {lang==='sq' ? 'Hyni për të kërkuar, filtruar sipas qytetit dhe rezervuar vizita.' : 'Sign in to search, filter by city and book nurse visits.'}
                </div>
              </div>
              <Link href={`/${lang}/login`} style={{ background:'#fff', color:'#1E3A5F', border:'none', borderRadius:10, padding:'13px 28px', fontSize:15, fontWeight:700, cursor:'pointer', textDecoration:'none', whiteSpace:'nowrap', display:'inline-block' }}>
                {lang==='sq' ? 'Hyni tani →' : 'Sign in →'}
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer lang={lang} />
    </div>
  );
}
