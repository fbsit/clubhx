
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Mail, Briefcase } from "lucide-react";

type TeamMember = {
  name: string;
  role: string;
  email: string;
};

type AddTeamMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  onAdd: (member: TeamMember) => void;
};

export const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  isOpen,
  onClose,
  customerName,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (name && role && email) {
      onAdd({
        name,
        role,
        email,
      });
      // Reset form
      setName("");
      setRole("");
      setEmail("");
      onClose();
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = name && role && email && isValidEmail(email);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Agregar Contacto - {customerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                placeholder="Ej: María González"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Cargo/Posición</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="pl-10"
                placeholder="Ej: Estilista Principal"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="maria@salon.cl"
              />
            </div>
            {email && !isValidEmail(email) && (
              <p className="text-sm text-red-500">Por favor ingresa un correo válido</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Agregar Contacto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
