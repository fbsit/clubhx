import { fetchJson } from "@/lib/api";

export interface LoginResponse { token: string }

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set('username', username);
  body.set('password', password);
  return fetchJson<LoginResponse>(`/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
}

export interface ClientLoginResponse { token: string }

export async function clientLoginApi(identification: string, secret: string): Promise<ClientLoginResponse> {
  const payload = { identification, secret };
  return fetchJson<ClientLoginResponse>(`/api/client-login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}


