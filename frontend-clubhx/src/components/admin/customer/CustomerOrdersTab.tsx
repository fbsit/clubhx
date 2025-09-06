
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerOrdersTabProps {
  customerData: any;
}

export const CustomerOrdersTab: React.FC<CustomerOrdersTabProps> = ({
  customerData,
}) => {
  const isMobile = useIsMobile();

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
          Últimos pedidos realizados por {customerData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? (
          <div className="space-y-4">
            {customerData.orders.map((order: any) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{order.id}</span>
                  <Badge className={getStatusBadgeClass(order.status)}>
                    {order.status === "completed" && "Completado"}
                    {order.status === "shipped" && "Enviado"}
                    {order.status === "pending" && "Pendiente"}
                    {order.status === "canceled" && "Cancelado"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="ml-1">{formatDate(order.date)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Items:</span>
                    <span className="ml-1">{order.items}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                  <Button variant="ghost" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
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
                {customerData.orders.map((order: any) => (
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
        )}
      </CardContent>
    </Card>
  );
};
