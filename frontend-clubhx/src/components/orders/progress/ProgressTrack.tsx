
import { useRef, useState } from "react";
import { OrderStatus } from "@/types/order";
import { ProgressStep } from "./ProgressStep";
import { statusConfig } from "@/config/orderStatusConfig";
import { Check, FileEdit, FileCheck, CheckCircle, FileText, Truck, CheckCheck, History, Eye } from "lucide-react";
import { getStepStatus, statusOrder, getVisibleSteps } from "./OrderProgressUtils";
import { Button } from "@/components/ui/button";

interface ProgressTrackProps {
  status: OrderStatus;
}

export function ProgressTrack({ status }: ProgressTrackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showCompleteHistory, setShowCompleteHistory] = useState(false);
  
  const hasCompletedSteps = statusOrder.indexOf(status) > 0;
  const visibleSteps = getVisibleSteps(status, showCompleteHistory);

  // Steps configuration
  const stepConfig = [
    { value: "quotation", label: "Cotización", icon: <FileEdit className="h-4 w-4" /> },
    { value: "requested", label: "Solicitado", icon: <FileCheck className="h-4 w-4" /> },
    { value: "accepted", label: "Aceptado", icon: <CheckCircle className="h-4 w-4" /> },
    { value: "invoiced", label: "Facturado", icon: <FileText className="h-4 w-4" /> },
    { value: "shipped", label: "Enviado", icon: <Truck className="h-4 w-4" /> },
    { value: "delivered", label: "Entregado", icon: <Truck className="h-4 w-4" /> },
    { value: "completed", label: "Completado", icon: <CheckCheck className="h-4 w-4" /> }
  ];

  const visibleStepConfig = stepConfig.filter(step => 
    visibleSteps.includes(step.value as OrderStatus)
  );
  
  return (
    <div className="space-y-4">
      {/* Toggle button for complete history */}
      {hasCompletedSteps && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCompleteHistory(!showCompleteHistory)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showCompleteHistory ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Ocultar completados
              </>
            ) : (
              <>
                <History className="w-3 h-3 mr-1" />
                Ver historial completo
              </>
            )}
          </Button>
        </div>
      )}

      <div className="relative pb-4">
        {/* Horizontal line background */}
        <div className="absolute inset-0 flex items-center h-0.5 top-5" aria-hidden="true">
          <div className="h-0.5 w-full bg-muted"></div>
        </div>
        
        {/* Scrollable container for visible steps */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto pb-5 hide-scrollbar scroll-smooth" 
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex min-w-fit px-2">
            {visibleStepConfig.map((step) => (
              <ProgressStep
                key={step.value}
                stepValue={step.value as OrderStatus}
                status={getStepStatus(step.value as OrderStatus, status)}
                label={step.label}
                icon={step.icon}
                completedIcon={<Check className="h-4 w-4" />}
                tooltipText={statusConfig[step.value as OrderStatus]?.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
