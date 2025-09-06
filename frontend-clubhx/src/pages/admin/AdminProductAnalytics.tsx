
import { useState } from "react";
import { useEffect } from "react";
import { fetchProducts } from "@/services/productsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Eye,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  Star,
  Filter,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

export default function AdminProductAnalytics() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(500);
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Generate stable analytics data from real products
  const generateProductAnalytics = () => {
    return products.map(product => {
      const seed = product.id.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const seededRandom = (min: number, max: number) => {
        const x = Math.sin(seed) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
      };
      
      const views = seededRandom(100, 1500);
      const quotations = seededRandom(5, 80);
      const conversionRate = ((quotations / views) * 100).toFixed(1);
      
      return {
        ...product,
        analytics: {
          views,
          quotations,
          conversionRate: parseFloat(conversionRate),
          revenue: quotations * product.price,
          growth: seededRandom(-20, 50)
        }
      };
    });
  };

  const productsWithAnalytics = generateProductAnalytics();

  // Filter products based on search
  const filteredProducts = productsWithAnalytics.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalViews = productsWithAnalytics.reduce((sum, p) => sum + p.analytics.views, 0);
  const totalQuotations = productsWithAnalytics.reduce((sum, p) => sum + p.analytics.quotations, 0);
  const totalRevenue = productsWithAnalytics.reduce((sum, p) => sum + p.analytics.revenue, 0);
  const avgConversion = (totalQuotations / totalViews * 100).toFixed(1);

  // Top performers
  const topByViews = [...productsWithAnalytics].sort((a, b) => b.analytics.views - a.analytics.views).slice(0, 5);
  const topByQuotations = [...productsWithAnalytics].sort((a, b) => b.analytics.quotations - a.analytics.quotations).slice(0, 5);
  const topByRevenue = [...productsWithAnalytics].sort((a, b) => b.analytics.revenue - a.analytics.revenue).slice(0, 5);

  // Category performance
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.category === product.category);
    const productAnalytics = productsWithAnalytics.find(p => p.id === product.id)?.analytics;
    
    if (existing) {
      existing.products += 1;
      existing.views += productAnalytics?.views || 0;
      existing.quotations += productAnalytics?.quotations || 0;
    } else {
      acc.push({
        category: product.category,
        products: 1,
        views: productAnalytics?.views || 0,
        quotations: productAnalytics?.quotations || 0
      });
    }
    return acc;
  }, [] as any[]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="container max-w-7xl py-6 animate-enter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/main/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analíticas de Productos</h1>
          <p className="text-muted-foreground">Análisis detallado del rendimiento de productos</p>
        </div>
        <Button variant="outline" className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vistas</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cotizaciones</p>
                <p className="text-2xl font-bold">{totalQuotations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversión</p>
                <p className="text-2xl font-bold">{avgConversion}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Est.</p>
                <p className="text-2xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products by Views */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Top 5 - Más Visitados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topByViews.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{product.analytics.views.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">vistas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products by Quotations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Top 5 - Más Cotizados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topByQuotations.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{product.analytics.quotations}</p>
                        <p className="text-xs text-muted-foreground">cotizaciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" name="Vistas" />
                  <Bar dataKey="quotations" fill="#82ca9d" name="Cotizaciones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* Search */}
          <div className="flex gap-4">
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Products Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Detallado por Producto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="flex gap-2">
                        {product.isPopular && (
                          <Badge variant="default">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="outline">Nuevo</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Vistas</p>
                        <p className="font-bold">{product.analytics.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cotizaciones</p>
                        <p className="font-bold">{product.analytics.quotations}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversión</p>
                        <p className="font-bold">{product.analytics.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Ingresos Est.</p>
                        <p className="font-bold">${product.analytics.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Stock</p>
                        <div className="flex items-center gap-1">
                          <p className="font-bold">{product.stock}</p>
                          {product.stock <= 0 && <AlertCircle className="w-3 h-3 text-red-500" />}
                          {product.stock > 0 && product.stock <= 5 && <AlertCircle className="w-3 h-3 text-yellow-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Vistas por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="views"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Categories Table */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">{category.products} productos</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{category.views.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{category.quotations} cotizaciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Crecimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Productos en Crecimiento</h4>
                    <div className="space-y-2">
                      {productsWithAnalytics
                        .filter(p => p.analytics.growth > 0)
                        .sort((a, b) => b.analytics.growth - a.analytics.growth)
                        .slice(0, 5)
                        .map(product => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm font-medium truncate">{product.name}</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600 font-bold">+{product.analytics.growth}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Productos en Declive</h4>
                    <div className="space-y-2">
                      {productsWithAnalytics
                        .filter(p => p.analytics.growth < 0)
                        .sort((a, b) => a.analytics.growth - b.analytics.growth)
                        .slice(0, 5)
                        .map(product => (
                          <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span className="text-sm font-medium truncate">{product.name}</span>
                            <div className="flex items-center gap-1">
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-red-600 font-bold">{product.analytics.growth}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
