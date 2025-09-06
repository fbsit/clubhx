
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface GoalHistory {
  id: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
  status: "active" | "completed" | "expired";
  achievement?: number;
  createdAt: Date;
}

interface VendorGoalHistoryProps {
  goals: GoalHistory[];
}

export default function VendorGoalHistory({ goals }: VendorGoalHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500">Activa</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completada</Badge>;
      case "expired":
        return <Badge className="bg-gray-500">Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAchievementIcon = (achievement?: number) => {
    if (!achievement) return null;
    return achievement >= 100 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-orange-600" />;
  };

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Historial de Metas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay metas asignadas para este vendedor
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4" />
          Historial de Metas ({goals.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{formatCurrency(goal.amount)}</h4>
                  {getStatusBadge(goal.status)}
                </div>
                <div className="flex items-center gap-2">
                  {goal.achievement && (
                    <div className="flex items-center gap-1">
                      {getAchievementIcon(goal.achievement)}
                      <span className="text-sm font-medium">{goal.achievement}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {format(goal.startDate, "dd MMM yyyy", { locale: es })} - {format(goal.endDate, "dd MMM yyyy", { locale: es })}
                  </span>
                </div>
              </div>

              {goal.notes && (
                <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                  {goal.notes}
                </p>
              )}

              {goal.achievement && goal.status === "completed" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Logro alcanzado:</span>
                  <span className="font-medium">
                    {formatCurrency((goal.amount * goal.achievement) / 100)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
