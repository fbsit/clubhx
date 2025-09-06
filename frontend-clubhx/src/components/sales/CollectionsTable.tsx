import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight, FileText, AlertTriangle } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { EnhancedSalesCustomer } from "@/data/enhancedSalesCustomers";
import { Link } from "react-router-dom";

interface CollectionsTableProps {
  customers: EnhancedSalesCustomer[];
}

export function CollectionsTable({ customers }: CollectionsTableProps) {
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

  const getUrgencyIndicator = (status: string, daysOverdue: number) => {
    if (status === "critical" || daysOverdue > 30) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (status === "overdue" || daysOverdue > 0) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    return null;
  };

  // Filter only customers with debt and sort by urgency
  const debtCustomers = customers
    .filter(customer => customer.collections && customer.collections.pendingAmount > 0)
    .sort((a, b) => {
      // Priority 1: Critical status first
      if (a.collections?.paymentStatus === "critical" && b.collections?.paymentStatus !== "critical") return -1;
      if (a.collections?.paymentStatus !== "critical" && b.collections?.paymentStatus === "critical") return 1;
      
      // Priority 2: Days overdue (highest first)
      const aDays = a.collections?.daysOverdue || 0;
      const bDays = b.collections?.daysOverdue || 0;
      if (aDays !== bDays) return bDays - aDays;
      
      // Priority 3: Pending amount (highest first)
      const aAmount = a.collections?.pendingAmount || 0;
      const bAmount = b.collections?.pendingAmount || 0;
      return bAmount - aAmount;
    });

  if (debtCustomers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-green-600 mb-4">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">¡Excelente trabajo!</h3>
        <p className="text-muted-foreground">No hay clientes con deudas pendientes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Monto Pendiente</TableHead>
            <TableHead>Días Vencido</TableHead>
            <TableHead>Documentos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtCustomers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/30">
              <TableCell>
                {getUrgencyIndicator(customer.collections?.paymentStatus || "", customer.collections?.daysOverdue || 0)}
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
                    Último pago: {formatDate(customer.collections?.lastPaymentDate || "")}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    (customer.collections?.daysOverdue || 0) > 30 ? "text-red-600" :
                    (customer.collections?.daysOverdue || 0) > 0 ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {formatCurrency(customer.collections?.pendingAmount || 0)}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-center">
                  <p className={`font-medium ${
                    (customer.collections?.daysOverdue || 0) > 30 ? "text-red-600" :
                    (customer.collections?.daysOverdue || 0) > 0 ? "text-yellow-600" :
                    "text-green-600"
                  }`}>
                    {customer.collections?.daysOverdue || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">días</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {customer.collections?.pendingInvoices || 0} facturas
                  </p>
                  {customer.collections?.overdueDocuments && customer.collections.overdueDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {customer.collections.overdueDocuments.slice(0, 2).map((doc, index) => (
                        <span key={index} className="text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                          {doc}
                        </span>
                      ))}
                      {customer.collections.overdueDocuments.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{customer.collections.overdueDocuments.length - 2} más
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={customer.collections?.paymentStatus || "current"} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="sm">
                  <Link to={`/main/sales/customers/${customer.id}`}>
                    Gestionar
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