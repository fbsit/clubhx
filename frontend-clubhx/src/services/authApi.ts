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


