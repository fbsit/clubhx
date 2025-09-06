import { fetchJson } from "@/lib/api";

export type ShippingZone = {
  id: string;
  name: string;
  description?: string;
  locations: { id: string; name: string }[];
  rules: { id: string; type: "fixed" | "tiered"; courierId?: string; value?: number }[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function listShippingZones(): Promise<ShippingZone[]> {
  return fetchJson<ShippingZone[]>(`/api/v1/shipping-zones`);
}

export async function createShippingZone(payload: Partial<ShippingZone>): Promise<ShippingZone> {
  return fetchJson<ShippingZone>(`/api/v1/shipping-zones`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateShippingZone(id: string, payload: Partial<ShippingZone>): Promise<ShippingZone> {
  return fetchJson<ShippingZone>(`/api/v1/shipping-zones/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function toggleShippingZone(id: string, active: boolean): Promise<ShippingZone> {
  return fetchJson<ShippingZone>(`/api/v1/shipping-zones/${id}`, { method: "PATCH", body: JSON.stringify({ active }) });
}

export async function deleteShippingZone(id: string): Promise<void> {
  return fetchJson<void>(`/api/v1/shipping-zones/${id}`, { method: "DELETE" });
}


