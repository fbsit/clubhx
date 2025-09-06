
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export type SummaryPeriod = "3days" | "week" | "month" | "year" | "2years" | "all";

interface SummaryPeriodSelectorProps {
  value: SummaryPeriod;
  onChange: (period: SummaryPeriod) => void;
}

export default function SummaryPeriodSelector({ value, onChange }: SummaryPeriodSelectorProps) {
  const periodLabels: Record<SummaryPeriod, string> = {
    "3days": "Últimos 3 días",
    "week": "Esta semana",
    "month": "Este mes",
    "year": "Este año",
    "2years": "Últimos 2 años",
    "all": "Todos los tiempos"
  };

  return (
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(periodLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
