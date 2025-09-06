import { ShoppingBag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function QuotationCartFabIOS() {
  const { itemsCount: clientItemsCount } = useQuotation();
  const { itemsCount: salesItemsCount, selectedCustomer } = useSalesQuotation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isSalesUser = user?.role === "sales";
  const itemsCount = isSalesUser ? salesItemsCount : clientItemsCount;

  const allowedRoutes = [
    "/main/products",
    "/main/dashboard", 
    "/main/orders",
    "/main/loyalty",
    "/main/events",
    "/main/wishlist",
    "/main/sales"
  ];

  const excludedRoutes = [
    "/main/quotation-checkout",
    "/main/sales-quotation-checkout",
    "/main/profile",
    "/main/settings"
  ];

  const shouldShow = allowedRoutes.some(route => 
    location.pathname.startsWith(route)
  ) && !excludedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  const isProductDetail = location.pathname.match(/^\/main\/products\/[^\/]+$/);

  if (!shouldShow && !isProductDetail) {
    return null;
  }

  if (isSalesUser && (!selectedCustomer || itemsCount === 0)) {
    return null;
  }

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
      className="fixed bottom-8 right-8 z-50 rounded-full p-5 shadow-lg hover:shadow-xl transition-all animate-fade-in bg-primary hover:bg-primary/90 min-w-[64px] min-h-[64px]"
      onClick={handleClick}
      style={{ fontSize: '16px', touchAction: 'manipulation' }}
    >
      <ShoppingBag className="h-6 w-6" />
      {/* iOS: Use larger text for the count without separate badge */}
      <span 
        className="absolute -top-3 -right-3 h-8 w-8 flex items-center justify-center bg-red-500 text-white rounded-full font-medium"
        style={{ fontSize: '16px', minWidth: '32px', minHeight: '32px' }}
      >
        {itemsCount}
      </span>
      <span className="sr-only">
        {isSalesUser 
          ? `Ver cotización para ${selectedCustomer?.name} (${itemsCount} productos)`
          : `Ver cotización (${itemsCount} productos)`
        }
      </span>
    </Button>
  );
}