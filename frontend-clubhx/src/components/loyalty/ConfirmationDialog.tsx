
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-primary border-r-transparent align-middle"></div>
        </div>
        <p className="text-center text-lg font-medium">Procesando tu solicitud...</p>
        <p className="text-center text-muted-foreground">Espera un momento mientras canjeamos tus puntos.</p>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
