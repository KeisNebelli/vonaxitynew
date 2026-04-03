'use client';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function MapComponent({ patientLat, patientLng, patientName='Patient', height='300px', apiKey=process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY||'', zoom=15 }) {

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${patientLat},${patientLng}`;

  if (!apiKey) {
    return (
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height, background:C.primaryLight, borderRadius:12, border:`1px solid rgba(37,99,235,0.15)`, textDecoration:'none', gap:10, cursor:'pointer' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:C.bgWhite, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div style={{ fontSize:14, fontWeight:600, color:C.primary }}>{patientName}</div>
        <div style={{ fontSize:12, color:C.textTertiary }}>Tap to open in Google Maps</div>
      </a>
    );
  }

  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${patientLat},${patientLng}&zoom=${zoom}`;

  return (
    <div style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}`, height }}>
      <iframe
        title={`Map - ${patientName}`}
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border:'none', display:'block' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}