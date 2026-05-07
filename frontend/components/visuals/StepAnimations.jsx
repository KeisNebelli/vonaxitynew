'use client';

/* ─────────────────────────────────────────────────────────────────────────────
   StepAnimations — one looping illustration per "How it works" card
   Style: flat SVG shapes, soft palette, CSS keyframe loops (~3s cycle)
───────────────────────────────────────────────────────────────────────────── */

const BASE = {
  width: '100%',
  height: 140,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 14,
  overflow: 'hidden',
  position: 'relative',
  marginBottom: 16,
  flexShrink: 0,
};

/* ── 1. Woman booking on phone ───────────────────────────────────────────── */
export function AnimBooking() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#F0FDFB 0%,#F0FDFB 100%)' }}>
      <style>{`
        @keyframes anim-phone-tap {
          0%,60%,100% { transform:translateY(0); }
          75% { transform:translateY(-4px); }
        }
        @keyframes anim-plan-highlight {
          0%,30% { opacity:0; transform:scale(0.88); }
          50%,80% { opacity:1; transform:scale(1); }
          95%,100% { opacity:0; transform:scale(0.96); }
        }
        @keyframes anim-confirm-pulse {
          0%,40% { opacity:0; transform:scaleX(0.7); }
          55%,80% { opacity:1; transform:scaleX(1); }
          95%,100% { opacity:0; transform:scaleX(0.7); }
        }
        @keyframes anim-woman-sway {
          0%,100% { transform:rotate(-1.5deg); }
          50% { transform:rotate(1.5deg); }
        }
        @keyframes anim-plant-bob {
          0%,100% { transform:rotate(-2deg) translateY(0); }
          50% { transform:rotate(2deg) translateY(-3px); }
        }
        @keyframes anim-tap-ring {
          0%,55% { r:0; opacity:0; }
          60% { r:6; opacity:0.5; }
          78%,100% { r:11; opacity:0; }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* Decorative blob */}
        <ellipse cx="110" cy="78" rx="88" ry="42" fill="#CCFBF1" fillOpacity="0.45"/>

        {/* Plant left */}
        <g style={{ transformOrigin:'28px 100px', animation:'anim-plant-bob 3.2s ease-in-out infinite' }}>
          <rect x="26" y="88" width="4" height="18" rx="2" fill="#86EFAC"/>
          <ellipse cx="28" cy="86" rx="10" ry="8" fill="#4ADE80" fillOpacity="0.8"/>
          <ellipse cx="20" cy="90" rx="7" ry="5" fill="#86EFAC" fillOpacity="0.7" transform="rotate(-25 20 90)"/>
          <ellipse cx="36" cy="91" rx="7" ry="5" fill="#86EFAC" fillOpacity="0.7" transform="rotate(25 36 91)"/>
        </g>

        {/* Plant right */}
        <g style={{ transformOrigin:'193px 100px', animation:'anim-plant-bob 3.8s ease-in-out infinite 0.4s' }}>
          <rect x="191" y="88" width="4" height="18" rx="2" fill="#86EFAC"/>
          <ellipse cx="193" cy="86" rx="10" ry="8" fill="#4ADE80" fillOpacity="0.8"/>
          <ellipse cx="185" cy="90" rx="7" ry="5" fill="#86EFAC" fillOpacity="0.7" transform="rotate(-25 185 90)"/>
        </g>

        {/* Woman body */}
        <g style={{ transformOrigin:'82px 80px', animation:'anim-woman-sway 3s ease-in-out infinite' }}>
          {/* Head */}
          <circle cx="82" cy="40" r="13" fill="#FBBF24"/>
          {/* Hair */}
          <path d="M70 40 Q68 28 82 26 Q96 28 94 40" fill="#1E293B"/>
          <path d="M70 40 Q66 52 72 56 Q68 44 70 40Z" fill="#1E293B"/>
          {/* Body / top */}
          <rect x="68" y="54" width="28" height="28" rx="8" fill="#0D9488"/>
          {/* Left arm holding phone */}
          <path d="M68 60 Q56 64 58 76" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Right arm */}
          <path d="M96 60 Q104 64 103 72" stroke="#FBBF24" strokeWidth="7" strokeLinecap="round" fill="none"/>
          {/* Legs */}
          <rect x="72" y="80" width="10" height="22" rx="4" fill="#0D9488"/>
          <rect x="84" y="80" width="10" height="22" rx="4" fill="#0D9488"/>
        </g>

        {/* Phone */}
        <g style={{ animation:'anim-phone-tap 3s ease-in-out infinite' }}>
          <rect x="52" y="62" width="28" height="44" rx="5" fill="#1E293B"/>
          <rect x="55" y="65" width="22" height="38" rx="3" fill="#F8FAFF"/>
          {/* Plan cards on phone */}
          <rect x="57" y="68" width="8" height="10" rx="2" fill="#E5E7EB"/>
          <rect x="67" y="68" width="8" height="10" rx="2" fill="#F0FDFB" stroke="#0D9488" strokeWidth="0.8"/>
          {/* Highlighted plan */}
          <g style={{ transformOrigin:'71px 73px', animation:'anim-plan-highlight 3s ease-in-out infinite' }}>
            <rect x="66.5" y="67.5" width="9" height="11" rx="2.5" fill="#0D9488" fillOpacity="0.12" stroke="#0D9488" strokeWidth="1.2"/>
            <circle cx="71" cy="70" r="1.5" fill="#0D9488"/>
            <line x1="68.5" y1="73" x2="73.5" y2="73" stroke="#0D9488" strokeWidth="0.8" strokeLinecap="round"/>
          </g>
          {/* Confirm button */}
          <g style={{ animation:'anim-confirm-pulse 3s ease-in-out infinite' }}>
            <rect x="57" y="82" width="22" height="7" rx="3" fill="#0D9488"/>
            <line x1="61" y1="85.5" x2="75" y2="85.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </g>
          {/* Tap ring */}
          <circle cx="71" cy="73" style={{ animation:'anim-tap-ring 3s ease-in-out infinite' }} stroke="#0D9488" strokeWidth="1.2" fill="none"/>
        </g>
      </svg>
    </div>
  );
}

/* ── 2. System searching / matching nurse ────────────────────────────────── */
export function AnimMatching() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#F0F9FF 0%,#E0F2FE 100%)' }}>
      <style>{`
        @keyframes anim-ring1 {
          0%,100% { opacity:0.15; r:22; }
          50% { opacity:0.35; r:28; }
        }
        @keyframes anim-ring2 {
          0%,100% { opacity:0.1; r:34; }
          50% { opacity:0.22; r:40; }
        }
        @keyframes anim-dot-orbit {
          from { transform:rotate(0deg) translateX(38px) rotate(0deg); }
          to   { transform:rotate(360deg) translateX(38px) rotate(-360deg); }
        }
        @keyframes anim-dot-orbit-2 {
          from { transform:rotate(120deg) translateX(38px) rotate(-120deg); }
          to   { transform:rotate(480deg) translateX(38px) rotate(-480deg); }
        }
        @keyframes anim-dot-orbit-3 {
          from { transform:rotate(240deg) translateX(38px) rotate(-240deg); }
          to   { transform:rotate(600deg) translateX(38px) rotate(-600deg); }
        }
        @keyframes anim-search-spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes anim-connecting-line {
          0%,30% { strokeDashoffset:40; opacity:0; }
          55%,75% { strokeDashoffset:0; opacity:0.6; }
          90%,100% { strokeDashoffset:-40; opacity:0; }
        }
        @keyframes anim-match-pop {
          0%,70% { opacity:0; transform:scale(0.5); }
          80% { opacity:1; transform:scale(1.15); }
          90%,100% { opacity:1; transform:scale(1); }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none">
        {/* Pulse rings */}
        <circle cx="110" cy="62" style={{ animation:'anim-ring1 2.4s ease-in-out infinite' }} fill="#0EA5E9" fillOpacity="0"/>
        <circle cx="110" cy="62" r="22" fill="#BAE6FD" fillOpacity="0.3"/>
        <circle cx="110" cy="62" style={{ animation:'anim-ring2 2.4s ease-in-out infinite 0.4s' }} fill="#0EA5E9" fillOpacity="0"/>
        <circle cx="110" cy="62" r="34" stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3 4"/>

        {/* Center search icon */}
        <circle cx="110" cy="62" r="18" fill="white" filter="url(#sh1)"/>
        <g style={{ transformOrigin:'110px 62px', animation:'anim-search-spin 2.8s linear infinite' }}>
          <circle cx="110" cy="62" r="16" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="50 52" strokeLinecap="round" fill="none"/>
        </g>
        <circle cx="108" cy="60" r="5" stroke="#0369A1" strokeWidth="1.8" fill="none"/>
        <line x1="112" y1="64" x2="115" y2="67" stroke="#0369A1" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Orbiting nurse profiles */}
        <g style={{ transformOrigin:'110px 62px', animation:'anim-dot-orbit 4.2s linear infinite' }}>
          <circle cx="0" cy="0" r="12" fill="white" stroke="#BAE6FD" strokeWidth="1.5"/>
          <circle cx="0" cy="-2" r="4" fill="#7DD3FC"/>
          <rect x="-5" y="3" width="10" height="6" rx="3" fill="#7DD3FC"/>
          <line x1="-6" y1="9" x2="6" y2="9" stroke="#0EA5E9" strokeWidth="1" strokeDasharray="3 2"/>
        </g>

        <g style={{ transformOrigin:'110px 62px', animation:'anim-dot-orbit-2 4.2s linear infinite' }}>
          <circle cx="0" cy="0" r="12" fill="white" stroke="#BAE6FD" strokeWidth="1.5"/>
          <circle cx="0" cy="-2" r="4" fill="#A5B4FC"/>
          <rect x="-5" y="3" width="10" height="6" rx="3" fill="#A5B4FC"/>
          <line x1="-6" y1="9" x2="6" y2="9" stroke="#1E6FAB" strokeWidth="1" strokeDasharray="3 2"/>
        </g>

        <g style={{ transformOrigin:'110px 62px', animation:'anim-dot-orbit-3 4.2s linear infinite' }}>
          <circle cx="0" cy="0" r="12" fill="white" stroke="#BAE6FD" strokeWidth="1.5"/>
          <circle cx="0" cy="-2" r="4" fill="#86EFAC"/>
          <rect x="-5" y="3" width="10" height="6" rx="3" fill="#86EFAC"/>
          <line x1="-6" y1="9" x2="6" y2="9" stroke="#0D9488" strokeWidth="1" strokeDasharray="3 2"/>
        </g>

        {/* Match badge pop */}
        <g style={{ transformOrigin:'140px 38px', animation:'anim-match-pop 4.2s ease-out infinite' }}>
          <rect x="128" y="28" width="36" height="18" rx="9" fill="#0D9488"/>
          <text x="146" y="40" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">MATCHED!</text>
        </g>

        <defs>
          <filter id="sh1" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0EA5E9" floodOpacity="0.18"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/* ── 3. Choosing nurse profile ───────────────────────────────────────────── */
export function AnimChooseNurse() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)' }}>
      <style>{`
        @keyframes anim-card-a-slide {
          0%,15% { transform:translateX(-10px); opacity:0; }
          30%,70% { transform:translateX(0); opacity:1; }
          85%,100% { transform:translateX(-8px); opacity:0; }
        }
        @keyframes anim-card-b-slide {
          0%,25% { transform:translateX(10px); opacity:0; }
          40%,70% { transform:translateX(0); opacity:1; }
          85%,100% { transform:translateX(8px); opacity:0; }
        }
        @keyframes anim-star-fill {
          0%,35% { fill:#E5E7EB; }
          55%,75% { fill:#F59E0B; }
          90%,100% { fill:#E5E7EB; }
        }
        @keyframes anim-select-badge {
          0%,60% { opacity:0; transform:scale(0.7) translateY(-4px); }
          72% { opacity:1; transform:scale(1.05) translateY(0); }
          80%,100% { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes anim-check-draw {
          0%,60% { strokeDashoffset:16; }
          80%,100% { strokeDashoffset:0; }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none">
        {/* Card A */}
        <g style={{ animation:'anim-card-a-slide 3.6s ease-in-out infinite' }}>
          <rect x="14" y="26" width="88" height="72" rx="10" fill="white" stroke="#BFDBFE" strokeWidth="1.2"/>
          {/* Avatar */}
          <circle cx="42" cy="50" r="14" fill="#DBEAFE"/>
          <circle cx="42" cy="46" r="6" fill="#93C5FD"/>
          <path d="M30 62 Q30 56 42 56 Q54 56 54 62" fill="#93C5FD"/>
          {/* Name */}
          <rect x="60" y="42" width="30" height="5" rx="2.5" fill="#BFDBFE"/>
          <rect x="60" y="51" width="22" height="4" rx="2" fill="#DBEAFE"/>
          {/* Stars */}
          {[0,1,2,3,4].map(i => (
            <polygon key={i}
              points="0,-4 1,-1.2 4,-1.2 2,0.8 2.8,3.5 0,2 -2.8,3.5 -2,0.8 -4,-1.2 -1,-1.2"
              transform={`translate(${60 + i*7},68)`}
              style={{ animation:`anim-star-fill 3.6s ease-in-out infinite ${i*0.08}s` }}
            />
          ))}
          {/* Verified */}
          <rect x="14" y="84" width="88" height="12" rx="5" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="0.8"/>
          <text x="58" y="93" textAnchor="middle" fontSize="7" fontWeight="600" fill="#2563EB" fontFamily="Inter,sans-serif">View profile</text>
        </g>

        {/* Card B — recommended */}
        <g style={{ animation:'anim-card-b-slide 3.6s ease-in-out infinite' }}>
          <rect x="118" y="26" width="88" height="72" rx="10" fill="white" stroke="#6EE7B7" strokeWidth="1.5"/>
          {/* Recommended badge */}
          <g style={{ transformOrigin:'162px 28px', animation:'anim-select-badge 3.6s ease-in-out infinite' }}>
            <rect x="138" y="18" width="48" height="14" rx="7" fill="#0D9488"/>
            <text x="162" y="28" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">RECOMMENDED</text>
          </g>
          {/* Avatar */}
          <circle cx="146" cy="50" r="14" fill="#F0FDFB"/>
          <circle cx="146" cy="46" r="6" fill="#6EE7B7"/>
          <path d="M134 62 Q134 56 146 56 Q158 56 158 62" fill="#6EE7B7"/>
          {/* Name */}
          <rect x="164" y="42" width="30" height="5" rx="2.5" fill="#BBF7D0"/>
          <rect x="164" y="51" width="22" height="4" rx="2" fill="#DCFCE7"/>
          {/* Stars — all gold */}
          {[0,1,2,3,4].map(i => (
            <polygon key={i}
              points="0,-4 1,-1.2 4,-1.2 2,0.8 2.8,3.5 0,2 -2.8,3.5 -2,0.8 -4,-1.2 -1,-1.2"
              transform={`translate(${164 + i*7},68)`}
              fill="#F59E0B"
            />
          ))}
          {/* Select button */}
          <rect x="118" y="84" width="88" height="12" rx="5" fill="#0D9488"/>
          <g style={{ strokeDasharray:16, animation:'anim-check-draw 3.6s ease-in-out infinite' }}>
            <polyline points="148,89 153,93 163,85" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </g>
          <text x="172" y="93" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">Select →</text>
        </g>
      </svg>
    </div>
  );
}

/* ── 4. Confirmation — checkmark + Elona Hoxha ───────────────────────────── */
export function AnimConfirmed() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#F0FDFB 0%,#D1FAE5 100%)' }}>
      <style>{`
        @keyframes anim-circle-fill {
          0%,20% { r:0; opacity:0; }
          45% { r:28; opacity:1; }
          100% { r:28; opacity:1; }
        }
        @keyframes anim-check-in {
          0%,30% { strokeDashoffset:54; opacity:0; }
          60%,100% { strokeDashoffset:0; opacity:1; }
        }
        @keyframes anim-name-appear {
          0%,50% { opacity:0; transform:translateY(6px); }
          68%,100% { opacity:1; transform:translateY(0); }
        }
        @keyframes anim-sms-slide {
          0%,55% { opacity:0; transform:translateX(18px) translateY(-4px); }
          70%,88% { opacity:1; transform:translateX(0) translateY(0); }
          96%,100% { opacity:0; transform:translateX(-4px); }
        }
        @keyframes anim-email-slide {
          0%,62% { opacity:0; transform:translateX(18px) translateY(4px); }
          76%,88% { opacity:1; transform:translateX(0) translateY(0); }
          96%,100% { opacity:0; transform:translateX(-4px); }
        }
        @keyframes anim-confetti-1 {
          0%,40% { opacity:0; transform:translate(0,0) rotate(0deg); }
          50% { opacity:1; transform:translate(-12px,-14px) rotate(30deg); }
          70%,100% { opacity:0; transform:translate(-16px,-22px) rotate(60deg); }
        }
        @keyframes anim-confetti-2 {
          0%,45% { opacity:0; transform:translate(0,0) rotate(0deg); }
          55% { opacity:1; transform:translate(14px,-12px) rotate(-25deg); }
          72%,100% { opacity:0; transform:translate(18px,-20px) rotate(-50deg); }
        }
        @keyframes anim-confetti-3 {
          0%,42% { opacity:0; transform:translate(0,0) rotate(0deg); }
          52% { opacity:1; transform:translate(8px,-16px) rotate(45deg); }
          68%,100% { opacity:0; transform:translate(10px,-24px) rotate(90deg); }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none">
        {/* Soft glow */}
        <circle cx="90" cy="58" r="44" fill="#6EE7B7" fillOpacity="0.18"/>

        {/* Animated green circle */}
        <circle cx="90" cy="58" style={{ animation:'anim-circle-fill 3s ease-out infinite' }} fill="#0D9488"/>
        <circle cx="90" cy="58" r="28" fill="#0D9488"/>

        {/* Checkmark */}
        <polyline
          points="77,58 86,67 103,47"
          stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
          strokeDasharray="54"
          style={{ animation:'anim-check-in 3s ease-in-out infinite' }}
        />

        {/* Nurse name + avatar */}
        <g style={{ animation:'anim-name-appear 3s ease-out infinite' }}>
          <circle cx="90" cy="102" r="10" fill="#D1FAE5" stroke="#6EE7B7" strokeWidth="1.2"/>
          <circle cx="90" cy="99" r="4" fill="#6EE7B7"/>
          <path d="M83 108 Q83 104 90 104 Q97 104 97 108" fill="#6EE7B7"/>
          <text x="104" y="105" fontSize="9" fontWeight="700" fill="#0F766E" fontFamily="Inter,sans-serif">Elona Hoxha</text>
          <text x="104" y="113" fontSize="7.5" fill="#0D9488" fontFamily="Inter,sans-serif">General Nursing · Confirmed</text>
        </g>

        {/* SMS notification */}
        <g style={{ animation:'anim-sms-slide 3s ease-out infinite' }}>
          <rect x="132" y="36" width="70" height="22" rx="8" fill="white" stroke="#6EE7B7" strokeWidth="1"/>
          <rect x="138" y="42" width="8" height="8" rx="2" fill="#0D9488"/>
          <text x="149" y="47" fontSize="7.5" fontWeight="600" fill="#0F766E" fontFamily="Inter,sans-serif">SMS sent ✓</text>
          <text x="149" y="55" fontSize="6.5" fill="#6B7280" fontFamily="Inter,sans-serif">Your nurse is confirmed</text>
        </g>

        {/* Email notification */}
        <g style={{ animation:'anim-email-slide 3s ease-out infinite' }}>
          <rect x="132" y="64" width="70" height="22" rx="8" fill="white" stroke="#BFDBFE" strokeWidth="1"/>
          <rect x="138" y="70" width="8" height="8" rx="2" fill="#2563EB"/>
          <text x="149" y="75" fontSize="7.5" fontWeight="600" fill="#1E3A8A" fontFamily="Inter,sans-serif">Email sent ✓</text>
          <text x="149" y="83" fontSize="6.5" fill="#6B7280" fontFamily="Inter,sans-serif">Details + calendar invite</text>
        </g>

        {/* Confetti */}
        <rect x="88" y="56" width="5" height="5" rx="1" fill="#FCD34D" style={{ transformOrigin:'90px 58px', animation:'anim-confetti-1 3s ease-out infinite' }}/>
        <rect x="88" y="56" width="5" height="5" rx="1" fill="#F9A8D4" style={{ transformOrigin:'90px 58px', animation:'anim-confetti-2 3s ease-out infinite 0.05s' }}/>
        <circle cx="90" cy="58" r="2.5" fill="#6EE7B7" style={{ animation:'anim-confetti-3 3s ease-out infinite 0.1s' }}/>
      </svg>
    </div>
  );
}

