import { apiFetch } from './client';

export async function login(email, password) {
  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('er_token', result.token);
  localStorage.setItem('er_user', JSON.stringify(result.user));
  return result.user;
}

export function logout() {
  localStorage.removeItem('er_token');
  localStorage.removeItem('er_user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('er_user');
  return raw ? JSON.parse(raw) : null;
}
