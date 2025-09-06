
import React from "react";
import { FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function EmptyOrdersState() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center bg-slate-50/50 dark:bg-slate-900/20 rounded-lg backdrop-blur-sm animate-fade-in">
      <div className="bg-muted/20 p-4 sm:p-6 rounded-full mb-4 shadow-inner">
        <FileText className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-muted-foreground`} />
      </div>
      <h3 className="text-lg font-medium mb-2">No se encontraron pedidos</h3>
      <p className="text-muted-foreground max-w-md">
        No hay pedidos que coincidan con tu búsqueda o filtros. Intenta con otros criterios.
      </p>
    </div>
  );
}
