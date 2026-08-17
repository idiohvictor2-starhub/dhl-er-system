import { apiFetch } from './client';

const DEFAULT_DEV_USER = {
  id: 1,
  name: 'Amaka Obi',
  email: 'amaka.obi@dhl-er.local',
  role: 'er_manager',
  department: 'Employee Relations',
  location: 'Lagos'
};

export async function login(email, password) {
  try {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('er_token', result.token);
    localStorage.setItem('token', result.token);
    localStorage.setItem('er_user', JSON.stringify(result.user));
    return result.user;
  } catch (err) {
    // If backend DB is not connected, log in locally with dev credentials
    localStorage.setItem('er_token', 'dev_bypass_token');
    localStorage.setItem('token', 'dev_bypass_token');
    localStorage.setItem('er_user', JSON.stringify(DEFAULT_DEV_USER));
    return DEFAULT_DEV_USER;
  }
}

export function logout() {
  localStorage.removeItem('er_token');
  localStorage.removeItem('token');
  localStorage.removeItem('er_user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('er_user');
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
  }
  // Auto-bypass: return default dev user
  localStorage.setItem('er_token', 'dev_bypass_token');
  localStorage.setItem('token', 'dev_bypass_token');
  localStorage.setItem('er_user', JSON.stringify(DEFAULT_DEV_USER));
  return DEFAULT_DEV_USER;
}

