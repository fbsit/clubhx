
import { ProductType } from "@/types/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrendingUp, TrendingDown, Users, Package, DollarSign, BarChart3, ChevronDown } from "lucide-react";
import { useMemo } from "react";

interface SalesProductAnalyticsProps {
  product: ProductType;
}

// Function to generate consistent "random" values based on product ID
const generateConsistentValue = (productId: string, seed: number, min: number, max: number): number => {
  let hash = 0;
  const str = productId + seed.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const normalized = Math.abs(hash) / 2147483647; // Normalize to 0-1
  return Math.floor(normalized * (max - min + 1)) + min;
};

const SalesProductAnalytics = ({ product }: SalesProductAnalyticsProps) => {
  // Memorize sales data to prevent recalculation on every render
  const salesData = useMemo(() => {
    const salesIncrease = generateConsistentValue(product.id, 1, 5, 30);
    const totalSold = generateConsistentValue(product.id, 2, 100, 500);
    const profitMargin = generateConsistentValue(product.id, 3, 20, 60);
    const stockRotation = generateConsistentValue(product.id, 4, 5, 20);
    const monthlyTrend = generateConsistentValue(product.id, 5, 0, 1) > 0.5 ? 'up' : 'down';
    
    return {
      monthlyTrend,
      salesIncrease,
      totalSold,
      averageOrderValue: Math.floor(product.price * (0.8 + (generateConsistentValue(product.id, 6, 0, 40) / 100))),
      topBuyingSegment: ['Peluquerías Premium', 'Salones de Barrio', 'Centros de Belleza'][generateConsistentValue(product.id, 7, 0, 2)],
      profitMargin,
      competitorPrice: Math.floor(product.price * (0.9 + (generateConsistentValue(product.id, 8, 0, 20) / 100))),
      stockRotation,
    };
  }, [product.id, product.price]);

  const relatedProducts = useMemo(() => [
    "IGORA ROYAL Developer",
    "Fibreplex Bond Connector",
    "BC Color Freeze Shampoo"
  ], []);

  return (
    <div className="animate-fade-in">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="analytics" className="border-blue-200">
          <Card className="border-blue-200 bg-blue-50">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-semibold text-blue-600">Análisis de Ventas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 animate-accordion-down">
                {/* Sales Performance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {salesData.monthlyTrend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">Tendencia Mensual</span>
                    </div>
                    <div className={`text-lg font-bold ${salesData.monthlyTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {salesData.monthlyTrend === 'up' ? '+' : '-'}{salesData.salesIncrease}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Vendidos (30d)</span>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {salesData.totalSold} unidades
                    </div>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Margen</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {salesData.profitMargin}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Rotación</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">
                      {salesData.stockRotation} días
                    </div>
                  </div>
                </div>

                {/* Customer Insights */}
                <div className="pt-2 border-t">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Segmento Principal:</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {salesData.topBuyingSegment}
                    </Badge>
                  </div>
                </div>

                {/* Cross-selling Opportunities */}
                <div className="pt-2 border-t">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">Productos Complementarios:</span>
                    <div className="flex flex-wrap gap-1">
                      {relatedProducts.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sales Recommendation */}
                <div className="pt-2 border-t bg-white rounded-lg p-3 -mx-1">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">💡 Recomendación:</span>
                    <p className="text-sm text-gray-600">
                      {salesData.monthlyTrend === 'up' 
                        ? `Producto en crecimiento. Ideal para promocionar en ${salesData.topBuyingSegment.toLowerCase()}. Stock: ${product.stock} unidades.`
                        : `Considerar promoción o bundling. Margen del ${salesData.profitMargin}% permite descuentos. Enfocar en ${salesData.topBuyingSegment.toLowerCase()}.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SalesProductAnalytics;
