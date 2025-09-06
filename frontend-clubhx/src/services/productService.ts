
import { ProductType } from "@/types/product";

export interface FilterOptions {
  categories: string[];
  types: string[];
  brands: string[];
  priceRange: [number, number];
  onlyInStock: boolean;
}

export const filterProducts = (
  products: ProductType[], 
  searchQuery: string, 
  currentTab: string,
  filters: FilterOptions
): ProductType[] => {
  return products.filter((product) => {
    // Filter by tab
    if (currentTab === "new" && !product.isNew) return false;
    if (currentTab === "discounts" && !product.discount) return false;
    if (currentTab === "popular" && !product.isPopular) return false;

    // Filter by search
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by category
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    )
      return false;

    // Filter by brand
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand)
    )
      return false;

    // Filter by price
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    )
      return false;

    // Filter by stock
    if (filters.onlyInStock && product.stock <= 0) return false;

    return true;
  });
};

export const sortProducts = (
  products: ProductType[],
  sortOrder: string
): ProductType[] => {
  return [...products].sort((a, b) => {
    switch (sortOrder) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "popular":
        return a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1;
      default:
        return 0; // Featured - no specific sort
    }
  });
};
