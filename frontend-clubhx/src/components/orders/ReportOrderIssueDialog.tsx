import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";
import { toast } from "sonner";

interface ReportOrderIssueDialogProps {
  orderId: string;
  children: React.ReactNode;
}

const issueCategories = [
  { value: "product_quality", label: "Calidad del producto", description: "Producto defectuoso o dañado" },
  { value: "missing_items", label: "Productos faltantes", description: "No recibí todos los productos" },
  { value: "wrong_items", label: "Producto incorrecto", description: "Recibí productos diferentes" },
  { value: "delivery_issue", label: "Problema de entrega", description: "Retraso o problema con el envío" },
  { value: "billing_error", label: "Error de facturación", description: "Problema con montos o factura" },
  { value: "other", label: "Otro", description: "Otro tipo de problema" }
];

export default function ReportOrderIssueDialog({ orderId, children }: ReportOrderIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Por favor selecciona una categoría");
      return;
    }

    if (!description.trim()) {
      toast.error("Por favor describe el problema");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const categoryLabel = issueCategories.find(cat => cat.value === selectedCategory)?.label;
    
    toast.success("Reporte enviado correctamente", {
      description: `Tu reporte sobre "${categoryLabel}" ha sido registrado. Te contactaremos pronto.`
    });

    setOpen(false);
    setSelectedCategory("");
    setDescription("");
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reportar Problema</DialogTitle>
          <DialogDescription>
            ¿Hay algún problema con tu pedido #{orderId}? Selecciona la categoría que mejor describe tu situación.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de problema</Label>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              {issueCategories.map((category) => (
                <div key={category.value} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={category.value} id={category.value} className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={category.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Descripción del problema
            </Label>
            <Textarea
              id="description"
              placeholder="Describe detalladamente qué problema has encontrado..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}