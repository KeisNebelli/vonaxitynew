'use client';
import { useEffect, useState } from 'react';

const EVENTS = [
  { icon: '✓', text: 'Visit completed in Tirana', color: '#0D9488', bg: '#F0FDFB', border: '#D1FAE5' },
  { icon: '→', text: 'Nurse assigned in Durrës', color: '#2563EB', bg: '#EFF6FF', border: '#DBEAFE' },
  { icon: '♥', text: 'Family joined from Italy', color: '#0D9488', bg: '#F0FDFB', border: '#CCFBF1' },
  { icon: '✓', text: 'BP check done · Elbasan', color: '#0D9488', bg: '#F0FDFB', border: '#D1FAE5' },
  { icon: '→', text: 'Nurse assigned in Tirana', color: '#2563EB', bg: '#EFF6FF', border: '#DBEAFE' },
  { icon: '♥', text: 'Family joined from Germany', color: '#0D9488', bg: '#F0FDFB', border: '#CCFBF1' },
  { icon: '✓', text: 'Glucose check done · Fier', color: '#0D9488', bg: '#F0FDFB', border: '#D1FAE5' },
  { icon: '→', text: 'Visit booked · Durrës', color: '#2563EB', bg: '#EFF6FF', border: '#DBEAFE' },
];

export default function LiveActivity() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = () => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % EVENTS.length);
        setVisible(true);
      }, 400);
    };
    const id = setInterval(cycle, 3800);
    return () => clearInterval(id);
  }, []);

  const ev = EVENTS[index];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 14px',
        borderRadius: 99,
        background: ev.bg,
        border: `1px solid ${ev.border}`,
        fontSize: 12,
        fontWeight: 600,
        color: ev.color,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: ev.color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 9,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {ev.icon}
      </span>
      {ev.text}
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ev.color, animation: 'lv-pulse 1.8s infinite', flexShrink: 0 }} />
      <style>{`@keyframes lv-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.45;transform:scale(0.7)}}`}</style>
    </div>
  );
}
