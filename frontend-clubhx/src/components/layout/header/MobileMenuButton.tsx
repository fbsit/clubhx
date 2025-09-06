
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuButtonProps {
  className?: string;
}

export default function MobileMenuButton({ className }: MobileMenuButtonProps) {
  return (
    <SheetTrigger asChild className={className}>
      <Button size="icon" variant="ghost">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Abrir menú</span>
      </Button>
    </SheetTrigger>
  );
}
