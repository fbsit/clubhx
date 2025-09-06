import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, MapPin, TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import { enhancedSalesCustomers, salesKPIData, collectionsKPIData, EnhancedSalesCustomer } from "@/data/enhancedSalesCustomers";
import InternalClientRegistrationDialog from "@/components/admin/InternalClientRegistrationDialog";

interface MobileSalesCustomersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: "active" | "prospects" | "collections";
  setActiveTab: (tab: "active" | "prospects" | "collections") => void;
  filteredCustomers: EnhancedSalesCustomer[];
  activeClientsCount: number;
  prospectsCount: number;
  collectionsCount: number;
}

// Mobile KPI Card Component
const MobileKPICard = ({ 
  title, 
  value, 
  subvalue, 
  icon: Icon, 
  trend,
  trendDirection = "up" 
}: {
  title: string;
  value: string;
  subvalue?: string;
  icon: React.ComponentType<any>;
  trend?: string;
  trendDirection?: "up" | "down";
}) => (
  <Card className="bg-gradient-to-br from-card to-card/50">
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span className="text-xs font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs text-muted-foreground font-medium">{title}</h3>
        <p className="text-lg font-bold">{value}</p>
        {subvalue && (
          <p className="text-xs text-muted-foreground">{subvalue}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

// Mobile Customer Card Component
const MobileCustomerCard = ({ customer }: { customer: EnhancedSalesCustomer }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "prospect": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case "Alto": return "bg-red-100 text-red-800";
      case "Medio": return "bg-yellow-100 text-yellow-800";
      case "Bajo": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{customer.name}</h3>
            <p className="text-xs text-muted-foreground">{customer.rut}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getStatusColor(customer.status)}>
              {customer.status === "active" ? "Activo" : 
               customer.status === "inactive" ? "Inactivo" : "Prospecto"}
            </Badge>
            {customer.potential && (
              <Badge variant="outline" className={getPotentialColor(customer.potential)}>
                {customer.potential}
              </Badge>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{customer.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{customer.city}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total gastado</p>
            <p className="text-sm font-semibold">${customer.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Última orden</p>
            <p className="text-sm font-semibold">{customer.lastOrder}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile Collections Card Component
const MobileCollectionsCard = ({ customer }: { customer: EnhancedSalesCustomer }) => {
  if (!customer.collections) return null;

  const getDaysOverdueColor = (days: number) => {
    if (days > 90) return "text-red-600";
    if (days > 60) return "text-orange-600";
    if (days > 30) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{customer.name}</h3>
            <p className="text-xs text-muted-foreground">{customer.rut}</p>
          </div>
          <Badge variant="destructive">
            ${customer.collections.pendingAmount.toLocaleString()}
          </Badge>
        </div>

        {/* Collection Details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Días vencido:</span>
            <span className={`text-xs font-semibold ${getDaysOverdueColor(customer.collections.daysOverdue)}`}>
              {customer.collections.daysOverdue} días
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Documentos:</span>
            <span className="text-xs">{customer.collections.overdueDocuments?.length || 0}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs">{customer.contact}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile Tab Navigation
const MobileTabNavigation = ({ 
  activeTab, 
  onTabChange, 
  activeCount, 
  prospectsCount, 
  collectionsCount 
}: {
  activeTab: "active" | "prospects" | "collections";
  onTabChange: (tab: "active" | "prospects" | "collections") => void;
  activeCount: number;
  prospectsCount: number;
  collectionsCount: number;
}) => (
  <div className="grid grid-cols-3 gap-2">
    <Button
      variant={activeTab === "active" ? "default" : "outline"}
      size="sm"
      onClick={() => onTabChange("active")}
      className="text-xs h-8"
    >
      Activos ({activeCount})
    </Button>
    <Button
      variant={activeTab === "prospects" ? "default" : "outline"}
      size="sm"
      onClick={() => onTabChange("prospects")}
      className="text-xs h-8"
    >
      Prospectos ({prospectsCount})
    </Button>
    <Button
      variant={activeTab === "collections" ? "default" : "outline"}
      size="sm"
      onClick={() => onTabChange("collections")}
      className="text-xs h-8"
    >
      Cobranzas ({collectionsCount})
    </Button>
  </div>
);

export default function MobileSalesCustomers({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  filteredCustomers,
  activeClientsCount,
  prospectsCount,
  collectionsCount
}: MobileSalesCustomersProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="h-full bg-background">
      {/* Mobile Header */}
      <div className="bg-white border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-foreground">Mis Clientes</h1>
            <p className="text-xs text-muted-foreground">
              Gestiona tu cartera
            </p>
          </div>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* KPI Cards */}
        {activeTab === "collections" ? (
          <div className="grid grid-cols-2 gap-3">
            <MobileKPICard
              title="Monto Pendiente"
              value={`$${collectionsKPIData.totalPendingAmount.toLocaleString()}`}
              icon={DollarSign}
              trend="-8%"
              trendDirection="down"
            />
            <MobileKPICard
              title="Clientes con Deuda"
              value={collectionsKPIData.clientsWithDebt.toString()}
              icon={Users}
              trend="+3"
              trendDirection="up"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <MobileKPICard
              title="Meta Mensual"
              value={`$${salesKPIData.monthlyGoal.toLocaleString()}`}
              subvalue={`Actual: $${salesKPIData.currentSales.toLocaleString()}`}
              icon={DollarSign}
              trend="+12%"
            />
            <MobileKPICard
              title="Clientes Activos"
              value={salesKPIData.activeClients.toString()}
              subvalue={`Prospectos: ${salesKPIData.prospects}`}
              icon={Users}
              trend="+5"
            />
          </div>
        )}

        {/* Tab Navigation */}
        <MobileTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeCount={activeClientsCount}
          prospectsCount={prospectsCount}
          collectionsCount={collectionsCount}
        />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === "collections" 
                ? "Buscar por cliente o RUT..."
                : "Buscar clientes..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Customer List */}
        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No se encontraron clientes</p>
              </CardContent>
            </Card>
          ) : (
            filteredCustomers.map((customer) => (
              <div key={customer.id}>
                {activeTab === "collections" ? (
                  <MobileCollectionsCard customer={customer} />
                ) : (
                  <MobileCustomerCard customer={customer} />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <InternalClientRegistrationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onClientCreated={() => {
          console.log('New client created from mobile sales');
        }}
      />
    </div>
  );
}