
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  FileText,
  Calendar,
  BarChart,
  Briefcase,
  CalendarDays,
  Tags,
  CreditCard,
  Truck,
  UserPlus,
  Heart
} from "lucide-react";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useNotifications } from "@/contexts/NotificationContext";

export type NavigationItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  alert?: boolean;
  showBadge?: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const useAdminNavigationGroups = (): NavigationGroup[] => {
  const { getNotificationForRoute } = useNotifications();

  return [
  {
    label: "Productos y Lealtad",
    items: [
      {
        to: "/main/products",
        label: "Catálogo",
        icon: <Package className="h-5 w-5" />,
      },
      {
        to: "/main/admin/categories",
        label: "Categorías",
        icon: <Tags className="h-5 w-5" />,
      },
      {
        to: "/main/admin/shipping-zones",
        label: "Zonas de Envío",
        icon: <Truck className="h-5 w-5" />,
      },
      {
        to: "/main/events",
        label: "Eventos",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        to: "/main/loyalty",
        label: "Productos de Lealtad",
        icon: <Package className="h-5 w-5" />,
      },
    ],
  },
  {
    label: "Visión General",
    items: [
      {
        to: "/main/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        to: "/main/orders",
        label: "Pedidos",
        icon: <FileText className="h-5 w-5" />,
        showBadge: true,
      },
    ],
  },
  {
    label: "Gestión",
    items: [
      {
        to: "/main/admin/vendors",
        label: "Vendedores",
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        to: "/main/admin/sales-calendar",
        label: "Calendario Vendedores",
        icon: <CalendarDays className="h-5 w-5" />,
      },
      {
        to: "/main/admin/customers",
        label: "Clientes",
        icon: <Users className="h-5 w-5" />,
      },
      {
        to: "/main/admin/registration-requests",
        label: "Solicitudes de Registro",
        icon: <UserPlus className="h-5 w-5" />,
        showBadge: true,
      },
      {
        to: "/main/admin/credit-requests",
        label: "Solicitudes de Crédito",
        icon: <CreditCard className="h-5 w-5" />,
        showBadge: true,
      },
      {
        to: "/main/admin/analytics",
        label: "Analítica",
        icon: <BarChart className="h-5 w-5" />,
      },
      {
        to: "/main/admin/wishlist-analytics",
        label: "Analytics de Wishlist",
        icon: <Heart className="h-5 w-5" />,
        showBadge: true,
      },
    ],
  },
  ];
};
