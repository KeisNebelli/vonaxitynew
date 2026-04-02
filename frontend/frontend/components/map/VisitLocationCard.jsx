'use client';
import { useState } from 'react';
import MapComponent from './MapComponent';
import NavigationButton, { QuickNavButtons } from './NavigationButton';
import { useNurseLocation } from '@/hooks/useNurseLocation';

const C = {
  teal: '#0e7490', tealLight: '#e0f2fe', tealMid: '#0891b2',
  sage: '#16a34a', sageLight: '#f0fdf4',
  amber: '#b45309', amberLight: '#fff7ed',
  red: '#dc2626', redLight: '#fef2f2',
  purple: '#7c3aed', purpleLight: '#f5f3ff',
  neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c',
  white: '#ffffff', border: '#e7e5e4', dark: '#0f172a',
};

const statusColors = {
  upcoming: { bg: C.tealLight, color: C.teal, label: '⏰ Upcoming' },
  accepted: { bg: C.tealLight, color: C.teal, label: '✓ Accepted' },
  on_the_way: { bg: C.amberLight, color: C.amber, label: '🚗 On the way' },
  arrived: { bg: C.sageLight, color: C.sage, label: '📍 Arrived' },
  in_progress: { bg: C.purpleLight, color: C.purple, label: '🏥 In progress' },
  completed: { bg: C.sageLight, color: C.sage, label: '✓ Completed' },
  no_show: { bg: C.redLight, color: C.red, label: '✗ No show' },
};

/**
 * VisitLocationCard
 * Full visit card with embedded map, address, navigation and status controls
 *
 * Props:
 * - visit: { id, clientName, address, lat, lng, service, date, time, status, notes, age, phone }
 * - onStatusChange: (visitId, newStatus) => void
 * - onComplete: (visitId) => void — opens complete visit form
 * - compact: boolean — compact card mode without map
 */
