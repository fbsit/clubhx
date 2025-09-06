
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle } from 'lucide-react';
import { StatusBadgeAnimationProps } from '@/components/dashboard/dashboardTypes';

export const StatusBadgeAnimation = ({ status, children, className }: StatusBadgeAnimationProps) => {
  const getStatusClasses = (status: string): string => {
    const baseClasses = "relative overflow-hidden";
    
    switch (status) {
      case "completed":
        return cn(baseClasses, "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800");
      case "shipped":
        return cn(baseClasses, "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800");
      case "invoiced":
        return cn(baseClasses, "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800");
      case "requested":
        return cn(baseClasses, "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800");
      case "accepted":
        return cn(baseClasses, "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800");
      case "rejected":
      case "canceled":
        return cn(baseClasses, "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800");
      default:
        return cn(baseClasses, "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700");
    }
  };

  const isRejectedOrCanceled = status === "rejected" || status === "canceled";

  return (
    <Badge 
      variant="outline"
      className={cn(getStatusClasses(status), className)}
    >
      <span className="relative z-10 flex items-center">
        {isRejectedOrCanceled && <AlertTriangle className="h-3 w-3 mr-1.5" />}
        {children}
      </span>
      <span className={`absolute inset-0 opacity-20 animate-pulse ${status === "completed" ? "bg-green-400" : 
        status === "shipped" ? "bg-indigo-400" : 
        status === "rejected" || status === "canceled" ? "bg-red-400" : 
        "bg-amber-400"}`} />
    </Badge>
  );
};

export default StatusBadgeAnimation;
