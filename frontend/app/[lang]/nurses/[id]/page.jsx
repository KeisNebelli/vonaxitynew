'use client';
import { useState, useEffect } from 'react';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import NurseAvatar, { StarRating } from '@/components/ui/NurseAvatar';
import { t } from '@/translations';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#0D9488', secondaryLight:'#F0FDFB',
  warning:'#D97706', warningLight:'#FFFBEB',
  bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4',
  textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF',
  border:'#E5E7EB',
};

const FALLBACK_NURSE = {
  id:'1', name:'Elona Berberi', city:'Tirana', rating:4.9, reviewCount:23, totalVisits:47,
  bio:'Specialised in cardiovascular monitoring and diabetic care. I have been a home nurse for 6 years, working with elderly patients across Tirana. My approach is calm, thorough, and family-focused — I understand that when you book a visit from abroad, trust is everything.',
  specialties:['Blood Pressure','Glucose Monitoring','Vitals','General Nursing'],
  languages:['Albanian','English'], experience:'6 years',
  licenseNumber:'ALB-NURSE-2024-001',
  reviews:[
    { rating:5, comment:'Elona was professional, kind and thorough. My mother felt very comfortable.', clientName:'Arta M.', clientCountry:'UK', date:'Nov 28' },
    { rating:5, comment:'Excellent service. Very punctual and explained everything clearly.', clientName:'Besnik K.', clientCountry:'Italy', date:'Nov 10' },
    { rating:4, comment:'Good visit. Would appreciate a bit more detail in the report.', clientName:'Entela H.', clientCountry:'Germany', date:'Oct 22' },
  ],
  joinedAt: new Date('2023-03-01').toISOString(),
};

function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function MapPinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>;
}
function ShieldIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function CalendarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function StarFilledIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}

