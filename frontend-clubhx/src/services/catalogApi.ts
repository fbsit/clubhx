import { fetchJson } from "@/lib/api";

export type Category = { id: string; name: string; description?: string; icon?: string; order?: number; productCount?: number };
export type Brand = { id: string; name: string; productCount?: number };

export interface CatalogStructure {
  categories: Category[];
  brands: string[];
  familyNames: string[];
  subfamilyNames: string[];
  subsubfamilyNames: string[];
}

export async function getCatalogStructure(): Promise<CatalogStructure> {
  const raw = await fetchJson<any>(`/api/v1/catalog/categories`);

  // Backend may return either a plain array (legacy) or the new structured payload
  if (Array.isArray(raw)) {
    return {
      categories: raw as Category[],
      brands: [],
      familyNames: [],
      subfamilyNames: [],
      subsubfamilyNames: [],
    };
  }

  const categories: Category[] = Array.isArray(raw.categories)
    ? raw.categories
    : [];

  return {
    categories,
    brands: Array.isArray(raw.brands) ? raw.brands : [],
    familyNames: Array.isArray(raw.familyNames ?? raw.family_names) ? (raw.familyNames ?? raw.family_names) : [],
    subfamilyNames: Array.isArray(raw.subfamilyNames ?? raw.subfamily_name_list) ? (raw.subfamilyNames ?? raw.subfamily_name_list) : [],
    subsubfamilyNames: Array.isArray(raw.subsubfamilyNames ?? raw.subsubfamily_name_list) ? (raw.subsubfamilyNames ?? raw.subsubfamily_name_list) : [],
  };
}

export async function listCategories(): Promise<Category[]> {
  const structure = await getCatalogStructure();
  return structure.categories;
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


