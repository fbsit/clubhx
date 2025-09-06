import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fetchProducts } from "@/services/productsApi";
import { ProductType } from "@/types/product";
import { isDiscountActive } from "@/utils/promotionUtils";

export interface ProductRecommendationsIOSProps {
  excludeProductId: string;
  category?: string;
  limit?: number;
}

const ProductRecommendationsIOS = ({ 
  excludeProductId, 
  category, 
  limit = 3 
}: ProductRecommendationsIOSProps) => {
  // Get related products
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(50);
        if (!cancelled) setAllProducts(data);
      } catch {
        if (!cancelled) setAllProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, [excludeProductId, category, limit]);

  const relatedProducts = React.useMemo(() => {
    let filtered = allProducts.filter(p => p.id !== excludeProductId);
    
    if (category) {
      const sameCategory = filtered.filter(p => p.category === category);
      const otherProducts = filtered.filter(p => p.category !== category);
      filtered = [...sameCategory, ...otherProducts];
    }
    
    return filtered.slice(0, limit);
  }, [excludeProductId, category, limit, allProducts]);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Productos relacionados</div>
        <Link 
          to="/main/products"
          className="text-base text-primary font-medium"
        >
          Ver todos
        </Link>
      </div>
      
      <div className="space-y-4">
        {relatedProducts.map(product => (
          <Link
            key={product.id}
            to={`/main/products/${product.id}`}
            className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="text-base font-medium truncate">
                  {product.name}
                </div>
                
                <div className="flex items-center gap-2">
                  {isDiscountActive(product) ? (
                    <>
                      <div className="text-base font-bold text-destructive">
                        ${Math.floor(product.price * (1 - product.discount / 100)).toLocaleString('es-CL')}
                      </div>
                      <div className="text-base line-through text-muted-foreground">
                        ${product.price.toLocaleString('es-CL')}
                      </div>
                    </>
                  ) : (
                    <div className="text-base font-bold">
                      ${product.price.toLocaleString('es-CL')}
                    </div>
                  )}
                </div>
                
                <div className="text-base text-muted-foreground">
                  {product.stock > 0 ? 'Disponible' : 'Sin stock'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendationsIOS;