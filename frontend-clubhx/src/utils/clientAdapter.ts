import type { ClientDto } from "@/services/clientsApi";

// Front UI customer type used currently in admin tables/cards
export interface CustomerUI {
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

export function adaptClientToUI(dto: ClientDto): CustomerUI {
  return {
    id: dto.id,
    name: dto.name || dto.fantasy_name || "Cliente",
    contact: dto.contact || dto.payment_contact || dto.name || "",
    email: dto.email || "",
    city: dto.city || dto.municipality || "",
    totalOrders: dto.calc_total_sales_avg ?? 0,
    totalSpent: dto.calc_total_sales ?? 0,
    status: dto.is_active ? "active" : dto.is_banned ? "inactive" : "pending",
    lastOrder: dto.modified || dto.created || "",
    loyaltyPoints: 0,
  };
}

export function adaptClientsToUI(dtos: ClientDto[]): CustomerUI[] {
  return dtos.map(adaptClientToUI);
}


