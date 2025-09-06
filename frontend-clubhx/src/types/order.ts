
// Define the OrderStatus type for consistent use across components
export type OrderStatus = 
  | "quotation" 
  | "requested" 
  | "pending_approval"
  | "accepted" 
  | "invoiced" 
  | "shipped" 
  | "delivered"  
  | "payment_pending"
  | "paid"
  | "completed" 
  | "rejected" 
  | "canceled"
  | "processing";

// Order item that belongs to an order
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Tracking information for shipped orders
export interface TrackingInfo {
  company: string;
  trackingNumber: string;
}

// Payment proof information
export interface PaymentProof {
  fileName: string;
  uploadDate: string;
  url: string;
}

// Complete order object
export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  customer: string;
  customerId?: string;
  vendorId?: string;
  createdBy?: "sales" | "client";
  modifiedBy?: string; // Vendor who modified the order
  originalOrderId?: string; // For vendor-edited orders
  salesNotes?: string; // Vendor notes for client
  modifiedDate?: string; // When vendor modified it
  invoiceUrl?: string;
  trackingInfo?: TrackingInfo;
  paymentProof?: PaymentProof;
  completedDate?: string;
}

// Period comparison types
export interface PeriodComparison {
  current: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    period: string;
  };
  previous: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    period: string;
  };
  trends: {
    ordersChange: number;
    revenueChange: number;
    avgOrderChange: number;
  };
}

export interface DateRangePreset {
  key: string;
  label: string;
  value: { from: Date; to: Date };
}

// Status badge configuration
export interface StatusConfig {
  label: string;
  color: string;
  description: string;
}

// Status configuration map
export type StatusConfigMap = Record<OrderStatus, StatusConfig>;
