import ProductDetailHeader from "./ProductDetailHeader";
import ProductDetailMobile from "./ProductDetailMobile";
import ProductDetailDesktop from "./ProductDetailDesktop";
import { useQuantityControls } from "./ProductDetailActions";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import QuotationCartFab from "@/components/quotation/QuotationCartFab";
import NotifyWhenAvailableDialog from "./stock/NotifyWhenAvailableDialog";
import ReserveProductDialog from "./stock/ReserveProductDialog";

export default function ProductDetailStandard() {
  const {
    product,
    loading,
    displayProduct,
    discountedPrice,
    selectedOptions,
    currentImage,
    currentPrice,
    displayName,
    showNotifyDialog,
    showReserveDialog,
    setShowNotifyDialog,
    setShowReserveDialog,
    handleOptionChange
  } = useProductDetail();

  const quantityControls = useQuantityControls(
    displayProduct,
    () => setShowNotifyDialog(true),
    () => setShowReserveDialog(true)
  );

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="text-center">
          <p>Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" style={{ touchAction: 'pan-y', WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}>
      <div className="w-full max-w-none px-0 sm:px-4 sm:max-w-7xl sm:mx-auto">
        {/* Header - only show on desktop */}
        <div className="hidden sm:block py-6">
          <ProductDetailHeader />
        </div>
        
        {/* Mobile Layout */}
        <ProductDetailMobile
          displayProduct={displayProduct}
          currentImage={currentImage}
          displayName={displayName}
          discountedPrice={discountedPrice}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
          quantityControls={quantityControls}
          product={product}
        />

        {/* Desktop Layout */}
        <ProductDetailDesktop
          displayProduct={displayProduct}
          currentImage={currentImage}
          displayName={displayName}
          currentPrice={currentPrice}
          discountedPrice={discountedPrice}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
          quantityControls={quantityControls}
          product={product}
        />
      </div>

      {/* Quotation Cart FAB */}
      <QuotationCartFab />
      
      {/* Dialogs */}
      {product && (
        <>
          <NotifyWhenAvailableDialog
            product={product}
            open={showNotifyDialog}
            onOpenChange={setShowNotifyDialog}
          />
          
          <ReserveProductDialog
            product={product}
            open={showReserveDialog}
            onOpenChange={setShowReserveDialog}
          />
        </>
      )}
    </div>
  );
}