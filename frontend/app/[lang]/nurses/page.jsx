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
const FALLBACK_NURSES = [
  { id:'1', name:'Elona Berberi', city:'Tirana', rating:4.9, reviewCount:23, totalVisits:47, bio:'Specialised in cardiovascular monitoring and diabetic care. 6 years of home nursing experience across Tirana.', specialties:['Blood Pressure','Glucose Monitoring','Vitals'], languages:['Albanian','English'], experience:'6 years', available:true },
  { id:'2', name:'Mirjeta Doshi', city:'Durrës', rating:4.7, reviewCount:18, totalVisits:31, bio:'Experienced in post-surgical care and elderly welfare checks. Compassionate approach with elderly patients.', specialties:['Welfare Check','Blood Work','Vitals'], languages:['Albanian','Italian'], experience:'4 years', available:true },
  { id:'3', name:'Fatjona Leka', city:'Fier', rating:4.9, reviewCount:14, totalVisits:22, bio:'Dedicated to preventive care and health education. Works closely with families to ensure the best outcomes.', specialties:['Blood Pressure','Welfare Check','General'], languages:['Albanian','Greek'], experience:'5 years', available:true },
  { id:'4', name:'Arba Hoxha', city:'Elbasan', rating:4.6, reviewCount:11, totalVisits:19, bio:'Skilled in blood work collection and laboratory coordination. Calm and professional in all interactions.', specialties:['Blood Work','Glucose Monitoring','Vitals'], languages:['Albanian'], experience:'3 years', available:true },
  { id:'5', name:'Diona Krasniqi', city:'Shkodër', rating:4.8, reviewCount:9, totalVisits:15, bio:'Passionate about bringing quality healthcare to underserved areas. Specialises in chronic condition monitoring.', specialties:['Blood Pressure','Glucose Monitoring','Blood Work'], languages:['Albanian','English'], experience:'4 years', available:false },
  { id:'6', name:'Besa Marku', city:'Tirana', rating:4.7, reviewCount:16, totalVisits:28, bio:'Experienced paediatric and geriatric nurse. Known for her warm and reassuring manner with patients.', specialties:['Welfare Check','Vitals','General'], languages:['Albanian','English'], experience:'7 years', available:true },
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
        if (data.nurses && data.nurses.length > 0) {
          setNurses(data.nurses);
        } else {
          setNurses(FALLBACK_NURSES);
        }
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
      <section style={{ position:'relative', minHeight:480, display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', overflow:'hidden' }}>
        {/* Background image */}
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&auto=format&fit=crop&q=80" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
        {/* Dark gradient overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, rgba(10,15,40,0.72) 0%, rgba(10,30,80,0.65) 100%)' }} />
        {/* Content */}
        <div style={{ position:'relative', zIndex:1, padding:'80px 24px 64px', maxWidth:720, width:'100%' }}>
          <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(147,197,253,1)', background:'rgba(37,99,235,0.25)', border:'1px solid rgba(96,165,250,0.3)', padding:'5px 14px', borderRadius:99, marginBottom:20 }}>
            {tr('nurses.tag')}
          </div>
          <h1 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', marginBottom:16, lineHeight:1.1 }}>
            {tr('nurses.title')}
          </h1>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.78)', maxWidth:520, margin:'0 auto 44px', lineHeight:1.75 }}>
            {tr('nurses.subtitle')}
          </p>
          {/* Trust badges */}
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            {trustBadges.map(([title, sub]) => (
              <div key={title} style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:12, padding:'10px 16px', backdropFilter:'blur(8px)' }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'rgba(37,99,235,0.5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#93C5FD', flexShrink:0 }}>
                  <ShieldIcon />
                </div>
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:1 }}>{sub}</div>
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

      {/* Filters */}
      <section style={{ padding:'32px 24px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 220px', minWidth:200 }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:C.textTertiary }}>
              <SearchIcon />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tr('nurses.searchPlaceholder')}
              style={{ width:'100%', padding:'9px 12px 9px 34px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, color:C.textPrimary, background:C.bgWhite, outline:'none', boxSizing:'border-box' }}
            />
          </div>
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            style={{ padding:'9px 12px', borderRadius:8, border:`1.5px solid ${C.border}`, fontSize:13, color:C.textPrimary, background:C.bgWhite, cursor:'pointer' }}
          >
            <option value="all">{tr('nurses.filterAll')}</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      </section>

      {/* Nurse grid */}
      <section style={{ padding:'28px 24px 80px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {[...Array(6)].map((_,i) => (
                <div key={i} style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, overflow:'hidden', padding:24 }}>
                  <div style={{ display:'flex', gap:16, marginBottom:16 }}>
                    <div style={{ width:64, height:64, borderRadius:16, background:'#F1F5F9', flexShrink:0, animation:'shimmer 1.5s infinite' }} />
                    <div style={{ flex:1 }}>
                      <div style={{ height:16, borderRadius:8, background:'#F1F5F9', marginBottom:8, width:'70%' }} />
                      <div style={{ height:12, borderRadius:8, background:'#F1F5F9', marginBottom:8, width:'50%' }} />
                      <div style={{ height:12, borderRadius:8, background:'#F1F5F9', width:'40%' }} />
                    </div>
                  </div>
                  <div style={{ height:12, borderRadius:8, background:'#F1F5F9', marginBottom:8, width:'100%' }} />
                  <div style={{ height:12, borderRadius:8, background:'#F1F5F9', marginBottom:8, width:'85%' }} />
                  <div style={{ height:12, borderRadius:8, background:'#F1F5F9', width:'60%' }} />
                </div>
              ))}
              <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 24px', color:C.textTertiary }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <div style={{ fontSize:16, fontWeight:600, color:C.textSecondary, marginBottom:8 }}>{tr('nurses.noNurses')}</div>
              <div style={{ fontSize:14 }}>Try adjusting your search or city filter</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {filtered.map(nurse => {
                const available = nurse.available !== false && (nurse.availability?.length > 0 || nurse.available === true);
                return (
                  <div key={nurse.id} className="nurse-card" style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 6px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s, transform 0.2s' }}>
                    <style>{`.nurse-card:hover{box-shadow:0 8px 28px rgba(0,0,0,0.1)!important;transform:translateY(-2px)}`}</style>
                    <div style={{ padding:'24px 24px 0' }}>
                      <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:16 }}>
                        <NurseAvatar name={nurse.name} photo={nurse.profilePhotoUrl||null} size={64} verified={available} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:17, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px', marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{nurse.name}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textTertiary, marginBottom:6 }}>
                            <MapPinIcon /> {nurse.city}
                            {nurse.experience && <>
                              <span style={{ margin:'0 4px', color:C.border }}>·</span>
                              <BriefcaseIcon /> {nurse.experience} {tr('nurses.yearsExp')}
                            </>}
                          </div>
                          {nurse.rating > 0 && <StarRating rating={nurse.rating} size={13} />}
                          {(nurse.reviewCount > 0 || nurse.totalVisits > 0) && (
                            <div style={{ fontSize:11, color:C.textTertiary, marginTop:2 }}>
                              {nurse.reviewCount > 0 && `${nurse.reviewCount} ${tr('nurses.reviews')}`}
                              {nurse.reviewCount > 0 && nurse.totalVisits > 0 && ' · '}
                              {nurse.totalVisits > 0 && `${nurse.totalVisits} ${tr('nurses.visits')}`}
                            </div>
                          )}
                        </div>
                        <div style={{ flexShrink:0 }}>
                          {available ? (
                            <span style={{ fontSize:11, fontWeight:700, color:C.secondary, background:C.secondaryLight, padding:'4px 10px', borderRadius:99, display:'inline-flex', alignItems:'center', gap:4 }}>
                              <div style={{ width:6, height:6, borderRadius:'50%', background:C.secondary }} />
                              {tr('nurses.available')}
                            </span>
                          ) : (
                            <span style={{ fontSize:11, fontWeight:600, color:C.textTertiary, background:C.bgSubtle, padding:'4px 10px', borderRadius:99 }}>
                              {tr('nurses.unavailable')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio */}
                      {nurse.bio && (
                        <p style={{ fontSize:13, color:C.textSecondary, lineHeight:1.65, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                          {nurse.bio}
                        </p>
                      )}

                      {/* Specialties */}
                      {nurse.specialties?.length > 0 && (
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                          {nurse.specialties.slice(0,4).map(s => (
                            <span key={s} style={{ fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:99, background:C.primaryLight, color:C.primary }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Languages */}
                      {nurse.languages?.length > 0 && (
                        <div style={{ fontSize:12, color:C.textTertiary, marginBottom:20 }}>
                          <strong style={{ color:C.textSecondary }}>{tr('nurses.languages')}:</strong>{' '}
                          {nurse.languages.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Card footer */}
                    <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 24px' }}>
                      <Link href={`/${lang}/nurses/${nurse.id}`} className="nurse-cta" style={{ display:'block', textAlign:'center', padding:'10px', borderRadius:9, background:C.primary, color:'#fff', fontSize:13, fontWeight:700, textDecoration:'none', transition:'background 0.15s, transform 0.15s' }}>
                        {tr('nurses.viewProfile')}
                      </Link>
                      <style>{`.nurse-cta:hover{background:#1D4ED8!important;transform:translateY(-1px)}.nurse-cta:active{transform:translateY(0)}`}</style>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
