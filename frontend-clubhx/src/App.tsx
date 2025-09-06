
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { useEffect, useState } from "react"
import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { ErrorBoundary } from "./components/ErrorBoundary"

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 50);
    
    return () => {
      clearTimeout(timer);
      // Clean up any lingering animation classes
      document.querySelectorAll('.animate-fade-in, .animate-enter').forEach(el => {
        el.classList.remove('animate-fade-in', 'animate-enter');
        el.classList.add('opacity-100');
      });
    };
  }, []);

  if (!isAppReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <TooltipProvider>
          <RouterProvider 
            router={router} 
            fallbackElement={
              <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-2 text-muted-foreground">Cargando...</p>
                </div>
              </div>
            }
          />
          <SonnerToaster position="top-right" closeButton />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
