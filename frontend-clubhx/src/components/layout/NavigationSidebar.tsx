
import { User } from "@/types/auth";
import Sidebar from "./Sidebar";
import AdminSidebar from "./AdminSidebar";
import SalesSidebar from "./SalesSidebar";
import SidebarToggle from "./SidebarToggle";
import { useCollapsible } from "@/contexts/CollapsibleContext";

interface NavigationSidebarProps {
  user: User | null;
}

export default function NavigationSidebar({ user }: NavigationSidebarProps) {
  const { sidebarState } = useCollapsible();
  // Reduce noisy logs to avoid potential render thrash in prod
  // console.info("NavigationSidebar - user:", user?.email, "role:", user?.role);
  
  const renderNavigation = () => {
    // Always show sidebar, even without user for better UX
    if (!user) {
      console.log("NavigationSidebar - No user, showing default sidebar");
      return <Sidebar sidebarState={sidebarState} />;
    }
    
    // Show navigation based on user role
    switch (user.role) {
      case "admin":
        return <AdminSidebar sidebarState={sidebarState} />;
      case "sales":
        return <SalesSidebar sidebarState={sidebarState} />;
      case "client":
      default:
        return <Sidebar sidebarState={sidebarState} />;
    }
  };

  return (
    // Cambiamos: sidebar solo visible a partir de md (≥768px)
    <div className="sticky top-16 h-[calc(100vh-4rem)] z-20 transition-all duration-300 flex hidden md:flex">
      {renderNavigation()}
      
      {/* Position the toggle button at the right edge of the sidebar */}
      <div className="relative flex items-center h-full">
        <SidebarToggle className="md:flex hidden" />
      </div>
    </div>
  );
}

