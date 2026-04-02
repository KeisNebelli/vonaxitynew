'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', sageLight: '#f0fdf4', amber: '#b45309', amberLight: '#fff7ed', red: '#dc2626', redLight: '#fef2f2', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4', dark: '#0f172a' };

const NAV = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'visits', label: 'My Visits', icon: '🗓️' },
  { id: 'subscription', label: 'Subscription', icon: '💳' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

// Mock data for test version
const MOCK = {
  user: { name: 'Arta Murati', email: 'client@test.com', plan: 'Standard', country: 'UK' },
  relative: { name: 'Fatmira Murati', city: 'Tirana', address: 'Rruga e Elbasanit 14', nurse: 'Elona Berberi' },
  visits: [
    { id: 1, date: '2024-12-20', time: '10:00', service: 'Blood Pressure + Glucose', status: 'upcoming', nurse: 'Elona Berberi' },
    { id: 2, date: '2024-11-28', time: '10:00', service: 'Blood Pressure Check', status: 'completed', nurse: 'Elona Berberi', bp: '128/82', glucose: '5.4', notes: 'Patient in good spirits. BP slightly elevated.' },
  ],
};

function Sidebar({ active, setActive, user, onLogout }) {
  return (
    <div style={{ width: 200, background: C.dark, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
      <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif', marginBottom: 10 }}>Von<span style={{ color: '#4ade80' }}>ax</span>ity</div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
          {user?.name?.split(' ').map(w => w[0]).join('') || 'U'}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{user?.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Client</div>
      </div>
      <nav style={{ flex: 1, padding: '10px 6px' }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 8, border: 'none', background: active === item.id ? 'rgba(8,145,178,0.25)' : 'transparent', color: active === item.id ? C.tealLight : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: active === item.id ? 700 : 400, marginBottom: 2, textAlign: 'left' }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onLogout} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out</button>
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div>
      <div style={{ background: C.tealLight, borderRadius: 12, border: '1px solid rgba(8,145,178,0.2)', padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: 24 }}>👋</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>Welcome back, {MOCK.user.name}</div>
          <div style={{ fontSize: 13, color: C.neutralMid }}>Next visit for {MOCK.relative.name}: <strong>Dec 20 at 10:00</strong> with {MOCK.relative.nurse}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[['💳', 'Plan', MOCK.user.plan, C.teal], ['🗓️', 'Visits used', '1 / 2', C.neutralDark], ['⏰', 'Next visit', 'Dec 20', C.sage], ['❤️', 'Last BP', '128/82', C.amber]].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark, marginBottom: 14 }}>Loved one details</div>
        {[['Name', MOCK.relative.name], ['City', MOCK.relative.city], ['Address', MOCK.relative.address], ['Assigned nurse', MOCK.relative.nurse]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
            <span style={{ color: C.neutralMid }}>{k}</span>
            <span style={{ color: C.neutralDark, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Visits() {
  return (
    <div>
      {MOCK.visits.map(v => (
        <div key={v.id} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark, marginBottom: 3 }}>{v.service}</div>
              <div style={{ fontSize: 12, color: C.neutralMid }}>📅 {v.date} at {v.time} · 👩‍⚕️ {v.nurse}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: v.status === 'completed' ? C.sageLight : C.tealLight, color: v.status === 'completed' ? C.sage : C.teal, height: 'fit-content' }}>
              {v.status === 'completed' ? '✓ Completed' : '⏰ Upcoming'}
            </span>
          </div>
          {v.status === 'completed' && (
            <div style={{ background: C.neutral, borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
                {v.bp && <span><strong>BP:</strong> {v.bp}</span>}
                {v.glucose && <span><strong>Glucose:</strong> {v.glucose} mmol/L</span>}
              </div>
              <div style={{ color: C.neutralMid }}>{v.notes}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { overview: 'Dashboard', visits: 'My Visits', subscription: 'Subscription', settings: 'Settings' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui,sans-serif', background: C.neutral }}>
      <Sidebar active={active} setActive={setActive} user={MOCK.user} onLogout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '0 24px', height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.white, flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>{titles[active]}</div>
          <div style={{ fontSize: 12, color: C.neutralMid }}>🟢 {MOCK.user.plan} Plan</div>
        </div>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {active === 'overview' && <Overview />}
          {active === 'visits' && <Visits />}
          {active === 'subscription' && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.neutralDark, marginBottom: 4 }}>Standard Plan</div>
              <div style={{ fontSize: 15, color: C.teal, fontWeight: 600, marginBottom: 20 }}>€50/month · 2 visits</div>
              <button style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Upgrade to Premium</button>
            </div>
          )}
          {active === 'settings' && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, fontSize: 14, color: C.neutralMid }}>
              Account settings coming in Phase 2.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
