import { BusinessType } from "@/types/auth";

export interface BusinessTypeOption {
  value: BusinessType;
  label: string;
  description?: string;
}

export const businessTypeOptions: BusinessTypeOption[] = [
  {
    value: 'salon_belleza',
    label: 'Salones de Belleza',
    description: 'Salones de belleza integral y estética'
  },
  {
    value: 'peluquerias_barberias',
    label: 'Peluquerías y Barberías',
    description: 'Servicios de corte y peinado'
  },
  {
    value: 'tiendas_productos_belleza',
    label: 'Tiendas de Productos de Belleza',
    description: 'Retail especializado en productos de belleza'
  },
  {
    value: 'distribuidoras_capilares',
    label: 'Distribuidoras de Productos Capilares',
    description: 'Distribución mayorista de productos para el cabello'
  },
  {
    value: 'centros_estetica',
    label: 'Centros de Estética',
    description: 'Centros especializados en tratamientos estéticos'
  },
  {
    value: 'spas_wellness',
    label: 'Spas y Wellness',
    description: 'Centros de relajación y bienestar'
  },
  {
    value: 'academias_belleza',
    label: 'Academias de Belleza',
    description: 'Institutos de formación en belleza y peluquería'
  },
  {
    value: 'farmacias_belleza',
    label: 'Farmacias con Sección de Belleza',
    description: 'Farmacias con área especializada en productos de belleza'
  },
  {
    value: 'perfumerias',
    label: 'Perfumerías',
    description: 'Tiendas especializadas en perfumes y cosméticos'
  },
  {
    value: 'otros',
    label: 'Otros',
    description: 'Otro tipo de negocio relacionado con la belleza'
  }
];

export const getBusinessTypeLabel = (type: BusinessType): string => {
  const option = businessTypeOptions.find(opt => opt.value === type);
  return option?.label || type;
};