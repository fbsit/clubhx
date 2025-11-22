import { useEffect, useState } from "react";
import { format, addMonths, subMonths, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Calendar, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { ClientScheduleCalendar } from "@/components/schedule/ClientScheduleCalendar";
import { AppointmentCard } from "@/components/schedule/AppointmentCard";
import { NewAppointmentDialog } from "@/components/schedule/NewAppointmentDialog";
import { listVisits, createVisit } from "@/services/visitsApi";
import { useAuth } from "@/contexts/AuthContext";
import { RescheduleAppointmentDialog } from "@/components/schedule/RescheduleAppointmentDialog";
import { GoogleCalendarIntegration } from "@/components/schedule/GoogleCalendarIntegration";
type ClientAppointment = any;
const mockClientAppointments: ClientAppointment[] = [];
const statusLabels: Record<string,string> = {};

export default function ClientSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<ClientAppointment[]>(mockClientAppointments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [selectedAppointment, setSelectedAppointment] = useState<ClientAppointment | null>(null);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [rescheduleAppointmentOpen, setRescheduleAppointmentOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<ClientAppointment | null>(null);
  const [googleCalendarOpen, setGoogleCalendarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    let cancelled = false;
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await listVisits({ from, to, customerId: user?.id });
        if (!cancelled) {
          setAppointments(items.map(v => ({
            id: v.id,
            date: new Date(v.date),
            status: v.status,
            title: v.visitType,
            location: v.meetingType === 'presencial' ? v.customerName : `Videollamada - ${v.meetingLink || ''}`,
            notes: v.description,
            time: v.time,
          })) as any);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error cargando visitas');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentDate, user?.id]);

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter(apt => apt.date >= now && apt.status !== "cancelled")
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3);
  };

  const getAppointmentsByStatus = (status: ClientAppointment["status"]) => {
    return appointments.filter(apt => apt.status === status);
  };

  const getSelectedDateAppointments = () => {
    if (!selectedDate) return [];
    return appointments.filter(apt => isSameDay(apt.date, selectedDate));
  };

  const handleNewAppointment = async (data: any) => {
    try {
      const clientId = user?.id || user?.providerClientPk;
      if (!clientId) {
        toast({
          title: "No se pudo identificar tu cuenta",
          description: "Inicia sesión nuevamente para solicitar una cita.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        salesPersonId: data.salesPerson.id,
        salesPersonName: data.salesPerson.name,
        customerId: String(clientId),
        customerName: user?.name || user?.company || "Cliente",
        date: data.date.toISOString(),
        time: data.time,
        duration: data.duration,
        status: "requested" as const,
        visitType: data.purpose || "meeting",
        meetingType: data.type,
        description: data.description || data.notes || "",
        meetingLink: data.type === "videollamada" ? "" : null,
        priority: "medium" as const,
      };

      const created = await createVisit(payload as any);

      // Actualizar la lista local de citas para reflejar la nueva solicitud
      setAppointments(prev => [
        ...prev,
        {
          id: created.id,
          date: new Date(created.date),
          status: created.status,
          title: data.title,
          location: created.meetingType === "presencial" ? created.customerName : `Videollamada - ${created.meetingLink || ""}`,
          notes: created.description,
          time: created.time,
          salesPerson: data.salesPerson,
        } as any,
      ]);

      toast({
        title: "Cita solicitada",
        description: "Tu solicitud de cita ha sido enviada. Tu ejecutivo la revisará y confirmará contigo.",
      });
    } catch (e: any) {
      toast({
        title: "No se pudo solicitar la cita",
        description: e?.message || "Intenta nuevamente más tarde.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = (appointment: ClientAppointment) => {
    setAppointmentToReschedule(appointment);
    setRescheduleAppointmentOpen(true);
  };

  const handleConfirmReschedule = (appointmentId: string, newDate: Date, newTime: string, reason?: string) => {
    // Actualizar la cita en el estado
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            date: newDate, 
            time: newTime, 
            status: "rescheduled" as const,
            notes: reason ? `${apt.notes ? apt.notes + '. ' : ''}Reagendada: ${reason}` : apt.notes,
            updatedAt: new Date()
          }
        : apt
    ));

    toast({
      title: "Cita reagendada",
      description: `Tu cita ha sido reagendada para el ${newDate.toLocaleDateString('es-CL')} a las ${newTime}. Tu ejecutivo será notificado.`,
    });
  };

  const handleCancel = (appointment: ClientAppointment) => {
    // Actualizar estado de la cita a cancelada
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: "cancelled" as const, updatedAt: new Date() }
        : apt
    ));

    toast({
      title: "Cita cancelada",
      description: "Tu cita ha sido cancelada exitosamente.",
    });
  };

  const handleJoinMeeting = (appointment: ClientAppointment) => {
    if (appointment.meetingUrl) {
      window.open(appointment.meetingUrl, '_blank');
    }
  };

  const statsCards = [
    {
      title: "Citas este mes",
      value: appointments.filter(apt => 
        apt.date.getMonth() === currentDate.getMonth() && 
        apt.date.getFullYear() === currentDate.getFullYear()
      ).length,
      icon: Calendar
    },
    {
      title: "Confirmadas",
      value: getAppointmentsByStatus("confirmed").length,
      icon: Calendar
    },
    {
      title: "Completadas",
      value: getAppointmentsByStatus("completed").length,
      icon: Calendar
    }
  ];

  if (isMobile) {
    return (
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Header móvil */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Mi Agenda</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus citas con tu ejecutivo
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGoogleCalendarOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Próximas citas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getUpcomingAppointments().map(appointment => (
              <div key={appointment.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{appointment.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {statusLabels[appointment.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(appointment.date, "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                </p>
                <p className="text-xs text-muted-foreground">
                  con {appointment.salesPerson?.name || "tu ejecutivo de ventas"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tabs móvil */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4 mt-4">
            <ClientScheduleCalendar
              currentDate={currentDate}
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
              onAppointmentSelect={setSelectedAppointment}
            />
            
            {/* Citas del día seleccionado */}
            {selectedDate && (
              <div className="space-y-3">
                <h3 className="font-medium">
                  Citas del {format(selectedDate, "dd 'de' MMMM", { locale: es })}
                </h3>
                {getSelectedDateAppointments().length > 0 ? (
                  getSelectedDateAppointments().map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onReschedule={handleReschedule}
                      onCancel={handleCancel}
                      onJoinMeeting={handleJoinMeeting}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay citas programadas para este día
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4 mt-4">
            {appointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
                onJoinMeeting={handleJoinMeeting}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* FAB para nueva cita */}
        <Button
          className="fixed bottom-20 right-4 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setNewAppointmentOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Diálogos */}
        <NewAppointmentDialog
          open={newAppointmentOpen}
          onOpenChange={setNewAppointmentOpen}
          onSubmit={handleNewAppointment}
          initialDate={selectedDate}
          customerId={String(user?.id || user?.providerClientPk || "")}
        />

        <RescheduleAppointmentDialog
          open={rescheduleAppointmentOpen}
          onOpenChange={setRescheduleAppointmentOpen}
          appointment={appointmentToReschedule}
          onConfirm={handleConfirmReschedule}
        />

        <GoogleCalendarIntegration
          open={googleCalendarOpen}
          onOpenChange={setGoogleCalendarOpen}
        />
      </div>
    );
  }

  // Vista desktop
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mi Agenda</h1>
          <p className="text-muted-foreground">
            Gestiona tus citas con tu ejecutivo de ventas
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setGoogleCalendarOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Google Calendar
          </Button>
          <Button onClick={() => setNewAppointmentOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <ClientScheduleCalendar
            currentDate={currentDate}
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            onAppointmentSelect={setSelectedAppointment}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Próximas citas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximas Citas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingAppointments().map(appointment => (
                <div key={appointment.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{appointment.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {statusLabels[appointment.status]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(appointment.date, "dd MMM 'a las' HH:mm", { locale: es })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    con {appointment.salesPerson?.name || "tu ejecutivo de ventas"}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Citas del día seleccionado */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, "dd 'de' MMMM", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getSelectedDateAppointments().length > 0 ? (
                  getSelectedDateAppointments().map(appointment => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onReschedule={handleReschedule}
                      onCancel={handleCancel}
                      onJoinMeeting={handleJoinMeeting}
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay citas programadas
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogos */}
      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        onSubmit={handleNewAppointment}
        initialDate={selectedDate}
        customerId={String(user?.id || user?.providerClientPk || "")}
      />

      <RescheduleAppointmentDialog
        open={rescheduleAppointmentOpen}
        onOpenChange={setRescheduleAppointmentOpen}
        appointment={appointmentToReschedule}
        onConfirm={handleConfirmReschedule}
      />

      <GoogleCalendarIntegration
        open={googleCalendarOpen}
        onOpenChange={setGoogleCalendarOpen}
      />
    </div>
  );
}