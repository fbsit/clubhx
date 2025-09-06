import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RegistrationFormData } from "../ClientRegistrationFlow";

interface AddressInfoStepProps {
  data: RegistrationFormData;
  onUpdate: (data: Partial<RegistrationFormData>) => void;
}

// Chilean regions for the select
const chileanRegions = [
  { value: "arica_parinacota", label: "Arica y Parinacota" },
  { value: "tarapaca", label: "Tarapacá" },
  { value: "antofagasta", label: "Antofagasta" },
  { value: "atacama", label: "Atacama" },
  { value: "coquimbo", label: "Coquimbo" },
  { value: "valparaiso", label: "Valparaíso" },
  { value: "metropolitana", label: "Metropolitana" },
  { value: "ohiggins", label: "O'Higgins" },
  { value: "maule", label: "Maule" },
  { value: "nuble", label: "Ñuble" },
  { value: "biobio", label: "Biobío" },
  { value: "araucania", label: "La Araucanía" },
  { value: "los_rios", label: "Los Ríos" },
  { value: "los_lagos", label: "Los Lagos" },
  { value: "aysen", label: "Aysén" },
  { value: "magallanes", label: "Magallanes" }
];

export default function AddressInfoStep({ data, onUpdate }: AddressInfoStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          Dirección *
        </Label>
        <Input
          id="address"
          type="text"
          placeholder="Ej: Av. Providencia 1234"
          value={data.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="commune" className="text-sm font-medium">
          Comuna *
        </Label>
        <Input
          id="commune"
          type="text"
          placeholder="Ej: Las Condes"
          value={data.commune}
          onChange={(e) => onUpdate({ commune: e.target.value })}
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="region" className="text-sm font-medium">
          Región *
        </Label>
        <Select 
          value={data.region} 
          onValueChange={(value) => onUpdate({ region: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Selecciona la región" />
          </SelectTrigger>
          <SelectContent>
            {chileanRegions.map((region) => (
              <SelectItem key={region.value} value={region.label}>
                {region.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Cobertura:</strong> Actualmente prestamos servicios principalmente en la 
          Región Metropolitana. Para otras regiones, el tiempo de entrega puede ser mayor.
        </p>
      </div>
    </div>
  );
}