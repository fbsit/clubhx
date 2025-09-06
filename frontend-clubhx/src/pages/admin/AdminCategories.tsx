
import { useState } from "react";
import { useEffect } from "react";
import { fetchProducts } from "@/services/productsApi";
import { listCategories, createCategory, updateCategory, deleteCategory, Category } from "@/services/catalogApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, Trash2, Package, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminCategories from "@/components/admin/MobileAdminCategories";
import CategoryFormDialog from "@/components/admin/CategoryFormDialog";
import DeleteCategoryDialog from "@/components/admin/DeleteCategoryDialog";
import { toast } from "sonner";

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  productCount: number;
}

export default function AdminCategories() {
  const isMobile = useIsMobile();
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(500);
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [prods, cats] = await Promise.all([
          fetchProducts(500),
          listCategories(),
        ]);
        if (!cancelled) {
          setProducts(prods);
          setCategories(
            (cats as Category[]).map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              icon: c.icon,
              order: c.order ?? 0,
              productCount: c.productCount ?? prods.filter((p: any) => p.category === c.name).length,
            }))
          );
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando categorías");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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

  const handleSaveCategory = async (categoryData: Omit<ProductCategory, 'id' | 'productCount'>) => {
    try {
      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, categoryData);
        setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? {
          id: updated.id,
          name: updated.name,
          description: updated.description,
          icon: updated.icon,
          order: updated.order ?? 0,
          productCount: cat.productCount,
        } : cat));
        toast.success("Categoría actualizada correctamente");
      } else {
        const created = await createCategory(categoryData);
        setCategories(prev => [...prev, { id: created.id, name: created.name, description: created.description, icon: created.icon, order: created.order ?? 0, productCount: 0 }]);
        toast.success("Categoría creada correctamente");
      }
    } catch (e: any) {
      toast.error(e?.message || "No se pudo guardar la categoría");
    } finally {
      setDialogOpen(false);
      setEditingCategory(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
      toast.success("Categoría eliminada correctamente");
    } catch (e: any) {
      toast.error(e?.message || "No se pudo eliminar la categoría");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
    }
  };

  if (isMobile) {
    return (
      <MobileAdminCategories 
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    );
  }

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">
            Administra las categorías de productos del catálogo
          </p>
        </div>
        <Button onClick={handleCreateCategory} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Categorías</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Productos</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio por Categoría</p>
                <p className="text-2xl font-bold">
                  {categories.length ? Math.round(products.length / categories.length) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Cargando…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {category.productCount} productos
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                    className="h-8 w-8"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    disabled={category.productCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {category.description || "Sin descripción"}
              </p>
              {category.productCount > 0 && (
                <div className="mt-3 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                  Esta categoría no se puede eliminar porque tiene productos asignados
                </div>
              )}
            </CardContent>
          </Card>
        ))}
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
