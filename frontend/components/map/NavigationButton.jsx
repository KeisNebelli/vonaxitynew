'use client';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', textPrimary:'#111827', border:'#E5E7EB' };

function CompassIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>; }
function ArrowIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>; }

export default function NavigationButton({ lat, lng, address='', nurseLat, nurseLng, label='Get directions', size='lg', variant='primary' }) {
  const handleNavigate = () => {
    const destination = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
    const origin = nurseLat && nurseLng ? `${nurseLat},${nurseLng}` : '';
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    let url;
    if (isIOS) {
      url = origin ? `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d` : `maps://maps.apple.com/?daddr=${destination}&dirflg=d`;
    } else {
      url = origin ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving` : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    }
    window.open(url, '_blank');
  };

  const sizes = { sm:{ padding:'8px 16px', fontSize:12 }, md:{ padding:'11px 20px', fontSize:14 }, lg:{ padding:'14px 24px', fontSize:15 } };
  const variants = {
    primary: { background:C.primary, color:'#fff', border:'none', boxShadow:'0 2px 8px rgba(37,99,235,0.25)' },
    outline: { background:'transparent', color:C.primary, border:`2px solid ${C.primary}`, boxShadow:'none' },
    green: { background:C.secondary, color:'#fff', border:'none', boxShadow:'0 2px 8px rgba(5,150,105,0.25)' },
  };

  return (
    <button onClick={handleNavigate} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', borderRadius:10, cursor:'pointer', fontWeight:600, fontFamily:'inherit', letterSpacing:'-0.1px', transition:'opacity 0.15s', ...sizes[size]||sizes.lg, ...variants[variant]||variants.primary }}>
      <CompassIcon />
      <span>{label}</span>
      <ArrowIcon />
    </button>
  );
}

export function QuickNavButtons({ lat, lng, address, nurseLat, nurseLng }) {
  const destination = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
  const origin = nurseLat && nurseLng ? `${nurseLat},${nurseLng}` : '';
  const googleUrl = origin ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving` : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
  const appleUrl = origin ? `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d` : `maps://maps.apple.com/?daddr=${destination}&dirflg=d`;

  const btn = { flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'11px 16px', borderRadius:9, fontWeight:600, fontSize:14, cursor:'pointer', textDecoration:'none', fontFamily:'inherit', border:'none' };

  return (
    <div style={{ display:'flex', gap:10 }}>
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn, background:'#4285F4', color:'#fff' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        Google Maps
      </a>
      <a href={appleUrl} style={{ ...btn, background:'#111827', color:'#fff' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>
        Apple Maps
      </a>
    </div>
  );
}
