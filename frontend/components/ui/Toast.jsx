'use client';
import { useState, useEffect } from 'react';

const F = "'DM Sans','Inter',system-ui,sans-serif";
const listeners = [];

export function toast(message, type = 'success', duration = 3500) {
  const id = Date.now() + Math.random();
  listeners.forEach(fn => fn({ id, message, type, duration }));
}
export const toastSuccess = (msg) => toast(msg, 'success');
export const toastError   = (msg) => toast(msg, 'error');
export const toastWarning = (msg) => toast(msg, 'warning');
export const toastInfo    = (msg) => toast(msg, 'info');

const STYLES = {
  success: { bg:'#ECFDF5', color:'#059669', border:'#A7F3D0' },
  error:   { bg:'#FEF2F2', color:'#DC2626', border:'#FECACA' },
  warning: { bg:'#FFFBEB', color:'#D97706', border:'#FDE68A' },
  info:    { bg:'#EFF6FF', color:'#2563EB', border:'#BFDBFE' },
};

function Icon({ type }) {
  if (type === 'success') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  if (type === 'error')   return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
  if (type === 'warning') return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), t.duration);
    };
    listeners.push(handler);
    return () => { const i = listeners.indexOf(handler); if (i > -1) listeners.splice(i, 1); };
  }, []);

  if (!toasts.length) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn  { from { opacity:0; transform:translateY(12px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes toastOut { from { opacity:1; } to { opacity:0; transform:translateY(6px); } }
        .vonaxity-toast { animation: toastIn 0.22s cubic-bezier(0.16,1,0.3,1); }
      `}</style>
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:99999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
        {toasts.map(t => {
          const s = STYLES[t.type] || STYLES.info;
          return (
            <div key={t.id} className="vonaxity-toast" style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'12px 18px', borderRadius:11, fontSize:14, fontWeight:600,
              background:s.bg, color:s.color, border:`1px solid ${s.border}`,
              boxShadow:'0 4px 20px rgba(0,0,0,0.10)', maxWidth:360, fontFamily:F,
              lineHeight:1.4,
            }}>
              <Icon type={t.type} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
