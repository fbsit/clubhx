
import { memo } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AvailabilityFilterProps {
  onlyInStock: boolean;
  onChange: (checked: boolean) => void;
}

const AvailabilityFilter = memo(({ onlyInStock, onChange }: AvailabilityFilterProps) => {
  return (
    <AccordionItem value="availability" className="border-b">
      <AccordionTrigger className="py-3 hover:no-underline">
        <span className="text-sm">Disponibilidad</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex items-center justify-between pt-1">
          <Label 
            htmlFor="in-stock"
            className="text-sm flex-1 cursor-pointer"
          >
            Solo productos en stock
          </Label>
          <Switch 
            id="in-stock" 
            checked={onlyInStock}
            onCheckedChange={onChange}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

AvailabilityFilter.displayName = "AvailabilityFilter";
export default AvailabilityFilter;
