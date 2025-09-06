import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import FloatingActionMenu from "./FloatingActionMenu";
import { User } from "@/types/auth";

type MobileHeaderProps = {
  user: User | null;
  pageTitle: string;
  navigation: { to: string; label: string; icon?: React.ReactNode }[];
  activePath: string;
  logout: () => void;
};

export const MobileHeader = ({ 
  user, 
  pageTitle, 
  navigation, 
  activePath, 
  logout 
}: MobileHeaderProps) => {
  // User minimal profile for avatar
  const mobileNavUser = user ? {
    name: user.name,
    company: user.company ?? "",
    avatarUrl: user.avatarUrl
  } : {
    name: "Usuario",
    company: "Salón",
    avatarUrl: ""
  };

  // Detectar rol (asume prop user)
  const isSales = user?.role === "sales";

  return (
    <>
      <div className="flex items-center justify-between px-5 py-3 border-b sticky top-0 bg-background z-30">
        <h1 className="text-lg font-medium">{pageTitle}</h1>
        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
          <AvatarImage src={user?.avatarUrl} alt={user?.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      {/* El FAB ya no va aquí, está en MainLayout */}
    </>
  );
};
