
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  email: string;
  region: string;
  customers: number;
  totalSales: number;
  salesTarget: number;
  targetCompletion: number;
  status: string;
  avatar: string;
}

interface VendorTableProps {
  vendors: Vendor[];
  onVendorClick: (vendorId: string) => void;
  onSetGoal?: (vendor: Vendor) => void;
}

export default function VendorTable({ vendors, onVendorClick, onSetGoal }: VendorTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendedor</TableHead>
            <TableHead>Región</TableHead>
            <TableHead>Clientes</TableHead>
            <TableHead>Ventas</TableHead>
            <TableHead>Meta</TableHead>
            <TableHead>% Completado</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id} className="hover:bg-muted/50">
              <TableCell>
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onVendorClick(vendor.id)}
                >
                  <Avatar>
                    <AvatarImage src={vendor.avatar} alt={vendor.name} />
                    <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{vendor.region}</TableCell>
              <TableCell>{vendor.customers}</TableCell>
              <TableCell>{formatCurrency(vendor.totalSales)}</TableCell>
              <TableCell>{formatCurrency(vendor.salesTarget)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${vendor.targetCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{vendor.targetCompletion}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={vendor.status === "active" ? "bg-green-500" : "bg-amber-500"}>
                  {vendor.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                {onSetGoal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetGoal(vendor);
                    }}
                  >
                    <Target className="h-4 w-4 mr-1" />
                    Meta
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
