export interface WishlistItem {
  id: string;
  product: import("@/types/product").ProductType;
  dateAdded: string;
  notes?: string;
}

export interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: import("@/types/product").ProductType, notes?: string) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  itemsCount: number;
  moveToQuotation: (productIds: string[]) => void;
  moveAllToQuotation: () => void;
  refresh: () => Promise<void>;
}