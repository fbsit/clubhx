
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard } from "lucide-react";

interface EditCreditLimitDialogProps {
  currentLimit: number;
  customerName: string;
  onSave: (newLimit: number) => void;
}

export const EditCreditLimitDialog: React.FC<EditCreditLimitDialogProps> = ({
  currentLimit,
  customerName,
  onSave,
}) => {
  const [newLimit, setNewLimit] = useState(currentLimit.toString());
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleSave = () => {
    const limitValue = parseInt(newLimit.replace(/\D/g, ''));
    
    if (isNaN(limitValue) || limitValue < 0) {
      toast({
        title: "Error",
        description: "Ingrese un límite válido",
        variant: "destructive",
      });
      return;
    }

    onSave(limitValue);
    setIsOpen(false);
    
    toast({
      title: "Límite actualizado",
      description: `El límite de crédito de ${customerName} ha sido actualizado a ${formatCurrency(limitValue)}`,
    });
  };

  const handleInputChange = (value: string) => {
    // Remove non-numeric characters and format
    const numericValue = value.replace(/\D/g, '');
    setNewLimit(numericValue);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CreditCard className="mr-2 h-4 w-4" />
          Editar Límite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Límite de Crédito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Cliente</Label>
            <Input id="customer" value={customerName} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentLimit">Límite Actual</Label>
            <Input id="currentLimit" value={formatCurrency(currentLimit)} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newLimit">Nuevo Límite</Label>
            <Input
              id="newLimit"
              value={newLimit ? formatCurrency(parseInt(newLimit)) : ''}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Ingrese el nuevo límite"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
