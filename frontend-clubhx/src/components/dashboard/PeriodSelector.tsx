import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface PeriodSelectorProps {
  onPeriodChange: (period: { start: Date; end: Date; label: string }) => void;
}

export function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("current-month");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>(undefined);
  const [isCustomRange, setIsCustomRange] = useState(false);

  const predefinedPeriods = [
    { value: "last-7-days", label: "Últimos 7 días" },
    { value: "last-15-days", label: "Últimos 15 días" },
    { value: "last-30-days", label: "Últimos 30 días" },
    { value: "current-month", label: "Mes Actual" },
    { value: "last-month", label: "Mes Anterior" },
    { value: "last-3-months", label: "Últimos 3 meses" },
    { value: "custom", label: "Rango Personalizado" }
  ];

  const calculateDateRange = (period: string) => {
    const today = new Date();
    let start: Date, end: Date;

    switch (period) {
      case "last-7-days":
        start = subDays(today, 7);
        end = today;
        break;
      case "last-15-days":
        start = subDays(today, 15);
        end = today;
        break;
      case "last-30-days":
        start = subDays(today, 30);
        end = today;
        break;
      case "current-month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case "last-month":
        start = startOfMonth(subMonths(today, 1));
        end = endOfMonth(subMonths(today, 1));
        break;
      case "last-3-months":
        start = subMonths(today, 3);
        end = today;
        break;
      default:
        start = startOfMonth(today);
        end = endOfMonth(today);
    }

    return { start, end };
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    
    if (value === "custom") {
      setIsCustomRange(true);
      return;
    }

    setIsCustomRange(false);
    const { start, end } = calculateDateRange(value);
    const label = predefinedPeriods.find(p => p.value === value)?.label || "";
    onPeriodChange({ start, end, label });
  };

  const handleCustomDateSelect = (range: DateRange | undefined) => {
    setCustomDateRange(range);
    if (range?.from && range?.to) {
      onPeriodChange({ 
        start: range.from, 
        end: range.to, 
        label: `${format(range.from, "dd/MM/yy", { locale: es })} - ${format(range.to, "dd/MM/yy", { locale: es })}` 
      });
    }
  };

  // Inicializar con mes actual
  React.useEffect(() => {
    const { start, end } = calculateDateRange("current-month");
    onPeriodChange({ start, end, label: "Mes Actual" });
  }, [onPeriodChange]);

  return (
    <Card className="bg-muted/30 border-2 border-primary/20">
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-sm font-medium whitespace-nowrap">Período:</span>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {predefinedPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isCustomRange && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal",
                      !customDateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDateRange?.from ? (
                      customDateRange.to ? (
                        <>
                          {format(customDateRange.from, "dd/MM/yy", { locale: es })} -{" "}
                          {format(customDateRange.to, "dd/MM/yy", { locale: es })}
                        </>
                      ) : (
                        format(customDateRange.from, "dd/MM/yy", { locale: es })
                      )
                    ) : (
                      <span>Seleccionar fechas</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={customDateRange?.from}
                    selected={customDateRange}
                    onSelect={handleCustomDateSelect}
                    numberOfMonths={2}
                    locale={es}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}