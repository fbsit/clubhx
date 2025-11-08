
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventBasicInfoFormProps {
  title: string;
  brand: string;
  description: string;
  date: string;
  time: string;
  onTitleChange?: (value: string) => void;
  onBrandChange?: (value: string) => void;
  onDescriptionChange?: (value: string) => void;
  onDateChange?: (value: string) => void;
  onTimeChange?: (value: string) => void;
}

export default function EventBasicInfoForm({ title, brand, description, date, time, onTitleChange, onBrandChange, onDescriptionChange, onDateChange, onTimeChange }: EventBasicInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Evento</Label>
          <Input 
            id="title" 
            value={title}
            onChange={(e) => onTitleChange?.(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input 
            id="brand" 
            value={brand}
            onChange={(e) => onBrandChange?.(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input 
            id="date" 
            type="date"
            value={date}
            onChange={(e) => onDateChange?.(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Horario</Label>
          <Input 
            id="time" 
            value={time}
            onChange={(e) => onTimeChange?.(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
