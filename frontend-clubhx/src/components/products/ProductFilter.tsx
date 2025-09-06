
import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterOptions } from "@/services/productService";
import FilterContent from "./filter/FilterContent";

interface FilterProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  className?: string;
}

const ProductFilter = (props: FilterProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={true} modal={false}>
        <SheetContent 
          side="left" 
          className="w-full max-w-xs p-0 border-r shadow-lg"
          // Remove the default close button
          closeButton={false}
        >
          <FilterContent {...props} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="shadow-sm animate-fade-in">
      <FilterContent {...props} />
    </Card>
  );
};

export default memo(ProductFilter);
