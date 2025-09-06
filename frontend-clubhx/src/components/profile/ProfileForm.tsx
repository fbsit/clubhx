
import { Building, Mail, MapPin, Truck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileFormData } from "@/hooks/useProfileForm";

interface ProfileFormProps {
  profile: ProfileFormData;
  isEditing: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function ProfileForm({
  profile,
  isEditing,
  activeTab,
  onTabChange,
  onChange,
  onSubmit,
  onCancel
}: ProfileFormProps) {
  return (
    <Card className="rounded-xl sm:rounded-2xl border border-border/30 shadow-sm sm:shadow-md">
      <CardHeader className="p-4 sm:p-6 pb-0">
        <Tabs 
          value={activeTab} 
          onValueChange={onTabChange}
          className="w-full"
        >
          {/* En mobile, TabsList es stack (vertical), en sm+ es horizontal */}
          <TabsList 
            className="
              flex flex-col gap-2 
              w-full sm:grid sm:grid-cols-2 sm:gap-0 h-auto sm:h-10 
              rounded-lg sm:rounded-md text-[15px] sm:text-sm
              bg-transparent sm:bg-muted p-0
            "
          >
            <TabsTrigger 
              value="personal" 
              className="
                py-2 px-2 text-center rounded-lg sm:rounded-sm h-auto sm:h-10 
                whitespace-normal break-words font-semibold
                bg-muted/60 sm:bg-transparent
                focus-visible:ring-2 focus-visible:ring-ring
                data-[state=active]:bg-background data-[state=active]:text-foreground
                transition-all
                "
              style={{ minHeight: "38px", lineHeight: "1.2" }}
            >
              Información<br />personal
            </TabsTrigger>
            <TabsTrigger 
              value="shipping" 
              className="
                py-2 px-2 text-center rounded-lg sm:rounded-sm h-auto sm:h-10 
                whitespace-normal break-words font-semibold
                bg-muted/60 sm:bg-transparent
                focus-visible:ring-2 focus-visible:ring-ring
                data-[state=active]:bg-background data-[state=active]:text-foreground
                transition-all
                "
              style={{ minHeight: "38px", lineHeight: "1.2" }}
            >
              Dirección<br />de envío
            </TabsTrigger>
          </TabsList>
          <CardContent className="px-0 pt-4 pb-0">
            <form id="profile-form" onSubmit={onSubmit}>
              <TabsContent value="personal" className="space-y-3 sm:space-y-4 mt-0">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={onChange}
                    disabled={!isEditing}
                    className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={onChange}
                    disabled={true}
                    className="bg-muted/30 h-9 sm:h-10 text-base sm:text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building className="h-4 w-4" /> Nombre del Salón / Empresa
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={profile.company}
                    onChange={onChange}
                    disabled={!isEditing}
                    className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                  />
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="space-y-3 sm:space-y-4 mt-0">
                <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span className="font-medium text-foreground text-sm sm:text-base">Dirección para envío de productos</span>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={profile.address}
                    onChange={onChange}
                    disabled={!isEditing}
                    className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                    placeholder={isEditing ? "Ingrese su dirección" : "No especificada"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={onChange}
                      disabled={!isEditing}
                      className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                      placeholder={isEditing ? "Ingrese su ciudad" : "No especificada"}
                    />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="region">Región</Label>
                    <Input
                      id="region"
                      name="region"
                      value={profile.region}
                      onChange={onChange}
                      disabled={!isEditing}
                      className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="zipCode">Código Postal</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={profile.zipCode}
                    onChange={onChange}
                    disabled={!isEditing}
                    className="transition-all h-9 sm:h-10 text-base sm:text-sm"
                    placeholder={isEditing ? "Ingrese su código postal" : "No especificado"}
                  />
                </div>
              </TabsContent>
            </form>
          </CardContent>
        </Tabs>
      </CardHeader>
      {isEditing && (
        <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 sm:p-6 pt-0">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="w-full sm:w-auto h-9 sm:h-10 rounded-lg sm:rounded-xl text-base sm:text-lg"
            size="sm"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            form="profile-form" 
            className="w-full sm:w-auto h-9 sm:h-10 rounded-lg sm:rounded-xl text-base sm:text-lg"
            size="sm"
          >
            Guardar Cambios
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

