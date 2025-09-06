import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import CompanyInfoStep from "@/components/auth/registration-steps/CompanyInfoStep";
import ContactInfoStep from "@/components/auth/registration-steps/ContactInfoStep";
import AddressInfoStep from "@/components/auth/registration-steps/AddressInfoStep";
import { useAuth } from "@/contexts/AuthContext";

interface RegistrationFormData {
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

interface InternalClientRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
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

const steps = [
  { id: 1, title: "Información de la Empresa", component: CompanyInfoStep },
  { id: 2, title: "Datos de Contacto", component: ContactInfoStep },
  { id: 3, title: "Dirección", component: AddressInfoStep }
];

export default function InternalClientRegistrationDialog({
  open,
  onOpenChange,
  onClientCreated
}: InternalClientRegistrationDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleUpdateFormData = (data: Partial<RegistrationFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.rut && formData.businessType;
      case 2:
        return formData.contactName && formData.email && formData.phone;
      case 3:
        return formData.address && formData.commune && formData.region;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Por favor completa todos los campos requeridos");
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to create client directly as approved
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create client with approved status
      const newClient = {
        id: `C${String(Date.now()).slice(-3)}`,
        ...formData,
        status: 'approved',
        createdAt: new Date().toISOString(),
        createdBy: user?.id || 'admin',
        createdByRole: user?.role || 'admin',
        emailVerified: true // Auto-verified since created internally
      };

      console.log('New client created:', newClient);
      
      toast.success("Cliente creado exitosamente");
      
      // Reset form and close dialog
      setFormData(initialFormData);
      setCurrentStep(1);
      onOpenChange(false);
      onClientCreated?.();
      
    } catch (error) {
      toast.error("Error al crear el cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    const StepComponent = step.component;
    return (
      <StepComponent
        data={formData}
        onUpdate={handleUpdateFormData}
      />
    );
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Nuevo Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Paso {currentStep} de {steps.length}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {steps.find(s => s.id === currentStep)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getCurrentStepComponent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!validateCurrentStep()}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!validateCurrentStep() || isLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  "Creando..."
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Crear Cliente
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}