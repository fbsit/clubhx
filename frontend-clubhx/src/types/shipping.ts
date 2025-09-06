export interface Location {
  id: string;
  name: string;
  type: 'country' | 'region' | 'city';
  parentId?: string;
}

export interface Courier {
  id: string;
  name: string;
  logo?: string;
  active: boolean;
}

export interface ShippingRule {
  id: string;
  type: 'fixed' | 'weight' | 'value' | 'free_threshold';
  value: number;
  threshold?: number; // Para reglas basadas en valor mínimo
  courierId: string;
  estimatedDays: {
    min: number;
    max: number;
  };
}

export interface ShippingZone {
  id: string;
  name: string;
  description?: string;
  locations: Location[];
  rules: ShippingRule[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingConfig {
  zones: ShippingZone[];
  couriers: Courier[];
  defaultZone?: ShippingZone;
}