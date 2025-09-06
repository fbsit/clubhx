
import { useState } from "react";
import { X, LayoutDashboard, Package, FileText, Users, Heart, Calendar, BarChart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Calendar: <Calendar className="h-5 w-5" />,
  BarChart: <BarChart className="h-5 w-5" />,
  User: <User className="h-5 w-5" />
};

type NavigationItem = {
  to: string;
  label: string;
  icon?: string | React.ReactNode;
};

type FloatingActionMenuProps = {
  user: { name: string; company?: string; avatarUrl?: string };
  navigation: NavigationItem[];
  activePath: string;
  logout: () => void;
};

const fabBtnClass =
  "flex items-center justify-center rounded-full shadow-xl bg-white/70 backdrop-blur-lg border border-white/40 text-primary transition-all hover:scale-105 active:scale-95 focus:scale-100";

export default function FloatingActionMenu({
  user,
  navigation,
  activePath
}: FloatingActionMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Remove "Mi Perfil" ("/main/profile") from the navigation grid
  const filteredNavigation = navigation.filter(
    item => !(item.to === "/main/profile")
  );

  // FAB close animation (rotates from "+" to "X")
  const FabIcon = open ? (
    <X size={34} strokeWidth={2.7} />
  ) : (
    <svg width={34} height={34} fill="none" viewBox="0 0 24 24">
      <rect x={3} y={11} width={18} height={2} rx={1} fill="currentColor" />
      <rect x={11} y={3} width={2} height={18} rx={1} fill="currentColor" />
    </svg>
  );

  return (
    <>
      {/* Overlay glass background when menu is open */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[3px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <button
          className={cn(fabBtnClass, "size-16")}
          aria-label={open ? "Cerrar menú principal" : "Abrir menú principal"}
          onClick={() => setOpen((v) => !v)}
          style={{ boxShadow: "0 8px 32px rgba(44,62,80,0.15)" }}
        >
          {/* Animación de transición */}
          <motion.span
            key={open ? "close" : "plus"}
            initial={{ scale: 0.9, rotate: open ? 180 : 0, opacity: 0.3 }}
            animate={{ scale: 1, rotate: open ? 180 : 0, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.28, duration: 0.16 }}
            className="flex items-center justify-center"
          >
            {FabIcon}
          </motion.span>
        </button>
      </div>

      {/* Floating glass menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center md:hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.24 }}
          >
            <motion.div
              className={cn(
                "flex flex-col items-center gap-1 px-3 pt-6 pb-5 shadow-2xl rounded-t-[2.2rem] border border-white/40",
                "bg-white/60 backdrop-blur-[16px] w-full max-w-sm mx-auto glass-menu"
              )}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.27, duration: 0.17 }}
              style={{
                background:
                  "linear-gradient(to top, rgba(255,255,255,0.82) 60%, rgba(255,255,255,0.56) 100%)",
                backdropFilter: "blur(16px)"
              }}
            >
              {/* Avatar perfil navegacional */}
              <button
                className="flex items-center gap-3 w-full rounded-xl px-3 py-2 bg-white/25 hover:bg-white/40 transition-colors"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => navigate("/main/profile"), 140);
                }}
                aria-label="Ir a perfil"
                type="button"
              >
                <Avatar className="h-11 w-11 ring-2 ring-background shadow">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.company}
                  </p>
                </div>
                <User className="h-4 w-4 text-primary/70" />
              </button>
              {/* Navegación responsive y scrollable */}
              <div className="grid grid-cols-2 gap-3 mt-2 mb-2 w-full max-w-xs">
                {filteredNavigation.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => {
                      setOpen(false);
                      setTimeout(() => navigate(item.to), 160);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center bg-white/70 text-primary/90 hover:text-black active:text-primary transition-all duration-150 group",
                      activePath === item.to
                        ? "bg-primary/10 border border-primary/30 font-bold"
                        : "hover:bg-white/90 border border-transparent",
                      "rounded-2xl py-3 px-1 scale-100 hover:scale-105 min-h-[70px]",
                      "overflow-hidden"
                    )}
                    style={{
                      boxShadow:
                        activePath === item.to
                          ? "0 2px 12px 0 rgba(44,62,80,0.10)"
                          : undefined,
                      minWidth: 0 // Prevent button overflow
                    }}
                  >
                    <span className="mb-1 text-lg flex items-center justify-center">
                      {typeof item.icon === "string"
                        ? iconMap[item.icon] || <User />
                        : item.icon || <User />}
                    </span>
                    <span className="text-xs font-semibold truncate max-w-[90px]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
            {/* Safe-area para iOS */}
            <div className="h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .glass-menu {
          border-top-left-radius: 2.2rem;
          border-top-right-radius: 2.2rem;
          box-shadow: 0 8px 32px 0 rgba(44,62,80,0.14);
          border-width: 1.5px;
        }
      `}</style>
    </>
  );
}

// FIN