export default function NurseProfilePage({ params }) {
  const lang = params.lang || 'en';
  const id = params.id;
  const tr = (key) => t(lang, key);

  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    fetch(`${BASE}/nurses/public/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.nurse) setNurse(data.nurse);
        else setNurse(FALLBACK_NURSE);
      })
      .catch(() => setNurse(FALLBACK_NURSE))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
        <Nav lang={lang} />
        <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ textAlign:'center', color:C.textTertiary }}>
            <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid #E5E7EB', borderTopColor:C.primary, animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontSize:14 }}>{tr('nurses.loading')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!nurse) {
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
        <Nav lang={lang} />
        <div style={{ maxWidth:700, margin:'80px auto', padding:'0 24px', textAlign:'center' }}>
          <div style={{ fontSize:18, fontWeight:600, color:C.textPrimary, marginBottom:12 }}>
            {tr('nurses.notFound')}
          </div>
          <Link href={`/${lang}/nurses`} style={{ color:C.primary, fontSize:14, fontWeight:600, textDecoration:'none' }}>
            {tr('nurses.backToNurses')}
          </Link>
        </div>
      </div>
    );
  }

  const joinedYear = nurse.joinedAt ? new Date(nurse.joinedAt).getFullYear() : null;
  const DAYS_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const shortDays = tr('nurses.shortDays');

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <Nav lang={lang} />

      {/* Back link */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'20px 24px 0' }}>
        <Link href={`/${lang}/nurses`} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:C.textSecondary, fontWeight:500, textDecoration:'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          {tr('nurses.backToNurses')}
        </Link>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 24px 80px', display:'grid', gridTemplateColumns:'1fr 300px', gap:28, alignItems:'start' }}>
        <style>{`@media(max-width:768px){.nurse-profile-grid{grid-template-columns:1fr!important;}}`}</style>

        {/* Left column */}
        <div className="nurse-profile-grid" style={{ display:'contents' }}>
          <div>
            {/* Profile header */}
            <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'28px', marginBottom:20 }}>
              <div style={{ display:'flex', gap:20, alignItems:'flex-start', marginBottom:24 }}>
                <NurseAvatar name={nurse.name} photo={nurse.profilePhotoUrl||null} size={80} verified={true} />
                <div style={{ flex:1, minWidth:0 }}>
                  <h1 style={{ fontSize:24, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.5px', marginBottom:6 }}>{nurse.name}</h1>
                  <div style={{ display:'flex', gap:16, flexWrap:'wrap', marginBottom:10 }}>
                    {nurse.city && (
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}>
                        <MapPinIcon />{nurse.city}
                      </span>
                    )}
                    {nurse.experience && (
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}>
                        <BriefcaseIcon />{nurse.experience} {tr('nurses.yearsExp')}
                      </span>
                    )}
                    {joinedYear && (
                      <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:C.textSecondary }}>
                        <CalendarIcon />{tr('nurses.joinedLabel')} {joinedYear}
                      </span>
                    )}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
                    {nurse.rating > 0 && (
                      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                        <StarRating rating={nurse.rating} size={14} />
                        <span style={{ fontSize:14, fontWeight:700, color:C.textPrimary }}>{nurse.rating.toFixed(1)}</span>
                        {nurse.reviewCount > 0 && <span style={{ fontSize:13, color:C.textTertiary }}>({nurse.reviewCount} {tr('nurses.reviews')})</span>}
                      </div>
                    )}
                    {nurse.totalVisits > 0 && (
                      <span style={{ fontSize:13, color:C.textTertiary }}>{nurse.totalVisits} {tr('nurses.visits')}</span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:C.secondary, background:C.secondaryLight, padding:'5px 12px', borderRadius:99, display:'inline-flex', alignItems:'center', gap:5, flexShrink:0, whiteSpace:'nowrap' }}>
                  <ShieldIcon />{tr('nurses.verified')}
                </span>
              </div>

              {/* Trust row */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {[tr('nurses.trustBadge1'), tr('nurses.trustBadge2'), tr('nurses.trustBadge3')].map(badge => (
                  <span key={badge} style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:C.secondary, background:C.secondaryLight, padding:'4px 10px', borderRadius:99 }}>
                    <CheckIcon />{badge}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            {nurse.bio && (
              <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:14 }}>{tr('nurses.aboutNurse')}</h2>
                <p style={{ fontSize:14, color:C.textSecondary, lineHeight:1.75, margin:0 }}>{nurse.bio}</p>
              </div>
            )}

            {/* Reviews */}
            <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'24px' }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:20 }}>{tr('nurses.reviewsTitle')}</h2>
              {!nurse.reviews || nurse.reviews.length === 0 ? (
                <p style={{ color:C.textTertiary, fontSize:14 }}>{tr('nurses.noReviews')}</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {nurse.reviews.map((review, i) => (
                    <div key={i} style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:16, ...(i === nurse.reviews.length - 1 ? { borderBottom:'none', paddingBottom:0 } : {}) }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>
                            {review.clientName}
                            {review.clientCountry && <span style={{ fontSize:12, color:C.textTertiary, fontWeight:400 }}> · {review.clientCountry}</span>}
                          </div>
                          <div style={{ display:'flex', gap:2, marginTop:4 }}>
                            {[1,2,3,4,5].map(s => (
                              <span key={s} style={{ opacity: s <= review.rating ? 1 : 0.25 }}><StarFilledIcon /></span>
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize:12, color:C.textTertiary, whiteSpace:'nowrap', marginLeft:12 }}>{review.date}</span>
                      </div>
                      {review.comment && (
                        <p style={{ fontSize:14, color:C.textSecondary, lineHeight:1.65, margin:0 }}>{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Book CTA */}
            <div style={{ background:C.primary, borderRadius:18, padding:'24px', marginBottom:20, color:'#fff' }}>
              <div style={{ fontSize:16, fontWeight:700, marginBottom:8 }}>{tr('nurses.bookCTA')}</div>
              <div style={{ fontSize:13, opacity:0.8, marginBottom:18, lineHeight:1.6 }}>{tr('nurses.bookDesc')}</div>
              <Link href={`/${lang}/signup?role=client`} style={{ display:'block', textAlign:'center', padding:'11px', borderRadius:10, background:'#fff', color:C.primary, fontSize:14, fontWeight:700, textDecoration:'none' }}>
                {tr('pricing.getStarted')}
              </Link>
            </div>

            {/* Details card */}
            <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'24px', marginBottom:20 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:C.textPrimary, marginBottom:16 }}>{tr('nurses.details')}</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {nurse.licenseNumber && (
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:C.secondary, flexShrink:0, marginTop:5 }} />
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{tr('nurses.licenseLabel')}</div>
                      <div style={{ fontSize:13, color:C.textPrimary, fontWeight:600 }}>{nurse.licenseNumber}</div>
                    </div>
                  </div>
                )}
                {nurse.languages?.length > 0 && (
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:C.primary, flexShrink:0, marginTop:5 }} />
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{tr('nurses.languages')}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {nurse.languages.map(l => (
                          <span key={l} style={{ fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:99, background:C.primaryLight, color:C.primary }}>{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {nurse.specialties?.length > 0 && (
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:'#0D9488', flexShrink:0, marginTop:5 }} />
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{tr('nurses.specialties')}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                        {nurse.specialties.map(s => (
                          <span key={s} style={{ fontSize:12, fontWeight:600, padding:'2px 8px', borderRadius:99, background:'#F0FDFB', color:'#0D9488' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {nurse.availability?.length > 0 && (
              <div style={{ background:C.bgWhite, borderRadius:18, border:`1px solid ${C.border}`, padding:'24px' }}>
                <h3 style={{ fontSize:14, fontWeight:700, color:C.textPrimary, marginBottom:16 }}>
                  {tr('nurses.availability')}
                </h3>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {DAYS_EN.map((dayEn, i) => {
                    const active = nurse.availability.includes(dayEn);
                    return (
                      <span key={dayEn} style={{ fontSize:12, fontWeight:600, padding:'4px 10px', borderRadius:8, background:active?C.secondaryLight:C.bgSubtle, color:active?C.secondary:C.textTertiary, border:`1px solid ${active?'rgba(13,148,136,0.15)':C.border}` }}>
                        {Array.isArray(shortDays) ? shortDays[i] : dayEn.slice(0,3)}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
