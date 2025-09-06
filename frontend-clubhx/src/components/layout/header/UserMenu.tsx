
import { Link } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    name: string;
    company: string;
    avatarUrl?: string;
  };
  logout: () => void;
}

export default function UserMenu({ user, logout }: UserMenuProps) {
  const { user: authUser } = useAuth();
  const isAdmin = authUser?.role === "admin";
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background hover:bg-accent">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user.name}</span>
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-56 p-2">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.company}</p>
              </div>
              <div className="mt-2">
                {isAdmin ? (
                  <Link to="/main/settings">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Button>
                  </Link>
                ) : authUser?.role === "sales" ? (
                  <Link to="/main/sales/settings">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Button>
                  </Link>
                ) : (
                  <Link to="/main/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      <span className="h-4 w-4 mr-2 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
                      </span>
                      Mi Perfil
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
