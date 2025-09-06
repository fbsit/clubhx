import { fetchJson } from "@/lib/api";

export type WishlistAnalytics = {
  totalWishlistItems: number;
  totalActiveWishlists: number;
  conversionRate: number;
  topProducts: { id: string; name: string; wishlistCount: number; conversionRate: number; stock: number }[];
  lowStockHighDemand: { id: string; name: string; wishlistCount: number; stock: number }[];
  clientsWithLargeWishlists: { id: string; name: string; contact: string; itemCount: number; totalValue: number; potentialRevenue: number; vendorAssigned: string }[];
  categoryInsights: { category: string; totalItems: number; conversionRate: number; avgValue: number }[];
  monthlyTrends: { growth: number };
};

export async function getWishlistAnalytics(): Promise<WishlistAnalytics> {
  return fetchJson<WishlistAnalytics>(`/api/v1/wishlist/analytics`);
}


