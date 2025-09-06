import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface ProductBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (products: any[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface UploadState {
  step: "upload" | "preview" | "processing" | "complete";
  file: File | null;
  previewData: any[];
  validationErrors: ValidationError[];
  progress: number;
}

export default function ProductBulkUploadDialog({
  open,
  onOpenChange,
  onUploadComplete
}: ProductBulkUploadDialogProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    step: "upload",
    file: null,
    previewData: [],
    validationErrors: [],
    progress: 0
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      toast.error("Solo se permiten archivos Excel (.xlsx) o CSV (.csv)");
      return;
    }

    setUploadState(prev => ({ ...prev, file, step: "preview" }));
    
    // Simular procesamiento del archivo
    setTimeout(() => {
      const mockData = [
        {
          name: "IGORA ROYAL 6-00",
          description: "Tinte permanente rubio oscuro natural",
          price: 12990,
          category: "Color",
          type: "Hair dye",
          brand: "IGORA",
          stock: 50,
          sku: "IGORA-003"
        },
        {
          name: "BC Bonacure Repair Rescue",
          description: "Champú reparador para cabello dañado",
          price: 8990,
          category: "Care",
          type: "Shampoo",
          brand: "Bonacure (BC)",
          stock: 30,
          sku: "BC-001"
        }
      ];

      const mockErrors: ValidationError[] = [
        { row: 3, field: "sku", message: "SKU duplicado: IGORA-001" },
        { row: 5, field: "price", message: "Precio debe ser mayor a 0" }
      ];

      setUploadState(prev => ({
        ...prev,
        previewData: mockData,
        validationErrors: mockErrors
      }));
    }, 1000);
  };

  const handleConfirmUpload = () => {
    setUploadState(prev => ({ ...prev, step: "processing", progress: 0 }));
    
    // Simular procesamiento
    const interval = setInterval(() => {
      setUploadState(prev => {
        const newProgress = prev.progress + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          return { ...prev, progress: 100, step: "complete" };
        }
        return { ...prev, progress: newProgress };
      });
    }, 500);
  };

  const handleComplete = () => {
    onUploadComplete(uploadState.previewData);
    onOpenChange(false);
    setUploadState({
      step: "upload",
      file: null,
      previewData: [],
      validationErrors: [],
      progress: 0
    });
    toast.success(`${uploadState.previewData.length} productos importados correctamente`);
  };

  const downloadTemplate = () => {
    // En una implementación real, esto generaría y descargaría un archivo Excel
    toast.success("Descargando plantilla Excel...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carga Masiva de Productos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Upload */}
          {uploadState.step === "upload" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Selecciona un archivo Excel o CSV con los productos a importar
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Descargar Plantilla
                </Button>
              </div>

              <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Arrastra tu archivo aquí</p>
                  <p className="text-sm text-muted-foreground mb-4">o haz clic para seleccionar</p>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Seleccionar Archivo
                    </label>
                  </Button>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Los archivos deben incluir las columnas: nombre, descripción, precio, categoría, tipo, marca, stock, SKU.
                  Descarga la plantilla para ver el formato correcto.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step Preview */}
          {uploadState.step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Vista Previa</h3>
                  <p className="text-sm text-muted-foreground">
                    {uploadState.previewData.length} productos encontrados
                  </p>
                </div>
                <Badge variant={uploadState.validationErrors.length > 0 ? "destructive" : "default"}>
                  {uploadState.validationErrors.length} errores
                </Badge>
              </div>

              {uploadState.validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Se encontraron {uploadState.validationErrors.length} errores que deben corregirse antes de continuar.
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-60 overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Nombre</th>
                        <th className="p-2 text-left">Precio</th>
                        <th className="p-2 text-left">Categoría</th>
                        <th className="p-2 text-left">SKU</th>
                        <th className="p-2 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadState.previewData.map((product, index) => {
                        const hasError = uploadState.validationErrors.some(e => e.row === index + 2);
                        return (
                          <tr key={index} className={hasError ? "bg-red-50" : ""}>
                            <td className="p-2">{product.name}</td>
                            <td className="p-2">${product.price.toLocaleString()}</td>
                            <td className="p-2">{product.category}</td>
                            <td className="p-2">{product.sku}</td>
                            <td className="p-2">
                              {hasError ? (
                                <Badge variant="destructive">Error</Badge>
                              ) : (
                                <Badge variant="default">OK</Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setUploadState(prev => ({ ...prev, step: "upload" }))}
                >
                  Volver
                </Button>
                <Button 
                  onClick={handleConfirmUpload}
                  disabled={uploadState.validationErrors.length > 0}
                >
                  Importar {uploadState.previewData.length} Productos
                </Button>
              </div>
            </div>
          )}

          {/* Step Processing */}
          {uploadState.step === "processing" && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Importando productos...</h3>
                <p className="text-sm text-muted-foreground">
                  Procesando {uploadState.previewData.length} productos
                </p>
              </div>
              
              <div className="space-y-2">
                <Progress value={uploadState.progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  {uploadState.progress}% completado
                </p>
              </div>
            </div>
          )}

          {/* Step Complete */}
          {uploadState.step === "complete" && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">¡Importación Completada!</h3>
                <p className="text-sm text-muted-foreground">
                  Se importaron {uploadState.previewData.length} productos correctamente
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={handleComplete}>
                  Finalizar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}