'use client';

/**
 * WellnessTicker — Horizontal scrolling wellness reminder bar.
 *
 * Behaviour:
 *   - Smooth infinite right-to-left CSS animation (no JS-driven movement)
 *   - Pauses on hover, resumes on mouse leave
 *   - Seamless loop: items are duplicated so the seam is invisible
 *   - Mobile-safe: overflow hidden, no layout shift
 *
 * Usage:
 *   <WellnessTicker lang="en" />
 *   <WellnessTicker lang="sq" />
 *
 * Content is in: frontend/lib/wellnessTips.js
 */

import { useState } from 'react';
import { WELLNESS_TIPS } from '@/lib/wellnessTips';

// ── Icon map ─────────────────────────────────────────────────────────────────
// Thin SVG icons — consistent with Vonaxity's strokeWidth:1.8 icon style.
const TICKER_ICONS = {
  droplet:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>,
  activity:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  clipboard: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  users:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  calendar:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  file:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  shield:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  clock:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  phone:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
  heart:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
};

// Accent color → light background (10% opacity via hex)
const ACCENT_BG = {
  '#2563EB': 'rgba(37,99,235,0.08)',
  '#059669': 'rgba(5,150,105,0.08)',
  '#7C3AED': 'rgba(124,58,237,0.08)',
};

export default function WellnessTicker({ lang = 'en' }) {
  const [paused, setPaused] = useState(false);

  const tips = WELLNESS_TIPS[lang] ?? WELLNESS_TIPS.en;
  // Duplicate for seamless loop: animate translateX(0 → -50%)
  const loopedTips = [...tips, ...tips];

  const disclaimer = lang === 'sq'
    ? 'Këto janë këshilla të përgjithshme shëndetësore dhe nuk përbëjnë këshillë mjekësore.'
    : 'These reminders are general wellness tips and not medical advice.';

  return (
    <section
      aria-label="Wellness tips"
      style={{
        background: 'linear-gradient(to right, #EFF6FF 0%, #F0FDF4 50%, #F5F3FF 100%)',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
        padding: '14px 0 10px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Keyframe — scoped to this component via unique name prefix */}
      <style>{`
        @keyframes vx-ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Fade masks — left and right edges fade content into background */}
      <div style={{ position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div aria-hidden style={{ position:'absolute', left:0, top:0, bottom:0, width:64, background:'linear-gradient(to right, #EFF6FF, transparent)', zIndex:2, pointerEvents:'none' }} />
        <div aria-hidden style={{ position:'absolute', right:0, top:0, bottom:0, width:64, background:'linear-gradient(to left, #F5F3FF, transparent)', zIndex:2, pointerEvents:'none' }} />

        {/* Scrolling track */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            width: 'max-content',
            animation: 'vx-ticker-scroll 55s linear infinite',
            animationPlayState: paused ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {loopedTips.map((tip, i) => (
            <TickerPill key={i} tip={tip} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
        margin: '8px 0 0',
        letterSpacing: '0.2px',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {disclaimer}
      </p>
    </section>
  );
}

// ── Sub-component: individual pill ───────────────────────────────────────────
function TickerPill({ tip }) {
  const bg = ACCENT_BG[tip.accent] ?? 'rgba(37,99,235,0.08)';
  const icon = TICKER_ICONS[tip.icon];

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {/* Pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: bg,
        border: `1px solid ${tip.accent}22`,
        borderRadius: 99,
        padding: '5px 13px 5px 9px',
        whiteSpace: 'nowrap',
        color: tip.accent,
        fontSize: 12.5,
        fontWeight: 500,
        fontFamily: "'Inter', system-ui, sans-serif",
        letterSpacing: '-0.1px',
        lineHeight: 1,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', opacity: 0.85 }}>{icon}</span>
        {tip.text}
      </div>

      {/* Separator dot between pills */}
      <div aria-hidden style={{
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: '#D1D5DB',
        margin: '0 20px',
        flexShrink: 0,
      }} />
    </div>
  );
}
