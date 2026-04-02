'use client';
import { useState } from 'react';

const CITIES = [
  { name:'Tirana', x:178, y:198, nurses:3, active:true },
  { name:'Durrës', x:148, y:188, nurses:1, active:true },
  { name:'Elbasan', x:205, y:218, nurses:1, active:true },
  { name:'Fier', x:162, y:252, nurses:1, active:true },
  { name:'Berat', x:185, y:248, nurses:0, active:false },
  { name:'Sarandë', x:175, y:318, nurses:0, active:false },
  { name:'Kukës', x:222, y:118, nurses:0, active:false },
  { name:'Shkodër', x:158, y:128, nurses:1, active:true },
  { name:'Vlorë', x:148, y:278, nurses:0, active:false },
  { name:'Gjirokastër', x:190, y:298, nurses:0, active:false },
];

export default function AlbaniaMap({ lang = 'en' }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <svg width="360" height="420" viewBox="0 0 360 420" style={{ display:'block' }}>
        {/* Albania outline - simplified path */}
        <path
          d="M158 80 L170 72 L185 74 L198 82 L210 95 L218 108 L225 118 L228 132 L230 148 L228 162 L232 172 L238 182 L240 195 L235 208 L232 222 L228 235 L222 248 L215 258 L210 270 L205 282 L200 295 L195 308 L188 320 L182 330 L175 338 L168 345 L160 348 L152 342 L145 332 L140 320 L138 308 L140 295 L142 282 L145 270 L148 258 L148 245 L145 232 L140 220 L138 208 L135 195 L132 182 L130 168 L128 155 L128 142 L130 128 L135 115 L142 102 L150 90 Z"
          fill="#EFF6FF"
          stroke="#BFDBFE"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* City dots */}
        {CITIES.map(city => (
          <g key={city.name} onMouseEnter={()=>setHovered(city.name)} onMouseLeave={()=>setHovered(null)} style={{ cursor:'pointer' }}>
            {/* Pulse ring for active cities */}
            {city.active && (
              <circle cx={city.x} cy={city.y} r="10" fill="rgba(37,99,235,0.1)" />
            )}
            <circle
              cx={city.x} cy={city.y} r={city.active ? 5 : 4}
              fill={city.active ? '#2563EB' : '#CBD5E1'}
              stroke="#fff"
              strokeWidth="2"
            />
            {/* City label */}
            <text
              x={city.x + (city.x > 190 ? 10 : -10)}
              y={city.y + 4}
              fontSize="10"
              fontFamily="Inter, system-ui, sans-serif"
              fontWeight={city.active ? '600' : '400'}
              fill={city.active ? '#1E40AF' : '#94A3B8'}
              textAnchor={city.x > 190 ? 'start' : 'end'}
            >
              {city.name}
            </text>
            {/* Nurse count badge for active */}
            {city.active && city.nurses > 0 && (
              <g>
                <circle cx={city.x + 8} cy={city.y - 8} r="7" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                <text x={city.x + 8} y={city.y - 5} fontSize="8" fontFamily="Inter" fontWeight="700" fill="#fff" textAnchor="middle">{city.nurses}</text>
              </g>
            )}
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(14, 360)">
          <circle cx="6" cy="6" r="5" fill="#2563EB" stroke="#fff" strokeWidth="1.5" />
          <text x="16" y="10" fontSize="10" fontFamily="Inter, system-ui" fill="#6B7280">Active city</text>
          <circle cx="6" cy="24" r="4" fill="#CBD5E1" stroke="#fff" strokeWidth="1.5" />
          <text x="16" y="28" fontSize="10" fontFamily="Inter, system-ui" fill="#6B7280">Expanding soon</text>
          <circle cx="6" cy="42" r="7" fill="#059669" stroke="#fff" strokeWidth="1.5" />
          <text x="6" y="45" fontSize="8" fontFamily="Inter" fontWeight="700" fill="#fff" textAnchor="middle">2</text>
          <text x="18" y="46" fontSize="10" fontFamily="Inter, system-ui" fill="#6B7280">Nurses available</text>
        </g>

        {/* Tooltip */}
        {hovered && (() => {
          const city = CITIES.find(c=>c.name===hovered);
          if (!city) return null;
          const tx = city.x > 200 ? city.x - 80 : city.x + 10;
          return (
            <g>
              <rect x={tx} y={city.y - 32} width="75" height="28" rx="6" fill="#111827" />
              <text x={tx + 38} y={city.y - 22} fontSize="11" fontFamily="Inter" fontWeight="600" fill="#fff" textAnchor="middle">{city.name}</text>
              <text x={tx + 38} y={city.y - 10} fontSize="9" fontFamily="Inter" fill="#9CA3AF" textAnchor="middle">
                {city.active ? `${city.nurses} nurse${city.nurses !== 1 ? 's' : ''}` : 'Coming soon'}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
