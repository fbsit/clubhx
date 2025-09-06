
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminLoyaltyProducts from "@/components/admin/loyalty/MobileAdminLoyaltyProducts";
import DesktopAdminLoyaltyProducts from "@/components/admin/loyalty/DesktopAdminLoyaltyProducts";
import { useLoyaltyRewards } from "@/hooks/useLoyaltyRewards";
import { createEmptyLoyaltyProduct, LoyaltyProduct } from "@/utils/loyaltyRewardAdapter";

export default function AdminLoyaltyProducts() {
  const isMobile = useIsMobile();
  const { 
    rewards, 
    loading, 
    error, 
    createReward, 
    updateReward, 
    deleteReward,
    toggleFeatured,
    changeStatus,
    updateStock,
    refreshRewards 
  } = useLoyaltyRewards();

  const handleSaveReward = async (reward: LoyaltyProduct) => {
    if (reward.id) {
      await updateReward(reward.id, reward);
    } else {
      await createReward(reward);
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    await deleteReward(rewardId);
  };

  const handleToggleFeatured = async (rewardId: string) => {
    await toggleFeatured(rewardId);
  };

  const handleChangeStatus = async (rewardId: string, status: string) => {
    await changeStatus(rewardId, status as any);
  };

  const handleUpdateStock = async (rewardId: string, stockQuantity: number) => {
    await updateStock(rewardId, stockQuantity);
  };

  if (isMobile) {
    return (
      <MobileAdminLoyaltyProducts 
        products={rewards} 
        setProducts={() => {}}
        loading={loading}
        error={error}
        onSaveReward={handleSaveReward}
        onDeleteReward={handleDeleteReward}
        onToggleFeatured={handleToggleFeatured}
        onChangeStatus={handleChangeStatus}
        onUpdateStock={handleUpdateStock}
        onRefresh={refreshRewards}
        createEmptyProduct={createEmptyLoyaltyProduct}
      />
    );
  }

  return (
    <DesktopAdminLoyaltyProducts 
      products={rewards} 
      setProducts={() => {}}
      loading={loading}
      error={error}
      onSaveReward={handleSaveReward}
      onDeleteReward={handleDeleteReward}
      onToggleFeatured={handleToggleFeatured}
      onChangeStatus={handleChangeStatus}
      onUpdateStock={handleUpdateStock}
      onRefresh={refreshRewards}
      createEmptyProduct={createEmptyLoyaltyProduct}
    />
  );
}
