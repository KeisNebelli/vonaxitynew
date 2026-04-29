'use client';
import { useState, useRef, useEffect } from 'react';

const F = "'Inter','DM Sans',system-ui,sans-serif";

/* ─── Design tokens ──────────────────────────────────────── */
const C = {
  blue:        '#2563EB',
  blueLight:   '#EFF6FF',
  blueMid:     '#BFDBFE',
  green:       '#16A34A',
  greenLight:  '#F0FDF4',
  yellow:      '#D97706',
  yellowLight: '#FFFBEB',
  red:         '#DC2626',
  redLight:    '#FFF1F2',
  bg:          '#F8FAFC',
  white:       '#FFFFFF',
  border:      '#E2E8F0',
  borderFaint: '#F1F5F9',
  text:        '#0F172A',
  textSub:     '#475569',
  textMuted:   '#94A3B8',
  shadow:      '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
  shadowMd:    '0 4px 12px rgba(15,23,42,0.08), 0 1px 3px rgba(15,23,42,0.04)',
};

/* ─── Metric definitions ─────────────────────────────────── */
const METRICS = [
  {
    id: 'bp', label: 'Blood Pressure', labelSq: 'Presioni',
    unit: 'mmHg', normalLo: 90, normalHi: 120,
    color: '#2563EB',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  },
  {
    id: 'glucose', label: 'Glucose', labelSq: 'Glukoza',
    unit: 'mmol/L', normalLo: 3.9, normalHi: 5.6,
    color: '#0891B2',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="8"/><path d="M8 12h8M12 8v8"/></svg>,
  },
  {
    id: 'hr', label: 'Heart Rate', labelSq: 'Ritmi Kardiak',
    unit: 'bpm', normalLo: 60, normalHi: 100,
    color: '#DC2626',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    id: 'oxygen', label: 'Oxygen Sat.', labelSq: 'Saturimi O₂',
    unit: '%', normalLo: 95, normalHi: 100,
    color: '#7C3AED',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 6v6l4 2"/></svg>,
  },
  {
    id: 'temp', label: 'Temperature', labelSq: 'Temperatura',
    unit: '°C', normalLo: 36.1, normalHi: 37.2,
    color: '#D97706',
    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>,
  },
];

