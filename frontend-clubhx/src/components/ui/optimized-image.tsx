
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  showSkeleton?: boolean;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80",
  className,
  containerClassName,
  aspectRatio = "square",
  objectFit = "cover",
  showSkeleton = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    // Reset states when source changes
    setIsLoading(true);
    setError(false);
    setImgSrc(src);
  }, [src]);

  // Determine aspect ratio class
  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video", 
    portrait: "aspect-[3/4]",
    auto: ""
  }[aspectRatio];

  // Determine object fit class
  const objectFitClass = `object-${objectFit}`;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setIsLoading(false);
    setImgSrc(fallbackSrc);
  };

  return (
    <div className={cn(
      "relative overflow-hidden", 
      aspectRatioClass, 
      containerClassName
    )}>
      {isLoading && showSkeleton && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={cn(
          objectFitClass,
          "w-full h-full transition-all duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
