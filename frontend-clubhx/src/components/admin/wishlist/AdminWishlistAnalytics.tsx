import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  Target,
  AlertTriangle,
  ShoppingCart,
  BarChart3
} from "lucide-react";
import { getWishlistAnalytics, WishlistAnalytics } from "@/services/wishlistAnalyticsApi";

export default function AdminWishlistAnalytics() {
  const [data, setData] = useState<WishlistAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getWishlistAnalytics();
        if (!cancelled) setData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const {
    totalWishlistItems = 0,
    totalActiveWishlists = 0,
    conversionRate = 0,
    topProducts = [],
    lowStockHighDemand = [],
    clientsWithLargeWishlists = [],
    categoryInsights = [],
    monthlyTrends = { growth: 0 },
  } = data || {} as any;

  const growth = (monthlyTrends as any)?.growth ?? 0;
  const growthDirection = growth >= 0 ? 'up' : 'down';
  const GrowthIcon = growthDirection === 'up' ? TrendingUp : TrendingDown;

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Cargando…</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Analytics de Lista de Deseos
        </h1>
        <p className="text-muted-foreground mt-1">
          Insights sobre los productos más deseados y comportamiento de los clientes
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items en Wishlists</p>
                <p className="text-2xl font-bold">{totalWishlistItems.toLocaleString()}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <GrowthIcon className={`h-4 w-4 mr-1 ${growthDirection === 'up' ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ${growthDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}% vs mes anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                <p className="text-2xl font-bold">{totalActiveWishlists}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Con items en lista de deseos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasa de Conversión</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={conversionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productos Críticos</p>
                <p className="text-2xl font-bold">{lowStockHighDemand.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Baja disponibilidad, alta demanda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products in Wishlists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Productos Más Deseados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.wishlistCount} en listas • {product.conversionRate}% conversión
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock > 10 ? "secondary" : product.stock > 0 ? "outline" : "destructive"}>
                      {product.stock > 0 ? `${product.stock} stock` : "Sin stock"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock High Demand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Productos Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockHighDemand.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border border-amber-200 bg-amber-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.wishlistCount} clientes interesados
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock === 0 ? "destructive" : "outline"}>
                      {product.stock === 0 ? "Agotado" : `${product.stock} restantes`}
                    </Badge>
                    <p className="text-xs text-amber-700 mt-1">
                      Alta demanda
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Insights por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryInsights.map((category) => (
              <div key={category.category} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{category.category}</h3>
                  <Badge variant="outline">{category.totalItems} items</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversión:</span>
                    <span className="font-medium">{category.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor promedio:</span>
                    <span className="font-medium">${category.avgValue.toLocaleString()}</span>
                  </div>
                  <Progress value={category.conversionRate} className="h-2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Value Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes con Mayores Listas de Deseos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientsWithLargeWishlists.map((client) => (
              <div key={client.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">{client.contact}</p>
                  </div>
                  <Badge variant="secondary">{client.itemCount} productos</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor total:</span>
                    <span className="font-medium">${client.totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potencial:</span>
                    <span className="font-medium text-green-600">${client.potentialRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vendedor:</span>
                    <span className="text-xs">{client.vendorAssigned}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Potencial de conversión</div>
                  <Progress value={(client.itemCount / 35) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}