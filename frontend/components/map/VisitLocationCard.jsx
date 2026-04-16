'use client';
import { useState } from 'react';
import MapComponent from './MapComponent';
import NavigationButton, { QuickNavButtons } from './NavigationButton';
import { useNurseLocation } from '@/hooks/useNurseLocation';
import { t } from '@/translations';

const C = { primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5', warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2', purple:'#7C3AED', purpleLight:'#F5F3FF', bg:'#FAFAF9', bgWhite:'#FFFFFF', bgSubtle:'#F5F5F4', textPrimary:'#111827', textSecondary:'#6B7280', textTertiary:'#9CA3AF', border:'#E5E7EB', borderSubtle:'#F3F4F6' };

const STATUS_STYLES = {
  upcoming:    { bg:C.primaryLight, color:C.primary },
  accepted:    { bg:C.primaryLight, color:C.primary },
  on_the_way:  { bg:C.warningLight, color:C.warning },
  arrived:     { bg:C.secondaryLight, color:C.secondary },
  in_progress: { bg:C.purpleLight, color:C.purple },
  completed:   { bg:C.secondaryLight, color:C.secondary },
  no_show:     { bg:C.errorLight, color:C.error },
};

function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .19h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>; }
function MapPinIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function AlertIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function MapIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>; }
function LocationIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>; }

