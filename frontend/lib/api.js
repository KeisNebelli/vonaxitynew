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
  registerNurse: (body) => apiFetch('/auth/register-nurse', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => { setToken(null); return Promise.resolve({ success: true }); },
  me: () => apiFetch('/auth/me'),

  // Visits
  getVisits: () => apiFetch('/visits'),
  createVisit: (body) => apiFetch('/visits', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
  createCheckout: (plan) => apiFetch('/payments/create-checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
  createPortal: () => apiFetch('/payments/create-portal', { method: 'POST' }),
  uploadNurseDoc: async (file, type) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vonaxity-token') : null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await fetch(`${BASE}/uploads/nurse-doc`, {
      method: 'POST',
      headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
  getOpenVisits: () => apiFetch('/visits/open'),
  applyToVisit: (visitId, body={}) => apiFetch(`/visits/${visitId}/apply`, { method: 'POST', body: JSON.stringify(body) }),
  getApplicants: (visitId) => apiFetch(`/visits/${visitId}/applicants`),
  selectNurse: (visitId, nurseId) => apiFetch(`/visits/${visitId}/select/${nurseId}`, { method: 'POST' }),
  updateVisit: (id, body) => apiFetch(`/visits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  completeVisit: (id, body) => apiFetch(`/visits/${id}/complete`, { method: 'POST', body: JSON.stringify(body) }),

  // Nurses
  getNurses: () => apiFetch('/nurses'),
  approveNurse: (id) => apiFetch(`/nurses/${id}/approve`, { method: 'PUT' }),
  suspendNurse: (id) => apiFetch(`/nurses/${id}/suspend`, { method: 'PUT' }),
  rejectNurse: (id, body) => apiFetch(`/nurses/${id}/reject`, { method: 'PUT', body: JSON.stringify(body) }),
  updateAvailability: (id, body) => apiFetch(`/nurses/${id}/availability`, { method: 'PUT', body: JSON.stringify(body) }),
  submitNurseOnboarding: (body) => apiFetch('/nurses/me/onboarding', { method: 'PUT', body: JSON.stringify(body) }),
  saveNurseProfile: (body) => apiFetch('/nurses/me/profile', { method: 'PUT', body: JSON.stringify(body) }),

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
