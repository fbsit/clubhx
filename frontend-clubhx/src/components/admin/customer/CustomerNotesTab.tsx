
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CustomerNotesTabProps {
  customerData: any;
}

export const CustomerNotesTab: React.FC<CustomerNotesTabProps> = ({
  customerData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas del Cliente</CardTitle>
        <CardDescription>
          Información importante y notas para {customerData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 bg-muted/30">
          <p className="whitespace-pre-line">{customerData.notes}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          Editar Notas
        </Button>
      </CardFooter>
    </Card>
  );
};
