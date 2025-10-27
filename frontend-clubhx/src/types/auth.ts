
export type UserRole = 'admin' | 'sales' | 'client';

export type CustomerStatus = 'starter' | 'gold' | 'platinum' | 'vip';

// New loyalty system types - migrating from CustomerStatus to CustomerTier
export type CustomerTier = 'standard' | 'premium' | 'elite';

// Business types for beauty sector clients
export type BusinessType = 
  | 'salon_belleza'
  | 'peluquerias_barberias'
  | 'tiendas_productos_belleza'
  | 'distribuidoras_capilares'
  | 'centros_estetica'
  | 'spas_wellness'
  | 'academias_belleza'
  | 'farmacias_belleza'
  | 'perfumerias'
  | 'otros';

// Registration status for pending client approvals
export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

// Client registration request interface
export interface ClientRegistrationRequest {
  id: string;
  // Company info
  companyName: string;
  rut: string;
  businessType: BusinessType;
  // Contact info
  contactName: string;
  email: string;
  phone: string;
  // Address
  address: string;
  commune: string;
  region: string;
  // Status
  status: RegistrationStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminComments?: string;
  // Email verification
  emailVerified: boolean;
  verificationCode?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Optional upstream/provider primary keys used for scoped queries
  providerClientPk?: string;
  providerSellerPk?: string;
  avatar?: string;
  avatarUrl?: string; 
  status: 'active' | 'inactive' | 'pending' | 'pending_approval';
  company: string; // Changed from optional to required
  position?: string;
  createdAt: string;
  lastLogin?: string;
  address?: string;
  city?: string;
  commune?: string;
  region?: string;
  zipCode?: string;
  phone?: string;
  rut?: string;
  businessType?: BusinessType;
  creditAvailable?: number; // Added: available credit in CLP
  customerStatus?: CustomerStatus; // Added: customer tier status (legacy)
  customerTier?: CustomerTier; // New loyalty system tier
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginClient: (identification: string, secret: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  registerClient: (registrationData: Omit<ClientRegistrationRequest, 'id' | 'status' | 'createdAt' | 'emailVerified'>) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
  refreshSession: () => Promise<void>; // This expects a Promise<void>
  updateUserProfile: (updatedUser: User) => void;
}
