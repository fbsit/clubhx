import { ProductType, LoyaltyPromotion } from "@/types/product";

/**
 * Check if a promotion is currently active based on dates
 */
export const isPromotionActive = (promotion?: LoyaltyPromotion): boolean => {
  if (!promotion || !promotion.isActive) return false;
  
  const now = new Date();
  
  if (promotion.startDate && now < new Date(promotion.startDate)) {
    return false;
  }
  
  if (promotion.endDate && now > new Date(promotion.endDate)) {
    return false;
  }
  
  return true;
};

/**
 * Check if a product discount is currently active
 */
export const isDiscountActive = (product: ProductType): boolean => {
  if (!product.discount || product.discount <= 0) return false;
  
  const now = new Date();
  
  if (product.promotionStartDate && now < new Date(product.promotionStartDate)) {
    return false;
  }
  
  if (product.promotionEndDate && now > new Date(product.promotionEndDate)) {
    return false;
  }
  
  return true;
};

/**
 * Calculate loyalty points with promotion multiplier if active
 */
export const calculatePromotionalPoints = (product: ProductType): {
  basePoints: number;
  promotionalPoints: number;
  hasActivePromotion: boolean;
  multiplier: number;
} => {
  const finalPrice = isDiscountActive(product) 
    ? product.price * (1 - product.discount / 100) 
    : product.price;
  
  const basePoints = Math.floor(finalPrice / 1000);
  const hasActivePromotion = isPromotionActive(product.loyaltyPromotion);
  const multiplier = hasActivePromotion ? (product.loyaltyPromotion?.multiplier || 1) : 1;
  const promotionalPoints = Math.floor(basePoints * multiplier);
  
  return {
    basePoints,
    promotionalPoints,
    hasActivePromotion,
    multiplier
  };
};

/**
 * Get time remaining until promotion ends
 */
export const getTimeRemaining = (endDate?: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} => {
  if (!endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const total = new Date(endDate).getTime() - new Date().getTime();
  
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total };
};

/**
 * Format promotion end date for display
 */
export const formatPromotionEndDate = (endDate?: Date): string => {
  if (!endDate) return "";
  
  const date = new Date(endDate);
  return date.toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Get urgency text for discount promotions
 */
export const getDiscountUrgencyText = (product: ProductType): string => {
  if (!isDiscountActive(product) || !product.promotionEndDate) return "";
  
  return getUrgencyText(product.promotionEndDate);
};

/**
 * Get urgency text for loyalty point promotions
 */
export const getLoyaltyUrgencyText = (product: ProductType): string => {
  if (!isPromotionActive(product.loyaltyPromotion) || !product.loyaltyPromotion?.endDate) return "";
  
  return getUrgencyText(product.loyaltyPromotion.endDate);
};

/**
 * Get urgency text based on time remaining
 */
export const getUrgencyText = (endDate?: Date): string => {
  if (!endDate) return "";
  
  const timeRemaining = getTimeRemaining(endDate);
  
  if (timeRemaining.total <= 0) return "";
  
  if (timeRemaining.days === 0 && timeRemaining.hours < 24) {
    return "¡Últimas horas!";
  }
  
  if (timeRemaining.days === 1) {
    return "¡Último día!";
  }
  
  if (timeRemaining.days <= 3) {
    return "¡Quedan pocos días!";
  }
  
  return `Hasta el ${formatPromotionEndDate(endDate)}`;
};

/**
 * Check if we should show countdown (less than 7 days remaining)
 */
export const shouldShowCountdown = (endDate?: Date): boolean => {
  if (!endDate) return false;
  
  const timeRemaining = getTimeRemaining(endDate);
  return timeRemaining.total > 0 && timeRemaining.days <= 7;
};