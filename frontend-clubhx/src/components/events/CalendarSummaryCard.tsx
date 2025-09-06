
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SummaryPeriodSelector from "./SummaryPeriodSelector";
import type { SummaryPeriod } from "./SummaryPeriodSelector";

interface SummaryStats {
  total: number;
  active: number;
  past: number;
  presencial: number;
  online: number;
}

interface CalendarSummaryCardProps {
  summaryPeriod: SummaryPeriod;
  onSummaryPeriodChange: (period: SummaryPeriod) => void;
  summaryStats: SummaryStats;
  filteredEventsCount: number;
  totalEventsCount: number;
}

export function CalendarSummaryCard({ 
  summaryPeriod, 
  onSummaryPeriodChange, 
  summaryStats, 
  filteredEventsCount, 
  totalEventsCount 
}: CalendarSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resumen</CardTitle>
        </div>
        <SummaryPeriodSelector
          value={summaryPeriod}
          onChange={onSummaryPeriodChange}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total eventos:</span>
            <span className="font-medium">{summaryStats.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Eventos activos:</span>
            <span className="font-medium text-green-600">{summaryStats.active}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Eventos pasados:</span>
            <span className="font-medium text-muted-foreground">{summaryStats.past}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Eventos presenciales:</span>
              <span className="font-medium text-green-600">{summaryStats.presencial}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Eventos online:</span>
              <span className="font-medium text-blue-600">{summaryStats.online}</span>
            </div>
          </div>
          {filteredEventsCount !== totalEventsCount && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Eventos filtrados:</span>
                <span className="font-medium text-blue-600">
                  {filteredEventsCount} de {totalEventsCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
