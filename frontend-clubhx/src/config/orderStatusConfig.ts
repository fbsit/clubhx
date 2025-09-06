
import { StatusConfigMap } from "@/types/order";

export const statusConfig: StatusConfigMap = {
  "requested": {
    label: "Solicitud enviada",
    color: "bg-amber-500",
    description: "Tu solicitud de cotización ha sido enviada y está en revisión."
  },
  "quotation": {
    label: "Cotización recibida",
    color: "bg-blue-500",
    description: "Has recibido la cotización con precios y disponibilidad. Aún puedes modificar tu solicitud."
  },
  "pending_approval": {
    label: "Pendiente de aprobación",
    color: "bg-orange-500",
    description: "Tu pedido ha sido modificado por el vendedor y está esperando tu aprobación."
  },
  "accepted": {
    label: "Aceptado",
    color: "bg-green-500",
    description: "Tu pedido ha sido aceptado y está siendo procesado."
  },
  "invoiced": {
    label: "Facturado",
    color: "bg-purple-500",
    description: "Tu pedido ha sido facturado y está listo para ser enviado."
  },
  "shipped": {
    label: "Enviado",
    color: "bg-indigo-500",
    description: "Tu pedido ha sido enviado y está en camino."
  },
  "delivered": {
    label: "Entregado", 
    color: "bg-green-600",
    description: "Tu pedido ha sido entregado. Pendiente de pago según términos acordados."
  },
  "payment_pending": {
    label: "Esperando Verificación",
    color: "bg-amber-500",
    description: "Tu comprobante de pago ha sido recibido y está siendo verificado por nuestro equipo."
  },
  "paid": {
    label: "Pagado",
    color: "bg-emerald-600",
    description: "El pago ha sido procesado exitosamente."
  },
  "completed": {
    label: "Completado",
    color: "bg-green-700",
    description: "Tu pedido ha sido entregado y completado correctamente."
  },
  "rejected": {
    label: "Rechazado",
    color: "bg-red-500",
    description: "Tu cotización ha sido rechazada. Contáctanos para más información."
  },
  "canceled": {
    label: "Cancelado",
    color: "bg-red-500",
    description: "Tu pedido ha sido cancelado."
  },
  "processing": {
    label: "En proceso",
    color: "bg-blue-500",
    description: "Tu pedido está siendo procesado."
  }
};
