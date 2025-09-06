
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventsSearchFilterProps {
  onSearchChange: (search: string) => void;
  onBrandFilter: (brand: string | null) => void;
  onStatusFilter: (status: string | null) => void;
  onEventTypeFilter: (eventType: string | null) => void;
  selectedBrand: string | null;
  selectedStatus: string | null;
  selectedEventType: string | null;
  searchValue: string;
  availableBrands: string[];
}

export default function EventsSearchFilter({
  onSearchChange,
  onBrandFilter,
  onStatusFilter,
  onEventTypeFilter,
  selectedBrand,
  selectedStatus,
  selectedEventType,
  searchValue,
  availableBrands
}: EventsSearchFilterProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  const clearFilters = () => {
    onSearchChange("");
    onBrandFilter(null);
    onStatusFilter(null);
    onEventTypeFilter(null);
  };

  const hasActiveFilters = searchValue || selectedBrand || selectedStatus || selectedEventType;
  const activeFiltersCount = [selectedBrand, selectedStatus, selectedEventType].filter(Boolean).length + (searchValue ? 1 : 0);

  if (isMobile) {
    return (
      <div className="space-y-3">
        {/* Barra de búsqueda móvil */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Filtros colapsables para móvil */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-11"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-3 mt-3">
            {/* Filtros en grid móvil */}
            <div className="grid grid-cols-1 gap-3">
              <Select value={selectedBrand || "all"} onValueChange={(value) => onBrandFilter(value === "all" ? null : value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedStatus || "all"} onValueChange={(value) => onStatusFilter(value === "all" ? null : value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="past">Finalizados</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedEventType || "all"} onValueChange={(value) => onEventTypeFilter(value === "all" ? null : value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="presencial">Presencial</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="h-11">
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Filtros activos móvil */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchValue && (
              <Badge variant="secondary" className="text-xs">
                "{searchValue}"
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onSearchChange("")}
                />
              </Badge>
            )}
            {selectedBrand && (
              <Badge variant="secondary" className="text-xs">
                {selectedBrand}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onBrandFilter(null)}
                />
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="secondary" className="text-xs">
                {selectedStatus === "active" ? "Activos" : "Finalizados"}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onStatusFilter(null)}
                />
              </Badge>
            )}
            {selectedEventType && (
              <Badge variant="secondary" className="text-xs">
                {selectedEventType === "online" ? "Online" : "Presencial"}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => onEventTypeFilter(null)}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  // Layout desktop (código existente)
  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar eventos por título, descripción o ubicación..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>

        {/* Filtro por marca */}
        <Select value={selectedBrand || "all"} onValueChange={(value) => onBrandFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {availableBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por estado */}
        <Select value={selectedStatus || "all"} onValueChange={(value) => onStatusFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="past">Finalizados</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por tipo de evento */}
        <Select value={selectedEventType || "all"} onValueChange={(value) => onEventTypeFilter(value === "all" ? null : value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="presencial">Presencial</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchValue && (
            <Badge variant="secondary">
              Búsqueda: "{searchValue}"
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onSearchChange("")}
              />
            </Badge>
          )}
          {selectedBrand && (
            <Badge variant="secondary">
              Marca: {selectedBrand}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onBrandFilter(null)}
              />
            </Badge>
          )}
          {selectedStatus && (
            <Badge variant="secondary">
              Estado: {selectedStatus === "active" ? "Activos" : "Finalizados"}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onStatusFilter(null)}
              />
            </Badge>
          )}
          {selectedEventType && (
            <Badge variant="secondary">
              Tipo: {selectedEventType === "online" ? "Online" : "Presencial"}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onEventTypeFilter(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
