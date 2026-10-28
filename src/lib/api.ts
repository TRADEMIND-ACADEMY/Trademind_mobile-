/**
 * TRADEMIND ACADEMY — accès à l'API commune (site web + application mobile).
 * - Une seule API et une seule base : celles du site. Aucune logique de compte ici.
 * - Authentification : jeton de session (Bearer) renvoyé par /api/auth/login et /api/auth/register quand l'en-tête
 *   « x-tm-client: mobile » est présent depuis une origine autorisée. Le serveur ne stocke que son empreinte.
 * - L'URL de l'API vient de VITE_API_BASE_URL (compilation). Dans l'APK, elle est obligatoire.
 */
const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL ? String((import.meta as any).env.VITE_API_BASE_URL) : '';
export const API_BASE = RAW_BASE.replace(/\/+$/, '');
const TOKEN_KEY = 'tm_session_token';

export const getToken = (): string => {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};
export const setToken = (token: string) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* stockage indisponible */ }
};
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

/** Dans l'application installée (origine https://localhost), sans URL d'API il n'y a pas de serveur à joindre. */
export const apiConfigured = (): boolean => {
  if (API_BASE) return true;
  if (typeof window === 'undefined') return true;
  const { protocol, hostname, port } = window.location;
  return !(protocol === 'https:' && hostname === 'localhost' && !port) && protocol !== 'capacitor:' && protocol !== 'file:';
};

export interface ApiResult<T = any> { status: number; ok: boolean; json: T | null }

export async function api<T = any>(
  method: string,
  path: string,
  body?: unknown,
  signal?: AbortSignal,
  extraHeaders?: Record<string, string>
): Promise<ApiResult<T>> {
  if (!apiConfigured()) {
    return { status: 0, ok: false, json: { error: 'API_NOT_CONFIGURED', code: 'API_NOT_CONFIGURED' } as any };
  }
  const headers: Record<string, string> = { 'x-tm-client': 'mobile', ...(extraHeaders || {}) };
  if (body !== undefined) headers['content-type'] = 'application/json';
  const token = getToken();
  if (token) headers['authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    credentials: 'omit' // jamais de cookie : le mobile s'authentifie uniquement par jeton
  });
  let json: any = null;
  try { json = await res.json(); } catch { /* corps vide */ }
  if (res.status === 401 && token && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/register')) {
    clearToken();
    try { window.dispatchEvent(new Event('tm:session-expired')); } catch { /* ignore */ }
  }
  return { status: res.status, ok: res.ok, json };
}
