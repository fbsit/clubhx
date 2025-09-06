
export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  lastOrder: string;
  loyaltyPoints: number;
}

export const mockCustomers: Customer[] = [
  {
    id: "C001",
    name: "Salon Elegance",
    contact: "María González",
    email: "maria@salonelegance.cl",
    city: "Santiago",
    totalOrders: 48,
    totalSpent: 8456000,
    status: "active",
    lastOrder: "2023-05-01",
    loyaltyPoints: 3450
  },
  {
    id: "C002",
    name: "Hair Design Studio",
    contact: "Carlos Pérez",
    email: "carlos@hairdesign.cl",
    city: "Viña del Mar",
    totalOrders: 32,
    totalSpent: 5240000,
    status: "active",
    lastOrder: "2023-04-28",
    loyaltyPoints: 2300
  },
  {
    id: "C003",
    name: "Beauty Zone",
    contact: "Andrea Muñoz",
    email: "andrea@beautyzone.cl",
    city: "Concepción",
    totalOrders: 26,
    totalSpent: 3890000,
    status: "inactive",
    lastOrder: "2023-03-15",
    loyaltyPoints: 1780
  },
  {
    id: "C004",
    name: "Arte y Estilo Spa",
    contact: "Roberto Silva",
    email: "roberto@arteyestilo.cl",
    city: "Valparaíso",
    totalOrders: 19,
    totalSpent: 2675000,
    status: "active",
    lastOrder: "2023-04-30",
    loyaltyPoints: 1430
  },
  {
    id: "C005",
    name: "Peluquería Moderna",
    contact: "Claudia Torres",
    email: "claudia@peluqueriamoderna.cl",
    city: "Antofagasta",
    totalOrders: 15,
    totalSpent: 1980000,
    status: "active",
    lastOrder: "2023-04-25",
    loyaltyPoints: 990
  },
  {
    id: "C006",
    name: "Estilo Único",
    contact: "Manuel Rojas",
    email: "manuel@estilounico.cl",
    city: "Iquique",
    totalOrders: 12,
    totalSpent: 1345000,
    status: "pending",
    lastOrder: "2023-04-20",
    loyaltyPoints: 675
  },
  {
    id: "C007",
    name: "Color Express",
    contact: "Patricia Fuentes",
    email: "patricia@colorexpress.cl",
    city: "Rancagua",
    totalOrders: 9,
    totalSpent: 980000,
    status: "active",
    lastOrder: "2023-04-22",
    loyaltyPoints: 490
  }
];
