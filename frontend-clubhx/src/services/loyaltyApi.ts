import { fetchJson } from "@/lib/api";

export async function fetchMyLoyaltyPoints(): Promise<{ points: number }> {
	return fetchJson<{ points: number }>("/api/v1/loyalty/points");
}
