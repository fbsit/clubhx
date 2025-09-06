import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById, createProduct, updateProduct } from "@/services/productsApi";
import { ProductType, ProductVariant, ProductAttribute } from "@/types/product";
import { toast } from "sonner";
import AdminProductEditHeader from "@/components/admin/AdminProductEditHeader";
import ProductBasicInfoForm from "@/components/admin/ProductBasicInfoForm";
import ProductConfigurationForm from "@/components/admin/ProductConfigurationForm";
import LoyaltyConfigurationForm from "@/components/admin/LoyaltyConfigurationForm";
import ProductStatusSidebar from "@/components/admin/ProductStatusSidebar";
import ProductVariantsManager from "@/components/admin/ProductVariantsManager";
import { LoyaltyPromotion, LoyaltyBonus } from "@/types/product";

import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminProductEdit from "@/components/admin/MobileAdminProductEdit";

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
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  isScheduledPromotion?: boolean;
  loyaltyPointsMode?: 'automatic' | 'manual';
  loyaltyPointsRate?: number;
}

export default function AdminProductEdit() {
  console.log("AdminProductEdit component mounting");
  
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if we're creating a new product
  const isNewProduct = location.pathname.includes('/products/new') || productId === "new";
  
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log("Product ID from params:", productId);
  console.log("Location pathname:", location.pathname);
  console.log("Is new product:", isNewProduct);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    type: "",
    brand: "",
    image: "",
    isPopular: false,
    isNew: false,
    isVisible: true,
    discount: 0,
    isOnSale: false,
    sku: "",
    loyaltyPoints: 0,
    promotionStartDate: undefined,
    promotionEndDate: undefined,
    isScheduledPromotion: false,
    loyaltyPointsMode: 'automatic',
    loyaltyPointsRate: 1800,
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

  // Mock KPIs
  const generateStableKPIs = (productId: string) => {
    console.log("Generating KPIs for product:", productId);
    const seed = productId?.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0) || 0;
    
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000;
      return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };
    
    return {
      views: seededRandom(100, 1000),
      addedToQuotes: seededRandom(5, 50),
      conversionRate: (seededRandom(50, 200) / 10).toFixed(1),
      revenue: seededRandom(50000, 500000),
      avgRating: (seededRandom(35, 50) / 10).toFixed(1),
    };
  };

  useEffect(() => {
    console.log("Effect running with productId:", productId);
    console.log("Is new product:", isNewProduct);
    
    // Check if we're in "new product" mode
    if (isNewProduct) {
      console.log("New product mode detected");
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
        type: "",
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
      console.error("No product ID provided and not in new product mode");
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
          type: foundProduct.type || "",
          brand: foundProduct.brand,
          image: foundProduct.image,
          isPopular: foundProduct.isPopular || false,
          isNew: foundProduct.isNew || false,
          isVisible: true,
          discount: foundProduct.discount || 0,
          isOnSale: (foundProduct.discount || 0) > 0,
          sku: foundProduct.sku || "",
          loyaltyPoints: foundProduct.loyaltyPoints || 0,
          loyaltyPointsMode: foundProduct.loyaltyPointsMode || 'automatic',
          loyaltyPointsRate: foundProduct.loyaltyPointsRate || 1800,
          promotionStartDate: (foundProduct as any).promotionStartDate,
          promotionEndDate: (foundProduct as any).promotionEndDate,
          isScheduledPromotion: (foundProduct as any).isScheduledPromotion || false,
        });
        setLoyaltyPromotion((foundProduct as any).loyaltyPromotion || { isActive: false, multiplier: 2 });
        setLoyaltyBonus((foundProduct as any).loyaltyBonus || { firstPurchaseBonus: 0, volumeBonus: { minQuantity: 5, bonusPoints: 10 } });
        setProductVariants((foundProduct as any).variants || []);
        setProductAttributes((foundProduct as any).attributes || []);
        setError(null);
      } catch (err) {
        console.error("Error loading product:", err);
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
        type: formData.type,
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
    console.log("Navigating back to products list");
    navigate("/main/products");
  };

  const handlePreview = () => {
    console.log("Navigating to product preview");
    navigate(`/main/products/${productId}`);
  };

  const handleImageSelected = (imageUrl: string) => {
    console.log("Image selected:", imageUrl);
    setFormData({...formData, image: imageUrl});
  };

  const handleVariantsChange = (newVariants: ProductVariant[]) => {
    console.log("Product variants updated:", newVariants);
    setProductVariants(newVariants);
  };

  const handleAttributesChange = (newAttributes: ProductAttribute[]) => {
    console.log("Product attributes updated:", newAttributes);
    setProductAttributes(newAttributes);
  };

  // IMPORTANT: Mobile check AFTER all hooks
  if (isMobile) {
    return <MobileAdminProductEdit />;
  }

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="container max-w-7xl py-6 animate-enter">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="container max-w-7xl py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <AdminProductEditHeader
            productId=""
            productName=""
            onBack={handleBack}
            onPreview={() => {}}
            onSave={() => {}}
          />
        </div>
      </div>
    );
  }

  if (!product) {
    console.log("No product found, rendering not found");
    return (
      <div className="container max-w-7xl py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <AdminProductEditHeader
            productId=""
            productName=""
            onBack={handleBack}
            onPreview={() => {}}
            onSave={() => {}}
          />
        </div>
      </div>
    );
  }

  console.log("Rendering main component with product:", product.name);

  const mockKPIs = isNewProduct ? {
    views: 0,
    addedToQuotes: 0,
    conversionRate: "0.0",
    revenue: 0,
    avgRating: "0.0"
  } : generateStableKPIs(product.id);

  return (
    <div className="container max-w-7xl py-6 animate-enter">
      {/* Header */}
      <AdminProductEditHeader
        productId={product.id}
        productName={isNewProduct ? "Nuevo Producto" : product.name}
        onBack={handleBack}
        onPreview={isNewProduct ? undefined : handlePreview}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information and Image */}
          <ProductBasicInfoForm
            formData={formData}
            onFormDataChange={(data) => setFormData(data)}
            onImageSelected={handleImageSelected}
          />

          {/* Product Configuration */}
          <ProductConfigurationForm
            formData={formData}
            onFormDataChange={(data) => setFormData(data)}
          />

          {/* Loyalty Configuration */}
          <LoyaltyConfigurationForm
            price={formData.price}
            loyaltyPoints={formData.loyaltyPoints}
            loyaltyPointsMode={formData.loyaltyPointsMode || 'automatic'}
            loyaltyPointsRate={formData.loyaltyPointsRate || 1800}
            loyaltyPromotion={loyaltyPromotion}
            loyaltyBonus={loyaltyBonus}
            onLoyaltyPointsChange={(points) => setFormData({...formData, loyaltyPoints: points})}
            onLoyaltyPointsModeChange={(mode) => setFormData({...formData, loyaltyPointsMode: mode})}
            onLoyaltyPointsRateChange={(rate) => setFormData({...formData, loyaltyPointsRate: rate})}
            onLoyaltyPromotionChange={setLoyaltyPromotion}
            onLoyaltyBonusChange={setLoyaltyBonus}
          />

          {/* Product Variants Manager */}
          <ProductVariantsManager 
            variants={productVariants}
            attributes={productAttributes}
            onVariantsChange={handleVariantsChange}
            onAttributesChange={handleAttributesChange}
            basePrice={formData.price}
          />

        </div>

        {/* Sidebar - Analytics & Status */}
        <ProductStatusSidebar
          formData={formData}
          mockKPIs={mockKPIs}
          onPreview={handlePreview}
          onNavigateToAnalytics={() => navigate("/main/admin/product-analytics")}
        />
      </div>
    </div>
  );
}