
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/product";
import { 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  TrendingUp,
  Users,
  ShoppingCart,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import OptimizedImage from "@/components/ui/optimized-image";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AdminProductCardProps {
  product: ProductType;
}

export default function AdminProductCard({ product }: AdminProductCardProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  
  // Generate stable KPIs based on product ID (won't change on re-renders)
  const generateStableKPIs = (productId: string) => {
    const seed = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };
    
    return {
      views: seededRandom(100, 1000),
      addedToQuotes: seededRandom(5, 50),
      conversionRate: (seededRandom(50, 200) / 10).toFixed(1),
    };
  };

  const mockKPIs = generateStableKPIs(product.id);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    toast.success(`Producto ${!isVisible ? 'mostrado' : 'ocultado'} correctamente`);
  };

  const handleEdit = () => {
    navigate(`/main/admin/products/${product.id}`);
  };

  const handleDelete = () => {
    toast.error(`¿Eliminar ${product.name}?`, {
      description: "Esta acción no se puede deshacer",
    });
  };

  const getStockStatus = () => {
    if (product.stock <= 0) return { label: "Sin stock", color: "destructive" };
    if (product.stock <= 5) return { label: "Stock bajo", color: "outline" };
    return { label: "En stock", color: "secondary" };
  };

  const stockStatus = getStockStatus();
  const isOnSale = product.discount > 0;

  return (
    <Card className={`overflow-hidden transition-all ${!isVisible ? "opacity-60" : ""}`}>
      <div className="relative aspect-video">
        <OptimizedImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          aspectRatio="video"
        />
        
        {/* Visibility Toggle */}
        <div className="absolute top-2 left-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={handleToggleVisibility}
          >
            {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </div>

        {/* Action Menu */}
        <div className="absolute top-2 right-2">
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
              <DropdownMenuItem onClick={handleToggleVisibility}>
                {isVisible ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {isVisible ? "Ocultar" : "Mostrar"}
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

        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
          <Badge variant={stockStatus.color as any} className="text-xs">
            {stockStatus.label}
          </Badge>
          {product.isPopular && (
            <Badge variant="default" className="text-xs flex items-center gap-1">
              <Star className="h-3 w-3" />
              Popular
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
              Nuevo
            </Badge>
          )}
          {isOnSale && (
            <Badge variant="destructive" className="text-xs bg-red-500 text-white">
              🔥 -{product.discount}%
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{product.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">${product.price.toLocaleString()}</p>
              {isOnSale && (
                <p className="text-sm text-muted-foreground line-through">
                  ${Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* KPIs Mini */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3" />
              Vistas
            </div>
            <div className="text-sm font-medium">{mockKPIs.views}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <ShoppingCart className="h-3 w-3" />
              Cotizaciones
            </div>
            <div className="text-sm font-medium">{mockKPIs.addedToQuotes}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Users className="h-3 w-3" />
              Conv.
            </div>
            <div className="text-sm font-medium">{mockKPIs.conversionRate}%</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Stock: {product.stock}
          {isOnSale && <span className="ml-2 text-red-500 font-medium">🔥 Liquidación</span>}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8"
          onClick={handleEdit}
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
}
