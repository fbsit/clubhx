export interface CollectionData {
  pendingAmount: number;
  daysOverdue: number;
  pendingInvoices: number;
  lastPaymentDate: string;
  paymentStatus: "current" | "overdue" | "critical";
  overdueDocuments: string[];
}

export interface EnhancedSalesCustomer {
  id: string;
  name: string;
  contact: string;
  email: string;
  rut: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "prospect";
  lastOrder: string;
  loyaltyPoints: number;
  daysWithoutPurchase: number;
  daysWithoutVisit: number;
  sixMonthAverage: number;
  yearlyVariation: number; // percentage
  potential: "Alto" | "Medio" | "Bajo";
  phone: string;
  lastContact: string;
  nextVisit?: string;
  collections?: CollectionData;
}

export const enhancedSalesCustomers: EnhancedSalesCustomer[] = [
  {
    id: "C001",
    name: "Salon Elegance",
    contact: "María González",
    email: "maria@salonelegance.cl",
    rut: "12.345.678-9",
    city: "Santiago",
    totalOrders: 48,
    totalSpent: 8456000,
    status: "active",
    lastOrder: "2024-04-20",
    loyaltyPoints: 3450,
    daysWithoutPurchase: 15,
    daysWithoutVisit: 8,
    sixMonthAverage: 1409333,
    yearlyVariation: 12.5,
    potential: "Alto",
    phone: "+56 9 2235 4678",
    lastContact: "2024-05-03",
    nextVisit: "2024-05-15",
    collections: {
      pendingAmount: 0,
      daysOverdue: 0,
      pendingInvoices: 0,
      lastPaymentDate: "2024-04-20",
      paymentStatus: "current",
      overdueDocuments: []
    }
  },
  {
    id: "C002",
    name: "Hair Design Studio",
    contact: "Carlos Pérez",
    email: "carlos@hairdesign.cl",
    rut: "11.987.654-3",
    city: "Viña del Mar",
    totalOrders: 32,
    totalSpent: 5240000,
    status: "active",
    lastOrder: "2024-04-25",
    loyaltyPoints: 2300,
    daysWithoutPurchase: 10,
    daysWithoutVisit: 12,
    sixMonthAverage: 873333,
    yearlyVariation: 8.2,
    potential: "Medio",
    phone: "+56 9 7764 5511",
    lastContact: "2024-05-02",
    nextVisit: "2024-05-17",
    collections: {
      pendingAmount: 450000,
      daysOverdue: 12,
      pendingInvoices: 2,
      lastPaymentDate: "2024-04-13",
      paymentStatus: "overdue",
      overdueDocuments: ["F001-2024", "F002-2024"]
    }
  },
  {
    id: "C003",
    name: "Beauty Zone",
    contact: "Andrea Muñoz",
    email: "andrea@beautyzone.cl",
    rut: "13.456.789-0",
    city: "Concepción",
    totalOrders: 26,
    totalSpent: 3890000,
    status: "inactive",
    lastOrder: "2024-02-15",
    loyaltyPoints: 1780,
    daysWithoutPurchase: 85,
    daysWithoutVisit: 45,
    sixMonthAverage: 648333,
    yearlyVariation: -15.3,
    potential: "Medio",
    phone: "+56 9 1122 3344",
    lastContact: "2024-04-25",
    collections: {
      pendingAmount: 1250000,
      daysOverdue: 45,
      pendingInvoices: 4,
      lastPaymentDate: "2024-02-15",
      paymentStatus: "critical",
      overdueDocuments: ["F003-2024", "F004-2024", "F005-2024", "F006-2024"]
    }
  },
  {
    id: "C004",
    name: "Arte y Estilo Spa",
    contact: "Roberto Silva",
    email: "roberto@arteyestilo.cl",
    rut: "10.234.567-8",
    city: "Valparaíso",
    totalOrders: 19,
    totalSpent: 2675000,
    status: "active",
    lastOrder: "2024-04-30",
    loyaltyPoints: 1430,
    daysWithoutPurchase: 5,
    daysWithoutVisit: 18,
    sixMonthAverage: 445833,
    yearlyVariation: 22.1,
    potential: "Alto",
    phone: "+56 9 8844 7744",
    lastContact: "2024-05-04",
    nextVisit: "2024-05-20",
    collections: {
      pendingAmount: 0,
      daysOverdue: 0,
      pendingInvoices: 0,
      lastPaymentDate: "2024-04-30",
      paymentStatus: "current",
      overdueDocuments: []
    }
  },
  {
    id: "C005",
    name: "Peluquería Moderna",
    contact: "Claudia Torres",
    email: "claudia@peluqueriamoderna.cl",
    rut: "14.789.012-3",
    city: "Antofagasta",
    totalOrders: 15,
    totalSpent: 1980000,
    status: "active",
    lastOrder: "2024-04-18",
    loyaltyPoints: 990,
    daysWithoutPurchase: 17,
    daysWithoutVisit: 22,
    sixMonthAverage: 330000,
    yearlyVariation: 5.8,
    potential: "Bajo",
    phone: "+56 9 3366 7788",
    lastContact: "2024-04-30",
    nextVisit: "2024-05-22",
    collections: {
      pendingAmount: 230000,
      daysOverdue: 8,
      pendingInvoices: 1,
      lastPaymentDate: "2024-04-10",
      paymentStatus: "overdue",
      overdueDocuments: ["F007-2024"]
    }
  },
  {
    id: "C006",
    name: "Estilo Único",
    contact: "Manuel Rojas",
    email: "manuel@estilounico.cl",
    rut: "15.345.678-9",
    city: "Iquique",
    totalOrders: 12,
    totalSpent: 1345000,
    status: "prospect",
    lastOrder: "2024-03-20",
    loyaltyPoints: 675,
    daysWithoutPurchase: 45,
    daysWithoutVisit: 35,
    sixMonthAverage: 224167,
    yearlyVariation: -8.2,
    potential: "Medio",
    phone: "+56 9 7788 9900",
    lastContact: "2024-04-28",
    nextVisit: "2024-05-24",
    collections: {
      pendingAmount: 0,
      daysOverdue: 0,
      pendingInvoices: 0,
      lastPaymentDate: "2024-03-20",
      paymentStatus: "current",
      overdueDocuments: []
    }
  },
  {
    id: "C007",
    name: "Color Express",
    contact: "Patricia Fuentes",
    email: "patricia@colorexpress.cl",
    rut: "16.901.234-5",
    city: "Rancagua",
    totalOrders: 9,
    totalSpent: 980000,
    status: "active",
    lastOrder: "2024-04-22",
    loyaltyPoints: 490,
    daysWithoutPurchase: 13,
    daysWithoutVisit: 15,
    sixMonthAverage: 163333,
    yearlyVariation: 18.9,
    potential: "Medio",
    phone: "+56 9 2211 3344",
    lastContact: "2024-04-29",
    nextVisit: "2024-05-25",
    collections: {
      pendingAmount: 0,
      daysOverdue: 0,
      pendingInvoices: 0,
      lastPaymentDate: "2024-04-22",
      paymentStatus: "current",
      overdueDocuments: []
    }
  },
  {
    id: "C008",
    name: "Nuevo Prospect Salon",
    contact: "Ana Martínez",
    email: "ana@nuevoprospect.cl",
    rut: "17.567.890-1",
    city: "Santiago",
    totalOrders: 0,
    totalSpent: 0,
    status: "prospect",
    lastOrder: "",
    loyaltyPoints: 0,
    daysWithoutPurchase: 0,
    daysWithoutVisit: 30,
    sixMonthAverage: 0,
    yearlyVariation: 0,
    potential: "Alto",
    phone: "+56 9 9988 7766",
    lastContact: "2024-05-01",
    collections: {
      pendingAmount: 0,
      daysOverdue: 0,
      pendingInvoices: 0,
      lastPaymentDate: "",
      paymentStatus: "current",
      overdueDocuments: []
    }
  }
];

