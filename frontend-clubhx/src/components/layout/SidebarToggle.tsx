
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCollapsible } from "@/contexts/CollapsibleContext";
import { cn } from "@/lib/utils";
import { SidebarTriggerProps } from "@/components/dashboard/dashboardTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const SidebarToggle = ({ className, icon }: SidebarTriggerProps) => {
  const { sidebarState, toggleSidebar } = useCollapsible();
  const isExpanded = sidebarState === "expanded";

  // Simplified icon logic - always show the icon that indicates the action that will happen
  const toggleIcon = isExpanded 
    ? <ChevronLeft className="h-5 w-5" /> 
    : <ChevronRight className="h-5 w-5" />;
  
  const tooltipText = isExpanded ? "Contraer menú lateral" : "Expandir menú lateral";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "shrink-0 relative z-50 h-10 w-6 -mr-3 rounded-r-xl rounded-l-none border-l-0 bg-background",
              "shadow-sm hover:bg-accent",
              className
            )}
            aria-label="Toggle Sidebar"
          >
            {icon || toggleIcon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center">
            {tooltipText}
            <kbd className="ml-2 bg-muted text-muted-foreground px-1.5 py-0.5 text-xs rounded font-mono">
              Ctrl+B
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarToggle;
