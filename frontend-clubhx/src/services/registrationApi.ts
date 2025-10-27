import { fetchJson } from "@/lib/api";

export interface RegistrationFormData {
  companyName: string;
  rut: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  commune: string;
  region: string;
  verificationCode?: string;
}

export async function submitRegistration(data: RegistrationFormData) {
  return fetchJson(`/api/v1/registration/submit`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function listRegistrationRequests() {
  return fetchJson(`/api/v1/registration/requests`);
}

export async function approveRegistrationRequest(id: string, comments?: string) {
  return fetchJson(`/api/v1/registration/requests/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ comments }),
  });
}

export async function rejectRegistrationRequest(id: string, comments: string) {
  return fetchJson(`/api/v1/registration/requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ comments }),
  });
}

export async function sendVerificationCode(email: string): Promise<{ sent: boolean; code?: string }> {
  return fetchJson(`/api/v1/registration/send-code`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function clientRegister(payload: { rut: string; name: string; email: string; phone: string; password: string }) {
  return fetchJson(`/api/client-register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
