
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useNotifications } from "@/contexts/NotificationContext";

type NavItemProps = {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  collapsed?: boolean;
  alert?: boolean;
  showBadge?: boolean;
};

export const NavItem = ({ to, label, icon, isActive, collapsed = false, alert = false, showBadge = false }: NavItemProps) => {
  const { getNotificationForRoute, clearNotification } = useNotifications();
  const notification = showBadge ? getNotificationForRoute(to) : null;
  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={to}
              onClick={() => notification && clearNotification(to)}
              className={`flex items-center justify-center p-3 rounded-lg transition-colors relative ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <div className="h-6 w-6 flex items-center justify-center relative">
                {icon}
                {alert && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                )}
                {notification && (
                  <NotificationBadge
                    count={notification.count}
                    type={notification.type}
                    animate={notification.type === 'urgent'}
                  />
                )}
              </div>
              <span className="sr-only">{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="flex items-center">
              {label}
              {alert && (
                <span className="ml-2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link
      to={to}
      onClick={() => notification && clearNotification(to)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
      style={{ transition: 'background 0.18s cubic-bezier(0.3,0.85,0.43,0.99)' }}
    >
      <div className="relative">
        {icon}
        {alert && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
        )}
        {notification && (
          <NotificationBadge
            count={notification.count}
            type={notification.type}
            animate={notification.type === 'urgent'}
          />
        )}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};