export default function VisitLocationCard({ visit, onStatusChange, onComplete, compact = false, lang = 'en' }) {
  const [mapVisible, setMapVisible] = useState(!compact);
  const [activeStatus, setActiveStatus] = useState(visit.status || 'upcoming');
  const { location, error: locError, loading: locLoading, permission, getLocation, distanceTo } = useNurseLocation();
  const distance = visit.lat && visit.lng ? distanceTo(visit.lat, visit.lng) : null;
  const style = STATUS_STYLES[activeStatus] || STATUS_STYLES.upcoming;
  const statusLabel = t(lang, `nurse.status${activeStatus.split('_').map(w=>w[0].toUpperCase()+w.slice(1)).join('')}`) || activeStatus;

  const updateStatus = (s) => { setActiveStatus(s); onStatusChange?.(visit.id, s); };

  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${activeStatus==='on_the_way'?C.warning:activeStatus==='arrived'||activeStatus==='in_progress'?C.primary:C.border}`, overflow:'hidden', boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>

      {/* Status bar */}
      <div style={{ background:style.bg, padding:'10px 18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, fontWeight:700, color:style.color, letterSpacing:'0.2px' }}>{statusLabel}</span>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {distance && <span style={{ fontSize:12, color:style.color, background:'rgba(255,255,255,0.6)', padding:'2px 8px', borderRadius:99, fontWeight:600 }}>{distance.km}km · {distance.etaText}</span>}
          <span style={{ fontSize:13, fontWeight:700, color:style.color }}>{visit.time}</span>
        </div>
      </div>

      {/* Patient info */}
      <div style={{ padding:'18px 18px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:C.textPrimary, marginBottom:3, letterSpacing:'-0.3px' }}>{visit.clientName}</div>
            <div style={{ fontSize:13, fontWeight:600, color:C.primary, marginBottom:4 }}>{visit.service}</div>
            <div style={{ fontSize:12, color:C.textTertiary }}>{t(lang,'nurse.ageLabel')} {visit.age} · {visit.date}</div>
          </div>
          <a href={`tel:${visit.phone}`} style={{ width:42, height:42, borderRadius:'50%', background:C.secondaryLight, display:'flex', alignItems:'center', justifyContent:'center', color:C.secondary, textDecoration:'none', border:`1px solid rgba(5,150,105,0.15)`, flexShrink:0 }}>
            <PhoneIcon />
          </a>
        </div>

        {/* Address */}
        <div style={{ background:C.bg, borderRadius:10, padding:'10px 14px', marginBottom:12, display:'flex', gap:10, alignItems:'flex-start' }}>
          <div style={{ color:C.error, marginTop:1, flexShrink:0 }}><MapPinIcon /></div>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:C.textPrimary, lineHeight:1.5 }}>{visit.address}</div>
            {visit.lat && visit.lng && <div style={{ fontSize:11, color:C.textTertiary, marginTop:2, fontFamily:'monospace' }}>{visit.lat.toFixed(4)}, {visit.lng.toFixed(4)}</div>}
          </div>
        </div>

        {/* Notes */}
        {visit.notes && (
          <div style={{ background:C.warningLight, borderRadius:10, padding:'10px 14px', marginBottom:12, display:'flex', gap:10, border:`1px solid rgba(217,119,6,0.15)` }}>
            <div style={{ color:C.warning, marginTop:1, flexShrink:0 }}><AlertIcon /></div>
            <div style={{ fontSize:13, color:C.warning, lineHeight:1.6 }}>{visit.notes}</div>
          </div>
        )}

        {/* Map toggle */}
        <button onClick={()=>setMapVisible(!mapVisible)} style={{ width:'100%', background:'transparent', border:`1.5px solid ${C.border}`, borderRadius:10, padding:'10px', fontSize:13, fontWeight:600, color:C.primary, cursor:'pointer', marginBottom:mapVisible?12:0, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <MapIcon /> {mapVisible ? t(lang,'nurse.hideMap') : t(lang,'nurse.showMap')}
        </button>
      </div>

      {/* Map */}
      {mapVisible && (visit.lat || visit.address) && (
        <div style={{ padding:'0 18px 14px' }}>
          <MapComponent patientLat={visit.lat} patientLng={visit.lng} nurseLat={location?.lat} nurseLng={location?.lng} patientName={visit.clientName} patientAddress={visit.address} height="240px" />
        </div>
      )}

      {/* Location button */}
      {permission !== 'granted' && (
        <div style={{ padding:'0 18px 14px' }}>
          <button onClick={getLocation} disabled={locLoading} style={{ width:'100%', background:C.primaryLight, border:`1.5px solid rgba(37,99,235,0.15)`, borderRadius:10, padding:'10px', fontSize:13, fontWeight:600, color:C.primary, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, opacity:locLoading?0.7:1 }}>
            <LocationIcon /> {locLoading ? t(lang,'nurse.gettingLocation') : t(lang,'nurse.enableLocation')}
          </button>
          {locError && <div style={{ fontSize:12, color:C.error, marginTop:6, textAlign:'center' }}>{locError}</div>}
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ padding:'0 18px 18px', display:'flex', flexDirection:'column', gap:10 }}>
        <NavigationButton lat={visit.lat} lng={visit.lng} address={visit.address} nurseLat={location?.lat} nurseLng={location?.lng} label={t(lang,'nurse.getDirections')} size="lg" variant="primary" />
        <QuickNavButtons lat={visit.lat} lng={visit.lng} address={visit.address} nurseLat={location?.lat} nurseLng={location?.lng} />
      </div>

      {/* Status controls */}
      {['upcoming','accepted','pending','on_the_way','arrived','in_progress'].includes(activeStatus) && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:'14px 18px', background:C.bg }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, letterSpacing:'1px', marginBottom:10 }}>{t(lang,'nurse.updateStatus')}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {activeStatus!=='on_the_way' && <button onClick={()=>updateStatus('on_the_way')} style={sBtn(C.warning,C.warningLight)}>{t(lang,'nurse.onMyWay')}</button>}
            {activeStatus==='on_the_way' && <button onClick={()=>updateStatus('arrived')} style={sBtn(C.secondary,C.secondaryLight)}>{t(lang,'nurse.statusArrived')}</button>}
            {activeStatus==='arrived' && <button onClick={()=>updateStatus('in_progress')} style={sBtn(C.purple,C.purpleLight)}>{t(lang,'nurse.startVisit')}</button>}
            {['in_progress','arrived','pending','accepted'].includes(activeStatus) && <button onClick={()=>onComplete?.(visit.id)} style={sBtn(C.primary,C.primaryLight)}>{t(lang,'nurse.completeVisit')}</button>}
            {activeStatus!=='no_show' && <button onClick={()=>updateStatus('no_show')} style={sBtn(C.error,C.errorLight)}>{t(lang,'nurse.noShow')}</button>}
          </div>
        </div>
      )}
    </div>
  );
}

const sBtn = (color, bg) => ({ fontSize:12, fontWeight:600, padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', background:bg, color, letterSpacing:'0.1px' });

export function DailyRouteCard({ visits, onVisitSelect, lang = 'en' }) {
  return (
    <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, overflow:'hidden' }}>
      <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px' }}>{t(lang,'nurse.todayRoute')}</div>
          <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>{visits.length} {t(lang,'nurse.visitsScheduled')}</div>
        </div>
        <div style={{ fontSize:24, fontWeight:800, color:C.primary, letterSpacing:'-1px' }}>{visits.length}</div>
      </div>
      {visits.map((v,i) => (
        <div key={v.id} onClick={()=>onVisitSelect?.(v)} style={{ padding:'14px 20px', borderBottom:i<visits.length-1?`1px solid ${C.borderSubtle}`:'none', cursor:'pointer', display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:C.primary, flexShrink:0 }}>{i+1}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.textPrimary }}>{v.clientName}</div>
            <div style={{ fontSize:12, color:C.textTertiary, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>{v.address}</div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:C.primary, flexShrink:0 }}>{v.time}</div>
        </div>
      ))}
    </div>
  );
}
