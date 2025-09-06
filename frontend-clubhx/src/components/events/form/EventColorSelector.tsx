
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

interface EventColorSelectorProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const eventColors = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Rojo", value: "#ef4444" },
  { name: "Púrpura", value: "#8b5cf6" },
  { name: "Amarillo", value: "#f59e0b" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Naranja", value: "#f97316" },
];

export default function EventColorSelector({ selectedColor, onColorChange }: EventColorSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Color del Evento
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {eventColors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={`
              p-2 rounded-lg border-2 flex items-center gap-2 transition-all min-w-0
              ${selectedColor === color.value 
                ? 'border-primary shadow-md bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: color.value }}
            />
            <span className="text-xs font-medium truncate flex-1 text-left">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
