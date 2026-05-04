import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { t } from '@/translations';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', primaryDark:'#1D4ED8',
  secondary:'#059669', secondaryLight:'#ECFDF5',
  purple:'#7C3AED', purpleLight:'#F5F3FF',
  amber:'#D97706', amberLight:'#FFFBEB',
  bg:'#FAFAF9', bgWhite:'#FFFFFF',
  textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF',
  border:'#E5E7EB',
};

const VALUE_META = [
  { color:'#7C3AED', light:'#F5F3FF', border:'rgba(124,58,237,0.2)', gradient:'linear-gradient(135deg,#7C3AED,#5B21B6)',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg> },
  { color:'#059669', light:'#ECFDF5', border:'rgba(5,150,105,0.2)', gradient:'linear-gradient(135deg,#059669,#065F46)',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { color:'#2563EB', light:'#EFF6FF', border:'rgba(37,99,235,0.2)', gradient:'linear-gradient(135deg,#2563EB,#1D4ED8)',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { color:'#D97706', light:'#FFFBEB', border:'rgba(217,119,6,0.2)', gradient:'linear-gradient(135deg,#D97706,#92400E)',
    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
];

const MILESTONES = {
  en: [
    { year:'2024', label:'Idea born', desc:'Two Albanian friends abroad realise there is no reliable way to arrange care for their parents back home.' },
    { year:'2025', label:'Platform built', desc:'After months of research with nurses and diaspora families, the Vonaxity platform takes shape.' },
    { year:'2026', label:'Launch', desc:'Vonaxity officially launches in Tirana & Durrës with a vetted network of licensed nurses ready to serve.' },
    { year:'2026+', label:'Expanding', desc:'Rolling out across 8 Albanian cities and building the most trusted home-care network in the country.' },
  ],
  sq: [
    { year:'2024', label:'Ideja lind', desc:'Dy miq shqiptarë jashtë vendit kuptojnë se nuk ka mënyrë të besueshme për të organizuar kujdes për prindërit e tyre.' },
    { year:'2025', label:'Platforma ndërtohet', desc:'Pas muajsh hulumtimi me infermierë dhe familje diasporë, platforma Vonaxity merr formë.' },
    { year:'2026', label:'Lansimi', desc:'Vonaxity lansohej zyrtarisht në Tiranë & Durrës me një rrjet infermierësh të licencuar.' },
    { year:'2026+', label:'Zgjerim', desc:'Duke u zgjeruar nëpër 8 qytete shqiptare dhe duke ndërtuar rrjetin më të besuar të kujdesit shtëpiak.' },
  ],
};

const TEAM = [
  { initials:'KN', name:'Keis Nebelli', role:'CEO & Founder', bio:'Albanian student based in New Jersey, USA, pursuing a Bachelor\'s degree in Cybersecurity. Built Vonaxity to solve a deeply personal problem — ensuring families abroad can keep their loved ones in Albania safe and cared for.', grad:'linear-gradient(135deg,#2563EB,#4F46E5)' },
];

export default function AboutPage({ params }) {
  const lang = params.lang || 'en';
  const values = t(lang, 'about.values');
  const milestones = MILESTONES[lang] || MILESTONES.en;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:C.bg }}>
      <style>{`
        .ab-val-card { transition:transform 0.22s ease, box-shadow 0.22s ease; }
        .ab-val-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.1) !important; }
        .ab-team-card { transition:transform 0.2s ease, box-shadow 0.2s ease; }
        .ab-team-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.1) !important; }
        .ab-cta-btn { transition:all 0.18s ease; }
        .ab-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,0.3) !important; }
        @media(max-width:640px){
          .ab-story-grid { grid-template-columns:1fr !important; }
          .ab-stats-grid { grid-template-columns:1fr 1fr !important; }
          .ab-milestone { flex-direction:column !important; }
          .ab-milestone-line { display:none !important; }
          .ab-team-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <Nav lang={lang} />

      {/* ── Hero ── */}
      <section style={{ padding:'0', background:'#0F172A', position:'relative', overflow:'hidden', minHeight:520, display:'flex', alignItems:'center' }}>
        {/* Grid overlay */}
        <div style={{ position:'absolute', inset:0, opacity:0.05 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="ag" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.8"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#ag)"/>
          </svg>
        </div>
        {/* Gradient blobs */}
        <div style={{ position:'absolute', top:'-80px', right:'-60px', width:480, height:480, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.3) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-40px', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle,rgba(37,99,235,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'96px 24px 88px', position:'relative', zIndex:1, width:'100%' }}>
          {/* Mission tag */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:11, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'rgba(196,181,253,0.9)', background:'rgba(124,58,237,0.2)', padding:'6px 16px', borderRadius:99, marginBottom:28, border:'1px solid rgba(124,58,237,0.3)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#A78BFA', animation:'pulse 2s infinite' }} />
            {t(lang,'about.tag')}
          </div>

          <h1 style={{ fontSize:'clamp(32px,5.5vw,60px)', fontWeight:900, color:'#fff', letterSpacing:'-2.5px', lineHeight:1.07, marginBottom:28, maxWidth:740 }}>
            {t(lang,'about.headline')}
          </h1>

          <p style={{ fontSize:18, color:'rgba(255,255,255,0.62)', lineHeight:1.8, maxWidth:540, marginBottom:48 }}>
            {t(lang,'about.p1')}
          </p>

          {/* Floating stat pills */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { val:'500+', label: lang==='sq'?'Infermierë':'Nurses', color:'#A78BFA', bg:'rgba(124,58,237,0.2)', border:'rgba(124,58,237,0.3)' },
              { val:'8',    label: lang==='sq'?'Qytete':'Cities', color:'#6EE7B7', bg:'rgba(5,150,105,0.2)', border:'rgba(5,150,105,0.3)' },
              { val:'100%', label: lang==='sq'?'E licencuar':'Licensed', color:'#93C5FD', bg:'rgba(37,99,235,0.2)', border:'rgba(37,99,235,0.3)' },
              { val:'24h',  label: lang==='sq'?'Caktim':'Assignment', color:'#FDE68A', bg:'rgba(217,119,6,0.2)', border:'rgba(217,119,6,0.3)' },
            ].map(s => (
              <div key={s.val} style={{ display:'flex', alignItems:'center', gap:8, background:s.bg, border:`1px solid ${s.border}`, borderRadius:12, padding:'10px 18px' }}>
                <div style={{ fontSize:20, fontWeight:800, color:s.color, letterSpacing:'-0.5px' }}>{s.val}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.6)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Origin story ── */}
      <section style={{ padding:'88px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="ab-story-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            {/* Left — text */}
            <div>
              <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.secondary, background:C.secondaryLight, padding:'5px 13px', borderRadius:99, marginBottom:24, border:'1px solid rgba(5,150,105,0.15)' }}>
                {lang==='sq' ? 'Historia jonë' : 'Our story'}
              </div>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,40px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-1.2px', lineHeight:1.15, marginBottom:22 }}>
                {lang==='sq' ? 'Ndërtuar nga distanca, me dashuri' : 'Built from a distance, with love'}
              </h2>
              <p style={{ fontSize:16, color:C.textSecondary, lineHeight:1.85, marginBottom:18 }}>
                {t(lang,'about.p1')}
              </p>
              <p style={{ fontSize:16, color:C.textSecondary, lineHeight:1.85, marginBottom:32 }}>
                {t(lang,'about.p2')}
              </p>
              {/* Trust badges */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {(lang==='sq'
                  ? ['E themeluar nga shqiptarë të diasporës','Rrjet infermierësh të verifikuar dhe të licencuar','Raport shëndetësor pas çdo vizite']
                  : ['Founded by Albanian diaspora members','Verified & licensed nurse network','Health report after every visit']
                ).map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:10, fontSize:14, color:C.textPrimary, fontWeight:500 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:C.secondaryLight, border:'1.5px solid rgba(5,150,105,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.secondary} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual card */}
            <div style={{ position:'relative' }}>
              {/* Main card */}
              <div style={{ background:'linear-gradient(145deg,#0F172A,#1E3A5F)', borderRadius:24, padding:'36px 32px', color:'#fff', boxShadow:'0 32px 72px rgba(15,23,42,0.28)', position:'relative', overflow:'hidden' }}>
                {/* Decorative cross */}
                <div style={{ position:'absolute', top:-20, right:-20, opacity:0.08 }}>
                  <svg width="160" height="160" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/></svg>
                </div>

                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(196,181,253,0.7)', marginBottom:20 }}>
                  {lang==='sq' ? 'Pse e ndërtuat Vonaxity?' : 'Why we built Vonaxity'}
                </div>

                {[
                  { emoji:'🌍', text: lang==='sq' ? '2.5M+ shqiptarë jetojnë jashtë vendit' : '2.5M+ Albanians live abroad' },
                  { emoji:'👴', text: lang==='sq' ? 'Prindërit plaken pa mbikëqyrje mjekësore' : 'Parents age without medical oversight' },
                  { emoji:'📵', text: lang==='sq' ? 'Asnjë platformë e besuar nuk ekzistonte' : 'No trusted platform existed' },
                  { emoji:'💡', text: lang==='sq' ? 'Vonaxity mbyll këtë boshllëk' : 'Vonaxity closes that gap' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', marginBottom: i < 3 ? 18 : 0, paddingBottom: i < 3 ? 18 : 0, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    <div style={{ fontSize:22, flexShrink:0, marginTop:2 }}>{item.emoji}</div>
                    <div style={{ fontSize:14, color:'rgba(255,255,255,0.8)', lineHeight:1.55, fontWeight:500 }}>{item.text}</div>
                  </div>
                ))}
              </div>

              {/* Floating badge */}
              <div style={{ position:'absolute', bottom:-20, left:-20, background:'linear-gradient(135deg,#059669,#065F46)', borderRadius:16, padding:'14px 20px', boxShadow:'0 8px 24px rgba(5,150,105,0.35)', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{lang==='sq' ? 'Disponibël tani' : 'Available now'}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)' }}>Tirana · Durrës</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding:'88px 24px', background:'linear-gradient(180deg,#F8FAFF,#F5F3FF)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.purple, background:C.purpleLight, padding:'5px 13px', borderRadius:99, marginBottom:16, border:'1px solid rgba(124,58,237,0.15)' }}>
              {lang==='sq' ? 'Vlerat tona' : 'Our values'}
            </div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-1.5px', margin:'0 0 14px' }}>
              {lang==='sq' ? 'Çfarë na udhëzon çdo ditë' : 'What guides us every day'}
            </h2>
            <p style={{ fontSize:16, color:C.textSecondary, maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
              {lang==='sq' ? 'Katër parime në zemër të gjithçkaje që bëjmë.' : 'Four principles at the heart of everything we do.'}
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {Array.isArray(values) && values.map((v, i) => {
              const m = VALUE_META[i] || VALUE_META[0];
              return (
                <div key={i} className="ab-val-card" style={{ background:C.bgWhite, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  {/* Color header strip */}
                  <div style={{ height:5, background:m.gradient }} />
                  <div style={{ padding:'28px 24px' }}>
                    <div style={{ width:50, height:50, borderRadius:14, background:m.gradient, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:`0 6px 16px ${m.color}44` }}>
                      {m.icon}
                    </div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.textPrimary, marginBottom:10, letterSpacing:'-0.3px' }}>{v.title}</div>
                    <div style={{ fontSize:13, color:C.textSecondary, lineHeight:1.75 }}>{v.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding:'88px 24px', background:C.bgWhite }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.primary, background:C.primaryLight, padding:'5px 13px', borderRadius:99, marginBottom:16, border:'1px solid rgba(37,99,235,0.15)' }}>
              {lang==='sq' ? 'Rruga jonë' : 'Our journey'}
            </div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-1.5px', margin:0 }}>
              {lang==='sq' ? 'Nga ideja në realitet' : 'From idea to reality'}
            </h2>
          </div>

          {/* Horizontal timeline */}
          <div className="ab-milestone" style={{ display:'flex', alignItems:'flex-start', gap:0, position:'relative' }}>
            {/* Connecting line */}
            <div className="ab-milestone-line" style={{ position:'absolute', top:28, left:'12.5%', right:'12.5%', height:2, background:'linear-gradient(90deg,#7C3AED,#2563EB,#059669,#D97706)', borderRadius:99 }} />

            {milestones.map((m, i) => {
              const colors = ['#7C3AED','#2563EB','#059669','#D97706'];
              const lights = ['#F5F3FF','#EFF6FF','#ECFDF5','#FFFBEB'];
              const col = colors[i]; const light = lights[i];
              return (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'0 12px', position:'relative', zIndex:1 }}>
                  {/* Dot */}
                  <div style={{ width:56, height:56, borderRadius:'50%', background:light, border:`3px solid ${col}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20, boxShadow:`0 4px 14px ${col}33`, flexShrink:0 }}>
                    <span style={{ fontSize:13, fontWeight:800, color:col }}>{m.year}</span>
                  </div>
                  <div style={{ fontWeight:800, fontSize:14, color:C.textPrimary, marginBottom:8, textAlign:'center' }}>{m.label}</div>
                  <div style={{ fontSize:12, color:C.textSecondary, lineHeight:1.6, textAlign:'center' }}>{m.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section style={{ padding:'88px 24px', background:'linear-gradient(180deg,#F8FAFF,#F0F4FF)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ display:'inline-block', fontSize:11, fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:C.secondary, background:C.secondaryLight, padding:'5px 13px', borderRadius:99, marginBottom:16, border:'1px solid rgba(5,150,105,0.15)' }}>
              {lang==='sq' ? 'Ekipi ynë' : 'Our team'}
            </div>
            <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, color:C.textPrimary, letterSpacing:'-1.5px', margin:'0 0 14px' }}>
              {lang==='sq' ? 'Njerëzit pas Vonaxity' : 'The people behind Vonaxity'}
            </h2>
            <p style={{ fontSize:16, color:C.textSecondary, maxWidth:420, margin:'0 auto', lineHeight:1.7 }}>
              {lang==='sq' ? 'Ndërtuar nga profesionistë që e kuptojnë thellësisht këtë nevojë.' : 'Built by professionals who deeply understand this need.'}
            </p>
          </div>

          <div style={{ display:'flex', justifyContent:'center' }}>
            {TEAM.map((person, i) => (
              <div key={i} className="ab-team-card" style={{ background:C.bgWhite, borderRadius:24, border:`1px solid ${C.border}`, maxWidth:560, width:'100%', boxShadow:'0 4px 24px rgba(0,0,0,0.07)', overflow:'hidden' }}>
                {/* Gradient header */}
                <div style={{ background:person.grad, padding:'32px 32px 0', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:20 }}>
                    <div style={{ width:80, height:80, borderRadius:20, background:'rgba(255,255,255,0.2)', border:'2.5px solid rgba(255,255,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:800, color:'#fff', flexShrink:0, backdropFilter:'blur(4px)', marginBottom:-20, position:'relative', zIndex:1 }}>
                      {person.initials}
                    </div>
                    <div style={{ paddingBottom:24, flex:1 }}>
                      <div style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:4 }}>{person.name}</div>
                      <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.75)', letterSpacing:'0.5px', textTransform:'uppercase' }}>{person.role}</div>
                    </div>
                  </div>
                </div>
                {/* Bio */}
                <div style={{ padding:'28px 32px 32px', paddingTop:32 }}>
                  <p style={{ fontSize:15, color:C.textSecondary, lineHeight:1.8, margin:0 }}>{person.bio}</p>
                  <div style={{ marginTop:20, display:'flex', gap:10, flexWrap:'wrap' }}>
                    {[
                      { label:lang==='sq'?'New Jersey, SHBA':'New Jersey, USA', icon:'📍' },
                      { label:lang==='sq'?'Siguria Kibernetike':'Cybersecurity B.Sc.', icon:'🎓' },
                      { label:lang==='sq'?'Ndërtues':'Builder', icon:'🚀' },
                    ].map(tag => (
                      <span key={tag.label} style={{ fontSize:12, fontWeight:600, color:C.textSecondary, background:C.bg, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 13px', display:'flex', alignItems:'center', gap:5 }}>
                        <span>{tag.icon}</span>{tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hiring note */}
          <div style={{ marginTop:32, textAlign:'center', background:C.bgWhite, border:`1px solid ${C.border}`, borderRadius:16, padding:'24px 32px' }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, marginBottom:8 }}>
              {lang==='sq' ? 'Jemi duke u rritur — bashkohu me ekipin' : 'We\'re growing — join the team'}
            </div>
            <div style={{ fontSize:13, color:C.textSecondary, marginBottom:16 }}>
              {lang==='sq' ? 'Jemi të interesuar për infermierë, inxhinierë dhe ekspertë të kujdesit shëndetësor.' : 'We\'re interested in nurses, engineers, and healthcare operations experts.'}
            </div>
            <Link href={`/${lang}/contact`}>
              <button style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)', color:'#fff', border:'none', borderRadius:10, padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(124,58,237,0.3)' }}>
                {lang==='sq' ? 'Na kontaktoni' : 'Get in touch →'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'100px 24px', background:'linear-gradient(158deg, #022c1a 0%, #064E3B 55%, #065f46 100%)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* Decorative cross */}
        <div style={{ position:'absolute', top:-20, right:'8%', opacity:0.07 }}>
          <svg width="180" height="180" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#fff"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#fff"/></svg>
        </div>
        <div style={{ position:'absolute', bottom:-10, left:'5%', opacity:0.05 }}>
          <svg width="120" height="120" viewBox="0 0 54 54" fill="none"><rect x="19" y="0" width="16" height="54" rx="6" fill="#4ade80"/><rect x="0" y="19" width="54" height="16" rx="6" fill="#4ade80"/></svg>
        </div>

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, fontSize:11, fontWeight:700, color:'rgba(134,239,172,0.9)', background:'rgba(5,150,105,0.2)', border:'1px solid rgba(5,150,105,0.3)', padding:'6px 16px', borderRadius:99, marginBottom:24, letterSpacing:'1px', textTransform:'uppercase' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }} />
            {lang==='sq' ? 'Aktiv Tani' : 'Now Available'}
          </div>
          <h2 style={{ fontSize:'clamp(28px,4.5vw,50px)', fontWeight:800, color:'#fff', marginBottom:16, letterSpacing:'-1.5px', lineHeight:1.1 }}>
            {t(lang, 'cta.title')}
          </h2>
          <p style={{ fontSize:17, color:'rgba(255,255,255,0.7)', maxWidth:440, margin:'0 auto 40px', lineHeight:1.75 }}>
            {t(lang, 'cta.subtitle')}
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href={`/${lang}/signup?role=client`}>
              <button className="ab-cta-btn" style={{ background:'#fff', color:'#064E3B', border:'none', borderRadius:12, padding:'16px 40px', fontSize:16, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 28px rgba(0,0,0,0.25)' }}>
                {t(lang, 'cta.btn1')}
              </button>
            </Link>
            <Link href={`/${lang}/nurse-signup`}>
              <button className="ab-cta-btn" style={{ background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.35)', borderRadius:12, padding:'16px 32px', fontSize:16, fontWeight:600, cursor:'pointer' }}>
                {lang==='sq' ? 'Bashkohu si infermier/e' : 'Join as a nurse'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
