import { fetchJson } from "@/lib/api";

export async function fetchMyLoyaltyPoints(): Promise<{ points: number }> {
	return fetchJson<{ points: number }>("/api/v1/loyalty/points");
}

export interface PointsExpiringItem { month: string; expires: number }
export async function fetchMyPointsExpiring(months = 6): Promise<{ months: number; expirations: PointsExpiringItem[] }> {
  return fetchJson<{ months: number; expirations: PointsExpiringItem[] }>(`/api/v1/loyalty/points-expiring?months=${months}`);
}