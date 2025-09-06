
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Target } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CategoryGoalsForm from "./CategoryGoalsForm";
import { CategoryGoal } from "@/types/vendor";

interface Vendor {
  id: string;
  name: string;
  currentTarget?: number;
}

interface SetSalesGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  onSave: (goalData: any) => void;
}

export default function SetSalesGoalDialog({ open, onOpenChange, vendor, onSave }: SetSalesGoalDialogProps) {
  const [goalType, setGoalType] = useState<"general" | "by_category">("general");
  const [goalAmount, setGoalAmount] = useState("");
  const [categoryGoals, setCategoryGoals] = useState<CategoryGoal[]>([
    { category: "Color", amount: 0 },
    { category: "Cuidado", amount: 0 },
    { category: "Styling", amount: 0 },
    { category: "Técnico", amount: 0 }
  ]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleCategoryGoalChange = (index: number, field: keyof CategoryGoal, value: string | number) => {
    setCategoryGoals(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = () => {
    if (goalType === "general" && (!goalAmount || !startDate || !endDate)) return;
    if (goalType === "by_category" && (!startDate || !endDate || categoryGoals.every(g => g.amount === 0))) return;
    
    const goalData = {
      vendorId: vendor?.id,
      type: goalType,
      ...(goalType === "general" 
        ? { amount: parseInt(goalAmount.replace(/\D/g, '')) }
        : { categoryGoals: categoryGoals.filter(g => g.amount > 0) }
      ),
      startDate,
      endDate,
      notes,
      createdAt: new Date()
    };
    
    onSave(goalData);
    
    // Reset form
    setGoalType("general");
    setGoalAmount("");
    setCategoryGoals([
      { category: "Color", amount: 0 },
      { category: "Cuidado", amount: 0 },
      { category: "Styling", amount: 0 },
      { category: "Técnico", amount: 0 }
    ]);
    setStartDate(new Date());
    setEndDate(undefined);
    setNotes("");
    onOpenChange(false);
  };

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters and format
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      const formatted = new Intl.NumberFormat('es-CL').format(parseInt(numericValue));
      setGoalAmount(formatted);
    } else {
      setGoalAmount("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Asignar Meta de Ventas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {vendor && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-medium">{vendor.name}</p>
              <p className="text-sm text-muted-foreground">
                Meta actual: {vendor.currentTarget ? formatCurrency(vendor.currentTarget) : "Sin meta asignada"}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Label>Tipo de meta *</Label>
            <RadioGroup
              value={goalType}
              onValueChange={(value: "general" | "by_category") => setGoalType(value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">Meta General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="by_category" id="by_category" />
                <Label htmlFor="by_category">Metas por Categoría</Label>
              </div>
            </RadioGroup>
          </div>

          {goalType === "general" ? (
            <div className="space-y-2">
              <Label htmlFor="goalAmount">Monto de la meta *</Label>
              <Input
                id="goalAmount"
                placeholder="Ej: 25,000,000"
                value={goalAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Ingrese el monto en pesos chilenos</p>
            </div>
          ) : (
            <CategoryGoalsForm
              categoryGoals={categoryGoals}
              onCategoryGoalChange={handleCategoryGoalChange}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd MMM yyyy", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de fin *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd MMM yyyy", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Comentarios sobre la meta, incentivos, etc..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={
              (goalType === "general" && (!goalAmount || !startDate || !endDate)) ||
              (goalType === "by_category" && (!startDate || !endDate || categoryGoals.every(g => g.amount === 0)))
            }
          >
            Asignar Meta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
