
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/auth";
import ClientLoyaltyView from "@/components/loyalty/ClientLoyaltyView";
import SalesLoyaltyView from "@/components/loyalty/SalesLoyaltyView";
import AdminLoyaltyProducts from "@/pages/admin/AdminLoyaltyProducts";

interface RoleTabsProps {
  activeRole: string;
  setActiveRole: (value: string) => void;
  userRole?: UserRole;
  totalPoints: number;
  isMobile: boolean;
}

export const RoleTabs: React.FC<RoleTabsProps> = (
  activeRole,
  setActiveRole,
  userRole,
  totalPoints,
  isMobile
) => {
  console.log("RoleTabs - userRole:", userRole, "activeRole:", activeRole);

  // For UI/UX development, show all tabs to allow testing
  const showAllTabs = true;

  if (showAllTabs) {
    return (
      <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="client" className="py-2.5">General</TabsTrigger>
          <TabsTrigger value="sales" className="py-2.5">Comercial</TabsTrigger>
          <TabsTrigger value="admin" className="py-2.5">Administración</TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="mt-0">
          <ClientLoyaltyView 
            totalPoints={totalPoints} 
            isMobile={isMobile} 
          />
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <SalesLoyaltyView />
        </TabsContent>

        <TabsContent value="admin" className="mt-0">
          <AdminLoyaltyProducts />
        </TabsContent>
      </Tabs>
    );
  }

  // Production logic (strict role separation)
  const showClientTab = true; // Everyone can see general loyalty view
  const showSalesTab = userRole === 'sales' || userRole === 'admin';
  const showAdminTab = userRole === 'admin';

  // Count available tabs
  const availableTabs = [];
  if (showClientTab) availableTabs.push('client');
  if (showSalesTab) availableTabs.push('sales'); 
  if (showAdminTab) availableTabs.push('admin');

  // Ensure at least one tab is available
  if (availableTabs.length === 0) {
    console.log("RoleTabs - No tabs available, showing client by default");
    return (
      <Tabs value="client" onValueChange={setActiveRole} className="mb-6">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="client" className="py-2.5">General</TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="mt-0">
          <ClientLoyaltyView 
            totalPoints={totalPoints} 
            isMobile={isMobile} 
          />
        </TabsContent>
      </Tabs>
    );
  }

  const gridCols = availableTabs.length === 1 ? 'grid-cols-1' :
                   availableTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6">
      <TabsList className={`w-full grid ${gridCols} mb-6`}>
        {showClientTab && (
          <TabsTrigger value="client" className="py-2.5">General</TabsTrigger>
        )}
        {showSalesTab && (
          <TabsTrigger value="sales" className="py-2.5">Comercial</TabsTrigger>
        )}
        {showAdminTab && (
          <TabsTrigger value="admin" className="py-2.5">Administración</TabsTrigger>
        )}
      </TabsList>

      {showClientTab && (
        <TabsContent value="client" className="mt-0">
          <ClientLoyaltyView 
            totalPoints={totalPoints} 
            isMobile={isMobile} 
          />
        </TabsContent>
      )}

      {showSalesTab && (
        <TabsContent value="sales" className="mt-0">
          <SalesLoyaltyView />
        </TabsContent>
      )}

      {showAdminTab && (
        <TabsContent value="admin" className="mt-0">
          <AdminLoyaltyProducts />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default RoleTabs;
