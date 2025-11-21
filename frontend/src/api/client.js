const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:43100';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/api/auth/me', { token }),
  updateSettings: (token, payload) => request('/api/auth/settings', { method: 'PUT', token, body: payload }),
  verificationStatus: (token) => request('/api/verification/status', { token }),
  requestVerification: (token, payload) => request('/api/verification/request', { method: 'POST', token, body: payload }),
  confirmVerification: (token, payload) => request('/api/verification/confirm', { method: 'POST', token, body: payload }),
  createPost: (token, payload) => request('/api/posts', { method: 'POST', token, body: payload }),
  listPosts: (token, query = '') => request(`/api/posts${query}`, { token }),
  feed: (token, query = '') => request(`/api/feed${query}`, { token }),
  trendingTopics: (token) => request('/api/feed/trending', { token }),
  createCommunity: (token, payload) => request('/api/communities', { method: 'POST', token, body: payload }),
  listCommunities: () => request('/api/communities'),
  joinCommunity: (token, id) => request(`/api/communities/${id}/join`, { method: 'POST', token })
};
