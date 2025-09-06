
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Package } from "lucide-react";

interface CommonRoleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: {
    client?: React.ReactNode;
    sales?: React.ReactNode;
    admin?: React.ReactNode;
  };
  userRole?: string;
}

export default function CommonRoleTabs({
  activeTab,
  setActiveTab,
  children,
  userRole
}: CommonRoleTabsProps) {
  console.log("CommonRoleTabs - userRole:", userRole, "activeTab:", activeTab);

  // For development and UI/UX testing, show all tabs
  const showAllTabs = true;

  // Determine which tabs to show
  const showClientTab = showAllTabs || userRole === "client" || userRole === "admin" || userRole === "sales";
  const showSalesTab = showAllTabs || userRole === "sales" || userRole === "admin";
  const showAdminTab = showAllTabs || userRole === "admin";

  // Always ensure at least the client tab is available
  const hasAnyTab = showClientTab || showSalesTab || showAdminTab;
  if (!hasAnyTab) {
    console.log("CommonRoleTabs - No tabs available, forcing client tab");
    return (
      <Tabs value="client" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 relative z-30">
          <TabsTrigger value="client" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Visión General
          </TabsTrigger>
        </TabsList>
        <TabsContent value="client" className="relative z-20">
          {children.client || <DefaultTabContent roleName="Visión General" />}
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 relative z-30">
        {showClientTab && (
          <TabsTrigger value="client" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Visión General
          </TabsTrigger>
        )}
        {showSalesTab && (
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Comercial
          </TabsTrigger>
        )}
        {showAdminTab && (
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Administración
          </TabsTrigger>
        )}
      </TabsList>

      {showClientTab && (
        <TabsContent value="client" className="relative z-20">
          {children.client || <DefaultTabContent roleName="Visión General" />}
        </TabsContent>
      )}

      {showSalesTab && (
        <TabsContent value="sales" className="relative z-20">
          {children.sales || <DefaultTabContent roleName="Comercial" />}
        </TabsContent>
      )}

      {showAdminTab && (
        <TabsContent value="admin" className="relative z-20">
          {children.admin || <DefaultTabContent roleName="Administración" />}
        </TabsContent>
      )}
    </Tabs>
  );
}

function DefaultTabContent({ roleName }: { roleName: string }) {
  return (
    <div className="p-6 text-center border rounded-md bg-muted/20">
      <h3 className="text-lg font-medium mb-2">Vista de {roleName}</h3>
      <p className="text-muted-foreground">
        El contenido para esta vista está en desarrollo.
      </p>
    </div>
  );
}
