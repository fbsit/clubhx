import { fetchJson } from "@/lib/api";

export type CreditLimitRequest = {
  id: string;
  customerId: string;
  customerName: string;
  requestedBy: string; // vendor id
  requestedByName?: string;
  requestedLimit: number;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  requestDate: string;
  reviewDate?: string;
};

export async function listCreditRequests(): Promise<CreditLimitRequest[]> {
  return fetchJson<CreditLimitRequest[]>(`/api/v1/credit-requests`);
}

export async function getCreditRequest(id: string): Promise<CreditLimitRequest> {
  return fetchJson<CreditLimitRequest>(`/api/v1/credit-requests/${id}`);
}

export async function approveCreditRequest(id: string, notes?: string): Promise<CreditLimitRequest> {
  return fetchJson<CreditLimitRequest>(`/api/v1/credit-requests/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}

export async function rejectCreditRequest(id: string, notes?: string): Promise<CreditLimitRequest> {
  return fetchJson<CreditLimitRequest>(`/api/v1/credit-requests/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
}


