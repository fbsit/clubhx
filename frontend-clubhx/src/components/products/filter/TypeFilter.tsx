
import { memo } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { productTypes } from "@/data/productTypes";

interface TypeFilterProps {
  selectedTypes: string[];
  onChange: (type: string, checked: boolean) => void;
}

const TypeFilter = memo(({ selectedTypes, onChange }: TypeFilterProps) => {
  return (
    <AccordionItem value="type" className="border-b">
      <AccordionTrigger className="py-3 hover:no-underline">
        <span className="flex items-center gap-2 text-sm">
          🏷️ Tipos de Productos
          {selectedTypes.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-[1.25rem] flex items-center justify-center">
              {selectedTypes.length}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-2">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`type-${type}`} 
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => 
                  onChange(type, checked === true)
                }
              />
              <Label 
                htmlFor={`type-${type}`}
                className="text-sm flex-1 cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

TypeFilter.displayName = "TypeFilter";
export default TypeFilter;
