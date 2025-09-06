
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";
const salesPeople: any[] = [];

type TeamActivitySummaryProps = {
  monthVisits: AdminVisit[];
};

export const TeamActivitySummary: React.FC<TeamActivitySummaryProps> = ({
  monthVisits,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Actividad del Equipo</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {salesPeople.map((person) => {
            const personVisits = monthVisits.filter(v => v.salesPersonId === person.id);
            const personConfirmed = personVisits.filter(v => v.status === "confirmed").length;
            const personCompleted = personVisits.filter(v => v.status === "completed").length;
            const personCancelled = personVisits.filter(v => v.status === "cancelled").length;
            
            return (
              <div key={person.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{person.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {personVisits.length} citas
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <BarChart3 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 text-xs flex-wrap">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {personConfirmed} conf.
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {personCompleted} compl.
                  </span>
                  {personCancelled > 0 && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                      {personCancelled} canc.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
