import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { ClientPotentialBadge } from "./ClientPotentialBadge";
import { EnhancedSalesCustomer } from "@/data/enhancedSalesCustomers";
import { Link } from "react-router-dom";

interface AdvancedSalesClientTableProps {
  customers: EnhancedSalesCustomer[];
}

export function AdvancedSalesClientTable({ customers }: AdvancedSalesClientTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getUrgencyIndicator = (daysWithoutPurchase: number, daysWithoutVisit: number) => {
    if (daysWithoutPurchase > 60 || daysWithoutVisit > 30) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (daysWithoutPurchase > 30 || daysWithoutVisit > 15) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (variation < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  // Sort customers by priority: urgent first, then by potential, then by total spent
  const sortedCustomers = [...customers].sort((a, b) => {
    // Priority 1: Urgent cases (many days without purchase/visit)
    const aUrgent = a.daysWithoutPurchase > 60 || a.daysWithoutVisit > 30;
    const bUrgent = b.daysWithoutPurchase > 60 || b.daysWithoutVisit > 30;
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    
    // Priority 2: High potential clients
    const potentialOrder = { "Alto": 3, "Medio": 2, "Bajo": 1 };
    const potentialDiff = potentialOrder[b.potential] - potentialOrder[a.potential];
    if (potentialDiff !== 0) return potentialDiff;
    
    // Priority 3: Total spent
    return b.totalSpent - a.totalSpent;
  });

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Potencial</TableHead>
            <TableHead>Días sin Comprar</TableHead>
            <TableHead>Prom. 6M</TableHead>
            <TableHead>Var. Anual</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCustomers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/30">
              <TableCell>
                {getUrgencyIndicator(customer.daysWithoutPurchase, customer.daysWithoutVisit)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.city}</p>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">{customer.rut}</span>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Último contacto: {formatDate(customer.lastContact)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <ClientPotentialBadge potential={customer.potential} />
              </TableCell>
              <TableCell>
                <div className="text-center">
                  <p className={`font-medium ${
                    customer.daysWithoutPurchase > 60 ? "text-red-600" :
                    customer.daysWithoutPurchase > 30 ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {customer.daysWithoutPurchase || "-"}
                  </p>
                  <p className="text-xs text-muted-foreground">días</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(customer.sixMonthAverage)}</p>
                  <p className="text-xs text-muted-foreground">promedio</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getVariationIcon(customer.yearlyVariation)}
                  <span className={`text-sm font-medium ${
                    customer.yearlyVariation > 0 ? "text-green-600" :
                    customer.yearlyVariation < 0 ? "text-red-600" :
                    "text-muted-foreground"
                  }`}>
                    {customer.yearlyVariation > 0 ? "+" : ""}{customer.yearlyVariation}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={
                  customer.status === "active" ? "bg-green-500" : 
                  customer.status === "inactive" ? "bg-red-500" : "bg-blue-500"
                }>
                  {customer.status === "active" ? "Activo" : 
                   customer.status === "inactive" ? "Inactivo" : "Prospecto"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/main/sales/customers/${customer.id}`}>
                    Ver Detalles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}