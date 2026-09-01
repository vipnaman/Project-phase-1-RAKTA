export async function apiFetch(path: string, init: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const headers = new Headers(init.headers);
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('rakta_token') : null;
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  let response = await fetch(`${baseUrl}/api${path}`, { ...init, headers });
  if (response.status !== 401 || typeof window === 'undefined') return response;

  const refreshToken = localStorage.getItem('rakta_refresh_token');
  if (!refreshToken) return response;
  const refreshResponse = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!refreshResponse.ok) return response;

  const refreshed = await refreshResponse.json();
  localStorage.setItem('rakta_token', refreshed.data.token);
  if (refreshed.data.refreshToken) localStorage.setItem('rakta_refresh_token', refreshed.data.refreshToken);
  headers.set('Authorization', `Bearer ${refreshed.data.token}`);
  return fetch(`${baseUrl}/api${path}`, { ...init, headers });
}
