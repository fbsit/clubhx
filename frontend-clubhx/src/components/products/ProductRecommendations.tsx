
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts } from "@/services/productsApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { useQuotation } from "@/contexts/QuotationContext";
import { toast } from "sonner";

interface ProductRecommendationsProps {
  excludeProductId?: string;
  limit?: number;
  title?: string;
}

export default function ProductRecommendations({ 
  excludeProductId, 
  limit = 4, 
  title = "Productos Recomendados" 
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useQuotation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(50);
        if (!cancelled) {
          let filtered = data.filter((p: any) => p.id !== excludeProductId);
          // Sort by popularity and take top recommendations
          filtered = filtered
            .sort((a: any, b: any) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
            .slice(0, limit);
          setProducts(filtered);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [excludeProductId, limit]);

  const handleAddToQuotation = (product: any) => {
    addItem(product, 1);
    toast.success(`${product.name} agregado a la cotización`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-1"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {product.isPopular && (
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {product.isNew && (
                  <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                    Nuevo
                  </Badge>
                )}
              </div>
              <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  ${product.price.toLocaleString('es-CL')}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToQuotation(product);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
