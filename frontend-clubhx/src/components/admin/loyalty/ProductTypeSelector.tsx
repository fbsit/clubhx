
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Percent, Calendar, GraduationCap } from "lucide-react";

interface ProductTypeSelectorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSelect: (type: "product" | "discount" | "event" | "training") => void;
}

export const ProductTypeSelector: React.FC<ProductTypeSelectorProps> = ({
	open,
	onOpenChange,
	onSelect
}) => {
	const productTypes = [
		{ type: "product" as const, title: "Producto", description: "Productos físicos canjeables", icon: Package, color: "text-blue-600" },
		{ type: "discount" as const, title: "Descuento", description: "Descuentos aplicables en compras", icon: Percent, color: "text-green-600" },
		{ type: "event" as const, title: "Evento", description: "Eventos y lanzamientos de marca", icon: Calendar, color: "text-purple-600" },
		{ type: "training" as const, title: "Capacitación", description: "Sesiones de formación y talleres", icon: GraduationCap, color: "text-orange-600" }
	];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>¿Qué tipo de beneficio deseas agregar?</DialogTitle>
					<DialogDescription>
						Selecciona el tipo de producto o beneficio que los clientes podrán canjear con sus puntos.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
					{productTypes.map((item) => {
						const IconComponent = item.icon;
						return (
							<Card
								key={item.type}
								className="cursor-pointer transition-all hover:shadow-md hover:bg-muted/50"
								onClick={() => onSelect(item.type)}
							>
								<CardContent className="p-6 text-center">
									<IconComponent className={`h-12 w-12 mx-auto mb-4 ${item.color}`} />
									<h3 className="font-semibold text-lg mb-2">{item.title}</h3>
									<p className="text-sm text-muted-foreground">{item.description}</p>
								</CardContent>
							</Card>
						);
					})}
				</div>

				<div className="flex justify-end">
					<Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProductTypeSelector;
