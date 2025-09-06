
import { useAuth } from "@/contexts/AuthContext";
import Header from "./Header";
import { CollapsibleProvider } from "@/contexts/CollapsibleContext";
import { ErrorBoundary } from "../ErrorBoundary";
import MainContent from "./MainContent";
import NavigationSidebar from "./NavigationSidebar";
import { NotificationInitializer } from "./NotificationInitializer";
import { salesNavigationGroups } from "./sales/SalesNavigationData";
import FloatingActionMenu from "./sales/FloatingActionMenu";
import AdminFloatingActionMenu from "./admin/AdminFloatingActionMenu";
import ClientFloatingActionMenu from "./client/ClientFloatingActionMenu";
import { useAdminNavigationGroups } from "./admin/AdminNavigationData";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isInitialized } = useAuth();
  const adminNavigationGroups = useAdminNavigationGroups();

  // Sales navigation for FAB
  const salesNavigation = salesNavigationGroups
    .reduce((all, group) => all.concat(group.items), []);

  // Admin navigation for FAB
  const adminNavigation = adminNavigationGroups
    .reduce((all, group) => all.concat(group.items), []);

  const activePath = window?.location?.pathname || "";

  // Simple loading state
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  // Always render the full layout once initialized
  return (
    <ErrorBoundary>
      <CollapsibleProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <NotificationInitializer />
          <Header />

          <div className="flex flex-1">
            <NavigationSidebar user={user} />
            <MainContent>{children}</MainContent>
          </div>

          {/* FAB for sales users on mobile */}
          {user?.role === "sales" && (
            <FloatingActionMenu
              user={{
                name: user.name,
                company: user.company ?? "",
                avatarUrl: user.avatarUrl ?? ""
              }}
              navigation={salesNavigation}
              activePath={activePath}
              logout={logout}
            />
          )}

          {/* FAB for admin users on mobile */}
          {user?.role === "admin" && (
            <AdminFloatingActionMenu
              user={{
                name: user.name,
                company: user.company ?? "",
                avatarUrl: user.avatarUrl ?? ""
              }}
              activePath={activePath}
              logout={logout}
            />
          )}

          {/* FAB for client users on mobile */}
          {user?.role === "client" && (
            <ClientFloatingActionMenu
              user={{
                name: user.name,
                company: user.company ?? "",
                avatarUrl: user.avatarUrl ?? ""
              }}
              activePath={activePath}
              logout={logout}
            />
          )}
        </div>
      </CollapsibleProvider>
    </ErrorBoundary>
  );
}
