import { useMemo } from "react";
import { Order } from "@/types/order";

interface UsePeriodComparisonProps {
  orders: Order[];
  currentPeriod: { from: string; to: string };
  selectedVendor: string;
}

export function usePeriodComparison({ orders, currentPeriod, selectedVendor }: UsePeriodComparisonProps) {
  
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    // Filter by vendor if selected
    if (selectedVendor && selectedVendor !== "all") {
      filtered = filtered.filter(order => order.vendorId === selectedVendor);
    }
    
    return filtered;
  }, [orders, selectedVendor]);

  const { currentOrders, previousOrders } = useMemo(() => {
    const fromDate = new Date(currentPeriod.from);
    const toDate = new Date(currentPeriod.to);
    
    // Calculate previous period of same duration
    const periodDuration = toDate.getTime() - fromDate.getTime();
    const previousFromDate = new Date(fromDate.getTime() - periodDuration);
    const previousToDate = new Date(fromDate.getTime() - 1); // Day before current period starts
    
    const currentOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= fromDate && orderDate <= toDate;
    });
    
    const previousOrders = filteredOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= previousFromDate && orderDate <= previousToDate;
    });
    
    return { currentOrders, previousOrders };
  }, [filteredOrders, currentPeriod]);

  const periodLabels = useMemo(() => {
    const fromDate = new Date(currentPeriod.from);
    const toDate = new Date(currentPeriod.to);
    const periodDuration = toDate.getTime() - fromDate.getTime();
    const previousFromDate = new Date(fromDate.getTime() - periodDuration);
    const previousToDate = new Date(fromDate.getTime() - 1);
    
    const formatDate = (date: Date) => date.toLocaleDateString('es-CL', { 
      day: 'numeric', 
      month: 'short' 
    });
    
    return {
      current: `${formatDate(fromDate)} - ${formatDate(toDate)}`,
      previous: `${formatDate(previousFromDate)} - ${formatDate(previousToDate)}`
    };
  }, [currentPeriod]);

  return {
    currentOrders,
    previousOrders,
    periodLabels
  };
}