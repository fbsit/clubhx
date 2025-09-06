import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, Clock } from "lucide-react";
import { DateRangePreset } from "@/types/order";

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  customRange: { from: string; to: string };
  onCustomRangeChange: (range: { from: string; to: string }) => void;
}

const PERIOD_PRESETS: DateRangePreset[] = [
  {
    key: "today",
    label: "Hoy",
    value: {
      from: new Date(),
      to: new Date()
    }
  },
  {
    key: "week",
    label: "Esta semana",
    value: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date()
    }
  },
  {
    key: "month",
    label: "Este mes",
    value: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    }
  },
  {
    key: "quarter",
    label: "Este trimestre",
    value: {
      from: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1),
      to: new Date()
    }
  },
  {
    key: "year",
    label: "Este año",
    value: {
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date()
    }
  }
];

export default function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  customRange,
  onCustomRangeChange
}: PeriodSelectorProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);

  const handlePresetSelect = (preset: string) => {
    onPeriodChange(preset);
    if (preset !== "custom") {
      const presetData = PERIOD_PRESETS.find(p => p.key === preset);
      if (presetData) {
        onCustomRangeChange({
          from: presetData.value.from.toISOString().split('T')[0],
          to: presetData.value.to.toISOString().split('T')[0]
        });
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Período de Comparación
      </label>
      
      <Select value={selectedPeriod} onValueChange={handlePresetSelect}>
        <SelectTrigger className="text-xs">
          <SelectValue placeholder="Seleccionar período" />
        </SelectTrigger>
        <SelectContent>
          {PERIOD_PRESETS.map(preset => (
            <SelectItem key={preset.key} value={preset.key}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {selectedPeriod === "custom" && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="date"
            placeholder="Desde"
            value={customRange.from}
            onChange={(e) => onCustomRangeChange({
              ...customRange,
              from: e.target.value
            })}
            className="text-xs"
          />
          <Input
            type="date"
            placeholder="Hasta"
            value={customRange.to}
            onChange={(e) => onCustomRangeChange({
              ...customRange,
              to: e.target.value
            })}
            className="text-xs"
          />
        </div>
      )}
    </div>
  );
}