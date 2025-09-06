
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, Video } from "lucide-react";

interface EventTypeSelectorProps {
  eventType: "online" | "presencial";
  onEventTypeChange: (value: "online" | "presencial") => void;
}

export default function EventTypeSelector({ eventType, onEventTypeChange }: EventTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Tipo de Evento</Label>
      <RadioGroup 
        value={eventType} 
        onValueChange={(value) => onEventTypeChange(value as "online" | "presencial")}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="presencial" id="presencial" />
          <Label htmlFor="presencial" className="flex items-center gap-2 cursor-pointer">
            <MapPin className="h-4 w-4" />
            Presencial
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
            <Video className="h-4 w-4" />
            Online
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
