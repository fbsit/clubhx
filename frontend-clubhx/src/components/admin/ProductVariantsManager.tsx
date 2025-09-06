import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, X, Edit2, Trash2, Image, 
  Copy, Package, Settings, ChevronRight,
  Check
} from "lucide-react";
import { ProductVariant, ProductAttribute, calculateLoyaltyPoints } from "@/types/product";
import { toast } from "sonner";
import OptimizedImage from "@/components/ui/optimized-image";
import ImageUploader from "@/components/admin/ImageUploader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductVariantsManagerProps {
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  onAttributesChange: (attributes: ProductAttribute[]) => void;
  basePrice: number;
}

export default function ProductVariantsManager({ 
  variants, 
  attributes,
  onVariantsChange, 
  onAttributesChange,
  basePrice 
}: ProductVariantsManagerProps) {
  const [currentStep, setCurrentStep] = useState<'attributes' | 'variants'>('attributes');
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProductVariant>>({});
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentEditingImageVariantId, setCurrentEditingImageVariantId] = useState<string | null>(null);
  
  // Attribute management
  const [newAttribute, setNewAttribute] = useState({ name: "", values: [""] });

  const generateSKU = (attributes: { [key: string]: string }) => {
    const parts = Object.entries(attributes).map(([key, value]) => 
      `${key.substring(0, 2).toUpperCase()}-${value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()}`
    );
    return `VAR-${parts.join('-')}`;
  };

  const generateAllCombinations = () => {
    if (attributes.length === 0) {
      toast.error("Primero debes agregar atributos");
      return;
    }

    const combinations: { [key: string]: string }[] = [];
    
    const generate = (currentCombination: { [key: string]: string }, remainingAttributes: ProductAttribute[]) => {
      if (remainingAttributes.length === 0) {
        combinations.push({ ...currentCombination });
        return;
      }
      
      const [firstAttr, ...restAttrs] = remainingAttributes;
      firstAttr.values.forEach(value => {
        generate({ ...currentCombination, [firstAttr.name]: value }, restAttrs);
      });
    };

    generate({}, attributes);

    const newVariants = combinations.map(attrs => ({
      id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      attributes: attrs,
      price: basePrice,
      stock: 0,
      sku: generateSKU(attrs),
      loyaltyPoints: calculateLoyaltyPoints(basePrice),
      isAvailable: true
    }));

    onVariantsChange([...variants, ...newVariants]);
    setCurrentStep('variants');
    toast.success(`Se generaron ${combinations.length} variantes`);
  };

  const handleAddAttribute = () => {
    if (!newAttribute.name.trim()) {
      toast.error("El nombre del atributo es requerido");
      return;
    }
    
    const validValues = newAttribute.values.filter(v => v.trim());
    if (validValues.length === 0) {
      toast.error("Debe agregar al menos un valor");
      return;
    }

    const attribute: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: newAttribute.name.trim(),
      values: validValues
    };

    onAttributesChange([...attributes, attribute]);
    setNewAttribute({ name: "", values: [""] });
    toast.success("Atributo agregado");
  };

  const handleDeleteAttribute = (attributeId: string) => {
    onAttributesChange(attributes.filter(attr => attr.id !== attributeId));
    // También eliminar variantes que usen este atributo
    const attributeToDelete = attributes.find(attr => attr.id === attributeId);
    if (attributeToDelete) {
      const filteredVariants = variants.filter(variant => 
        !variant.attributes.hasOwnProperty(attributeToDelete.name)
      );
      onVariantsChange(filteredVariants);
    }
    toast.success("Atributo eliminado");
  };

  const handleVariantUpdate = (variantId: string, field: keyof ProductVariant, value: any) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        const updated = { ...variant, [field]: value };
        // Auto-calculate loyalty points when price changes
        if (field === 'price') {
          updated.loyaltyPoints = calculateLoyaltyPoints(value);
        }
        return updated;
      }
      return variant;
    });
    
    onVariantsChange(updatedVariants);
  };

  const handleVariantDelete = (variantId: string) => {
    onVariantsChange(variants.filter(variant => variant.id !== variantId));
    toast.success("Variante eliminada");
  };

  const handleImageSelected = (imageUrl: string) => {
    if (currentEditingImageVariantId) {
      handleVariantUpdate(currentEditingImageVariantId, 'image', imageUrl);
    }
    setImageDialogOpen(false);
    setCurrentEditingImageVariantId(null);
  };

  const openImageDialog = (variantId: string) => {
    setCurrentEditingImageVariantId(variantId);
    setImageDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("SKU copiado al portapapeles");
  };

  const formatAttributesCombination = (attrs: { [key: string]: string }) => {
    return Object.entries(attrs).map(([key, value]) => `${key}: ${value}`).join(' • ');
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Variantes del Producto
            </CardTitle>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant={currentStep === 'attributes' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep('attributes')}
              >
                1. Atributos
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Button
                variant={currentStep === 'variants' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep('variants')}
                disabled={variants.length === 0}
              >
                2. Variantes
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStep === 'attributes' 
              ? 'Define los atributos del producto (Color, Tamaño, etc.)'
              : `Edita precios, SKUs e imágenes para cada variante. Precio base: $${basePrice.toLocaleString()}`
            }
          </p>
        </CardHeader>
        <CardContent>
          {currentStep === 'attributes' ? (
            <div className="space-y-6">
              {/* Existing Attributes */}
              {attributes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Atributos Definidos</h3>
                  {attributes.map((attribute) => (
                    <Card key={attribute.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{attribute.name}</h4>
                            <Badge variant="secondary">
                              {attribute.values.length} valores
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAttribute(attribute.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {attribute.values.map((value, index) => (
                            <Badge key={index} variant="outline">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Add New Attribute */}
              <Card className="border-dashed border-2">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Agregar Nuevo Atributo</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="attr-name">Nombre del Atributo</Label>
                      <Input
                        id="attr-name"
                        placeholder="ej: Color, Tamaño, Material"
                        value={newAttribute.name}
                        onChange={(e) => setNewAttribute({...newAttribute, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label>Valores del Atributo</Label>
                      <div className="space-y-2">
                        {newAttribute.values.map((value, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="ej: Rojo, 250ml, Algodón"
                              value={value}
                              onChange={(e) => {
                                const newValues = [...newAttribute.values];
                                newValues[index] = e.target.value;
                                setNewAttribute({...newAttribute, values: newValues});
                              }}
                            />
                            {newAttribute.values.length > 1 && (
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  const newValues = newAttribute.values.filter((_, i) => i !== index);
                                  setNewAttribute({...newAttribute, values: newValues});
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewAttribute({
                            ...newAttribute, 
                            values: [...newAttribute.values, ""]
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Valor
                        </Button>
                      </div>
                    </div>
                    
                    <Button onClick={handleAddAttribute}>
                      Agregar Atributo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Variants Button */}
              {attributes.length > 0 && (
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Button onClick={generateAllCombinations} size="lg">
                    <Package className="h-4 w-4 mr-2" />
                    Generar Variantes
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Se crearán variantes para todas las combinaciones posibles ({attributes.reduce((acc, attr) => acc * attr.values.length, 1)} combinaciones)
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {variants.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Imagen</TableHead>
                        <TableHead>Combinación</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Puntos</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-16"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell>
                            <div className="w-10 h-10 border rounded overflow-hidden bg-gray-50">
                              {variant.image ? (
                                <OptimizedImage
                                  src={variant.image}
                                  alt="Variante"
                                  className="w-full h-full cursor-pointer"
                                  aspectRatio="square"
                                  onClick={() => openImageDialog(variant.id)}
                                />
                              ) : (
                                <button
                                  onClick={() => openImageDialog(variant.id)}
                                  className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Image className="h-4 w-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {formatAttributesCombination(variant.attributes)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={variant.price}
                              onChange={(e) => handleVariantUpdate(variant.id, 'price', Number(e.target.value))}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                value={variant.sku}
                                onChange={(e) => handleVariantUpdate(variant.id, 'sku', e.target.value)}
                                className="w-32"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(variant.sku)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={variant.stock}
                              onChange={(e) => handleVariantUpdate(variant.id, 'stock', Number(e.target.value))}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-blue-600">{variant.loyaltyPoints}</span>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={variant.isAvailable}
                              onCheckedChange={(checked) => handleVariantUpdate(variant.id, 'isAvailable', checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleVariantDelete(variant.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">No hay variantes</h3>
                  <p className="text-sm mb-4">Regresa al paso anterior para agregar atributos y generar variantes</p>
                  <Button variant="outline" onClick={() => setCurrentStep('attributes')}>
                    Agregar Atributos
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Selection Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seleccionar imagen para la variante</DialogTitle>
          </DialogHeader>
          <ImageUploader 
            onImageSelected={handleImageSelected}
            currentImage={
              currentEditingImageVariantId 
                ? variants.find(v => v.id === currentEditingImageVariantId)?.image
                : undefined
            }
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
