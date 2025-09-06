export interface ProductOption {
  id: string;
  name: string; // e.g., "Color", "Tamaño"
  value: string; // e.g., "Rojo", "XL"
  price: number; // precio directo de la opción
  image?: string; // URL de la imagen de la opción
  sku?: string; // SKU específico de la opción
  loyaltyPoints: number; // puntos de fidelización que gana el cliente
}

// Nueva interfaz para variantes de producto que combinan múltiples atributos
export interface ProductVariant {
  id: string;
  attributes: { [key: string]: string }; // { "Color": "Rojo", "Tamaño": "250ml" }
  price: number;
  stock: number;
  sku: string;
  image?: string;
  loyaltyPoints: number;
  isAvailable: boolean;
}

// Interfaz para definir los atributos disponibles del producto
export interface ProductAttribute {
  id: string;
  name: string; // e.g., "Color", "Tamaño" 
  values: string[]; // e.g., ["Rojo", "Azul", "Verde"]
}

// Función para calcular puntos automáticamente: 1 punto por cada 1800 CLP
export const calculateLoyaltyPoints = (price: number): number => {
  return Math.floor(price / 1800);
};

// Configuración de promociones de puntos de fidelización
export interface LoyaltyPromotion {
  isActive: boolean;
  multiplier: number; // e.g., 2 = doble puntos
  startDate?: Date;
  endDate?: Date;
}

// Bonificaciones especiales de puntos
export interface LoyaltyBonus {
  firstPurchaseBonus: number; // puntos extra en primera compra
  volumeBonus: {
    minQuantity: number; // cantidad mínima para activar bonificación
    bonusPoints: number; // puntos extra por volumen
  };
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number; // precio base
  image: string;
  category: string;
  type: string; // e.g., "Shampoo", "Conditioner", "Mask", etc.
  brand: string;
  stock: number;
  isNew: boolean;
  isPopular: boolean;
  discount: number; // percentage
  rating?: number; // 0-5 stars
  volume?: number; // in ml or g
  volumeUnit?: string; // ml, g, etc.
  options?: ProductOption[]; // DEPRECATED: usar variants en su lugar
  variants?: ProductVariant[]; // variantes del producto con combinaciones específicas
  attributes?: ProductAttribute[]; // atributos disponibles para crear variantes
  sku: string; // SKU del producto base
  loyaltyPoints: number; // puntos que gana el cliente por compra base
  
  // Promociones temporales de descuentos
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  isScheduledPromotion?: boolean;
  
  // Configuración de puntos de fidelización
  loyaltyPromotion?: LoyaltyPromotion;
  loyaltyBonus?: LoyaltyBonus;
  
  // Tipo de cálculo de puntos: 'automatic' | 'manual'
  loyaltyPointsMode?: 'automatic' | 'manual';
  loyaltyPointsRate?: number; // Para cálculo automático: puntos por cada X pesos
}

export interface QuoteItemType {
  product: ProductType;
  quantity: number;
  selectedOptions?: ProductOption[]; // DEPRECATED: opciones seleccionadas
  selectedVariant?: ProductVariant; // variante seleccionada
}
