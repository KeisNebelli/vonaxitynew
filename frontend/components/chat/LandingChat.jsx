'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
const ONLINE_TEXT = {
  en: "We're Online!",
  sq: 'Jemi Online!',
};
const BUBBLE_TEXT = {
  en: 'How may I help you today?',
  sq: 'Si mund t\'ju ndihmoj sot?',
};

// ── Intent detection ──────────────────────────────────────────────────────────
const INTENTS = [
  {
    id: 'emergency',
    keys: ['chest pain','heart attack','stroke','trouble breathing','can\'t breathe','bleeding heavily','unconscious','collapsed','faint','emergency'],
    emergency: true,
  },
  { id: 'pricing',   keys: ['pric','plan','cost','how much','monthly','subscription','€','fee','cheap','expensive'], anchor: 'pricing' },
  { id: 'services',  keys: ['service','offer','blood pressure','glucose','vital','welfare','post-surg','medication','nursing care','what do you do'], anchor: 'services' },
  { id: 'nurses',    keys: ['find nurse','nurse profile','nurse availab','see nurses','browse nurse','who are the nurse'], anchor: 'nurses' },
  { id: 'cities',    keys: ['city','cities','where','location','tirana','durrës','durres','coverage','operate','available in'], anchor: 'cities' },
  { id: 'about',     keys: ['about','founder','who built','story','keis','mission','who made'], anchor: 'about' },
  { id: 'nurse_signup', keys: ['join as nurse','become a nurse','nurse signup','nurse register','work for vonaxity','i am a nurse','i\'m a nurse'], path: '/signup?role=nurse' },
  { id: 'signup',    keys: ['sign up','signup','register','get started','create account','start now','book','appointment','reserve'], path: '/signup?role=client' },
  { id: 'signin',    keys: ['login','log in','sign in','signin'], path: '/signin' },
  { id: 'dashboard', keys: ['dashboard','my account','my visits'], path: '/dashboard' },
];

