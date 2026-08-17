import request from './client';

export function getSnapshot() {
  return request('/dashboard/snapshot');
}