export default function VisitLocationCard({ visit, onStatusChange, onComplete, compact = false }) {
  const [mapVisible, setMapVisible] = useState(!compact);
  const [activeStatus, setActiveStatus] = useState(visit.status || 'upcoming');
  const { location, error: locError, loading: locLoading, permission, getLocation, distanceTo } = useNurseLocation();

  const distance = visit.lat && visit.lng ? distanceTo(visit.lat, visit.lng) : null;
  const status = statusColors[activeStatus] || statusColors.upcoming;

  const updateStatus = (newStatus) => {
    setActiveStatus(newStatus);
    onStatusChange?.(visit.id, newStatus);
  };

  return (
    <div style={{
      background: C.white, borderRadius: 18,
      border: `1.5px solid ${activeStatus === 'on_the_way' ? C.amber : activeStatus === 'arrived' || activeStatus === 'in_progress' ? C.teal : C.border}`,
      overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
      transition: 'border-color 0.2s',
    }}>

      {/* Status bar */}
      <div style={{ background: status.bg, padding: '10px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: status.color }}>{status.label}</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {distance && (
            <span style={{ fontSize: 12, color: status.color, background: 'rgba(255,255,255,0.6)', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
              📍 {distance.km}km · {distance.etaText}
            </span>
          )}
          <span style={{ fontSize: 12, color: status.color, fontWeight: 600 }}>{visit.time}</span>
        </div>
      </div>

      {/* Patient info */}
      <div style={{ padding: '18px 18px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.neutralDark, marginBottom: 3, letterSpacing: '-0.3px' }}>
              {visit.clientName}
            </div>
            <div style={{ fontSize: 13, color: C.teal, fontWeight: 700, marginBottom: 4 }}>{visit.service}</div>
            <div style={{ fontSize: 12, color: C.neutralMid }}>Age {visit.age} · {visit.date}</div>
          </div>
          <a href={`tel:${visit.phone}`} style={{
            width: 44, height: 44, borderRadius: '50%', background: C.sageLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, textDecoration: 'none', border: `1px solid rgba(22,163,74,0.2)`,
            flexShrink: 0,
          }}>
            📞
          </a>
        </div>

        {/* Address */}
        <div style={{ background: C.neutral, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>📍</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark, lineHeight: 1.5 }}>{visit.address}</div>
            {visit.lat && visit.lng && (
              <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 2, fontFamily: 'monospace' }}>
                {visit.lat.toFixed(4)}, {visit.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {visit.notes && (
          <div style={{ background: C.amberLight, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 10, border: `1px solid rgba(180,83,9,0.15)` }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>📋</span>
            <div style={{ fontSize: 13, color: C.amber, lineHeight: 1.6, fontStyle: 'italic' }}>{visit.notes}</div>
          </div>
        )}

        {/* Map toggle */}
        <button onClick={() => setMapVisible(!mapVisible)} style={{ width: '100%', background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, color: C.teal, cursor: 'pointer', marginBottom: mapVisible ? 12 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {mapVisible ? '🗺️ Hide map' : '🗺️ Show map'}
        </button>
      </div>

      {/* Embedded map */}
      {mapVisible && visit.lat && visit.lng && (
        <div style={{ padding: '0 18px 14px' }}>
          <MapComponent
            patientLat={visit.lat}
            patientLng={visit.lng}
            nurseLat={location?.lat}
            nurseLng={location?.lng}
            patientName={visit.clientName}
            height="240px"
          />
        </div>
      )}

      {/* Nurse location */}
      {permission !== 'granted' && (
        <div style={{ padding: '0 18px 14px' }}>
          <button onClick={getLocation} disabled={locLoading} style={{ width: '100%', background: C.tealLight, border: `1.5px solid rgba(8,145,178,0.2)`, borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 600, color: C.teal, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: locLoading ? 0.7 : 1 }}>
            {locLoading ? '📡 Getting location...' : '📡 Enable my location'}
          </button>
          {locError && <div style={{ fontSize: 12, color: C.red, marginTop: 6, textAlign: 'center' }}>{locError}</div>}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <NavigationButton
          lat={visit.lat}
          lng={visit.lng}
          address={visit.address}
          nurseLat={location?.lat}
          nurseLng={location?.lng}
          label="Get Directions"
          size="lg"
          variant="primary"
        />
        <QuickNavButtons
          lat={visit.lat}
          lng={visit.lng}
          address={visit.address}
          nurseLat={location?.lat}
          nurseLng={location?.lng}
        />
      </div>

      {/* Live status controls */}
      {(activeStatus === 'upcoming' || activeStatus === 'accepted' || activeStatus === 'on_the_way' || activeStatus === 'arrived' || activeStatus === 'in_progress') && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '14px 18px', background: C.neutral }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.neutralMid, letterSpacing: '1px', marginBottom: 10 }}>UPDATE STATUS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeStatus !== 'on_the_way' && (
              <button onClick={() => updateStatus('on_the_way')} style={statusBtn(C.amber, C.amberLight)}>🚗 On my way</button>
            )}
            {activeStatus === 'on_the_way' && (
              <button onClick={() => updateStatus('arrived')} style={statusBtn(C.sage, C.sageLight)}>📍 Arrived</button>
            )}
            {activeStatus === 'arrived' && (
              <button onClick={() => updateStatus('in_progress')} style={statusBtn(C.purple, C.purpleLight)}>🏥 Start visit</button>
            )}
            {(activeStatus === 'in_progress' || activeStatus === 'arrived') && (
              <button onClick={() => onComplete?.(visit.id)} style={statusBtn(C.teal, C.tealLight)}>✅ Complete visit</button>
            )}
            {activeStatus !== 'no_show' && (
              <button onClick={() => updateStatus('no_show')} style={statusBtn(C.red, C.redLight)}>✗ No show</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const statusBtn = (color, bg) => ({
  fontSize: 12, fontWeight: 700, padding: '8px 14px',
  borderRadius: 8, border: 'none', cursor: 'pointer',
  background: bg, color: color, transition: 'opacity 0.15s',
});

/**
 * DailyRouteCard
 * Shows all visits for today in a compact list with map toggle
 * Future-ready for route optimization
 */
export function DailyRouteCard({ visits, onVisitSelect }) {
  return (
    <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.neutralDark }}>Today's route</div>
          <div style={{ fontSize: 12, color: C.neutralMid }}>{visits.length} visits · tap to navigate</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.teal }}>{visits.length}</div>
      </div>
      {visits.map((v, i) => (
        <div key={v.id} onClick={() => onVisitSelect?.(v)} style={{ padding: '14px 18px', borderBottom: i < visits.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = C.neutral}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.tealLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: C.teal, flexShrink: 0 }}>
            {i + 1}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark }}>{v.clientName}</div>
            <div style={{ fontSize: 12, color: C.neutralMid, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.address}</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.teal, flexShrink: 0 }}>{v.time}</div>
        </div>
      ))}
    </div>
  );
}
