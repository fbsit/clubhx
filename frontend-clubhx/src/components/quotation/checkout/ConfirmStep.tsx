import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileCheck, Loader2, Send, Truck } from "lucide-react";
import { QuoteItemType } from "@/types/product";

type ConfirmStepProps = {
  items: QuoteItemType[];
  notes: string;
  deliveryMethod: "pickup" | "delivery";
  onPrev: () => void;
  onSubmit: () => void;
  loading: boolean;
};

const ConfirmStep: FC<ConfirmStepProps> = ({ 
  items, 
  notes, 
  deliveryMethod, 
  onPrev, 
  onSubmit,
  loading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Confirmar cotización</CardTitle>
        <CardDescription>
          Revisa tu solicitud antes de enviarla
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-medium">Resumen de productos</h3>
          <div className="text-sm">
            {items.length} producto{items.length !== 1 ? 's' : ''} seleccionado{items.length !== 1 ? 's' : ''}
          </div>
          <Separator />
          
          <h3 className="font-medium">Método de entrega</h3>
          <div className="flex items-center text-sm">
            {deliveryMethod === "delivery" ? (
              <>
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Despacho a domicilio</span>
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Retiro en sucursal</span>
              </>
            )}
          </div>
          <Separator />
          
          {notes && (
            <>
              <h3 className="font-medium">Notas adicionales</h3>
              <div className="text-sm bg-muted/30 p-3 rounded">
                {notes}
              </div>
              <Separator />
            </>
          )}
          
          <h3 className="font-medium">¿Qué sigue?</h3>
          <ol className="space-y-2 list-decimal list-inside text-sm">
            <li>Nuestro equipo revisará tu solicitud</li>
            <li>Prepararemos una cotización detallada</li>
            <li>Te contactaremos con los detalles</li>
            <li>Podrás aceptar o rechazar la cotización</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Atrás
        </Button>
        <Button 
          onClick={onSubmit}
          className="flex items-center"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!loading && <Send className="mr-2 h-4 w-4" />}
          Solicitar cotización
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfirmStep;
