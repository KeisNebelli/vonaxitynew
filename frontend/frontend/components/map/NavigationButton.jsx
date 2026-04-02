'use client';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe',
  sage: '#16a34a', sageLight: '#f0fdf4',
  neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4',
};

/**
 * NavigationButton
 * Opens Google Maps or Apple Maps with directions to patient
 *
 * Props:
 * - lat, lng: destination coordinates
 * - address: fallback address string
 * - nurseLat, nurseLng: optional origin (nurse location)
 * - label: button label
 * - size: 'sm' | 'md' | 'lg' (default 'lg')
 * - variant: 'primary' | 'outline'
 */
export default function NavigationButton({
  lat,
  lng,
  address = '',
  nurseLat,
  nurseLng,
  label = 'Open in Maps',
  size = 'lg',
  variant = 'primary',
}) {
  const handleNavigate = () => {
    const destination = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
    const origin = nurseLat && nurseLng ? `${nurseLat},${nurseLng}` : '';

    // Detect iOS for Apple Maps deep link
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMac = /Mac/.test(navigator.userAgent) && !isIOS;

    let url;
    if (isIOS || isMac) {
      // Apple Maps deep link
      url = origin
        ? `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`
        : `maps://maps.apple.com/?daddr=${destination}&dirflg=d`;
    } else {
      // Google Maps deep link
      url = origin
        ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    }

    window.open(url, '_blank');
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: 12 },
    md: { padding: '11px 20px', fontSize: 14 },
    lg: { padding: '15px 24px', fontSize: 16 },
  };

  const variants = {
    primary: {
      background: C.teal, color: C.white,
      border: 'none', boxShadow: '0 4px 12px rgba(8,145,178,0.3)',
    },
    outline: {
      background: 'transparent', color: C.teal,
      border: `2px solid ${C.teal}`, boxShadow: 'none',
    },
    green: {
      background: C.sage, color: C.white,
      border: 'none', boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
    },
  };

  return (
    <button
      onClick={handleNavigate}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 10, width: '100%', borderRadius: 12, cursor: 'pointer',
        fontWeight: 700, fontFamily: 'system-ui', letterSpacing: '0.3px',
        transition: 'opacity 0.2s, transform 0.1s',
        ...sizes[size] || sizes.lg,
        ...variants[variant] || variants.primary,
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <span style={{ fontSize: (sizes[size]?.fontSize || 16) + 4 }}>🧭</span>
      <span>{label}</span>
      <span style={{ fontSize: 12, opacity: 0.7 }}>↗</span>
    </button>
  );
}

/**
 * QuickNavButtons
 * Shows both Google Maps and Apple Maps buttons side by side
 */
export function QuickNavButtons({ lat, lng, address, nurseLat, nurseLng }) {
  const destination = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
  const origin = nurseLat && nurseLng ? `${nurseLat},${nurseLng}` : '';

  const googleUrl = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

  const appleUrl = origin
    ? `maps://maps.apple.com/?saddr=${origin}&daddr=${destination}&dirflg=d`
    : `maps://maps.apple.com/?daddr=${destination}&dirflg=d`;

  const btnStyle = {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: '12px 16px', borderRadius: 10, fontWeight: 700,
    fontSize: 14, cursor: 'pointer', textDecoration: 'none', fontFamily: 'system-ui',
  };

  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <a href={googleUrl} target="_blank" rel="noopener noreferrer"
        style={{ ...btnStyle, background: '#4285F4', color: '#fff', border: 'none' }}>
        <span>🗺️</span> Google
      </a>
      <a href={appleUrl}
        style={{ ...btnStyle, background: '#000', color: '#fff', border: 'none' }}>
        <span>🍎</span> Apple
      </a>
    </div>
  );
}