/* ─── Utility ────────────────────────────────────────────── */
function fmtDate(d, mode = 'full') {
  if (!d) return '—';
  const dt = new Date(d);
  if (mode === 'short') return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (mode === 'long')  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatus(metric, value) {
  if (value == null) return null;
  if (value < metric.normalLo) return { label: 'Low',    labelSq: 'E ulët',  color: C.blue,  bg: C.blueLight  };
  if (value > metric.normalHi) return { label: 'High',   labelSq: 'E lartë', color: C.red,   bg: C.redLight   };
  return                              { label: 'Normal', labelSq: 'Normal',  color: C.green, bg: C.greenLight };
}

function getInsight(metric, points, lang) {
  if (!points.length) return null;
  const latest = points[points.length - 1];
  const prev   = points[points.length - 2];
  const st     = getStatus(metric, latest.value);
  if (!st) return null;
  const trendDelta = prev != null ? latest.value - prev.value : null;
  const stable     = trendDelta !== null && Math.abs(trendDelta) < (metric.id === 'temp' ? 0.3 : 2);
  const improving  = trendDelta !== null && (
    (st.label === 'High' && trendDelta < 0) || (st.label === 'Low' && trendDelta > 0)
  );
  const en = {
    Normal: stable
      ? `${metric.label} is within the normal range and stable.`
      : `${metric.label} is within the normal range (${metric.normalLo}–${metric.normalHi} ${metric.unit}).`,
    High: improving
      ? `${metric.label} is above normal but showing improvement since last visit.`
      : `${metric.label} is above the normal range (${metric.normalLo}–${metric.normalHi} ${metric.unit}). Monitor closely.`,
    Low: improving
      ? `${metric.label} is below normal but trending upward — continue monitoring.`
      : `${metric.label} is below the normal range (${metric.normalLo}–${metric.normalHi} ${metric.unit}). Consult your nurse.`,
  };
  const sq = {
    Normal: `${metric.labelSq} është brenda vlerave normale (${metric.normalLo}–${metric.normalHi} ${metric.unit}).`,
    High:   `${metric.labelSq} është mbi kufirin normal. Rekomandohet monitorim i vazhdueshëm.`,
    Low:    `${metric.labelSq} është nën kufirin normal. Konsultohuni me infermieren.`,
  };
  return lang === 'sq' ? sq[st.label] : en[st.label];
}

/* ─── Bezier path builders ───────────────────────────────── */
function buildSmoothPath(pts, toX, toY, key = 'value') {
  const valid = pts.filter(p => p[key] != null);
  if (!valid.length) return '';
  if (valid.length === 1) return `M ${toX(pts.indexOf(valid[0]))} ${toY(valid[0][key])}`;
  let d = `M ${toX(pts.indexOf(valid[0]))} ${toY(valid[0][key])}`;
  for (let i = 0; i < valid.length - 1; i++) {
    const p0 = valid[Math.max(i - 1, 0)];
    const p1 = valid[i];
    const p2 = valid[i + 1];
    const p3 = valid[Math.min(i + 2, valid.length - 1)];
    const t = 0.25;
    const x1 = toX(pts.indexOf(p1)), y1 = toY(p1[key]);
    const x2 = toX(pts.indexOf(p2)), y2 = toY(p2[key]);
    const cp1x = x1 + t * (toX(pts.indexOf(p2)) - toX(pts.indexOf(p0))) / 2;
    const cp1y = y1 + t * (toY(p2[key]) - toY(p0[key])) / 2;
    const cp2x = x2 - t * (toX(pts.indexOf(p3)) - toX(pts.indexOf(p1))) / 2;
    const cp2y = y2 - t * (toY(p3[key]) - toY(p1[key])) / 2;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }
  return d;
}

function buildAreaPath(pts, toX, toY, key, bottomY) {
  const valid = pts.filter(p => p[key] != null);
  if (!valid.length) return '';
  const line = buildSmoothPath(pts, toX, toY, key);
  return `${line} L ${toX(pts.indexOf(valid[valid.length - 1]))} ${bottomY} L ${toX(pts.indexOf(valid[0]))} ${bottomY} Z`;
}

/* ─── SVG line chart ─────────────────────────────────────── */
function VitalsChart({ points, metric, lang }) {
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);
  const [W, setW] = useState(560);

  useEffect(() => {
    if (!containerRef.current) return;
    const ob = new ResizeObserver(e => setW(e[0].contentRect.width || 560));
    ob.observe(containerRef.current);
    return () => ob.disconnect();
  }, []);

  const isBP = metric.id === 'bp';
  const H = 220, PAD = { top: 24, right: 24, bottom: 40, left: 48 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top  - PAD.bottom;
  const n = points.length;

  const allVals = isBP
    ? points.flatMap(p => [p.value, p.value2].filter(Boolean))
    : points.map(p => p.value).filter(Boolean);

  const lo = metric.normalLo, hi = metric.normalHi;
  const rawMin = Math.min(...allVals, lo), rawMax = Math.max(...allVals, hi);
  const span = rawMax - rawMin || 10;
  const minV = rawMin - span * 0.12, maxV = rawMax + span * 0.12;

  const toX = i => PAD.left + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const toY = v => PAD.top  + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const yTicks = Array.from({ length: 5 }, (_, i) => minV + (i / 4) * (maxV - minV));
  const xStep  = n <= 6 ? 1 : Math.ceil(n / 5);
  const gradId = `g-${metric.id}`, gradId2 = `g2-${metric.id}`, clipId = `c-${metric.id}`;

  return (
    <div ref={containerRef} style={{ position: 'relative', userSelect: 'none' }}>
      {n === 1 && (
        <div style={{
          position: 'absolute', left: '50%', top: 54, transform: 'translateX(-50%)',
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10,
          padding: '12px 20px', fontSize: 12, color: C.textMuted,
          textAlign: 'center', zIndex: 2, whiteSpace: 'nowrap',
        }}>
          {lang === 'sq'
            ? 'Nevojiten të paktën 2 vizita për të treguar trendin.'
            : 'At least 2 visits needed to show a trend.'}
        </div>
      )}
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric.color} stopOpacity="0.16"/>
            <stop offset="100%" stopColor={metric.color} stopOpacity="0"/>
          </linearGradient>
          {isBP && (
            <linearGradient id={gradId2} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0"/>
            </linearGradient>
          )}
          <clipPath id={clipId}>
            <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH}/>
          </clipPath>
        </defs>

        {/* Normal range band */}
        <rect x={PAD.left} y={toY(Math.min(hi, maxV))} width={plotW}
          height={Math.max(0, toY(Math.max(lo, minV)) - toY(Math.min(hi, maxV)))}
          fill={metric.color} opacity={0.05}/>
        <line x1={PAD.left} y1={toY(hi)} x2={PAD.left + plotW} y2={toY(hi)}
          stroke={metric.color} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.35}/>
        <line x1={PAD.left} y1={toY(lo)} x2={PAD.left + plotW} y2={toY(lo)}
          stroke={metric.color} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.35}/>
        <text x={PAD.left + plotW + 4} y={toY(hi)} fontSize={8} fill={metric.color}
          opacity={0.55} dominantBaseline="middle" fontFamily={F}>{hi}</text>
        <text x={PAD.left + plotW + 4} y={toY(lo)} fontSize={8} fill={metric.color}
          opacity={0.55} dominantBaseline="middle" fontFamily={F}>{lo}</text>

        {/* Grid */}
        {yTicks.map((v, i) => (
          <line key={i} x1={PAD.left} y1={toY(v)} x2={PAD.left + plotW} y2={toY(v)}
            stroke={C.border} strokeWidth={0.7}
            strokeDasharray={i === 0 || i === 4 ? '0' : '2 4'}/>
        ))}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH}
          stroke={C.border} strokeWidth={1}/>

        {/* Y labels */}
        {yTicks.filter((_, i) => i % 2 === 0).map((v, i) => (
          <text key={i} x={PAD.left - 6} y={toY(v)} textAnchor="end" fontSize={9}
            fill={C.textMuted} dominantBaseline="middle" fontFamily={F}>
            {metric.id === 'temp' ? v.toFixed(1) : Math.round(v)}
          </text>
        ))}

        {/* X labels */}
        {points.map((p, i) => {
          if (n > 6 && i % xStep !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize={9}
              fill={C.textMuted} fontFamily={F}>{fmtDate(p.date, 'short')}</text>
          );
        })}

        {/* Areas */}
        {n >= 2 && (
          <>
            <path d={buildAreaPath(points, toX, toY, 'value', PAD.top + plotH)}
              fill={`url(#${gradId})`} clipPath={`url(#${clipId})`}/>
            {isBP && <path d={buildAreaPath(points, toX, toY, 'value2', PAD.top + plotH)}
              fill={`url(#${gradId2})`} clipPath={`url(#${clipId})`}/>}
          </>
        )}

        {/* Lines */}
        {n >= 2 && (
          <>
            <path d={buildSmoothPath(points, toX, toY, 'value')}
              fill="none" stroke={metric.color} strokeWidth={2.5}
              strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${clipId})`}/>
            {isBP && <path d={buildSmoothPath(points, toX, toY, 'value2')}
              fill="none" stroke="#93C5FD" strokeWidth={2}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="5 3" clipPath={`url(#${clipId})`}/>}
          </>
        )}

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            {hovered === i && (
              <line x1={toX(i)} y1={PAD.top} x2={toX(i)} y2={PAD.top + plotH}
                stroke={metric.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.4}/>
            )}
            <circle cx={toX(i)} cy={toY(p.value)} r={14} fill="transparent"/>
            <circle cx={toX(i)} cy={toY(p.value)} r={hovered === i ? 6 : 4}
              fill={hovered === i ? metric.color : C.white}
              stroke={metric.color} strokeWidth={2.5}
              style={{ transition: 'r 0.12s, fill 0.12s' }}/>
            {isBP && p.value2 != null && (
              <circle cx={toX(i)} cy={toY(p.value2)} r={hovered === i ? 5 : 3}
                fill={hovered === i ? '#93C5FD' : C.white} stroke="#93C5FD" strokeWidth={2}
                style={{ transition: 'r 0.12s' }}/>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hovered !== null && (() => {
        const p = points[hovered];
        const x = toX(hovered);
        const pct = (x - PAD.left) / plotW;
        return (
          <div style={{
            position: 'absolute', top: 8,
            left:  pct < 0.65 ? `${(x / W) * 100 + 2}%` : undefined,
            right: pct >= 0.65 ? `${((W - x) / W) * 100 + 2}%` : undefined,
            transform: pct < 0.65 ? 'translateX(4px)' : 'translateX(-4px)',
            background: '#0F172A', color: '#F8FAFC',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 12, fontFamily: F, whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)', zIndex: 20, pointerEvents: 'none',
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 2 }}>
              {isBP ? `${p.value}/${p.value2 ?? '—'} ${metric.unit}` : `${p.value} ${metric.unit}`}
            </div>
            <div style={{ color: '#94A3B8', fontSize: 11 }}>{fmtDate(p.date, 'long')}</div>
            {p.nurse && <div style={{ color: '#64748B', fontSize: 11, marginTop: 2 }}>Nurse: {p.nurse}</div>}
          </div>
        );
      })()}
    </div>
  );
}

