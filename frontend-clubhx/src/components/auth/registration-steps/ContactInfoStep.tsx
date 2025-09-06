import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegistrationFormData } from "../ClientRegistrationFlow";

interface ContactInfoStepProps {
  data: RegistrationFormData;
  onUpdate: (data: Partial<RegistrationFormData>) => void;
}

export default function ContactInfoStep({ data, onUpdate }: ContactInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contactName" className="text-sm font-medium">
          Nombre del Contacto o Representante *
        </Label>
        <Input
          id="contactName"
          type="text"
          placeholder="Ej: María González"
          value={data.contactName}
          onChange={(e) => onUpdate({ contactName: e.target.value })}
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Correo Electrónico *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="contacto@empresa.com"
          value={data.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className="h-11"
          required
        />
        <p className="text-xs text-muted-foreground">
          Se enviará un código de verificación a esta dirección
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-medium">
          Teléfono *
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+56 9 8765 4321"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          className="h-11"
          required
        />
        <p className="text-xs text-muted-foreground">
          Incluye código de país (+56 para Chile)
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Protección de datos:</strong> Su información personal será utilizada únicamente 
          para procesar su solicitud de registro y mantener contacto comercial autorizado.
        </p>
      </div>
    </div>
  );
}