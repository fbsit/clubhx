import { useState } from "react";
import { useQuotation } from "@/contexts/QuotationContext";
import QuotationStepProgress from "./checkout/QuotationStepProgress";
import QuotationSummary from "./checkout/QuotationSummary";
import HelpCard from "./checkout/HelpCard";
import ReviewProductsStep from "./checkout/ReviewProductsStep";
import DeliveryMethodStep from "./checkout/DeliveryMethodStep";
import ConfirmStep from "./checkout/ConfirmStep";
import SuccessView from "./checkout/SuccessView";
import { toast } from "sonner";
import { createOrder } from "@/services/ordersApi";

export default function QuotationCheckout() {
  const { items, totalAmount, clearQuotation } = useQuotation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [notes, setNotes] = useState("");
  const [deliveryMethod] = useState<"delivery">("delivery");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Calculate shipping cost for delivery
  const getShippingCost = () => {
    return 5500; // Base shipping cost
  };

  const handleSubmitQuotation = async () => {
    try {
      setLoading(true);
      const payload = {
        items: items.map(i => ({ product: i.product.id, quantity: i.quantity })),
        notes,
        // Opcionales: agrega si los manejas en UI
        // shipping_type: selectedShippingId,
        // payment_method: selectedPaymentId,
      };
      await createOrder(payload);
      setSubmitted(true);
      clearQuotation();
      toast.success("¡Cotización enviada exitosamente!", {
        description: "Te contactaremos pronto con una respuesta.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al enviar la cotización";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(prev => (prev === 1 ? 2 : 3) as 1 | 2 | 3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => (prev === 3 ? 2 : 1) as 1 | 2 | 3);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Revisar productos";
      case 2: return "Opciones de entrega";
      case 3: return "Confirmar y enviar";
      default: return "Revisar cotización";
    }
  };

  // After submission success
  if (submitted) {
    return <SuccessView />;
  }

  return (
    <div className="animate-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
        <p className="text-muted-foreground mt-1">
          {step === 1 && "Revisa los productos de tu cotización"}
          {step === 2 && "Selecciona cómo quieres recibir tus productos"}
          {step === 3 && "Confirma los detalles y envía tu solicitud"}
        </p>
      </div>
      
      {/* Progress steps */}
      <QuotationStepProgress currentStep={step} />
      
      {/* Step content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Order details */}
        <div className="md:col-span-2 space-y-6">
          {step === 1 && (
            <ReviewProductsStep 
              items={items} 
              notes={notes} 
              setNotes={setNotes} 
              onNext={nextStep} 
            />
          )}
          
          {step === 2 && (
            <DeliveryMethodStep 
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          
          {step === 3 && (
            <ConfirmStep 
              items={items}
              notes={notes}
              deliveryMethod={deliveryMethod}
              onPrev={prevStep}
              onSubmit={handleSubmitQuotation}
              loading={loading}
            />
          )}
        </div>
        
        {/* Right column - Order summary */}
        <div className="space-y-6">
          <QuotationSummary 
            items={items} 
            totalAmount={totalAmount}
            shippingCost={getShippingCost()}
          />
          <HelpCard />
        </div>
      </div>
    </div>
  );
}