/* ─── Mini stat card ─────────────────────────────────────── */
function MiniStat({ label, value, unit, color }) {
  return (
    <div style={{ flex: 1, minWidth: 80, background: C.bg, borderRadius: 10,
      border: `1px solid ${C.border}`, padding: '10px 14px' }}>
      <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 800, color: color || C.text, letterSpacing: '-0.5px' }}>
        {value ?? '—'}
        {value != null && <span style={{ fontSize: 10, fontWeight: 500, color: C.textMuted, marginLeft: 3 }}>{unit}</span>}
      </div>
    </div>
  );
}

/* ─── History table row ──────────────────────────────────── */
function HistoryRow({ p, metric, st, origVisit, activeMetric, lang }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: `1px solid ${C.borderFaint}`,
        background: hov ? C.bg : C.white, transition: 'background 0.1s' }}>
      <td style={{ padding: '12px 16px', fontSize: 13, color: C.textSub, whiteSpace: 'nowrap', fontWeight: 500 }}>
        {fmtDate(p.date)}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 800, color: metric.color, whiteSpace: 'nowrap' }}>
        {activeMetric === 'bp' ? `${p.value}/${p.value2 ?? '—'}` : p.value}
        <span style={{ fontSize: 10, fontWeight: 400, color: C.textMuted, marginLeft: 3 }}>{metric.unit}</span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        {st && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
            background: st.bg, color: st.color, border: `1px solid ${st.color}25` }}>
            {lang === 'sq' ? st.labelSq : st.label}
          </span>
        )}
      </td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: C.textSub }}>{p.nurse || '—'}</td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: C.textMuted,
        maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {origVisit?.serviceType || '—'}
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════
   NURSE: Build patient groups from all visits
   ═══════════════════════════════════════════════════════════ */
