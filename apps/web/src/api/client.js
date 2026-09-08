import { getFallbackResponse } from './fallbackStore';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('er_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }

    return res.status === 204 ? null : res.json();
  } catch (err) {
    // If relative path fetch failed in local dev environment, attempt direct localhost:4000
    if (!API_URL && err.message && err.message.includes('fetch')) {
      try {
        const directRes = await fetch(`http://localhost:4000${path}`, {
          ...options,
          headers,
        });

        if (directRes.ok) {
          return directRes.status === 204 ? null : directRes.json();
        }
      } catch (retryErr) {
        // Fallthrough to resilient fallback store
      }
    }

    console.warn(`[IRMS API] Server unreachable at ${path}. Serving resilient fallback data.`);
    return getFallbackResponse(path, options);
  }
}
