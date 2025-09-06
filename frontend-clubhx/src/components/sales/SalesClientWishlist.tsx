import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { 
  Heart, 
  Search, 
  ShoppingCart, 
  Eye, 
  Calendar, 
  Package,
  Users,
  Bell,
  TrendingUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ProductPriceDisplay from "@/components/products/ProductPriceDisplay";

// Mock data for sales person's clients' wishlists
const mockSalesClientWishlists = [
  {
    clientId: "C001",
    clientName: "Salon Elegance",
    contact: "María González",
    totalItems: 8,
    totalValue: 145600,
    recentActivity: "2024-01-15T10:30:00Z",
    items: [
      {
        id: "w1",
        product: {
          id: "P001",
          name: "IGORA Royal Hair Color - Rubio Ceniza 9-1",
          brand: "IGORA",
          category: "Color",
          price: 12500,
          discount: 0,
          stock: 45,
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
        },
        dateAdded: "2024-01-15T10:30:00Z",
        notes: "Para cliente VIP"
      },
      {
        id: "w2",
        product: {
          id: "P002",
          name: "BLONDME Bond Enforcing Premium",
          brand: "BLONDME", 
          category: "Texturizing",
          price: 18900,
          discount: 10,
          stock: 12,
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
        },
        dateAdded: "2024-01-10T14:20:00Z"
      }
    ]
  },
  {
    clientId: "C002",
    clientName: "Hair Design Studio",
    contact: "Carlos Pérez",
    totalItems: 5,
    totalValue: 89300,
    recentActivity: "2024-01-12T16:45:00Z",
    items: [
      {
        id: "w3",
        product: {
          id: "P003",
          name: "BC Bonacure Repair Treatment",
          brand: "Bonacure",
          category: "Care",
          price: 15200,
          discount: 0,
          stock: 0,
          image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
        },
        dateAdded: "2024-01-05T09:15:00Z",
        notes: "Cliente esperando restock"
      }
    ]
  }
];

export default function SalesClientWishlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    let filtered = mockSalesClientWishlists;

    if (clientFilter !== "all") {
      filtered = filtered.filter(client => {
        if (clientFilter === "recent") {
          const daysDiff = Math.abs(new Date().getTime() - new Date(client.recentActivity).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }
        if (clientFilter === "high-value") {
          return client.totalValue > 100000;
        }
        return true;
      });
    }

    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        client.clientName.toLowerCase().includes(lowercaseQuery) ||
        client.contact.toLowerCase().includes(lowercaseQuery)
      );
    }

    return filtered;
  }, [searchQuery, clientFilter]);

  const selectedClientData = selectedClient 
    ? mockSalesClientWishlists.find(c => c.clientId === selectedClient)
    : null;

  const totalClientsWithWishlists = mockSalesClientWishlists.length;
  const totalWishlistValue = mockSalesClientWishlists.reduce((sum, client) => sum + client.totalValue, 0);
  const averageItemsPerClient = mockSalesClientWishlists.reduce((sum, client) => sum + client.totalItems, 0) / totalClientsWithWishlists;

  if (selectedClientData) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => setSelectedClient(null)}
          className="mb-4"
        >
          ← Volver a mis clientes
        </Button>

        {/* Client Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{selectedClientData.clientName}</h1>
                <p className="text-muted-foreground">{selectedClientData.contact}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Valor total wishlist</p>
                <p className="text-2xl font-bold text-green-600">
                  ${selectedClientData.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Wishlist Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lista de Deseos ({selectedClientData.totalItems} productos)</span>
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Crear Cotización Completa
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedClientData.items.map((item) => {
                const isOutOfStock = item.product.stock === 0;
                const isLowStock = item.product.stock > 0 && item.product.stock <= 10;
                const timeAgo = formatDistanceToNow(new Date(item.dateAdded), {
                  addSuffix: true,
                  locale: es
                });

                return (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 flex-shrink-0">
                      <OptimizedImage
                        src={item.product.image}
                        alt={item.product.name}
                        fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
                        aspectRatio="square"
                        objectFit="cover"
                        containerClassName="w-full h-full rounded-lg overflow-hidden bg-gray-100"
                        showSkeleton={true}
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{item.product.brand}</Badge>
                            <Badge variant="outline" className="text-xs">{item.product.category}</Badge>
                          </div>
                          <ProductPriceDisplay 
                            price={item.product.price}
                            discount={item.product.discount}
                            size="small"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Agregado {timeAgo}</p>
                          {item.notes && (
                            <p className="text-xs text-blue-600 mt-1 italic">"{item.notes}"</p>
                          )}
                        </div>
                        <div className="text-right">
                          {isOutOfStock ? (
                            <Badge variant="destructive" className="text-xs">Sin stock</Badge>
                          ) : isLowStock ? (
                            <Badge variant="outline" className="text-xs border-amber-500">
                              {item.product.stock} restantes
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              {item.product.stock} disponibles
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button size="sm" disabled={isOutOfStock}>
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Cotizar
                        </Button>
                        {isOutOfStock && (
                          <Button variant="outline" size="sm" className="text-blue-600">
                            <Bell className="h-3 w-3 mr-1" />
                            Notificar Stock
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          Listas de Deseos de Mis Clientes
        </h1>
        <p className="text-muted-foreground mt-1">
          Gestiona las listas de deseos de tus clientes asignados
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalClientsWithWishlists}</p>
                <p className="text-sm text-muted-foreground">Clientes con wishlist</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${totalWishlistValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Valor total potencial</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(averageItemsPerClient)}</p>
                <p className="text-sm text-muted-foreground">Promedio items/cliente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar clientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                <SelectItem value="recent">Actividad reciente</SelectItem>
                <SelectItem value="high-value">Alto valor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Clients List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => {
          const recentActivity = formatDistanceToNow(new Date(client.recentActivity), {
            addSuffix: true,
            locale: es
          });

          return (
            <Card key={client.clientId} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedClient(client.clientId)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {client.clientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{client.clientName}</h3>
                      <p className="text-sm text-muted-foreground">{client.contact}</p>
                      <p className="text-xs text-muted-foreground">
                        Última actividad {recentActivity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Productos</p>
                        <p className="text-lg font-bold">{client.totalItems}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="text-lg font-bold text-green-600">
                          ${client.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver Lista
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron clientes</h3>
            <p className="text-muted-foreground">
              Prueba ajustando los filtros de búsqueda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}