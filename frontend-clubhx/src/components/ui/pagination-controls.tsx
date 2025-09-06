
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PaginationState, PaginationActions } from "@/hooks/usePagination";

interface PaginationControlsProps {
  state: PaginationState;
  actions: PaginationActions;
  showLoadMore?: boolean;
  className?: string;
}

export function PaginationControls({ 
  state, 
  actions, 
  showLoadMore = false, 
  className = "" 
}: PaginationControlsProps) {
  if (showLoadMore) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <div className="text-sm text-muted-foreground">
          Mostrando {state.displayedItems} de {state.totalItems} pedidos
        </div>
        {state.hasNextPage && (
          <Button 
            onClick={actions.loadMore}
            variant="outline"
            className="w-full max-w-xs"
          >
            Cargar más pedidos
          </Button>
        )}
      </div>
    );
  }

  // Traditional pagination
  const getVisiblePages = () => {
    const pages = [];
    const totalPages = state.totalPages;
    const current = state.currentPage;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, current - 1, current, current + 1, -1, totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="text-sm text-muted-foreground">
        Mostrando {state.startIndex + 1}-{state.endIndex} de {state.totalItems} pedidos
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={actions.previousPage}
          disabled={!state.hasPreviousPage}
          className="px-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </Button>
        
        {visiblePages.map((page, index) => {
          if (page === -1) {
            return (
              <div key={`ellipsis-${index}`} className="px-2">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          }
          
          return (
            <Button
              key={page}
              variant={page === state.currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => actions.goToPage(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={actions.nextPage}
          disabled={!state.hasNextPage}
          className="px-3"
        >
          <span className="hidden sm:inline mr-1">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
