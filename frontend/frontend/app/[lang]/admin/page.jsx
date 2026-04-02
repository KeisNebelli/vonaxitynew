'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const C = { teal: '#0e7490', tealLight: '#e0f2fe', sage: '#16a34a', sageLight: '#f0fdf4', amber: '#b45309', amberLight: '#fff7ed', red: '#dc2626', redLight: '#fef2f2', purple: '#7c3aed', purpleLight: '#f5f3ff', neutral: '#f8f7f4', neutralDark: '#1c1917', neutralMid: '#78716c', white: '#ffffff', border: '#e7e5e4', darkNav: '#0f172a' };

const USERS = [
  { id: 1, name: 'Arta Murati', email: 'client@test.com', country: 'UK', city: 'Tirana', plan: 'Standard', status: 'active', visits: 4, paid: 200 },
  { id: 2, name: 'Besnik Kola', email: 'besnik@test.com', country: 'Italy', city: 'Durrës', plan: 'Premium', status: 'active', visits: 8, paid: 480 },
  { id: 3, name: 'Donika Cela', email: 'donika@test.com', country: 'USA', city: 'Shkodër', plan: 'Premium', status: 'trial', visits: 0, paid: 0 },
];
const NURSES = [
  { id: 1, name: 'Elona Berberi', email: 'nurse@test.com', city: 'Tirana', status: 'approved', rating: 4.8, visits: 47, earnings: 940 },
  { id: 2, name: 'Mirjeta Doshi', email: 'mirjeta@test.com', city: 'Durrës', status: 'approved', rating: 4.6, visits: 31, earnings: 620 },
  { id: 3, name: 'Arjana Teli', email: 'arjana@test.com', city: 'Tirana', status: 'pending', rating: 0, visits: 0, earnings: 0 },
];
const VISITS = [
  { id: 1, client: 'Fatmira Murati', nurse: 'Elona Berberi', city: 'Tirana', service: 'BP + Glucose', date: '2024-12-20', status: 'upcoming' },
  { id: 2, client: 'Shqipe Kola', nurse: 'Mirjeta Doshi', city: 'Durrës', service: 'Welfare Check', date: '2024-12-19', status: 'completed' },
  { id: 3, client: 'Ndrek Hoxha', nurse: null, city: 'Tirana', service: 'Blood Work', date: '2024-12-22', status: 'unassigned' },
];
const PAYMENTS = [
  { id: 1, user: 'Besnik Kola', plan: 'Premium', amount: 120, date: '2024-12-01', status: 'paid' },
  { id: 2, user: 'Arta Murati', plan: 'Standard', amount: 50, date: '2024-12-01', status: 'paid' },
  { id: 3, user: 'Gjon Marku', plan: 'Standard', amount: 50, date: '2024-11-22', status: 'failed' },
];

const ADMIN_NAV = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'nurses', label: 'Nurses', icon: '👩‍⚕️' },
  { id: 'users', label: 'Clients', icon: '👥' },
  { id: 'visits', label: 'Visits', icon: '🗓️' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const Badge = ({ label, color, bg }) => <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: bg, color, display: 'inline-block', whiteSpace: 'nowrap' }}>{label}</span>;

