import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { mobileNavigation } from "./header/navigationItems";
import MobileNav from "./MobileNav";
import Logo from "./header/Logo";
import UserMenu from "./header/UserMenu";
import MobileMenuButton from "./header/MobileMenuButton";
import MobileUserAvatar from "./header/MobileUserAvatar";


// Icon imports
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingCart, 
  Star, 
  Heart, 
  CalendarCheck, 
  User 
} from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detectar si es mobile (sm) y sales/admin/client
  const isSalesMobile =
    user?.role === "sales" &&
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  const isAdminMobile =
    user?.role === "admin" &&
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  const isClientMobile =
    user?.role === "client" &&
    typeof window !== "undefined" &&
    window.innerWidth < 768;

  // Mock user if none exists for development
  const mockUser = user
    ? {
        name: user.name,
        company: user.company || "Salón Demo",
        avatarUrl: user.avatarUrl,
      }
    : {
        name: "Usuario Prueba",
        company: "Salón Demo",
        avatarUrl: "",
      };

  // Function to render icon based on string identifier
  const renderIcon = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case "dashboard":
        return <LayoutDashboard {...iconProps} />;
      case "products":
        return <Package {...iconProps} />;
      case "orders":
        return <FileText {...iconProps} />;
      case "quotations":
        return <ShoppingCart {...iconProps} />;
      case "loyalty":
        return <Star {...iconProps} />;
      case "loyalty-products":
        return <Heart {...iconProps} />;
      case "calendar":
        return <CalendarCheck {...iconProps} />;
      case "events":
        return <CalendarCheck {...iconProps} />;
      case "wishlist":
        return <Heart {...iconProps} />;
      case "profile":
        return <User {...iconProps} />;
      default:
        return null;
    }
  };

  // Process navigation items to include rendered icons
  const navigationWithIcons = mobileNavigation.map(item => ({
    ...item,
    icon: (
      <span className="h-5 w-5 flex items-center justify-center">
        {renderIcon(item.icon)}
      </span>
    ),
  }));

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-16 items-center w-full">
          {/* Versión móvil: Solo logo centrado */}
          <div className="flex md:hidden w-full justify-center">
            <Logo />
          </div>

          {/* Versión desktop: Logo a la izquierda y usuario a la derecha */}
          <div className="hidden md:flex w-full justify-between items-center">
            {/* Logo alineado a la izquierda */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Usuario alineado a la derecha */}
            <div className="flex items-center gap-4">
              <UserMenu user={mockUser} logout={logout} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
