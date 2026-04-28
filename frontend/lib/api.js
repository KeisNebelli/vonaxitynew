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
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    if (res.status === 401) {
      // Clear invalid token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vonaxity-token');
        document.cookie = 'vonaxity-token=;path=/;max-age=0';
      }
    }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }
    throw err;
  }
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
  editVisit: (id, body) => apiFetch(`/visits/${id}/client`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteVisit: (id) => apiFetch(`/visits/${id}`, { method: 'DELETE' }),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => apiFetch('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
  createCheckout: (plan, lang='en') => apiFetch('/payments/create-checkout', { method: 'POST', body: JSON.stringify({ plan, lang }) }),
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
  getOpenVisits: (allCities=false) => apiFetch(`/visits/open${allCities ? '?allCities=true' : ''}`),
  reviewVisit: (visitId, body) => apiFetch(`/visits/${visitId}/review`, { method: 'POST', body: JSON.stringify(body) }),
  applyToVisit: (visitId, body={}) => apiFetch(`/visits/${visitId}/apply`, { method: 'POST', body: JSON.stringify(body) }),
  getApplicants: (visitId) => apiFetch(`/visits/${visitId}/applicants`),
  selectNurse: (visitId, nurseId) => apiFetch(`/visits/${visitId}/select/${nurseId}`, { method: 'POST' }),
  updateVisit: (id, body) => apiFetch(`/visits/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateVisitStatus: (id, status) => apiFetch(`/visits/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  completeVisit: (id, body) => apiFetch(`/visits/${id}/complete`, { method: 'POST', body: JSON.stringify(body) }),

  // Public nurses (no auth)
  getPublicNurses: () => apiFetch('/nurses/public'),
  getPublicNurse: (id) => apiFetch(`/nurses/public/${id}`),

  // Nurses
  getNurses: () => apiFetch('/nurses'),
  approveNurse: (id) => apiFetch(`/nurses/${id}/approve`, { method: 'PUT' }),
  suspendNurse: (id) => apiFetch(`/nurses/${id}/suspend`, { method: 'PUT' }),
  rejectNurse: (id, body) => apiFetch(`/nurses/${id}/reject`, { method: 'PUT', body: JSON.stringify(body) }),
  editNurse: (id, body) => apiFetch(`/nurses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateAvailability: (id, body) => apiFetch(`/nurses/${id}/availability`, { method: 'PUT', body: JSON.stringify(body) }),
  submitNurseOnboarding: (body) => apiFetch('/nurses/me/onboarding', { method: 'PUT', body: JSON.stringify(body) }),
  saveNurseProfile: (body) => apiFetch('/nurses/me/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Users
  getUsers: () => apiFetch('/users'),
  getUser: (id) => apiFetch(`/users/${id}`),
  editUser: (id, body) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  updateUserStatus: (id, status) => apiFetch(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Payouts
  getPayouts: () => apiFetch('/payouts'),
  generatePayouts: (period) => apiFetch('/payouts/generate', { method: 'POST', body: JSON.stringify({ period }) }),
  approvePayout: (id) => apiFetch(`/payouts/${id}/approve`, { method: 'PUT' }),
  markPayoutPaid: (id) => apiFetch(`/payouts/${id}/pay`, { method: 'PUT' }),
  rejectPayout: (id) => apiFetch(`/payouts/${id}/reject`, { method: 'PUT' }),

  // Analytics
  getAnalytics: () => apiFetch('/analytics'),

  // Payments
  getPayments: () => apiFetch('/payments'),

  // Notifications
  sendNotification: (body) => apiFetch('/notifications/send', { method: 'POST', body: JSON.stringify(body) }),
  getNotifications: () => apiFetch('/notifications'),
  markNotificationRead: (id) => apiFetch(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => apiFetch('/notifications/read-all', { method: 'PATCH' }),

  // Settings
  getSettings: () => apiFetch('/settings'),
  updateSettings: (body) => apiFetch('/settings', { method: 'PUT', body: JSON.stringify(body) }),

  // Profile
  updateProfile: (body) => apiFetch('/profile', { method: 'PUT', body: JSON.stringify(body) }),
  updatePassword: (body) => apiFetch('/profile/password', { method: 'PUT', body: JSON.stringify(body) }),
  updateRelative: (id, body) => apiFetch(`/profile/relative/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  addRelative: (clientId, body) => apiFetch(`/users/${clientId}/relatives`, { method: 'POST', body: JSON.stringify(body) }),
};
