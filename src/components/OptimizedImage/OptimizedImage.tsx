import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ImageType = "poster" | "backdrop" | "profile";

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback: string;
  sizes?: string;
  aspectRatio?: string;
  priority?: boolean;
  type?: ImageType;
  [key: string]: unknown;
}

/**
 * OptimizedImage Component
 *
 * Features:
 * - Native lazy loading
 * - Blur placeholder while loading
 * - Responsive image sizes with srcset
 * - Error handling with fallback
 * - Smooth fade-in animation
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallback,
  sizes = "100vw",
  aspectRatio = "2/3", // Default poster aspect ratio
  priority = false, // Set to true for above-the-fold images
  type = "poster", // poster, backdrop, or profile
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // TMDB image base URL
  const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

  // Generate srcset for responsive images based on type
  const generateSrcSet = (path: string): string | null => {
    if (!path || path.startsWith("http")) return null;

    // Different sizes based on image type
    const sizesByType: Record<ImageType, string[]> = {
      poster: ["w185", "w342", "w500", "w780"],
      backdrop: ["w780", "w1280", "original"],
      profile: ["w185", "w342", "w500"],
    };

    const imageSizes = sizesByType[type] || sizesByType.poster;

    return imageSizes
      .map((size: string) => {
        if (size === "original") {
          return `${TMDB_IMAGE_BASE}/${size}${path} 2000w`;
        }
        return `${TMDB_IMAGE_BASE}/${size}${path} ${size.substring(1)}w`;
      })
      .join(", ");
  };

  // Get optimized src URL based on type
  const getOptimizedSrc = (path: string | null | undefined): string => {
    if (!path) return fallback;
    if (path.startsWith("http")) return path;

    // Use appropriate default size based on type
    const defaultSize = type === "backdrop" ? "w1280" : "w500";
    return `${TMDB_IMAGE_BASE}/${defaultSize}${path}`;
  };

  const srcSet = src ? generateSrcSet(src) : null;
  const optimizedSrc = getOptimizedSrc(src);
  const displaySrc = hasError ? fallback : optimizedSrc;

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{ aspectRatio }}
    >
      {/* Blur Placeholder */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/80 to-muted" />
      )}

      {/* Main Image */}
      {displaySrc && (
        <motion.img
          src={displaySrc}
          srcSet={srcSet || undefined}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
          {...props}
        />
      )}

      {/* Shimmer Effect while loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 shimmer" />
      )}
    </div>
  );
};

export default OptimizedImage;
