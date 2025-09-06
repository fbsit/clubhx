
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-6">
        <img 
          src="/lovable-uploads/598e04db-7596-4344-9b48-c02240f5daad.png" 
          alt="CLUB HX Logo" 
          className="h-16 mx-auto dark:hidden"
        />
        <img 
          src="/lovable-uploads/47040f1c-eb1d-4e0a-b62e-ec7224549120.png" 
          alt="CLUB HX Logo" 
          className="h-16 mx-auto hidden dark:block"
        />
      </div>

      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4">404</h1>
        <p className="text-2xl font-medium mb-6">Página no encontrada</p>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button asChild size="lg">
          <Link to="/main/products">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  );
}
