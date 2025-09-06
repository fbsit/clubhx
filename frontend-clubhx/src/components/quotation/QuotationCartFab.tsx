
import { ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function QuotationCartFab() {
  const { itemsCount: clientItemsCount } = useQuotation();
  const { itemsCount: salesItemsCount, selectedCustomer } = useSalesQuotation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSalesUser = user?.role === "sales";
  const itemsCount = isSalesUser ? salesItemsCount : clientItemsCount;

  // Lista de rutas donde mostrar el FAB
  const allowedRoutes = [
    "/main/products",
    "/main/dashboard", 
    "/main/orders",
    "/main/loyalty",
    "/main/events",
    "/main/wishlist",
    // Sales routes
    "/main/sales"
  ];

  // Rutas donde NO mostrar el FAB (ya estás en checkout o páginas irrelevantes)
  const excludedRoutes = [
    "/main/quotation-checkout",
    "/main/sales-quotation-checkout",
    "/main/profile",
    "/main/settings"
  ];

  // Verificar si estamos en una ruta donde mostrar el FAB
  const shouldShow = allowedRoutes.some(route => 
    location.pathname.startsWith(route)
  ) && !excludedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // También mostrar en páginas de detalle de producto
  const isProductDetail = location.pathname.match(/^\/main\/products\/[^\/]+$/);

  if (!shouldShow && !isProductDetail) {
    return null;
  }

  // Para vendedores: solo mostrar si hay cliente seleccionado Y productos
  if (isSalesUser && (!selectedCustomer || itemsCount === 0)) {
    return null;
  }

  // Para clientes: solo mostrar si hay productos
  if (!isSalesUser && itemsCount === 0) {
    return null;
  }

  const handleClick = () => {
    if (isSalesUser) {
      navigate("/main/sales-quotation-checkout");
    } else {
      navigate("/main/quotation-checkout");
    }
  };

  return (
    <Button 
      variant="default"
      className="fixed bottom-8 right-8 z-50 rounded-full p-4 shadow-lg hover:shadow-xl transition-all animate-fade-in bg-primary hover:bg-primary/90"
      onClick={handleClick}
    >
      <ShoppingBag className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
        {itemsCount}
      </Badge>
      <span className="sr-only">
        {isSalesUser 
          ? `Ver cotización para ${selectedCustomer?.name} (${itemsCount} productos)`
          : `Ver cotización (${itemsCount} productos)`
        }
      </span>
    </Button>
  );
}
