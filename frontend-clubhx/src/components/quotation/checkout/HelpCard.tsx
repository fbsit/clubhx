
import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";

const HelpCard: FC = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">¿Necesitas ayuda?</h3>
        <p className="text-sm text-muted-foreground">
          Si tienes dudas sobre el proceso de cotización, contáctanos al:
        </p>
        <p className="text-sm font-medium mt-2">
          +56 2 1234 5678
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          ventas@clubhx.cl
        </p>
      </CardContent>
    </Card>
  );
};

export default HelpCard;
