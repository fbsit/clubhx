
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { 
  User, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Star, 
  CalendarCheck, 
  Heart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  collapsed?: boolean;
};

const NavItem = ({ to, label, icon, isActive, collapsed = false }: NavItemProps) => {
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={to}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="h-6 w-6 flex items-center justify-center">
                {icon}
              </div>
              <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

type SidebarProps = {
  sidebarState: "expanded" | "collapsed" | "icon";
};

export default function Sidebar({ sidebarState }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const collapsed = sidebarState === "collapsed" || sidebarState === "icon";

  // Navegación específica para CLIENTES (removido "Cotizaciones")
  const navigation = [
    // Mi Cuenta group
    {
      group: "Mi Cuenta",
      items: [
        {
          to: "/main/settings",
          label: "Configuración",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <User className="h-5 w-5" />
          </span>,
        },
        {
          to: "/main/dashboard",
          label: "Dashboard",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5" />
          </span>,
        }
      ]
    },
    // Compras group
    {
      group: "Compras",
      items: [
        {
          to: "/main/products",
          label: "Catálogo",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </span>,
        },
        {
          to: "/main/orders",
          label: "Pedidos",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </span>,
        },
      ]
    },
    // Programa de Lealtad group
    {
      group: "Programa de Lealtad",
      items: [
        {
          to: "/main/loyalty",
          label: "Mis Puntos",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <Star className="h-5 w-5" />
          </span>,
        },
        {
          to: "/main/schedule",
          label: "Visitas",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5" />
          </span>,
        },
        {
          to: "/main/events",
          label: "Eventos",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5" />
          </span>,
        },
        {
          to: "/main/wishlist",
          label: "Lista de Deseos",
          icon: <span className="h-6 w-6 flex items-center justify-center">
            <Heart className="h-5 w-5" />
          </span>,
        },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  return (
    <aside className={`hidden md:flex flex-col border-r bg-card h-full transition-all duration-300 ${
      collapsed ? "w-[70px]" : "w-64"
    }`}>
      <ScrollArea className="flex-1 h-full p-4">
        <div className="space-y-8 mt-4">
          {navigation.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {!collapsed && (
                <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase px-4 mb-2">
                  {group.group}
                </h3>
              )}
              <nav className="space-y-1.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive(item.to)}
                    collapsed={collapsed}
                  />
                ))}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
