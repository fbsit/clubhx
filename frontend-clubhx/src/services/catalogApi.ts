import { fetchJson } from "@/lib/api";

export type Category = { id: string; name: string; description?: string; icon?: string; order?: number; productCount?: number };
export type Brand = { id: string; name: string; productCount?: number };

export async function listCategories(): Promise<Category[]> {
  return fetchJson<Category[]>(`/api/v1/catalog/categories`);
}

export async function createCategory(payload: Omit<Category, "id" | "productCount">): Promise<Category> {
  return fetchJson<Category>(`/api/v1/catalog/categories`, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateCategory(id: string, payload: Partial<Category>): Promise<Category> {
  return fetchJson<Category>(`/api/v1/catalog/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteCategory(id: string): Promise<void> {
  return fetchJson<void>(`/api/v1/catalog/categories/${id}`, { method: "DELETE" });
}

export async function listBrands(): Promise<Brand[]> {
  return fetchJson<Brand[]>(`/api/v1/catalog/brands`);
}


