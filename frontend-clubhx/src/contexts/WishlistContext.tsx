import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from "react";
import { WishlistItem, WishlistContextType } from "@/types/wishlist";
import { ProductType } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotation } from "@/contexts/QuotationContext";
import { toast } from "sonner";
import * as wishlistApi from "@/services/wishlistApi";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "clubhx-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();
  const { addItem: addToQuotation } = useQuotation();
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  // Cargar wishlist desde backend si hay usuario (fallback a localStorage)
  useEffect(() => {
    const uid = user?.id ?? null;

    // Si se cerró sesión y había datos cargados, limpiar
    if (!uid && loadedUserId !== null) {
      setItems([]);
      setLoadedUserId(null);
      return;
    }

    if (uid && loadedUserId !== uid) {
      refreshWishlist(uid);
    }
  }, [user?.id, loadedUserId]);

  const refreshWishlist = async (uid?: string) => {
    const userId = uid ?? user?.id;
    if (!userId) return;
    try {
      const remote = await wishlistApi.listWishlistItems();
      const mapped: WishlistItem[] = (Array.isArray(remote) ? remote : []).map((r: any) => ({ id: r.id, product: r.product, dateAdded: r.createdAt, notes: r.notes }));
      setItems(mapped);
    } catch (error) {
      const userKey = `${STORAGE_KEY}-${userId}`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        try { setItems(JSON.parse(saved)); } catch {}
      } else {
        setItems([]);
      }
    } finally {
      if (uid) setLoadedUserId(uid);
    }
  };

  // Guardar wishlist en localStorage cuando cambie
  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;
    const userKey = `${STORAGE_KEY}-${uid}`;
    localStorage.setItem(userKey, JSON.stringify(items));
  }, [items, user?.id]);

  const addItem = async (product: ProductType, notes?: string) => {
    // Prevenir que usuarios de ventas agreguen items
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden usar la lista de deseos.",
      });
      return;
    }

    const existingItem = items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      toast("Ya está en tu lista de deseos", {
        description: `${product.name} ya está guardado en tu lista de deseos`,
      });
      return;
    }

    try {
      const created = user ? await wishlistApi.addWishlistItem(product, notes) : null;
      const newItem: WishlistItem = { id: created?.id || `wishlist-${Date.now()}-${product.id}`, product, dateAdded: created?.createdAt || new Date().toISOString(), notes: created?.notes || notes };
      setItems(prev => [newItem, ...prev]);
      // Sync refresh in background
      refreshWishlist();
    } catch {
      toast.error("No se pudo agregar a la lista de deseos");
      return;
    }
    toast.success("Agregado a lista de deseos", {
      description: `${product.name} se ha guardado en tu lista de deseos`,
    });
  };

  const removeItem = async (productId: string) => {
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden modificar la lista de deseos.",
      });
      return;
    }

    const item = items.find(item => item.product.id === productId);
    try { if (user) await wishlistApi.removeWishlistItem(productId); } catch { toast.error("No se pudo eliminar de la lista de deseos"); return; }
    setItems(prev => prev.filter(item => item.product.id !== productId));
    refreshWishlist();
    
    if (item) {
      toast.success("Eliminado de lista de deseos", {
        description: `${item.product.name} se ha eliminado de tu lista de deseos`,
      });
    }
  };

  const clearWishlist = async () => {
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden modificar la lista de deseos.",
      });
      return;
    }

    try { if (user) await wishlistApi.clearWishlistItems(); } catch { toast.error("No se pudo limpiar la lista de deseos"); return; }
    setItems([]);
    refreshWishlist();
    toast.success("Lista de deseos limpiada", {
      description: "Se han eliminado todos los productos de tu lista de deseos",
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.product.id === productId);
  };

  const moveToQuotation = (productIds: string[]) => {
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden realizar compras.",
      });
      return;
    }

    const itemsToMove = items.filter(item => productIds.includes(item.product.id));
    let addedCount = 0;

    itemsToMove.forEach(item => {
      if (item.product.stock > 0) {
        addToQuotation(item.product, 1);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success("Productos agregados a cotización", {
        description: `${addedCount} producto${addedCount > 1 ? 's' : ''} agregado${addedCount > 1 ? 's' : ''} a tu cotización`,
      });
    }

    if (addedCount < itemsToMove.length) {
      toast.warning("Algunos productos no están disponibles", {
        description: "Los productos sin stock no se agregaron a la cotización",
      });
    }
  };

  const moveAllToQuotation = () => {
    const productIds = items.map(item => item.product.id);
    moveToQuotation(productIds);
  };

  const itemsCount = items.length;

  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    itemsCount,
    moveToQuotation,
    moveAllToQuotation,
    refresh: refreshWishlist,
  }), [items, itemsCount]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}