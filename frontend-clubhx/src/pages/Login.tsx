
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import QATestingGuide from "@/components/auth/QATestingGuide";
import ClientRegistrationFlow from "@/components/auth/ClientRegistrationFlow";
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, TestTube, UserPlus } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showQAGuide, setShowQAGuide] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the return path from location state
  const returnPath = location.state?.returnPath || "/products";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Navigation is handled inside login function based on user role
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleQuickLogin = (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
  };

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
  };

  if (showRegistration) {
    return <ClientRegistrationFlow onComplete={handleRegistrationComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-secondary/30">
      <div className="w-full max-w-md mb-8">
        <img 
          src="/lovable-uploads/598e04db-7596-4344-9b48-c02240f5daad.png" 
          alt="CLUB HX Logo" 
          className="h-20 mx-auto dark:hidden"
        />
        <img 
          src="/lovable-uploads/47040f1c-eb1d-4e0a-b62e-ec7224549120.png" 
          alt="CLUB HX Logo" 
          className="h-20 mx-auto hidden dark:block"
        />
      </div>

      <Card className="w-full max-w-md animate-scale shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Ingresa a tu cuenta</CardTitle>
          <CardDescription className="text-center">
            Accede a la plataforma exclusiva para profesionales
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {/* Quick Access for Testing */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <TestTube className="h-4 w-4" />
                Acceso rápido para testing
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("admin@clubhx.com", "admin123")}
                    className="text-xs"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("sales@clubhx.com", "sales123")}
                    className="text-xs"
                  >
                    Sales
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("client@clubhx.com", "client123")}
                    className="text-xs"
                  >
                    Client
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                ¿No tienes cuenta?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistration(true)}
                className="w-full h-11 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Registrar nuevo cliente
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {/* QA Testing Guide Toggle */}
      <div className="mt-6 w-full max-w-4xl">
        <Button
          variant="outline"
          onClick={() => setShowQAGuide(!showQAGuide)}
          className="w-full"
        >
          <TestTube className="h-4 w-4 mr-2" />
          {showQAGuide ? "Ocultar" : "Mostrar"} Guía para Testers QA
        </Button>
        
        {showQAGuide && (
          <div className="mt-4">
            <QATestingGuide />
          </div>
        )}
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog 
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}
