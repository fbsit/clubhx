import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getProgressColor } from "@/utils/goalCalculations";

interface GeneralGoalKPIProps {
  goalAmount: number;
  currentSales: number;
  title?: string;
  notes?: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);

export function GeneralGoalKPI({ goalAmount, currentSales, title = "Meta global", notes }: GeneralGoalKPIProps) {
  const progress = Math.min(100, Math.round((currentSales / (goalAmount || 1)) * 100));
  const remaining = Math.max(0, goalAmount - currentSales);
  const progressColor = getProgressColor(progress);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline" className={`${progressColor}`}>{progress}%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Progress value={progress} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Meta</p>
            <p className="text-xl font-semibold whitespace-nowrap tabular-nums">{formatCurrency(goalAmount)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Actual</p>
            <p className="text-xl font-semibold whitespace-nowrap tabular-nums">{formatCurrency(currentSales)}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Faltan</p>
            <p className="text-xl font-semibold whitespace-nowrap tabular-nums">{formatCurrency(remaining)}</p>
          </div>
        </div>
        {notes ? (
          <p className="text-sm text-muted-foreground">{notes}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
