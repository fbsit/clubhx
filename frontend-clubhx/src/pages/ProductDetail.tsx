import ProductDetailIOS from "@/components/products/ProductDetailIOS";
import ProductDetailStandard from "@/components/products/ProductDetailStandard";
import { useIsIOS } from "@/hooks/useIsIOS";

export default function ProductDetail() {
  const isIOSDevice = useIsIOS();

  // Render iOS-specific component for iOS devices
  if (isIOSDevice) {
    return <ProductDetailIOS />;
  }

  // Render standard component for all other devices
  return <ProductDetailStandard />;
}