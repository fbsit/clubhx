
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

type NavigationItem = {
  to: string;
  label: string;
  icon?: React.ReactNode;
};

interface MobileNavProps {
  user: {
    name: string;
    company: string;
    avatarUrl?: string;
  };
  navigation: NavigationItem[];
  logout: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  activePath: string;
}

export default function MobileNav({ 
  user, 
  navigation, 
  logout, 
  setMobileMenuOpen,
  activePath
}: MobileNavProps) {
  const [animateItems, setAnimateItems] = useState(false);

  // Apply staggered animation to menu items for a more refined experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Group navigation items for better organization
  const groupedNavigation = [
    {
      title: "Mi Cuenta",
      items: navigation.filter(item => 
        item.to === "/profile" || 
        item.to === "/dashboard"
      )
    },
    {
      title: "Compras",
      items: navigation.filter(item => 
        item.to === "/products" || 
        item.to === "/orders" || 
        item.to === "/quotations"
      )
    },
    {
      title: "Programa de Lealtad",
      items: navigation.filter(item => 
        item.to === "/loyalty" || 
        item.to === "/loyalty-products" || 
        item.to === "/events"
      )
    },
    {
      title: "Gestión",
      items: navigation.filter(item => 
        item.to === "/admin/customers" || 
        item.to === "/admin/vendors" || 
        item.to === "/admin/reviews" || 
        item.to === "/admin/analytics" ||
        item.to === "/rejected-quotations"
      )
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Mobile User Profile */}
      <div className="border-b p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-background shadow-sm">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-base">{user.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{user.company}</p>
          </div>
        </div>
      </div>
      
      {/* Grouped Mobile Navigation */}
      <nav className="flex-1 p-3 space-y-5 overflow-auto">
        {groupedNavigation.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground tracking-wider uppercase px-4 mb-2">
              {group.title}
            </h3>
            {group.items.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                  animateItems ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                  activePath === item.to
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent"
                )}
                onClick={() => setMobileMenuOpen(false)}
                style={{ 
                  transitionDelay: `${(groupIndex * 3 + index) * 30}ms`,
                  transitionProperty: "transform, opacity, background-color",
                  transitionDuration: "300ms"
                }}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
      
      {/* Mobile Footer / Logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start py-3 px-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
          onClick={() => {
            setMobileMenuOpen(false);
            logout();
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
