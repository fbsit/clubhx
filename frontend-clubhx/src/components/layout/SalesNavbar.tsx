
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./sales/MobileHeader";
import { SalesNavigationGroups } from "./sales/SalesNavigationGroups";
import { UserProfile } from "./sales/UserProfile";
import { salesNavigationGroups } from "./sales/SalesNavigationData";
import { 
  Users, 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  User, 
  Heart, 
  ShoppingCart,
  BarChart
} from "lucide-react";

export default function SalesNavbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  // Function to render icon based on string name
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    switch (iconName) {
      case "LayoutDashboard": return <LayoutDashboard {...iconProps} />;
      case "BarChart": return <BarChart {...iconProps} />;
      case "Users": return <Users {...iconProps} />;
      case "FileText": return <FileText {...iconProps} />;
      case "ShoppingCart": return <ShoppingCart {...iconProps} />;
      case "Heart": return <Heart {...iconProps} />;
      case "Calendar": return <Calendar {...iconProps} />;
      case "User": return <User {...iconProps} />;
      default: return null;
    }
  };

  // Process navigation data to include rendered icons
  const processedNavigationGroups = salesNavigationGroups.map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      icon: renderIcon(item.icon as string),
    })),
  }));

  // Create flat navigation for mobile
  const processedFlatNavigation = salesNavigationGroups.flatMap(group => group.items).map(item => ({
    ...item,
    icon: renderIcon(item.icon as string),
  }));

  const getPageTitle = (pathname: string) => {
    const item = salesNavigationGroups.flatMap(group => group.items).find(item => item.to === pathname);
    return item?.label || "Dashboard";
  };

  if (isMobile) {
    return (
      <MobileHeader 
        user={user}
        pageTitle={getPageTitle(location.pathname)}
        navigation={processedFlatNavigation}
        activePath={location.pathname}
        logout={logout}
      />
    );
  }

  return (
    <div className="hidden md:block border-b sticky top-0 bg-background z-30">
      <div className="h-16 flex items-center px-6 gap-4">
        <SalesNavigationGroups 
          groups={processedNavigationGroups}
          isActive={isActive}
        />
        <UserProfile user={user} />
      </div>
    </div>
  );
}
