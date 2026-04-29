'use client';
import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

const C = {
  primary:'#2563EB', primaryLight:'#EFF6FF', secondary:'#059669', secondaryLight:'#ECFDF5',
  warning:'#D97706', warningLight:'#FFFBEB', error:'#DC2626', errorLight:'#FEF2F2',
  purple:'#7C3AED', purpleLight:'#F5F3FF',
  bg:'#F8FAFC', bgWhite:'#FFFFFF', bgSubtle:'#F1F5F9',
  textPrimary:'#0F172A', textSecondary:'#475569', textTertiary:'#94A3B8',
  border:'#E2E8F0', borderSubtle:'#F8FAFC',
};
const F = "'DM Sans','Inter',system-ui,sans-serif";

const METRICS = [
  { id:'bp',      label:'Blood Pressure', unit:'mmHg',   color:'#2563EB', bg:'#EFF6FF', normal:[90,120],  icon:'❤️' },
  { id:'glucose', label:'Glucose',        unit:'mmol/L', color:'#059669', bg:'#ECFDF5', normal:[3.9,5.6], icon:'🩸' },
  { id:'hr',      label:'Heart Rate',     unit:'bpm',    color:'#DC2626', bg:'#FEF2F2', normal:[60,100],  icon:'💓' },
  { id:'oxygen',  label:'Oxygen Sat',     unit:'%',      color:'#7C3AED', bg:'#F5F3FF', normal:[95,100],  icon:'🫁' },
  { id:'temp',    label:'Temperature',    unit:'°C',     color:'#D97706', bg:'#FFFBEB', normal:[36.1,37.2],icon:'🌡️' },
];

