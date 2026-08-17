import { apiFetch } from './client';

export const irmsApi = {
  // Cases
  listCases: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/cases${q ? `?${q}` : ''}`);
  },
  getCase: (id) => apiFetch(`/cases/${id}`),
  createCase: (data) => apiFetch('/cases', { method: 'POST', body: JSON.stringify(data) }),
  transitionStage: (id, stage, notes = '') => apiFetch(`/cases/${id}/stage`, { method: 'POST', body: JSON.stringify({ stage, notes }) }),
  addAction: (id, data) => apiFetch(`/cases/${id}/actions`, { method: 'POST', body: JSON.stringify(data) }),
  toggleAction: (actionId, status) => apiFetch(`/cases/actions/${actionId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addDocument: (id, data) => apiFetch(`/cases/${id}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  addCommunication: (id, data) => apiFetch(`/cases/${id}/communications`, { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard
  getDashboardSummary: () => apiFetch('/dashboard/summary'),

  // Union / JCC
  getUnionMeetings: () => apiFetch('/union/meetings'),
  createUnionMeeting: (data) => apiFetch('/union/meetings', { method: 'POST', body: JSON.stringify(data) }),
  addUnionAction: (data) => apiFetch('/union/actions', { method: 'POST', body: JSON.stringify(data) }),
  toggleUnionAction: (id, status) => apiFetch(`/union/actions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Training
  getTrainingData: () => apiFetch('/training/programs'),
  recordTrainingCompletion: (data) => apiFetch('/training/complete', { method: 'POST', body: JSON.stringify(data) }),

  // Redundancy
  getRedundancyCases: () => apiFetch('/redundancy'),
  createRedundancyCase: (data) => apiFetch('/redundancy', { method: 'POST', body: JSON.stringify(data) }),
  updateRedundancyCase: (id, data) => apiFetch(`/redundancy/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Reports
  getQuarterlyReport: () => apiFetch('/reports/quarterly'),

  // AI Insights
  getAIInsights: () => apiFetch('/ai/insights'),

  // Alerts
  getAlerts: () => apiFetch('/alerts'),
  markAlertRead: (id) => apiFetch(`/alerts/${id}/read`, { method: 'PATCH' }),
  markAllAlertsRead: () => apiFetch('/alerts/mark-all-read', { method: 'POST' }),

  // Governance & Users
  getUsersAndMetadata: () => apiFetch('/users'),
  getAuditLogs: () => apiFetch('/audit')
};
