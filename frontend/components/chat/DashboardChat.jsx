'use client';
import { useState, useRef, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const SUGGESTIONS = {
  en: ['How do I book a visit?', 'What do my health records show?', 'How do I upgrade my plan?', 'How do I add a family member?'],
  sq: ['Si rezervoj një vizitë?', 'Çfarë tregojnë shënimet e mia shëndetësore?', 'Si e rris planin tim?', 'Si shtoj një anëtar familje?'],
};
const PLACEHOLDER = { en: 'Ask me anything…', sq: 'Pyesni çdo gjë…' };
const BUBBLE_TEXT = {
  en: '👋 Need help with your dashboard?',
  sq: '👋 Keni nevojë për ndihmë me panelin?',
};

// ── Intent detection ──────────────────────────────────────────────────────────
const INTENTS = [
  {
    id: 'emergency',
    keys: ['chest pain','heart attack','stroke','trouble breathing','bleeding','unconscious','emergency'],
    emergency: true,
  },
  { id: 'book',         keys: ['book','appointment','reserve','schedule a visit','new visit','add visit'], section: 'book' },
  { id: 'health',       keys: ['health','vitals','blood pressure','glucose','heart rate','oxygen','records','history'], section: 'health' },
  { id: 'nurses',       keys: ['find nurse','browse nurse','nurse profile','see nurses','who is available'], section: 'nurses' },
  { id: 'visits',       keys: ['my visit','visit history','past visit','upcoming','all visit','visit list'], section: 'visits' },
  { id: 'subscription', keys: ['plan','subscription','upgrade','downgrade','billing','payment','premium','standard','basic','cost','price'], section: 'subscription' },
  { id: 'settings',     keys: ['setting','account','profile','password','family member','loved one','add person','change email','edit info'], section: 'settings' },
];

const NAV_MSGS = {
  en: {
    book:         "I'll take you to Book a Visit 👇",
    health:       "Let me show you your Health records 👇",
    nurses:       "Taking you to Find Nurses 👇",
    visits:       "I'll show you your visit history 👇",
    subscription: "Taking you to Subscription & Plans 👇",
    settings:     "I'll take you to Account Settings 👇",
  },
  sq: {
    book:         "Po ju çoj tek Rezervo Vizitë 👇",
    health:       "Ju tregoj shënimet tuaja shëndetësore 👇",
    nurses:       "Po ju çoj tek Gjej Infermiere 👇",
    visits:       "Ju tregoj historinë e vizitave 👇",
    subscription: "Po ju çoj tek Abonimi & Planet 👇",
    settings:     "Po ju çoj tek Cilësimet e llogarisë 👇",
  },
};

const EMERGENCY_MSG = {
  en: "⚠️ Vonaxity is not an emergency service. Please call your local emergency number immediately. In Albania, call 127.",
  sq: "⚠️ Vonaxity nuk është shërbim urgjence. Ju lutemi telefononi menjëherë numrin e urgjencës. Në Shqipëri telefononi 127.",
};

function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const intent of INTENTS) {
    if (intent.keys.some(k => lower.includes(k))) return intent;
  }
  return null;
}

