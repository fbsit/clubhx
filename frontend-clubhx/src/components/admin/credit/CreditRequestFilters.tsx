
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface CreditRequestFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  vendorFilter: string;
  onVendorFilterChange: (vendor: string) => void;
  onClearFilters: () => void;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export const CreditRequestFilters: React.FC<CreditRequestFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  vendorFilter,
  onVendorFilterChange,
  onClearFilters,
  pendingCount,
  approvedCount,
  rejectedCount,
}) => {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || vendorFilter !== 'all';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, ID o vendedor..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="pending">Pendientes ({pendingCount})</SelectItem>
                <SelectItem value="approved">Aprobadas ({approvedCount})</SelectItem>
                <SelectItem value="rejected">Rechazadas ({rejectedCount})</SelectItem>
              </SelectContent>
            </Select>
            <Select value={vendorFilter} onValueChange={onVendorFilterChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Vendedores</SelectItem>
                <SelectItem value="V001">Carlos Vendedor</SelectItem>
                <SelectItem value="V002">Ana García</SelectItem>
                <SelectItem value="V003">Luis Martínez</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters and Stats Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Pendientes: {pendingCount}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Aprobadas: {approvedCount}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Rechazadas: {rejectedCount}
              </Badge>
            </div>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
