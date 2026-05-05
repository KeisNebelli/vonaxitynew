'use client';
import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const SUGGESTIONS = {
  en: ['What services do you offer?', 'How much does it cost?', 'Which cities are covered?', 'How do I sign up?'],
  sq: ['Çfarë shërbimesh ofroni?', 'Sa kushton?', 'Cilat qytete mbulohen?', 'Si regjistrohem?'],
};
const PLACEHOLDER = { en: 'Ask me anything about Vonaxity…', sq: 'Pyesni çdo gjë rreth Vonaxity…' };
const GREETING = {
  en: "Hi! I'm Vona, your Vonaxity assistant. I can answer questions about our nursing services, pricing, and how to get started.",
  sq: "Përshëndetje! Unë jam Vona, asistentja juaj e Vonaxity. Mund t'ju ndihmoj me pyetje rreth shërbimeve tona infermierore, çmimeve dhe mënyrës si të filloni.",
};
const BUBBLE_TEXT = {
  en: '👋 Need help booking a visit?',
  sq: '👋 Doni ndihmë për rezervim?',
};

function VonaIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#lc-bg)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <line x1="50" y1="14" x2="50" y2="23" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="11" r="4.5" fill="#BAE6FD" opacity="0.9" />
      <circle cx="50" cy="11" r="2.5" fill="white" />
      <rect x="18" y="33" width="7" height="12" rx="3.5" fill="rgba(255,255,255,0.82)" />
      <rect x="75" y="33" width="7" height="12" rx="3.5" fill="rgba(255,255,255,0.82)" />
      <rect x="25" y="22" width="50" height="40" rx="13" fill="white" opacity="0.97" />
      <circle cx="38" cy="39" r="5" fill="#2563EB" />
      <circle cx="38" cy="39" r="3" fill="#1D4ED8" />
      <circle cx="36.5" cy="37.5" r="1.8" fill="white" opacity="0.55" />
      <circle cx="62" cy="39" r="5" fill="#2563EB" />
      <circle cx="62" cy="39" r="3" fill="#1D4ED8" />
      <circle cx="60.5" cy="37.5" r="1.8" fill="white" opacity="0.55" />
      <path d="M 42 50 Q 50 56 58 50" stroke="#3B82F6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="31" cy="46" r="3.5" fill="#FCA5A5" opacity="0.35" />
      <circle cx="69" cy="46" r="3.5" fill="#FCA5A5" opacity="0.35" />
      <rect x="44" y="62" width="12" height="6" rx="3" fill="rgba(255,255,255,0.8)" />
      <rect x="27" y="68" width="46" height="22" rx="11" fill="white" opacity="0.93" />
      <rect x="47.5" y="72" width="5" height="14" rx="2" fill="#EF4444" opacity="0.75" />
      <rect x="43" y="76.5" width="14" height="5" rx="2" fill="#EF4444" opacity="0.75" />
    </svg>
  );
}

const CSS = `
  @keyframes vonaGlow {
    0%,100% { box-shadow:0 4px 20px rgba(99,102,241,0.38),0 0 0 0 rgba(99,102,241,0); }
    50%      { box-shadow:0 6px 28px rgba(99,102,241,0.55),0 0 0 9px rgba(99,102,241,0.07); }
  }
  @keyframes chatSlideUp {
    from { opacity:0;transform:translateY(18px) scale(0.96); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }
  @keyframes bubblePop {
    from { opacity:0;transform:translateY(8px) scale(0.92); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }
  @keyframes dotBounce {
    0%,80%,100% { transform:translateY(0); }
    40%         { transform:translateY(-6px); }
  }
  .vona-idle { animation:vonaGlow 3s ease-in-out infinite; }
  .vona-idle:hover {
    animation:none !important;
    transform:scale(1.1) !important;
    box-shadow:0 8px 32px rgba(99,102,241,0.65) !important;
    transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.18s ease !important;
  }
`;

export default function LandingChat({ lang = 'en' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING[lang] || GREETING.en }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bubbleDismissed) return;
    const t = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(t);
  }, [bubbleDismissed]);

  useEffect(() => {
    if (open) { setShowBubble(false); setTimeout(() => inputRef.current?.focus(), 120); }
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const dismiss = () => { setShowBubble(false); setBubbleDismissed(true); };

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const data = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), context: 'landing' }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'sq' ? 'Na vjen keq, ndodhi një gabim. Provoni sërish.' : 'Sorry, something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>

      {/* Prompt bubble */}
      {showBubble && !open && (
        <div
          onClick={() => { dismiss(); setOpen(true); }}
          style={{
            position: 'fixed', bottom: 94, right: 20, zIndex: 9001,
            background: '#fff', borderRadius: 16, padding: '10px 12px 10px 14px',
            boxShadow: '0 8px 30px rgba(15,23,42,0.13)', border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
            fontSize: 13.5, fontWeight: 500, color: '#0F172A', maxWidth: 230,
            animation: 'bubblePop 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span style={{ flex: 1, lineHeight: 1.4 }}>{BUBBLE_TEXT[lang] || BUBBLE_TEXT.en}</span>
          <button
            onClick={e => { e.stopPropagation(); dismiss(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1',
              padding: 2, display: 'flex', flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div style={{
            position: 'absolute', bottom: -7, right: 24,
            borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
            borderTop: '8px solid #fff',
            filter: 'drop-shadow(0 2px 1px rgba(15,23,42,0.06))',
          }} />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Vona'}
        className={!open ? 'vona-idle' : ''}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg,#3B82F6,#7C3AED)',
          border: 'none', cursor: 'pointer', padding: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
        }}
      >
        {open
          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <VonaIcon size={58} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 94, right: 24, zIndex: 8999,
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 120px))',
          background: '#fff', borderRadius: 22,
          boxShadow: '0 16px 60px rgba(15,23,42,0.18)',
          border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
          overflow: 'hidden',
          animation: 'chatSlideUp 0.26s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '13px 18px',
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            display: 'flex', alignItems: 'center', gap: 11,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
              flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.22)' }}>
              <VonaIcon size={38} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>Vona</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', fontWeight: 400 }}>
                {lang === 'sq' ? 'Asistentja juaj e Kujdesit' : 'Your Care Assistant'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px',
                  borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#2563EB,#7C3AED)' : '#F1F5F9',
                  color: m.role === 'user' ? '#fff' : '#0F172A',
                  fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px',
                  background: '#F1F5F9', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94A3B8',
                      display: 'inline-block', animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(SUGGESTIONS[lang] || SUGGESTIONS.en).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 20,
                  border: '1px solid #DDD6FE', background: '#F5F3FF', color: '#7C3AED',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #E2E8F0', borderRadius: 12,
                padding: '9px 12px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
                lineHeight: 1.45, color: '#0F172A', background: '#F8FAFC',
                transition: 'border-color 0.15s', maxHeight: 100, overflowY: 'auto',
              }}
              onFocus={e => { e.target.style.borderColor = '#7C3AED'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 11, border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                background: loading || !input.trim() ? '#E2E8F0' : 'linear-gradient(135deg,#2563EB,#7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={loading || !input.trim() ? '#94A3B8' : '#fff'}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
