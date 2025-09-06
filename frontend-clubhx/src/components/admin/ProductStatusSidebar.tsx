
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, BarChart3 } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  image: string;
  isPopular: boolean;
  isNew: boolean;
  isVisible: boolean;
  discount: number;
  isOnSale: boolean;
}

interface MockKPIs {
  views: number;
  addedToQuotes: number;
  conversionRate: string;
  revenue: number;
  avgRating: string;
}

interface ProductStatusSidebarProps {
  formData: ProductFormData;
  mockKPIs: MockKPIs;
  onPreview: () => void;
  onNavigateToAnalytics: () => void;
}

export default function ProductStatusSidebar({
  formData,
  mockKPIs,
  onPreview,
  onNavigateToAnalytics
}: ProductStatusSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Product Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del producto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Visibilidad</span>
            <Badge variant={formData.isVisible ? "default" : "secondary"}>
              {formData.isVisible ? "Visible" : "Oculto"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Stock</span>
            <Badge variant={formData.stock > 5 ? "default" : formData.stock > 0 ? "outline" : "destructive"}>
              {formData.stock > 5 ? "En stock" : formData.stock > 0 ? "Stock bajo" : "Sin stock"}
            </Badge>
          </div>
          {formData.isPopular && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Popular</span>
              <Badge variant="default">✨ Popular</Badge>
            </div>
          )}
          {formData.isNew && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Nuevo</span>
              <Badge variant="outline">🆕 Nuevo</Badge>
            </div>
          )}
          {formData.isOnSale && formData.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Liquidación</span>
              <Badge variant="destructive">🔥 -{formData.discount}%</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics KPIs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            KPIs del producto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockKPIs.views}</div>
              <div className="text-xs text-muted-foreground">Vistas totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockKPIs.addedToQuotes}</div>
              <div className="text-xs text-muted-foreground">En cotizaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockKPIs.conversionRate}%</div>
              <div className="text-xs text-muted-foreground">Conversión</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{mockKPIs.avgRating}</div>
              <div className="text-xs text-muted-foreground">Rating prom.</div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">${mockKPIs.revenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Ingresos generados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Ver como cliente
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={onNavigateToAnalytics}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver analíticas generales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
