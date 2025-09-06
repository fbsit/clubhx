
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star } from "lucide-react";

interface SuccessAlertProps {
  visible: boolean;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <Alert className="mb-6 bg-green-50 border-green-200">
      <Star className="h-4 w-4 text-green-600" />
      <AlertTitle>¡Canje exitoso!</AlertTitle>
      <AlertDescription>
        Tu canje ha sido procesado correctamente. Recibirás un correo con los detalles.
      </AlertDescription>
    </Alert>
  );
};

export default SuccessAlert;
