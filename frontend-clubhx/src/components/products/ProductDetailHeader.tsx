
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetailHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="outline" 
      onClick={() => navigate("/main/products")}
      className="mb-4 group transition-all duration-300 hover:bg-background rounded-xl border border-border/40 shadow-sm"
    >
      <ArrowLeft className="h-4 w-4 mr-2 group-hover:transform group-hover:translate-x-[-3px] transition-transform" />
      Volver a Productos
    </Button>
  );
};

export default ProductDetailHeader;
