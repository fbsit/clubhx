
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type SalesNavItemProps = {
  to: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
};

export const SalesNavItem = ({ to, label, icon, isActive }: SalesNavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};
