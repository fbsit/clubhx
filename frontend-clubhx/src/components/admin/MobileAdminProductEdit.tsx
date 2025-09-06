import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById, createProduct, updateProduct } from "@/services/productsApi";
import { ProductType, ProductVariant, ProductAttribute } from "@/types/product";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, Camera, Package, TrendingUp, DollarSign } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import MobileProductVariantsManager from "@/components/admin/MobileProductVariantsManager";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Percent, Star, Gift, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LoyaltyPromotion, LoyaltyBonus } from "@/types/product";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  image: string;
  isPopular: boolean;
  isNew: boolean;
  isVisible: boolean;
  discount: number;
  isOnSale: boolean;
  sku: string;
  loyaltyPoints: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  isScheduledPromotion?: boolean;
  loyaltyPointsMode?: 'automatic' | 'manual';
  loyaltyPointsRate?: number;
}

export default function MobileAdminProductEdit() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're creating a new product
  const isNewProduct = location.pathname.includes('/products/new') || productId === "new";
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
    image: "",
    isPopular: false,
    isNew: false,
    isVisible: true,
    discount: 0,
    isOnSale: false,
    sku: "",
    loyaltyPoints: 0,
  });

  // Product variants and attributes state
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([]);
  
  // Loyalty configuration state
  const [loyaltyPromotion, setLoyaltyPromotion] = useState<LoyaltyPromotion>({
    isActive: false,
    multiplier: 2
  });
  const [loyaltyBonus, setLoyaltyBonus] = useState<LoyaltyBonus>({
    firstPurchaseBonus: 0,
    volumeBonus: { minQuantity: 5, bonusPoints: 10 }
  });

  useEffect(() => {
    // Check if we're in "new product" mode
    if (isNewProduct) {
      setProduct({
        id: "new",
        name: "Nuevo Producto",
        description: "",
        price: 0,
        image: "",
        category: "",
        type: "",
        brand: "",
        stock: 0,
        isNew: true,
        isPopular: false,
        discount: 0,
        sku: "",
        loyaltyPoints: 0,
        variants: [],
        attributes: []
      } as ProductType);
      
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        brand: "",
        image: "",
        isPopular: false,
        isNew: true,
        isVisible: true,
        discount: 0,
        isOnSale: false,
        sku: "",
        loyaltyPoints: 0,
        loyaltyPointsMode: 'automatic',
        loyaltyPointsRate: 1800,
      });
      
      setProductVariants([]);
      setProductAttributes([]);
      setError(null);
      setLoading(false);
      return;
    }

    if (!productId) {
      setError("ID de producto no válido");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const foundProduct = await fetchProductById(productId);
        if (cancelled) return;
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          description: foundProduct.description || "",
          price: foundProduct.price,
          stock: foundProduct.stock,
          category: foundProduct.category,
          brand: foundProduct.brand,
          image: foundProduct.image,
          isPopular: foundProduct.isPopular || false,
          isNew: foundProduct.isNew || false,
          isVisible: true,
          discount: foundProduct.discount || 0,
          isOnSale: (foundProduct.discount || 0) > 0,
          sku: foundProduct.sku || "",
          loyaltyPoints: foundProduct.loyaltyPoints || 0,
          loyaltyPointsMode: 'automatic',
          loyaltyPointsRate: 1800,
        });
        setProductVariants((foundProduct as any).variants || []);
        setProductAttributes((foundProduct as any).attributes || []);
        setError(null);
      } catch (e) {
        if (!cancelled) setError("Producto no encontrado");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [productId, isNewProduct]);

  const handleSave = async () => {
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        category: formData.category,
        brand: formData.brand,
        image: formData.image,
        is_popular: formData.isPopular,
        is_new: formData.isNew,
        discount: formData.discount,
        sku: formData.sku,
        loyalty_points: formData.loyaltyPoints,
        variants: productVariants,
        attributes: productAttributes,
      };
      if (isNewProduct) {
        await createProduct(payload);
        toast.success("Producto creado correctamente");
      } else if (productId) {
        await updateProduct(productId, payload);
        toast.success("Producto actualizado correctamente");
      }
      navigate("/main/products");
    } catch (e) {
      toast.error("Error al guardar el producto");
    }
  };

  const handleBack = () => {
    navigate("/main/products");
  };

  const handlePreview = () => {
    navigate(`/main/admin/products/${productId}/preview`);
  };

  const updateFormData = (updates: Partial<ProductFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const handleVariantsChange = (newVariants: ProductVariant[]) => {
    setProductVariants(newVariants);
  };

  const handleAttributesChange = (newAttributes: ProductAttribute[]) => {
    setProductAttributes(newAttributes);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={handleBack} className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{isNewProduct ? "Nuevo Producto" : "Editar Producto"}</h1>
              <p className="text-xs text-muted-foreground">{isNewProduct ? "Creando nuevo producto" : `ID: ${productId}`}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!isNewProduct && (
              <Button variant="outline" size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4">
          <Card className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-xs text-muted-foreground">Stock</div>
              <div className="text-lg font-bold">{formData.stock}</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-xs text-muted-foreground">Precio</div>
              <div className="text-sm font-bold">{formatPrice(formData.price)}</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-1 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-xs text-muted-foreground">Estado</div>
              <div className="text-xs font-medium text-green-600">Activo</div>
            </div>
          </Card>
        </div>

        {/* Product Image */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Imagen del producto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="w-full h-48 bg-gray-50 rounded-lg overflow-hidden">
                <OptimizedImage
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                  aspectRatio="video"
                />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Cambiar imagen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Información básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm">Nombre del producto</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm">Descripción</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="price" className="text-sm">Precio ($)</Label>
                <Input 
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateFormData({ price: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="stock" className="text-sm">Stock</Label>
                <Input 
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => updateFormData({ stock: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="brand" className="text-sm">Marca</Label>
                <Select value={formData.brand} onValueChange={(value) => updateFormData({ brand: value })}>
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="category" className="text-sm">Categoría</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData({ category: value })}>
                  <SelectTrigger className="mt-1">
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sku" className="text-sm">SKU</Label>
                <Input 
                  id="sku"
                  value={formData.sku}
                  placeholder="Ej: SK-001"
                  onChange={(e) => updateFormData({ sku: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="loyaltyPoints" className="text-sm">Puntos Fidelización</Label>
                <Input 
                  id="loyaltyPoints"
                  type="number"
                  min="0"
                  value={formData.loyaltyPoints}
                  placeholder="50"
                  onChange={(e) => updateFormData({ loyaltyPoints: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Configuración del producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isVisible" className="text-sm font-medium">Visible en catálogo</Label>
                <p className="text-xs text-muted-foreground">Los clientes pueden ver este producto</p>
              </div>
              <Switch 
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => updateFormData({ isVisible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPopular" className="text-sm font-medium">Producto popular</Label>
                <p className="text-xs text-muted-foreground">Mostrar badge de "Popular"</p>
              </div>
              <Switch 
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => updateFormData({ isPopular: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isNew" className="text-sm font-medium">Producto nuevo</Label>
                <p className="text-xs text-muted-foreground">Mostrar badge de "Nuevo"</p>
              </div>
              <Switch 
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => updateFormData({ isNew: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isOnSale" className="text-sm font-medium">Producto en liquidación</Label>
                <p className="text-xs text-muted-foreground">Mostrar descuento</p>
              </div>
              <Switch 
                id="isOnSale"
                checked={formData.isOnSale}
                onCheckedChange={(checked) => updateFormData({ 
                  isOnSale: checked,
                  discount: checked ? formData.discount : 0
                })}
              />
            </div>

            {formData.isOnSale && (
              <div className="ml-4 pt-4 border-t space-y-4">
                
                {/* Header con icono */}
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm font-medium">Configuración de descuento</Label>
                </div>

                {/* Descuento base */}
                <div>
                  <Label htmlFor="discount" className="text-sm">Porcentaje de descuento (%)</Label>
                  <Input 
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => updateFormData({ discount: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>

                {/* Programar descuento */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Programar descuento</Label>
                    <p className="text-xs text-muted-foreground">Activar automáticamente por fechas</p>
                  </div>
                  <Switch 
                    checked={formData.isScheduledPromotion || false}
                    onCheckedChange={(checked) => updateFormData({ 
                      isScheduledPromotion: checked,
                      promotionStartDate: checked ? formData.promotionStartDate : undefined,
                      promotionEndDate: checked ? formData.promotionEndDate : undefined
                    })}
                  />
                </div>

                {/* Configuración de fechas */}
                {formData.isScheduledPromotion && (
                  <div className="ml-4 space-y-3 border-l-2 border-orange-200 pl-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Fecha inicio</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !formData.promotionStartDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.promotionStartDate ? (
                                format(formData.promotionStartDate, "dd/MM/yyyy")
                              ) : (
                                <span>Fecha inicio</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.promotionStartDate}
                              onSelect={(date) => updateFormData({ promotionStartDate: date })}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-sm">Fecha fin</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !formData.promotionEndDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formData.promotionEndDate ? (
                                format(formData.promotionEndDate, "dd/MM/yyyy")
                              ) : (
                                <span>Fecha fin</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formData.promotionEndDate}
                              onSelect={(date) => updateFormData({ promotionEndDate: date })}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vista previa del precio */}
                <div className="p-3 bg-muted/30 rounded-lg">
                  <Label className="text-sm font-medium">Vista previa del precio</Label>
                  <div className="mt-2">
                    <div className="text-lg font-medium text-green-600">
                      {formatPrice(Math.round(formData.price * (100 - formData.discount) / 100))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Precio original: {formatPrice(formData.price)}
                    </div>
                    {formData.discount > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Ahorro: {formatPrice(Math.round(formData.price * formData.discount / 100))} (-{formData.discount}%)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Loyalty Points Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Puntos de Fidelización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Cálculo de puntos base */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Cálculo automático</Label>
                <p className="text-xs text-muted-foreground">Basado en precio</p>
              </div>
              <Switch 
                checked={formData.loyaltyPointsMode === 'automatic'}
                onCheckedChange={(checked) => {
                  const mode = checked ? 'automatic' : 'manual';
                  updateFormData({ 
                    loyaltyPointsMode: mode,
                    loyaltyPoints: checked ? Math.floor(formData.price / (formData.loyaltyPointsRate || 1800)) : formData.loyaltyPoints
                  });
                }}
              />
            </div>

            {formData.loyaltyPointsMode === 'automatic' ? (
              <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
                <div>
                  <Label htmlFor="loyaltyRate" className="text-sm">1 punto cada (CLP)</Label>
                  <Input
                    id="loyaltyRate"
                    type="number"
                    value={formData.loyaltyPointsRate || 1800}
                    onChange={(e) => {
                      const rate = Number(e.target.value);
                      updateFormData({ 
                        loyaltyPointsRate: rate,
                        loyaltyPoints: Math.floor(formData.price / rate)
                      });
                    }}
                    className="mt-1"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    Puntos: {Math.floor(formData.price / (formData.loyaltyPointsRate || 1800))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ml-4 border-l-2 border-orange-200 pl-4">
                <Label htmlFor="manualPoints" className="text-sm">Puntos fijos</Label>
                <Input
                  id="manualPoints"
                  type="number"
                  value={formData.loyaltyPoints}
                  onChange={(e) => updateFormData({ loyaltyPoints: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            )}

            {/* Multiplicador promocional */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Multiplicador promocional</Label>
                <p className="text-xs text-muted-foreground">Puntos extra temporales</p>
              </div>
              <Switch 
                checked={loyaltyPromotion.isActive}
                onCheckedChange={(checked) => setLoyaltyPromotion({...loyaltyPromotion, isActive: checked})}
              />
            </div>

            {loyaltyPromotion.isActive && (
              <div className="ml-4 space-y-3 border-l-2 border-purple-200 pl-4">
                <div>
                  <Label htmlFor="multiplier" className="text-sm">Multiplicador</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={loyaltyPromotion.multiplier}
                    onChange={(e) => setLoyaltyPromotion({...loyaltyPromotion, multiplier: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">
                    Con multiplicador: {Math.floor(formData.loyaltyPoints * loyaltyPromotion.multiplier)} puntos
                  </div>
                </div>
              </div>
            )}

            {/* Bonificaciones especiales */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-500" />
                <Label className="text-sm font-medium">Bonificaciones</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg">
                  <Label className="text-xs">Primera compra</Label>
                  <Input
                    type="number"
                    min="0"
                    value={loyaltyBonus.firstPurchaseBonus}
                    onChange={(e) => setLoyaltyBonus({
                      ...loyaltyBonus,
                      firstPurchaseBonus: Number(e.target.value)
                    })}
                    className="mt-1"
                  />
                </div>
                
                <div className="p-3 border rounded-lg">
                  <Label className="text-xs">Por volumen</Label>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <Input
                      type="number"
                      min="1"
                      placeholder="Min"
                      value={loyaltyBonus.volumeBonus.minQuantity}
                      onChange={(e) => setLoyaltyBonus({
                        ...loyaltyBonus,
                        volumeBonus: {
                          ...loyaltyBonus.volumeBonus,
                          minQuantity: Number(e.target.value)
                        }
                      })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Pts"
                      value={loyaltyBonus.volumeBonus.bonusPoints}
                      onChange={(e) => setLoyaltyBonus({
                        ...loyaltyBonus,
                        volumeBonus: {
                          ...loyaltyBonus.volumeBonus,
                          bonusPoints: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Variants Manager */}
        <MobileProductVariantsManager
          variants={productVariants}
          attributes={productAttributes}
          onVariantsChange={handleVariantsChange}
          onAttributesChange={handleAttributesChange}
          basePrice={formData.price}
        />

        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
