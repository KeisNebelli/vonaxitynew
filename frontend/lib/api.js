const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vonaxity-token');
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem('vonaxity-token', token);
  else localStorage.removeItem('vonaxity-token');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => { setToken(null); return Promise.resolve({ success: true }); },
  me: () => apiFetch('/auth/me'),
  getVisits: () => apiFetch('/visits'),
  createVisit: (body) => apiFetch('/visits', { method: 'POST', body: JSON.stringify(body) }),
  updateVisit: (id, body) => apiFetch(`/visits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  completeVisit: (id, body) => apiFetch(`/visits/${id}/complete`, { method: 'POST', body: JSON.stringify(body) }),
  getNurses: () => apiFetch('/nurses'),
  approveNurse: (id) => apiFetch(`/nurses/${id}/approve`, { method: 'PUT' }),
  suspendNurse: (id) => apiFetch(`/nurses/${id}/suspend`, { method: 'PUT' }),
  updateAvailability: (id, body) => apiFetch(`/nurses/${id}/availability`, { method: 'PUT', body: JSON.stringify(body) }),
  getUsers: () => apiFetch('/users'),
  getUser: (id) => apiFetch(`/users/${id}`),
  getAnalytics: () => apiFetch('/analytics'),
  getPayments: () => apiFetch('/payments'),
  sendNotification: (body) => apiFetch('/notifications/send', { method: 'POST', body: JSON.stringify(body) }),
  getSettings: () => apiFetch('/settings'),
  updateSettings: (body) => apiFetch('/settings', { method: 'PUT', body: JSON.stringify(body) }),
  updateProfile: (body) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updatePassword: (body) => apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify(body) }),
  updateRelative: (id, body) => apiFetch(`/profile/relative/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
