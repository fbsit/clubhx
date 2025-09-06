
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, BarChart } from "lucide-react";

const testUsers = [
  {
    role: "Admin",
    email: "admin@clubhx.com",
    password: "admin123",
    icon: <Users className="h-4 w-4" />,
    description: "Gestión completa de usuarios, productos y analytics",
    features: [
      "Panel de administración completo",
      "Gestión de clientes y vendedores", 
      "Analytics y reportes",
      "Configuración del sistema"
    ],
    color: "bg-red-500"
  },
  {
    role: "Sales",
    email: "sales@clubhx.com", 
    password: "sales123",
    icon: <Package className="h-4 w-4" />,
    description: "Dashboard comercial y gestión de clientes",
    features: [
      "Dashboard de ventas",
      "Gestión de clientes",
      "Seguimiento de órdenes",
      "Eventos y capacitaciones"
    ],
    color: "bg-blue-500"
  },
  {
    role: "Client",
    email: "client@clubhx.com",
    password: "client123", 
    icon: <BarChart className="h-4 w-4" />,
    description: "Catálogo de productos y programa de lealtad",
    features: [
      "Catálogo de productos Schwarzkopf",
      "Sistema de cotizaciones",
      "Programa de lealtad",
      "Historial de pedidos"
    ],
    color: "bg-green-500"
  }
];

export default function QATestingGuide() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Guía para Testers QA
        </CardTitle>
        <CardDescription>
          Usuarios de prueba para evaluar la experiencia UX/UI de cada rol en CLUB HX
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testUsers.map((user) => (
            <div key={user.role} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${user.color} text-white`}>
                  {user.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{user.role}</h3>
                  <Badge variant="outline" className="text-xs">
                    {user.role.toLowerCase()}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{user.description}</p>
                
                <div className="bg-muted p-2 rounded text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Funcionalidades a evaluar:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {user.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instrucciones para QA:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Evalúa la navegación y usabilidad específica de cada rol</li>
            <li>• Verifica que cada usuario solo vea el contenido autorizado</li>
            <li>• Prueba los flujos completos: login → dashboard → funcionalidades clave</li>
            <li>• Documenta cualquier inconsistencia en la experiencia UX</li>
            <li>• Presta atención a las transiciones y elementos visuales por rol</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
