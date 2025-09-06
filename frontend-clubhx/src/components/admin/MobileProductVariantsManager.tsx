import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { ProductVariant, ProductAttribute } from "@/types/product";

interface MobileProductVariantsManagerProps {
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  onAttributesChange: (attributes: ProductAttribute[]) => void;
  basePrice: number;
}

export default function MobileProductVariantsManager({
  variants,
  attributes,
  onVariantsChange,
  onAttributesChange,
  basePrice
}: MobileProductVariantsManagerProps) {
  const [newAttribute, setNewAttribute] = useState({ name: "", values: "" });
  const [newVariant, setNewVariant] = useState({ 
    price: basePrice, 
    stock: 0, 
    attributes: {} as Record<string, string>
  });
  const [showAttributeDialog, setShowAttributeDialog] = useState(false);
  const [showVariantDialog, setShowVariantDialog] = useState(false);

  const handleAddAttribute = () => {
    if (!newAttribute.name || !newAttribute.values) return;
    
    const attribute: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: newAttribute.name,
      values: newAttribute.values.split(',').map(v => v.trim()).filter(v => v)
    };
    
    onAttributesChange([...attributes, attribute]);
    setNewAttribute({ name: "", values: "" });
    setShowAttributeDialog(false);
  };

  const handleRemoveAttribute = (attributeId: string) => {
    onAttributesChange(attributes.filter(attr => attr.id !== attributeId));
    // Also remove this attribute from all variants
    const updatedVariants = variants.map(variant => {
      const newAttributes = { ...variant.attributes };
      delete newAttributes[attributeId];
      return { ...variant, attributes: newAttributes };
    });
    onVariantsChange(updatedVariants);
  };

  const handleAddVariant = () => {
    if (Object.keys(newVariant.attributes).length === 0) return;
    
    // Generate variant name from attributes
    const variantName = Object.values(newVariant.attributes).join(' - ');
    
    const variant: ProductVariant = {
      id: `var-${Date.now()}`,
      price: newVariant.price,
      stock: newVariant.stock,
      sku: `${variantName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      attributes: { ...newVariant.attributes },
      loyaltyPoints: Math.floor(newVariant.price / 1800),
      isAvailable: newVariant.stock > 0
    };
    
    onVariantsChange([...variants, variant]);
    setNewVariant({ 
      price: basePrice, 
      stock: 0, 
      attributes: {} 
    });
    setShowVariantDialog(false);
  };

  const handleRemoveVariant = (variantId: string) => {
    onVariantsChange(variants.filter(variant => variant.id !== variantId));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Variantes del producto</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {variants.length} variante{variants.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Atributos Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Atributos</Label>
            <Dialog open={showAttributeDialog} onOpenChange={setShowAttributeDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Atributo
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Nuevo Atributo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="attr-name">Nombre del atributo</Label>
                    <Input
                      id="attr-name"
                      placeholder="Ej: Color, Talla, Tamaño"
                      value={newAttribute.name}
                      onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="attr-values">Valores (separados por comas)</Label>
                    <Input
                      id="attr-values"
                      placeholder="Ej: Rojo, Azul, Verde"
                      value={newAttribute.values}
                      onChange={(e) => setNewAttribute({...newAttribute, values: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAttribute} className="flex-1">
                      Agregar
                    </Button>
                    <Button variant="outline" onClick={() => setShowAttributeDialog(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {attributes.length > 0 ? (
            <div className="space-y-2">
              {attributes.map(attribute => (
                <div key={attribute.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">{attribute.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {attribute.values.join(', ')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAttribute(attribute.id)}
                    className="h-8 w-8 p-0 text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No hay atributos definidos. Crea algunos para generar variantes.
            </div>
          )}
        </div>

        {/* Variantes Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Variantes</Label>
            <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={attributes.length === 0}>
                  <Plus className="h-4 w-4 mr-1" />
                  Variante
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Nueva Variante</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  
                  {attributes.map(attribute => (
                    <div key={attribute.id}>
                      <Label>{attribute.name}</Label>
                      <Select 
                        value={newVariant.attributes[attribute.id] || ""} 
                        onValueChange={(value) => setNewVariant({
                          ...newVariant, 
                          attributes: {...newVariant.attributes, [attribute.id]: value}
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Seleccionar ${attribute.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {attribute.values.map(value => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="var-price">Precio</Label>
                      <Input
                        id="var-price"
                        type="number"
                        value={newVariant.price}
                        onChange={(e) => setNewVariant({...newVariant, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="var-stock">Stock</Label>
                      <Input
                        id="var-stock"
                        type="number"
                        value={newVariant.stock}
                        onChange={(e) => setNewVariant({...newVariant, stock: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddVariant} className="flex-1">
                      Agregar
                    </Button>
                    <Button variant="outline" onClick={() => setShowVariantDialog(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {variants.length > 0 ? (
            <div className="space-y-2">
              {variants.map(variant => {
                // Generate display name from attributes
                const displayName = Object.values(variant.attributes).join(' - ') || 'Variante sin nombre';
                
                return (
                  <div key={variant.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm">{displayName}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(variant.price)} • Stock: {variant.stock}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveVariant(variant.id)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              {attributes.length === 0 
                ? "Crea atributos primero para poder generar variantes."
                : "No hay variantes creadas. Agrega algunas combinaciones."
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}