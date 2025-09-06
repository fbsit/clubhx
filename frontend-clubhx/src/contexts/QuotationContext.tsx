
import React, { createContext, useState, useContext, ReactNode } from "react";
import { QuoteItemType, ProductType } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { isDiscountActive } from "@/utils/promotionUtils";

interface QuotationContextType {
  items: QuoteItemType[];
  addItem: (product: ProductType, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearQuotation: () => void;
  itemsCount: number;
  totalAmount: number;
  clearItems: () => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

// Maximum allowed quantity per product
const MAX_QUANTITY = 10;

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItemType[]>([]);
  const { user } = useAuth();

  const addItem = (product: ProductType, quantity: number) => {
    // Prevent sales users from adding items
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden realizar compras. Accede con una cuenta de cliente.",
      });
      return;
    }

    if (quantity <= 0 || product.stock <= 0) return;

    // Check if product already exists in quotation
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      const updatedItems = [...items];
      const currentQuantity = updatedItems[existingItemIndex].quantity;
      let newQuantity = currentQuantity + quantity;
      
      // Enforce MAX_QUANTITY limit
      if (newQuantity > MAX_QUANTITY) {
        newQuantity = MAX_QUANTITY;
        toast("Límite alcanzado", {
          description: `Has alcanzado el límite máximo de ${MAX_QUANTITY} unidades para ${product.name}`,
        });
      }
      
      // Make sure we don't exceed available stock
      const finalQuantity = Math.min(newQuantity, product.stock);
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: finalQuantity
      };
      
      setItems(updatedItems);
      toast("Producto actualizado", {
        description: `${product.name}: cantidad actualizada a ${finalQuantity}`,
      });
    } else {
      // Add new product
      let finalQuantity = Math.min(quantity, product.stock);
      
      // Enforce MAX_QUANTITY limit
      if (finalQuantity > MAX_QUANTITY) {
        finalQuantity = MAX_QUANTITY;
        toast("Límite alcanzado", {
          description: `Has alcanzado el límite máximo de ${MAX_QUANTITY} unidades para ${product.name}`,
        });
      }
      
      setItems([...items, { product, quantity: finalQuantity }]);
      toast("Producto agregado", {
        description: `${product.name} se ha agregado a tu cotización`,
      });
    }
  };

  const removeItem = (productId: string) => {
    // Prevent sales users from modifying quotations
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden modificar cotizaciones.",
      });
      return;
    }
    setItems(items.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    // Prevent sales users from modifying quotations
    if (user?.role === "sales") {
      toast.error("Acceso restringido", {
        description: "Los usuarios de ventas no pueden modificar cotizaciones.",
      });
      return;
    }

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    // Enforce MAX_QUANTITY limit
    if (quantity > MAX_QUANTITY) {
      toast("Límite alcanzado", {
        description: `Has alcanzado el límite máximo de ${MAX_QUANTITY} unidades para este producto`,
      });
      quantity = MAX_QUANTITY;
    }

    const updatedItems = items.map(item => {
      if (item.product.id === productId) {
        // Make sure we don't exceed available stock
        const finalQuantity = Math.min(quantity, item.product.stock);
        return { ...item, quantity: finalQuantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearQuotation = () => {
    setItems([]);
  };

  // Add the clearItems function that matches the one called in QuotationCheckout
  const clearItems = () => {
    setItems([]);
  };

  // Calculate total number of items
  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => {
    const price = isDiscountActive(item.product)
      ? (item.product.price * (100 - item.product.discount)) / 100 
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearQuotation,
    clearItems,
    itemsCount,
    totalAmount
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotation must be used within a QuotationProvider");
  }
  return context;
}
