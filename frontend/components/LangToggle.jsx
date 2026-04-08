'use client';

export default function LangToggle({ lang, onSwitch, dark = false }) {
  const bg = dark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const border = dark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
  const inactiveColor = dark ? 'rgba(255,255,255,0.4)' : '#6B7280';

  return (
    <div style={{ display:'flex', background:bg, borderRadius:8, padding:3, border:`1px solid ${border}`, flexShrink:0 }}>
      {['en','sq'].map(l => (
        <button
          key={l}
          onClick={() => onSwitch(l)}
          style={{
            padding:'4px 10px', borderRadius:6, border:'none',
            fontSize:11, fontWeight:700, cursor:'pointer',
            letterSpacing:'0.4px', fontFamily:'inherit',
            background: lang === l ? '#2563EB' : 'transparent',
            color: lang === l ? '#fff' : inactiveColor,
            transition:'all 0.15s',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
