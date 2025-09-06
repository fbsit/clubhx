import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminVisit } from "@/utils/salesScheduleStore";
const salesPeople: any[] = [];
import { User, Eye } from "lucide-react";

interface TeamActivitySectionProps {
  visits: AdminVisit[];
  currentMonth: Date;
}

export const TeamActivitySection: React.FC<TeamActivitySectionProps> = ({
  visits,
  currentMonth,
}) => {
  // Filter visits for current month
  const monthVisits = visits.filter(
    (visit) =>
      visit.date.getMonth() === currentMonth.getMonth() &&
      visit.date.getFullYear() === currentMonth.getFullYear()
  );

  // Calculate stats per salesperson
  const salesStats = salesPeople.map((salesperson) => {
    const personVisits = monthVisits.filter(v => v.salesPersonId === salesperson.id);
    const confirmed = personVisits.filter(v => v.status === "confirmed").length;
    const pending = personVisits.filter(v => v.status === "pending").length;
    const completed = personVisits.filter(v => v.status === "completed").length;
    
    return {
      ...salesperson,
      totalVisits: personVisits.length,
      confirmed,
      pending,
      completed,
      completionRate: personVisits.length > 0 ? Math.round((completed / personVisits.length) * 100) : 0,
    };
  });

  // Sort by total visits descending
  const sortedStats = salesStats.sort((a, b) => b.totalVisits - a.totalVisits);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Actividad del Equipo
          </CardTitle>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedStats.map((stat) => (
            <div
              key={stat.id}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {stat.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{stat.name}</p>
                  <p className="text-xs text-muted-foreground">{stat.territory}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{stat.totalVisits}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    {stat.confirmed} Conf.
                  </Badge>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    {stat.pending} Pend.
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    {stat.completed} Comp.
                  </Badge>
                </div>

                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-semibold text-foreground">{stat.completionRate}%</p>
                  <p className="text-xs text-muted-foreground">Tasa</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};