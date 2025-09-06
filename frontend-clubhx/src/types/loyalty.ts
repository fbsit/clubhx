export type CustomerTier = 'standard' | 'premium' | 'elite';

export interface PointsTransaction {
  id: string;
  orderId: string;
  points: number;
  earnedDate: string; // When the order was placed
  releasedDate?: string; // When points were actually released (after payment)
  expirationDate: string; // When points expire
  tierAtEarning: CustomerTier; // Tier when points were earned
  type: 'earned' | 'redeemed' | 'expired';
  description: string;
  status: 'pending' | 'available' | 'expired' | 'redeemed';
}

export interface CustomerLoyaltyProfile {
  customerId: string;
  currentTier: CustomerTier;
  totalAvailablePoints: number;
  totalLifetimePoints: number;
  pointsLast12Months: number; // For tier calculation
  transactions: PointsTransaction[];
  tierHistory: Array<{
    tier: CustomerTier;
    startDate: string;
    pointsAtTierStart: number;
  }>;
}

// Tier configuration
export const TIER_CONFIG = {
  standard: {
    minPoints: 0,
    maxPoints: 999,
    validityMonths: 12,
    name: 'Estándar'
  },
  premium: {
    minPoints: 1000,
    maxPoints: 2999,
    validityMonths: 24,
    name: 'Premium'
  },
  elite: {
    minPoints: 3000,
    maxPoints: Infinity,
    validityMonths: 36,
    name: 'Elite'
  }
} as const;

// Calculate customer tier based on points in last 12 months
export const calculateCustomerTier = (pointsLast12Months: number): CustomerTier => {
  if (pointsLast12Months >= TIER_CONFIG.elite.minPoints) return 'elite';
  if (pointsLast12Months >= TIER_CONFIG.premium.minPoints) return 'premium';
  return 'standard';
};

// Calculate expiration date based on tier
export const calculateExpirationDate = (earnedDate: string, tier: CustomerTier): string => {
  const date = new Date(earnedDate);
  date.setMonth(date.getMonth() + TIER_CONFIG[tier].validityMonths);
  // Set to last day of the month
  date.setMonth(date.getMonth() + 1, 0);
  return date.toISOString();
};

// Check if points should be released (order is paid)
export const shouldReleasePoints = (orderStatus: string): boolean => {
  return ['paid', 'completed'].includes(orderStatus);
};

// Calculate available points excluding expired and redeemed
export const calculateAvailablePoints = (transactions: PointsTransaction[]): number => {
  const now = new Date().toISOString();
  return transactions
    .filter(t => 
      t.status === 'available' && 
      t.expirationDate > now &&
      t.type === 'earned'
    )
    .reduce((sum, t) => sum + t.points, 0);
};

// Get points earned in last 12 months for tier calculation
export const getPointsLast12Months = (transactions: PointsTransaction[]): number => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  
  return transactions
    .filter(t => 
      t.type === 'earned' && 
      t.status !== 'expired' &&
      new Date(t.earnedDate) >= twelveMonthsAgo
    )
    .reduce((sum, t) => sum + t.points, 0);
};

// Create a points transaction when order is placed
export const createPointsTransaction = (
  orderId: string,
  points: number,
  currentTier: CustomerTier,
  orderDate: string
): PointsTransaction => {
  const earnedDate = orderDate;
  const expirationDate = calculateExpirationDate(earnedDate, currentTier);
  
  return {
    id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderId,
    points,
    earnedDate,
    expirationDate,
    tierAtEarning: currentTier,
    type: 'earned',
    description: `Compra #${orderId}`,
    status: 'pending' // Will be 'available' when order is paid
  };
};

// Release points when order is paid
export const releasePoints = (transaction: PointsTransaction): PointsTransaction => {
  return {
    ...transaction,
    releasedDate: new Date().toISOString(),
    status: 'available'
  };
};