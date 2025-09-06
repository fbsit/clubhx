import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminVisit } from "@/utils/salesScheduleStore";
import { Calendar, TrendingUp, Clock, Target } from "lucide-react";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

interface PersonalPerformanceSectionProps {
  visits: AdminVisit[];
  currentMonth: Date;
}

export const PersonalPerformanceSection: React.FC<PersonalPerformanceSectionProps> = ({
  visits,
  currentMonth,
}) => {
  // Filter visits for current month
  const monthVisits = visits.filter(
    (visit) =>
      visit.date.getMonth() === currentMonth.getMonth() &&
      visit.date.getFullYear() === currentMonth.getFullYear()
  );

  // Current week visits
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const weekVisits = visits.filter(visit => 
    isWithinInterval(visit.date, { start: weekStart, end: weekEnd })
  );

  // Calculate personal metrics
  const completed = monthVisits.filter(v => v.status === "completed").length;
  const pending = monthVisits.filter(v => v.status === "pending").length;
  const confirmed = monthVisits.filter(v => v.status === "confirmed").length;
  const completionRate = monthVisits.length > 0 ? Math.round((completed / monthVisits.length) * 100) : 0;

  // Upcoming visits (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingVisits = visits.filter(visit => 
    visit.date >= now && visit.date <= nextWeek && 
    (visit.status === "confirmed" || visit.status === "pending")
  ).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mi Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-3xl font-bold text-primary">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Tasa de Completitud</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">{completed}</div>
                <div className="text-xs text-muted-foreground">Completadas</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{confirmed}</div>
                <div className="text-xs text-muted-foreground">Confirmadas</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">{pending}</div>
                <div className="text-xs text-muted-foreground">Pendientes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Esta Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total citas:</span>
              <Badge variant="secondary">{weekVisits.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completadas:</span>
              <Badge className="bg-blue-100 text-blue-800">
                {weekVisits.filter(v => v.status === "completed").length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pendientes:</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                {weekVisits.filter(v => v.status === "pending").length}
              </Badge>
            </div>
            {weekVisits.length > 0 && (
              <div className="pt-2 border-t">
                <div className="text-sm font-medium">Próxima cita:</div>
                <div className="text-xs text-muted-foreground">
                  {format(weekVisits[0].date, "EEEE dd/MM")} - {weekVisits[0].time}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Visits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Citas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingVisits.length > 0 ? (
              upcomingVisits.map((visit) => (
                <div key={visit.id} className="p-2 bg-muted/20 rounded text-sm">
                  <div className="font-medium">{visit.clientName}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(visit.date, "dd/MM")} - {visit.time}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {visit.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">No hay citas próximas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};