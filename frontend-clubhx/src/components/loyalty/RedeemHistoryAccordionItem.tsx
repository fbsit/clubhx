
import { Badge } from "@/components/ui/badge";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Clock, Star, Gift, Package, Calendar, Check } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";

type RedeemHistoryItem = {
  id: string;
  title: string;
  points: number;
  date: string; // ISO
  status: "entregado" | "pendiente";
  category: "product" | "discount" | "event" | "training";
};

interface RedeemHistoryAccordionItemProps {
  item: RedeemHistoryItem;
}

function HistoryCategoryIcon({ category }: { category: string }) {
  switch (category) {
    case "product": return <Package size={18} className="text-primary" />;
    case "discount": return <Gift size={18} className="text-pink-500" />;
    case "event": return <Calendar size={18} className="text-blue-500" />;
    case "training": return <Star size={18} className="text-yellow-600" />;
    default: return <Package size={18} className="text-primary" />;
  }
}

export default function RedeemHistoryAccordionItem({ item }: RedeemHistoryAccordionItemProps) {
  return (
    <AccordionItem value={item.id} className="border-b-0 px-0 py-2">
      <AccordionTrigger className="flex items-center justify-between gap-1 hover:bg-muted/40 rounded-lg px-2 py-2 transition-colors">
        <span className="flex items-center gap-2 min-w-[110px]">
          {HistoryCategoryIcon({ category: item.category })}
          <span className="font-medium text-sm text-ellipsis line-clamp-1 max-w-[180px]">{item.title}</span>
        </span>
        <span className="text-xs flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          {format(new Date(item.date), "d MMM, yyyy", { locale: es })}
        </span>
        <Badge
          className={
            item.status === "entregado"
              ? "bg-green-100 text-green-700 border border-green-300 font-medium"
              : "bg-yellow-50 text-yellow-800 border border-yellow-300 font-medium"
          }
          variant="outline"
        >
          {item.status === "entregado"
            ? <>Entregado <Check size={16} className="inline ml-1" /></>
            : <>Pendiente<Clock size={16} className="inline ml-1" /></>
          }
        </Badge>
      </AccordionTrigger>
      <AccordionContent className="bg-muted/30 rounded-lg p-4 mt-2 animate-fade-in">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
          <dt className="font-medium col-span-1">Título</dt>
          <dd className="col-span-1">{item.title}</dd>
          <dt className="font-medium col-span-1">Fecha</dt>
          <dd className="col-span-1">{format(new Date(item.date), "d MMMM yyyy", { locale: es })}</dd>
          <dt className="font-medium col-span-1">Puntos Canjeados</dt>
          <dd className="col-span-1">{item.points.toLocaleString()}</dd>
          <dt className="font-medium col-span-1">Categoría</dt>
          <dd className="col-span-1">{{
            "product": "Producto físico",
            "discount": "Descuento",
            "event": "Evento",
            "training": "Capacitación"
          }[item.category]}</dd>
          <dt className="font-medium col-span-1">Estado</dt>
          <dd className="col-span-1">{item.status === "entregado" ? "Entregado" : "Pendiente"}</dd>
        </dl>
      </AccordionContent>
    </AccordionItem>
  );
}
