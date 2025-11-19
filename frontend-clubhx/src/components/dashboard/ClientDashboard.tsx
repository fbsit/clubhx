import { Link } from "react-router-dom";
import { ShoppingCart, Calendar, Star, ArrowRight, Crown, AlertTriangle, TrendingUp, Gift } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CustomerStatus } from "@/types/auth";
import { formatCurrency, formatDate } from "@/components/dashboard/dashboardUtils";
import { Order, Event, StatusCardProps } from "@/components/dashboard/dashboardTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { getDashboardMetrics } from "@/services/dashboardApi";
import { TIER_CONFIG, CustomerTier } from "@/types/loyalty";
import { fetchMyLoyaltyPoints, fetchMyPointsExpiring, PointsExpiringItem, fetchMyPointsEarned } from "@/services/loyaltyApi";
import { useAuth } from "@/contexts/AuthContext";

// Component for status cards with consistent styling
const StatusCard = ({ icon, title, value, subtitle, gradient, delay = 0 }: StatusCardProps) => (
  <Card className={`animate-enter ${delay ? `[animation-delay:${delay}ms]` : ''} border-0 relative`}>
    <div className={`absolute inset-0 opacity-5 ${gradient || 'bg-gradient-to-br from-primary/20 to-primary/5'}`} />
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="p-1 rounded-full bg-background/80">
        {icon}
      </div>
    </CardHeader>
    <CardContent className="relative z-10">
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {subtitle}
      </p>
    </CardContent>
  </Card>
);

// Loyalty tier display component with progress to next tier
const LoyaltyTierDisplay = () => {
  const { user } = useAuth();
  const [points12Months, setPoints12Months] = useState<number>(0);
  // Por ahora mantenemos tier estático; el progreso usa el historial real de 12 meses
  const currentTier: CustomerTier = 'standard';
  const tierConfig = TIER_CONFIG[currentTier];
  
  const getNextTier = () => {
    if (currentTier === 'standard') return { tier: 'premium' as const, minPoints: TIER_CONFIG.premium.minPoints };
    if (currentTier === 'premium') return { tier: 'elite' as const, minPoints: TIER_CONFIG.elite.minPoints };
    return null;
    return null;
  };

  const nextTier = getNextTier();
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const clientId = String(user?.id || user?.providerClientPk || '');
        const { earned } = await fetchMyPointsEarned(12, clientId);
        if (!cancelled) setPoints12Months(earned ?? 0);
      } catch {
        if (!cancelled) setPoints12Months(0);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.providerClientPk]);
  const progressPercentage = nextTier ? Math.min(100, (points12Months / nextTier.minPoints) * 100) : 100;

  const getGradientConfig = () => ({
    gradient: 'bg-gradient-to-br from-green-100 via-emerald-200 to-green-200',
    iconColor: 'text-green-600',
    description: 'Puntos válidos por 12 meses'
  });

  const config = getGradientConfig();

  return (
    <Card className="animate-enter [animation-delay:100ms] border-0 relative group transition-all hover:shadow-md">
      <div className={`absolute inset-0 ${config.gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">Tier Club HX</CardTitle>
        <div className="p-1 rounded-full bg-background/80">
          <Crown className={`h-4 w-4 ${config.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 space-y-2">
        <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left">
          {tierConfig.name}
        </div>
        <p className="text-xs text-muted-foreground">
          {config.description}
        </p>
        {nextTier && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progreso a {TIER_CONFIG[nextTier.tier].name}</span>
              <span>{points12Months}/{nextTier.minPoints}</span>
            </div>
            <Progress value={progressPercentage} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced points display with expiration alerts
const EnhancedPointsDisplay = () => {
  const { user } = useAuth();
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [expiring, setExpiring] = useState<PointsExpiringItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { points } = await fetchMyLoyaltyPoints(String(user?.id || user?.providerClientPk || ''));
        if (!cancelled) setAvailablePoints(points ?? 0);
      } catch {
        if (!cancelled) setAvailablePoints(0);
      }
      try {
        const { expirations } = await fetchMyPointsExpiring(6, String(user?.id || user?.providerClientPk || ''));
        if (!cancelled) {
          setExpiring(expirations || []);
          try { localStorage.setItem('loyalty-expiring-next', JSON.stringify(expirations?.[0] || { month: '', expires: 0 })); } catch {}
        }
      } catch {
        if (!cancelled) setExpiring([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const pendingPoints = 0;
  const expiringPoints = expiring?.[0]?.expires ?? 0;

  return (
    <Card className="animate-enter [animation-delay:150ms] border-0 relative group transition-all hover:shadow-md cursor-pointer">
      <Link to="/main/points-detail" className="block">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/20 to-amber-50/20 opacity-10 group-hover:opacity-15 transition-opacity" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
          <CardTitle className="text-sm font-medium">Puntos Club HX</CardTitle>
          <div className="p-1 rounded-full bg-background/80">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-2">
          <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left">
            {availablePoints.toLocaleString()}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Disponibles para canjear
            </p>
            {pendingPoints > 0 && (
              <p className="text-xs text-amber-600">
                +{pendingPoints} puntos pendientes
              </p>
            )}
            {expiringPoints > 0 && (
              <p className="text-xs text-orange-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {expiringPoints} expiran pronto
              </p>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

// Tier benefits display
const TierBenefitsCard = () => {
  const currentTier: keyof typeof TIER_CONFIG = 'standard';
  const tierConfig = TIER_CONFIG[currentTier];
  
  const getBenefits = () => {
    return [
      'Puntos válidos por 12 meses',
      'Canjes básicos disponibles',
      'Notificaciones de ofertas',
      'Programa de lealtad'
    ];
  };

  return (
    <Card className="animate-enter [animation-delay:200ms] border-0 relative group transition-all hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-50/20 opacity-10 group-hover:opacity-15 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium">Beneficios {tierConfig.name}</CardTitle>
        <div className="p-1 rounded-full bg-background/80">
          <Gift className="h-4 w-4 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-2">
          {getBenefits().slice(0, 2).map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">{benefit}</span>
            </div>
          ))}
          <Button asChild variant="ghost" size="sm" className="w-full mt-2">
            <Link to="/main/loyalty" className="text-xs">
              Ver todos los beneficios
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface ClientDashboardProps {
  user: User | null;
  recentOrders: Order[];
  upcomingEvents: Event[];
  loyaltyPoints: number;
  creditAvailable: number;
  ordersError?: string | null;
  eventsError?: string | null;
  ordersTotal?: number;
  [key: string]: any;
}

export default function ClientDashboard({ 
  user, 
  recentOrders, 
  upcomingEvents, 
  loyaltyPoints,
  ordersError,
  eventsError,
  ordersTotal
}: ClientDashboardProps) {
  const isMobile = useIsMobile();
  const [clientOrdersTotal, setClientOrdersTotal] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('client-orders-total');
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });
  const [expiringNext, setExpiringNext] = useState<{ month: string; expires: number }>({ month: '', expires: 0 });
  const [expiringArr, setExpiringArr] = useState<PointsExpiringItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('loyalty-expiring-next');
      if (saved) setExpiringNext(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { expirations } = await fetchMyPointsExpiring(6);
        if (!cancelled) setExpiringArr(expirations || []);
      } catch {
        if (!cancelled) setExpiringArr([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setMetricsError(null);
        const data = await getDashboardMetrics('month');
        setClientOrdersTotal(data.totalOrders ?? 0);
      } catch (e) {
        setMetricsError('');
        setClientOrdersTotal(null);
      }
    };
    void load();
  }, []);
  
  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "completed": return "status-completed";
      case "shipped": return "status-shipped";
      case "canceled": return "status-canceled";
      case "rejected": return "status-canceled";
      default: return "status-requested";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-1 animate-enter">Bienvenido, {user?.name}</h1>
        <p className="text-muted-foreground animate-enter [animation-delay:50ms]">{user?.company}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatusCard 
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          title="Total de Pedidos"
          value={String(ordersTotal ?? 0)}
          subtitle="+5 pedidos en el último mes"
        />
        
        <LoyaltyTierDisplay />
        
        <EnhancedPointsDisplay />
        
        <StatusCard 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          title="Eventos Próximos"
          value={upcomingEvents.length}
          subtitle={`Próximo evento: ${formatDate(upcomingEvents[0]?.date || "")}`}
          delay={300}
        />
      </div>

      {/* New section for tier benefits and loyalty actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <TierBenefitsCard />
        
        <Card className="animate-enter [animation-delay:250ms] border-0 relative group transition-all hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-green-50/20 opacity-10 group-hover:opacity-15 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium">Acciones Rápidas</CardTitle>
            <div className="p-1 rounded-full bg-background/80">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <Button asChild size="sm" className="w-full">
              <Link to="/main/loyalty">
                <Star className="mr-2 h-4 w-4" />
                Canjear Puntos
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link to="/main/products">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Explorar Ofertas
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-enter [animation-delay:300ms] border-0 relative group transition-all hover:shadow-md cursor-pointer">
          <Link to="/main/points-detail?filter=expiring" className="block">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-50/20 opacity-10 group-hover:opacity-15 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Próximo a Expirar</CardTitle>
              <div className="p-1 rounded-full bg-background/80">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform origin-left">
                {(expiringArr[0]?.expires ?? expiringNext.expires ?? 0).toLocaleString('es-CL')} puntos
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(() => {
                  if (expiringArr.length === 0 && !expiringNext.month) return 'Sin expiraciones próximas';
                  const ym = (expiringArr[0]?.month || expiringNext.month || ''); // 'YYYY-MM'
                  const [y, m] = ym.split('-').map(Number);
                  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                  const expNext = expiringArr[0]?.expires ?? expiringNext.expires ?? 0;
                  return expNext > 0 ? `Expiran en ${meses[(m || 1) - 1]} ${y}` : 'Sin expiraciones este mes';
                })()}
              </p>
              <div className="text-xs text-orange-600 mt-2">
                Haz clic para ver detalles
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-enter [animation-delay:450ms] border-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-white dark:from-slate-900/30 dark:to-slate-950/30" />
          <CardHeader className="relative z-10">
            <CardTitle>Órdenes Recientes</CardTitle>
            <CardDescription>
              Visualiza el estado de tus últimos pedidos
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {ordersError && recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">{ordersError}</p>
              )}
              {!ordersError && recentOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay órdenes recientes para mostrar.</p>
              )}
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 -mx-2 px-2 rounded-md transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{order.id}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {order.items} productos
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <Badge className={`${getStatusBadgeClass(order.status)} status-badge`}>
                      {order.status === "completed" && "Completado"}
                      {order.status === "shipped" && "Enviado"}
                      {order.status === "invoiced" && "Facturado"}
                      {order.status === "requested" && "Solicitado"}
                      {order.status === "accepted" && "Aceptado"}
                      {order.status === "rejected" && "Rechazado"}
                      {order.status === "canceled" && "Cancelado"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="relative z-10">
            <Button asChild variant="ghost" size="sm" className="w-full group">
              <Link to="/main/orders" className="flex items-center justify-center">
                Ver todas las órdenes
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="animate-enter [animation-delay:600ms] border-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-white dark:from-slate-900/30 dark:to-slate-950/30" />
          <CardHeader className="relative z-10">
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>
              Capacitaciones y lanzamientos de productos
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {eventsError && upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">{eventsError}</p>
              )}
              {!eventsError && upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground">No hay eventos próximos para mostrar.</p>
              )}
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="border-b pb-3 last:border-0 last:pb-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 -mx-2 px-2 rounded-md transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{event.title}</p>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{event.brand}</p>
                    <div className="flex items-center text-sm mt-1">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="relative z-10">
            <Button asChild variant="ghost" size="sm" className="w-full group">
              <Link to="/main/events" className="flex items-center justify-center">
                Ver todos los eventos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="animate-enter [animation-delay:750ms] border-0 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardHeader className="relative z-10">
            <CardTitle>Crear Nueva Cotización</CardTitle>
            <CardDescription>
              Selecciona productos y crea una cotización personalizada
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6 relative z-10">
            <Button asChild size="lg" className="w-full sm:w-auto transition-all hover:shadow-md">
              <Link to="/main/products" className="flex items-center justify-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Explorar Productos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