const NAV_MSGS = {
  en: {
    pricing:      "I'll take you to our pricing plans 👇",
    services:     "Let me show you our services 👇",
    nurses:       "I'll take you to our nurses section 👇",
    cities:       "I'll show you the cities we cover 👇",
    about:        "Let me take you to our about section 👇",
    nurse_signup: "I'll take you to the nurse registration page →",
    signup:       "I'll take you to the sign up page →",
    signin:       "Taking you to the login page →",
    dashboard:    "Taking you to the dashboard →",
  },
  sq: {
    pricing:      "Po ju çoj tek planet e çmimeve 👇",
    services:     "Ju tregoj shërbimet tona 👇",
    nurses:       "Po ju çoj tek seksioni i infermiereve 👇",
    cities:       "Ju tregoj qytetet që mbulojmë 👇",
    about:        "Ju tregoj rreth nesh 👇",
    nurse_signup: "Po ju çoj tek regjistrimi për infermiere →",
    signup:       "Po ju çoj tek regjistrimi →",
    signin:       "Po ju çoj tek faqja e hyrjes →",
    dashboard:    "Po ju çoj tek paneli →",
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

// ── Vona mascot — friendly Zoho-style robot, clean + approachable ─────────────
function VonaMascot({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Teal circle background */}
      <circle cx="28" cy="28" r="28" fill="#0D9488" />
      {/* Head — white rounded rect */}
      <rect x="14" y="12" width="28" height="24" rx="10" fill="white" />
      {/* Antenna */}
      <line x1="28" y1="12" x2="28" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="28" cy="6" r="2.5" fill="white" />
      {/* Visor — black oval across eyes, Zoho style */}
      <rect x="16" y="19" width="24" height="9" rx="4.5" fill="#1A2B3C" />
      {/* Eye shine dots on visor */}
      <circle cx="22" cy="23.5" r="2" fill="white" opacity="0.9" />
      <circle cx="34" cy="23.5" r="2" fill="white" opacity="0.9" />
      {/* Smile */}
      <path d="M23 31 Q28 35 33 31" stroke="#1A2B3C" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Body */}
      <rect x="18" y="37" width="20" height="13" rx="6" fill="white" />
      {/* Waving arm — right side */}
      <path d="M38 40 Q44 36 42 30" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <circle cx="42" cy="29" r="2.5" fill="white" />
      {/* Left arm */}
      <path d="M18 42 Q12 40 13 35" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @keyframes vonaPulse {
    0%,100% { box-shadow: 0 4px 18px rgba(13,148,136,0.36), 0 0 0 0 rgba(13,148,136,0); }
    50%      { box-shadow: 0 6px 24px rgba(13,148,136,0.50), 0 0 0 8px rgba(13,148,136,0.07); }
  }
  @keyframes chatSlideUp {
    from { opacity:0; transform:translateY(16px) scale(0.97); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes bubblePop {
    from { opacity:0; transform:translateY(8px) scale(0.93); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes dotBounce {
    0%,80%,100% { transform:translateY(0); }
    40%         { transform:translateY(-6px); }
  }
  @keyframes navPulse {
    0%,100% { opacity:1; }
    50%     { opacity:0.6; }
  }
  .vona-btn { animation: vonaPulse 3s ease-in-out infinite; }
  .vona-btn:hover {
    animation: none !important;
    transform: scale(1.08) !important;
    box-shadow: 0 8px 28px rgba(13,148,136,0.55) !important;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease !important;
  }
  .nav-hint { animation: navPulse 1.4s ease-in-out infinite; }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingChat({ lang = 'en' }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING[lang] || GREETING.en }]);
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

  const handleInput = (e) => {
    setInput(e.target.value);
    if (redirectTimer.current) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = null;
      setPendingNav(null);
    }
  };

  const executeNav = (intent) => {
    if (intent.anchor) {
      const el = document.getElementById(intent.anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else router.push(`/${lang}#${intent.anchor}`);
    } else if (intent.path) {
      router.push(`/${lang}${intent.path}`);
    }
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
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), context: 'landing' }),
      });
      const aiMsg = { role: 'assistant', content: data.content, logId: data.logId || null };
      setMessages(prev => [...prev, aiMsg]);

      if (intent) {
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
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); }, []);

  return (
    <>
      <style suppressHydrationWarning>{CSS}</style>

      {/* Prompt bubble — Zoho-style clean card */}
      {showBubble && !open && (
        <div
          onClick={() => { dismiss(); setOpen(true); }}
          style={{
            position: 'fixed', bottom: 90, right: 24, zIndex: 9001,
            background: '#fff', borderRadius: 12, padding: '14px 16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.14)',
            cursor: 'pointer', minWidth: 210, maxWidth: 250,
            fontFamily: "'Inter', system-ui, sans-serif",
            animation: 'bubblePop 0.24s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Dismiss X */}
          <button
            onClick={e => { e.stopPropagation(); dismiss(); }}
            style={{
              position: 'absolute', top: 8, right: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#C0C0C0', padding: 2, display: 'flex',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {/* Online indicator + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>
              {ONLINE_TEXT[lang] || ONLINE_TEXT.en}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.45, paddingLeft: 15 }}>
            {BUBBLE_TEXT[lang] || BUBBLE_TEXT.en}
          </p>
          {/* Tail */}
          <div style={{ position: 'absolute', bottom: -7, right: 22, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid #fff', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))' }} />
        </div>
      )}

      {/* Floating button — friendly Zoho-style mascot */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Vona'}
        className={!open ? 'vona-btn' : ''}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9000,
          width: 56, height: 56, borderRadius: '50%',
          background: 'none',
          border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.18s, box-shadow 0.18s',
        }}
      >
        {open ? (
          /* Close — teal circle with X */
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 18px rgba(13,148,136,0.38)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </div>
        ) : (
          <VonaMascot size={56} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 8999,
          width: 'min(380px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 120px))',
          background: '#fff', borderRadius: 20,
          boxShadow: '0 16px 56px rgba(15,23,42,0.16)',
          border: '1px solid #E8DFD4',
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Inter', system-ui, sans-serif",
          overflow: 'hidden',
          animation: 'chatSlideUp 0.24s cubic-bezier(0.34,1.56,0.64,1)',
        }}>

          {/* Header — clean warm teal, no gradient, no robot */}
          <div style={{ padding: '14px 18px', background: '#0D9488', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Avatar: mascot */}
            <div style={{ width: 38, height: 38, flexShrink: 0 }}>
              <VonaMascot size={38} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.2px' }}>Vona</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', fontWeight: 400 }}>
                {lang === 'sq' ? 'Asistentja juaj e Kujdesit' : 'Your Care Assistant'}
              </div>
            </div>
            {/* Online indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A7F3D0' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.72)' }}>Online</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#FAFAF8' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.isNav ? (
                  <div
                    className="nav-hint"
                    onClick={() => { if (redirectTimer.current) { clearTimeout(redirectTimer.current); executeNav(pendingNav); } }}
                    style={{
                      maxWidth: '82%', padding: '9px 14px',
                      borderRadius: '16px 16px 16px 4px',
                      background: '#EFF9F7',
                      border: '1.5px solid rgba(13,148,136,0.25)',
                      color: '#0D6E65', fontSize: 13, lineHeight: 1.55,
                      cursor: 'pointer', fontWeight: 600,
                    }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <div style={{ maxWidth: '82%' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: m.emergency
                        ? 'linear-gradient(135deg,#FEF2F2,#FFF1F2)'
                        : m.role === 'user'
                          ? '#0D9488'
                          : '#fff',
                      border: m.emergency
                        ? '1.5px solid #FECACA'
                        : m.role === 'user'
                          ? 'none'
                          : '1px solid #EAE4DC',
                      boxShadow: m.role === 'user' ? 'none' : '0 1px 4px rgba(0,0,0,0.05)',
                      color: m.role === 'user' ? '#fff' : m.emergency ? '#DC2626' : '#1A2B3C',
                      fontSize: 13.5, lineHeight: 1.58, whiteSpace: 'pre-wrap',
                      fontWeight: m.emergency ? 600 : 400,
                    }}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' && m.logId && !m.emergency && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4, paddingLeft: 2 }}>
                        <button onClick={() => sendFeedback(m.logId, true)} title="Helpful" style={{ background: 'none', border: 'none', cursor: rated[m.logId] ? 'default' : 'pointer', padding: 2, opacity: rated[m.logId] === 'up' ? 1 : rated[m.logId] === 'down' ? 0.25 : 0.45, transition: 'opacity 0.15s' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={rated[m.logId] === 'up' ? '#16A34A' : 'none'} stroke={rated[m.logId] === 'up' ? '#16A34A' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                        </button>
                        <button onClick={() => sendFeedback(m.logId, false)} title="Not helpful" style={{ background: 'none', border: 'none', cursor: rated[m.logId] ? 'default' : 'pointer', padding: 2, opacity: rated[m.logId] === 'down' ? 1 : rated[m.logId] === 'up' ? 0.25 : 0.45, transition: 'opacity 0.15s' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill={rated[m.logId] === 'down' ? '#DC2626' : 'none'} stroke={rated[m.logId] === 'down' ? '#DC2626' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: '#fff', border: '1px solid #EAE4DC', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#C4C4C0', display: 'inline-block', animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          {messages.length === 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6, background: '#FAFAF8' }}>
              {(SUGGESTIONS[lang] || SUGGESTIONS.en).map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  fontSize: 12, fontWeight: 500, padding: '5px 11px', borderRadius: 20,
                  border: '1px solid rgba(13,148,136,0.22)', background: '#EFF9F7', color: '#0D6E65',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'background 0.14s, border-color 0.14s',
                }}>{s}</button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div style={{ padding: '10px 14px 14px', borderTop: '1px solid #EAE4DC', display: 'flex', gap: 8, alignItems: 'flex-end', background: '#fff' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={onKey}
              placeholder={PLACEHOLDER[lang] || PLACEHOLDER.en}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #E8DFD4', borderRadius: 12,
                padding: '9px 12px', fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
                lineHeight: 1.45, color: '#1A2B3C', background: '#FAF8F5',
                transition: 'border-color 0.15s', maxHeight: 100, overflowY: 'auto',
              }}
              onFocus={e => { e.target.style.borderColor = '#0D9488'; }}
              onBlur={e => { e.target.style.borderColor = '#E8DFD4'; }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                width: 38, height: 38, borderRadius: 11, border: 'none',
                cursor: loading || !input.trim() ? 'default' : 'pointer',
                background: loading || !input.trim() ? '#E8DFD4' : '#0D9488',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={loading || !input.trim() ? '#A0ACA8' : '#fff'}
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
