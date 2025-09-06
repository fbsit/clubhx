
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface CustomerTeamTabProps {
  customerData: any;
}

export const CustomerTeamTab: React.FC<CustomerTeamTabProps> = ({
  customerData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipo del Cliente</CardTitle>
        <CardDescription>
          Personas clave de contacto en {customerData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customerData.team.map((member: any, index: number) => (
            <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
