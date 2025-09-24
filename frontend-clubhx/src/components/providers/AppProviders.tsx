
import React, { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { QuotationProvider } from "@/contexts/QuotationContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { SalesQuotationProvider } from "@/contexts/SalesQuotationContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/contexts/AuthContext";

// Wrapper para QuotationProvider que espera a que Auth esté listo
const QuotationProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { isInitialized } = useAuth();
  
  // Solo inicializar QuotationProvider después de que Auth esté listo
  if (!isInitialized) {
    return <>{children}</>;
  }
  
  return (
    <QuotationProvider>
      <WishlistProvider>
        <SalesQuotationProvider>
          {children}
        </SalesQuotationProvider>
      </WishlistProvider>
    </QuotationProvider>
  );
};

// Componente principal que maneja el orden correcto de providers
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <QuotationProviderWrapper>
            {children}
          </QuotationProviderWrapper>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
