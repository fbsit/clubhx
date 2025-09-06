
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventBasicInfoFormProps {
  title: string;
  brand: string;
  description: string;
  date: string;
  time: string;
}

export default function EventBasicInfoForm({ title, brand, description, date, time }: EventBasicInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título del Evento</Label>
          <Input 
            id="title" 
            defaultValue={title}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input 
            id="brand" 
            defaultValue={brand}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea 
          id="description" 
          rows={3}
          defaultValue={description}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input 
            id="date" 
            type="date"
            defaultValue={date}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Horario</Label>
          <Input 
            id="time" 
            defaultValue={time}
          />
        </div>
      </div>
    </>
  );
}
