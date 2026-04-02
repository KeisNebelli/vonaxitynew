'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', sageLight: '#f0fdf4', amber: '#b45309', amberLight: '#fff7ed', red: '#dc2626', redLight: '#fef2f2', purple: '#7c3aed', purpleLight: '#f5f3ff', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4', darkNav: '#1e293b' };

const MOCK_NURSE = { name: 'Elona Berberi', city: 'Tirana', phone: '+355 69 123 4567', email: 'nurse@test.com', status: 'approved', rating: 4.8, totalVisits: 47, initials: 'EB', earnings: { total: 940, pending: 120, thisMonth: 200 }, availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'] };
const MOCK_VISITS = [
  { id: 1, clientName: 'Fatmira Murati', address: 'Rruga e Elbasanit 14, Tirana', service: 'Blood Pressure + Glucose', date: '2024-12-20', time: '10:00', status: 'upcoming', notes: 'Patient has diabetes. Bring glucose kit.', phone: '+355 69 000 1111', age: 74 },
  { id: 2, clientName: 'Besnik Kola', address: 'Bulevardi Bajram Curri 5, Tirana', service: 'Vitals Monitoring', date: '2024-12-20', time: '14:30', status: 'upcoming', notes: '', phone: '+355 69 000 2222', age: 68 },
  { id: 3, clientName: 'Lirije Hoxha', address: 'Rruga Myslym Shyri 22, Tirana', service: 'Welfare Check', date: '2024-12-19', time: '09:00', status: 'completed', notes: '', phone: '+355 69 000 3333', age: 81, vitals: { bp: '126/80', hr: '72', glucose: '5.2', notes: 'Patient well. Mild fatigue reported.' } },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'visits', label: 'My Visits', icon: '🗓️' },
  { id: 'complete', label: 'Complete Visit', icon: '📝' },
  { id: 'earnings', label: 'Earnings', icon: '💰' },
  { id: 'profile', label: 'My Profile', icon: '👤' },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <div style={{ width: collapsed ? 58 : 200, background: C.darkNav, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0, transition: 'width 0.2s', flexShrink: 0 }}>
      <div style={{ padding: '14px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif' }}>Von<span style={{ color: '#4ade80' }}>ax</span>ity</div>}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{collapsed ? '→' : '←'}</button>
      </div>
      {!collapsed && (
        <div style={{ padding: '12px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{MOCK_NURSE.initials}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{MOCK_NURSE.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{MOCK_NURSE.city} · Nurse</div>
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(74,222,128,0.15)', color: '#4ade80', display: 'inline-block' }}>✓ Approved</div>
        </div>
      )}
      <nav style={{ flex: 1, padding: '10px 5px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 10px', borderRadius: 8, border: 'none', background: active === item.id ? 'rgba(8,145,178,0.25)' : 'transparent', color: active === item.id ? C.tealLight : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: active === item.id ? 700 : 400, marginBottom: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {!collapsed && (
        <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onLogout} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const today = MOCK_VISITS.filter(v => v.date === '2024-12-20');
  return (
    <div>
      <div style={{ background: C.tealLight, borderRadius: 12, border: '1px solid rgba(8,145,178,0.2)', padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 24 }}>👋</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>Good morning, {MOCK_NURSE.name}</div>
          <div style={{ fontSize: 13, color: C.neutralMid }}>You have <strong>{today.length} visits</strong> today. First at <strong>{today[0]?.time}</strong></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[['🗓️', "Today's visits", today.length, C.teal], ['✅', 'Total completed', MOCK_NURSE.totalVisits, C.sage], ['⭐', 'Rating', MOCK_NURSE.rating, C.amber], ['💰', 'This month', `€${MOCK_NURSE.earnings.thisMonth}`, C.purple]].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 14 }}>Today's schedule</div>
        {today.map(v => (
          <div key={v.id} style={{ padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{v.clientName}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>{v.time}</div>
            </div>
            <div style={{ fontSize: 12, color: C.neutralMid }}>{v.service} · 📍 {v.address}</div>
            {v.notes && <div style={{ fontSize: 12, color: C.amber, marginTop: 3 }}>📋 {v.notes}</div>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: '#fff7ed', borderRadius: 10, border: '1px solid #fed7aa', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span>⚠️</span>
        <span style={{ fontSize: 13, color: '#92400e' }}>Non-emergency care only. Medical emergency: call <strong>127</strong></span>
      </div>
    </div>
  );
}

function Visits({ setActive, setSelectedVisit }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? MOCK_VISITS : MOCK_VISITS.filter(v => v.status === filter);
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'upcoming', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, background: filter === f ? C.teal : C.neutral, color: filter === f ? '#fff' : C.neutralMid }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      {filtered.map(v => (
        <div key={v.id} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>{v.clientName}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: v.status === 'completed' ? C.sageLight : C.tealLight, color: v.status === 'completed' ? C.sage : C.teal }}>
                  {v.status === 'completed' ? '✓ Completed' : '⏰ Upcoming'}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 3 }}>{v.service}</div>
              <div style={{ fontSize: 12, color: C.neutralMid }}>📅 {v.date} at {v.time} · Age: {v.age}</div>
              <div style={{ fontSize: 12, color: C.neutralMid }}>📍 {v.address}</div>
              {v.notes && <div style={{ fontSize: 12, color: C.amber, marginTop: 4 }}>📋 {v.notes}</div>}
            </div>
            {v.status === 'upcoming' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => { setSelectedVisit(v); setActive('complete'); }} style={{ fontSize: 12, padding: '7px 14px', background: C.teal, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Complete Visit</button>
                <button style={{ fontSize: 12, padding: '7px 14px', background: C.sageLight, color: C.sage, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>On My Way 🚗</button>
              </div>
            )}
          </div>
          {v.vitals && (
            <div style={{ marginTop: 10, background: C.neutral, borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12 }}>
              <span><strong>BP:</strong> {v.vitals.bp}</span>
              <span><strong>HR:</strong> {v.vitals.hr} bpm</span>
              <span><strong>Glucose:</strong> {v.vitals.glucose}</span>
              <span style={{ color: C.neutralMid }}>{v.vitals.notes}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CompleteVisit({ visit, setActive }) {
  const v = visit || MOCK_VISITS[0];
  const [form, setForm] = useState({ bp: '', hr: '', glucose: '', temp: '', oxygen: '', notes: '', status: 'arrived' });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: C.neutralDark, marginBottom: 12 }}>Visit report submitted!</h3>
      <p style={{ fontSize: 14, color: C.neutralMid, marginBottom: 20 }}>Report for <strong>{v.clientName}</strong> saved and sent to client family.</p>
      <button onClick={() => { setSubmitted(false); setActive('visits'); }} style={{ background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Back to visits</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ background: C.tealLight, borderRadius: 10, padding: '12px 16px', marginBottom: 20, border: '1px solid rgba(8,145,178,0.2)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.teal }}>{v.clientName}</div>
        <div style={{ fontSize: 12, color: C.neutralMid }}>{v.service} · {v.date} at {v.time}</div>
      </div>
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 12 }}>📍 Live status</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['on-the-way', '🚗 On the way'], ['arrived', '📍 Arrived'], ['in-progress', '🏥 In progress']].map(([val, label]) => (
            <button key={val} onClick={() => setForm({ ...form, status: val })} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, background: form.status === val ? C.teal : C.neutral, color: form.status === val ? '#fff' : C.neutralMid }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 14 }}>📊 Vitals</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[['bp', 'Blood Pressure', 'e.g. 128/82'], ['hr', 'Heart Rate (bpm)', 'e.g. 72'], ['glucose', 'Glucose (mmol/L)', 'e.g. 5.4'], ['temp', 'Temperature (°C)', 'e.g. 36.8'], ['oxygen', 'O₂ Saturation (%)', 'e.g. 97']].map(([key, label, ph]) => (
            <div key={key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: C.neutralDark, display: 'block', marginBottom: 4 }}>{label}</label>
              <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 10 }}>📝 Nurse notes</div>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Describe the visit, patient condition, observations..." style={{ width: '100%', minHeight: 90, padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
      </div>
      <button onClick={() => setSubmitted(true)} style={{ width: '100%', background: C.teal, color: '#fff', border: 'none', borderRadius: 12, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
        ✅ Submit Visit Report
      </button>
    </div>
  );
}

function Earnings() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[['💰', 'Total earned', `€${MOCK_NURSE.earnings.total}`, C.sage], ['⏳', 'Pending', `€${MOCK_NURSE.earnings.pending}`, C.amber], ['📅', 'This month', `€${MOCK_NURSE.earnings.thisMonth}`, C.teal], ['🏥', 'Total visits', MOCK_NURSE.totalVisits, C.purple]].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 14 }}>Payment history</div>
        <div style={{ background: C.neutral, borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: C.neutralMid }}>
          💡 Pay rate: <strong style={{ color: C.neutralDark }}>€20 per visit</strong> · Paid weekly
        </div>
        {[['Dec 10–14', 4, 80, 'paid'], ['Dec 3–7', 3, 60, 'paid'], ['Nov 26–30', 4, 80, 'pending']].map(([period, visits, amount, status], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark }}>{period}</div>
              <div style={{ fontSize: 12, color: C.neutralMid }}>{visits} visits</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>€{amount}</div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: status === 'paid' ? C.sageLight : C.amberLight, color: status === 'paid' ? C.sage : C.amber }}>
                {status === 'paid' ? '✓ Paid' : '⏳ Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NursePage({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { dashboard: 'Nurse Dashboard', visits: 'My Visits', complete: 'Complete Visit', earnings: 'Earnings', profile: 'My Profile' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui,sans-serif', background: C.neutral }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '0 24px', height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.white, flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>{titles[active]}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.neutralMid }}>🟢 On duty</span>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>EB</div>
          </div>
        </div>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {active === 'dashboard' && <Dashboard />}
          {active === 'visits' && <Visits setActive={setActive} setSelectedVisit={setSelectedVisit} />}
          {active === 'complete' && <CompleteVisit visit={selectedVisit} setActive={setActive} />}
          {active === 'earnings' && <Earnings />}
          {active === 'profile' && <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, fontSize: 14, color: C.neutralMid }}>Profile editing coming in Phase 2.</div>}
        </main>
      </div>
    </div>
  );
}
