import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalesClientsTabNavigationProps {
  activeTab: "active" | "prospects" | "collections";
  onTabChange: (tab: "active" | "prospects" | "collections") => void;
  activeCount: number;
  prospectsCount: number;
  collectionsCount: number;
}

export function SalesClientsTabNavigation({ 
  activeTab, 
  onTabChange, 
  activeCount, 
  prospectsCount,
  collectionsCount
}: SalesClientsTabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "active" | "prospects" | "collections")}>
      <TabsList className="grid w-full grid-cols-3 max-w-2xl">
        <TabsTrigger value="active" className="flex items-center gap-2">
          Clientes Activos
          <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
            {activeCount}
          </span>
        </TabsTrigger>
        <TabsTrigger value="prospects" className="flex items-center gap-2">
          Prospectos
          <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
            {prospectsCount}
          </span>
        </TabsTrigger>
        <TabsTrigger value="collections" className="flex items-center gap-2">
          Cobranzas
          <span className="ml-1 rounded-full bg-red-100 text-red-800 px-2 py-0.5 text-xs font-medium">
            {collectionsCount}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}