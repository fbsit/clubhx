import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "@/services/productsApi";
import { ProductType } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Eye, BarChart3, TrendingUp, DollarSign, Star, Users } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AdminProductPreview() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Generate stable KPIs based on product ID
  const generateStableKPIs = (productId: string) => {
    const seed = productId?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };
    
    return {
      views: seededRandom(100, 1000),
      addedToQuotes: seededRandom(5, 50),
      conversionRate: (seededRandom(50, 200) / 10).toFixed(1),
      revenue: seededRandom(50000, 500000),
      avgRating: (seededRandom(35, 50) / 10).toFixed(1),
      uniqueVisitors: seededRandom(80, 800),
      repeatPurchases: seededRandom(10, 40),
    };
  };

  useEffect(() => {
    if (!productId) {
      navigate("/main/products");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const p = await fetchProductById(productId);
        if (!cancelled) setProduct(p);
      } catch {
        if (!cancelled) navigate("/main/products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [productId, navigate]);

  const handleBack = () => {
    navigate("/main/products");
  };

  const handleEdit = () => {
    navigate(`/main/admin/products/${productId}`);
  };

  const handleViewCustomerView = () => {
    navigate(`/main/products/${productId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CL').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const kpis = generateStableKPIs(product.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleBack} className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Vista Admin - Producto</h1>
              <p className="text-xs text-muted-foreground">ID: {productId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleViewCustomerView}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6 space-y-4">
        
        {/* Product Overview */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  aspectRatio="square"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
                  {product.isPopular && <Badge className="text-xs">Popular</Badge>}
                  {product.isNew && <Badge variant="outline" className="text-xs">Nuevo</Badge>}
                </div>
                <h2 className="font-bold text-lg leading-tight mb-1">{product.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.discount > 0 && (
                    <Badge variant="destructive" className="text-xs">-{product.discount}%</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Stock: {product.stock} unidades</p>
              </div>
            </div>
            {product.description && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {product.description}
              </p>
            )}
          </CardContent>
        </Card>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Visualizaciones</p>
                  <p className="text-lg font-bold">{formatNumber(kpis.views)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Agregado a Cotiz.</p>
                  <p className="text-lg font-bold">{kpis.addedToQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="text-lg font-bold">{formatPrice(kpis.revenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating Promedio</p>
                  <p className="text-lg font-bold">{kpis.avgRating}/5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Métricas Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tasa de Conversión</span>
              <span className="font-medium">{kpis.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Visitantes Únicos</span>
              <span className="font-medium">{formatNumber(kpis.uniqueVisitors)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Compras Repetidas</span>
              <span className="font-medium">{kpis.repeatPurchases}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Puntos de Lealtad</span>
              <span className="font-medium">{product.loyaltyPoints || 0} pts</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button onClick={handleEdit} className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Editar Producto
          </Button>
          <Button variant="outline" onClick={handleViewCustomerView} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Ver Como Cliente
          </Button>
        </div>
      </div>
    </div>
  );
}