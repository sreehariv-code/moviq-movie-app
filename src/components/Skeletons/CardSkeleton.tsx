import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for MovieCard/PersonCard
export const MovieCardSkeleton = () => {
  return (
    <div className="space-y-3">
      {/* Poster/Image */}
      <Skeleton className="w-full aspect-[2/3] rounded-xl" />
      {/* Title */}
      <Skeleton className="h-4 w-3/4" />
      {/* Metadata (rating, year) */}
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
};

// Skeleton for CastCard (circular variant)
export const CastCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      {/* Circular profile */}
      <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" />
      {/* Name */}
      <Skeleton className="h-3 w-20" />
      {/* Character */}
      <Skeleton className="h-3 w-16" />
    </div>
  );
};

export default MovieCardSkeleton;
