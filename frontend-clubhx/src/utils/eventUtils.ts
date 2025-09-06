
export const exportEventData = (event: any) => {
  const csvContent = `Evento,Fecha,Hora,Ubicación,Cupos,Registrados
${event.title},${event.date},${event.time},${event.location},${event.spots},${event.spots - event.spotsLeft}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `evento-${event.id}-datos.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const duplicateEvent = (originalEvent: any) => {
  return {
    ...originalEvent,
    id: `evt-${String(Date.now()).slice(-3)}`,
    title: `${originalEvent.title} (Copia)`,
    date: "", // Reset date for new event
    spotsLeft: originalEvent.spots, // Reset registrations
    isRegistered: false,
    isPast: false
  };
};

export const sendEventNotification = async (event: any, message?: string) => {
  // Simular envío de notificación
  console.log(`Enviando notificación para evento: ${event.title}`);
  console.log(`Mensaje: ${message || 'Notificación general del evento'}`);
  
  // En una implementación real, aquí se haría la llamada al backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

export const cancelEvent = async (event: any, reason: string) => {
  console.log(`Cancelando evento: ${event.title}`);
  console.log(`Razón: ${reason}`);
  
  // En una implementación real, aquí se actualizaría el estado del evento
  // y se enviarían notificaciones a los registrados
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
