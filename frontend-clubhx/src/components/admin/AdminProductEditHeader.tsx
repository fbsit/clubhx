
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye } from "lucide-react";

interface AdminProductEditHeaderProps {
  productId: string;
  productName: string;
  onBack: () => void;
  onPreview: () => void;
  onSave: () => void;
}

export default function AdminProductEditHeader({
  productId,
  productName,
  onBack,
  onPreview,
  onSave
}: AdminProductEditHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">ID: {productId}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPreview}>
          <Eye className="h-4 w-4 mr-2" />
          Vista previa
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
