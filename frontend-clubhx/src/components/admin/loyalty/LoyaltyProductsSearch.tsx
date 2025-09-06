
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface LoyaltyProductsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddProduct: () => void;
}

export const LoyaltyProductsSearch: React.FC<LoyaltyProductsSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onAddProduct
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-80"
        />
        <Button variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>
    </div>
  );
};

export default LoyaltyProductsSearch;
