import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ClientRegistrationRequest } from "@/types/auth";
import CompanyInfoStep from "./registration-steps/CompanyInfoStep";
import ContactInfoStep from "./registration-steps/ContactInfoStep";
import AddressInfoStep from "./registration-steps/AddressInfoStep";
import EmailVerificationStep from "./registration-steps/EmailVerificationStep";
import ConfirmationStep from "./registration-steps/ConfirmationStep";

export interface RegistrationFormData {
  companyName: string;
  rut: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  commune: string;
  region: string;
}

const initialFormData: RegistrationFormData = {
  companyName: "",
  rut: "",
  businessType: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  commune: "",
  region: ""
};

export default function ClientRegistrationFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { registerClient } = useAuth();

  const totalSteps = 5;
  const stepTitles = [
    "Información de la Empresa",
    "Datos de Contacto", 
    "Dirección",
    "Verificación de Email",
    "Confirmación"
  ];

  const updateFormData = (data: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.rut && formData.businessType);
      case 2:
        return !!(formData.contactName && formData.email && formData.phone);
      case 3:
        return !!(formData.address && formData.commune && formData.region);
      case 4:
        return emailVerified;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      toast.error("Por favor complete todos los campos requeridos");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!emailVerified) {
      toast.error("Debe verificar su email antes de continuar");
      return;
    }

    setIsLoading(true);
    try {
      await registerClient({
        companyName: formData.companyName,
        rut: formData.rut,
        businessType: formData.businessType as any,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        commune: formData.commune,
        region: formData.region,
        verificationCode: "verified"
      });
      
      setCurrentStep(5); // Go to confirmation step
    } catch (error) {
      toast.error("Error al enviar la solicitud. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = () => {
    setEmailVerified(true);
    toast.success("Email verificado correctamente");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <AddressInfoStep
            data={formData}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <EmailVerificationStep
            email={formData.email}
            onVerified={handleEmailVerified}
            verified={emailVerified}
          />
        );
      case 5:
        return (
          <ConfirmationStep
            data={formData}
            onComplete={onComplete}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

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

      <Card className="w-full max-w-2xl animate-scale shadow-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="text-2xl font-semibold text-center">
            Registro de Cliente CLUB HX
          </CardTitle>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Paso {currentStep} de {totalSteps}</span>
              <span>{Math.round(progressPercentage)}% completado</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-center text-sm font-medium text-muted-foreground">
              {stepTitles[currentStep - 1]}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          {currentStep < 5 && (
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              {currentStep === 4 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!emailVerified || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}