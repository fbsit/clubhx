
import React from "react";
import { ProductOption } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductOptionsSelectorProps {
  options: ProductOption[];
  selectedOptions: ProductOption[];
  onOptionChange: (option: ProductOption) => void;
  className?: string;
}

const ProductOptionsSelector: React.FC<ProductOptionsSelectorProps> = ({
  options,
  selectedOptions,
  onOptionChange,
  className
}) => {
  // Always call hooks at the top level - never conditionally
  const groupedOptions = React.useMemo(() => {
    if (!options || options.length === 0) {
      return {};
    }
    return options.reduce((acc, option) => {
      if (!acc[option.name]) {
        acc[option.name] = [];
      }
      acc[option.name].push(option);
      return acc;
    }, {} as Record<string, ProductOption[]>);
  }, [options]);

  const getSelectedOptionValue = React.useCallback((optionName: string): string => {
    const selected = selectedOptions.find(opt => opt.name === optionName);
    return selected ? selected.id : "";
  }, [selectedOptions]);

  const getSelectedOptionDisplay = React.useCallback((optionName: string): string => {
    const selected = selectedOptions.find(opt => opt.name === optionName);
    if (!selected) return `Seleccionar ${optionName}`;
    
    // Truncate long text for mobile display
    const maxLength = 20;
    const displayText = selected.value.length > maxLength 
      ? `${selected.value.substring(0, maxLength)}...` 
      : selected.value;
    
    return displayText;
  }, [selectedOptions]);

  const handleOptionSelect = React.useCallback((optionName: string, value: string) => {
    const option = options.find(opt => opt.id === value);
    if (option) {
      onOptionChange(option);
    }
  }, [options, onOptionChange]);

  const isOptionSelected = React.useCallback((option: ProductOption, optionName: string): boolean => {
    const selected = selectedOptions.find(opt => opt.name === optionName);
    return selected?.id === option.id;
  }, [selectedOptions]);

  // Early return AFTER all hooks
  if (!options || options.length === 0 || Object.keys(groupedOptions).length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Object.entries(groupedOptions).map(([optionName, optionsList]) => (
        <div key={optionName} className="space-y-2">
          <label className="text-base font-medium text-foreground">
            {optionName}
          </label>
          
          <Select
            value={getSelectedOptionValue(optionName)}
            onValueChange={(value) => handleOptionSelect(optionName, value)}
          >
            <SelectTrigger className="w-full h-11 text-base bg-background/80 border-border/30 rounded-lg hover:bg-background/60 transition-all duration-200 focus:ring-2 focus:ring-primary/20 ios-select-fix">
              <SelectValue>
                <span className="truncate block text-left">
                  {getSelectedOptionDisplay(optionName)}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent 
              className="bg-background/95 backdrop-blur-md border-border/20 rounded-xl shadow-lg w-full max-w-[calc(100vw-2rem)]"
              position="popper"
              sideOffset={4}
            >
              {optionsList.map((option) => (
                <SelectItem 
                  key={option.id} 
                  value={option.id}
                  className={cn(
                    "cursor-pointer hover:bg-secondary/20 focus:bg-secondary/30 rounded-lg transition-colors duration-150 px-3 py-2",
                    isOptionSelected(option, optionName) && "bg-green-500/10 hover:bg-green-500/20 focus:bg-green-500/20"
                  )}
                >
                   <div className="flex items-center justify-between w-full min-w-0">
                      <span className={cn(
                        "font-medium truncate flex-1 mr-2 text-base",
                        isOptionSelected(option, optionName) && "text-green-700 font-semibold"
                      )}>
                       {option.value}
                     </span>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className={cn(
                          "text-base font-medium ios-select-fix",
                          isOptionSelected(option, optionName) ? "text-green-600" : "text-muted-foreground"
                        )}>
                          ${option.price.toLocaleString()}
                        </span>
                        <span className={cn(
                          "text-base ios-select-fix",
                          isOptionSelected(option, optionName) ? "text-green-600 font-medium" : "text-blue-600"
                        )}>
                          +{option.loyaltyPoints} pts
                        </span>
                      </div>
                   </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default ProductOptionsSelector;
