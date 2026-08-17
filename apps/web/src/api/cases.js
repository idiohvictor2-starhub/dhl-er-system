import { apiFetch } from './client';

export function listCases(filters = {}) {
  const qs = new URLSearchParams(filters).toString();
  return apiFetch(`/cases${qs ? `?${qs}` : ''}`);
}

export function getCase(id) {
  return apiFetch(`/cases/${id}`);
}

export function createCase(data) {
  return apiFetch('/cases', { method: 'POST', body: JSON.stringify(data) });
}

export function transitionStage(id, stage) {
  return apiFetch(`/cases/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) });
}

export function getDashboardSummary() {
  return apiFetch('/dashboard/summary');
}
