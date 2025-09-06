
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderStatus } from "@/types/order";
import { RejectedOrCanceledStatus } from "./progress/RejectedOrCanceledStatus";
import { ProgressTrack } from "./progress/ProgressTrack";
import { CurrentStatusDescription } from "./progress/CurrentStatusDescription";

type OrderStatusProgressProps = {
  status: OrderStatus;
};

export default function OrderStatusProgress({ status }: OrderStatusProgressProps) {
  const isRejectedOrCanceled = status === "rejected" || status === "canceled";
  
  if (isRejectedOrCanceled) {
    return <RejectedOrCanceledStatus status={status} />;
  }

  return (
    <div className="space-y-4">
      <ProgressTrack status={status} />
      <CurrentStatusDescription status={status} />
    </div>
  );
}
