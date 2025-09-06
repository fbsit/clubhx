
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star, Edit, Trash2, Calendar, Package, Gift, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import OptimizedImage from "@/components/ui/optimized-image";

interface AdminProductCardProps {
  product: any;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
}

export default function AdminProductCard({ product, onEdit, onDelete }: AdminProductCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "product": return <Package className="h-2 w-2" />;
      case "discount": return <Gift className="h-2 w-2" />;
      case "event": return <Calendar className="h-2 w-2" />;
      case "training": return <Clock className="h-2 w-2" />;
      default: return <Package className="h-2 w-2" />;
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "product": return "Producto";
      case "discount": return "Descuento";
      case "event": return "Evento";
      case "training": return "Capacitación";
      default: return category;
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full w-full max-w-full">
      <div className="relative aspect-video">
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          aspectRatio="video"
        />
        <div className="absolute top-0.5 left-0.5 flex gap-0.5 items-center">
          <Badge variant={product.featured ? "default" : "outline"} className="flex items-center gap-0.5 h-3 text-[8px] sm:text-[10px] px-0.5 py-0">
            <Star className={`h-1.5 w-1.5 ${product.featured ? "fill-white" : ""}`} />
            <span className="hidden sm:inline text-[8px]">{product.featured ? "Destacado" : "Regular"}</span>
          </Badge>
        </div>
        <div className="absolute top-0.5 right-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-4 w-4 bg-background/80 backdrop-blur-sm">
                <MoreHorizontal className="h-2 w-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit({...product, featured: !product.featured})}
              >
                <Star className="mr-2 h-4 w-4" /> 
                {product.featured ? "Quitar destacado" : "Destacar"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500 focus:text-red-500"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="p-1 sm:p-2 md:p-4 flex-grow flex flex-col min-w-0">
        <div className="flex items-start justify-between mb-0.5">
          <Badge variant="outline" className="flex items-center gap-0.5 shrink-0 text-[8px] sm:text-[10px] px-0.5 py-0 h-3">
            {getCategoryIcon(product.category)}
            <span className="hidden sm:inline text-[8px] truncate">{getCategoryLabel(product.category)}</span>
          </Badge>
        </div>
        
        <h3 className="font-semibold text-[10px] sm:text-xs md:text-base line-clamp-2 mb-0.5 leading-tight">{product.name}</h3>
        
        {/* Puntos - más compactos */}
        <div className="flex items-baseline justify-start mb-0.5">
          <span className="font-bold text-xs sm:text-sm md:text-lg text-primary">{product.pointsCost.toLocaleString()}</span>
          <span className="text-[8px] sm:text-xs text-muted-foreground ml-0.5">pts</span>
        </div>
        
        <p className="text-muted-foreground text-[8px] sm:text-[10px] line-clamp-2 mb-0.5 flex-grow">
          {product.description}
        </p>
        
        <div className="space-y-0.5 mt-auto">
          {product.date && (
            <div className="flex items-center text-[8px] sm:text-[10px] text-muted-foreground">
              <Calendar className="h-2 w-2 mr-0.5 shrink-0" />
              <span className="truncate">{product.date}</span>
            </div>
          )}
          
          {product.location && (
            <div className="flex items-center text-[8px] sm:text-[10px] text-muted-foreground">
              <svg className="h-2 w-2 mr-0.5 shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0C5.01472 0 3 2.01472 3 4.5C3 8.00217 7.5 13 7.5 13C7.5 13 12 8.00217 12 4.5C12 2.01472 9.98528 0 7.5 0ZM7.5 6C6.67157 6 6 5.32843 6 4.5C6 3.67157 6.67157 3 7.5 3C8.32843 3 9 3.67157 9 4.5C9 5.32843 8.32843 6 7.5 6Z" fill="currentColor"/>
              </svg>
              <span className="truncate">{product.location}</span>
            </div>
          )}
          
          {product.available !== null && (
            <div className="text-[8px] sm:text-[10px]">
              <span className={product.available > 5 ? "text-green-600" : "text-amber-600"}>
                {product.available} disponibles
              </span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-1 sm:p-2 md:p-4 pt-1 border-t flex items-center justify-between min-w-0">
        <div className="text-[8px] sm:text-[10px] text-muted-foreground truncate mr-1 flex-shrink min-w-0">
          ID: {product.id}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-4 sm:h-5 md:h-8 text-[8px] sm:text-[10px] shrink-0 px-1 sm:px-1.5"
          onClick={() => onEdit(product)}
        >
          <Edit className="h-2 w-2 mr-0.5" />
          <span className="hidden sm:inline">Editar</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
