
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "@/components/admin/ImageUploader";
import { LoyaltyProduct } from "@/utils/loyaltyRewardAdapter";

interface LoyaltyProductFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: LoyaltyProduct;
	isNew: boolean;
	onChangeProduct: (product: LoyaltyProduct) => void;
	onSave: () => void | Promise<void>;
	isSaving?: boolean;
}

export const LoyaltyProductForm: React.FC<LoyaltyProductFormProps> = ({
	open,
	onOpenChange,
	product,
	isNew,
	onChangeProduct,
	onSave,
	isSaving = false
}) => {
	const handleImageSelected = (imageUrl: string) => {
		onChangeProduct({
			...product,
			image: imageUrl
		});
	};

	const handleDiscountTypeChange = (discountType: string) => {
		onChangeProduct({
			...product,
			discountType: discountType as any,
			discountValue: discountType === "giftcard" ? product.pointsCost / 10 : 10
		});
	};

	const isDiscount = product?.category === "discount";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{isNew 
							? `Agregar Nuevo ${isDiscount ? 'Descuento' : 'Producto'}` 
							: `Editar ${isDiscount ? 'Descuento' : 'Producto'}`}
					</DialogTitle>
					<DialogDescription>
						{isNew 
							? `Complete los detalles para agregar un nuevo ${isDiscount ? 'descuento' : 'producto'} canjeable por puntos.` 
							: `Modifique los detalles del ${isDiscount ? 'descuento' : 'producto'} canjeable.`}
					</DialogDescription>
				</DialogHeader>
				
				{product && (
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">
									{isDiscount ? "Nombre del Descuento" : "Nombre del Producto"}
								</Label>
								<Input 
									id="name" 
									value={product.name}
									placeholder={isDiscount ? "ej. Descuento de $15.000" : "ej. Kit BC Bonacure"}
									onChange={(e) => onChangeProduct({...product, name: e.target.value})}
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="category">Categoría</Label>
								<Select 
									value={product.category}
									onValueChange={(value) => onChangeProduct({...product, category: value})}
								>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar categoría" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="product">Producto</SelectItem>
										<SelectItem value="discount">Descuento</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Discount-specific fields */}
						{isDiscount && (
							<Card className="bg-blue-50 border-blue-200">
								<CardContent className="p-4 space-y-4">
									<div className="space-y-2">
										<Label htmlFor="discountType">Tipo de Descuento</Label>
										<Select 
											value={product.discountType || "percentage"}
											onValueChange={handleDiscountTypeChange}
										>
											<SelectTrigger>
												<SelectValue placeholder="Seleccionar tipo" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="percentage">Descuento por Porcentaje (%)</SelectItem>
												<SelectItem value="fixed">Descuento por Valor Fijo ($)</SelectItem>
												<SelectItem value="giftcard">Gift Card</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="discountValue">
												{product.discountType === "percentage" ? "Porcentaje (%)" :
													product.discountType === "giftcard" ? "Valor Gift Card ($)" : "Valor Descuento ($)"}
											</Label>
											<Input 
												id="discountValue" 
												type="number"
												value={product.discountValue || ""}
												placeholder={product.discountType === "percentage" ? "15" : "25000"}
												onChange={(e) => onChangeProduct({...product, discountValue: parseFloat(e.target.value)})}
											/>
										</div>

										{product.discountType === "fixed" && (
											<div className="space-y-2">
												<Label htmlFor="minPurchase">Compra Mínima ($)</Label>
												<Input 
													id="minPurchase" 
													type="number"
													value={product.minPurchase || ""}
													placeholder="50000"
													onChange={(e) => onChangeProduct({...product, minPurchase: parseFloat(e.target.value)})}
												/>
											</div>
										)}

										{product.discountType === "percentage" && (
											<div className="space-y-2">
												<Label htmlFor="maxDiscount">Descuento Máximo ($)</Label>
												<Input 
													id="maxDiscount" 
													type="number"
													value={product.maxDiscount || ""}
													placeholder="30000"
													onChange={(e) => onChangeProduct({...product, maxDiscount: parseFloat(e.target.value)})}
												/>
											</div>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="validityDays">Validez (días)</Label>
										<Input 
											id="validityDays" 
											type="number"
											value={product.validityDays || ""}
											placeholder="30"
											onChange={(e) => onChangeProduct({...product, validityDays: parseInt(e.target.value)})}
										/>
									</div>
								</CardContent>
							</Card>
						)}
						
						<div className="space-y-2">
							<Label htmlFor="description">Descripción</Label>
							<Textarea 
								id="description" 
								rows={3}
								value={product.description}
								placeholder={isDiscount ? 
									"Descripción del beneficio y condiciones de uso..." : 
									"Descripción del producto incluido..."}
								onChange={(e) => onChangeProduct({...product, description: e.target.value})}
							/>
						</div>
						
						<div className="grid grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="points">Puntos Requeridos</Label>
								<Input 
									id="points" 
									type="number"
									value={product.pointsCost}
									onChange={(e) => onChangeProduct({...product, pointsCost: parseInt(e.target.value)})}
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="available">
									{isDiscount ? "Códigos Disponibles" : "Cantidad Disponible"}
								</Label>
								<Input 
									id="available" 
									type="number"
									value={product.stockQuantity !== undefined ? product.stockQuantity : (product.available ?? "")}
									placeholder="Dejar vacío para ilimitado"
									onChange={(e) => onChangeProduct({
										...product, 
										stockQuantity: e.target.value === "" ? 0 : parseInt(e.target.value),
										available: e.target.value === "" ? null : parseInt(e.target.value)
									})}
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="featured">Destacado</Label>
								<Select 
									value={product.featured ? "yes" : "no"}
									onValueChange={(value) => onChangeProduct({...product, featured: value === "yes"})}
								>
									<SelectTrigger>
										<SelectValue placeholder="Destacado" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="yes">Sí</SelectItem>
										<SelectItem value="no">No</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						
						<div className="space-y-2">
							<Label>
								{isDiscount ? "Imagen del Descuento" : "Imagen del Producto"}
							</Label>
							<ImageUploader 
								onImageSelected={handleImageSelected} 
								currentImage={product.image} 
							/>
						</div>
					</div>
				)}
				
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Cancelar</Button>
					<Button onClick={onSave} disabled={isSaving}>
						{isSaving ? "Guardando..." : isNew ? `Crear ${isDiscount ? 'Descuento' : 'Producto'}` : "Guardar Cambios"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default LoyaltyProductForm;
