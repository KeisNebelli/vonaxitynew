'use client';

/*
  OrganicBackground — Vonaxity landing page
  ─────────────────────────────────────────
  Fixed, full-viewport layer sitting behind all content.
  On mobile (≤768px) we cut to 3 blobs with reduced blur,
  hide the SVG arcs and pulse nodes — keeps it 60fps on iOS Safari.
*/

const KEYFRAMES = `
  @keyframes org-m1 {
    0%,100% { border-radius:62% 38% 46% 54% / 60% 44% 56% 40%; transform:scale(1)    translate(0px, 0px)   rotate(0deg);  }
    20%     { border-radius:48% 52% 60% 40% / 44% 62% 38% 56%; transform:scale(1.04) translate(14px,-10px)  rotate(2deg);  }
    50%     { border-radius:36% 64% 42% 58% / 54% 36% 64% 46%; transform:scale(0.96) translate(-8px, 16px)  rotate(-3deg); }
    75%     { border-radius:54% 46% 36% 64% / 40% 58% 42% 60%; transform:scale(1.02) translate(10px, 6px)   rotate(4deg);  }
  }
  @keyframes org-m2 {
    0%,100% { border-radius:44% 56% 62% 38% / 56% 40% 60% 44%; transform:scale(1)    translate(0px, 0px)   rotate(0deg);  }
    30%     { border-radius:60% 40% 44% 56% / 38% 62% 46% 54%; transform:scale(1.05) translate(-12px, 8px)  rotate(-2deg); }
    60%     { border-radius:50% 50% 56% 44% / 62% 38% 52% 48%; transform:scale(0.97) translate(6px,-14px)   rotate(3deg);  }
  }
  @keyframes org-m3 {
    0%,100% { border-radius:56% 44% 52% 48% / 48% 56% 44% 52%; transform:scale(1)    translate(0px, 0px)   rotate(0deg);  }
    25%     { border-radius:40% 60% 58% 42% / 60% 44% 56% 40%; transform:scale(1.03) translate(8px, 12px)   rotate(-3deg); }
    55%     { border-radius:64% 36% 44% 56% / 44% 60% 40% 56%; transform:scale(0.95) translate(-10px,-6px)  rotate(2deg);  }
    80%     { border-radius:48% 52% 60% 40% / 52% 48% 60% 40%; transform:scale(1.04) translate(4px, -10px)  rotate(-1deg); }
  }
  @keyframes org-m4 {
    0%,100% { border-radius:70% 30% 50% 50% / 50% 60% 40% 50%; transform:scale(1)    translate(0px, 0px);  }
    40%     { border-radius:40% 60% 60% 40% / 30% 70% 50% 50%; transform:scale(1.06) translate(-6px, 10px); }
    70%     { border-radius:55% 45% 35% 65% / 65% 35% 55% 45%; transform:scale(0.94) translate(10px,-8px);  }
  }
  @keyframes org-m5 {
    0%,100% { border-radius:38% 62% 54% 46% / 52% 46% 54% 48%; transform:scale(1)    translate(0px, 0px)   rotate(0deg);  }
    35%     { border-radius:58% 42% 46% 54% / 40% 58% 44% 56%; transform:scale(1.04) translate(8px,-12px)   rotate(4deg);  }
    65%     { border-radius:46% 54% 62% 38% / 56% 44% 58% 42%; transform:scale(0.97) translate(-8px, 8px)   rotate(-2deg); }
  }
  @keyframes org-m6 {
    0%,100% { border-radius:52% 48% 44% 56% / 46% 54% 46% 54%; transform:scale(1)    translate(0px, 0px);  }
    50%     { border-radius:36% 64% 58% 42% / 60% 40% 52% 48%; transform:scale(1.08) translate(-4px, 6px);  }
  }
  @keyframes org-ring {
    0%,100% { transform:scale(1);    opacity:0.6; }
    50%     { transform:scale(1.12); opacity:1;   }
  }
  @keyframes org-arc-draw {
    0%   { stroke-dashoffset: 900; opacity:0;   }
    10%  {                         opacity:0.7; }
    90%  {                         opacity:0.7; }
    100% { stroke-dashoffset: 0;   opacity:0;   }
  }
  @keyframes org-arc-fade {
    0%,100% { opacity:0.25; }
    50%     { opacity:0.55; }
  }
  @keyframes org-breathe {
    0%,100% { opacity:1;    }
    50%     { opacity:0.82; }
  }

  /* ── mobile: hide expensive layers, reduce blur on remaining blobs ── */
  @media (max-width: 768px) {
    .org-blob-4, .org-blob-5, .org-blob-6 { display: none !important; }
    .org-arcs { display: none !important; }
    .org-ring-wrap { display: none !important; }
    .org-noise { display: none !important; }
    .org-blob-1 { filter: blur(40px) !important; width: 320px !important; height: 300px !important; }
    .org-blob-2 { filter: blur(36px) !important; width: 280px !important; height: 260px !important; }
    .org-blob-3 { filter: blur(32px) !important; width: 260px !important; height: 240px !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .org-blob, .org-ring-wrap, .org-arc { animation: none !important; }
  }
`;

