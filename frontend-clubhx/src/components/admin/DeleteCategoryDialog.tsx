
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProductCategory } from "@/pages/admin/AdminCategories";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ProductCategory | null;
  onConfirm: () => void;
}

export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onConfirm
}: DeleteCategoryDialogProps) {
  if (!category) return null;

  const hasProducts = category.productCount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasProducts ? "No se puede eliminar" : "¿Eliminar categoría?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {hasProducts ? (
              <>
                La categoría <strong>{category.name}</strong> no se puede eliminar porque tiene{" "}
                <strong>{category.productCount} productos</strong> asignados.
                <br /><br />
                Para eliminarla, primero debes reasignar o eliminar todos los productos de esta categoría.
              </>
            ) : (
              <>
                ¿Estás seguro de que quieres eliminar la categoría <strong>{category.name}</strong>?
                <br /><br />
                Esta acción no se puede deshacer.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {hasProducts ? "Entendido" : "Cancelar"}
          </AlertDialogCancel>
          {!hasProducts && (
            <AlertDialogAction 
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
