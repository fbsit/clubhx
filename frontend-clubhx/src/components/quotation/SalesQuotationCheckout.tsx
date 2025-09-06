import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, FileText, Send, Save, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import CartItem from "./cart/CartItem";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SalesQuotationCheckout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    selectedCustomer, 
    items, 
    itemsCount, 
    totalAmount, 
    createQuotation, 
    saveAsDraft, 
    sendToCustomer,
    clearItems,
    setSelectedCustomer,
    editingOrder,
    updateOrder,
    cancelOrderEditing
  } = useSalesQuotation();

  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if no customer selected or no items
  if (!selectedCustomer || itemsCount === 0) {
    navigate("/main/products");
    return null;
  }

  const handleSaveAsDraft = async () => {
    setIsLoading(true);
    try {
      saveAsDraft(notes);
      toast.success("Cotización guardada como borrador");
      // Navigate to orders page with drafts filter
      navigate("/main/orders?view=drafts");
    } catch (error) {
      toast.error("Error al guardar la cotización");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToCustomer = async () => {
    setIsLoading(true);
    try {
      const quotationId = createQuotation(notes);
      if (quotationId) {
        sendToCustomer(quotationId);
        toast.success("Cotización enviada al cliente");
        clearItems();
        navigate("/main/orders");
      }
    } catch (error) {
      toast.error("Error al enviar la cotización");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
      if (editingOrder) {
        // Update existing order
        updateOrder(editingOrder.id, notes);
        toast.success("Pedido actualizado exitosamente", {
          description: `Pedido ${editingOrder.id} actualizado para ${selectedCustomer?.name}`,
        });
      } else {
        // Create new order
        const orderId = `ORD${Date.now()}`;
        toast.success("Pedido creado exitosamente", {
          description: `Pedido ${orderId} para ${selectedCustomer?.name}`,
        });
      }
      navigate("/main/orders");
    } catch (error) {
      toast.error(editingOrder ? "Error al actualizar el pedido" : "Error al crear el pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEditing = () => {
    cancelOrderEditing();
    navigate("/main/orders");
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/main/products")}
          className="w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Productos
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {editingOrder ? `Editar Pedido ${editingOrder.id}` : "Finalizar Cotización"}
          </h1>
          <p className="text-muted-foreground">
            {editingOrder 
              ? "Modifica los productos y cantidades del pedido" 
              : "Revisa y confirma la cotización para tu cliente"
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedCustomer.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedCustomer.contact}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Gastado</p>
                  <p className="font-medium">${selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pedidos</p>
                  <p className="font-medium">{selectedCustomer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Puntos</p>
                  <p className="font-medium">{selectedCustomer.loyaltyPoints.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <Badge variant={selectedCustomer.status === "active" ? "default" : "secondary"}>
                    {selectedCustomer.status === "active" ? "Activo" : "Prospecto"}
                  </Badge>
                </div>
              </div>

              {selectedCustomer.collections?.paymentStatus !== "current" && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    ⚠️ Cliente con pagos pendientes
                  </p>
                  <p className="text-xs text-yellow-700">
                    ${selectedCustomer.collections?.pendingAmount?.toLocaleString()} pendientes
                  </p>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas para el cliente</Label>
                <Textarea
                  id="notes"
                  placeholder="Agrega comentarios o instrucciones especiales..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products & Summary */}
        <div className="md:col-span-2 space-y-6">
          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Productos ({itemsCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[400px] pr-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Summary & Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${totalAmount.toLocaleString()}</span>
              </div>
              
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {editingOrder ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={handleCancelEditing}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Cancelar Edición
                    </Button>
                    
                    <div className="md:col-span-2">
                      <Button 
                        variant="default"
                        onClick={handleCreateOrder}
                        disabled={isLoading}
                        className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Actualizar Pedido
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={handleSaveAsDraft}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Guardar Borrador
                    </Button>
                    
                    <Button 
                      onClick={handleSendToCustomer}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Enviar Cotización
                    </Button>
                    
                    <Button 
                      variant="default"
                      onClick={handleCreateOrder}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Crear Pedido
                    </Button>
                  </>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                {editingOrder ? (
                  <>
                    <p><strong>Cancelar Edición:</strong> Descarta los cambios y vuelve a la lista de pedidos</p>
                    <p><strong>Actualizar Pedido:</strong> Guarda los cambios realizados al pedido del cliente</p>
                  </>
                ) : (
                  <>
                    <p><strong>Guardar Borrador:</strong> Guarda la cotización para revisar más tarde</p>
                    <p><strong>Enviar Cotización:</strong> Envía la cotización al cliente para aprobación</p>
                    <p><strong>Crear Pedido:</strong> Genera el pedido directamente (para ventas presenciales)</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}