import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Video, User } from "lucide-react";
const purposeLabels: Record<string,string> = {};
import { AdvancedScheduleSelector } from "./AdvancedScheduleSelector";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

// Fixed sales person assigned to this client
const assignedSalesPerson = {
  id: "sp1",
  name: "María González",
  email: "maria.gonzalez@clubhx.com",
  phone: "+56 9 1234 5678",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80"
};

export function NewAppointmentDialog({ open, onOpenChange, onSubmit }: NewAppointmentDialogProps) {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    duration: "60",
    type: "presencial" as "presencial" | "videollamada",
    purpose: "",
    location: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !formData.time || !formData.purpose) {
      return;
    }

    onSubmit({
      ...formData,
      date,
      duration: parseInt(formData.duration),
      salesPerson: assignedSalesPerson
    });

    // Reset form
    setDate(undefined);
    setFormData({
      title: "",
      description: "",
      time: "",
      duration: "60",
      type: "presencial",
      purpose: "",
      location: "",
      notes: ""
    });
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Nueva Cita</DialogTitle>
          <DialogDescription>
            Solicita una reunión con tu ejecutivo de ventas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ejecutivo asignado */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tu ejecutivo de ventas asignado
            </Label>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <Avatar className="h-10 w-10">
                <AvatarImage src={assignedSalesPerson.avatar} />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{assignedSalesPerson.name}</p>
                <p className="text-xs text-muted-foreground">{assignedSalesPerson.email}</p>
                <p className="text-xs text-muted-foreground">{assignedSalesPerson.phone}</p>
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título de la reunión</Label>
            <Input
              id="title"
              placeholder="ej. Consultoría productos IGORA"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              required
            />
          </div>

          {/* Propósito */}
          <div className="space-y-2">
            <Label>Propósito de la reunión</Label>
            <Select value={formData.purpose} onValueChange={(value) => updateFormData("purpose", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el propósito" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(purposeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Describe brevemente el motivo de la reunión"
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={2}
            />
          </div>

          {/* Tipo de reunión */}
          <div className="space-y-3">
            <Label>Tipo de reunión</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => updateFormData("type", value as "presencial" | "videollamada")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presencial" id="presencial" />
                <Label htmlFor="presencial" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Presencial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="videollamada" id="videollamada" />
                <Label htmlFor="videollamada" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videollamada
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Advanced Schedule Selector */}
          <AdvancedScheduleSelector
            selectedDate={date}
            selectedTime={formData.time}
            onDateChange={setDate}
            onTimeChange={(time) => updateFormData("time", time)}
          />

          {/* Duración */}
          <div className="space-y-2">
            <Label>Duración estimada</Label>
            <Select value={formData.duration} onValueChange={(value) => updateFormData("duration", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
                <SelectItem value="90">90 minutos</SelectItem>
                <SelectItem value="120">120 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ubicación (solo para presencial) */}
          {formData.type === "presencial" && (
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación propuesta</Label>
              <Input
                id="location"
                placeholder="ej. En mi salón, oficina Club HX, etc."
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
              />
            </div>
          )}

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional que consideres relevante"
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Solicitar Cita
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}