const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  login: (body) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/auth/me'),

  // Visits
  getVisits: () => apiFetch('/visits'),
  createVisit: (body) => apiFetch('/visits', { method: 'POST', body: JSON.stringify(body) }),
  updateVisit: (id, body) => apiFetch(`/visits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  completeVisit: (id, body) => apiFetch(`/visits/${id}/complete`, { method: 'POST', body: JSON.stringify(body) }),

  // Nurses
  getNurses: () => apiFetch('/nurses'),
  approveNurse: (id) => apiFetch(`/nurses/${id}/approve`, { method: 'PUT' }),
  suspendNurse: (id) => apiFetch(`/nurses/${id}/suspend`, { method: 'PUT' }),
  updateAvailability: (id, body) => apiFetch(`/nurses/${id}/availability`, { method: 'PUT', body: JSON.stringify(body) }),

  // Users
  getUsers: () => apiFetch('/users'),
  getUser: (id) => apiFetch(`/users/${id}`),

  // Analytics
  getAnalytics: () => apiFetch('/analytics'),

  // Payments
  getPayments: () => apiFetch('/payments'),

  // Notifications
  sendNotification: (body) => apiFetch('/notifications/send', { method: 'POST', body: JSON.stringify(body) }),

  // Settings
  getSettings: () => apiFetch('/settings'),
  updateSettings: (body) => apiFetch('/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Profile
  updateProfile: (body) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updatePassword: (body) => apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify(body) }),
  updateRelative: (id, body) => apiFetch(`/profile/relative/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
