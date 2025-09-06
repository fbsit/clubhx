
import { memo, useCallback } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
const productCategories: string[] = ["Color", "Care", "Styling", "Technical", "Accessories"];

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (category: string, checked: boolean) => void;
}

const CategoryFilter = memo(({ selectedCategories, onChange }: CategoryFilterProps) => {
  return (
    <AccordionItem value="category" className="border-b">
      <AccordionTrigger className="py-3 hover:no-underline">
        <span className="flex items-center gap-2 text-sm">
          🧴 Categorías
          {selectedCategories.length > 0 && (
            <Badge variant="secondary" className="h-5 min-w-[1.25rem] flex items-center justify-center">
              {selectedCategories.length}
            </Badge>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-2">
          {productCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category}`} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => 
                  onChange(category, checked === true)
                }
              />
              <Label 
                htmlFor={`category-${category}`}
                className="text-sm flex-1 cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

CategoryFilter.displayName = "CategoryFilter";
export default CategoryFilter;
