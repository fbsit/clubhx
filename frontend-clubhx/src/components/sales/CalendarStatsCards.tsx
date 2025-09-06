
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

type CalendarStats = {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
};

type CalendarStatsCardsProps = {
  stats: CalendarStats;
};

export const CalendarStatsCards: React.FC<CalendarStatsCardsProps> = ({ stats }) => {
  const statsData = [
    {
      key: "total",
      label: "Total Citas",
      value: stats.total,
      icon: CalendarIcon,
      color: "text-blue-600"
    },
    {
      key: "confirmed",
      label: "Confirmadas",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      key: "pending",
      label: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      key: "completed",
      label: "Completadas",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      key: "cancelled",
      label: "Canceladas",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600"
    },
    {
      key: "rescheduled",
      label: "Reprogramadas",
      value: stats.rescheduled,
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {statsData.map(({ key, label, value, icon: Icon, color }) => (
        <Card key={key} className="overflow-hidden">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-2">
              {/* Icon and Value Row */}
              <div className="flex items-center justify-between">
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${color}`} />
                <p className={`text-xl sm:text-2xl font-bold ${color.replace('text-', 'text-')} leading-none`}>
                  {value}
                </p>
              </div>
              
              {/* Label Row */}
              <div className="min-h-0">
                <p className="text-xs sm:text-sm text-muted-foreground leading-tight truncate" title={label}>
                  {label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
