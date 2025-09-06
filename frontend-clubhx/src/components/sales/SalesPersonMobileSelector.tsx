
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search, Users, TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn } from "@/lib/utils";
const salesPeople: any[] = [];

type SalesPersonMobileSelectorProps = {
  selectedSalesPerson: string;
  onSalesPersonChange: (value: string) => void;
};

export const SalesPersonMobileSelector: React.FC<SalesPersonMobileSelectorProps> = ({
  selectedSalesPerson,
  onSalesPersonChange,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate performance metrics for each salesperson
  const salesPersonMetrics = useMemo(() => {
    const metrics = salesPeople.map(person => {
      const personVisits: any[] = [];
      const completedVisits = personVisits.filter(visit => visit.status === "completed").length;
      const totalVisits = personVisits.length;
      const successRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;
      
      return {
        ...person,
        totalVisits,
        completedVisits,
        successRate,
      };
    });

    return metrics.sort((a, b) => b.successRate - a.successRate);
  }, []);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    const quickOptions = [
      { id: "all", name: "Todos los vendedores", territory: "", successRate: 0, totalVisits: salesPeople.length, completedVisits: 0 },
      { id: "top", name: "Mejores vendedores", territory: "", successRate: 0, totalVisits: salesPersonMetrics.filter(p => p.successRate >= 80).length, completedVisits: 0 },
      { id: "low", name: "Con oportunidades", territory: "", successRate: 0, totalVisits: salesPersonMetrics.filter(p => p.successRate < 50 && p.totalVisits > 0).length, completedVisits: 0 },
    ];

    if (!searchQuery) {
      return [...quickOptions, ...salesPersonMetrics];
    }

    const searchLower = searchQuery.toLowerCase();
    const filteredSalesPeople = salesPersonMetrics.filter(person =>
      person.name.toLowerCase().includes(searchLower) ||
      person.territory.toLowerCase().includes(searchLower)
    );

    return [...quickOptions, ...filteredSalesPeople];
  }, [searchQuery, salesPersonMetrics]);

  const getSelectedLabel = () => {
    if (selectedSalesPerson === "all") return "Todos";
    if (selectedSalesPerson === "top") return "Mejores";
    if (selectedSalesPerson === "low") return "Oport.";
    
    const selected = salesPeople.find(person => person.id === selectedSalesPerson);
    return selected ? selected.name.split(' ')[0] : "Vendedor";
  };

  const handleSelect = (value: string) => {
    onSalesPersonChange(value);
    setOpen(false);
    setSearchQuery("");
  };

  const formatSuccessRate = (rate: number) => {
    return `${rate.toFixed(0)}%`;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs max-w-24 justify-between min-w-0 flex-shrink-0 overflow-hidden"
        >
          <span className="truncate flex-1 min-w-0">{getSelectedLabel()}</span>
          <ChevronDown className="ml-1.5 h-3 w-3 flex-shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl max-w-full overflow-hidden">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">Seleccionar Vendedor</SheetTitle>
        </SheetHeader>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Options List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredOptions.map((option) => {
            const isQuickOption = ["all", "top", "low"].includes(option.id);
            const isSelected = selectedSalesPerson === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-colors min-w-0 overflow-hidden",
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-muted border-border"
                )}
              >
                <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {option.id === "all" && <Users className="h-4 w-4" />}
                    {option.id === "top" && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {option.id === "low" && <TrendingDown className="h-4 w-4 text-orange-600" />}
                    {!isQuickOption && option.successRate >= 80 && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {!isQuickOption && option.successRate < 80 && (
                      <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {option.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="font-medium truncate flex-1 min-w-0">{option.name}</span>
                      {isQuickOption ? (
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {option.totalVisits}
                        </span>
                      ) : (
                        <span className={cn(
                          "text-xs font-medium flex-shrink-0",
                          option.successRate >= 80 ? "text-green-600" : 
                          option.successRate >= 50 ? "text-yellow-600" : "text-red-600"
                        )}>
                          {formatSuccessRate(option.successRate)}
                        </span>
                      )}
                    </div>
                    {!isQuickOption && (
                      <div className="flex items-center justify-between mt-1 gap-2 min-w-0">
                        <span className="text-xs text-muted-foreground truncate flex-1 min-w-0">
                          {option.territory}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {option.completedVisits}/{option.totalVisits}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
