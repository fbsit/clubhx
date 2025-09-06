
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { productTypes } from "@/data/productTypes";
import { calculateLoyaltyPoints } from "@/types/product";
import ImageUploader from "@/components/admin/ImageUploader";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  type: string;
  brand: string;
  image: string;
  isPopular: boolean;
  isNew: boolean;
  isVisible: boolean;
  discount: number;
  isOnSale: boolean;
  sku: string;
  loyaltyPoints: number;
}

interface ProductBasicInfoFormProps {
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
  onImageSelected: (imageUrl: string) => void;
}

export default function ProductBasicInfoForm({
  formData,
  onFormDataChange,
  onImageSelected
}: ProductBasicInfoFormProps) {
  const updateFormData = (updates: Partial<ProductFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className="space-y-6">
      {/* Product Image */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen del producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader 
            onImageSelected={onImageSelected}
            currentImage={formData.image}
          />
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del producto</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Precio base ($)</Label>
              <Input 
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  updateFormData({ 
                    price: newPrice,
                    loyaltyPoints: calculateLoyaltyPoints(newPrice)
                  });
                }}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input 
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => updateFormData({ stock: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input 
                id="sku"
                value={formData.sku}
                placeholder="Ej: SK-001"
                onChange={(e) => updateFormData({ sku: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="loyaltyPoints">
                Puntos de Fidelización
                <span className="text-xs text-muted-foreground ml-2">
                  (calculado automáticamente: 1 punto por cada $1,800)
                </span>
              </Label>
              <Input 
                id="loyaltyPoints"
                type="number"
                min="0"
                value={formData.loyaltyPoints}
                placeholder={`Auto: ${calculateLoyaltyPoints(formData.price)}`}
                onChange={(e) => updateFormData({ loyaltyPoints: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Select value={formData.brand} onValueChange={(value) => updateFormData({ brand: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Schwarzkopf Professional">Schwarzkopf Professional</SelectItem>
                  <SelectItem value="IGORA">IGORA</SelectItem>
                  <SelectItem value="BLONDME">BLONDME</SelectItem>
                  <SelectItem value="Bonacure (BC)">Bonacure (BC)</SelectItem>
                  <SelectItem value="OSiS+">OSiS+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Color">Color</SelectItem>
                  <SelectItem value="Care">Cuidado</SelectItem>
                  <SelectItem value="Styling">Peinado</SelectItem>
                  <SelectItem value="Technical">Técnico</SelectItem>
                  <SelectItem value="Accessories">Accesorios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo de producto</Label>
              <Select value={formData.type} onValueChange={(value) => updateFormData({ type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
