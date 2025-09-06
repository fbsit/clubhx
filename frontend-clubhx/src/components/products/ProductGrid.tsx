
import { memo } from "react";
import { ProductType } from "@/types/product";
import ProductCard from "./ProductCard";
import { Package } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
	products: ProductType[];
	viewMode: "grid" | "list";
	userRole?: "admin" | "sales" | "client";
	loading?: boolean;
}

const ProductGrid = ({ 
	products, 
	viewMode,
	userRole = "client",
	loading = false,
}: ProductGridProps) => {
	const isMobile = useIsMobile();

	// Configure pagination based on role and device
	const paginationConfig = {
		initialPageSize: userRole === "admin" ? 16 : isMobile ? 8 : 12,
		enableLoadMore: userRole === "client" && isMobile,
		maxPageSize: 50
	};

	// Always call hooks before any early return to keep hook order stable
	const [paginatedProducts, paginationState, paginationActions] = usePagination(
		products, 
		paginationConfig
	);
	
	// Show skeleton while loading initial data
	if (loading) {
		const skeletonCount = isMobile ? 8 : 12;
		return (
			<div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4' : 'grid-cols-1 gap-3'}`}>
				{Array.from({ length: skeletonCount }).map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="w-full aspect-square rounded-xl" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</div>
				))}
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
				<div className="bg-background p-6 rounded-full mb-5 shadow-sm border border-muted/30">
					<Package className="h-12 w-12 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
				<p className="text-muted-foreground max-w-md">
					No hay productos que coincidan con tu búsqueda o filtros. Intenta con otros criterios.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in">
			<div className={`${
				viewMode === 'grid' 
					? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4' 
					: 'flex flex-col gap-3'
				}`}>
				{paginatedProducts.map((product, index) => (
					<div 
						key={product.id} 
						className="transition-all duration-300" 
						style={{ 
							animationDelay: `${index * 50}ms`,
							opacity: 0,
							animation: 'fade-in 0.5s ease-out forwards'
						}}
					>
						<ProductCard
							product={product}
							viewMode={viewMode}
						/>
					</div>
				))}
			</div>

			{/* Pagination Controls */}
			{products.length > paginationConfig.initialPageSize && (
				<PaginationControls
					state={paginationState}
					actions={paginationActions}
					showLoadMore={paginationConfig.enableLoadMore}
					className="mt-8"
				/>
			)}
		</div>
	);
};

export default memo(ProductGrid);
