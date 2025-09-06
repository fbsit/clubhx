import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Settings, User, Bell, Calendar, Save } from "lucide-react";

export default function SalesSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });

  const [calendarSettings, setCalendarSettings] = useState({
    timezone: "America/Santiago",
    defaultMeetingDuration: "60",
    workingHoursStart: "09:00",
    workingHoursEnd: "18:00",
  });

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    pushNotifications: true,
    appointmentReminders: true,
    dailyReports: false,
  });

  const handleSavePersonalInfo = () => {
    toast({
      title: "Información actualizada",
      description: "Tu información personal ha sido guardada correctamente.",
    });
  };

  const handleSaveCalendarSettings = () => {
    toast({
      title: "Configuración de calendario actualizada",
      description: "Tus preferencias de calendario han sido guardadas.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Preferencias de notificaciones actualizadas",
      description: "Tus configuraciones han sido guardadas correctamente.",
    });
  };

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona tus preferencias y configuraciones
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-w-4xl">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  value={personalInfo.name}
                  onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  placeholder="+56 9 XXXX XXXX"
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSavePersonalInfo} className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Información
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Configuración de Calendario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select value={calendarSettings.timezone} onValueChange={(value) => 
                  setCalendarSettings({...calendarSettings, timezone: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Santiago">Santiago (GMT-3/GMT-4)</SelectItem>
                    <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                    <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duración predeterminada de citas (minutos)</Label>
                <Select value={calendarSettings.defaultMeetingDuration} onValueChange={(value) => 
                  setCalendarSettings({...calendarSettings, defaultMeetingDuration: value})
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                    <SelectItem value="120">120 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="start">Horario de trabajo - Inicio</Label>
                <Input
                  id="start"
                  type="time"
                  value={calendarSettings.workingHoursStart}
                  onChange={(e) => setCalendarSettings({...calendarSettings, workingHoursStart: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end">Horario de trabajo - Fin</Label>
                <Input
                  id="end"
                  type="time"
                  value={calendarSettings.workingHoursEnd}
                  onChange={(e) => setCalendarSettings({...calendarSettings, workingHoursEnd: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSaveCalendarSettings} className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-reminders">Recordatorios por email</Label>
                  <p className="text-sm text-muted-foreground">Recibe recordatorios de citas por correo</p>
                </div>
                <Switch
                  id="email-reminders"
                  checked={notifications.emailReminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, emailReminders: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notificaciones push</Label>
                  <p className="text-sm text-muted-foreground">Notificaciones en tiempo real</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="appointment-reminders">Recordatorios de citas</Label>
                  <p className="text-sm text-muted-foreground">Alertas 15 minutos antes de cada cita</p>
                </div>
                <Switch
                  id="appointment-reminders"
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, appointmentReminders: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-reports">Reportes diarios</Label>
                  <p className="text-sm text-muted-foreground">Resumen de actividades al final del día</p>
                </div>
                <Switch
                  id="daily-reports"
                  checked={notifications.dailyReports}
                  onCheckedChange={(checked) => setNotifications({...notifications, dailyReports: checked})}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={handleSaveNotifications} className="gap-2">
                <Save className="h-4 w-4" />
                Guardar Preferencias
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}