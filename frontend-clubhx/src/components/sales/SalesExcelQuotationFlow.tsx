import { useState, useCallback, useMemo, useRef, useId } from "react";
import { Download, Upload, FileSpreadsheet, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { mockProducts } from "@/data/mockProducts";
import type { ProductType } from "@/types/product";
// XLSX is loaded dynamically inside the file upload handler to keep initial bundle light

interface ParsedRow {
  rawSku?: string;
  rawName?: string;
  rawQty?: number;
  product?: ProductType;
  quantity: number;
  status: "found" | "not_found" | "invalid";
  reason?: string;
}

export default function SalesExcelQuotationFlow() {
  const { addItem, selectedCustomer } = useSalesQuotation();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();


  const skuIndex = useMemo(() =>
    new Map(mockProducts.map(p => [p.sku?.toLowerCase() || "", p])), []
  );
  const handleDownloadTemplate = () => {
    const sample = mockProducts.slice(0, 3).map(p => `${p.sku},1`).join("\n");
    const csvContent = `SKU,Cantidad\n${sample || "SKU-001,1"}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_cotizacion_vendedor.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Plantilla descargada", { description: "Llena SKU y Cantidad y vuelve a subir el archivo." });
  };

  const findProduct = (sku?: string, name?: string): ProductType | undefined => {
    if (sku) {
      const bySku = skuIndex.get(sku.toLowerCase());
      if (bySku) return bySku;
    }
    if (name) {
      const lower = name.toLowerCase();
      return mockProducts.find(p => p.name.toLowerCase().includes(lower));
    }
    return undefined;
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadStatus("processing");
    setUploadMessage("Procesando archivo...");
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const XLSX = await import("xlsx");
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!json.length) {
          setRows([]);
          toast.error("Archivo vacío o sin datos");
          setUploadStatus("error");
          setUploadMessage("Archivo vacío o sin datos");
          setIsProcessing(false);
          return;
        }

        const norm = (s: string) => s.toString().trim().toLowerCase();
        const pickCol = (obj: any, candidates: string[]) => {
          const keys = Object.keys(obj);
          for (const key of keys) {
            if (candidates.includes(norm(key))) return key;
          }
          return undefined;
        };

        const first = json[0];
        const skuKey = pickCol(first, ["sku", "sku_id", "codigo", "código"]);
        const qtyKey = pickCol(first, ["cantidad", "qty", "quantity", "cant"]);
        const nameKey = pickCol(first, ["nombre", "producto", "name", "descripcion", "descripción"]);

        if (!skuKey && !nameKey) {
          toast.error("Faltan columnas", { description: "Agrega una columna SKU o Nombre" });
          setUploadStatus("error");
          setUploadMessage("Falta columna SKU o Nombre");
          setIsProcessing(false);
          return;
        }
        if (!qtyKey) {
          toast.error("Falta columna Cantidad", { description: "Agrega 'Cantidad' o 'Quantity'" });
          setUploadStatus("error");
          setUploadMessage("Falta columna Cantidad");
          setIsProcessing(false);
          return;
        }

        const parsed: ParsedRow[] = json.map((r, idx) => {
          const rawSku = skuKey ? String(r[skuKey]).trim() : undefined;
          const rawName = nameKey ? String(r[nameKey]).trim() : undefined;
          const q = Number(r[qtyKey]);
          const rawQty = Number.isFinite(q) ? q : NaN;

          if (!rawSku && !rawName) {
            return { rawSku, rawName, rawQty: q, quantity: 0, status: "invalid", reason: "Sin SKU o nombre" };
          }
          if (!Number.isFinite(rawQty) || rawQty <= 0) {
            return { rawSku, rawName, rawQty: q, quantity: 0, status: "invalid", reason: "Cantidad inválida" };
          }

          const product = findProduct(rawSku, rawName);
          if (!product) {
            return { rawSku, rawName, rawQty: q, quantity: rawQty, status: "not_found", reason: "Producto no encontrado" };
          }

          return { rawSku, rawName, rawQty: q, product, quantity: Math.min(rawQty, product.stock || rawQty), status: "found" };
        });

        setRows(parsed);
        const found = parsed.filter(r => r.status === "found").length;
        const notFound = parsed.filter(r => r.status === "not_found").length;
        const invalid = parsed.filter(r => r.status === "invalid").length;
        setUploadStatus("success");
        setUploadMessage(`${found} encontrados • ${notFound} no encontrados • ${invalid} inválidos`);
        toast.success("Archivo procesado", { description: `${found} productos identificados` });
      } catch (err) {
        console.error(err);
        setUploadStatus("error");
        setUploadMessage("Error al leer el archivo. Verifica el formato .xlsx/.xls/.csv");
        toast.error("No se pudo leer el archivo", { description: "Verifica el formato .xlsx/.xls/.csv" });
      } finally {
        setIsProcessing(false);
      }
    };

    // Read as ArrayBuffer to support xlsx
    reader.readAsArrayBuffer(file);
  }, [skuIndex]);

  const handleAddToQuotation = () => {
    if (!selectedCustomer) {
      toast.error("Selecciona un cliente", { description: "Busca y elige el cliente antes de cargar productos" });
      return;
    }

    const found = rows.filter(r => r.status === "found" && r.product);
    if (!found.length) {
      toast.error("Sin productos válidos");
      return;
    }

    found.forEach(r => {
      if (r.product) addItem(r.product, r.quantity);
    });

    toast.success("Productos agregados", { description: `${found.length} ítems añadidos a la cotización` });
    setRows([]);
  };

  const handleClearUpload = () => {
    setRows([]);
    setUploadedFileName(null);
    setUploadStatus("idle");
    setUploadMessage(null);
    const input = fileInputRef.current;
    if (input) input.value = "";
  };

  const foundCount = rows.filter(r => r.status === "found").length;
  const notFoundCount = rows.filter(r => r.status === "not_found").length;
  const invalidCount = rows.filter(r => r.status === "invalid").length;

  return (
    <div className="space-y-6 animate-fade-in" aria-label="Carga masiva por Excel para vendedores">
      <Card className="shadow-sm border border-border/40 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Carga Masiva (Vendedores)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Sube un archivo con columnas SKU y Cantidad. Opcionalmente puedes incluir Nombre del producto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" /> Descargar plantilla CSV
            </Button>
              <div>
                <input
                  ref={fileInputRef}
                  id={inputId}
                  type="file"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv, .xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                  disabled={isProcessing}
                />
                <Button
                  asChild
                  variant="outline"
                  disabled={isProcessing}
                  aria-label="Subir archivo de Excel o CSV para carga masiva"
                >
                  <label
                    htmlFor={inputId}
                    onClick={(e) => {
                      e.preventDefault();
                      const input = fileInputRef.current;
                      if (input) {
                        input.value = "";
                        input.click();
                      }
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" /> {isProcessing ? "Procesando..." : "Subir archivo"}
                  </label>
                </Button>
              </div>
          </div>
          {uploadStatus !== "idle" && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-border/40 bg-muted/30 p-3">
              <div className="flex items-start gap-3">
                {uploadStatus === "success" ? (
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                ) : uploadStatus === "error" ? (
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <FileSpreadsheet className="h-5 w-5" aria-hidden="true" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {uploadedFileName || "Archivo"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {uploadStatus === "processing" ? "Procesando archivo..." : uploadMessage}
                  </p>
                  {uploadStatus === "success" && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="secondary">Encontrados: {foundCount}</Badge>
                      <Badge variant="secondary">No encontrados: {notFoundCount}</Badge>
                      <Badge variant="secondary">Inválidos: {invalidCount}</Badge>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                >
                  Cambiar archivo
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClearUpload}
                  disabled={isProcessing}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Card className="shadow-sm border border-border/40 rounded-xl">
          <CardHeader>
            <CardTitle>Resultados del archivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rows.map((r, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {r.status === "found" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : r.status === "not_found" ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {r.product?.name || r.rawName || r.rawSku || "Fila"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {r.product?.sku || r.rawSku || "-"} • Cantidad: {r.rawQty ?? r.quantity}
                      </p>
                    </div>
                  </div>
                  <Badge variant={r.status === "found" ? "default" : "destructive"}>
                    {r.status === "found" ? "Encontrado" : r.reason || "No encontrado"}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {foundCount} de {rows.length} productos identificados
              </div>
              <Button onClick={handleAddToQuotation} disabled={foundCount === 0}>
                Agregar a Cotización
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
