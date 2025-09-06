
import React from "react";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { StepStatus } from "./OrderProgressUtils";

interface ProgressStepProps {
  stepValue: OrderStatus;
  status: StepStatus;
  label: string;
  icon: React.ReactNode;
  completedIcon: React.ReactNode;
  tooltipText?: string;
}

export function ProgressStep({ 
  stepValue, 
  status, 
  label, 
  icon, 
  completedIcon, 
  tooltipText 
}: ProgressStepProps) {
  const isMobile = useIsMobile();
  
  const stepIcon = (
    <div 
      className={cn(
        "flex items-center justify-center rounded-full transition-all",
        isMobile ? "h-6 w-6" : "h-10 w-10",
        {
          "bg-status-completed text-white shadow-sm": status === "completed",
          "border-2 border-status-completed text-status-completed bg-white": status === "current",
          "border-2 border-muted bg-white text-muted-foreground": status === "upcoming" || status === "inactive"
        }
      )}
    >
      {status === "completed" ? completedIcon : icon}
    </div>
  );
  
  // Wrap with tooltip if there's tooltip text
  const iconWithTooltip = tooltipText ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {stepIcon}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[180px] text-center">
          <p className="text-xs">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : stepIcon;
  
  return (
    <div className="flex flex-col items-center mx-4 relative w-16">
      {iconWithTooltip}
      <span 
        className={cn(
          "text-center mt-2",
          isMobile ? "text-[0.65rem]" : "text-xs",
          {
            "font-medium": status === "current",
            "text-muted-foreground": status === "upcoming" || status === "inactive"
          },
          "line-clamp-2 max-w-[100px]"
        )}
      >
        {label}
      </span>
    </div>
  );
}
