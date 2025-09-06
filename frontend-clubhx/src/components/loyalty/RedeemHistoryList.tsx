
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import RedeemHistoryAccordionItem from "./RedeemHistoryAccordionItem";

type RedeemHistoryItem = {
  id: string;
  title: string;
  points: number;
  date: string; // ISO
  status: "entregado" | "pendiente";
  category: "product" | "discount" | "event" | "training";
};

interface RedeemHistoryListProps {
  history: RedeemHistoryItem[];
}

export default function RedeemHistoryList({ history }: RedeemHistoryListProps) {
  if (!history.length) {
    return (
      <div className="py-6 text-center text-muted-foreground text-sm">
        Aún no tienes canjes registrados.
      </div>
    );
  }

  // Accordion principal plegable: controla abrir/cerrar sección "Historial de Canjes"
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="REDEEM-HISTORY" className="mb-8 bg-muted/50 rounded-xl shadow-sm">
        <AccordionTrigger className="text-lg font-semibold px-4 py-4 rounded-t-xl hover:bg-muted/80 transition-colors w-full text-left">
          Historial de Canjes
        </AccordionTrigger>
        <AccordionContent className="px-2 pt-0 pb-4">
          <Accordion type="multiple" className="w-full">
            {history.map(item => (
              <RedeemHistoryAccordionItem key={item.id} item={item} />
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

