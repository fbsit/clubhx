
import { Users, TrendingUp, FileText, ShoppingCart } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User } from "@/types/auth";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminDashboardProps {
  user: User | null;
}

const MetricCard = ({ 
  title, 
  description, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  isMobile 
}: {
  title: string;
  description: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend?: string;
  isMobile: boolean;
}) => (
  <Card className={`hover:shadow-md transition-shadow ${isMobile ? 'p-1' : ''}`}>
    <CardHeader className={`${isMobile ? 'pb-3 px-4 pt-4' : 'pb-2'}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'}`}>{title}</CardTitle>
          <CardDescription className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
      <p className={`font-bold ${isMobile ? 'text-2xl mb-2' : 'text-3xl'}`}>{value}</p>
      <div className="flex items-center gap-2">
        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{subtitle}</p>
        {trend && (
          <span className="text-green-600 text-xs font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);

const SectionCard = ({ 
  title, 
  children,
  className = "",
  isMobile
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  isMobile: boolean;
}) => (
  <Card className={`hover:shadow-md transition-shadow ${className}`}>
    <CardHeader className={isMobile ? 'pb-3 px-4 pt-4' : ''}>
      <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>{title}</CardTitle>
    </CardHeader>
    <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
      {children}
    </CardContent>
  </Card>
);

import AdminAnalyticsDashboard from "./AdminAnalyticsDashboard";

export const AdminDashboard = ({ user }: AdminDashboardProps) => {
  return <AdminAnalyticsDashboard />;
};

export default AdminDashboard;
