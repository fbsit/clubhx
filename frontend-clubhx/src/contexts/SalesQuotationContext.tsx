import React, { createContext, useState, useContext, ReactNode } from "react";
import { QuoteItemType, ProductType } from "@/types/product";
import { EnhancedSalesCustomer } from "@/data/enhancedSalesCustomers";
import { Order } from "@/types/order";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { isDiscountActive } from "@/utils/promotionUtils";

type QuotationStatus = "draft" | "sent" | "approved" | "converted" | "rejected";

interface SalesQuotation {
  id: string;
  customerId: string;
  customerName: string;
  items: QuoteItemType[];
  notes: string;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  discount?: number;
}

interface SalesQuotationContextType {
  // Cliente seleccionado
  selectedCustomer: EnhancedSalesCustomer | null;
  setSelectedCustomer: (customer: EnhancedSalesCustomer | null) => void;
  
  // Items de la cotización actual
  items: QuoteItemType[];
  addItem: (product: ProductType, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearItems: () => void;
  
  // Gestión de cotizaciones
  quotations: SalesQuotation[];
  currentQuotation: SalesQuotation | null;
  createQuotation: (notes?: string) => string; // Retorna ID de cotización
  saveAsDraft: (notes?: string) => void;
  sendToCustomer: (quotationId: string) => void;
  updateQuotation: (quotationId: string, updates: Partial<SalesQuotation>) => void;
  deleteQuotation: (quotationId: string) => void;
  
  // Edición de pedidos
  editingOrder: Order | null;
  loadOrderForEditing: (order: Order, customer: EnhancedSalesCustomer) => void;
  updateOrder: (orderId: string, notes?: string) => void;
  cancelOrderEditing: () => void;
  
  // Estadísticas
  itemsCount: number;
  totalAmount: number;
  
  // Estado
  isLoading: boolean;
}

export const SalesQuotationContext = createContext<SalesQuotationContextType | undefined>(undefined);

const MAX_QUANTITY = 50; // Límite más alto para vendedores

export function SalesQuotationProvider({ children }: { children: ReactNode }) {
  const [selectedCustomer, setSelectedCustomer] = useState<EnhancedSalesCustomer | null>(null);
  const [items, setItems] = useState<QuoteItemType[]>([]);
  const [quotations, setQuotations] = useState<SalesQuotation[]>([]);
  const [currentQuotation, setCurrentQuotation] = useState<SalesQuotation | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addItem = (product: ProductType, quantity: number) => {
    if (!selectedCustomer) {
      toast.error("Debe seleccionar un cliente primero");
      return;
    }

    if (quantity <= 0 || product.stock <= 0) return;

    const existingItemIndex = items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      const currentQuantity = updatedItems[existingItemIndex].quantity;
      let newQuantity = currentQuantity + quantity;
      
      if (newQuantity > MAX_QUANTITY) {
        newQuantity = MAX_QUANTITY;
        toast("Límite alcanzado", {
          description: `Límite máximo de ${MAX_QUANTITY} unidades para ${product.name}`,
        });
      }
      
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
      let finalQuantity = Math.min(quantity, product.stock);
      
      if (finalQuantity > MAX_QUANTITY) {
        finalQuantity = MAX_QUANTITY;
        toast("Límite alcanzado", {
          description: `Límite máximo de ${MAX_QUANTITY} unidades para ${product.name}`,
        });
      }
      
      setItems([...items, { product, quantity: finalQuantity }]);
      toast("Producto agregado", {
        description: `${product.name} agregado para ${selectedCustomer.name}`,
      });
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    if (quantity > MAX_QUANTITY) {
      toast("Límite alcanzado", {
        description: `Límite máximo de ${MAX_QUANTITY} unidades`,
      });
      quantity = MAX_QUANTITY;
    }

    const updatedItems = items.map(item => {
      if (item.product.id === productId) {
        const finalQuantity = Math.min(quantity, item.product.stock);
        return { ...item, quantity: finalQuantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const clearItems = () => {
    setItems([]);
  };

  const createQuotation = (notes?: string): string => {
    if (!selectedCustomer || items.length === 0) {
      toast.error("Debe seleccionar un cliente y agregar productos");
      return "";
    }

    const quotationId = `Q${Date.now()}`;
    const newQuotation: SalesQuotation = {
      id: quotationId,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      items: [...items],
      notes: notes || "",
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
    };

    setQuotations(prev => [...prev, newQuotation]);
    setCurrentQuotation(newQuotation);
    
    // Clear items after creating quotation
    clearItems();
    
    return quotationId;
  };

  const saveAsDraft = (notes?: string) => {
    if (currentQuotation) {
      updateQuotation(currentQuotation.id, { 
        notes: notes || currentQuotation.notes,
        items: [...items],
        updatedAt: new Date().toISOString()
      });
      toast.success("Cotización guardada como borrador");
    } else {
      const quotationId = createQuotation(notes);
      if (quotationId) {
        toast.success("Cotización creada y guardada como borrador");
      }
    }
  };

  const sendToCustomer = (quotationId: string) => {
    setIsLoading(true);
    // Simular envío
    setTimeout(() => {
      updateQuotation(quotationId, { 
        status: "sent",
        updatedAt: new Date().toISOString()
      });
      setIsLoading(false);
      toast.success("Cotización enviada al cliente");
    }, 1500);
  };

  const updateQuotation = (quotationId: string, updates: Partial<SalesQuotation>) => {
    setQuotations(prev => prev.map(quotation => 
      quotation.id === quotationId 
        ? { ...quotation, ...updates }
        : quotation
    ));

    if (currentQuotation?.id === quotationId) {
      setCurrentQuotation(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteQuotation = (quotationId: string) => {
    setQuotations(prev => prev.filter(q => q.id !== quotationId));
    if (currentQuotation?.id === quotationId) {
      setCurrentQuotation(null);
      clearItems();
    }
    toast.success("Cotización eliminada");
  };

  // Order editing functions
  const loadOrderForEditing = (order: Order, customer: EnhancedSalesCustomer) => {
    // Set the customer
    setSelectedCustomer(customer);
    
    // Clear current items
    clearItems();
    
    // Convert order items to QuoteItemType (simplified for now)
    // In a real app, you'd fetch full product data
    const orderItems: QuoteItemType[] = order.items.map(item => ({
      product: {
        id: `product-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: item.name,
        price: item.price,
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
        category: "Unknown",
        brand: "Unknown",
        description: `${item.name} - From order ${order.id}`,
        stock: 100, // Assume good stock for editing
        discount: 0
      } as ProductType,
      quantity: item.quantity
    }));
    
    setItems(orderItems);
    setEditingOrder(order);
    
    toast.success(`Editando pedido ${order.id} para ${customer.name}`);
  };

  const updateOrder = (orderId: string, notes?: string) => {
    // This would update the order in your orders system
    // For now, just simulate success and set to pending approval
    setEditingOrder(null);
    clearItems();
    setSelectedCustomer(null);
    
    // In a real app, you'd update the order status to pending_approval
    // and store the modifications
    
    toast.success(`Pedido ${orderId} enviado al cliente para aprobación`);
  };

  const cancelOrderEditing = () => {
    setEditingOrder(null);
    clearItems();
    setSelectedCustomer(null);
    
    toast.info("Edición de pedido cancelada");
  };

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const totalAmount = items.reduce((total, item) => {
    const price = isDiscountActive(item.product)
      ? (item.product.price * (100 - item.product.discount)) / 100 
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const value = {
    selectedCustomer,
    setSelectedCustomer,
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearItems,
    quotations,
    currentQuotation,
    createQuotation,
    saveAsDraft,
    sendToCustomer,
    updateQuotation,
    deleteQuotation,
    editingOrder,
    loadOrderForEditing,
    updateOrder,
    cancelOrderEditing,
    itemsCount,
    totalAmount,
    isLoading
  };

  return (
    <SalesQuotationContext.Provider value={value}>
      {children}
    </SalesQuotationContext.Provider>
  );
}

export function useSalesQuotation() {
  const context = useContext(SalesQuotationContext);
  if (context === undefined) {
    throw new Error("useSalesQuotation must be used within a SalesQuotationProvider");
  }
  return context;
}