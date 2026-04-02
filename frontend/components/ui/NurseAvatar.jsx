'use client';

const COLORS = [
  { bg:'#EFF6FF', text:'#1D4ED8' },
  { bg:'#ECFDF5', text:'#065F46' },
  { bg:'#F5F3FF', text:'#5B21B6' },
  { bg:'#FFF7ED', text:'#92400E' },
  { bg:'#F0F9FF', text:'#0C4A6E' },
];

function getColor(name) { return COLORS[name.charCodeAt(0) % COLORS.length]; }
function getInitials(name) { return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }

export default function NurseAvatar({ name='', photo=null, size=48, verified=false }) {
  const { bg, text } = getColor(name);
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.35);
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      {photo ? <img src={photo} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', display:'block', border:'2px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' }} onError={e=>{e.target.style.display='none';}} /> : null}
      <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize, fontWeight:700, color:text, border:'2px solid #fff', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', fontFamily:"'Inter',system-ui,sans-serif" }}>
        {initials}
      </div>
      {verified && (
        <div style={{ position:'absolute', bottom:0, right:0, width:Math.round(size*0.35), height:Math.round(size*0.35), borderRadius:'50%', background:'#059669', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width={Math.round(size*0.18)} height={Math.round(size*0.18)} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      )}
    </div>
  );
}

export function StarRating({ rating, max=5, size=14 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2 }}>
      {Array.from({length:max}).map((_,i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i<Math.floor(rating)?'#F59E0B':i<rating?'#FCD34D':'#E5E7EB'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span style={{ fontSize:size, fontWeight:600, color:'#111827', marginLeft:4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}
