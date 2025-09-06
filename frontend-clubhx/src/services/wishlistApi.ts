import { fetchJson } from "@/lib/api";

export async function listWishlistItems() {
  return fetchJson(`/api/v1/wishlist/items`);
}

export async function addWishlistItem(product: any, notes?: string) {
  return fetchJson(`/api/v1/wishlist/items`, {
    method: 'POST',
    body: JSON.stringify({ product, notes }),
  });
}

export async function removeWishlistItem(productId: string) {
  return fetchJson(`/api/v1/wishlist/items/${productId}`, { method: 'DELETE' });
}

export async function clearWishlistItems() {
  return fetchJson(`/api/v1/wishlist/items`, { method: 'DELETE' });
}


