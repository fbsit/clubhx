
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type Step = "login" | "consent" | "sync" | "done" | "error";

type MockGoogleOAuthModalProps = {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
};

export const MockGoogleOAuthModal: React.FC<MockGoogleOAuthModalProps> = ({
  open,
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulate login next step
  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      if (!email || !password) {
        setStep("error");
        setLoading(false);
        return;
      }
      setStep("consent");
      setLoading(false);
    }, 1100);
  };

  // Simulate consent (permissions)
  const handleConsent = () => {
    setLoading(true);
    setTimeout(() => {
      setStep("sync");
      setLoading(false);
      // Simulate "syncing" time before finishing
      setTimeout(() => {
        setStep("done");
        setTimeout(() => {
          onSuccess();
          setStep("login");
          setEmail("");
          setPassword("");
        }, 900);
      }, 1600);
    }, 1400);
  };

  // Simulate error closing
  const handleErrorClose = () => {
    setStep("login");
    setEmail("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[350px]">
        {step === "login" && (
          <>
            <DialogHeader>
              <DialogTitle>
                Iniciar sesión con Google
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="google-email">Correo de Google</Label>
                <Input
                  id="google-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@gmail.com"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="google-password">Contraseña</Label>
                <Input
                  id="google-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleContinue} disabled={loading || !email || !password}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                Continuar
              </Button>
            </DialogFooter>
          </>
        )}
        {step === "consent" && (
          <>
            <DialogHeader>
              <DialogTitle>Conceder permisos a Google Calendar</DialogTitle>
            </DialogHeader>
            <div className="my-5 flex flex-col gap-3 px-2">
              <span className="text-sm">Esta aplicación solicita acceso a su Calendario de Google.</span>
              <div className="flex flex-col gap-1 border border-muted rounded bg-muted/60 p-3">
                <span>Permisos solicitados:</span>
                <ul className="pl-5 text-xs list-disc">
                  <li>Ver, editar y crear eventos de Google Calendar</li>
                  <li>Sincronizar disponibilidad</li>
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleConsent} disabled={loading}>
                {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                Permitir & Sincronizar
              </Button>
            </DialogFooter>
          </>
        )}
        {step === "sync" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
            <div className="text-center text-base font-semibold">Sincronizando con Google Calendar...</div>
            <div className="text-xs text-muted-foreground">Por favor, no cierre esta ventana.</div>
          </div>
        )}
        {step === "done" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none"><circle cx="16" cy="16" r="16" fill="#34A853"/><path d="M24.14 11.53l-9.12 9.12-4.14-4.14-1.42 1.41 5.56 5.56 10.54-10.53-1.42-1.42z" fill="#fff"/></svg>
            <div className="text-center text-green-700 font-semibold">¡Sincronización exitosa!</div>
          </div>
        )}
        {step === "error" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <span className="text-red-600 font-bold text-lg">Error</span>
            <div className="text-center text-sm">Por favor complete correo y contraseña válidos.</div>
            <Button onClick={handleErrorClose} className="mt-2">Cerrar</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

