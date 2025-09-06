
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductCategory } from "@/pages/admin/AdminCategories";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ProductCategory | null;
  onSave: (data: Omit<ProductCategory, 'id' | 'productCount'>) => void;
}

const EMOJI_OPTIONS = ["🎨", "💆‍♀️", "✨", "⚗️", "🛠️", "💊", "🌿", "🔬", "💎", "🎯"];

export default function CategoryFormDialog({
  open,
  onOpenChange,
  category,
  onSave
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "🎨",
    order: 1
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        icon: category.icon || "🎨",
        order: category.order
      });
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "🎨",
        order: 1
      });
    }
  }, [category, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const isEditing = !!category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre de la categoría</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Coloración"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe brevemente esta categoría..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Icono</Label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  className={`p-3 text-2xl border rounded-lg hover:bg-muted transition-colors ${
                    formData.icon === emoji ? "border-primary bg-primary/10" : "border-border"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="order">Orden de visualización</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Número que determina el orden en que aparece la categoría
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
