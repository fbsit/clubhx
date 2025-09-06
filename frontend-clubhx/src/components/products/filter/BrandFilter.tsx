
import { memo } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
const productBrands: string[] = [
  "Schwarzkopf Professional",
  "IGORA",
  "BLONDME",
  "Bonacure (BC)",
  "OSiS+"
];

interface BrandFilterProps {
  selectedBrands: string[];
  onChange: (brand: string, checked: boolean) => void;
}

const BrandFilter = memo(({ selectedBrands, onChange }: BrandFilterProps) => {
  return (
    <AccordionItem value="brand" className="border-b">
      <AccordionTrigger className="py-3 hover:no-underline">
        <span className="flex items-center gap-2 text-sm">
          🛍️ Marcas
          {selectedBrands.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-[1.25rem] flex items-center justify-center">
              {selectedBrands.length}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-2">
          {productBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox 
                id={`brand-${brand}`} 
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => 
                  onChange(brand, checked === true)
                }
              />
              <Label 
                htmlFor={`brand-${brand}`}
                className="text-sm flex-1 cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

BrandFilter.displayName = "BrandFilter";
export default BrandFilter;
