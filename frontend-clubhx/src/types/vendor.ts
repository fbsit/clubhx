export interface CategoryGoal {
  category: string;
  amount: number;
  achievement?: number;
}

export interface VendorGoal {
  id: string;
  vendorId: string;
  type: "general" | "by_category";
  amount?: number; // Solo para metas generales
  categoryGoals?: CategoryGoal[]; // Solo para metas por categoría
  startDate: Date;
  endDate: Date;
  notes?: string;
  status: "active" | "completed" | "expired";
  achievement?: number; // Para metas generales
  createdAt: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  region: string;
  customers: number;
  totalSales: number;
  salesTarget?: number;
  targetCompletion?: number;
  status: "active" | "inactive";
  avatar: string;
  assignedClients: Array<{
    id: string;
    name: string;
    contact: string;
    phone: string;
    lastOrder: string;
  }>;
  // Ventas por categoría para tracking de progreso
  salesByCategory?: {
    Color: number;
    Cuidado: number;
    Styling: number;
    Técnico: number;
    Texturización: number;
    Accesorios: number;
  };
}