import api from '@/config/api';

const BASE = '/api/traffic';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
});

export const trafficApi = {
  getOverview: (days = 7) =>
    api.get(`${BASE}/overview`, {
      params: { days },
      headers: authHeaders(),
    }),

  getStats: () =>
    api.get(`${BASE}/stats`, { headers: authHeaders() }),

  getActiveNow: () =>
    api.get(`${BASE}/active-now`, { headers: authHeaders() }),

  getChart: (days = 7) =>
    api.get(`${BASE}/chart`, {
      params: { days },
      headers: authHeaders(),
    }),

  getHourly: () =>
    api.get(`${BASE}/hourly`, { headers: authHeaders() }),

  getTopPages: (limit = 10) =>
    api.get(`${BASE}/top-pages`, {
      params: { limit },
      headers: authHeaders(),
    }),

  getBrowsers: (limit = 5) =>
    api.get(`${BASE}/browsers`, {
      params: { limit },
      headers: authHeaders(),
    }),

  getDevices: () =>
    api.get(`${BASE}/devices`, { headers: authHeaders() }),

  getGeo: () =>
    api.get(`${BASE}/geo`, { headers: authHeaders() }),

  getRecent: (limit = 20) =>
    api.get(`${BASE}/recent`, {
      params: { limit },
      headers: authHeaders(),
    }),
};
