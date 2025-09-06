import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function WishlistCartIntegration() {
  const { itemsCount } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  // No mostrar para usuarios de ventas
  if (user?.role === "sales") {
    return null;
  }

  return (
    <Button
      onClick={() => navigate("/main/wishlist")}
      variant="ghost"
      size="sm"
      className="relative p-2"
    >
      <Heart className="h-5 w-5" />
      {itemsCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          style={{ animation: 'none' }}
        >
          {itemsCount > 99 ? "99+" : itemsCount}
        </Badge>
      )}
    </Button>
  );
}