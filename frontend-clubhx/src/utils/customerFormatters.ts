
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { className: "bg-green-500", label: "Activo" },
    inactive: { className: "bg-amber-500", label: "Inactivo" },
    pending: { className: "bg-purple-500", label: "Pendiente" }
  };
  
  return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
};
