
import { useState, useEffect } from "react";
import { useQuotation } from "@/contexts/QuotationContext";
import { listOrders } from "@/services/ordersApi";
import { fetchProducts } from "@/services/productsApi";
import { RotateCcw, Edit, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Order } from "@/types/order";

interface EditableOrderItem {
  name: string;
  originalQuantity: number;
  newQuantity: number;
  price: number;
}

export default function HistoryPurchaseFlow() {
  const { addItem } = useQuotation();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [editableItems, setEditableItems] = useState<EditableOrderItem[]>([]);

  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // Load orders and products
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          listOrders({ limit: 200 }),
          fetchProducts(500),
        ]);
        if (!cancelled) {
          const orders = (ordersRes.results || []).filter((o: any) => o.status === "completed" || o.status === "delivered");
          setCompletedOrders(orders as any);
          setAllProducts(productsRes);
        }
      } catch {
        if (!cancelled) {
          setCompletedOrders([]);
          setAllProducts([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleQuickReorder = (order: Order) => {
    let addedCount = 0;
    
    (order.items ?? []).forEach(item => {
      // Find the product in our catalog
      const product = allProducts.find((p: any) => 
        p.name.toLowerCase().includes(item.name.toLowerCase()) ||
        item.name.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (product) {
        addItem(product, item.quantity);
        addedCount++;
      }
    });

    toast.success("Pedido agregado", {
      description: `${addedCount} productos agregados a tu cotización`
    });
  };

  const handleEditOrder = (order: Order) => {
    const items: EditableOrderItem[] = (order.items ?? []).map(item => ({
      name: item.name,
      originalQuantity: item.quantity,
      newQuantity: item.quantity,
      price: item.price
    }));
    
    setEditableItems(items);
    setEditingOrder(order.id);
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    const updatedItems = [...editableItems];
    updatedItems[index].newQuantity = Math.max(0, newQuantity);
    setEditableItems(updatedItems);
  };

  const handleConfirmEditedOrder = () => {
    let addedCount = 0;
    
    editableItems.forEach(item => {
      if (item.newQuantity > 0) {
        // Find the product in our catalog
        const product = allProducts.find((p: any) => 
          p.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(p.name.toLowerCase())
        );
        
        if (product) {
          addItem(product, item.newQuantity);
          addedCount++;
        }
      }
    });

    toast.success("Pedido editado agregado", {
      description: `${addedCount} productos agregados a tu cotización`
    });
    
    setEditingOrder(null);
    setEditableItems([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-sm border border-border/40 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Historial de Pedidos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Repite pedidos anteriores con un solo clic o edítalos antes de agregar
          </p>
        </CardHeader>
      </Card>

      {completedOrders.length === 0 ? (
        <Card className="shadow-sm border border-border/40 rounded-xl">
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay pedidos completados</h3>
            <p className="text-muted-foreground">
              Una vez que tengas pedidos completados, podrás repetirlos desde aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedOrders.map((order) => (
            <Card key={order.id} className="shadow-sm border border-border/40 rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.date)} • {order.customer || ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-2">
                      {order.status === "completed" ? "Completado" : "Entregado"}
                    </Badge>
                    <p className="font-semibold">{formatPrice(order.total ?? 0)}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {editingOrder === order.id ? (
                  // Edit mode
                  <div className="space-y-4">
                    <h4 className="font-medium">Editar cantidades:</h4>
                    {editableItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad original: {item.originalQuantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-muted-foreground">Nueva:</label>
                          <Input
                            type="number"
                            min="0"
                            value={item.newQuantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleConfirmEditedOrder} className="flex-1">
                        Agregar a Cotización
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setEditingOrder(null)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {(order.items ?? []).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>{item.quantity}x {formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleQuickReorder(order)}
                        className="flex-1"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Volver a Pedir
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleEditOrder(order)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar y Pedir
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
