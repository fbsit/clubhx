
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  lastOrder: string;
  loyaltyPoints: number;
}

interface CustomerTableProps {
  customers: Customer[];
  onCustomerClick: (customerId: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  onCustomerClick,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Órdenes</TableHead>
            <TableHead>Total Compras</TableHead>
            <TableHead>Última Compra</TableHead>
            <TableHead>Puntos</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow 
              key={customer.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onCustomerClick(customer.id)}
            >
              <TableCell>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.contact}</p>
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                </div>
              </TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>{formatCurrency(customer.totalSpent)}</TableCell>
              <TableCell>{formatDate(customer.lastOrder)}</TableCell>
              <TableCell>{customer.loyaltyPoints}</TableCell>
              <TableCell>
                <Badge className={
                  customer.status === "active" ? "bg-green-500" : 
                  customer.status === "inactive" ? "bg-amber-500" : "bg-purple-500"
                }>
                  {customer.status === "active" ? "Activo" : 
                  customer.status === "inactive" ? "Inactivo" : "Pendiente"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
