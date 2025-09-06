import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Key, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "email" | "code" | "success";

export default function ForgotPasswordDialog({ 
  open, 
  onOpenChange 
}: ForgotPasswordDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sendPasswordReset, resetPassword } = useAuth();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Ingrese su correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setStep("code");
      toast.success("Código de recuperación enviado a su email");
    } catch (error) {
      toast.error("Error al enviar el código de recuperación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Complete todos los campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, resetCode, newPassword);
      setStep("success");
      toast.success("Contraseña restablecida exitosamente");
    } catch (error) {
      toast.error("Error al restablecer la contraseña. Verifique el código.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    onOpenChange(false);
  };

  const renderEmailStep = () => (
    <form onSubmit={handleSendReset} className="space-y-4">
      <div className="text-center mb-4">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Recuperar Contraseña</h3>
        <p className="text-sm text-muted-foreground">
          Ingrese su correo electrónico para recibir un código de recuperación
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11"
          required
        />
      </div>

      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar Código"}
      </Button>
    </form>
  );

  const renderCodeStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="text-center mb-4">
        <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
          <Key className="h-6 w-6 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold">Ingrese el Código</h3>
        <p className="text-sm text-muted-foreground">
          Código enviado a: <strong>{email}</strong>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="resetCode">Código de Recuperación</Label>
        <Input
          id="resetCode"
          type="text"
          placeholder="Ingrese el código de 6 dígitos"
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="h-11 text-center font-mono tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva Contraseña</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="h-11"
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-11"
          minLength={6}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep("email")}
          className="flex-1 h-11"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <Button type="submit" className="flex-1 h-11" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Restablecer"}
        </Button>
      </div>
    </form>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-4">
      <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
        <CheckCircle className="h-6 w-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-800">
        Contraseña Restablecida
      </h3>
      <p className="text-muted-foreground">
        Su contraseña ha sido actualizada exitosamente. Ya puede iniciar sesión con su nueva contraseña.
      </p>
      <Button onClick={handleClose} className="w-full h-11">
        Ir a Iniciar Sesión
      </Button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">Recuperar Contraseña</DialogTitle>
          <DialogDescription className="sr-only">
            Proceso para recuperar su contraseña de acceso
          </DialogDescription>
        </DialogHeader>

        {step === "email" && renderEmailStep()}
        {step === "code" && renderCodeStep()}
        {step === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
}