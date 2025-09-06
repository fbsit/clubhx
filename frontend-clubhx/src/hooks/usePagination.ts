import { useState, useMemo } from 'react';

export interface PaginationConfig {
  initialPageSize: number;
  maxPageSize?: number;
  enableLoadMore?: boolean;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  displayedItems: number;
}

export interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  loadMore: () => void;
  setPageSize: (size: number) => void;
  reset: () => void;
}

export function usePagination<T>(
  items: T[], 
  config: PaginationConfig
): [T[], PaginationState, PaginationActions] {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(config.initialPageSize);
  const [loadMoreCount, setLoadMoreCount] = useState(1);

  const paginationState: PaginationState = useMemo(() => {
    const totalItems = items.length;
    const effectivePageSize = config.enableLoadMore ? pageSize * loadMoreCount : pageSize;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = config.enableLoadMore ? 0 : (currentPage - 1) * pageSize;
    const endIndex = config.enableLoadMore ? Math.min(effectivePageSize, totalItems) : Math.min(currentPage * pageSize, totalItems);
    
    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNextPage: config.enableLoadMore ? endIndex < totalItems : currentPage < totalPages,
      hasPreviousPage: !config.enableLoadMore && currentPage > 1,
      startIndex,
      endIndex,
      displayedItems: endIndex - startIndex,
    };
  }, [items.length, currentPage, pageSize, loadMoreCount, config.enableLoadMore]);

  const paginatedItems = useMemo(() => {
    return items.slice(paginationState.startIndex, paginationState.endIndex);
  }, [items, paginationState.startIndex, paginationState.endIndex]);

  const actions: PaginationActions = {
    goToPage: (page: number) => {
      if (page >= 1 && page <= paginationState.totalPages) {
        setCurrentPage(page);
      }
    },
    nextPage: () => {
      if (paginationState.hasNextPage) {
        setCurrentPage(prev => prev + 1);
      }
    },
    previousPage: () => {
      if (paginationState.hasPreviousPage) {
        setCurrentPage(prev => prev - 1);
      }
    },
    loadMore: () => {
      if (config.enableLoadMore && paginationState.hasNextPage) {
        setLoadMoreCount(prev => prev + 1);
      }
    },
    setPageSize: (size: number) => {
      const maxSize = config.maxPageSize || 100;
      const newSize = Math.min(size, maxSize);
      setPageSize(newSize);
      setCurrentPage(1);
      setLoadMoreCount(1);
    },
    reset: () => {
      setCurrentPage(1);
      setPageSize(config.initialPageSize);
      setLoadMoreCount(1);
    }
  };

  return [paginatedItems, paginationState, actions];
}