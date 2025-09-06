import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MockGoogleOAuthModal } from "./MockGoogleOAuthModal";

const timezones = [
  "America/Santiago",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Mexico_City",
  "UTC",
  "Europe/Madrid",
  "America/New_York",
  "America/Los_Angeles",
];

const daysOfWeek = [
  { key: "mon", label: "Lunes" },
  { key: "tue", label: "Martes" },
  { key: "wed", label: "Miércoles" },
  { key: "thu", label: "Jueves" },
  { key: "fri", label: "Viernes" },
  { key: "sat", label: "Sábado" },
  { key: "sun", label: "Domingo" },
];

export type WorkingHours = {
  day: string;
  enabled: boolean;
  start: string; // "09:00"
  end: string;   // "18:00"
};

export type CalendarSettings = {
  timezone: string;
  workingHours: WorkingHours[];
};

type CalendarSettingsDialogProps = {
  open: boolean;
  initialSettings: CalendarSettings;
  onSave: (settings: CalendarSettings) => void;
  onClose: () => void;
};

export const CalendarSettingsDialog: React.FC<CalendarSettingsDialogProps> = ({
  open,
  initialSettings,
  onSave,
  onClose,
}) => {
  const [timezone, setTimezone] = useState(initialSettings.timezone);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(initialSettings.workingHours);

  // Sincronización mock con Google Calendar (mejorada)
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);
  const [showGoogleOAuth, setShowGoogleOAuth] = useState(false);

  const handleToggleDay = (idx: number, enabled: boolean) => {
    setWorkingHours([
      ...workingHours.slice(0, idx),
      { ...workingHours[idx], enabled },
      ...workingHours.slice(idx + 1)
    ]);
  };

  const handleHoursChange = (idx: number, key: "start" | "end", value: string) => {
    setWorkingHours([
      ...workingHours.slice(0, idx),
      { ...workingHours[idx], [key]: value },
      ...workingHours.slice(idx + 1)
    ]);
  };

  // NUEVO FLOW: Abrir el modal de OAuth
  const handleGoogleSync = () => {
    setShowGoogleOAuth(true);
  };
  // Cuando el flujo se completa correctamente
  const handleGoogleOAuthSuccess = () => {
    setIsGoogleSynced(true);
    setShowGoogleOAuth(false);
  };

  const handleSave = () => {
    onSave({
      timezone,
      workingHours,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configuración del calendario</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Zona Horaria */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Zona horaria</Label>
            <select
              id="timezone"
              className="w-full border rounded px-3 py-2"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          {/* Sincronización Google Calendar */}
          <div className="flex items-center gap-3">
            <Button
              variant={isGoogleSynced ? "secondary" : "default"}
              onClick={handleGoogleSync}
              disabled={isGoogleSynced}
              className="flex items-center"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-5 w-5 mr-2" fill="none">
                <g>
                  <circle cx="16" cy="16" r="16" fill="#4285F4"/>
                  <path d="M24.266 16.713c0-.547-.043-1.094-.136-1.625h-8.13v3.085h4.625a3.963 3.963 0 0 1-1.713 2.594v2.134h2.754c1.614-1.49 2.6-3.687 2.6-6.188z" fill="#4285F4"/>
                  <path d="M16 25c2.205 0 4.055-.73 5.397-1.985l-2.754-2.133c-.767.521-1.748.828-2.643.828-2.032 0-3.755-1.373-4.366-3.22H8.784v2.158A8.993 8.993 0 0 0 16 25z" fill="#34A853"/>
                  <path d="M11.634 18.49a5.382 5.382 0 0 1-.29-1.697c0-.594.105-1.167.288-1.697v-2.158H8.784A8.988 8.988 0 0 0 7 16a8.988 8.988 0 0 0 1.784 2.857l2.85-2.176z" fill="#FBBC05"/>
                  <path d="M16 10.944c1.201 0 2.275.414 3.125 1.225l2.34-2.34C20.05 8.27 18.2 7.5 16 7.5a8.993 8.993 0 0 0-7.216 3.551l2.85 2.176c.612-1.847 2.334-3.23 4.366-3.23z" fill="#EA4335"/>
                </g>
              </svg>
              {isGoogleSynced
                ? "Sincronizado con Google Calendar"
                : "Sincronizar con Google Calendar"}
            </Button>
            <span className={`text-sm ${isGoogleSynced ? "text-green-600" : "text-gray-500"}`}>
              {isGoogleSynced ? "Sincronizado" : "No sincronizado"}
            </span>
          </div>

          {/* Horario laboral */}
          <div>
            <Label>Horarios laborales</Label>
            <div className="space-y-2 mt-2">
              {daysOfWeek.map((d, idx) => (
                <div key={d.key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={workingHours[idx].enabled}
                    onChange={e => handleToggleDay(idx, e.target.checked)}
                  />
                  <span className="w-20">{d.label}</span>
                  <Input
                    type="time"
                    value={workingHours[idx].start}
                    disabled={!workingHours[idx].enabled}
                    min="00:00"
                    max="23:59"
                    className="w-24"
                    onChange={e => handleHoursChange(idx, "start", e.target.value)}
                  />
                  <span>-</span>
                  <Input
                    type="time"
                    value={workingHours[idx].end}
                    disabled={!workingHours[idx].enabled}
                    min="00:00"
                    max="23:59"
                    className="w-24"
                    onChange={e => handleHoursChange(idx, "end", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
      {/* MODAL OAUTH FAKE */}
      <MockGoogleOAuthModal
        open={showGoogleOAuth}
        onClose={() => setShowGoogleOAuth(false)}
        onSuccess={handleGoogleOAuthSuccess}
      />
    </Dialog>
  );
};