function buildPatientGroups(visits) {
  const map = {};
  for (const v of visits) {
    const relId = v.relativeId || v.relative?.id;
    if (!relId) continue;
    if (!map[relId]) {
      map[relId] = {
        id:           relId,
        name:         v.relative?.name || 'Patient',
        age:          v.relative?.age  || null,
        address:      v.relative?.address || null,
        allVisits:    [],
        vitalsVisits: [],
        lastVisitDate: null,
        lastVitals:   null,
      };
    }
    const g = map[relId];
    g.allVisits.push(v);

    const date = v.completedAt || v.scheduledAt;
    if (!g.lastVisitDate || new Date(date) > new Date(g.lastVisitDate)) g.lastVisitDate = date;

    if (v.status === 'COMPLETED' && (v.bpSystolic || v.heartRate || v.glucose || v.oxygenSat || v.temperature)) {
      g.vitalsVisits.push(v);
      // keep latest vitals snapshot
      if (!g.lastVitalsDate || new Date(date) > new Date(g.lastVitalsDate)) {
        g.lastVitalsDate = date;
        g.lastVitals = {
          bp:      v.bpSystolic ? `${v.bpSystolic}/${v.bpDiastolic ?? '—'}` : null,
          hr:      v.heartRate  || null,
          glucose: v.glucose    || null,
          o2:      v.oxygenSat  || null,
          temp:    v.temperature ? `${v.temperature}°C` : null,
        };
      }
    }
  }
  return Object.values(map).sort((a, b) =>
    new Date(b.lastVisitDate || 0) - new Date(a.lastVisitDate || 0)
  );
}