// ── Icon ──────────────────────────────────────────────────────────────────────
function VonaIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dc-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#dc-bg)" />
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

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes vonaGlowDark {
    0%,100% { box-shadow:0 4px 20px rgba(99,102,241,0.45),0 0 0 0 rgba(99,102,241,0); }
    50%      { box-shadow:0 6px 28px rgba(99,102,241,0.65),0 0 0 9px rgba(99,102,241,0.1); }
  }
  @keyframes dcSlideUp {
    from { opacity:0;transform:translateY(18px) scale(0.96); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }
  @keyframes dcBubblePop {
    from { opacity:0;transform:translateY(8px) scale(0.92); }
    to   { opacity:1;transform:translateY(0) scale(1); }
  }
  @keyframes dotBounce2 {
    0%,80%,100% { transform:translateY(0); }
    40%         { transform:translateY(-5px); }
  }
  @keyframes navPulseDark {
    0%,100% { opacity:1; }
    50%     { opacity:0.65; }
  }
  .vona-idle-dark { animation:vonaGlowDark 3s ease-in-out infinite; }
  .vona-idle-dark:hover {
    animation:none !important;
    transform:scale(1.1) !important;
    box-shadow:0 8px 32px rgba(99,102,241,0.7) !important;
    transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.18s ease !important;
  }
  .nav-hint-dark { animation:navPulseDark 1.4s ease-in-out infinite; }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function DashboardChat({ lang = 'en', userName = null, onNavigate }) {
  const greeting = userName
    ? (lang === 'sq'
        ? `Përshëndetje ${userName}! Unë jam Vona, asistentja juaj e kujdesit. Si mund t'ju ndihmoj sot?`
        : `Hi ${userName}! I'm Vona, your care assistant. How can I help you today?`)
    : (lang === 'sq'
        ? "Përshëndetje! Unë jam Vona, asistentja juaj e Vonaxity. Si mund t'ju ndihmoj?"
        : "Hi! I'm Vona, your Vonaxity care assistant. How can I help you today?");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: greeting }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const [pendingNav, setPendingNav] = useState(null);
  const [rated, setRated] = useState({});
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const redirectTimer = useRef(null);

  const sendFeedback = async (logId, helpful) => {
    if (!logId || rated[logId]) return;
    setRated(prev => ({ ...prev, [logId]: helpful ? 'up' : 'down' }));
    try {
      await apiFetch('/ai/feedback', { method: 'POST', body: JSON.stringify({ logId, helpful }) });
    } catch {}
  };

  useEffect(() => {
    if (bubbleDismissed) return;
    const t = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(t);
  }, [bubbleDismissed]);

  useEffect(() => {
    if (open) { setShowBubble(false); setTimeout(() => inputRef.current?.focus(), 120); }
  }, [open]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); }, []);

  const handleInput = (e) => {
    setInput(e.target.value);
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
      setPendingNav(null);
    }
  };

  const executeNav = (intent) => {
    if (intent.section && onNavigate) onNavigate(intent.section);
    setPendingNav(null);
    redirectTimer.current = null;
  };

  const scheduleNav = (intent) => {
    setPendingNav(intent);
    redirectTimer.current = setTimeout(() => executeNav(intent), 1800);
  };

  const dismiss = () => { setShowBubble(false); setBubbleDismissed(true); };

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
      setPendingNav(null);
    }

    setInput('');
    const intent = detectIntent(trimmed);

    if (intent?.emergency) {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: trimmed },
        { role: 'assistant', content: EMERGENCY_MSG[lang] || EMERGENCY_MSG.en, emergency: true },
      ]);
      return;
    }

    const next = [...messages, { role: 'user', content: trimmed }];
    setMessages(next);
    setLoading(true);

    try {
      const data = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), context: 'client', userName }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.content, logId: data.logId || null }]);

      if (intent && onNavigate) {
        const navText = (NAV_MSGS[lang] || NAV_MSGS.en)[intent.id];
        if (navText) {
          setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', content: navText, isNav: true }]);
            scheduleNav(intent);
          }, 400);
        }
      }
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
            position: 'fixed', bottom: 144, right: 20, zIndex: 9001,
            background: '#1E293B', borderRadius: 16, padding: '10px 12px 10px 14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
            fontSize: 13.5, fontWeight: 500, color: '#F1F5F9', maxWidth: 240,
            animation: 'dcBubblePop 0.28s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span style={{ flex: 1, lineHeight: 1.4 }}>{BUBBLE_TEXT[lang] || BUBBLE_TEXT.en}</span>
          <button
            onClick={e => { e.stopPropagation(); dismiss(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2, display: 'flex', flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <div style={{ position: 'absolute', bottom: -7, right: 24, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid #1E293B' }} />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close support chat' : 'Chat with Vona'}
        className={!open ? 'vona-idle-dark' : ''}
        style={{
          position: 'fixed', bottom: 80, right: 20, zIndex: 9000,
          width: 54, height: 54, borderRadius: '50%',
          background: open ? '#334155' : 'linear-gradient(135deg,#3B82F6,#7C3AED)',
          border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer', padding: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s, background 0.2s',
        }}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <VonaIcon size={54} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 146, right: 20, zIndex: 8999,
          width: 'min(360px, calc(100vw - 32px))',
          height: 'min(490px, calc(100vh - 180px))',
          background: '#0F172A', borderRadius: 20,
          boxShadow: '0 16px 60px rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'DM Sans','Inter',system-ui,sans-serif",
          overflow: 'hidden',
          animation: 'dcSlideUp 0.26s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header */}
          <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg,#1D4ED8,#6D28D9)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              <VonaIcon size={36} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.2px' }}>Vona</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
                {lang === 'sq' ? 'Asistentja juaj e Kujdesit' : 'Client Care Assistant'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.isNav ? (
                  <div
                    className="nav-hint-dark"
                    onClick={() => { if (redirectTimer.current) { clearTimeout(redirectTimer.current); executeNav(pendingNav); } }}
                    style={{
                      maxWidth: '84%', padding: '9px 13px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(109,40,217,0.25)',
                      border: '1.5px solid rgba(167,139,250,0.4)',
                      color: '#C4B5FD', fontSize: 13, lineHeight: 1.55,
                      cursor: 'pointer', fontWeight: 600,
                    }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div style={{ maxWidth: '84%' }}>
                    <div style={{
                      padding: '9px 13px',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: m.emergency
                        ? 'rgba(220,38,38,0.15)'
                        : m.role === 'user'
                          ? 'linear-gradient(135deg,#1D4ED8,#6D28D9)'
                          : '#1E293B',
                      border: m.emergency ? '1px solid rgba(220,38,38,0.35)' : 'none',
                      color: m.emergency ? '#FCA5A5' : '#F1F5F9',
                      fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
                      fontWeight: m.emergency ? 600 : 400,
                    }}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' && m.logId && !m.emergency && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, paddingLeft: 2 }}>
                        <button onClick={() => sendFeedback(m.logId, true)} title="Helpful" style={{ background: 'none', border: 'none', cursor: rated[m.logId] ? 'default' : 'pointer', padding: 2, opacity: rated[m.logId] === 'up' ? 1 : rated[m.logId] === 'down' ? 0.25 : 0.45, transition: 'opacity 0.15s' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={rated[m.logId] === 'up' ? '#4ADE80' : 'none'} stroke={rated[m.logId] === 'up' ? '#4ADE80' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                        </button>
                        <button onClick={() => sendFeedback(m.logId, false)} title="Not helpful" style={{ background: 'none', border: 'none', cursor: rated[m.logId] ? 'default' : 'pointer', padding: 2, opacity: rated[m.logId] === 'down' ? 1 : rated[m.logId] === 'up' ? 0.25 : 0.45, transition: 'opacity 0.15s' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={rated[m.logId] === 'down' ? '#F87171' : 'none'} stroke={rated[m.logId] === 'down' ? '#F87171' : '#64748B'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
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

          {/* Suggestions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(SUGGESTIONS[lang] || SUGGESTIONS.en).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 20,
                  border: '1px solid rgba(109,40,217,0.4)', background: 'rgba(109,40,217,0.15)',
                  color: '#A78BFA', cursor: 'pointer', fontFamily: 'inherit',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={onKey}
              placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 11,
                padding: '8px 11px', fontSize: 13, fontFamily: 'inherit', outline: 'none',
                lineHeight: 1.45, color: '#F1F5F9', background: '#1E293B',
                maxHeight: 90, overflowY: 'auto', transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#7C3AED'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 36, height: 36, borderRadius: 10, border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                background: loading || !input.trim() ? '#1E293B' : 'linear-gradient(135deg,#1D4ED8,#6D28D9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={loading || !input.trim() ? '#475569' : '#fff'}
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
