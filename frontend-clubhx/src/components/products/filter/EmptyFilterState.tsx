
import { memo } from "react";
import { Package } from "lucide-react";

const EmptyFilterState = memo(() => {
  return (
    <div className="flex flex-col items-center mt-6 text-center text-muted-foreground p-4">
      <Package className="h-10 w-10 mb-2 opacity-20" />
      <p className="text-sm">
        Usa los filtros para encontrar productos específicos
      </p>
    </div>
  );
});

EmptyFilterState.displayName = "EmptyFilterState";
export default EmptyFilterState;
