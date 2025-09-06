
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";

interface CustomerSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const CustomerSearch: React.FC<CustomerSearchProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="md:w-80"
        />
        <Button variant="outline" size="icon" onClick={onSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
