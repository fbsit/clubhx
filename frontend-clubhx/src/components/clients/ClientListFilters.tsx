
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ClientListFiltersProps = {
  onSearch: (query: string) => void;
  filters: { estado?: string; ciudad?: string; vendedor?: string };
  onChangeFilter: (name: string, value: string) => void;
  showAddClient?: boolean;
  onAddClient?: () => void;
};

export const ClientListFilters: React.FC<ClientListFiltersProps> = ({
  onSearch,
  filters,
  onChangeFilter,
  showAddClient = false,
  onAddClient
}) => {
  const [query, setQuery] = React.useState("");

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-white shadow-sm border mb-4 animate-fade-in"
      style={{ minHeight: 70 }}
    >
      <Input
        placeholder="Buscar clientes…"
        value={query}
        onChange={handleInput}
        className="w-60 md:w-80 rounded-lg"
      />

      {/* Filtros (pueden ser <select> o más avanzados según necesidad) */}
      <select
        className="bg-muted px-3 py-2 rounded-lg text-sm focus:outline-none"
        value={filters.estado || ""}
        onChange={e => onChangeFilter("estado", e.target.value)}
      >
        <option value="">Todos los estados</option>
        <option value="active">Activo</option>
        <option value="inactive">Inactivo</option>
        <option value="pending">Pendiente</option>
      </select>

      <select
        className="bg-muted px-3 py-2 rounded-lg text-sm focus:outline-none"
        value={filters.ciudad || ""}
        onChange={e => onChangeFilter("ciudad", e.target.value)}
      >
        <option value="">Todas las ciudades</option>
        <option value="Santiago">Santiago</option>
        <option value="Viña del Mar">Viña del Mar</option>
        <option value="Concepción">Concepción</option>
        <option value="Valparaíso">Valparaíso</option>
        <option value="Antofagasta">Antofagasta</option>
        <option value="Iquique">Iquique</option>
        <option value="Rancagua">Rancagua</option>
      </select>

      <select
        className="bg-muted px-3 py-2 rounded-lg text-sm focus:outline-none"
        value={filters.vendedor || ""}
        onChange={e => onChangeFilter("vendedor", e.target.value)}
      >
        <option value="">Todos los vendedores</option>
        <option value="user-1">Vendedor 1</option>
        <option value="user-2">Vendedor 2</option>
        {/* ...real data vendrá luego */}
      </select>
      <Button type="submit" variant="outline">Buscar</Button>
      {showAddClient && (
        <Button type="button" className="ml-auto" onClick={onAddClient}>
          + Nuevo Cliente
        </Button>
      )}
    </form>
  );
};
