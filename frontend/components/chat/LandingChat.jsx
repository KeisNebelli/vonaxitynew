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
  sq: 'Përshëndetje! Unë jam Vona, asistentja juaj e Vonaxity. Mund t\'ju ndihmoj me pyetje rreth shërbimeve tona infermierore, çmimeve dhe mënyrës si të filloni.',
};

export default function LandingChat({ lang = 'en' }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING[lang] || GREETING.en }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
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
        body: JSON.stringify({ messages: apiMessages, context: 'landing' }),
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
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#1D4ED8,#2563EB)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,99,235,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,99,235,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,99,235,0.45)'; }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <img src="/vona-icon.svg" alt="Vona" width="38" height="38" style={{ borderRadius: '50%' }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 92, right: 24, zIndex: 8999,
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, calc(100vh - 120px))',
            background: '#fff', borderRadius: 20,
            boxShadow: '0 12px 50px rgba(15,23,42,0.16)',
            border: '1px solid #E2E8F0',
            display: 'flex', flexDirection: 'column',
            fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
            overflow: 'hidden',
            animation: 'chatSlideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <style suppressHydrationWarning>{`@keyframes chatSlideUp{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>

          {/* Header */}
          <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg,#1D4ED8,#2563EB)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/vona-icon.svg" alt="Vona" width="36" height="36" style={{ borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Vona</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>Vonaxity Assistant</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#1D4ED8,#2563EB)' : '#F1F5F9',
                  color: m.role === 'user' ? '#fff' : '#0F172A',
                  fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '18px 18px 18px 4px', background: '#F1F5F9', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94A3B8', display: 'inline-block', animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — shown only when just the greeting exists */}
          {messages.length === 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(SUGGESTIONS[lang] || SUGGESTIONS.en).map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{ fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 20, border: '1px solid #DBEAFE', background: '#EFF6FF', color: '#2563EB', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {s}
                </button>
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
                flex: 1, resize: 'none', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '9px 12px',
                fontSize: 13.5, fontFamily: 'inherit', outline: 'none', lineHeight: 1.45,
                color: '#0F172A', background: '#F8FAFC',
                transition: 'border-color 0.15s',
                maxHeight: 100, overflowY: 'auto',
              }}
              onFocus={e => { e.target.style.borderColor = '#2563EB'; }}
              onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 11, border: 'none', cursor: loading || !input.trim() ? 'default' : 'pointer',
                background: loading || !input.trim() ? '#E2E8F0' : 'linear-gradient(135deg,#1D4ED8,#2563EB)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={loading || !input.trim() ? '#94A3B8' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
          <style suppressHydrationWarning>{`@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
        </div>
      )}
    </>
  );
}
