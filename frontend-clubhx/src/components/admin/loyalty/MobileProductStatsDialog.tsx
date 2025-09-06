
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, TrendingUp, Users, Calendar, Gift, Star, X } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { useNavigate } from "react-router-dom";

interface MobileProductStatsDialogProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function MobileProductStatsDialog({ product, isOpen, onClose, onEdit }: MobileProductStatsDialogProps) {
  const navigate = useNavigate();

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

  const getEditButtonText = (category: string) => {
    switch (category) {
      case "event":
      case "training":
        return "Editar Evento";
      default:
        return "Editar Producto";
    }
  };

  const handleEditClick = () => {
    if (product.category === "event" || product.category === "training") {
      onClose();
      navigate("/main/events");
    } else {
      onEdit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-none max-h-none p-0 overflow-hidden [&>button]:hidden">
        <div className="flex flex-col h-full relative">
          {/* Botón de cerrar personalizado */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white shadow-md border flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header fijo */}
          <DialogHeader className="px-4 py-3 border-b bg-background shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base pr-8">
              {getCategoryIcon(product.category)}
              {product.name}
            </DialogTitle>
          </DialogHeader>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {/* Product Overview - Compacto para móvil */}
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm leading-tight truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium">{product.pointsCost.toLocaleString()} puntos</span>
                  {product.available && (
                    <span className="text-muted-foreground">{product.available} disponibles</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {product.featured && (
                    <Badge variant="default" className="flex items-center gap-1 text-xs h-5">
                      <Star className="h-3 w-3 fill-white" />
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards - Grid compacto */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.totalRedeems}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.thisMonth}</div>
                  <div className="text-xs text-muted-foreground">Este Mes</div>
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-center">
                  <div className="text-lg font-bold">{stats.avgPerMonth}</div>
                  <div className="text-xs text-muted-foreground">Promedio</div>
                </div>
              </Card>
            </div>

            {/* Top Redeemers - Compacto */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Principales Canjeadores</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {stats.topRedeemers.map((redeemer, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="truncate">{redeemer.name}</span>
                      </div>
                      <span className="text-xs font-medium">{redeemer.redeems}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity - Compacto */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                          <span className="truncate">{activity.client}</span>
                        </div>
                        <span className="text-muted-foreground">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer fijo con botón de editar */}
          <div className="px-4 py-3 border-t bg-background shrink-0">
            <Button onClick={handleEditClick} className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              {getEditButtonText(product.category)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
