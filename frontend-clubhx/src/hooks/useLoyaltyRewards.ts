import { useState, useEffect, useCallback } from 'react';
import { loyaltyRewardsApi, LoyaltyRewardDto, CreateLoyaltyRewardDto, UpdateLoyaltyRewardDto, LoyaltyRewardQueryParams, LoyaltyRewardStatus, RewardStats } from '@/services/loyaltyRewardsApi';
import { adaptLoyaltyRewardToCreateDto, adaptLoyaltyRewardToUpdateDto, adaptLoyaltyRewardsFromDto, LoyaltyProduct } from '@/utils/loyaltyRewardAdapter';
import { toast } from 'sonner';
import { getMyRedemptions } from '@/services/loyaltyRewardsApi';

export interface UseLoyaltyRewardsReturn {
  rewards: LoyaltyProduct[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  stats: RewardStats | null;
  fetchRewards: (params?: LoyaltyRewardQueryParams) => Promise<void>;
  fetchReward: (id: string) => Promise<LoyaltyProduct | null>;
  createReward: (rewardData: LoyaltyProduct) => Promise<LoyaltyProduct | null>;
  updateReward: (id: string, rewardData: LoyaltyProduct) => Promise<LoyaltyProduct | null>;
  deleteReward: (id: string) => Promise<boolean>;
  toggleFeatured: (id: string) => Promise<boolean>;
  changeStatus: (id: string, status: LoyaltyRewardStatus) => Promise<boolean>;
  updateStock: (id: string, stockQuantity: number) => Promise<boolean>;
  refreshRewards: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export function useLoyaltyRewards(initialParams: LoyaltyRewardQueryParams = {}): UseLoyaltyRewardsReturn {
  const [rewards, setRewards] = useState<LoyaltyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<RewardStats | null>(null);

  const fetchRewards = useCallback(async (params: LoyaltyRewardQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await loyaltyRewardsApi.getRewards({
        ...initialParams,
        ...params,
      });
      
      const adaptedRewards = adaptLoyaltyRewardsFromDto(response.results);
      setRewards(adaptedRewards);
      setTotalCount(response.count);
      setHasNextPage(!!response.next);
      setHasPreviousPage(!!response.previous);
      setCurrentPage(params.page || 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReward = useCallback(async (id: string): Promise<LoyaltyProduct | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const reward = await loyaltyRewardsApi.getReward(id);
      const adaptedReward = adaptLoyaltyRewardsFromDto([reward])[0];
      return adaptedReward;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el producto de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReward = useCallback(async (rewardData: LoyaltyProduct): Promise<LoyaltyProduct | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const createDto = adaptLoyaltyRewardToCreateDto(rewardData);
      const newReward = await loyaltyRewardsApi.createReward(createDto);
      const adaptedReward = adaptLoyaltyRewardsFromDto([newReward])[0];
      
      // Actualizar la lista de productos
      setRewards(prev => [adaptedReward, ...prev]);
      setTotalCount(prev => prev + 1);
      
      toast.success('Producto de lealtad creado exitosamente');
      return adaptedReward;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el producto de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReward = useCallback(async (id: string, rewardData: LoyaltyProduct): Promise<LoyaltyProduct | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updateDto = adaptLoyaltyRewardToUpdateDto(rewardData);
      const updatedReward = await loyaltyRewardsApi.updateReward(id, updateDto);
      const adaptedReward = adaptLoyaltyRewardsFromDto([updatedReward])[0];
      
      // Actualizar el producto en la lista
      setRewards(prev => prev.map(reward => 
        reward.id === id ? adaptedReward : reward
      ));
      
      toast.success('Producto de lealtad actualizado exitosamente');
      return adaptedReward;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el producto de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReward = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await loyaltyRewardsApi.deleteReward(id);
      
      // Remover el producto de la lista
      setRewards(prev => prev.filter(reward => reward.id !== id));
      setTotalCount(prev => prev - 1);
      
      toast.success('Producto de lealtad eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el producto de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedReward = await loyaltyRewardsApi.toggleFeatured(id);
      const adaptedReward = adaptLoyaltyRewardsFromDto([updatedReward])[0];
      
      // Actualizar el producto en la lista
      setRewards(prev => prev.map(reward => 
        reward.id === id ? adaptedReward : reward
      ));
      
      toast.success(adaptedReward.featured ? 'Producto marcado como destacado' : 'Producto removido de destacados');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado destacado';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeStatus = useCallback(async (id: string, status: LoyaltyRewardStatus): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedReward = await loyaltyRewardsApi.changeStatus(id, status);
      const adaptedReward = adaptLoyaltyRewardsFromDto([updatedReward])[0];
      
      // Actualizar el producto en la lista
      setRewards(prev => prev.map(reward => 
        reward.id === id ? adaptedReward : reward
      ));
      
      toast.success(`Estado del producto cambiado a ${status}`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del producto';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStock = useCallback(async (id: string, stockQuantity: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedReward = await loyaltyRewardsApi.updateStock(id, stockQuantity);
      const adaptedReward = adaptLoyaltyRewardsFromDto([updatedReward])[0];
      
      // Actualizar el producto en la lista
      setRewards(prev => prev.map(reward => 
        reward.id === id ? adaptedReward : reward
      ));
      
      toast.success(`Stock actualizado a ${stockQuantity} unidades`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar stock';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRewards = useCallback(async () => {
    await fetchRewards({ page: currentPage });
  }, [fetchRewards, currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rewardStats = await loyaltyRewardsApi.getRewardStats();
      setStats(rewardStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar productos iniciales
  useEffect(() => {
    fetchRewards();
    fetchStats();
  }, [fetchRewards, fetchStats]);

  return {
    rewards,
    loading,
    error,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    stats,
    fetchRewards,
    fetchReward,
    createReward,
    updateReward,
    deleteReward,
    toggleFeatured,
    changeStatus,
    updateStock,
    refreshRewards,
    fetchStats,
  };
}

// Hook específico para productos públicos (clientes)
export function usePublicLoyaltyRewards(customerPoints: number = 0, limit: number = 10) {
  const [rewards, setRewards] = useState<LoyaltyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Mostrar todos los productos públicos activos (independiente de puntos del usuario).
      const publicList = await loyaltyRewardsApi.getRewards({
        isPublic: true,
        status: 'active' as any,
        limit,
      });
      const adaptedRewards = adaptLoyaltyRewardsFromDto(publicList.results);
      setRewards(adaptedRewards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos de lealtad';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [customerPoints, limit]);

  const fetchFeaturedRewards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const featuredRewards = await loyaltyRewardsApi.getPublicFeaturedRewards();
      const adaptedRewards = adaptLoyaltyRewardsFromDto(featuredRewards);
      setRewards(adaptedRewards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos destacados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRewardsByCategory = useCallback(async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryRewards = await loyaltyRewardsApi.getPublicRewardsByCategory(category, limit);
      const adaptedRewards = adaptLoyaltyRewardsFromDto(categoryRewards);
      setRewards(adaptedRewards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos por categoría';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPublicRewards();
  }, [fetchPublicRewards]);

  return {
    rewards,
    loading,
    error,
    fetchPublicRewards,
    fetchFeaturedRewards,
    fetchRewardsByCategory,
  };
}

export function useMyRedemptions(status?: 'pending' | 'delivered', enabled: boolean = true) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyRedemptions(status);
      setItems(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar historial de canjes';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (enabled) {
      fetchItems();
    }
  }, [fetchItems, enabled]);

  return { items, loading, error, refresh: fetchItems };
}
