
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Video } from "lucide-react";

interface Address {
  street: string;
  city: string;
  country: string;
  details?: string;
}

interface EventLocationFormProps {
  eventType: "online" | "presencial";
  location: string;
  address?: Address;
  onlineUrl?: string;
}

export default function EventLocationForm({ eventType, location, address, onlineUrl }: EventLocationFormProps) {
  if (eventType === "presencial") {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <h4 className="font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Información de Ubicación
        </h4>
        
        <div className="space-y-2">
          <Label htmlFor="location">Nombre del Lugar</Label>
          <Input 
            id="location" 
            defaultValue={location}
            placeholder="Centro de Capacitación Schwarzkopf"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="street">Dirección</Label>
            <Input 
              id="street" 
              defaultValue={address?.street}
              placeholder="Av. Providencia 1234"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input 
              id="city" 
              defaultValue={address?.city}
              placeholder="Santiago"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input 
              id="country" 
              defaultValue={address?.country}
              placeholder="Chile"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Detalles Adicionales</Label>
            <Input 
              id="details" 
              defaultValue={address?.details}
              placeholder="Piso 3, Sala A"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
      <h4 className="font-medium flex items-center gap-2">
        <Video className="h-4 w-4" />
        Información Online
      </h4>
      
      <div className="space-y-2">
        <Label htmlFor="onlineUrl">URL de la Videollamada</Label>
        <Input 
          id="onlineUrl" 
          defaultValue={onlineUrl}
          placeholder="https://zoom.us/j/123456789"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Plataforma</Label>
        <Input 
          id="location" 
          defaultValue={location}
          placeholder="Zoom, Google Meet, Teams, etc."
        />
      </div>
    </div>
  );
}
