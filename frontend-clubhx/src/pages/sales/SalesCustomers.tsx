
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { SalesKPIHeader } from "@/components/sales/SalesKPIHeader";
import { CollectionsKPIHeader } from "@/components/sales/CollectionsKPIHeader";
import { SalesClientsTabNavigation } from "@/components/sales/SalesClientsTabNavigation";
import { AdvancedSalesClientTable } from "@/components/sales/AdvancedSalesClientTable";
import { CollectionsTable } from "@/components/sales/CollectionsTable";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSalesCustomers from "@/components/sales/MobileSalesCustomers";
import InternalClientRegistrationDialog from "@/components/admin/InternalClientRegistrationDialog";
import { salesCustomersApi, type SalesCustomer } from "@/services/salesCustomersApi";
import { toast } from "sonner";

export default function SalesCustomers() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "prospects" | "collections">("active");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    prospects: 0,
    withCollections: 0
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters: { status?: string; search?: string } = {};
        if (activeTab === "active") {
          filters.status = "active";
        } else if (activeTab === "prospects") {
          filters.status = "prospect";
        }
        if (searchQuery.trim()) {
          filters.search = searchQuery;
        }

        const response = await salesCustomersApi.listCustomers(filters);
        setCustomers(response.customers);
        setStats({
          total: response.total,
          active: response.active,
          prospects: response.prospects,
          withCollections: response.withCollections
        });
      } catch (err: any) {
        setError(err?.message || 'Error cargando clientes');
        toast.error('Error cargando clientes', { description: err?.message });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [activeTab, searchQuery]);

  // Filter customers based on search and tab
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Filter by tab
    if (activeTab === "active") {
      filtered = filtered.filter(customer => customer.status === "active" || customer.status === "inactive");
    } else if (activeTab === "prospects") {
      filtered = filtered.filter(customer => customer.status === "prospect");
    } else if (activeTab === "collections") {
      // For collections, show customers with pending amounts
      filtered = filtered.filter(customer => customer.collections && customer.collections.pendingAmount > 0);
    }

    return filtered;
  }, [customers, activeTab]);

  const activeClientsCount = stats.active;
  const prospectsCount = stats.prospects;
  const collectionsCount = stats.withCollections;

  // Calculate KPI data from backend response
  const salesKPIData = {
    monthlyGoal: 4500000,
    currentSales: customers.reduce((sum, customer) => sum + customer.totalSales, 0),
    activeClients: stats.active,
    prospects: stats.prospects
  };

  const collectionsKPIData = {
    totalPendingAmount: customers.reduce((sum, customer) => sum + customer.collections.pendingAmount, 0),
    clientsWithDebt: stats.withCollections,
    criticalClients: customers.filter(c => c.collections.overdueAmount > 0).length,
    averageDaysOverdue: 15 // Mock data
  };

  // Use mobile-specific component for mobile devices
  if (isMobile) {
    return (
      <MobileSalesCustomers
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredCustomers={filteredCustomers}
        activeClientsCount={activeClientsCount}
        prospectsCount={prospectsCount}
        collectionsCount={collectionsCount}
      />
    );
  }

  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Clientes</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tu cartera de clientes y prospectos
              </p>
            </div>
            <Button disabled>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-background">
        <div className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mis Clientes</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tu cartera de clientes y prospectos
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
        <div className="p-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mis Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tu cartera de clientes y prospectos
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* KPI Header */}
        {activeTab === "collections" ? (
          <CollectionsKPIHeader
            totalPendingAmount={collectionsKPIData.totalPendingAmount}
            clientsWithDebt={collectionsKPIData.clientsWithDebt}
            criticalClients={collectionsKPIData.criticalClients}
            averageDaysOverdue={collectionsKPIData.averageDaysOverdue}
          />
        ) : (
          <SalesKPIHeader
            monthlyGoal={salesKPIData.monthlyGoal}
            currentSales={salesKPIData.currentSales}
            activeClients={salesKPIData.activeClients}
            prospects={salesKPIData.prospects}
          />
        )}

        {/* Main Content Card */}
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>
                {activeTab === "collections" ? "Gestión de Cobranzas" : "Cartera de Clientes"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avanzados
                </Button>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <SalesClientsTabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              activeCount={activeClientsCount}
              prospectsCount={prospectsCount}
              collectionsCount={collectionsCount}
            />
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2">
                <Input
                  placeholder={
                    activeTab === "collections" 
                      ? "Buscar por cliente, RUT o número de documento..."
                      : "Buscar por nombre, contacto, email, ciudad o RUT..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="md:max-w-md"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Table */}
            {activeTab === "collections" ? (
              <CollectionsTable customers={filteredCustomers} />
            ) : (
              <AdvancedSalesClientTable customers={filteredCustomers} />
            )}
          </CardContent>
        </Card>
      </div>

      <InternalClientRegistrationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onClientCreated={() => {
          // Refresh the client list if needed
          console.log('New client created from sales');
        }}
      />
    </div>
  );
}
