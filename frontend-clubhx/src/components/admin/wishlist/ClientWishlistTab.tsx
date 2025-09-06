import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Heart, ShoppingCart, Eye, Calendar, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ProductPriceDisplay from "@/components/products/ProductPriceDisplay";

// Mock data for a client's wishlist
const mockClientWishlist = [
  {
    id: "w1",
    product: {
      id: "P001",
      name: "IGORA Royal Hair Color - Rubio Ceniza 9-1",
      brand: "IGORA",
      category: "Color",
      price: 12500,
      discount: 0,
      stock: 45,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
    },
    dateAdded: "2024-01-15T10:30:00Z",
    notes: "Para cliente VIP - María González"
  },
  {
    id: "w2", 
    product: {
      id: "P002",
      name: "BLONDME Bond Enforcing Premium Lightener",
      brand: "BLONDME",
      category: "Texturizing",
      price: 18900,
      discount: 10,
      stock: 12,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
    },
    dateAdded: "2024-01-10T14:20:00Z",
    notes: "Urgente - cliente pregunta por disponibilidad"
  },
  {
    id: "w3",
    product: {
      id: "P003", 
      name: "BC Bonacure Repair Rescue Treatment Mask",
      brand: "Bonacure",
      category: "Care",
      price: 15200,
      discount: 0,
      stock: 0,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
    },
    dateAdded: "2024-01-05T09:15:00Z",
    notes: "Cliente esperando restock"
  }
];

interface ClientWishlistTabProps {
  clientId: string;
  clientName: string;
}

export default function ClientWishlistTab({ clientId, clientName }: ClientWishlistTabProps) {
  const [wishlistItems] = useState(mockClientWishlist);

  const wishlistStats = useMemo(() => {
    const totalItems = wishlistItems.length;
    const totalValue = wishlistItems.reduce((sum, item) => {
      const finalPrice = item.product.price * (1 - (item.product.discount || 0) / 100);
      return sum + finalPrice;
    }, 0);
    const outOfStockItems = wishlistItems.filter(item => item.product.stock === 0).length;
    const lowStockItems = wishlistItems.filter(item => item.product.stock > 0 && item.product.stock <= 10).length;

    return { totalItems, totalValue, outOfStockItems, lowStockItems };
  }, [wishlistItems]);

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sin productos en lista de deseos</h3>
          <p className="text-muted-foreground">
            {clientName} no tiene productos guardados en su lista de deseos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{wishlistStats.totalItems}</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${Math.round(wishlistStats.totalValue).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{wishlistStats.lowStockItems}</p>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{wishlistStats.outOfStockItems}</p>
                <p className="text-sm text-muted-foreground">Sin Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wishlist Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Deseos de {clientName}</span>
            <Button size="sm">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Crear Cotización
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wishlistItems.map((item) => {
              const isOutOfStock = item.product.stock === 0;
              const isLowStock = item.product.stock > 0 && item.product.stock <= 10;
              const timeAgo = formatDistanceToNow(new Date(item.dateAdded), {
                addSuffix: true,
                locale: es
              });

              return (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  {/* Product Image */}
                  <div className="w-16 h-16 flex-shrink-0">
                    <OptimizedImage
                      src={item.product.image}
                      alt={item.product.name}
                      fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
                      aspectRatio="square"
                      objectFit="cover"
                      containerClassName="w-full h-full rounded-lg overflow-hidden bg-gray-100"
                      className="md:hover:scale-105 transition-transform duration-200"
                      showSkeleton={true}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2">{item.product.name}</h3>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{item.product.brand}</Badge>
                          <Badge variant="outline" className="text-xs">{item.product.category}</Badge>
                        </div>

                        <div className="mt-2">
                          <ProductPriceDisplay 
                            price={item.product.price}
                            discount={item.product.discount}
                            size="small"
                          />
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Agregado {timeAgo}
                          </div>
                        </div>

                        {item.notes && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                            <strong>Nota:</strong> {item.notes}
                          </div>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="ml-4 text-right">
                        {isOutOfStock ? (
                          <Badge variant="destructive" className="text-xs">Sin stock</Badge>
                        ) : isLowStock ? (
                          <Badge variant="outline" className="text-xs border-amber-500 text-amber-700">
                            {item.product.stock} restantes
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            {item.product.stock} disponibles
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 px-3">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-7 px-3"
                        disabled={isOutOfStock}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Cotizar
                      </Button>
                      {isOutOfStock && (
                        <Button variant="outline" size="sm" className="h-7 px-3 text-blue-600 border-blue-200">
                          Notificar Stock
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}