/* ─── Patient selector card ──────────────────────────────── */
function PatientCard({ patient, onClick, lang }) {
  const [hov, setHov] = useState(false);
  const initials = patient.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const lv = patient.lastVitals;
  const preview = lv
    ? [lv.bp && `BP ${lv.bp}`, lv.hr && `HR ${lv.hr}`, lv.o2 && `O₂ ${lv.o2}%`, lv.glucose && `Glu ${lv.glucose}`]
        .filter(Boolean).slice(0, 3)
    : [];

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, borderRadius: 14,
        border: `1.5px solid ${hov ? C.blue : C.border}`,
        padding: '16px 18px', cursor: 'pointer',
        boxShadow: hov ? C.shadowMd : C.shadow,
        transform: hov ? 'translateY(-1px)' : 'none',
        transition: 'all 0.15s',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>

      {/* Avatar */}
      <div style={{
        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 800, color: '#fff',
      }}>{initials}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{patient.name}</div>
          {patient.age && (
            <span style={{ fontSize: 11, color: C.textMuted, background: C.bg,
              border: `1px solid ${C.border}`, borderRadius: 99, padding: '1px 8px', flexShrink: 0 }}>
              {patient.age}y
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: C.textMuted }}>
          <span>
            {patient.vitalsVisits.length} {lang==='sq' ? 'vizita me vitale' : 'visits with vitals'}
          </span>
          {patient.lastVisitDate && (
            <span>· {lang==='sq' ? 'Vizita e fundit' : 'Last visit'}: {fmtDate(patient.lastVisitDate, 'short')}</span>
          )}
        </div>

        {/* Vitals preview */}
        {preview.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
            {preview.map((v, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 600, color: C.blue,
                background: C.blueLight, borderRadius: 6, padding: '2px 8px',
              }}>{v}</span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div style={{ color: hov ? C.blue : C.textMuted, flexShrink: 0, transition: 'color 0.15s' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  );
}

/* ─── Nurse patient selector screen ─────────────────────── */
function NursePatientSelector({ patients, onSelect, lang }) {
  const withVitals = patients.filter(p => p.vitalsVisits.length > 0);
  const noVitals   = patients.filter(p => p.vitalsVisits.length === 0);

  if (patients.length === 0) {
    return (
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
        padding: '60px 32px', textAlign: 'center', boxShadow: C.shadow }}>
        <div style={{ width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.blue}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>
          {lang==='sq' ? 'Nuk keni pacientë akoma' : 'No patients yet'}
        </div>
        <div style={{ fontSize: 13, color: C.textMuted, maxWidth: 320, margin: '0 auto', lineHeight: 1.75 }}>
          {lang==='sq'
            ? 'Pacientët do të shfaqen pasi të pranoni dhe të kompletoni vizita.'
            : 'Patients will appear here after you accept and complete visits.'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
        padding: '18px 20px', boxShadow: C.shadow }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.4px', marginBottom: 4 }}>
          {lang==='sq' ? 'Progresi Shëndetësor' : 'Patient Health Records'}
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>
          {lang==='sq'
            ? 'Zgjidhni një pacient për të parë historikun e vitales'
            : 'Select a patient to view their health progress and vitals history'}
        </div>
      </div>

      {/* Patients with vitals */}
      {withVitals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted,
            textTransform: 'uppercase', letterSpacing: '0.6px', paddingLeft: 2 }}>
            {lang==='sq' ? 'Pacientë me të dhëna vitale' : 'Patients with vitals recorded'} ({withVitals.length})
          </div>
          {withVitals.map(p => (
            <PatientCard key={p.id} patient={p} onClick={() => onSelect(p.id)} lang={lang}/>
          ))}
        </div>
      )}

      {/* Patients without vitals */}
      {noVitals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted,
            textTransform: 'uppercase', letterSpacing: '0.6px', paddingLeft: 2 }}>
            {lang==='sq' ? 'Pa vitale të regjistruara' : 'No vitals recorded yet'} ({noVitals.length})
          </div>
          {noVitals.map(p => (
            <div key={p.id} style={{
              background: C.bg, borderRadius: 14, border: `1px solid ${C.border}`,
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
              opacity: 0.7,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: C.border, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.textMuted,
              }}>
                {p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>{p.name}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
                  {p.allVisits.length} {lang==='sq'?'vizita':'visits'} · {lang==='sq'?'Nuk ka vitale të regjistruara':'No vitals recorded'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEALTH ANALYTICS — shown once a patient is chosen
   ═══════════════════════════════════════════════════════════ */
function HealthAnalytics({ visits, relative, lang, nurseMode, onBack }) {
  const [activeMetric, setActiveMetric] = useState('bp');
  const metric = METRICS.find(m => m.id === activeMetric);

  /* Completed visits with any vitals, sorted chronologically */
  const vitalsRaw = visits
    .filter(v => v.status === 'COMPLETED' &&
      (v.bpSystolic || v.heartRate || v.glucose || v.oxygenSat || v.temperature))
    .sort((a, b) =>
      new Date(a.completedAt || a.scheduledAt) - new Date(b.completedAt || b.scheduledAt));

  const buildPoints = id => vitalsRaw.map(v => {
    const date  = v.completedAt || v.scheduledAt;
    const nurse = v.nurse?.user?.name || v.nurseName || null;
    switch (id) {
      case 'bp':      return v.bpSystolic  ? { date, value: v.bpSystolic, value2: v.bpDiastolic ?? null, nurse } : null;
      case 'glucose': return v.glucose     ? { date, value: v.glucose, nurse } : null;
      case 'hr':      return v.heartRate   ? { date, value: v.heartRate, nurse } : null;
      case 'oxygen':  return v.oxygenSat   ? { date, value: v.oxygenSat, nurse } : null;
      case 'temp':    return v.temperature ? { date, value: v.temperature, nurse } : null;
      default: return null;
    }
  }).filter(Boolean);

  const points  = buildPoints(activeMetric);
  const latest  = points[points.length - 1] ?? null;
  const prev    = points[points.length - 2] ?? null;
  const trend   = latest && prev ? latest.value - prev.value : null;
  const status  = latest ? getStatus(metric, latest.value) : null;
  const insight = getInsight(metric, points, lang);

  const allVals = points.map(p => p.value);
  const minVal  = allVals.length ? Math.min(...allVals) : null;
  const maxVal  = allVals.length ? Math.max(...allVals) : null;
  const avgVal  = allVals.length ? allVals.reduce((a, b) => a + b, 0) / allVals.length : null;
  const lastUpdated = vitalsRaw.length
    ? fmtDate(vitalsRaw[vitalsRaw.length-1].completedAt || vitalsRaw[vitalsRaw.length-1].scheduledAt, 'long')
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Back button (nurse only) */}
      {nurseMode && onBack && (
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: C.textSub, fontSize: 13, fontWeight: 600, fontFamily: F,
          padding: '4px 0', alignSelf: 'flex-start',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {lang==='sq' ? 'Të gjithë pacientët' : 'All patients'}
        </button>
      )}

      {/* Header card */}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
        padding: '18px 20px', boxShadow: C.shadow,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.text, letterSpacing: '-0.4px' }}>
              {lang==='sq' ? 'Progresi Shëndetësor' : 'Health Progress'}
            </div>
            {relative?.name && (
              <div style={{ fontSize: 12, fontWeight: 600, color: C.blue,
                background: C.blueLight, border: `1px solid ${C.blueMid}`,
                borderRadius: 99, padding: '2px 10px' }}>
                {relative.name}
              </div>
            )}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted }}>
            {lang==='sq' ? 'Gjurmo shëndetin e pacientit me kalimin e kohës' : 'Track patient health metrics over time'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.green }}>
              {lang==='sq' ? 'Të dhëna reale' : 'Real patient data'}
            </span>
          </div>
          {lastUpdated && (
            <div style={{ fontSize: 11, color: C.textMuted }}>
              {lang==='sq' ? 'Përditësuar' : 'Last updated'}: {lastUpdated}
            </div>
          )}
        </div>
      </div>

      {/* No vitals for this patient */}
      {vitalsRaw.length === 0 && (
        <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
          padding: '48px 32px', textAlign: 'center', boxShadow: C.shadow }}>
          <div style={{ width: 52, height: 52, borderRadius: 16,
            background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.blue}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>
            {lang==='sq' ? 'Nuk ka të dhëna vitale për këtë pacient' : `No vitals recorded for ${relative?.name || 'this patient'}`}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, maxWidth: 320, margin: '0 auto', lineHeight: 1.75 }}>
            {lang==='sq'
              ? 'Shenjat vitale do të shfaqen pasi infermierja të kompletojë vizitën dhe të regjistrojë të dhënat.'
              : 'Vitals will appear after a completed visit where health data is recorded.'}
          </div>
        </div>
      )}

      {vitalsRaw.length > 0 && (
        <>
          {/* Metric tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {METRICS.map(m => {
              const isActive = activeMetric === m.id;
              const pts = buildPoints(m.id);
              return (
                <button key={m.id} onClick={() => setActiveMetric(m.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 16px', borderRadius: 99, fontFamily: F, cursor: 'pointer',
                    fontSize: 12, fontWeight: isActive ? 700 : 500,
                    background: isActive ? C.blue : C.white,
                    color:      isActive ? '#fff'  : C.textSub,
                    border:     isActive ? `1.5px solid ${C.blue}` : `1.5px solid ${C.border}`,
                    boxShadow:  isActive ? `0 3px 10px ${C.blue}33` : 'none',
                    opacity: pts.length === 0 ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}>
                  <span style={{ opacity: isActive ? 1 : 0.6 }}>{m.icon}</span>
                  <span>{lang==='sq' ? m.labelSq : m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Latest reading */}
          {latest && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
              padding: '20px 22px', boxShadow: C.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted,
                  textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {lang==='sq' ? 'Matja e Fundit' : 'Latest Reading'}
                </div>
                {status && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99,
                    background: status.bg, color: status.color, border: `1px solid ${status.color}30` }}>
                    {lang==='sq' ? status.labelSq : status.label}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                <div style={{ fontSize: 44, fontWeight: 900, color: metric.color, letterSpacing: '-2px', lineHeight: 1 }}>
                  {activeMetric === 'bp' ? `${latest.value}/${latest.value2 ?? '—'}` : latest.value}
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>{metric.unit}</div>
                  {trend !== null && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 3, marginTop: 2,
                      fontSize: 12, fontWeight: 700,
                      color: Math.abs(trend) < 1 ? C.textMuted
                           : trend > 0 ? (activeMetric === 'oxygen' ? C.green : C.red)
                                       : (activeMetric === 'oxygen' ? C.red   : C.green),
                    }}>
                      {Math.abs(trend) < 1 ? '→ Stable' : `${trend > 0 ? '↑' : '↓'} ${Math.abs(trend).toFixed(1)}`}
                      <span style={{ fontSize: 10, fontWeight: 400, color: C.textMuted }}>vs prev</span>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, borderTop: `1px solid ${C.borderFaint}`, paddingTop: 10 }}>
                <span style={{ fontWeight: 600, color: C.textSub }}>{fmtDate(latest.date, 'long')}</span>
                {latest.nurse && (
                  <span> · {lang==='sq'?'nga':'by'} <span style={{ fontWeight: 600, color: C.textSub }}>{latest.nurse}</span></span>
                )}
              </div>
            </div>
          )}

          {/* Insight */}
          {insight && (
            <div style={{
              background: status?.bg || C.bg, borderRadius: 10,
              border: `1px solid ${status?.color || C.blue}22`,
              borderLeft: `3px solid ${status?.color || C.blue}`,
              padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={status?.color || C.blue} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 13, color: C.textSub, fontWeight: 500, lineHeight: 1.5 }}>{insight}</span>
            </div>
          )}

          {/* Chart */}
          <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
            padding: '20px 20px 12px', boxShadow: C.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                {lang==='sq' ? metric.labelSq : metric.label}{' '}
                <span style={{ fontWeight: 400, color: C.textMuted }}>
                  {lang==='sq' ? 'me kalimin e kohës' : 'over time'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: C.textMuted }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ display: 'inline-block', width: 24, height: 8,
                    background: `${metric.color}0D`,
                    border: `1px dashed ${metric.color}55`, borderRadius: 2 }}/>
                  {lang==='sq' ? 'Vlera normale' : 'Normal range'}
                </span>
                {activeMetric === 'bp' && (
                  <>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ display: 'inline-block', width: 16, height: 2.5,
                        background: metric.color, borderRadius: 1 }}/> Systolic
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ display: 'inline-block', width: 16, height: 2,
                        background: '#93C5FD', borderRadius: 1 }}/> Diastolic
                    </span>
                  </>
                )}
              </div>
            </div>
            <VitalsChart points={points} metric={metric} lang={lang}/>
          </div>

          {/* Summary stats */}
          {allVals.length >= 2 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <MiniStat label="Min" value={minVal} unit={metric.unit} color={C.blue}/>
              <MiniStat
                label={lang==='sq'?'Mesatare':'Average'}
                value={avgVal != null ? (metric.id==='temp' ? avgVal.toFixed(1) : Math.round(avgVal)) : null}
                unit={metric.unit} color={C.textSub}/>
              <MiniStat label="Max" value={maxVal} unit={metric.unit} color={C.red}/>
              <MiniStat label={lang==='sq'?'Matje':'Readings'} value={allVals.length} color={C.text}/>
            </div>
          )}

          {/* History table */}
          {points.length > 0 && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`,
              overflow: 'hidden', boxShadow: C.shadow }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                  {lang==='sq' ? 'Historiku i Matjeve' : 'Readings History'}
                </div>
                <span style={{ fontSize: 11, color: C.textMuted }}>
                  {points.length} {lang==='sq' ? 'matje' : 'readings'}
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: C.bg }}>
                      {[lang==='sq'?'Data':'Date', lang==='sq'?'Vlera':'Value',
                        lang==='sq'?'Statusi':'Status', lang==='sq'?'Infermierja':'Nurse',
                        lang==='sq'?'Shërbimi':'Service'].map(h => (
                        <th key={h} style={{ padding: '9px 16px', textAlign: 'left',
                          fontSize: 10, fontWeight: 700, color: C.textMuted,
                          textTransform: 'uppercase', letterSpacing: '0.5px',
                          borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...points].reverse().map((p, i) => {
                      const st = getStatus(metric, p.value);
                      const origVisit = vitalsRaw.find(v =>
                        (v.completedAt || v.scheduledAt) === p.date);
                      return (
                        <HistoryRow key={i} p={p} metric={metric} st={st}
                          origVisit={origVisit} activeMetric={activeMetric} lang={lang}/>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PUBLIC EXPORT — routes nurse vs client views
   ═══════════════════════════════════════════════════════════ */
export default function HealthProgress({ visits = [], relative, lang = 'en', nurseMode = false }) {

  /* ── CLIENT MODE: pass straight through ── */
  if (!nurseMode) {
    return <HealthAnalytics visits={visits} relative={relative} lang={lang} nurseMode={false}/>;
  }

  /* ── NURSE MODE: patient-selector layer ── */
  return <NurseHealthProgress visits={visits} lang={lang}/>;
}

function NurseHealthProgress({ visits, lang }) {
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const patients = buildPatientGroups(visits);

  /* Drill into a patient */
  if (selectedPatientId) {
    const patient      = patients.find(p => p.id === selectedPatientId);
    const patientVisits = visits.filter(v =>
      (v.relativeId || v.relative?.id) === selectedPatientId
    );
    return (
      <HealthAnalytics
        visits={patientVisits}
        relative={patient}
        lang={lang}
        nurseMode={true}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  /* Patient list */
  return (
    <NursePatientSelector
      patients={patients}
      onSelect={setSelectedPatientId}
      lang={lang}
    />
  );
}
