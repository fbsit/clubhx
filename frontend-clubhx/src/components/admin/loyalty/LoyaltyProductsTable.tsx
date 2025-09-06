
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Star, Trash2 } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface LoyaltyProductsTableProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export const LoyaltyProductsTable: React.FC<LoyaltyProductsTableProps> = ({
  products,
  onEdit,
  onDelete
}) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Puntos</TableHead>
            <TableHead>Disponibles</TableHead>
            <TableHead>Destacado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md overflow-hidden">
                    <OptimizedImage 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full"
                      aspectRatio="square"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {product.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category === "product" && "Producto"}
                  {product.category === "discount" && "Descuento"}
                  {product.category === "event" && "Evento"}
                  {product.category === "training" && "Capacitación"}
                </Badge>
              </TableCell>
              <TableCell>{product.pointsCost.toLocaleString()}</TableCell>
              <TableCell>
                {product.available !== null ? product.available : "Ilimitado"}
              </TableCell>
              <TableCell>
                {product.featured ? 
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : 
                  <Star className="h-4 w-4 text-gray-300" />}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LoyaltyProductsTable;