const BLOBS = [
  {
    cls: 'org-blob org-blob-1',
    style: {
      top: '-12%', right: '-8%',
      width: 780, height: 700,
      background: 'radial-gradient(ellipse at 42% 38%, rgba(30,111,171,0.16) 0%, rgba(46,123,180,0.09) 45%, transparent 68%)',
      filter: 'blur(72px)',
      opacity: 0.9,
      animation: 'org-m1 26s ease-in-out infinite, org-breathe 14s ease-in-out infinite',
    },
  },
  {
    cls: 'org-blob org-blob-2',
    style: {
      top: '22%', left: '-10%',
      width: 660, height: 600,
      background: 'radial-gradient(ellipse at 55% 50%, rgba(13,148,136,0.14) 0%, rgba(20,160,148,0.08) 50%, transparent 70%)',
      filter: 'blur(68px)',
      opacity: 0.85,
      animation: 'org-m2 22s ease-in-out infinite 2s, org-breathe 18s ease-in-out infinite 4s',
    },
  },
  {
    cls: 'org-blob org-blob-3',
    style: {
      bottom: '-8%', right: '-4%',
      width: 620, height: 580,
      background: 'radial-gradient(ellipse at 48% 52%, rgba(195,165,120,0.11) 0%, rgba(210,180,140,0.07) 48%, transparent 68%)',
      filter: 'blur(64px)',
      opacity: 0.88,
      animation: 'org-m3 28s ease-in-out infinite 1s, org-breathe 20s ease-in-out infinite 6s',
    },
  },
  {
    cls: 'org-blob org-blob-4',
    style: {
      top: '38%', left: '22%',
      width: 860, height: 700,
      background: 'radial-gradient(ellipse at 50% 50%, rgba(13,148,136,0.07) 0%, rgba(30,111,171,0.05) 55%, transparent 72%)',
      filter: 'blur(100px)',
      opacity: 0.9,
      animation: 'org-m4 34s ease-in-out infinite 3s',
    },
  },
  {
    cls: 'org-blob org-blob-5',
    style: {
      bottom: '8%', left: '4%',
      width: 500, height: 460,
      background: 'radial-gradient(ellipse at 45% 55%, rgba(195,170,135,0.10) 0%, rgba(210,185,150,0.06) 50%, transparent 68%)',
      filter: 'blur(60px)',
      opacity: 0.82,
      animation: 'org-m5 20s ease-in-out infinite 5s, org-breathe 16s ease-in-out infinite 2s',
    },
  },
  {
    cls: 'org-blob org-blob-6',
    style: {
      top: '6%', left: '8%',
      width: 380, height: 340,
      background: 'radial-gradient(ellipse at 50% 45%, rgba(13,148,136,0.11) 0%, rgba(30,111,171,0.07) 50%, transparent 70%)',
      filter: 'blur(52px)',
      opacity: 0.78,
      animation: 'org-m6 18s ease-in-out infinite 4s, org-breathe 22s ease-in-out infinite',
    },
  },
];

const RINGS = [
  { top: '18%', left: '62%', size: 6, color: 'rgba(30,111,171,0.45)',  delay: '0s',   dur: '5s'  },
  { top: '52%', left: '8%',  size: 5, color: 'rgba(13,148,136,0.42)',  delay: '2s',   dur: '7s'  },
  { top: '74%', left: '75%', size: 6, color: 'rgba(195,165,120,0.38)', delay: '1.5s', dur: '6s'  },
  { top: '35%', left: '88%', size: 4, color: 'rgba(13,148,136,0.38)',  delay: '3s',   dur: '4.5s'},
];

const ARCS = [
  {
    d: 'M -40 320 Q 280 80 620 260 T 1300 180',
    stroke: 'rgba(30,111,171,0.10)', strokeWidth: 1.2,
    dasharray: 900, delay: '0s', dur: '18s',
  },
  {
    d: 'M 1440 600 Q 1100 340 740 500 T 80 380',
    stroke: 'rgba(13,148,136,0.09)', strokeWidth: 1,
    dasharray: 900, delay: '6s', dur: '22s',
  },
  {
    d: 'M 200 800 Q 540 560 860 720 T 1500 550',
    stroke: 'rgba(195,165,120,0.08)', strokeWidth: 1,
    dasharray: 900, delay: '12s', dur: '26s',
  },
];

export default function OrganicBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* ── morphing organic blobs ── */}
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className={b.cls}
            style={{
              position: 'absolute',
              ...b.style,
              willChange: 'transform, border-radius',
            }}
          />
        ))}

        {/* ── flowing circuit arcs (desktop only) ── */}
        <svg
          className="org-arcs"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {ARCS.map((a, i) => (
            <path
              key={i}
              d={a.d}
              fill="none"
              stroke={a.stroke}
              strokeWidth={a.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={a.dasharray}
              style={{
                animation: `org-arc-draw ${a.dur} ease-in-out infinite ${a.delay}, org-arc-fade ${a.dur} ease-in-out infinite ${a.delay}`,
              }}
            />
          ))}
        </svg>

        {/* ── pulse nodes (desktop only) ── */}
        {RINGS.map((r, i) => (
          <div
            key={i}
            className="org-ring-wrap"
            style={{ position: 'absolute', top: r.top, left: r.left, width: r.size, height: r.size }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              background: r.color,
              animation: `org-ring ${r.dur} ease-in-out infinite ${r.delay}`,
            }} />
            <div style={{
              position: 'absolute',
              inset: `-${r.size * 1.5}px`,
              borderRadius: '50%',
              border: `1px solid ${r.color}`,
              animation: `org-ring ${r.dur} ease-in-out infinite calc(${r.delay} + 0.4s)`,
              opacity: 0.4,
            }} />
            <div style={{
              position: 'absolute',
              inset: `-${r.size * 3.2}px`,
              borderRadius: '50%',
              border: `1px solid ${r.color.replace(/[\d.]+\)$/, '0.2)')}`,
              animation: `org-ring ${r.dur} ease-in-out infinite calc(${r.delay} + 0.9s)`,
              opacity: 0.25,
            }} />
          </div>
        ))}

        {/* ── grain texture (desktop only) ── */}
        <svg className="org-noise" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.018 }} xmlns="http://www.w3.org/2000/svg">
          <filter id="org-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#org-noise)" />
        </svg>
      </div>
    </>
  );
}
