
import { OrderStatus } from "@/types/order";

// Define the status order for consistent progression
export const statusOrder: OrderStatus[] = [
  "requested",
  "quotation",
  "accepted", 
  "invoiced", 
  "shipped", 
  "delivered",
  "payment_pending",
  "paid",
  "completed"
];

// Helper function to check if order should be automatically completed
export const shouldAutoComplete = (order: { status: OrderStatus; deliveredDate?: string; paymentProof?: any }) => {
  // Order is completed when it's both delivered and paid
  const isDelivered = order.status === "delivered" || hasBeenDelivered(order.status);
  const isPaid = order.status === "paid" || hasBeenPaid(order.status);
  
  return isDelivered && isPaid && order.status !== "completed";
};

// Helper to check if order has been delivered (current or past status)
const hasBeenDelivered = (currentStatus: OrderStatus) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const deliveredIndex = statusOrder.indexOf("delivered");
  return currentIndex >= deliveredIndex;
};

// Helper to check if order has been paid (current or past status)  
const hasBeenPaid = (currentStatus: OrderStatus) => {
  const currentIndex = statusOrder.indexOf(currentStatus);
  const paidIndex = statusOrder.indexOf("paid");
  return currentIndex >= paidIndex;
};

// Helper function to determine step status based on current order status
export const getStepStatus = (
  stepValue: OrderStatus, 
  currentStatus: OrderStatus
) => {
  const stepIndex = statusOrder.indexOf(stepValue);
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  if (stepIndex < 0) return "inactive";
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
};

// Helper function to get visible steps for progressive UI
export const getVisibleSteps = (
  currentStatus: OrderStatus,
  showCompleteHistory: boolean = false
): OrderStatus[] => {
  if (showCompleteHistory) {
    return statusOrder.filter(status => 
      status !== "rejected" && status !== "canceled"
    );
  }
  
  const currentIndex = statusOrder.indexOf(currentStatus);
  if (currentIndex === -1) return statusOrder;
  
  // Show current step and upcoming steps, hide completed ones
  return statusOrder.filter((status, index) => {
    if (status === "rejected" || status === "canceled") return false;
    return index >= currentIndex;
  });
};

// Type definition for step status
export type StepStatus = "completed" | "current" | "upcoming" | "inactive";
