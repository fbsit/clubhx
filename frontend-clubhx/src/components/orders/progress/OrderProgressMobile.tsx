
import { OrderStatus } from "@/types/order";
import { statusConfig } from "@/config/orderStatusConfig";
import { Check, FileEdit, FileCheck, CheckCircle, FileText, Truck, CheckCheck } from "lucide-react";
import { statusOrder } from "./OrderProgressUtils";

interface OrderProgressMobileProps {
  status: OrderStatus;
}

export function OrderProgressMobile({ status }: OrderProgressMobileProps) {
  const currentIndex = statusOrder.indexOf(status);
  
  // Get 3 most relevant statuses for mobile view
  const visibleStatuses = [];
  
  // Add previous status if exists
  if (currentIndex > 0) {
    visibleStatuses.push(statusOrder[currentIndex - 1]);
  }
  
  // Add current status
  visibleStatuses.push(status);
  
  // Add next status if exists
  if (currentIndex < statusOrder.length - 1) {
    visibleStatuses.push(statusOrder[currentIndex + 1]);
  }
  
  return (
    <div className="flex justify-center items-center space-x-1 pb-24">
      {visibleStatuses.map((stepStatus, index) => (
        <div key={stepStatus} className="flex flex-col items-center">
          {index > 0 && (
            <div className="h-0.5 w-8 bg-muted my-3">
              <div 
                className={`h-full ${
                  statusOrder.indexOf(stepStatus as OrderStatus) <= currentIndex ? "bg-primary" : ""
                }`}
                style={{ 
                  width: statusOrder.indexOf(stepStatus as OrderStatus) < currentIndex ? "100%" : "0%" 
                }}
              />
            </div>
          )}
          <div 
            className={`
              h-8 w-8 rounded-full flex items-center justify-center text-xs
              ${statusOrder.indexOf(stepStatus as OrderStatus) < currentIndex ? 
                'bg-status-completed text-white' : 
                statusOrder.indexOf(stepStatus as OrderStatus) === currentIndex ? 
                'border-2 border-status-completed text-status-completed bg-white' : 
                'border-2 border-muted bg-white text-muted-foreground'}
            `}
          >
            {statusOrder.indexOf(stepStatus as OrderStatus) < currentIndex ? (
              <Check className="h-4 w-4" />
            ) : (
              stepStatus === "quotation" ? <FileEdit className="h-4 w-4" /> :
              stepStatus === "requested" ? <FileCheck className="h-4 w-4" /> :
              stepStatus === "accepted" ? <CheckCircle className="h-4 w-4" /> :
              stepStatus === "invoiced" ? <FileText className="h-4 w-4" /> :
              stepStatus === "shipped" || stepStatus === "delivered" ? <Truck className="h-4 w-4" /> :
              <CheckCheck className="h-4 w-4" />
            )}
          </div>
          <div className="text-center mt-1">
            <p className="text-xs font-medium">
              {statusConfig[stepStatus as OrderStatus].label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
