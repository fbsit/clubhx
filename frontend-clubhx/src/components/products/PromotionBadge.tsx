import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Flame } from "lucide-react";
import { getTimeRemaining, shouldShowCountdown } from "@/utils/promotionUtils";

interface PromotionBadgeProps {
  type: "discount" | "points" | "countdown" | "limited-time";
  value?: number | string;
  endDate?: Date;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const PromotionBadge = ({ type, value, endDate, className = "", size = "md" }: PromotionBadgeProps) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    if (type === "countdown" && endDate && shouldShowCountdown(endDate)) {
      const timer = setInterval(() => {
        setTimeRemaining(getTimeRemaining(endDate));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [type, endDate]);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5"
  };

  const baseClasses = `font-medium inline-flex items-center gap-1 ${sizeClasses[size]} ${className}`;

  switch (type) {
    case "discount":
      return (
        <Badge variant="destructive" className={`${baseClasses} bg-red-500 text-white border-red-500`}>
          <Flame className="h-3 w-3" />
          -{value}%
        </Badge>
      );

    case "points":
      return (
        <Badge className={`${baseClasses} bg-amber-500 text-white border-amber-500`}>
          <Star className="h-3 w-3 fill-current" />
          {value}x puntos
        </Badge>
      );

    case "countdown":
      if (!endDate || !shouldShowCountdown(endDate) || timeRemaining.total <= 0) {
        return null;
      }

      return (
        <Badge className={`${baseClasses} bg-orange-500 text-white border-orange-500`}>
          <Clock className="h-3 w-3" />
          {timeRemaining.days > 0 ? (
            `${timeRemaining.days}d ${timeRemaining.hours}h`
          ) : (
            `${timeRemaining.hours}h ${timeRemaining.minutes}m`
          )}
        </Badge>
      );

    case "limited-time":
      return (
        <Badge className={`${baseClasses} bg-purple-500 text-white border-purple-500`}>
          <Clock className="h-3 w-3" />
          Tiempo limitado
        </Badge>
      );

    default:
      return null;
  }
};

export default PromotionBadge;