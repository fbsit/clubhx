
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminNavigationGroups } from "./admin/AdminNavigationGroups";

type AdminSidebarProps = {
  sidebarState: "expanded" | "collapsed" | "icon";
};

export default function AdminSidebar({ sidebarState }: AdminSidebarProps) {
  const { user } = useAuth();
  const collapsed = sidebarState === "collapsed" || sidebarState === "icon";

  return (
    <aside className={`hidden md:flex flex-col border-r bg-card h-full transition-all duration-300 ${
      collapsed ? "w-[70px]" : "w-64"
    }`}>
      <ScrollArea className="flex-1 h-full p-4">
        <AdminNavigationGroups collapsed={collapsed} />
      </ScrollArea>
    </aside>
  );
}
