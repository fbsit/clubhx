
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, TrendingUp, TrendingDown, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
const salesPeople: any[] = [];

type SalesPersonSelectorProps = {
  selectedSalesPerson: string;
  onSalesPersonChange: (value: string) => void;
};

export const SalesPersonSelector: React.FC<SalesPersonSelectorProps> = ({
  selectedSalesPerson,
  onSalesPersonChange,
}) => {
  const [open, setOpen] = useState(false);

  // Calculate performance metrics for each salesperson
  const salesPersonMetrics = useMemo(() => {
    const metrics = salesPeople.map(person => {
      const personVisits = mockSalesVisits.filter(visit => visit.salesPersonId === person.id);
      const completedVisits = personVisits.filter(visit => visit.status === "completed").length;
      const totalVisits = personVisits.length;
      const successRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;
      
      return {
        ...person,
        totalVisits,
        completedVisits,
        successRate,
        pendingVisits: personVisits.filter(visit => visit.status === "pending").length,
        cancelledVisits: personVisits.filter(visit => visit.status === "cancelled").length,
      };
    });

    // Sort by success rate for performance categorization
    return metrics.sort((a, b) => b.successRate - a.successRate);
  }, []);

  // Categorize sales people by performance
  const topPerformers = salesPersonMetrics.filter(person => person.successRate >= 80);
  const lowPerformers = salesPersonMetrics.filter(person => person.successRate < 50 && person.totalVisits > 0);
  const allSalesPeople = salesPersonMetrics;

  const getSelectedLabel = () => {
    if (selectedSalesPerson === "all") return "Todos los vendedores";
    if (selectedSalesPerson === "top") return "Mejores vendedores";
    if (selectedSalesPerson === "low") return "Vendedores con oportunidades";
    
    const selected = salesPeople.find(person => person.id === selectedSalesPerson);
    return selected ? selected.name : "Seleccionar vendedor";
  };

  const handleSelect = (value: string) => {
    onSalesPersonChange(value);
    setOpen(false);
  };

  const formatSuccessRate = (rate: number) => {
    return `${rate.toFixed(0)}%`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-64 justify-between"
        >
          {getSelectedLabel()}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Command>
          <CommandInput placeholder="Buscar vendedor..." />
          <CommandList>
            <CommandEmpty>No se encontraron vendedores.</CommandEmpty>
            
            {/* Quick Filters */}
            <CommandGroup heading="Filtros rápidos">
              <CommandItem
                value="all"
                onSelect={() => handleSelect("all")}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSalesPerson === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                <Users className="h-4 w-4 text-blue-600" />
                <span>Todos los vendedores</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {salesPeople.length}
                </span>
              </CommandItem>
              
              <CommandItem
                value="top"
                onSelect={() => handleSelect("top")}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSalesPerson === "top" ? "opacity-100" : "opacity-0"
                  )}
                />
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>Mejores vendedores</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {topPerformers.length}
                </span>
              </CommandItem>
              
              <CommandItem
                value="low"
                onSelect={() => handleSelect("low")}
                className="flex items-center gap-2"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSalesPerson === "low" ? "opacity-100" : "opacity-0"
                  )}
                />
                <TrendingDown className="h-4 w-4 text-orange-600" />
                <span>Con oportunidades</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {lowPerformers.length}
                </span>
              </CommandItem>
            </CommandGroup>

            {/* Individual Sales People */}
            <CommandGroup heading="Vendedores individuales">
              {allSalesPeople.map((person) => (
                <CommandItem
                  key={person.id}
                  value={person.name}
                  onSelect={() => handleSelect(person.id)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSalesPerson === person.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{person.name}</span>
                        {person.successRate >= 80 && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {person.territory}
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className={cn(
                        "font-medium",
                        person.successRate >= 80 ? "text-green-600" : 
                        person.successRate >= 50 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {formatSuccessRate(person.successRate)}
                      </div>
                      <div className="text-muted-foreground">
                        {person.completedVisits}/{person.totalVisits} citas
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
