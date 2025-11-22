import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, UserRole } from "@/types/auth";
import { setSessionTimeout, clearSession, setAuthToken } from "@/utils/sessionUtils";
import { loginApi, clientLoginApi } from "@/services/authApi";
import { clientsApi } from "@/services/clientsApi";
import { handleError } from "@/utils/errorUtils";

/**
 * Hook that provides authentication methods (login, logout, update profile)
 */
export const useAuthMethods = (
  setUser: (user: User | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setupSessionTimeout: () => void,
  cleanupTimeouts: () => void,
  recoveryAttemptRef: React.MutableRefObject<number>
) => {
  const navigate = useNavigate();
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Tester bypass: don't call backend for known demo emails
      const normalizedEmail = email.toLowerCase();
      const isTester = [
        "admin@clubhx.com",
        "sales@clubhx.com",
        "client@clubhx.com",
      ].includes(normalizedEmail);

      let fetchedUserFromApi: Partial<User> | null = null;
      if (!isTester) {
        // Real API call for non-tester emails
        const { token } = await loginApi(email, password);
        setAuthToken(token, 'bearer');
        // Immediately fetch current client info using token
        try {
          const client = await clientsApi.getCurrentClient();
          const c: any = client as any;
          const fullName = `${(c.first_name || '').trim()} ${(c.last_name || '').trim()}`.trim();
          const resolvedName = fullName || c.name || c.fantasy_name || c.real_client || c.email || 'Cliente';
          const resolvedCompany = c.company || c.fantasy_name || c.real_client || 'Mi Empresa';
          const resolvedId = c.id ?? c.pk ?? c.nfk;
          fetchedUserFromApi = {
            id: resolvedId != null ? String(resolvedId) : undefined,
            email: c.email || email,
            name: resolvedName,
            company: resolvedCompany,
            role: 'client',
            providerClientPk: resolvedId != null ? String(resolvedId) : undefined,
            providerSellerPk: c.seller ? String((typeof c.seller === 'object' && c.seller.id) ? c.seller.id : c.seller) : undefined,
          } as Partial<User>;
        } catch (e) {
          // If fetching client fails, continue with fallback user; errors are shown elsewhere
        }
      }
      
      // Role determination (testers: forced; others: heuristic fallback)
      let role: UserRole = "client";
      let userName = "Usuario";
      let company = "Salon Profesional";
      
      // Tester roles
      if (normalizedEmail === "admin@clubhx.com") {
        role = "admin";
        userName = "Administrador CLUB HX";
        company = "CLUB HX - Administración";
      } else if (normalizedEmail === "sales@clubhx.com") {
        role = "sales";
        userName = "Representante de Ventas";
        company = "CLUB HX - Equipo Comercial";
      } else if (normalizedEmail === "client@clubhx.com") {
        role = "client";
        userName = "Miguel Rojas";
        company = "Salon Belleza Profesional";
      } else {
        // Legacy role detection for other emails
        if (email.includes("admin")) {
          role = "admin";
          userName = "Admin User";
          company = "CLUB HX - Administración";
        } else if (email.includes("sales")) {
          role = "sales";
          userName = "Sales Rep";
          company = "CLUB HX - Equipo Comercial";
        } else {
          userName = "Miguel Rojas";
          company = "Salon Belleza Profesional";
        }
      }

      // Special temporary override: contacto@pictorica.cl entra como admin,
      // pero usando el token real del backend y los datos que vengan de la API.
      if (normalizedEmail === "contacto@pictorica.cl") {
        role = "admin";
        userName = fetchedUserFromApi?.name || "Pictorica Admin";
        company = fetchedUserFromApi?.company || "Pictorica";
      }
      
      // Mock user data with role-specific information
      const mockUser: User = {
        id: fetchedUserFromApi?.id || `user-${role}-123`,
        providerClientPk: fetchedUserFromApi?.providerClientPk || (role === 'client' ? '1' : undefined),
        providerSellerPk: fetchedUserFromApi?.providerSellerPk ?? (role === 'sales' ? '1' : undefined),
        email: fetchedUserFromApi?.email || email,
        name: fetchedUserFromApi?.name || userName,
        company: fetchedUserFromApi?.company || company,
        role: role,
        status: "active",
        createdAt: new Date().toISOString(),
        address: "Av. Providencia 1234",
        city: "Santiago",
        region: "Metropolitana",
        zipCode: "7500000",
        avatarUrl: `https://randomuser.me/api/portraits/${role === "client" ? "men" : "women"}/${Math.floor(Math.random() * 50) + 1}.jpg`,
        creditAvailable: role === "client" ? 250000 : undefined
      };
      
      localStorage.setItem("clubhx-user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Set session timeout after successful login
      setupSessionTimeout();
      
      // Admin-specific prefetch: list of clients (kept separate from client flow)
      if (!isTester && role === 'admin') {
        try {
          const list = await clientsApi.getClients({ limit: 20, offset: 0 });
          try { localStorage.setItem('admin-clients-preview', JSON.stringify({ count: list.count })); } catch {}
        } catch {}
      }

      // Role-based redirection with specific landing pages using /main prefix
      if (role === "admin") {
        navigate("/main/dashboard");
        toast.success(`Bienvenido al panel de administración, ${userName}`);
      } else if (role === "sales") {
        navigate("/main/dashboard");
        toast.success(`Bienvenido al portal de ventas, ${userName}`);
      } else {
        navigate("/main/products");
        toast.success(`¡Bienvenido a CLUB HX, ${userName}!`);
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, intente nuevamente.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginClient = async (identification: string, secret: string) => {
    setIsLoading(true);
    try {
      const { token } = await clientLoginApi(identification, secret);
      setAuthToken(token, 'client');

      // Try to fetch current client profile after client login
      let fetchedUserFromApi: Partial<User> | null = null;
      try {
        const client = await clientsApi.getCurrentClient();
        const c: any = client as any;
        const fullName = `${(c.first_name || '').trim()} ${(c.last_name || '').trim()}`.trim();
        const resolvedName = fullName || c.name || c.fantasy_name || c.real_client || 'Cliente';
        const resolvedCompany = c.company || c.fantasy_name || c.real_client || 'Mi Empresa';
        const resolvedId = c.id ?? c.pk ?? c.nfk;
        fetchedUserFromApi = {
          id: resolvedId != null ? String(resolvedId) : undefined,
          email: c.email || '',
          name: resolvedName,
          company: resolvedCompany,
          role: 'client',
          providerClientPk: resolvedId != null ? String(resolvedId) : undefined,
          providerSellerPk: c.seller ? String((typeof c.seller === 'object' && c.seller.id) ? c.seller.id : c.seller) : undefined,
        } as Partial<User>;
      } catch {}

      const user: User = {
        id: fetchedUserFromApi?.id || `user-client-${Date.now()}`,
        providerClientPk: fetchedUserFromApi?.providerClientPk || undefined,
        providerSellerPk: fetchedUserFromApi?.providerSellerPk || undefined,
        email: fetchedUserFromApi?.email || '',
        name: fetchedUserFromApi?.name || 'Cliente',
        company: fetchedUserFromApi?.company || 'Mi Empresa',
        role: 'client',
        status: 'active',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("clubhx-user", JSON.stringify(user));
      setUser(user);
      setupSessionTimeout();
      navigate("/main/products");
      toast.success(`¡Bienvenido a CLUB HX!`);
    } catch (error) {
      toast.error("Error al iniciar sesión como cliente");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a new user with required fields
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email || "",
        name: userData.name || "",
        role: userData.role || "client",
        status: "active",
        company: userData.company || "Mi Salón",
        createdAt: new Date().toISOString(),
        // Assign other fields from userData or defaults
        address: userData.address,
        city: userData.city,
        region: userData.region,
        zipCode: userData.zipCode,
        avatarUrl: userData.avatarUrl
      };
      
      localStorage.setItem("clubhx-user", JSON.stringify(newUser));
      setUser(newUser);
      
      // Set session timeout after successful registration
      setupSessionTimeout();
      
      navigate("/main/products");
      toast.success("¡Registro exitoso! Bienvenido a CLUB HX");
    } catch (error) {
      toast.error("Error al registrar. Por favor, intente nuevamente.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerClient = async (registrationData: any) => {
    setIsLoading(true);
    try {
      const { clientRegister } = await import("@/services/registrationApi");
      const payload = {
        rut: registrationData.rut,
        name: registrationData.contactName ?? registrationData.companyName,
        email: registrationData.email,
        phone: registrationData.phone,
        password: registrationData.password,
      } as { rut: string; name: string; email: string; phone: string; password: string };
      await clientRegister(payload);
      toast.success("Registro enviado. Revisa tu correo para continuar.");
    } catch (error: any) {
      toast.error(error?.message || "Error al enviar la solicitud de registro");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, any 6-digit code starting with "1" is valid
    const isValid = code.length === 6 && code.startsWith("1");
    
    if (isValid) {
      toast.success("Email verificado correctamente");
    }
    
    return isValid;
  };

  const sendPasswordReset = async (email: string) => {
    // Simulate sending password reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Password reset code sent to:", email);
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    // Simulate password reset
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, any code starting with "9" is valid
    if (!code.startsWith("9")) {
      throw new Error("Invalid reset code");
    }
    
    console.log("Password reset successful for:", email);
  };

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    
    // Clear session timeouts
    cleanupTimeouts();
    
    // Navigate to login page
    navigate("/");
    toast.info("Has cerrado sesión correctamente.");
  }, [cleanupTimeouts, navigate, setUser]);

  const updateUserProfile = (updatedUser: User) => {
    try {
      localStorage.setItem("clubhx-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Refresh session timeout when profile is updated
      setupSessionTimeout();
    } catch (error) {
      handleError(error, "updateUserProfile");
      // Recovery attempt
      if (recoveryAttemptRef.current < 3) {
        recoveryAttemptRef.current += 1;
        setTimeout(() => updateUserProfile(updatedUser), 500);
      }
    }
  };

  return {
    login,
    loginClient,
    logout,
    register,
    registerClient,
    verifyEmail,
    sendPasswordReset,
    resetPassword,
    updateUserProfile
  };
};
