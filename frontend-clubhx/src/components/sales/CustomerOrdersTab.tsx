
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart } from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: number;
}

interface CustomerOrdersTabProps {
  orders: Order[];
  customerName: string;
}

export const CustomerOrdersTab: React.FC<CustomerOrdersTabProps> = ({
  orders,
  customerName,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "pending": return "bg-amber-500";
      case "canceled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Pedidos</CardTitle>
        <CardDescription>
          Últimos pedidos realizados por {customerName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido #</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{formatDate(order.date)}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(order.status)}>
                      {order.status === "completed" && "Completado"}
                      {order.status === "shipped" && "Enviado"}
                      {order.status === "pending" && "Pendiente"}
                      {order.status === "canceled" && "Cancelado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Ver Todos los Pedidos
        </Button>
        <Button size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Crear Nueva Cotización
        </Button>
      </CardFooter>
    </Card>
  );
};
