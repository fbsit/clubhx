
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    
    // Clear any stuck animations or states WITHOUT reloading
    try {
      document.querySelectorAll('.animate-fade-in, .animate-enter, .animate-pulse').forEach(el => {
        el.classList.remove('animate-fade-in', 'animate-enter', 'animate-pulse');
        el.classList.add('opacity-100');
      });
      
      console.log("Error boundary reset - continuing without reload");
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
      // Still don't reload even if cleanup fails
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          
          <h2 className="text-xl font-semibold mb-2">Error temporal</h2>
          
          <p className="text-muted-foreground mb-4">
            Ha ocurrido un error, pero se puede continuar usando la aplicación.
          </p>

          <Button 
            onClick={this.handleReset}
            className="flex items-center gap-2"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" /> Continuar
          </Button>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left text-xs text-muted-foreground max-w-full">
              <summary className="cursor-pointer mb-2">Detalles técnicos</summary>
              <div className="space-y-2">
                <div>
                  <strong>Error:</strong>
                  <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </div>
                {this.state.error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
