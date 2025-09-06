import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { RegistrationFormData } from "../ClientRegistrationFlow";
import { getBusinessTypeLabel } from "@/data/businessTypes";

interface ConfirmationStepProps {
  data: RegistrationFormData;
  onComplete: () => void;
}

export default function ConfirmationStep({ data, onComplete }: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-green-800">
          ¡Solicitud Enviada Exitosamente!
        </h3>
        <p className="text-muted-foreground">
          Su solicitud de registro ha sido enviada y está siendo revisada por nuestro equipo.
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-amber-600" />
          <span className="font-medium text-amber-800">Estado: Pendiente de Aprobación</span>
        </div>
        <p className="text-sm text-amber-700">
          Nuestro equipo revisará su solicitud en un plazo de 1-2 días hábiles. 
          Le notificaremos por email sobre el estado de su solicitud.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          Resumen de su solicitud
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{data.companyName}</p>
              <p className="text-sm text-muted-foreground">RUT: {data.rut}</p>
              <Badge variant="outline" className="mt-1">
                {getBusinessTypeLabel(data.businessType as any)}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{data.contactName}</p>
              <p className="text-sm text-muted-foreground">{data.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" />
                <span className="text-sm text-muted-foreground">{data.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{data.address}</p>
              <p className="text-sm text-muted-foreground">
                {data.commune}, {data.region}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
          Próximos pasos
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            Recibirá una confirmación por email
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            Nuestro equipo revisará su solicitud
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            Le notificaremos sobre la aprobación
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            Podrá acceder a la plataforma una vez aprobado
          </li>
        </ul>
      </div>

      <Button 
        onClick={onComplete}
        className="w-full h-11"
      >
        Volver al Inicio
      </Button>
    </div>
  );
}