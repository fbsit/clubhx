
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Settings, Package, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CategoryFormDialog from "./CategoryFormDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import { ProductCategory } from "@/pages/admin/AdminCategories";
import { toast } from "sonner";

interface MobileAdminCategoriesProps {
  categories: ProductCategory[];
  onCreateCategory: () => void;
  onEditCategory: (category: ProductCategory) => void;
  onDeleteCategory: (category: ProductCategory) => void;
}

export default function MobileAdminCategories({
  categories,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory
}: MobileAdminCategoriesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ProductCategory | null>(null);

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteCategory = (category: ProductCategory) => {
    setDeletingCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSaveCategory = (categoryData: Omit<ProductCategory, 'id' | 'productCount'>) => {
    // This would be handled by the parent component in a real implementation
    setDialogOpen(false);
    setEditingCategory(null);
    toast.success(editingCategory ? "Categoría actualizada" : "Categoría creada");
  };

  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingCategory(null);
    toast.success("Categoría eliminada");
  };

  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Categorías</h1>
            <p className="text-sm text-muted-foreground">
              {categories.length} categorías
            </p>
          </div>
          <Button size="sm" onClick={handleCreateCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm text-muted-foreground">Categorías</div>
              <div className="text-2xl font-bold">{categories.length}</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-sm text-muted-foreground">Productos</div>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </div>
          </Card>
        </div>

        {/* Categories List */}
        <div className="space-y-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-2xl">{category.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.productCount}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {category.description || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleEditCategory(category)}
                        className="gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCategory(category)}
                        className="gap-2 text-red-600"
                        disabled={category.productCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {category.productCount > 0 && (
                  <div className="mt-3 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    No se puede eliminar: tiene productos asignados
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No hay categorías</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera categoría para organizar los productos
            </p>
            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Categoría
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSaveCategory}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={deletingCategory}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
