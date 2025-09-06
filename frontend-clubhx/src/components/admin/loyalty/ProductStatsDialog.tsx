
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileProductStatsDialog from "./MobileProductStatsDialog";
import DesktopProductStatsDialog from "./DesktopProductStatsDialog";

interface ProductStatsDialogProps {
	product: any;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: () => void;
}

export default function ProductStatsDialog({ product, open, onOpenChange, onEdit }: ProductStatsDialogProps) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<MobileProductStatsDialog
				product={product}
				isOpen={open}
				onClose={() => onOpenChange(false)}
				onEdit={onEdit}
			/>
		);
	}

	return (
		<DesktopProductStatsDialog
			product={product}
			isOpen={open}
			onClose={() => onOpenChange(false)}
			onEdit={onEdit}
		/>
	);
}
