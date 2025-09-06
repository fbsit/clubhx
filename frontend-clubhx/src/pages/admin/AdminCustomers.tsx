
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { CustomerSearch } from "@/components/admin/customers/CustomerSearch";
import { CustomerTable } from "@/components/admin/customers/CustomerTable";
import { CustomerMobileCards } from "@/components/admin/customers/CustomerMobileCards";
import { useClients } from "@/hooks/useClients";
import InternalClientRegistrationDialog from "@/components/admin/InternalClientRegistrationDialog";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { clients, loading, error, refresh } = useClients({ limit: 50, offset: 0 });
  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(c =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.contact || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.city || "").toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);
  const [expandedCustomers, setExpandedCustomers] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSearch = () => {};

  const toggleExpand = (customerId: string) => {
    setExpandedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId) 
        : [...prev, customerId]
    );
  };

  const handleCustomerClick = (customerId: string) => {
    navigate(`/main/admin/customers/${customerId}`);
  };

  const handleViewDetails = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/main/admin/customers/${customerId}`);
  };

  const handleClientCreated = () => { refresh(); };

  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>
            Administre los clientes y vea información detallada sobre sus compras y actividades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <CustomerSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
            />
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Cargando clientes...</div>
            ) : error ? (
              <div className="py-8 text-center">
                <div className="text-destructive mb-2">{error}</div>
                <Button variant="outline" onClick={refresh}>Reintentar</Button>
              </div>
            ) : (
              !isMobile ? (
                <CustomerTable
                  customers={filteredCustomers}
                  onCustomerClick={handleCustomerClick}
                />
              ) : (
                <CustomerMobileCards
                  customers={filteredCustomers}
                  expandedCustomers={expandedCustomers}
                  onToggleExpand={toggleExpand}
                  onViewDetails={handleViewDetails}
                />
              )
            )}
          </div>
        </CardContent>
      </Card>

      <InternalClientRegistrationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
