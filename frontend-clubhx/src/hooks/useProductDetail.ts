import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "@/services/productsApi";
import { ProductType, ProductOption } from "@/types/product";

export function useProductDetail() {
	const { id: productId } = useParams<{ id: string }>();
	
	const [product, setProduct] = useState<ProductType | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);
	const [currentImage, setCurrentImage] = useState<string>("");
	const [currentPrice, setCurrentPrice] = useState<number>(0);
	const [displayName, setDisplayName] = useState<string>("");
	const [showNotifyDialog, setShowNotifyDialog] = useState(false);
	const [showReserveDialog, setShowReserveDialog] = useState(false);

	// Create a safe product for hooks
	const safeProduct = product || {
		id: '',
		name: '',
		price: 0,
		image: '',
		category: '',
		brand: '',
		description: '',
		stock: 0,
		discount: 0,
		options: []
	} as ProductType;

	// Create display product for hooks
	const displayProduct = product ? {
		...product,
		name: displayName,
		price: currentPrice,
		image: currentImage
	} : safeProduct;

	// Calculate discounted price
	const discountedPrice = displayProduct.discount 
		? currentPrice - (currentPrice * displayProduct.discount / 100) 
		: null;

	// Product loading effect
	useEffect(() => {
		let cancelled = false;
		(async () => {
			if (!productId) {
				setLoading(false);
				return;
			}
			try {
				const p = await fetchProductById(productId);
				if (cancelled) return;
				setProduct(p);
				setCurrentImage(p.image);
				setCurrentPrice(p.price);
				setDisplayName(p.name);
			} catch {
				if (!cancelled) {
					setProduct(null);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, [productId]);

	// Update display values when options change
	useEffect(() => {
		if (!product) return;

		let newPrice = product.price;
		let newImage = product.image;
		let newName = product.name;

		if (selectedOptions.length > 0) {
			const lastSelectedOption = selectedOptions[selectedOptions.length - 1];
			newPrice = lastSelectedOption.price;
			if (lastSelectedOption.image) {
				newImage = lastSelectedOption.image;
			}
		}

		if (selectedOptions.length > 0) {
			const optionValues = selectedOptions.map(opt => opt.value).join(', ');
			newName = `${product.name} - ${optionValues}`;
		}

		setCurrentPrice(newPrice);
		setCurrentImage(newImage);
		setDisplayName(newName);
	}, [selectedOptions, product]);

	const handleOptionChange = (newOption: ProductOption) => {
		setSelectedOptions(prevOptions => {
			const filtered = prevOptions.filter(opt => opt.name !== newOption.name);
			return [...filtered, newOption];
		});
	};

	return {
		product,
		loading,
		displayProduct,
		discountedPrice,
		selectedOptions,
		currentImage,
		currentPrice,
		displayName,
		showNotifyDialog,
		showReserveDialog,
		setShowNotifyDialog,
		setShowReserveDialog,
		handleOptionChange
	};
}