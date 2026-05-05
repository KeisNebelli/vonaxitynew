'use client';
import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const C = {
  primary: '#2563EB', primaryLight: '#EFF6FF',
  bg: '#1E293B', bgPanel: '#0F172A',
  text: '#F1F5F9', textMuted: '#94A3B8',
  border: 'rgba(255,255,255,0.08)',
  userBubble: 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
  aiBubble: '#1E293B',
};

const SUGGESTIONS = {
  en: ['How do I book a visit?', 'What do my health records show?', 'How do I upgrade my plan?', 'How do I add a family member?'],
  sq: ['Si rezervoj një vizitë?', 'Çfarë tregojnë shënimet e mia shëndetësore?', 'Si e rris planin tim?', 'Si shtoj një anëtar familje?'],
};

const PLACEHOLDER = { en: 'Ask me anything…', sq: 'Pyesni çdo gjë…' };

export default function DashboardChat({ lang = 'en', userName = null }) {
  const greeting = userName
    ? (lang === 'sq'
        ? `Përshëndetje ${userName}! Unë jam Vona, asistentja juaj. Si mund t'ju ndihmoj sot?`
        : `Hi ${userName}! I'm Vona, your Vonaxity support assistant. How can I help you today?`)
    : (lang === 'sq'
        ? "Përshëndetje! Unë jam Vona, asistentja juaj e Vonaxity. Si mund t'ju ndihmoj?"
        : "Hi! I'm Vona, your Vonaxity support assistant. How can I help you today?");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setLoading(true);
    try {
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }));
      const data = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: apiMessages, context: 'dashboard', userName }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: lang === 'sq' ? 'Na vjen keq, ndodhi një gabim. Ju lutem provoni sërish.' : 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* Floating bubble — sits above mobile nav tabs (bottom: 80px) */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close support chat' : 'Open support chat'}
        style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 9000,
          width: 50, height: 50, borderRadius: '50%',
          background: open ? '#334155' : 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
          border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, background 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <img src="/vona-icon.svg" alt="Vona" width="34" height="34" style={{ borderRadius: '50%' }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 142, right: 20, zIndex: 8999,
            width: 'min(360px, calc(100vw - 32px))',
            height: 'min(480px, calc(100vh - 180px))',
            background: '#0F172A', borderRadius: 18,
            boxShadow: '0 12px 50px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
            overflow: 'hidden',
            animation: 'dashChatUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <style suppressHydrationWarning>{`@keyframes dashChatUp{from{opacity:0;transform:translateY(14px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A' }}>
            <img src="/vona-icon.svg" alt="Vona" width="34" height="34" style={{ borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Vona</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Support Assistant</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              <span style={{ fontSize: 11, color: '#64748B' }}>{lang === 'sq' ? 'Online' : 'Online'}</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '84%', padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? C.userBubble : '#1E293B',
                  color: '#F1F5F9', fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '9px 14px', borderRadius: '16px 16px 16px 4px', background: '#1E293B', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#475569', display: 'inline-block', animation: `dotBounce2 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — shown only when just the greeting exists */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(SUGGESTIONS[lang] || SUGGESTIONS.en).map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 20,
                    border: '1px solid rgba(59,130,246,0.35)', background: 'rgba(37,99,235,0.15)',
                    color: '#93C5FD', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 11,
                padding: '8px 11px', fontSize: 13, fontFamily: 'inherit', outline: 'none', lineHeight: 1.45,
                color: '#F1F5F9', background: '#1E293B', maxHeight: 90, overflowY: 'auto',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#3B82F6'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                background: loading || !input.trim() ? '#1E293B' : 'linear-gradient(135deg,#1D4ED8,#3B82F6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={loading || !input.trim() ? '#475569' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <style suppressHydrationWarning>{`@keyframes dotBounce2{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
        </div>
      )}
    </>
  );
}
