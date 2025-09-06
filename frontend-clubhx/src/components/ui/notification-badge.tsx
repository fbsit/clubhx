import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  type?: 'info' | 'warning' | 'urgent';
  maxCount?: number;
  animate?: boolean;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  type = 'info',
  maxCount = 99,
  animate = false,
  className,
}) => {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const typeStyles = {
    info: 'bg-blue-500 text-white border-blue-600',
    warning: 'bg-amber-500 text-white border-amber-600',
    urgent: 'bg-destructive text-destructive-foreground border-destructive',
  };

  return (
    <Badge
      className={cn(
        'absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold',
        'min-w-5 rounded-full border-2 border-background',
        typeStyles[type],
        animate && type === 'urgent' && 'animate-pulse',
        className
      )}
      style={{ animation: animate && type === 'urgent' ? undefined : 'none' }}
    >
      {displayCount}
    </Badge>
  );
};