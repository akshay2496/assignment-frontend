const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `HTTP error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Request Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  getMenu: () => request('/menu'),
  createOrder: (payload) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getOrders: () => request('/orders'),

  getSummary: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics/summary?${qs}`);
  },
  getTrafficTrends: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics/traffic-trends?${qs}`);
  },
  getEventBreakdown: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics/event-breakdown?${qs}`);
  },
  getPopularPages: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics/popular-pages?${qs}`);
  },
  getRecentEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/analytics/recent-events?${qs}`);
  },
  getHealth: () => request('/health')
};

export default api;
