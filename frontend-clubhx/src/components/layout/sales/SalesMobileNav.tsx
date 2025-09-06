
import { salesNavigationGroups } from "./SalesNavigationData";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  User,
  Heart,
  Calendar,
  BarChart,
} from "lucide-react";

interface UserType {
  name: string;
  company?: string;
  avatarUrl?: string;
}

type SalesMobileNavProps = {
  user: UserType;
  logout: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  activePath: string;
};

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  User: <User className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  BarChart: <BarChart className="h-5 w-5" />,
};

export default function SalesMobileNav({
  user,
  logout,
  setMobileMenuOpen,
  activePath,
}: SalesMobileNavProps) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={cn(
        "flex flex-col h-full glass-menu rounded-t-3xl shadow-2xl max-h-[90vh]",
        "overflow-hidden"
      )}
      style={{
        backdropFilter: "blur(24px)",
        background:
          "rgba(245,247,255,0.80)",
      }}
    >
      {/* Glassy Profile */}
      <div className="border-b border-white/30 pb-4 pt-8 px-7 bg-transparent">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-background shadow">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-base">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">{user.company}</p>
          </div>
        </div>
      </div>
      {/* Navigation Sections */}
      <nav className="flex-1 px-2 pt-2 pb-3 overflow-auto glass-menu-nav">
        {salesNavigationGroups.map((group, idx) => (
          <div
            key={idx}
            className={cn(
              "mb-2",
              animate ? "animate-fade-in" : "opacity-0 translate-y-2"
            )}
            style={{
              transitionDelay: `${idx * 60}ms`,
              transitionProperty: "opacity,transform",
            }}
          >
            <h3 className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500/80 px-3 mb-1 mt-4">
              {group.title}
            </h3>
            <div className="glass-menu-section flex flex-col gap-[4px]">
              {group.items.map((item, j) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-4 py-[14px] rounded-2xl transition-all font-semibold shadow-none text-[15px] border border-transparent",
                    activePath === item.to
                      ? "bg-white/70 text-primary shadow glass-menu-border font-bold border-slate-200"
                      : "hover:bg-white/50 hover:text-primary hover:shadow hover:glass-menu-border text-slate-800/90"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    transition: "all .23s cubic-bezier(0.2,0.8,0.3,1)",
                  }}
                >
                  <span className="flex-shrink-0 flex items-center">
                    {iconMap[item.icon as string]}
                  </span>
                  <span className="block">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {/* Logout Glass Footer */}
      <div className="border-t border-white/30 bg-transparent px-5 py-4 shadow-none">
        <Button
          variant="ghost"
          className="w-full justify-start font-semibold py-3 px-4 rounded-2xl text-red-500 hover:bg-red-50/80 hover:text-red-700 transition-all"
          onClick={() => {
            setMobileMenuOpen(false);
            logout();
          }}
          style={{
            transition: "all .2s cubic-bezier(.4,0,.6,1)",
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
      <style>{`
        .glass-menu {
          background: rgba(249,250,254,0.88);
          backdrop-filter: blur(32px);
          border: 1.5px solid rgba(255,255,255,0.16);
          box-shadow: 0 8px 28px 0 rgba(44,62,80,0.08);
        }
        .glass-menu-section {
          background: transparent;
        }
        .glass-menu-border {
          border: 1.5px solid rgba(110, 112, 130, 0.10);
        }
        .glass-menu-nav::-webkit-scrollbar {
          width: 0;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