function fmtDate(d, short=false) {
  if (!d) return '—';
  const dt = new Date(d);
  return short
    ? dt.toLocaleDateString('en-GB', { day:'numeric', month:'short' })
    : dt.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

function getStatus(metric, value) {
  if (value == null) return null;
  const [lo, hi] = metric.normal;
  if (value < lo) return { label:'Low', color:'#2563EB', bg:'#EFF6FF' };
  if (value > hi) return { label:'High', color:'#DC2626', bg:'#FEF2F2' };
  return { label:'Normal', color:'#059669', bg:'#ECFDF5' };
}

// Pure-SVG responsive line chart — no external deps
function VitalsChart({ points, metric, lang }) {
  const [hovered, setHovered] = useState(null);
  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(600);

  useEffect(() => {
    const ob = new ResizeObserver(entries => { if (entries[0]) setSvgW(entries[0].contentRect.width); });
    if (svgRef.current) ob.observe(svgRef.current);
    return () => ob.disconnect();
  }, []);

  if (!points || points.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'48px 24px', color:C.textTertiary }}>
        <div style={{ fontSize:36, marginBottom:12 }}>📊</div>
        <div style={{ fontSize:14, fontWeight:600, color:C.textSecondary, marginBottom:4 }}>
          {lang==='sq' ? 'Nuk ka të dhëna akoma' : 'No readings yet'}
        </div>
        <div style={{ fontSize:13 }}>
          {lang==='sq' ? 'Të dhënat do të shfaqen pas vizitës së parë të kompletuar.' : 'Data will appear after the first completed visit with vitals recorded.'}
        </div>
      </div>
    );
  }

  const H = 200;
  const PAD = { top:24, right:16, bottom:44, left:46 };
  const W = svgW || 600;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  // For BP, use systolic as primary, diastolic as secondary
  const isBP = metric.id === 'bp';
  const values = isBP
    ? points.flatMap(p => [p.value, p.value2].filter(Boolean))
    : points.map(p => p.value).filter(Boolean);

  const [lo, hi] = metric.normal;
  const rawMin = Math.min(...values, lo);
  const rawMax = Math.max(...values, hi);
  const pad = (rawMax - rawMin) * 0.15 || 5;
  const minV = rawMin - pad;
  const maxV = rawMax + pad;

  const n = points.length;
  const toX = (i) => PAD.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const toY = (v) => PAD.top + plotH - ((v - minV) / (maxV - minV)) * plotH;

  const lineD = (pts, key='value') => pts
    .filter(p => p[key] != null)
    .map((p, i, arr) => {
      const origI = points.indexOf(p);
      return `${i === 0 ? 'M' : 'L'}${toX(origI)},${toY(p[key])}`;
    }).join(' ');

  const areaD = (pts, key='value') => {
    const valid = pts.filter(p => p[key] != null);
    if (!valid.length) return '';
    const first = points.indexOf(valid[0]);
    const last = points.indexOf(valid[valid.length - 1]);
    return `M${toX(first)},${PAD.top + plotH} ${valid.map(p => `L${toX(points.indexOf(p))},${toY(p[key])}`).join(' ')} L${toX(last)},${PAD.top + plotH} Z`;
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => minV + t * (maxV - minV));

  return (
    <div ref={svgRef} style={{ position:'relative', userSelect:'none' }}>
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow:'visible', display:'block' }}>
        <defs>
          <linearGradient id={`grad-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric.color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={metric.color} stopOpacity="0"/>
          </linearGradient>
          {isBP && (
            <linearGradient id={`grad-${metric.id}-2`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0"/>
            </linearGradient>
          )}
        </defs>

        {/* Normal range band */}
        <rect
          x={PAD.left} y={toY(Math.min(hi, maxV))}
          width={plotW} height={Math.max(0, toY(Math.max(lo, minV)) - toY(Math.min(hi, maxV)))}
          fill={metric.color} opacity={0.06} rx={2}
        />
        {/* Normal range labels */}
        <text x={W - PAD.right + 2} y={toY(hi)} fontSize={8} fill={metric.color} opacity={0.7} dominantBaseline="middle">↑{hi}</text>
        <text x={W - PAD.right + 2} y={toY(lo)} fontSize={8} fill={metric.color} opacity={0.7} dominantBaseline="middle">↓{lo}</text>

        {/* Grid lines */}
        {yTicks.map((v, i) => (
          <line key={i} x1={PAD.left} y1={toY(v)} x2={PAD.left + plotW} y2={toY(v)} stroke="#E2E8F0" strokeWidth={0.8} strokeDasharray={i === 0 || i === 4 ? '0' : '3,3'}/>
        ))}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + plotH} stroke="#E2E8F0" strokeWidth={0.8}/>

        {/* Area fills */}
        <path d={areaD(points)} fill={`url(#grad-${metric.id})`}/>
        {isBP && <path d={areaD(points, 'value2')} fill={`url(#grad-${metric.id}-2)`}/>}

        {/* Lines */}
        <path d={lineD(points)} fill="none" stroke={metric.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        {isBP && <path d={lineD(points, 'value2')} fill="none" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4,2"/>}

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i} style={{ cursor:'pointer' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Invisible larger hit area */}
            <circle cx={toX(i)} cy={toY(p.value)} r={12} fill="transparent"/>
            <circle cx={toX(i)} cy={toY(p.value)} r={hovered === i ? 6 : 4}
              fill={metric.color} stroke="white" strokeWidth={2}
              style={{ transition:'r 0.1s' }}/>
            {isBP && p.value2 != null && (
              <circle cx={toX(i)} cy={toY(p.value2)} r={hovered === i ? 5 : 3}
                fill="#60A5FA" stroke="white" strokeWidth={1.5}/>
            )}
          </g>
        ))}

        {/* Y-axis labels */}
        {yTicks.filter((_, i) => i % 2 === 0).map((v, i) => (
          <text key={i} x={PAD.left - 6} y={toY(v)} textAnchor="end" fontSize={9} fill={C.textTertiary} dominantBaseline="middle">
            {Number.isInteger(v) ? v : v.toFixed(1)}
          </text>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => {
          const step = Math.ceil(n / 5);
          if (n > 5 && i % step !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize={9} fill={C.textTertiary}>
              {fmtDate(p.date, true)}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered !== null && (() => {
        const p = points[hovered];
        const x = toX(hovered);
        const pct = (x - PAD.left) / plotW;
        const alignRight = pct > 0.65;
        return (
          <div style={{
            position:'absolute', top:0,
            left: alignRight ? undefined : `${(x / W) * 100}%`,
            right: alignRight ? `${((W - x) / W) * 100}%` : undefined,
            transform: alignRight ? 'none' : 'translateX(-50%)',
            background:'#0F172A', color:'#fff', borderRadius:10, padding:'8px 12px',
            fontSize:12, whiteSpace:'nowrap', zIndex:10, pointerEvents:'none',
            boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontWeight:800, fontSize:14, marginBottom:2 }}>
              {isBP ? `${p.value}/${p.value2} ${metric.unit}` : `${p.value} ${metric.unit}`}
            </div>
            <div style={{ opacity:0.7 }}>{fmtDate(p.date)}</div>
            {p.nurse && <div style={{ opacity:0.6, marginTop:2 }}>by {p.nurse}</div>}
          </div>
        );
      })()}
    </div>
  );
}

export default function HealthProgress({ visits = [], relative, lang = 'en', nurseMode = false }) {
  const [activeMetric, setActiveMetric] = useState('bp');
  const [loading, setLoading] = useState(false);

  const metric = METRICS.find(m => m.id === activeMetric);

  // Build vitals from completed visits — no extra API call needed
  const vitalsRaw = visits
    .filter(v => v.status === 'COMPLETED' && (v.bpSystolic || v.heartRate || v.glucose || v.oxygenSat || v.temperature))
    .sort((a, b) => new Date(a.completedAt || a.scheduledAt) - new Date(b.completedAt || b.scheduledAt));

  const buildPoints = (m) => vitalsRaw
    .map(v => {
      const date = v.completedAt || v.scheduledAt;
      const nurse = v.nurse?.user?.name || v.nurseName;
      switch (m) {
        case 'bp':      return v.bpSystolic ? { date, value: v.bpSystolic, value2: v.bpDiastolic, nurse } : null;
        case 'glucose': return v.glucose    ? { date, value: v.glucose,    nurse } : null;
        case 'hr':      return v.heartRate  ? { date, value: v.heartRate,  nurse } : null;
        case 'oxygen':  return v.oxygenSat  ? { date, value: v.oxygenSat,  nurse } : null;
        case 'temp':    return v.temperature? { date, value: v.temperature, nurse } : null;
        default: return null;
      }
    })
    .filter(Boolean);

  const points = buildPoints(activeMetric);
  const latest = points[points.length - 1];
  const prev   = points[points.length - 2];
  const trend  = latest && prev ? (latest.value - prev.value) : null;
  const status = latest ? getStatus(metric, latest.value) : null;

  const totalReadings = METRICS.reduce((acc, m) => acc + buildPoints(m.id).length, 0);

  if (vitalsRaw.length === 0) {
    return (
      <div style={{ fontFamily:F }}>
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1px solid ${C.border}`, padding:'56px 24px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ width:56, height:56, borderRadius:16, background:C.primaryLight, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24 }}>📈</div>
          <div style={{ fontSize:16, fontWeight:700, color:C.textPrimary, marginBottom:6 }}>
            {lang==='sq' ? 'Nuk ka të dhëna shëndetësore akoma' : 'No health data yet'}
          </div>
          <div style={{ fontSize:13, color:C.textTertiary, maxWidth:320, margin:'0 auto', lineHeight:1.7 }}>
            {lang==='sq'
              ? 'Të dhënat shëndetësore do të shfaqen pasi infermierja të kompletojë vizitën e parë dhe të regjistrojë shenjat vitale.'
              : 'Health data will appear after a nurse completes a visit and records vitals. Each visit builds the medical timeline.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:F, display:'flex', flexDirection:'column', gap:16 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:800, color:C.textPrimary, letterSpacing:'-0.3px' }}>
            {lang==='sq' ? 'Progresi Shëndetësor' : 'Health Progress'}
            {relative?.name && <span style={{ fontSize:14, fontWeight:500, color:C.textTertiary, marginLeft:8 }}>· {relative.name}</span>}
          </div>
          <div style={{ fontSize:12, color:C.textTertiary, marginTop:2 }}>
            {totalReadings} {lang==='sq' ? 'matje nga' : 'readings from'} {vitalsRaw.length} {lang==='sq' ? 'vizita' : 'completed visits'}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:C.textTertiary }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:C.secondary }}/>
          {lang==='sq' ? 'Të dhëna reale' : 'Real patient data'}
        </div>
      </div>

      {/* Metric tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {METRICS.map(m => {
          const pts = buildPoints(m.id);
          const isActive = activeMetric === m.id;
          return (
            <button key={m.id} onClick={() => setActiveMetric(m.id)}
              style={{
                display:'flex', alignItems:'center', gap:6,
                padding:'8px 14px', borderRadius:99, border:'none', cursor:'pointer', fontFamily:F,
                background: isActive ? m.color : C.bgWhite,
                color: isActive ? '#fff' : C.textSecondary,
                fontSize:12, fontWeight:isActive ? 700 : 500,
                boxShadow: isActive ? `0 4px 12px ${m.color}40` : `0 1px 3px rgba(0,0,0,0.06)`,
                border: isActive ? 'none' : `1px solid ${C.border}`,
                transition:'all 0.15s',
              }}>
              <span>{m.icon}</span>
              <span>{m.label}</span>
              {pts.length > 0 && (
                <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : m.bg, color: isActive ? '#fff' : m.color, borderRadius:99, padding:'1px 7px', fontSize:10, fontWeight:700 }}>
                  {pts.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Latest reading card */}
      {latest && (
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${C.border}`, padding:'18px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ width:52, height:52, borderRadius:14, background:metric.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
            {metric.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:4 }}>
              {lang==='sq' ? 'Matja e Fundit' : 'Latest Reading'}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
              <span style={{ fontSize:28, fontWeight:800, color:metric.color, letterSpacing:'-1px', lineHeight:1 }}>
                {activeMetric === 'bp' ? `${latest.value}/${latest.value2}` : latest.value}
              </span>
              <span style={{ fontSize:13, color:C.textTertiary, fontWeight:500 }}>{metric.unit}</span>
              {trend !== null && (
                <span style={{ fontSize:12, fontWeight:700, color: trend > 0 ? C.error : C.secondary, marginLeft:4, display:'flex', alignItems:'center', gap:2 }}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}
                </span>
              )}
            </div>
            <div style={{ fontSize:12, color:C.textTertiary, marginTop:3 }}>
              {fmtDate(latest.date)}
              {latest.nurse && ` · ${lang==='sq'?'nga':'by'} ${latest.nurse}`}
            </div>
          </div>
          {status && (
            <div style={{ flexShrink:0 }}>
              <span style={{ fontSize:12, fontWeight:700, padding:'5px 14px', borderRadius:99, background:status.bg, color:status.color, border:`1px solid ${status.color}22` }}>
                {lang==='sq' ? (status.label === 'Normal' ? 'Normal' : status.label === 'High' ? 'E lartë' : 'E ulët') : status.label}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Chart */}
      <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${C.border}`, padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>
            {metric.label} {lang==='sq' ? 'me kalimin e kohës' : 'over time'}
          </div>
          {activeMetric === 'bp' && (
            <div style={{ display:'flex', gap:12, fontSize:11, color:C.textTertiary }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ display:'inline-block', width:12, height:2, background:'#2563EB', borderRadius:1 }}/> Systolic</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ display:'inline-block', width:12, height:2, background:'#60A5FA', borderRadius:1, borderTop:'2px dashed #60A5FA' }}/> Diastolic</span>
            </div>
          )}
        </div>
        <VitalsChart points={points} metric={metric} lang={lang} />
      </div>

      {/* Readings history table */}
      {points.length > 0 && (
        <div style={{ background:C.bgWhite, borderRadius:16, border:`1.5px solid ${C.border}`, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>
              {lang==='sq' ? 'Historiku i Matjeve' : 'Readings History'}
            </div>
            <span style={{ fontSize:11, color:C.textTertiary }}>{points.length} {lang==='sq' ? 'matje' : 'readings'}</span>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:C.bg }}>
                  {['Date', 'Value', 'Status', 'Nurse', 'Service'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10, fontWeight:700, color:C.textTertiary, textTransform:'uppercase', letterSpacing:'0.5px', borderBottom:`1px solid ${C.border}`, whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...points].reverse().map((p, i) => {
                  const st = getStatus(metric, p.value);
                  const origVisit = vitalsRaw.find(v => (v.completedAt || v.scheduledAt) === p.date);
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.borderSubtle}` }}
                      onMouseEnter={e => e.currentTarget.style.background = C.bg}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding:'12px 16px', fontSize:13, color:C.textPrimary, fontWeight:500, whiteSpace:'nowrap' }}>{fmtDate(p.date)}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, fontWeight:700, color:metric.color, whiteSpace:'nowrap' }}>
                        {activeMetric === 'bp' ? `${p.value}/${p.value2}` : p.value} <span style={{ fontSize:11, fontWeight:400, color:C.textTertiary }}>{metric.unit}</span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        {st && <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99, background:st.bg, color:st.color }}>{st.label}</span>}
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:12, color:C.textSecondary }}>{p.nurse || '—'}</td>
                      <td style={{ padding:'12px 16px', fontSize:12, color:C.textTertiary, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {origVisit?.serviceType || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
