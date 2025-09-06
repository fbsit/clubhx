
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, TrendingUp, Users, Calendar, Gift, Star } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface DesktopProductStatsDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function DesktopProductStatsDialog({ product, isOpen, onClose, onEdit }: DesktopProductStatsDialogProps) {
  if (!product) return null;

  // Mock stats - en una app real vendrían de la API
  const stats = {
    totalRedeems: 147,
    thisMonth: 23,
    avgPerMonth: 18,
    topRedeemers: [
      { name: "Salón Bella Vista", redeems: 12 },
      { name: "Estética María", redeems: 8 },
      { name: "Hair Studio", redeems: 6 }
    ],
    recentActivity: [
      { date: "2024-01-15", client: "Salón Bella Vista", action: "Canjeado" },
      { date: "2024-01-14", client: "Estética María", action: "Canjeado" },
      { date: "2024-01-12", client: "Hair Studio", action: "Canjeado" }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "product": return <Gift className="h-4 w-4" />;
      case "discount": return <TrendingUp className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "training": return <Users className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getCategoryIcon(product.category)}
            Estadísticas: {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Overview */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {product.featured && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white" />
                      Destacado
                    </Badge>
                  )}
                  <Button onClick={onEdit} size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">{product.pointsCost.toLocaleString()} puntos</span>
                {product.available && (
                  <span className="text-muted-foreground">{product.available} disponibles</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Canjeados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRedeems}</div>
                <p className="text-xs text-muted-foreground">Desde el lanzamiento</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.thisMonth - stats.avgPerMonth} vs promedio
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Promedio Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgPerMonth}</div>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Redeemers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Principales Canjeadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topRedeemers.map((redeemer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{redeemer.name}</span>
                    </div>
                    <span className="text-sm font-medium">{redeemer.redeems} canjes</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>{activity.client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{activity.action}</span>
                      <span>•</span>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
