import { toast } from "sonner";

/**
 * Handle errors and recovery attempts with improved timing
 */
export const handleError = (error: unknown, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  // Don't show toast for harmless errors
  const harmlessErrors = [
    "ResizeObserver",
    "Loading chunk",
    "Failed to fetch dynamically imported module",
    "Cannot read properties of null",
    "Cannot read properties of undefined",
    "ChunkLoadError",
    "Loading CSS chunk",
    "Non-Error promise rejection captured"
  ];
  
  if (error instanceof Error && 
    harmlessErrors.some(pattern => 
      error.message.includes(pattern) || error.stack?.includes(pattern)
    )) {
    console.log(`Suppressing harmless error toast for: ${error.message}`);
    return;
  }
  
  // Only show toast for actual user-facing errors, don't reload
  if (!(error instanceof Response)) {
    toast.error("Ocurrió un error", {
      description: "El error ha sido registrado. La aplicación continúa funcionando.",
      duration: 3000,
    });
  }
};

/**
 * Enhanced recovery function with better timing and cleanup - NO RELOADS
 */
export const attemptRecovery = (): void => {
  try {
    // Clear any stuck animation classes
    document.querySelectorAll('.animate-fade-in, .animate-enter, .animate-pulse').forEach(el => {
      el.classList.remove('animate-fade-in', 'animate-enter', 'animate-pulse');
      el.classList.add('opacity-100');
    });
    
    // Fix stuck transitions with more comprehensive cleanup
    document.querySelectorAll('[style*="transition"], [style*="transform"], [style*="opacity"]').forEach(el => {
      if (el instanceof HTMLElement) {
        // Reset opacity
        if (el.style.opacity === "0" || el.style.opacity === "") {
          el.style.opacity = "1";
        }
        
        // Reset transforms
        if (el.style.transform && (
          el.style.transform.includes("translateY") || 
          el.style.transform.includes("scale") ||
          el.style.transform === "none"
        )) {
          el.style.transform = "";
        }
        
        // Re-enable interactions
        if (el.style.pointerEvents === "none") {
          el.style.pointerEvents = "auto";
        }
      }
    });
    
    // Clear any loading states that might be stuck
    document.querySelectorAll('[data-loading="true"], .loading').forEach(el => {
      el.removeAttribute('data-loading');
      el.classList.remove('loading');
    });
    
    // Force layout recalculation without reload
    document.body.offsetHeight;
    
    console.log("Recovery attempt completed successfully - no reload needed");
  } catch (recoveryError) {
    console.error("Error during recovery attempt:", recoveryError);
    // Even if recovery fails, don't reload the page
  }
};

/**
 * Enhanced DOM stability check
 */
export const isDOMStable = (): boolean => {
  try {
    // Check if main app elements exist and are properly rendered
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const appRoot = document.getElementById('root');
    
    // Check for React rendering errors
    const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
    const hasVisibleErrors = Array.from(errorBoundaries).some(el => 
      el.textContent?.includes('Algo salió mal') || 
      el.textContent?.includes('Something went wrong')
    );
    
    // Check for stuck loading states
    const loadingElements = document.querySelectorAll('.animate-spin, .animate-pulse, [data-loading="true"]');
    const hasStuckLoading = loadingElements.length > 10; // Too many loading indicators
    
    // Check if content is actually visible
    const hasVisibleContent = main && main.children.length > 0 && 
      Array.from(main.children).some(child => {
        const style = window.getComputedStyle(child);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });
    
    const isStable = !!(
      appRoot && 
      header && 
      main && 
      !hasVisibleErrors && 
      !hasStuckLoading &&
      hasVisibleContent
    );
    
    console.log("DOM stability check:", {
      hasAppRoot: !!appRoot,
      hasHeader: !!header,
      hasMain: !!main,
      hasVisibleErrors,
      hasStuckLoading,
      hasVisibleContent,
      loadingCount: loadingElements.length,
      isStable
    });
    
    return isStable;
  } catch (e) {
    console.error("Error checking DOM stability:", e);
    return false;
  }
};

/**
 * Enhanced memory leak detection
 */
export const checkForMemoryLeaks = (): void => {
  try {
    // Count DOM nodes
    const nodeCount = document.querySelectorAll('*').length;
    console.log("Total DOM nodes:", nodeCount);
    
    // Check for excessive event listeners (approximation)
    const elementsWithEvents = document.querySelectorAll('[onclick], [onmousedown], [onmouseup], [onkeydown]');
    console.log("Elements with direct event handlers:", elementsWithEvents.length);
    
    // Check for memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log("Memory usage:", {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      });
    }
    
    // Warnings for potential issues
    if (nodeCount > 8000) {
      console.warn("High DOM node count detected - possible memory leak");
    }
    
    if (elementsWithEvents.length > 100) {
      console.warn("High number of direct event handlers - consider using event delegation");
    }
  } catch (error) {
    console.error("Error checking for memory leaks:", error);
  }
};
