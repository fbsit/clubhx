import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/loyalty/ProductCard";
import SuccessAlert from "@/components/loyalty/SuccessAlert";
import ProductDetailDialog from "@/components/loyalty/ProductDetailDialog";
import ConfirmationDialog from "@/components/loyalty/ConfirmationDialog";
import { usePublicLoyaltyRewards } from "@/hooks/useLoyaltyRewards";
import { LoyaltyProduct } from "@/utils/loyaltyRewardAdapter";
import { redeemLoyaltyReward } from "@/services/loyaltyRewardsApi";
import { toast } from "sonner";

interface ClientLoyaltyViewProps {
  totalPoints: number;
  isMobile: boolean;
}

export const ClientLoyaltyView: React.FC<ClientLoyaltyViewProps> = ({ 
  totalPoints, 
  isMobile 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<LoyaltyProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userPoints, setUserPoints] = useState<number>(totalPoints);

  // Keep local points in sync with prop
  useEffect(() => {
    setUserPoints(totalPoints ?? 0);
  }, [totalPoints]);

  // Refetch available rewards when points change on the 'all' tab
  useEffect(() => {
    if (activeTab === "all") {
      fetchPublicRewards();
    }
  }, [userPoints]);

  // Use the public loyalty rewards hook
  const { 
    rewards: products, 
    loading, 
    error, 
    fetchPublicRewards, 
    fetchFeaturedRewards, 
    fetchRewardsByCategory 
  } = usePublicLoyaltyRewards(userPoints, 20);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") fetchPublicRewards();
    else if (value === "featured") fetchFeaturedRewards();
    else fetchRewardsByCategory(value);
  };

  const handleRedeemClick = (product: LoyaltyProduct) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    try {
      if (!selectedProduct) return;
      setIsDialogOpen(false);
      setConfirmDialogOpen(false);
      const res = await redeemLoyaltyReward(selectedProduct.id);
      if (res.success) {
        toast.success("Canje realizado correctamente");
        setRedeemSuccess(true);
        setUserPoints(prev => Math.max(0, prev - selectedProduct.pointsCost));
        await fetchPublicRewards();
        setTimeout(() => setRedeemSuccess(false), 4000);
      } else {
        toast.error("No se pudo realizar el canje");
      }
    } catch (e) {
      toast.error("No se pudo realizar el canje");
    }
  };

  // Filter products based on active tab
  const filteredProducts = products.filter(product => (activeTab === "all" ? true : product.category === activeTab));

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos de lealtad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <button onClick={() => fetchPublicRewards()} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SuccessAlert visible={redeemSuccess} />
      <div className="w-full fade-in">
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className={`w-full ${isMobile ? 'grid grid-cols-2 gap-2 mb-3' : 'grid grid-cols-5 gap-2'} h-auto mb-6 rounded-lg`}>
            <TabsTrigger value="all" className={`py-2.5 ${isMobile ? 'text-sm' : 'text-base'}`}>Todos</TabsTrigger>
            <TabsTrigger value="product" className={`py-2.5 ${isMobile ? 'text-sm' : 'text-base'}`}>Productos</TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="discount" className="py-2.5 text-base">Descuentos</TabsTrigger>
                <TabsTrigger value="event" className="py-2.5 text-base">Eventos</TabsTrigger>
                <TabsTrigger value="training" className="py-2.5 text-base">Capacitaciones</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} userPoints={userPoints} onRedeem={handleRedeemClick} isMobile={isMobile} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="product" className="mt-0">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} userPoints={userPoints} onRedeem={handleRedeemClick} isMobile={isMobile} />
              ))}
            </div>
          </TabsContent>

          {!isMobile && (
            <>
              <TabsContent value="discount" className="mt-0">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} userPoints={userPoints} onRedeem={handleRedeemClick} isMobile={isMobile} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="event" className="mt-0">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} userPoints={userPoints} onRedeem={handleRedeemClick} isMobile={isMobile} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="training" className="mt-0">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} userPoints={userPoints} onRedeem={handleRedeemClick} isMobile={isMobile} />
                  ))}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos disponibles en esta categoría</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailDialog product={selectedProduct} userPoints={userPoints} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onRedeem={handleConfirmRedeem} />
      )}

      <ConfirmationDialog isOpen={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} title="Confirmar Canje" message={`¿Estás seguro de que quieres canjear "${selectedProduct?.name}" por ${selectedProduct?.pointsCost} puntos?`} onConfirm={handleConfirmRedeem} />
    </>
  );
};

export default ClientLoyaltyView;
