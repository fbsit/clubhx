
import { Search, Filter, FilterX, Grid, List, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface ProductsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  filtersVisible: boolean;
  toggleFilters: () => void;
  activeFilterCount: number;
}

const ProductsHeader = ({
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  viewMode,
  setViewMode,
  filtersVisible,
  toggleFilters,
  activeFilterCount
}: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 mb-6 animate-fade-in">
      {/* Search input with refined styling */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 sm:h-10 rounded-xl bg-background border-muted transition-all focus-visible:ring-1 focus-visible:ring-primary/30 shadow-sm"
        />
      </div>
      
      <div className="flex items-center gap-2.5">
        {/* Filter toggle button with refined styling */}
        <Button 
          variant={filtersVisible ? "default" : "outline"} 
          onClick={toggleFilters} 
          size="icon"
          className={cn(
            "h-12 w-12 md:h-10 md:w-auto md:px-4 md:size-auto relative rounded-xl shadow-sm transition-all",
            filtersVisible ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/20"
          )}
          aria-label={filtersVisible ? "Ocultar filtros" : "Mostrar filtros"}
        >
          {filtersVisible ? (
            <FilterX className="h-5 w-5 md:mr-2 transition-transform duration-200" />
          ) : (
            <Filter className="h-5 w-5 md:mr-2 transition-transform duration-200" />
          )}
          
          <span className="hidden md:inline">
            Filtros
          </span>
          
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className={cn(
                "absolute -top-1.5 -right-1.5 min-w-[1.5rem] h-5 p-0 flex items-center justify-center",
                "md:static md:ml-2 md:-mr-1 md:top-auto md:right-auto"
              )}
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        <div className="flex items-center ml-auto gap-2.5">
          {/* View toggle with refined styling */}
          <ToggleGroup 
            type="single" 
            value={viewMode} 
            onValueChange={(val) => val && setViewMode(val as "grid" | "list")}
            className="bg-background rounded-xl border shadow-sm"
          >
            <ToggleGroupItem 
              value="grid" 
              aria-label="Grid view" 
              className="h-12 w-12 md:h-10 md:w-10 p-0 data-[state=on]:bg-muted/70 data-[state=on]:text-foreground rounded-l-xl transition-all duration-200"
            >
              <Grid className="h-5 w-5" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="list" 
              aria-label="List view" 
              className="h-12 w-12 md:h-10 md:w-10 p-0 data-[state=on]:bg-muted/70 data-[state=on]:text-foreground rounded-r-xl transition-all duration-200"
            >
              <List className="h-5 w-5" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          {/* Sorting dropdown with refined styling */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger 
              className="w-[140px] md:w-[180px] h-12 md:h-10 rounded-xl bg-background border-muted shadow-sm transition-all" 
              aria-label="Ordenar productos"
            >
              <div className="flex items-center">
                <span className="truncate">
                  {sortOrder === 'price-asc' && 'Precio: Menor'}
                  {sortOrder === 'price-desc' && 'Precio: Mayor'}
                  {sortOrder === 'name-asc' && 'Nombre: A-Z'}
                  {sortOrder === 'name-desc' && 'Nombre: Z-A'}
                  {!['price-asc', 'price-desc', 'name-asc', 'name-desc'].includes(sortOrder) && 'Ordenar por'}
                </span>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
              </div>
            </SelectTrigger>
            <SelectContent align="end" className="w-[180px] rounded-xl">
              <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
              <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