function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }) {
  return (
    <div style={{ width: collapsed ? 58 : 210, background: C.darkNav, display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'sticky', top: 0, transition: 'width 0.2s', flexShrink: 0 }}>
      <div style={{ padding: '14px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Georgia,serif' }}>Von<span style={{ color: '#4ade80' }}>ax</span>ity</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>ADMIN</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{collapsed ? '→' : '←'}</button>
      </div>
      <nav style={{ flex: 1, padding: '10px 5px' }}>
        {ADMIN_NAV.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px 0' : '10px 10px', borderRadius: 8, border: 'none', background: active === item.id ? 'rgba(8,145,178,0.25)' : 'transparent', color: active === item.id ? C.tealLight : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: active === item.id ? 700 : 400, marginBottom: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
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

function Overview({ setActive }) {
  const revenue = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const unassigned = VISITS.filter(v => v.status === 'unassigned').length;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[['👥', 'Clients', USERS.length, C.teal], ['👩‍⚕️', 'Nurses', NURSES.length, C.purple], ['💳', 'Active subs', USERS.filter(u => u.status === 'active').length, C.sage], ['💰', 'Revenue', `€${revenue}`, C.sage], ['⚠️', 'Unassigned', unassigned, unassigned > 0 ? C.red : C.neutralMid]].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
      {unassigned > 0 && (
        <div style={{ background: C.redLight, border: '1px solid rgba(220,38,38,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.red, fontWeight: 600 }}>⚠️ {unassigned} visit{unassigned > 1 ? 's' : ''} need a nurse assigned</span>
          <button onClick={() => setActive('visits')} style={{ fontSize: 12, padding: '6px 14px', background: C.red, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Assign now →</button>
        </div>
      )}
      {NURSES.filter(n => n.status === 'pending').length > 0 && (
        <div style={{ background: C.amberLight, border: '1px solid rgba(180,83,9,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: C.amber, fontWeight: 600 }}>👩‍⚕️ {NURSES.filter(n => n.status === 'pending').length} nurse application(s) pending review</span>
          <button onClick={() => setActive('nurses')} style={{ fontSize: 12, padding: '6px 14px', background: C.amber, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Review →</button>
        </div>
      )}
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.neutralDark, marginBottom: 14 }}>Recent visits</div>
        {VISITS.slice(0, 3).map(v => (
          <div key={v.id} style={{ padding: '10px 0', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark }}>{v.client}</div>
              <div style={{ fontSize: 11, color: C.neutralMid }}>{v.service} · {v.city} · {v.date}</div>
              <div style={{ fontSize: 11, color: v.nurse ? C.neutralMid : C.red }}>{v.nurse ? `👩‍⚕️ ${v.nurse}` : '⚠️ No nurse assigned'}</div>
            </div>
            <Badge label={v.status === 'completed' ? '✓ Done' : v.status === 'unassigned' ? '⚠ Unassigned' : 'Upcoming'} color={v.status === 'completed' ? C.sage : v.status === 'unassigned' ? C.red : C.teal} bg={v.status === 'completed' ? C.sageLight : v.status === 'unassigned' ? C.redLight : C.tealLight} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NurseManagement() {
  const [nurses, setNurses] = useState(NURSES);
  const update = (id, status) => setNurses(nurses.map(n => n.id === id ? { ...n, status } : n));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button style={{ fontSize: 12, padding: '8px 16px', background: C.teal, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>+ Add Nurse</button>
      </div>
      {nurses.map(n => (
        <div key={n.id} style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: n.status === 'approved' ? C.teal : n.status === 'pending' ? C.amber : C.red, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                {n.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark }}>{n.name}</div>
                <div style={{ fontSize: 12, color: C.neutralMid }}>{n.email} · 📍 {n.city}</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Badge label={n.status === 'approved' ? '✓ Approved' : n.status === 'pending' ? '⏳ Pending' : 'Suspended'} color={n.status === 'approved' ? C.sage : n.status === 'pending' ? C.amber : C.red} bg={n.status === 'approved' ? C.sageLight : n.status === 'pending' ? C.amberLight : C.redLight} />
                  {n.rating > 0 && <span style={{ fontSize: 12, color: C.amber }}>⭐ {n.rating}</span>}
                  {n.visits > 0 && <span style={{ fontSize: 12, color: C.neutralMid }}>🏥 {n.visits} visits · 💰 €{n.earnings}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {n.status === 'pending' && (
                <>
                  <button onClick={() => update(n.id, 'approved')} style={{ fontSize: 12, padding: '7px 14px', background: C.sage, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>✓ Approve</button>
                  <button onClick={() => update(n.id, 'suspended')} style={{ fontSize: 12, padding: '7px 14px', background: C.redLight, color: C.red, border: 'none', borderRadius: 8, cursor: 'pointer' }}>✗ Reject</button>
                </>
              )}
              {n.status === 'approved' && <button onClick={() => update(n.id, 'suspended')} style={{ fontSize: 12, padding: '7px 14px', background: C.neutral, color: C.neutralMid, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer' }}>Suspend</button>}
              {n.status === 'suspended' && <button onClick={() => update(n.id, 'approved')} style={{ fontSize: 12, padding: '7px 14px', background: C.sageLight, color: C.sage, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Reinstate</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function VisitManagement() {
  const [visits, setVisits] = useState(VISITS);
  const [assigning, setAssigning] = useState(null);
  const assign = (visitId, nurse) => {
    setVisits(visits.map(v => v.id === visitId ? { ...v, nurse, status: 'upcoming' } : v));
    setAssigning(null);
  };
  return (
    <div>
      {visits.map(v => (
        <div key={v.id} style={{ background: C.white, borderRadius: 14, border: `1px solid ${v.status === 'unassigned' ? 'rgba(220,38,38,0.3)' : C.border}`, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.neutralDark, marginBottom: 4 }}>{v.client}</div>
              <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>{v.service}</div>
              <div style={{ fontSize: 12, color: C.neutralMid }}>📅 {v.date} · 📍 {v.city}</div>
              <div style={{ fontSize: 12, color: v.nurse ? C.neutralMid : C.red, fontWeight: v.nurse ? 400 : 700, marginTop: 3 }}>
                {v.nurse ? `👩‍⚕️ ${v.nurse}` : '⚠️ No nurse assigned'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setAssigning(assigning === v.id ? null : v.id)} style={{ fontSize: 12, padding: '7px 14px', background: v.status === 'unassigned' ? C.teal : C.neutral, color: v.status === 'unassigned' ? '#fff' : C.neutralMid, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                {v.status === 'unassigned' ? 'Assign Nurse' : 'Reassign'}
              </button>
              <button style={{ fontSize: 12, padding: '7px 14px', background: C.redLight, color: C.red, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
          {assigning === v.id && (
            <div style={{ marginTop: 12, background: C.neutral, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.neutralDark, marginBottom: 10 }}>Select nurse for {v.city}:</div>
              {NURSES.filter(n => n.status === 'approved' && n.city === v.city).map(n => (
                <button key={n.id} onClick={() => assign(v.id, n.name)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 14px', background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', marginBottom: 6, textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark }}>{n.name}</div>
                    <div style={{ fontSize: 11, color: C.neutralMid }}>⭐ {n.rating} · {n.visits} visits</div>
                  </div>
                  <span style={{ fontSize: 12, color: C.teal, fontWeight: 700 }}>Assign →</span>
                </button>
              ))}
              {NURSES.filter(n => n.status === 'approved' && n.city === v.city).length === 0 && (
                <div style={{ fontSize: 13, color: C.red }}>No approved nurses in {v.city} yet.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Payments() {
  const total = PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 12, marginBottom: 24 }}>
        {[['💰', 'Total revenue', `€${total}`, C.sage], ['✅', 'Successful', PAYMENTS.filter(p => p.status === 'paid').length, C.sage], ['⚠️', 'Failed', PAYMENTS.filter(p => p.status === 'failed').length, C.red]].map(([icon, label, value, color]) => (
          <div key={label} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 11, color: C.neutralMid, marginTop: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {PAYMENTS.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < PAYMENTS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark }}>{p.user}</div>
              <div style={{ fontSize: 11, color: C.neutralMid }}>{p.date} · {p.plan}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>€{p.amount}</div>
              <Badge label={p.status === 'paid' ? '✓ Paid' : '✗ Failed'} color={p.status === 'paid' ? C.sage : C.red} bg={p.status === 'paid' ? C.sageLight : C.redLight} />
              {p.status === 'failed' && <button style={{ fontSize: 11, padding: '5px 10px', background: C.amberLight, color: C.amber, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Retry</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Settings() {
  const [settings, setSettings] = useState({ payPerVisit: 20, trialDays: 7, basicPrice: 30, standardPrice: 50, premiumPrice: 120 });
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ maxWidth: 500 }}>
      {[['Nurse pay per visit (€)', 'payPerVisit'], ['Trial period (days)', 'trialDays'], ['Basic plan price (€)', 'basicPrice'], ['Standard plan price (€)', 'standardPrice'], ['Premium plan price (€)', 'premiumPrice']].map(([label, key]) => (
        <div key={key} style={{ background: C.white, borderRadius: 10, border: `1px solid ${C.border}`, padding: '14px 18px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: C.neutralDark }}>{label}</label>
          <input type="number" value={settings[key]} onChange={e => setSettings({ ...settings, [key]: Number(e.target.value) })} style={{ width: 80, padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, fontWeight: 700, textAlign: 'center', outline: 'none' }} />
        </div>
      ))}
      <button onClick={() => setSaved(true)} style={{ width: '100%', background: C.teal, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
        {saved ? '✓ Saved' : 'Save settings'}
      </button>
    </div>
  );
}

export default function AdminPage({ params }) {
  const lang = params.lang || 'en';
  const router = useRouter();
  const [active, setActive] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    document.cookie = 'vonaxity-token=;path=/;max-age=0';
    document.cookie = 'vonaxity-role=;path=/;max-age=0';
    router.push(`/${lang}/login`);
  };

  const titles = { overview: 'Admin Overview', nurses: 'Nurse Management', users: 'Client Management', visits: 'Visit Management', payments: 'Payments', analytics: 'Analytics', settings: 'Settings' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui,sans-serif', background: C.neutral }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={logout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ padding: '0 24px', height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.white, flexShrink: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.neutralDark }}>{titles[active]}</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {VISITS.filter(v => v.status === 'unassigned').length > 0 && (
              <button onClick={() => setActive('visits')} style={{ fontSize: 11, padding: '5px 10px', background: C.redLight, color: C.red, border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>
                ⚠️ {VISITS.filter(v => v.status === 'unassigned').length} unassigned
              </button>
            )}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.teal, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>A</div>
          </div>
        </div>
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {active === 'overview' && <Overview setActive={setActive} />}
          {active === 'nurses' && <NurseManagement />}
          {active === 'users' && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              {USERS.map((u, i) => (
                <div key={u.id} style={{ padding: '14px 20px', borderBottom: i < USERS.length - 1 ? `1px solid ${C.border}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.neutralDark }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: C.neutralMid }}>{u.email} · 🌍 {u.country} → {u.city}</div>
                    <div style={{ fontSize: 12, color: C.neutralMid }}>🏥 {u.visits} visits · 💰 €{u.paid}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge label={u.plan} color={u.plan === 'Premium' ? C.amber : u.plan === 'Standard' ? C.purple : C.teal} bg={u.plan === 'Premium' ? C.amberLight : u.plan === 'Standard' ? C.purpleLight : C.tealLight} />
                    <Badge label={u.status === 'active' ? '✓ Active' : u.status === 'trial' ? 'Trial' : 'Cancelled'} color={u.status === 'active' ? C.sage : u.status === 'trial' ? C.purple : C.neutralMid} bg={u.status === 'active' ? C.sageLight : u.status === 'trial' ? C.purpleLight : C.neutral} />
                    <button style={{ fontSize: 11, padding: '5px 10px', background: C.tealLight, color: C.teal, border: 'none', borderRadius: 6, cursor: 'pointer' }}>View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {active === 'visits' && <VisitManagement />}
          {active === 'payments' && <Payments />}
          {active === 'analytics' && (
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24, fontSize: 14, color: C.neutralMid }}>
              Full analytics charts coming in Phase 2. Revenue this month: <strong style={{ color: C.sage }}>€{PAYMENTS.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)}</strong>
            </div>
          )}
          {active === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
