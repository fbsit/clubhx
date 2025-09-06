
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  User, 
  Heart, 
  Calendar,
  BarChart,
  Star,
  ShoppingCart
} from "lucide-react";
import { SalesNavItem } from "./SalesNavItem";
import { NavigationGroup } from "./SalesNavigationData";

type SalesNavigationGroupsProps = {
  groups: NavigationGroup[];
  isActive: (path: string) => boolean;
};

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
    case "Star": return <Star {...iconProps} />;
    case "ShoppingCart": return <ShoppingCart {...iconProps} />;
    default: return null;
  }
};

export const SalesNavigationGroups = ({ groups, isActive }: SalesNavigationGroupsProps) => {
  return (
    <nav className="flex-1 space-y-6 p-4">
      {groups.map((group, index) => (
        <div key={index}>
          <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            {group.title}
          </h3>
          <div className="space-y-1">
            {group.items.map((item) => (
              <SalesNavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={renderIcon(item.icon as string)}
                isActive={isActive(item.to)}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};
