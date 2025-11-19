import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Check, Clock, RefreshCw } from "lucide-react";
import { sendVerificationCode, verifyRegistrationCode } from "@/services/registrationApi";
import { toast } from "sonner";

interface EmailVerificationStepProps {
  email: string;
  onVerified: () => void;
  verified: boolean;
}

export default function EmailVerificationStep({ 
  email, 
  onVerified, 
  verified 
}: EmailVerificationStepProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Request server to send a verification code via email on mount
    (async () => {
      try {
        await sendVerificationCode(email);
      } catch {
        toast.error("No se pudo enviar el código de verificación");
      }
    })();
  }, [email]);

  useEffect(() => {
    if (timeLeft > 0 && !verified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, verified]);

  const handleVerify = async () => {
    if (!verificationCode.trim()) {
      toast.error("Ingrese el código de verificación");
      return;
    }

    setIsLoading(true);
    try {
      const { verified: isValid } = await verifyRegistrationCode(email, verificationCode);
      if (isValid) {
        onVerified();
      } else {
        toast.error("Código de verificación incorrecto");
      }
    } catch (error) {
      toast.error("Error al verificar el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimeLeft(300);
    setCanResend(false);
    setVerificationCode("");
    try {
      await sendVerificationCode(email);
      toast.success("Código de verificación enviado nuevamente");
    } catch {
      toast.error("No se pudo reenviar el código");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (verified) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">
          Email Verificado Correctamente
        </h3>
        <p className="text-muted-foreground">
          Su dirección de correo <strong>{email}</strong> ha sido verificada exitosamente.
        </p>
        <Badge variant="outline" className="text-green-700 border-green-300">
          <Check className="h-3 w-3 mr-1" />
          Verificado
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">
          Verifica tu correo electrónico
        </h3>
        <p className="text-muted-foreground">
          Hemos enviado un código de verificación a:
        </p>
        <p className="font-medium">{email}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationCode" className="text-sm font-medium">
          Código de Verificación *
        </Label>
        <Input
          id="verificationCode"
          type="text"
          placeholder="Ingresa el código de 6 dígitos"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="h-11 text-center text-lg font-mono tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <Button 
        onClick={handleVerify}
        disabled={isLoading || verificationCode.length !== 6}
        className="w-full h-11"
      >
        {isLoading ? "Verificando..." : "Verificar Código"}
      </Button>

      <div className="text-center space-y-2">
        {!canResend ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Reenviar código en {formatTime(timeLeft)}</span>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendCode}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reenviar código
          </Button>
        )}
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Si no recibes el código, revisa tu carpeta de spam o correo no deseado. 
          El código expira en 5 minutos.
        </p>
      </div>
    </div>
  );
}