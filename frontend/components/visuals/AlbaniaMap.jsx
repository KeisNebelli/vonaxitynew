'use client';
import { useState } from 'react';

const CITIES = [
  { name:'Tirana',   x:200, y:195, nurses:3, active:true },
  { name:'Durrës',   x:168, y:182, nurses:1, active:true },
  { name:'Elbasan',  x:228, y:215, nurses:1, active:true },
  { name:'Fier',     x:180, y:248, nurses:1, active:true },
  { name:'Shkodër',  x:175, y:118, nurses:1, active:true },
  { name:'Berat',    x:205, y:255, nurses:0, active:false },
  { name:'Vlorë',    x:168, y:272, nurses:0, active:false },
  { name:'Sarandë',  x:192, y:318, nurses:0, active:false },
  { name:'Kukës',    x:238, y:108, nurses:0, active:false },
  { name:'Gjirokastër', x:210, y:295, nurses:0, active:false },
];

export default function AlbaniaMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ background:'#F8FAFF', borderRadius:20, border:'1px solid #DBEAFE', padding:'24px 20px', display:'inline-block' }}>
      <svg width="300" height="380" viewBox="80 80 200 270" style={{ display:'block', overflow:'visible' }}>

        {/* Albania shape — accurate simplified outline */}
        <path
          d="M175 90 L182 86 L192 88 L200 96 L208 106 L214 118 L218 130 L220 144 L218 158 L222 168 L228 178 L230 192 L226 206 L222 220 L218 234 L212 246 L206 258 L200 270 L194 282 L188 295 L182 308 L176 320 L170 330 L163 336 L156 332 L150 320 L148 306 L150 292 L152 278 L155 265 L156 252 L154 238 L150 225 L147 212 L145 198 L144 184 L145 170 L148 156 L152 142 L158 128 L165 115 L171 102 Z"
          fill="#EFF6FF"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* City markers */}
        {CITIES.map(city => {
          const isHovered = hovered === city.name;
          return (
            <g
              key={city.name}
              onMouseEnter={() => setHovered(city.name)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              {city.active && (
                <circle cx={city.x} cy={city.y} r="9" fill="rgba(37,99,235,0.12)" />
              )}
              {/* Dot */}
              <circle
                cx={city.x} cy={city.y}
                r={city.active ? 5 : 3.5}
                fill={city.active ? '#2563EB' : '#94A3B8'}
                stroke="#fff"
                strokeWidth="2"
              />
              {/* Nurse count badge */}
              {city.active && city.nurses > 0 && (
                <g>
                  <circle cx={city.x + 9} cy={city.y - 9} r="7" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                  <text x={city.x + 9} y={city.y - 6} fontSize="7" fontFamily="Inter,system-ui" fontWeight="700" fill="#fff" textAnchor="middle">{city.nurses}</text>
                </g>
              )}
              {/* Label */}
              <text
                x={city.x + (city.x > 200 ? 11 : -11)}
                y={city.y + 4}
                fontSize="9.5"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight={city.active ? '600' : '400'}
                fill={city.active ? '#1E40AF' : '#94A3B8'}
                textAnchor={city.x > 200 ? 'start' : 'end'}
              >
                {city.name}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (() => {
          const city = CITIES.find(c => c.name === hovered);
          if (!city) return null;
          const tx = city.x > 200 ? city.x - 85 : city.x + 12;
          const ty = city.y - 36;
          return (
            <g>
              <rect x={tx} y={ty} width="80" height="28" rx="6" fill="#111827" />
              <text x={tx + 40} y={ty + 12} fontSize="10" fontFamily="Inter" fontWeight="600" fill="#fff" textAnchor="middle">{city.name}</text>
              <text x={tx + 40} y={ty + 23} fontSize="9" fontFamily="Inter" fill="#9CA3AF" textAnchor="middle">
                {city.active ? `${city.nurses} nurse${city.nurses !== 1 ? 's' : ''}` : 'Coming soon'}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Legend */}
      <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#2563EB', border:'1.5px solid #fff', boxShadow:'0 0 0 1.5px #2563EB' }} />
          <span style={{ fontSize:11, color:'#6B7280', fontFamily:'Inter,system-ui' }}>Active</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#059669', border:'1.5px solid #fff', boxShadow:'0 0 0 1.5px #059669' }} />
          <span style={{ fontSize:11, color:'#6B7280', fontFamily:'Inter,system-ui' }}>Nurses available</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#94A3B8' }} />
          <span style={{ fontSize:11, color:'#6B7280', fontFamily:'Inter,system-ui' }}>Coming soon</span>
        </div>
      </div>
    </div>
  );
}
