import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, Clock, X, Triangle } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

interface CalendarKPICardsProps {
  visits: AdminVisit[];
  currentMonth: Date;
}

export const CalendarKPICards: React.FC<CalendarKPICardsProps> = ({
  visits,
  currentMonth,
}) => {
  // Filter visits for current month
  const monthVisits = visits.filter(
    (visit) =>
      visit.date.getMonth() === currentMonth.getMonth() &&
      visit.date.getFullYear() === currentMonth.getFullYear()
  );

  const totalVisits = monthVisits.length;
  const confirmedVisits = monthVisits.filter(v => v.status === "confirmed").length;
  const pendingVisits = monthVisits.filter(v => v.status === "pending").length;
  const completedVisits = monthVisits.filter(v => v.status === "completed").length;
  const cancelledVisits = monthVisits.filter(v => v.status === "cancelled").length;
  const rescheduledVisits = monthVisits.filter(v => v.status === "rescheduled").length;

  const kpiCards = [
    {
      title: "Total Citas",
      value: totalVisits,
      icon: Calendar,
      color: "bg-slate-50 border-slate-200",
      iconColor: "text-slate-600",
    },
    {
      title: "Confirmadas",
      value: confirmedVisits,
      icon: Check,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      title: "Pendientes",
      value: pendingVisits,
      icon: Clock,
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600",
    },
    {
      title: "Completadas",
      value: completedVisits,
      icon: Check,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      title: "Canceladas",
      value: cancelledVisits,
      icon: X,
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
    },
    {
      title: "Reagendadas",
      value: rescheduledVisits,
      icon: Triangle,
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {kpiCards.map((kpi) => {
        const IconComponent = kpi.icon;
        return (
          <Card key={kpi.title} className={`${kpi.color} border-l-4 hover:shadow-md transition-shadow`}>
            <CardContent className="p-3">
              <div className="space-y-2">
                {/* Icon at top */}
                <div className="flex justify-center">
                  <div className={`p-2 rounded-lg bg-white/80 ${kpi.iconColor}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                
                {/* Value and title below */}
                <div className="text-center space-y-1">
                  <p className="text-xl font-bold text-foreground leading-none">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{kpi.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};