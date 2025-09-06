import { fetchJson } from "@/lib/api";

export type Visit = {
  id: string;
  salesPersonId: string;
  salesPersonName?: string;
  customerId: string;
  customerName: string;
  date: string; // ISO
  time: string; // HH:mm
  duration: number; // minutes
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  visitType: string; // domain-specific
  meetingType: "presencial" | "videollamada";
  description?: string;
  meetingLink?: string;
  priority?: "low" | "medium" | "high";
};

export async function listVisits(params: { from?: string; to?: string; salesPersonId?: string; customerId?: string } = {}): Promise<Visit[]> {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) usp.set(k, String(v)); });
  const qs = usp.toString() ? `?${usp.toString()}` : "";
  return fetchJson<Visit[]>(`/api/v1/visits${qs}`);
}

export async function createVisit(visit: Omit<Visit, "id">): Promise<Visit> {
  return fetchJson<Visit>(`/api/v1/visits`, { method: "POST", body: JSON.stringify(visit) });
}

export async function updateVisit(id: string, patch: Partial<Visit>): Promise<Visit> {
  return fetchJson<Visit>(`/api/v1/visits/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function deleteVisit(id: string): Promise<void> {
  return fetchJson<void>(`/api/v1/visits/${id}`, { method: "DELETE" });
}


