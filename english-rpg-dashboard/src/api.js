// In production set VITE_API_URL=https://your-backend.onrender.com in Netlify env vars
const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
    return;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  localStorage.setItem('loginCount', String(data.loginCount || 1));
  return data.username;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

export const fetchLessons = () => request('/lessons');
export const updateLesson = (id, data) => request(`/lessons/${id}`, { method: 'PATCH', body: data });
export const fetchReviews = () => request('/reviews');
export const updateReview = (week, data) => request(`/reviews/${week}`, { method: 'PATCH', body: data });