/* ── 5. Tracking nurse arrival — map UI ─────────────────────────────────── */
export function AnimTracking() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#FFFBEB 0%,#FEF3C7 100%)' }}>
      <style>{`
        @keyframes anim-route-draw {
          0%,10% { strokeDashoffset:120; }
          65%,100% { strokeDashoffset:0; }
        }
        @keyframes anim-nurse-move {
          0%,10% { offset-distance:0%; opacity:0; }
          15% { opacity:1; }
          65%,100% { offset-distance:100%; opacity:1; }
        }
        @keyframes anim-pin-bounce {
          0%,60%,100% { transform:translateY(0) scale(1); }
          70% { transform:translateY(-8px) scale(1.1); }
          80% { transform:translateY(-2px) scale(1); }
          88% { transform:translateY(-4px) scale(1.05); }
          94% { transform:translateY(0) scale(1); }
        }
        @keyframes anim-live-pulse {
          0%,100% { opacity:1; r:4; }
          50% { opacity:0.5; r:6; }
        }
        @keyframes anim-eta-pop {
          0%,58% { opacity:0; transform:scale(0.8) translateY(4px); }
          68%,90% { opacity:1; transform:scale(1) translateY(0); }
          98%,100% { opacity:0; transform:scale(0.8); }
        }
        @keyframes anim-map-grid-fade {
          0%,100% { opacity:0.07; }
          50% { opacity:0.12; }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none">
        {/* Map background */}
        <rect x="10" y="10" width="200" height="104" rx="12" fill="#FEF9C3"/>
        {/* Map grid */}
        <g style={{ animation:'anim-map-grid-fade 3s ease-in-out infinite' }}>
          {[30,50,70,90,110].map(y => <line key={y} x1="10" y1={y} x2="210" y2={y} stroke="#D97706" strokeWidth="0.7"/>)}
          {[40,80,120,160,200].map(x => <line key={x} x1={x} y1="10" x2={x} y2="114" stroke="#D97706" strokeWidth="0.7"/>)}
        </g>
        {/* Roads */}
        <path d="M40 80 Q70 60 110 62 Q150 64 175 50" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M40 80 Q70 60 110 62 Q150 64 175 50" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" fill="none"/>
        <path d="M60 110 Q80 90 110 85 Q140 80 160 90" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" fill="none"/>

        {/* Route path */}
        <path
          id="nurse-route"
          d="M52 88 Q80 70 110 66 Q144 62 168 54"
          stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="120"
          fill="none"
          style={{ animation:'anim-route-draw 3s ease-in-out infinite' }}
        />

        {/* Home destination */}
        <g style={{ transformOrigin:'172px 46px', animation:'anim-pin-bounce 3s ease-in-out infinite' }}>
          <circle cx="172" cy="46" r="12" fill="#0D9488"/>
          <path d="M165 46 L172 38 L179 46 L179 54 L165 54 Z" fill="white"/>
          <rect x="168" y="47" width="8" height="7" fill="#0D9488"/>
        </g>

        {/* Nurse pin */}
        <g style={{ offsetPath:'path("M52 88 Q80 70 110 66 Q144 62 168 54")', offsetRotate:'auto', animation:'anim-nurse-move 3s ease-in-out infinite' }}>
          <circle cx="0" cy="0" r="10" fill="#F59E0B"/>
          <circle cx="0" cy="-2" r="4" fill="white"/>
          <path d="M-5 5 Q-5 1 0 1 Q5 1 5 5" fill="white"/>
        </g>

        {/* Start point */}
        <circle cx="52" cy="88" r="5" fill="#0D9488"/>
        <circle cx="52" cy="88" style={{ animation:'anim-live-pulse 1.5s ease-in-out infinite' }} stroke="#0D9488" strokeWidth="1.5" fill="none"/>

        {/* ETA badge */}
        <g style={{ transformOrigin:'80px 18px', animation:'anim-eta-pop 3s ease-in-out infinite' }}>
          <rect x="48" y="10" width="66" height="18" rx="9" fill="#D97706"/>
          <text x="81" y="22" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">🏠 Arriving soon…</text>
        </g>
      </svg>
    </div>
  );
}

/* ── 6. Health report delivered ─────────────────────────────────────────── */
export function AnimReport() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(135deg,#F0FDFB 0%,#F0FDFB 100%)' }}>
      <style>{`
        @keyframes anim-report-rise {
          0%,15% { transform:translateY(12px); opacity:0; }
          35%,85% { transform:translateY(0); opacity:1; }
          95%,100% { transform:translateY(-4px); opacity:0; }
        }
        @keyframes anim-vital-count-bp {
          0%,30% { opacity:0; }
          45%,85% { opacity:1; }
          95%,100% { opacity:0; }
        }
        @keyframes anim-bar-grow-1 {
          0%,30% { width:0; }
          55%,85% { width:42px; }
          95%,100% { width:0; }
        }
        @keyframes anim-bar-grow-2 {
          0%,36% { width:0; }
          60%,85% { width:34px; }
          95%,100% { width:0; }
        }
        @keyframes anim-bar-grow-3 {
          0%,42% { width:0; }
          65%,85% { width:38px; }
          95%,100% { width:0; }
        }
        @keyframes anim-envelope-fly {
          0%,70% { transform:translate(60px, -10px) rotate(8deg); opacity:0; }
          80% { transform:translate(20px, -4px) rotate(3deg); opacity:1; }
          88%,100% { transform:translate(0,0) rotate(0deg); opacity:1; }
        }
        @keyframes anim-check-small {
          0%,80% { strokeDashoffset:12; opacity:0; }
          92%,100% { strokeDashoffset:0; opacity:1; }
        }
        @keyframes anim-glow-pulse {
          0%,100% { fillOpacity:0.08; }
          50% { fillOpacity:0.18; }
        }
      `}</style>

      <svg width="220" height="124" viewBox="0 0 220 124" fill="none">
        {/* Background glow */}
        <circle cx="90" cy="62" r="55" fill="#0D9488" style={{ animation:'anim-glow-pulse 2.4s ease-in-out infinite' }}/>

        {/* Report card */}
        <g style={{ animation:'anim-report-rise 3s ease-in-out infinite' }}>
          <rect x="24" y="18" width="110" height="90" rx="10" fill="white" stroke="#CCFBF1" strokeWidth="1.2"/>
          {/* Header */}
          <rect x="24" y="18" width="110" height="20" rx="10" fill="#0D9488"/>
          <rect x="24" y="28" width="110" height="10" fill="#0D9488"/>
          <text x="79" y="32" textAnchor="middle" fontSize="8" fontWeight="700" fill="white" fontFamily="Inter,sans-serif">Health Report · May 5</text>

          {/* Vitals */}
          <text x="33" y="52" fontSize="7.5" fill="#9CA3AF" fontFamily="Inter,sans-serif">Blood Pressure</text>
          <text x="33" y="62" fontSize="11" fontWeight="800" fill="#111827" fontFamily="Inter,sans-serif" style={{ animation:'anim-vital-count-bp 3s ease-in-out infinite' }}>118/76</text>
          <text x="75" y="62" fontSize="7" fill="#6B7280" fontFamily="Inter,sans-serif">mmHg</text>
          <rect x="33" y="65" height="5" rx="2.5" fill="#0D9488" fillOpacity="0.2" width="80"/>
          <rect x="33" y="65" height="5" rx="2.5" fill="#0D9488" style={{ animation:'anim-bar-grow-1 3s ease-out infinite' }}/>

          <text x="33" y="80" fontSize="7.5" fill="#9CA3AF" fontFamily="Inter,sans-serif">Glucose</text>
          <text x="33" y="90" fontSize="11" fontWeight="800" fill="#111827" fontFamily="Inter,sans-serif" style={{ animation:'anim-vital-count-bp 3s ease-in-out infinite 0.1s' }}>94</text>
          <text x="50" y="90" fontSize="7" fill="#6B7280" fontFamily="Inter,sans-serif">mg/dL</text>
          <rect x="33" y="93" height="5" rx="2.5" fill="#0D9488" fillOpacity="0.2" width="80"/>
          <rect x="33" y="93" height="5" rx="2.5" fill="#0D9488" style={{ animation:'anim-bar-grow-2 3s ease-out infinite 0.12s' }}/>

          {/* Normal badge */}
          <rect x="90" y="78" width="36" height="14" rx="7" fill="#F0FDFB" stroke="#6EE7B7" strokeWidth="0.8"/>
          <polyline points="97,85 100,88 106,81" stroke="#0D9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="12" style={{ animation:'anim-check-small 3s ease-in-out infinite' }}/>
          <text x="110" y="87" fontSize="7" fontWeight="700" fill="#0D9488" fontFamily="Inter,sans-serif">Normal</text>
        </g>

        {/* Envelope flying in */}
        <g style={{ transformOrigin:'162px 76px', animation:'anim-envelope-fly 3s ease-out infinite' }}>
          <rect x="142" y="64" width="40" height="28" rx="5" fill="white" stroke="#CCFBF1" strokeWidth="1.2"/>
          <polyline points="142,64 162,80 182,64" stroke="#0D9488" strokeWidth="1.2" fill="none"/>
          {/* Report doc inside */}
          <rect x="152" y="72" width="20" height="14" rx="2" fill="#F0FDFB"/>
          <line x1="155" y1="76" x2="169" y2="76" stroke="#0D9488" strokeWidth="0.8" strokeDasharray="3 2"/>
          <line x1="155" y1="79" x2="169" y2="79" stroke="#CCFBF1" strokeWidth="0.8"/>
          <line x1="155" y1="82" x2="165" y2="82" stroke="#CCFBF1" strokeWidth="0.8"/>
          {/* Sent tick */}
          <circle cx="182" cy="64" r="7" fill="#0D9488"/>
          <polyline points="178,64 181,67 186,61" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
      </svg>
    </div>
  );
}
