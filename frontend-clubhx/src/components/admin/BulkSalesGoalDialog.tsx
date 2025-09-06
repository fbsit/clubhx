
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Target, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Vendor {
  id: string;
  name: string;
  region: string;
  currentTarget?: number;
}

interface BulkSalesGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendors: Vendor[];
  onSave: (goalData: any) => void;
}

export default function BulkSalesGoalDialog({ open, onOpenChange, vendors, onSave }: BulkSalesGoalDialogProps) {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [goalAmount, setGoalAmount] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");

  const regions = [...new Set(vendors.map(v => v.region))];

  const filteredVendors = filterRegion === "all" 
    ? vendors 
    : vendors.filter(v => v.region === filterRegion);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    const allFiltered = filteredVendors.map(v => v.id);
    setSelectedVendors(allFiltered);
  };

  const handleUnselectAll = () => {
    setSelectedVendors([]);
  };

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      const formatted = new Intl.NumberFormat('es-CL').format(parseInt(numericValue));
      setGoalAmount(formatted);
    } else {
      setGoalAmount("");
    }
  };

  const handleSave = () => {
    if (!goalAmount || !startDate || !endDate || selectedVendors.length === 0) return;
    
    const goalData = {
      vendorIds: selectedVendors,
      amount: parseInt(goalAmount.replace(/\D/g, '')),
      startDate,
      endDate,
      notes,
      createdAt: new Date()
    };
    
    onSave(goalData);
    
    // Reset form
    setSelectedVendors([]);
    setGoalAmount("");
    setStartDate(new Date());
    setEndDate(undefined);
    setNotes("");
    setFilterRegion("all");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Asignar Meta Masiva
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-auto">
          <div className="space-y-2">
            <Label htmlFor="goalAmount">Monto de la meta *</Label>
            <Input
              id="goalAmount"
              placeholder="Ej: 25,000,000"
              value={goalAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>

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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Seleccionar vendedores ({selectedVendors.length})</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Seleccionar todos
                </Button>
                <Button variant="outline" size="sm" onClick={handleUnselectAll}>
                  Deseleccionar
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <Button
                variant={filterRegion === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRegion("all")}
              >
                Todas las regiones
              </Button>
              {regions.map(region => (
                <Button
                  key={region}
                  variant={filterRegion === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRegion(region)}
                >
                  {region}
                </Button>
              ))}
            </div>

            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {filteredVendors.map(vendor => (
                <div key={vendor.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={() => handleVendorToggle(vendor.id)}
                    />
                    <div>
                      <p className="font-medium text-sm">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.region}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Meta actual</p>
                    <p className="text-sm font-medium">
                      {vendor.currentTarget ? formatCurrency(vendor.currentTarget) : "Sin meta"}
                    </p>
                  </div>
                </div>
              ))}
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
            disabled={!goalAmount || !startDate || !endDate || selectedVendors.length === 0}
          >
            Asignar a {selectedVendors.length} vendedor{selectedVendors.length !== 1 ? 'es' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
