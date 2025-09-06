import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: "admin" | "sales" | "client";
  allowAllRoles?: boolean;
};

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  allowAllRoles = false
}: ProtectedRouteProps) {
  const { user, isInitialized, refreshSession } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - Current state:", { 
    user: user?.email, 
    role: user?.role, 
    requiredRole, 
    allowAllRoles,
    isInitialized,
    pathname: location.pathname 
  });
  
  // Refresh the session whenever a protected route is accessed
  useEffect(() => {
    if (!user) return;
    // Debounced refresh on route change, no dependency on user identity
    const id = setTimeout(() => { void refreshSession(); }, 300);
    return () => clearTimeout(id);
  }, [location.pathname]);

  if (!isInitialized) {
    // Show loading indicator while auth is initializing
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-middle"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login");
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Allow access to all roles if specified (for development and flexible UI testing)
  if (allowAllRoles) {
    console.log("ProtectedRoute - Allow all roles, rendering children");
    return <>{children}</>;
  }

  // Custom logic: allow "sales" users to access client/product/quotation/order routes
  if (
    requiredRole === "client" &&
    user.role === "sales"
  ) {
    // Permitir a ventas acceder a todo el flujo de cliente, incl. productos y cotizaciones
    return <>{children}</>;
  }

  // Apply role restrictions only if specifically required
  if (requiredRole && user.role !== requiredRole) {
    // Only restrict if it's a very specific admin-only route
    if (requiredRole === "admin" && user.role !== "admin" && location.pathname.includes("/admin/")) {
      const redirectPath = user.role === "sales" ? "/main/dashboard" : "/main/products";
      console.log("ProtectedRoute - Admin route restriction, redirecting to", redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
    
    // For other role mismatches, be more permissive during development
    console.log("ProtectedRoute - Role mismatch but allowing access for development");
  }

  console.log("ProtectedRoute - All checks passed, rendering children");
  return <>{children}</>;
}
