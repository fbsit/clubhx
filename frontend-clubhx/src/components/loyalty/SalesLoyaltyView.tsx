import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  ChevronRight,
  Calendar,
  Gift,
  Star,
  ArrowUpRight,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for sales insights
const mockInsightsData = {
  kpis: {
    totalClients: 24,
    activeRedeemers: 18,
    totalPointsRedeemed: 47250,
    monthlyGrowth: 15.3
  },
  topClients: [
    {
      id: "C001",
      name: "Beauty Salon Premium",
      points: 12400,
      totalRedemptions: 8,
      lastRedeem: "2024-01-15",
      trend: "up",
      potentialValue: 85000
    },
    {
      id: "C002", 
      name: "Estética Belleza Total",
      points: 8750,
      totalRedemptions: 5,
      lastRedeem: "2024-01-12", 
      trend: "stable",
      potentialValue: 62000
    },
    {
      id: "C003",
      name: "Peluquería Moderna",
      points: 5230,
      totalRedemptions: 3,
      lastRedeem: "2024-01-08",
      trend: "down",
      potentialValue: 38000
    }
  ],
  recentActivity: [
    {
      id: "R001",
      clientName: "Beauty Salon Premium",
      product: "Kit de Productos BC Bonacure",
      points: 5000,
      date: "2024-01-15",
      type: "product"
    },
    {
      id: "R002",
      clientName: "Estética Belleza Total", 
      product: "Descuento de $25.000",
      points: 2500,
      date: "2024-01-12",
      type: "discount"
    },
    {
      id: "R003",
      clientName: "Peluquería Moderna",
      product: "Tijeras Profesionales",
      points: 6000, 
      date: "2024-01-08",
      type: "product"
    }
  ],
  topProducts: [
    { name: "Kit BC Bonacure", redemptions: 12, points: 5000 },
    { name: "Descuento $25.000", redemptions: 8, points: 2500 },
    { name: "Tijeras Profesionales", redemptions: 6, points: 6000 },
    { name: "Capacitación Personalizada", redemptions: 4, points: 7500 }
  ],
  opportunities: [
    {
      client: "Salon Elite",
      points: 4800,
      suggestion: "Próximo a canjear - Contactar para cross-selling",
      priority: "high"
    },
    {
      client: "Beauty Corner",
      points: 3200,
      suggestion: "Cliente inactivo - Enviar promoción especial",
      priority: "medium"
    }
  ]
};

export const SalesLoyaltyView: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("30d");
  
  const { kpis, topClients, recentActivity, topProducts, opportunities } = mockInsightsData;

  const handleClientClick = (clientId: string) => {
    navigate(`/main/sales/customers/${clientId}`);
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Mobile KPI Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Clientes Totales</p>
                <p className="text-xl font-bold">{kpis.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Puntos Canjeados</p>
                <p className="text-xl font-bold">{kpis.totalPointsRedeemed.toLocaleString()}</p>
              </div>
              <Award className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Mobile Top Clients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Clientes Principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClients.slice(0, 3).map(client => (
              <div 
                key={client.id}
                onClick={() => handleClientClick(client.id)}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{client.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {client.points.toLocaleString()} pts • {client.totalRedemptions} canjes
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mobile Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.slice(0, 3).map(activity => (
              <div key={activity.id} className="flex justify-between items-start py-2 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.product}</p>
                  <p className="text-xs text-muted-foreground">{activity.clientName}</p>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.points.toLocaleString()} pts
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar clientes..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 días</SelectItem>
              <SelectItem value="30d">30 días</SelectItem>
              <SelectItem value="90d">90 días</SelectItem>
              <SelectItem value="1y">1 año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Desktop KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Clientes Totales</p>
                <p className="text-2xl font-bold">{kpis.totalClients}</p>
                <p className="text-xs text-green-600 font-medium flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +{kpis.monthlyGrowth}% este mes
                </p>
              </div>
              <Users className="h-10 w-10 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Clientes Activos</p>
                <p className="text-2xl font-bold">{kpis.activeRedeemers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((kpis.activeRedeemers / kpis.totalClients) * 100)}% del total
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Puntos Canjeados</p>
                <p className="text-2xl font-bold">{kpis.totalPointsRedeemed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Últimos 30 días</p>
              </div>
              <Award className="h-10 w-10 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Oportunidades</p>
                <p className="text-2xl font-bold">{opportunities.length}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Requieren atención</p>
              </div>
              <Target className="h-10 w-10 text-primary/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Clientes Principales
              <Badge variant="outline">{topClients.length} clientes</Badge>
            </CardTitle>
            <CardDescription>
              Clientes con mayor actividad de fidelización
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClients.map(client => (
                <div 
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{client.name}</p>
                      {client.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {client.trend === "down" && <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{client.points.toLocaleString()} puntos</span>
                      <span>{client.totalRedemptions} canjes</span>
                      <span>Potencial: ${client.potentialValue.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Último canje: {client.lastRedeem}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos canjes realizados por tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'product' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'discount' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'product' && <Gift className="h-4 w-4" />}
                      {activity.type === 'discount' && <Star className="h-4 w-4" />}
                      {activity.type === 'event' && <Calendar className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.product}</p>
                      <p className="text-xs text-muted-foreground">{activity.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      {activity.points.toLocaleString()} pts
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Populares</CardTitle>
            <CardDescription>
              Productos más canjeados por tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.points.toLocaleString()} puntos
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {product.redemptions} canjes
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades de Venta</CardTitle>
            <CardDescription>
              Clientes que requieren tu atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="p-4 rounded-lg border border-amber-200 bg-amber-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{opportunity.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {opportunity.points.toLocaleString()} puntos disponibles
                      </p>
                    </div>
                    <Badge 
                      variant={opportunity.priority === 'high' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {opportunity.priority === 'high' ? 'Alta' : 'Media'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {opportunity.suggestion}
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Cliente
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesLoyaltyView;