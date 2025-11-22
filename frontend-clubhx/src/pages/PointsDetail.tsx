import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Star,
  Gift,
  Timer,
  Crown,
  Filter
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TIER_CONFIG } from "@/types/loyalty";
import { fetchMyLoyaltyPoints, fetchMyPointsExpiring, fetchMyPointsEarned, PointsExpiringItem } from "@/services/loyaltyApi";
import { useAuth } from "@/contexts/AuthContext";
import { useMyRedemptions } from "@/hooks/useLoyaltyRewards";

export default function PointsDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const initialFilter = searchParams.get('filter') || 'all';
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const { user } = useAuth();
  
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [pointsLast12Months, setPointsLast12Months] = useState<number>(0);
  const currentTierConfig = TIER_CONFIG['standard'];
  const [expiringPoints, setExpiringPoints] = useState<PointsExpiringItem[]>([]);

  // Redemptions (pending and delivered) to derive pending / redeemed points
  const clientId = String(user?.id || user?.providerClientPk || "");
  const allRedemptions = useMyRedemptions(undefined, true, clientId);
  const pendingRedemptions = useMyRedemptions('pending', true, clientId);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const clientId = String(user?.id || user?.providerClientPk || "");
        const [{ points }, earnedRes, expiringRes] = await Promise.all([
          fetchMyLoyaltyPoints(clientId),
          fetchMyPointsEarned(12, clientId),
          fetchMyPointsExpiring(6, clientId),
        ]);
        if (!cancelled) {
          setAvailablePoints(points ?? 0);
          setPointsLast12Months(earnedRes?.earned ?? 0);
          setExpiringPoints(expiringRes?.expirations ?? []);
        }
      } catch {
        if (!cancelled) {
          setAvailablePoints(0);
          setPointsLast12Months(0);
          setExpiringPoints([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, user?.providerClientPk]);

  // Calculate statistics from redemptions
  const pendingPoints = pendingRedemptions.items.reduce(
    (sum, r: any) => sum + (r.points_spent ?? 0),
    0,
  );
  // Total de puntos ya descontados por canjes (pendientes o entregados)
  const redeemedPoints = allRedemptions.items.reduce(
    (sum, r: any) => sum + (r.points_spent ?? 0),
    0,
  );
  const expiredPoints = 0; // aún no tenemos endpoint específico de expirados

  // Handle filter changes
  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    navigate(`/main/points-detail${newFilter !== 'all' ? `?filter=${newFilter}` : ''}`, { replace: true });
  };

  // Filter transactions based on selected filter
  const getFilteredTransactions = () => {
    // No hay transacciones reales aún; retornamos vacío para todas las vistas
    return [] as any[];
  };

  const filteredTransactions = getFilteredTransactions()
    .sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime());

  // Filter options for dropdown
  const filterOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'available', label: 'Disponibles' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'expiring', label: 'Por expirar' },
    { value: 'expired', label: 'Expirados' },
    { value: 'redeemed', label: 'Canjeados' }
  ];

  // Tier progress calculation
  const getNextTier = () => {
    if ('standard' === 'standard') return { tier: 'premium', minPoints: TIER_CONFIG.premium.minPoints };
    if ('premium' === 'premium') return { tier: 'elite', minPoints: TIER_CONFIG.elite.minPoints };
    return null;
  };

  const nextTier = getNextTier();
  const progressPercentage = nextTier 
    ? Math.min((pointsLast12Months / nextTier.minPoints) * 100, 100)
    : 100;

  const getStatusIcon = (transaction: any) => {
    switch (transaction.status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Timer className="h-4 w-4 text-amber-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'redeemed':
        return <Gift className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (transaction: any) => {
    switch (transaction.status) {
      case 'available':
        return 'Disponible';
      case 'pending':
        return 'Pendiente';
      case 'expired':
        return 'Expirado';
      case 'redeemed':
        return 'Canjeado';
      default:
        return transaction.status;
    }
  };

  const getStatusColor = (transaction: any) => {
    switch (transaction.status) {
      case 'available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'redeemed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="container max-w-7xl py-4 md:py-6 animate-enter">
      {/* Header */}
      <div className="mb-6 space-y-4">
        {/* Back button */}
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/main/dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Title and description */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">Detalle de Puntos Club HX</h1>
          <p className="text-muted-foreground">Historial completo y estadísticas de tu programa de lealtad</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availablePoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Disponibles</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-full p-2">
                <Timer className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full p-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {expiringPoints.reduce((sum, t) => sum + (t.expires ?? (t as any).points ?? 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Por expirar</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{redeemedPoints.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Canjeados</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Progreso del Tier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">Tier actual: {currentTierConfig.name}</span>
                <p className="text-sm text-muted-foreground">
                  Puntos válidos por {currentTierConfig.validityMonths} meses
                </p>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {pointsLast12Months.toLocaleString()} puntos en 12 meses
              </Badge>
            </div>
            
            {nextTier && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso hacia {TIER_CONFIG[nextTier.tier].name}</span>
                  <span>{pointsLast12Months}/{nextTier.minPoints}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Te faltan {(nextTier.minPoints - pointsLast12Months).toLocaleString()} puntos para alcanzar {TIER_CONFIG[nextTier.tier].name}
                </p>
              </div>
            )}

            {!nextTier && (
              <div className="text-center py-4">
                <div className="text-lg font-medium text-purple-700">🎉 ¡Nivel máximo alcanzado!</div>
                <p className="text-sm text-muted-foreground">Has desbloqueado todos los beneficios disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      {isMobile ? (
        // Mobile version: Dropdown
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrar transacciones</span>
              </div>
              <Select value={activeFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Desktop version: Tabs
        <Tabs value={activeFilter} onValueChange={handleFilterChange} className="w-full">
          <TabsList className="w-full grid grid-cols-6 h-auto mb-6">
            <TabsTrigger value="all" className="py-2 text-sm">Todos</TabsTrigger>
            <TabsTrigger value="available" className="py-2 text-sm">Disponibles</TabsTrigger>
            <TabsTrigger value="pending" className="py-2 text-sm">Pendientes</TabsTrigger>
            <TabsTrigger value="expiring" className="py-2 text-sm">Por expirar</TabsTrigger>
            <TabsTrigger value="expired" className="py-2 text-sm">Expirados</TabsTrigger>
            <TabsTrigger value="redeemed" className="py-2 text-sm">Canjeados</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Historial de Transacciones
            {activeFilter !== 'all' && (
              <Badge variant="outline" className="ml-2">
                {filteredTransactions.length} transacciones
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {activeFilter === 'all' && 'Todas tus transacciones de puntos'}
            {activeFilter === 'available' && 'Puntos listos para canjear'}
            {activeFilter === 'pending' && 'Puntos que se liberarán cuando los pedidos sean pagados'}
            {activeFilter === 'expiring' && 'Puntos que expiran en los próximos 6 meses'}
            {activeFilter === 'expired' && 'Puntos que ya no están disponibles'}
            {activeFilter === 'redeemed' && 'Historial de canjes realizados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay transacciones para mostrar en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTransactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {getStatusIcon(transaction)}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(transaction)}`}>
                            {getStatusLabel(transaction)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {TIER_CONFIG[transaction.tierAtEarning].name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ganado: {new Date(transaction.earnedDate).toLocaleDateString('es-CL')}</span>
                          </div>
                          {transaction.releasedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>Liberado: {new Date(transaction.releasedDate).toLocaleDateString('es-CL')}</span>
                            </div>
                          )}
                          {transaction.status === 'available' && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Expira: {new Date(transaction.expirationDate).toLocaleDateString('es-CL')}</span>
                            </div>
                          )}
                          {transaction.status === 'pending' && (
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              <span>Se liberará al pagar</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`font-semibold text-lg ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'earned' ? '+' : ''}{transaction.points.toLocaleString()}
                    </div>
                  </div>
                  {index < filteredTransactions.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Star className="h-12 w-12 mx-auto text-amber-500" />
              <div>
                <h3 className="font-semibold">¿Quieres canjear puntos?</h3>
                <p className="text-sm text-muted-foreground">Explora las recompensas disponibles</p>
              </div>
              <Button asChild className="w-full">
                <Link to="/main/loyalty">Ver recompensas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <TrendingUp className="h-12 w-12 mx-auto text-blue-500" />
              <div>
                <h3 className="font-semibold">Gana más puntos</h3>
                <p className="text-sm text-muted-foreground">Descubre productos con promociones activas</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link to="/main/products">Explorar productos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}