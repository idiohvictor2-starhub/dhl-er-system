const API_URL = import.meta.env.VITE_API_URL || '';

// Thin fetch wrapper — attaches the JWT and normalises error handling so
// every module's api file (cases.js, dashboard.js, ...) stays a few lines.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('er_token');
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}
