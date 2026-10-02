const API = '/api';

/**
 * Thin wrapper around fetch that:
 *   - Prepends the API base path
 *   - Sends/receives JSON automatically
 *   - Throws an Error with the server's error message on non-2xx responses
 */
async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export const api = {
  getQuizzes: () => request('/quizzes'),
  getQuiz: (id) => request(`/quizzes/${id}`),
  createQuiz: (body) => request('/quizzes', { method: 'POST', body: JSON.stringify(body) }),
  submitAttempt: (id, body) => request(`/quizzes/${id}/attempts`, { method: 'POST', body: JSON.stringify(body) }),
  getLeaderboard: (id) => request(`/quizzes/${id}/leaderboard`),
};
