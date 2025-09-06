import { ProductType } from "@/types/product";
import { Order, OrderStatus } from "@/types/order";

// Utility functions for exporting products data

export const downloadTemplate = () => {
  const templateData = [
    {
      nombre: "IGORA ROYAL 6-00",
      descripcion: "Tinte permanente rubio oscuro natural",
      precio: 12990,
      categoria: "Color",
      tipo: "Hair dye",
      marca: "IGORA",
      stock: 50,
      sku: "IGORA-003",
      esNuevo: "SI",
      esPopular: "NO",
      descuento: 0
    },
    {
      nombre: "BC Bonacure Repair Rescue",
      descripcion: "Champú reparador para cabello dañado",
      precio: 8990,
      categoria: "Care",
      tipo: "Shampoo",
      marca: "Bonacure (BC)",
      stock: 30,
      sku: "BC-001",
      esNuevo: "NO",
      esPopular: "SI",
      descuento: 15
    }
  ];

  downloadAsExcel(templateData, "plantilla_productos.xlsx");
};

export const exportAllProducts = (products: ProductType[]) => {
  const exportData = products.map(product => ({
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    categoria: product.category,
    tipo: product.type,
    marca: product.brand,
    stock: product.stock,
    sku: product.sku,
    esNuevo: product.isNew ? "SI" : "NO",
    esPopular: product.isPopular ? "SI" : "NO",
    descuento: product.discount,
    puntosLealtad: product.loyaltyPoints,
    rating: product.rating || 0,
    volumen: product.volume || 0,
    unidadVolumen: product.volumeUnit || "",
    opciones: product.options?.length || 0
  }));

  downloadAsExcel(exportData, `productos_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportFilteredProducts = (products: ProductType[], filterDescription: string) => {
  const exportData = products.map(product => ({
    nombre: product.name,
    descripcion: product.description,
    precio: product.price,
    categoria: product.category,
    tipo: product.type,
    marca: product.brand,
    stock: product.stock,
    sku: product.sku,
    esNuevo: product.isNew ? "SI" : "NO",
    esPopular: product.isPopular ? "SI" : "NO",
    descuento: product.discount,
    puntosLealtad: product.loyaltyPoints
  }));

  const filename = `productos_filtrados_${new Date().toISOString().split('T')[0]}.xlsx`;
  downloadAsExcel(exportData, filename);
};

// Helper function to simulate Excel download
// In a real implementation, this would use a library like xlsx or exceljs
const downloadAsExcel = (data: any[], filename: string) => {
  // Convert data to CSV format for demo purposes
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename.replace('.xlsx', '.csv'));
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Order export functions
export const exportFilteredOrders = (
  orders: Order[], 
  filters: { searchQuery: string; status: "all" | OrderStatus },
  salesPerson?: string
) => {
  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      requested: "Solicitado",
      quotation: "Cotización",
      pending_approval: "Pendiente aprobación",
      payment_pending: "Pendiente verificación",
      accepted: "Aceptado",
      invoiced: "Facturado",
      shipped: "Enviado",
      delivered: "Entregado",
      completed: "Completado",
      canceled: "Cancelado",
      rejected: "Rechazado",
      paid: "Pagado",
      processing: "En proceso"
    };
    return statusMap[status] || status;
  };

  const exportData = orders.map(order => ({
    "ID Pedido": order.id,
    "Cliente": order.customer,
    "Fecha": order.date,
    "Estado": getStatusLabel(order.status),
    "Total": `$${order.total.toLocaleString("es-CL")}`,
    "Productos": order.items?.length || 0,
    "Vendedor": salesPerson || "Sales",
    "Fecha Completado": order.completedDate || "",
    "Estado Entrega": order.status === "shipped" ? "En tránsito" : order.status === "delivered" ? "Entregado" : "Pendiente"
  }));

  // Generate filename with filters info
  const date = new Date().toISOString().split('T')[0];
  const statusFilter = filters.status !== "all" ? `_${filters.status}` : "";
  const searchFilter = filters.searchQuery ? `_busqueda` : "";
  
  const filename = `pedidos_${date}${statusFilter}${searchFilter}.csv`;
  downloadAsExcel(exportData, filename);
  
  return {
    count: orders.length,
    filename: filename.replace('.xlsx', '.csv')
  };
};

export const validateBulkUploadFile = (file: File): Promise<{ valid: boolean; errors: string[] }> => {
  return new Promise((resolve) => {
    const errors: string[] = [];

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      errors.push('El archivo debe ser de tipo Excel (.xlsx) o CSV (.csv)');
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('El archivo no puede ser mayor a 10MB');
    }

    // Simulate additional validations
    setTimeout(() => {
      resolve({
        valid: errors.length === 0,
        errors
      });
    }, 100);
  });
};