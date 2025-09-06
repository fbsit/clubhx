
import { useState, useCallback } from "react";
import { useQuotation } from "@/contexts/QuotationContext";
import { fetchProducts } from "@/services/productsApi";
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface ParsedProduct {
  name: string;
  quantity: number;
  found: boolean;
  productId?: string;
}

export default function ExcelPurchaseFlow() {
  const { addItem } = useQuotation();
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = () => {
    // Simulate Excel template download
    const csvContent = "Nombre del Producto,Cantidad\nIGORA Royal 7-0,2\nBC Bonacure Shampoo,1\nOSiS+ Session Label,3";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-productos-club-hx.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Template descargado", {
      description: "Completa el archivo con tus productos y súbelo aquí"
    });
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate file processing
    setTimeout(() => {
      setParsedProducts([]);
      setIsProcessing(false);
      
      toast.success("Archivo procesado", {
        description: `0 productos encontrados`
      });
    }, 2000);
  }, []);

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const handleAddToQuotation = () => {
    const foundProducts = parsedProducts.filter(p => p.found);
    
    foundProducts.forEach(parsedProduct => {
      const product = allProducts.find(p => p.id === parsedProduct.productId);
      if (product) {
        addItem(product, parsedProduct.quantity);
      }
    });

    toast.success("Productos agregados", {
      description: `${foundProducts.length} productos agregados a tu cotización`
    });
    
    setParsedProducts([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Download Template Section */}
      <Card className="shadow-sm border border-border/40 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Descargar Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Descarga nuestro template Excel, complétalo con los productos que necesitas y súbelo aquí.
          </p>
          <Button onClick={handleDownloadTemplate} variant="outline" className="w-full">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Descargar Template Excel
          </Button>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="shadow-sm border border-border/40 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Archivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
            <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Arrastra tu archivo Excel aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
              disabled={isProcessing}
            />
            <label htmlFor="excel-upload">
              <Button variant="outline" disabled={isProcessing} asChild>
                <span>
                  {isProcessing ? "Procesando..." : "Seleccionar Archivo"}
                </span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {parsedProducts.length > 0 && (
        <Card className="shadow-sm border border-border/40 rounded-xl">
          <CardHeader>
            <CardTitle>Productos Procesados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {parsedProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.found ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <Badge variant={product.found ? "default" : "destructive"}>
                    {product.found ? "Encontrado" : "No encontrado"}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {parsedProducts.filter(p => p.found).length} de {parsedProducts.length} productos encontrados
              </div>
              <Button 
                onClick={handleAddToQuotation}
                disabled={parsedProducts.filter(p => p.found).length === 0}
              >
                Agregar a Cotización
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
