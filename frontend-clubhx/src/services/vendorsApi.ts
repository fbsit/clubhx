import { fetchJson } from "@/lib/api";

export type Vendor = {
  id: string;
  name: string;
  email: string;
  region?: string;
  customers?: number;
  totalSales?: number;
  salesTarget?: number;
  targetCompletion?: number;
  status?: "active" | "inactive";
  avatar?: string;
};

export type VendorGoal = {
  id: string;
  vendorId: string;
  period: string; // e.g. 2025-08
  salesTarget: number;
  createdAt: string;
};

export async function listVendors(): Promise<Vendor[]> {
  return fetchJson<Vendor[]>(`/api/v1/vendors`);
}

export async function getVendor(id: string): Promise<Vendor> {
  return fetchJson<Vendor>(`/api/v1/vendors/${id}`);
}

export async function listVendorGoals(vendorId: string): Promise<VendorGoal[]> {
  return fetchJson<VendorGoal[]>(`/api/v1/vendors/${vendorId}/goals`);
}

export async function setVendorGoal(vendorId: string, payload: { period: string; salesTarget: number }): Promise<VendorGoal> {
  return fetchJson<VendorGoal>(`/api/v1/vendors/${vendorId}/goals`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setBulkVendorGoals(payload: { vendorIds: string[]; period: string; salesTarget: number }): Promise<{ updated: number }>{
  return fetchJson<{ updated: number }>(`/api/v1/vendors/goals/bulk`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


