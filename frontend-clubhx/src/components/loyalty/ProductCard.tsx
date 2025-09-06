
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ChevronRight, Package, Gift, Calendar, Clock, BarChart3, Edit, Trash2, MoreHorizontal } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LoyaltyProduct } from "@/utils/loyaltyRewardAdapter";
import { LoyaltyRewardStatus } from "@/services/loyaltyRewardsApi";

interface ProductCardProps { 
  product: LoyaltyProduct;
  userPoints?: number;
  onRedeem?: (product: LoyaltyProduct) => void;
  isMobile?: boolean;
  isAdmin?: boolean;
  // Admin props
  onEdit?: (product: LoyaltyProduct) => void;
  onDelete?: (productId: string) => void;
  onToggleFeatured?: (productId: string) => void;
  onChangeStatus?: (productId: string, status: string) => void;
  onUpdateStock?: (productId: string, stockQuantity: number) => void;
}

export function ProductCard({ 
  product, 
  userPoints = 0, 
  onRedeem, 
  isMobile = false, 
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleFeatured,
  onChangeStatus,
  onUpdateStock
}: ProductCardProps) {
  const iconSize = 20;
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "product": return <Package size={iconSize} />;
      case "discount": return <Gift size={iconSize} className="text-pink-500" />;
      case "event": return <Calendar size={iconSize} className="text-blue-500" />;
      case "training": return <Clock size={iconSize} className="text-yellow-500" />;
      default: return <Package size={iconSize} />;
    }
  };
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case "product": return "Producto Físico";
      case "discount": return "Descuento en Compras";
      case "event": return "Evento";
      case "training": return "Capacitación";
      default: return "Producto";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const statusConfig = {
      [LoyaltyRewardStatus.ACTIVE]: { label: "Activo", className: "bg-green-600" },
      [LoyaltyRewardStatus.INACTIVE]: { label: "Inactivo", className: "bg-gray-600" },
      [LoyaltyRewardStatus.OUT_OF_STOCK]: { label: "Sin Stock", className: "bg-red-600" },
      [LoyaltyRewardStatus.DISCONTINUED]: { label: "Descontinuado", className: "bg-orange-600" },
    };

    const config = statusConfig[status as LoyaltyRewardStatus];
    if (!config) return null;

    return (
      <Badge className={`absolute top-3 left-3 ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const handleRedeem = () => {
    if (onRedeem) {
      onRedeem(product);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id);
    }
  };

  const handleToggleFeatured = () => {
    if (onToggleFeatured) {
      onToggleFeatured(product.id);
    }
  };

  const handleChangeStatus = (status: string) => {
    if (onChangeStatus) {
      onChangeStatus(product.id, status);
    }
  };

  const handleUpdateStock = (stockQuantity: number) => {
    if (onUpdateStock) {
      onUpdateStock(product.id, stockQuantity);
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[380px] md:min-h-[410px] group">
      <div className="aspect-video relative overflow-hidden bg-gray-50">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        {getStatusBadge(product.status)}
        
        {/* Featured Badge */}
        {product.featured && (
          <Badge 
            className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-600 flex items-center gap-1"
          >
            <Star className="h-4 w-4" /> Destacado
          </Badge>
        )}

        {/* Admin Actions Overlay */}
        {isAdmin && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleFeatured}>
                  <Star className="mr-2 h-4 w-4" /> 
                  {product.featured ? "Quitar destacado" : "Destacar"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleChangeStatus(LoyaltyRewardStatus.ACTIVE)}>
                  Activar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeStatus(LoyaltyRewardStatus.INACTIVE)}>
                  Desactivar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChangeStatus(LoyaltyRewardStatus.OUT_OF_STOCK)}>
                  Sin Stock
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <CardHeader className={`${isMobile ? 'pt-3 px-3 pb-2' : 'pt-4 px-4 pb-2'}`}>
        <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} leading-tight line-clamp-2`}>
          {product.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          {getCategoryIcon(product.category)}
          {getCategoryName(product.category)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'pb-2 px-3' : 'pb-2 px-4'} flex-grow`}>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[40px]">
          {product.description}
        </p>
        
        {/* Stock Information */}
        {product.stockQuantity !== undefined && (
          <div className="mt-2 text-xs text-muted-foreground">
            Stock: {product.stockQuantity} disponibles
            {product.redeemedQuantity !== undefined && product.redeemedQuantity > 0 && (
              <span className="ml-2">• {product.redeemedQuantity} canjeados</span>
            )}
          </div>
        )}
        
        {/* Price Information */}
        {product.originalPrice && (
          <div className="mt-2 text-xs text-muted-foreground">
            Precio original: ${product.originalPrice.toLocaleString()} {product.currency}
          </div>
        )}
        
        {/* Validity Period */}
        {product.validFrom || product.validUntil ? (
          <div className="mt-2 text-xs text-muted-foreground">
            {product.validFrom && `Desde: ${product.validFrom}`}
            {product.validFrom && product.validUntil && " • "}
            {product.validUntil && `Hasta: ${product.validUntil}`}
          </div>
        ) : null}
        
        {/* Legacy fields for backward compatibility */}
        {product.available !== undefined && product.available !== null && (
          <div className="mt-2 text-xs text-muted-foreground">
            {product.available} disponibles
          </div>
        )}
        
        {product.date && (
          <div className="mt-2 text-xs text-muted-foreground">
            Fecha: {product.date}
          </div>
        )}
        
        {product.location && (
          <div className="mt-2 text-xs text-muted-foreground">
            Ubicación: {product.location}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`pt-3 border-t flex flex-col gap-3 ${isMobile ? 'px-3 pb-3' : 'px-4 pb-4'}`}>
        {/* Points display */}
        <div className="w-full text-center">
          <div className="font-bold text-lg">
            {product.pointsCost.toLocaleString()} 
            <span className="text-xs text-muted-foreground ml-1">puntos</span>
          </div>
        </div>
        
        {/* Button */}
        <div className="w-full">
          {isAdmin ? (
            <Button 
              size={isMobile ? "sm" : "default"}
              onClick={handleRedeem}
              className="w-full rounded-full font-medium"
              variant="outline"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver Estadísticas
            </Button>
          ) : (
            <Button 
              disabled={userPoints < product.pointsCost}
              size={isMobile ? "sm" : "default"}
              onClick={handleRedeem}
              className="w-full rounded-full font-medium"
            >
              Canjear
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
