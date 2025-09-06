
import { useLocation } from "react-router-dom";
import { CollapsibleState } from "@/components/dashboard/dashboardTypes";
import { cn } from "@/lib/utils";
import { salesNavigationGroups } from "./sales/SalesNavigationData";
import { SalesNavigationGroups } from "./sales/SalesNavigationGroups";
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  User, 
  Heart, 
  Calendar,
  BarChart,
  ShoppingCart,
  UserRound,
  MessageSquare
} from "lucide-react";
import { SalesNavItem } from "./sales/SalesNavItem";
import { Link } from "react-router-dom";

interface SalesSidebarProps {
  sidebarState: CollapsibleState;
}

export default function SalesSidebar({ sidebarState }: SalesSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const sidebarWidth = {
    expanded: "w-64",
    collapsed: "w-16", 
    icon: "w-16"
  }[sidebarState];

  // Function to render icon based on string name
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (iconName) {
      case "LayoutDashboard": return <LayoutDashboard {...iconProps} />;
      case "Package": return <Package {...iconProps} />;
      case "FileText": return <FileText {...iconProps} />;
      case "Users": return <Users {...iconProps} />;
      case "User": return <User {...iconProps} />;
      case "Heart": return <Heart {...iconProps} />;
      case "Calendar": return <Calendar {...iconProps} />;
      case "BarChart": return <BarChart {...iconProps} />;
      case "ShoppingCart": return <ShoppingCart {...iconProps} />;
      case "UserRound": return <UserRound {...iconProps} />;
      case "MessageSquare": return <MessageSquare {...iconProps} />;
      default: return null;
    }
  };

  return (
    <div className={cn(
      "h-full bg-background border-r transition-all duration-300 flex flex-col",
      sidebarWidth
    )}>
      {/* Header */}

      {/* Navigation */}
      {sidebarState === "expanded" ? (
        <SalesNavigationGroups 
          groups={salesNavigationGroups}
          isActive={isActive}
        />
      ) : (
        <nav className="flex-1 space-y-2 p-2">
          {salesNavigationGroups.flatMap(group => group.items).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center justify-center p-2 rounded-lg transition-colors",
                isActive(item.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
              title={item.label} // Tooltip para mostrar el nombre al hacer hover
            >
              {/* Icon only for collapsed state */}
              <div className="h-4 w-4">
                {renderIcon(item.icon as string)}
              </div>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
