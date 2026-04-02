'use client';
import { useEffect, useRef, useState } from 'react';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', error:'#DC2626', bg:'#FAFAF9', bgWhite:'#FFFFFF', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB' };

export default function MapComponent({ patientLat, patientLng, nurseLat, nurseLng, patientName='Patient', height='300px', apiKey=process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY||'', zoom=15 }) {
  const mapRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') { setError(true); return; }
    if (window.google && window.google.maps) { initMap(); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => initMap();
    script.onerror = () => setError(true);
    document.head.appendChild(script);
  }, [apiKey, patientLat, patientLng]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;
    const map = new window.google.maps.Map(mapRef.current, { center:{lat:patientLat,lng:patientLng}, zoom, mapTypeControl:false, streetViewControl:false, fullscreenControl:false });
    new window.google.maps.Marker({ position:{lat:patientLat,lng:patientLng}, map, title:patientName, icon:{ path:window.google.maps.SymbolPath.CIRCLE, scale:12, fillColor:C.error, fillOpacity:1, strokeColor:'#fff', strokeWeight:3 } });
    if (nurseLat && nurseLng) {
      new window.google.maps.Marker({ position:{lat:nurseLat,lng:nurseLng}, map, title:'Your location', icon:{ path:window.google.maps.SymbolPath.CIRCLE, scale:10, fillColor:C.primary, fillOpacity:1, strokeColor:'#fff', strokeWeight:3 } });
      new window.google.maps.Polyline({ path:[{lat:nurseLat,lng:nurseLng},{lat:patientLat,lng:patientLng}], geodesic:true, strokeColor:C.primary, strokeOpacity:0.4, strokeWeight:2, map });
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({lat:patientLat,lng:patientLng});
      bounds.extend({lat:nurseLat,lng:nurseLng});
      map.fitBounds(bounds);
    }
    setLoaded(true);
  };

  if (error || !apiKey) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${patientLat},${patientLng}`;
    return (
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height, background:C.primaryLight, borderRadius:12, border:`1px solid rgba(37,99,235,0.15)`, textDecoration:'none', gap:10, cursor:'pointer' }}>
        <div style={{ width:48, height:48, borderRadius:'50%', background:C.bgWhite, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <div style={{ fontSize:14, fontWeight:600, color:C.primary }}>{patientName}</div>
        <div style={{ fontSize:12, color:C.textTertiary }}>Tap to open in Google Maps</div>
        <div style={{ fontSize:11, color:C.textTertiary, fontFamily:'monospace' }}>{patientLat.toFixed(4)}, {patientLng.toFixed(4)}</div>
      </a>
    );
  }

  return (
    <div style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}`, height, position:'relative' }}>
      <div ref={mapRef} style={{ width:'100%', height:'100%' }} />
      {!loaded && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}><div style={{ fontSize:13, color:C.textTertiary }}>Loading map...</div></div>}
    </div>
  );
}
