// Resolve API base URL from env or runtime
const runtimeApiBase = (globalThis as any)?.__CLUBHX_API_BASE__ as string | undefined;
const envApiBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
const DEFAULT_API_BASE = (import.meta as any)?.env?.PROD
  ? "https://backend-clubhx-production.up.railway.app"
  : "http://localhost:3002";
export const API_BASE: string = (runtimeApiBase || envApiBase || DEFAULT_API_BASE).replace(/\/$/, "");

type JsonError = { message?: string; error?: string; statusCode?: number } | string | null;

export async function fetchJson<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('clubhx-token');
  const tokenType = localStorage.getItem('clubhx-token-type') as ('bearer' | 'client' | null);
  const mergedHeaders = new Headers(init?.headers || {});
  if (token && !mergedHeaders.has('Authorization')) {
    const scheme = tokenType === 'client' ? 'ClientToken' : 'Bearer';
    mergedHeaders.set('Authorization', `${scheme} ${token}`);
  }
  // Always request/expect JSON
  if (!mergedHeaders.has('Accept')) mergedHeaders.set('Accept', 'application/json');
  if (init?.body && !mergedHeaders.has('Content-Type')) mergedHeaders.set('Content-Type', 'application/json');

  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  console.log('fetchJson: path:', url);
  console.log('fetchJson: Making request to:', url);
  console.log('fetchJson: API_BASE:', API_BASE);
  console.log('fetchJson: Token:', token ? 'Present' : 'Not present');
  const response = await fetch(url, {
    credentials: 'include',
    ...init,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let detail: string = `HTTP ${response.status}`;
    try {
      const data = (await response.json()) as JsonError;
      if (data && typeof data === 'object') {
        const msg = (data as any).message || (data as any).error;
        if (msg) detail = `${detail} - ${msg}`;
      }
    } catch {
      // ignore parse failures
    }
    throw new Error(detail);
  }

  // Handle empty responses (204)
  if (response.status === 204) return undefined as unknown as T;
  return response.json() as Promise<T>;
}


