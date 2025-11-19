import { fetchJson } from "@/lib/api";

export async function fetchMyLoyaltyPoints(clientId?: string): Promise<{ points: number }> {
    const url = clientId ? `/api/v1/loyalty/points?client=${encodeURIComponent(clientId)}` : `/api/v1/loyalty/points`;
    return fetchJson<{ points: number }>(url);
}

export interface PointsExpiringItem { month: string; expires: number }
export async function fetchMyPointsExpiring(months = 6, clientId?: string): Promise<{ months: number; expirations: PointsExpiringItem[] }> {
  const base = `/api/v1/loyalty/points-expiring?months=${months}`;
  const url = clientId ? `${base}&client=${encodeURIComponent(clientId)}` : base;
  return fetchJson<{ months: number; expirations: PointsExpiringItem[] }>(url);
}

export async function fetchMyPointsEarned(months = 12, clientId?: string): Promise<{ months: number; earned: number }> {
  const base = `/api/v1/loyalty/points-earned?months=${months}`;
  const url = clientId ? `${base}&client=${encodeURIComponent(clientId)}` : base;
  return fetchJson<{ months: number; earned: number }>(url);
}