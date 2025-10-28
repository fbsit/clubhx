import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotation } from "@/contexts/QuotationContext";
import QuotationStepProgress from "./checkout/QuotationStepProgress";
import QuotationSummary from "./checkout/QuotationSummary";
import HelpCard from "./checkout/HelpCard";
import ReviewProductsStep from "./checkout/ReviewProductsStep";
import DeliveryMethodStep from "./checkout/DeliveryMethodStep";
import ConfirmStep from "./checkout/ConfirmStep";
import SuccessView from "./checkout/SuccessView";
import { toast } from "sonner";
import { submitOrder } from "@/services/ordersApi";
import type { AddressPayload } from "@/services/addressesApi";

export default function QuotationCheckout() {
  const { items, totalAmount, clearQuotation } = useQuotation();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [notes, setNotes] = useState("");
  const [deliveryMethod] = useState<"delivery">("delivery");
  const [shippingTypeId, setShippingTypeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressPayload | null>(null);

  // Calculate shipping cost for delivery
  const getShippingCost = () => {
    return 5500; // Base shipping cost
  };

  const handleSubmitQuotation = async () => {
    try {
      setLoading(true);
      const defaultStore = '229a1e29-7191-43d4-9b99-4bd190d177b6';// (import.meta as any)?.env?.VITE_DEFAULT_STORE_ID as string | undefined;
      const defaultSeller = user?.providerSellerPk;
      console.log(user);
      const clientId = user?.id;
      const sellerId = defaultSeller;
      const storeId = defaultStore;

      if (!clientId || !sellerId || !storeId) {
        throw new Error("Faltan identificadores (cliente, vendedor o tienda). Configura VITE_DEFAULT_STORE_ID y VITE_DEFAULT_SELLER_ID si aplica.");
      }

      if (!deliveryAddress) {
        setStep(2);
        throw new Error("Selecciona o crea una dirección de entrega antes de continuar.");
      }

      const payload = {
        client: String(clientId),
        seller: String(sellerId),
        store: String(storeId),
        discount_requested: false,
        items: items.map(i => ({
          product: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
          discount_percentage: i.product.discount ?? 0,
        })),
        comments: notes,
        shipping_type: String(shippingTypeId || ''),
        // Mapear dirección de entrega
        address: [
          deliveryAddress.street,
          deliveryAddress.number && `#${deliveryAddress.number}`,
          deliveryAddress.apartment && deliveryAddress.apartment,
        ].filter(Boolean).join(' '),
        municipality: deliveryAddress.commune,
        city: deliveryAddress.city,
        region: deliveryAddress.region,
        phone: deliveryAddress.phone,
        // Otros campos pueden mapearse desde futuros pasos del checkout
      } as const;

      const resp = await submitOrder(payload);
      if (resp?.ok && resp?.success_url) {
        setSubmitted(true);
        clearQuotation();
        toast.success("¡Pedido creado exitosamente!", { description: `ID: ${resp.id}` });
        // Opcional: redirigir
        // window.location.href = resp.success_url;
      } else {
        throw new Error("No se pudo crear el pedido");
      }
      setSubmitted(true);
      clearQuotation();
      toast.success("¡Cotización enviada exitosamente!", { description: "Te contactaremos pronto con una respuesta." });
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
              onAddressSelected={(addr) => setDeliveryAddress(addr)}
              onShippingTypeSelected={(id) => setShippingTypeId(id)}
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
