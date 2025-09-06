import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { businessTypeOptions } from "@/data/businessTypes";
import { RegistrationFormData } from "../ClientRegistrationFlow";

interface CompanyInfoStepProps {
  data: RegistrationFormData;
  onUpdate: (data: Partial<RegistrationFormData>) => void;
}

export default function CompanyInfoStep({ data, onUpdate }: CompanyInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName" className="text-sm font-medium">
          Razón Social *
        </Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Ej: Salón de Belleza Elegancia Ltda."
          value={data.companyName}
          onChange={(e) => onUpdate({ companyName: e.target.value })}
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rut" className="text-sm font-medium">
          RUT de la Empresa *
        </Label>
        <Input
          id="rut"
          type="text"
          placeholder="Ej: 76.123.456-7"
          value={data.rut}
          onChange={(e) => onUpdate({ rut: e.target.value })}
          className="h-11"
          maxLength={12}
          required
        />
        <p className="text-xs text-muted-foreground">
          Formato: 12.345.678-9
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType" className="text-sm font-medium">
          Tipo de Negocio *
        </Label>
        <Select 
          value={data.businessType} 
          onValueChange={(value) => onUpdate({ businessType: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Selecciona el tipo de negocio" />
          </SelectTrigger>
          <SelectContent>
            {businessTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Información importante:</strong> Solo trabajamos con profesionales del sector belleza. 
          Su solicitud será revisada por nuestro equipo para verificar la elegibilidad.
        </p>
      </div>
    </div>
  );
}