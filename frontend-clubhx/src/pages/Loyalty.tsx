import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { TIER_CONFIG } from "@/types/loyalty";
import { fetchMyLoyaltyPoints } from "@/services/loyaltyApi";
import ClientLoyaltyView from "@/components/loyalty/ClientLoyaltyView";
import { useMyRedemptions } from "@/hooks/useLoyaltyRewards";
import AdminLoyaltyProducts from "@/pages/admin/AdminLoyaltyProducts";

export default function Loyalty() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [tierInfo, setTierInfo] = useState<{ current: any; next: any; pointsLast12Months: number; pointsToNext: number }>({
    current: TIER_CONFIG.standard,
    next: TIER_CONFIG.premium,
    pointsLast12Months: 0,
    pointsToNext: TIER_CONFIG.premium.minPoints,
  });

  // Load points once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { points } = await fetchMyLoyaltyPoints(String(user?.id || user?.providerClientPk || ''));
        if (!cancelled) setTotalPoints(points ?? 0);
      } catch {
        if (!cancelled) setTotalPoints(0);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Tabs state to control when to fetch
  const [activeTab, setActiveTab] = useState("redeem");

  // Load redemptions only for active tabs
  const history = useMyRedemptions('delivered', activeTab === 'history');
  const pending = useMyRedemptions('pending', activeTab === 'pending');

  const progress = tierInfo.next ? (tierInfo.pointsLast12Months / tierInfo.next.minPoints) * 100 : 100;

  if (user?.role === "admin") {
    return (
      <div className="container max-w-7xl py-6 animate-enter">
        <h1 className="text-3xl font-bold mb-6">Gestión del Programa de Lealtad</h1>
        <AdminLoyaltyProducts />
      </div>
    );
  }

  if (user?.role === "client") {
    return (
      <div className="container max-w-7xl py-4 md:py-6 animate-enter">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Mis Puntos CLUB HX</h1>
            <p className="text-muted-foreground">Gana puntos con cada compra y canjéalos por recompensas exclusivas</p>
          </div>
          <Card className="md:min-w-[280px] cursor-pointer hover:shadow-md transition-shadow">
            <Link to="/main/points-detail" className="block">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">puntos disponibles</div>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Nivel: {tierInfo.current.name}</span>
                    {tierInfo.next && <span>Próximo: {tierInfo.next.name}</span>}
                  </div>
                  {tierInfo.next && (
                    <>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {tierInfo.pointsLast12Months.toLocaleString()} / {tierInfo.next.minPoints.toLocaleString()} puntos en últimos 12 meses
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-auto mb-6">
            <TabsTrigger value="redeem" className="py-2">Canjear Puntos</TabsTrigger>
            <TabsTrigger value="history" className="py-2">Historial</TabsTrigger>
            <TabsTrigger value="pending" className="py-2">Pendientes</TabsTrigger>
            <TabsTrigger value="benefits" className="py-2">Beneficios</TabsTrigger>
          </TabsList>

          {/* Redemption Tab */}
          <TabsContent value="redeem" className="mt-0">
            <ClientLoyaltyView totalPoints={totalPoints} isMobile={isMobile} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0">
            {history.loading && <div className="text-sm text-muted-foreground">Cargando historial…</div>}
            {history.error && <div className="text-sm text-destructive">{history.error}</div>}
            {!history.loading && !history.error && history.items.length === 0 && (
              <div className="text-sm text-muted-foreground">No tienes canjes entregados.</div>
            )}
            {!history.loading && !history.error && history.items.length > 0 && (
              <div className="space-y-3">
                {history.items.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Canje #{r.id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Recompensa: {r.reward_id}</div>
                    <div className="text-sm">Puntos: {r.points_spent}</div>
                    <div className="text-xs mt-1">Estado: {r.status}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Tab */}
          <TabsContent value="pending" className="mt-0">
            {pending.loading && <div className="text-sm text-muted-foreground">Cargando pendientes…</div>}
            {pending.error && <div className="text-sm text-destructive">{pending.error}</div>}
            {!pending.loading && !pending.error && pending.items.length === 0 && (
              <div className="text-sm text-muted-foreground">No tienes canjes pendientes.</div>
            )}
            {!pending.loading && !pending.error && pending.items.length > 0 && (
              <div className="space-y-3">
                {pending.items.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Canje #{r.id.slice(0, 8)}</div>
                      <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Recompensa: {r.reward_id}</div>
                    <div className="text-sm">Puntos: {r.points_spent}</div>
                    <div className="text-xs mt-1">Estado: {r.status}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Other tabs can be implemented similarly */}
        </Tabs>
      </div>
    );
  }
  return null;
}
