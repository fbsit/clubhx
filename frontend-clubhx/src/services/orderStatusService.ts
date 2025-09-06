import { Order, OrderStatus } from "@/types/order";
import { shouldAutoComplete } from "@/components/orders/progress/OrderProgressUtils";

export class OrderStatusService {
  // Update order status with automatic completion logic
  static updateOrderStatus(order: Order, newStatus: OrderStatus): Order {
    const updatedOrder = { ...order, status: newStatus };

    // Auto-complete if both delivered and paid
    if (shouldAutoComplete(updatedOrder)) {
      return { ...updatedOrder, status: "completed", completedDate: new Date().toISOString() };
    }

    return updatedOrder;
  }

  // Simulate tracking update that sets order to delivered
  static processTrackingUpdate(order: Order, trackingStatus: "delivered" | "in_transit"): Order {
    if (trackingStatus === "delivered" && order.status === "shipped") {
      return this.updateOrderStatus(order, "delivered");
    }
    return order;
  }

  // Process payment proof upload
  static processPaymentProofUpload(order: Order, paymentProof: any): Order {
    const updatedOrder = { 
      ...order, 
      status: "payment_pending" as OrderStatus, 
      paymentProof 
    };
    
    return updatedOrder;
  }

  // Process payment verification (admin action)
  static processPaymentVerification(order: Order, verified: boolean): Order {
    if (verified && order.status === "payment_pending") {
      return this.updateOrderStatus(order, "paid");
    }
    return order;
  }

  // Get orders that need admin attention
  static getOrdersNeedingAttention(orders: Order[]): Order[] {
    return orders.filter(order => 
      order.status === "payment_pending" ||
      order.status === "requested" ||
      order.status === "quotation"
    );
  }
}