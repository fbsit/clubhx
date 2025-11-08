
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  // Compat props
  open?: boolean;
  setOpen?: (open: boolean) => void;
  // New props
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  message?: string;
  onConfirm?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { open, setOpen, isOpen, onClose, title, message, onConfirm } = props;
  const opened = typeof isOpen === "boolean" ? isOpen : Boolean(open);
  const handleChange = (v: boolean) => {
    if (setOpen) setOpen(v);
    if (!v && onClose) onClose();
  };

  return (
    <Dialog open={opened} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || "Confirmar acción"}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose || (() => setOpen && setOpen(false))}>Cancelar</Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
