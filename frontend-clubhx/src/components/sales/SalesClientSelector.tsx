import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Search, User, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedSalesCustomer, enhancedSalesCustomers } from "@/data/enhancedSalesCustomers";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";

interface SalesClientSelectorProps {
  onCustomerSelect?: (customer: EnhancedSalesCustomer) => void;
  showDetails?: boolean;
  compact?: boolean;
}

export default function SalesClientSelector({ 
  onCustomerSelect, 
  showDetails = true,
  compact = false 
}: SalesClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const { selectedCustomer, setSelectedCustomer } = useSalesQuotation();

  // En un entorno real, esto vendría de la API filtrado por vendedor
  const availableCustomers = useMemo(() => {
    return enhancedSalesCustomers.filter(customer => 
      customer.status === "active" || customer.status === "prospect"
    );
  }, []);

  const handleSelectCustomer = (customer: EnhancedSalesCustomer) => {
    setSelectedCustomer(customer);
    onCustomerSelect?.(customer);
    setOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      prospect: "secondary",
      inactive: "outline"
    } as const;

    const labels = {
      active: "Activo",
      prospect: "Prospecto", 
      inactive: "Inactivo"
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPaymentStatusIcon = (customer: EnhancedSalesCustomer) => {
    const paymentStatus = customer.collections?.paymentStatus;
    
    if (paymentStatus === "critical") {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (paymentStatus === "overdue") {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return <CreditCard className="h-4 w-4 text-green-500" />;
  };

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-w-[280px] h-auto p-3"
          >
            {selectedCustomer ? (
              <div className="flex items-center gap-3 text-left flex-1">
                <div className="flex-1">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.contact}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedCustomer.status)}
                  {getPaymentStatusIcon(selectedCustomer)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Buscar y seleccionar cliente...</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 z-50 bg-background border shadow-lg">
          <Command>
            <CommandInput placeholder="Buscar cliente por nombre o empresa..." />
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandList className="max-h-[300px]">
              <CommandGroup>
                {availableCustomers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.name} ${customer.contact} ${customer.email}`}
                    onSelect={() => handleSelectCustomer(customer)}
                    className="p-3"
                  >
                    <Check
                      className={`mr-3 h-4 w-4 ${
                        selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(customer.status)}
                          {getPaymentStatusIcon(customer)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{customer.contact}</span>
                        <span>•</span>
                        <span>{customer.city}</span>
                        <span>•</span>
                        <span>${customer.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Seleccionar Cliente</h3>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto p-3"
          >
            {selectedCustomer ? (
              <div className="flex items-center gap-3 text-left">
                <div className="flex-1">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.contact}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedCustomer.status)}
                  {getPaymentStatusIcon(selectedCustomer)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Buscar y seleccionar cliente...</span>
              </div>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar cliente por nombre o empresa..." />
            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
            <CommandList className="max-h-[300px]">
              <CommandGroup>
                {availableCustomers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={`${customer.name} ${customer.contact} ${customer.email}`}
                    onSelect={() => handleSelectCustomer(customer)}
                    className="p-3"
                  >
                    <Check
                      className={`mr-3 h-4 w-4 ${
                        selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{customer.name}</p>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(customer.status)}
                          {getPaymentStatusIcon(customer)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{customer.contact}</span>
                        <span>•</span>
                        <span>{customer.city}</span>
                        <span>•</span>
                        <span>${customer.totalSpent.toLocaleString()}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCustomer && showDetails && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Gastado</p>
                <p className="font-semibold">${selectedCustomer.totalSpent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pedidos</p>
                <p className="font-semibold">{selectedCustomer.totalOrders}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Puntos</p>
                <p className="font-semibold">{selectedCustomer.loyaltyPoints.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Último Pedido</p>
                <p className="font-semibold">
                  {selectedCustomer.lastOrder ? 
                    new Date(selectedCustomer.lastOrder).toLocaleDateString() : 
                    "Sin pedidos"
                  }
                </p>
              </div>
            </div>

            {selectedCustomer.collections?.paymentStatus !== "current" && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Atención: Cliente con pagos pendientes
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  ${selectedCustomer.collections?.pendingAmount?.toLocaleString()} pendientes - 
                  {selectedCustomer.collections?.daysOverdue} días de atraso
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}