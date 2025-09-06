
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, FileText } from "lucide-react";

const SuccessView: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 rounded-full p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">¡Cotización enviada con éxito!</CardTitle>
          <CardDescription>
            Tu número de referencia es: <span className="font-medium">QUOT-{Math.floor(Math.random() * 10000)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Hemos recibido tu solicitud de cotización. Nuestro equipo la revisará y te contactará pronto.</p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Podrás revisar el estado de tu cotización en tu sección de pedidos</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => navigate("/main/orders")}>
            Ver mis pedidos
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/main/products")}>
            Continuar comprando
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessView;
