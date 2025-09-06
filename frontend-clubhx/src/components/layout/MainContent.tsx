
import { useAuth } from "@/contexts/AuthContext";

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isInitialized } = useAuth();

  // Simple loading state - no complex conditional rendering
  if (!isInitialized) {
    return (
      <main className="flex-1 p-3 sm:p-5 z-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-2 text-muted-foreground">Cargando contenido...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Always render children once initialized
  return (
      <main className="flex-1 py-3 sm:p-5 z-20 relative px-0 sm:px-5">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}