// KPI data for sales dashboard
export const salesKPIData = {
  monthlyGoal: 15000000, // $15M CLP
  currentSales: 12456000, // Current month sales
  activeClients: enhancedSalesCustomers.filter(c => c.status === "active").length,
  prospects: enhancedSalesCustomers.filter(c => c.status === "prospect").length,
  totalClients: enhancedSalesCustomers.length
};

// Collections KPI data
export const collectionsKPIData = {
  totalPendingAmount: enhancedSalesCustomers.reduce((sum, customer) => sum + (customer.collections?.pendingAmount || 0), 0),
  clientsWithDebt: enhancedSalesCustomers.filter(c => c.collections && c.collections.pendingAmount > 0).length,
  criticalClients: enhancedSalesCustomers.filter(c => c.collections && c.collections.paymentStatus === "critical").length,
  overdueClients: enhancedSalesCustomers.filter(c => c.collections && c.collections.paymentStatus === "overdue").length,
  averageDaysOverdue: Math.round(
    enhancedSalesCustomers
      .filter(c => c.collections && c.collections.daysOverdue > 0)
      .reduce((sum, c) => sum + (c.collections?.daysOverdue || 0), 0) /
    enhancedSalesCustomers.filter(c => c.collections && c.collections.daysOverdue > 0).length || 0
  )
};