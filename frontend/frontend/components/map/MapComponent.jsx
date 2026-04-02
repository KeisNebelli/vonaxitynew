'use client';
import { useEffect, useRef, useState } from 'react';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe',
  sage: '#16a34a', red: '#dc2626',
  neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4',
};

/**
 * MapComponent
 * Renders a Google Maps embed with patient marker + optional nurse marker
 * Falls back to static map if JS API not available
 *
 * Props:
 * - patientLat, patientLng: patient coordinates (required)
 * - nurseLat, nurseLng: nurse coordinates (optional)
 * - patientName: string
 * - height: CSS height string (default '300px')
 * - apiKey: Google Maps API key
 * - zoom: number (default 15)
 */
export default function MapComponent({
  patientLat,
  patientLng,
  nurseLat,
  nurseLng,
  patientName = 'Patient',
  height = '300px',
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  zoom = 15,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If no API key, show static fallback
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
      setError(true);
      return;
    }

    // Load Google Maps script
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initMap();
    script.onerror = () => setError(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey, patientLat, patientLng]);

  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: patientLat, lng: patientLng },
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      styles: [
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
      ],
    });

    mapInstanceRef.current = map;

    // Patient marker (red pin)
    const patientMarker = new window.google.maps.Marker({
      position: { lat: patientLat, lng: patientLng },
      map,
      title: patientName,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: C.red,
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div style="font-family:system-ui;font-size:13px;font-weight:700;color:${C.neutralDark};padding:4px 8px;">📍 ${patientName}</div>`,
    });
    patientMarker.addListener('click', () => infoWindow.open(map, patientMarker));

    // Nurse marker (teal pin) — if location provided
    if (nurseLat && nurseLng) {
      new window.google.maps.Marker({
        position: { lat: nurseLat, lng: nurseLng },
        map,
        title: 'Your location',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: C.teal,
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 3,
        },
      });

      // Draw line between nurse and patient
      new window.google.maps.Polyline({
        path: [
          { lat: nurseLat, lng: nurseLng },
          { lat: patientLat, lng: patientLng },
        ],
        geodesic: true,
        strokeColor: C.teal,
        strokeOpacity: 0.5,
        strokeWeight: 2,
        map,
      });

      // Fit both markers in view
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: patientLat, lng: patientLng });
      bounds.extend({ lat: nurseLat, lng: nurseLng });
      map.fitBounds(bounds);
    }

    setLoaded(true);
  };

  // Static map fallback (no API key needed for embed)
  if (error || !apiKey) {
    const staticUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${patientLat},${patientLng}&zoom=${zoom}`;

    return (
      <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, height }}>
        {apiKey ? (
          <iframe
            title="Patient location"
            src={staticUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block' }}
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <StaticMapFallback patientLat={patientLat} patientLng={patientLng} patientName={patientName} height={height} />
        )}
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, height, position: 'relative' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.neutral }}>
          <div style={{ fontSize: 13, color: C.neutralMid }}>Loading map...</div>
        </div>
      )}
    </div>
  );
}

/**
 * StaticMapFallback
 * Shows a clean placeholder when no API key is configured
 * Still shows the address and opens Google Maps on tap
 */
function StaticMapFallback({ patientLat, patientLng, patientName, height }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${patientLat},${patientLng}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height, background: `linear-gradient(135deg, ${C.tealLight}, #f0fdf4)`,
        textDecoration: 'none', gap: 10, cursor: 'pointer',
      }}
    >
      <div style={{ fontSize: 40 }}>🗺️</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>{patientName}</div>
      <div style={{ fontSize: 12, color: C.neutralMid }}>Tap to open in Google Maps</div>
      <div style={{ fontSize: 11, color: C.neutralMid, fontFamily: 'monospace' }}>
        {patientLat.toFixed(4)}, {patientLng.toFixed(4)}
      </div>
    </a>
  );
}
