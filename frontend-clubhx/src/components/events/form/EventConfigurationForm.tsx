
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/admin/ImageUploader";

interface EventConfigurationFormProps {
  spots: number;
  pointsCost: number;
  image: string;
  isPast?: boolean;
  isNew: boolean;
  onImageSelected: (imageUrl: string) => void;
}

export default function EventConfigurationForm({ 
  spots, 
  pointsCost, 
  image, 
  isPast, 
  isNew, 
  onImageSelected 
}: EventConfigurationFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spots">Cupos Totales</Label>
          <Input 
            id="spots" 
            type="number"
            defaultValue={spots}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pointsCost">Costo en Puntos</Label>
          <Input 
            id="pointsCost" 
            type="number"
            defaultValue={pointsCost}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Imagen del Evento</Label>
        <ImageUploader 
          onImageSelected={onImageSelected} 
          currentImage={image} 
        />
      </div>
      
      {!isNew && (
        <div className="space-y-2">
          <Label htmlFor="status">Estado del Evento</Label>
          <Select defaultValue={isPast ? "past" : "active"}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="past">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
