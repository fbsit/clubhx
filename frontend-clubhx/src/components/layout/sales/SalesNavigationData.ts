
import { ReactNode } from "react";

// Navigation item type
type NavigationItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

// Navigation group type
type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

// Sales navigation groups
export const salesNavigationGroups: NavigationGroup[] = [
  {
    title: "Principal",
    items: [
      {
        to: "/main/dashboard",
        label: "Dashboard",
        icon: "LayoutDashboard",
      },
      {
        to: "/main/products",
        label: "Productos",
        icon: "Package",
      },
    ]
  },
  {
    title: "Programa de Lealtad",
    items: [
      {
        to: "/main/events",
        label: "Eventos",
        icon: "Calendar",
      },
      {
        to: "/main/loyalty",
        label: "Puntos",
        icon: "Star",
      }
    ]
  },
  {
    title: "Ventas",
    items: [
      {
        to: "/main/orders",
        label: "Pedidos",
        icon: "ShoppingCart",
      },
      {
        to: "/main/sales/analytics",
        label: "Analítica",
        icon: "BarChart",
      },
    ]
  },
  {
    title: "Clientes",
    items: [
      {
        to: "/main/sales/customers",
        label: "Mis Clientes",
        icon: "Users",
      },
      {
        to: "/main/sales/calendar",
        label: "Mi Calendario",
        icon: "Calendar",
      }
    ]
  }
];

// Export types for use in other components
export type { NavigationItem, NavigationGroup };
