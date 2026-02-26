import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GridSkeleton } from "./GridSkeleton";

// Skeleton for detail pages (Movie/TV/Person)
export const DetailPageSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title */}
            <Skeleton className="h-10 w-3/4" />
            {/* Overview */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            {/* Cast Section */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="h-3 w-20 mt-2 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Explore/List pages
export const ExplorePageSkeleton = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-16 h-16 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>

          {/* Grid */}
          <div className="flex-1">
            <GridSkeleton count={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Search page
export const SearchPageSkeleton = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-14 w-full rounded-xl mb-6" />
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <GridSkeleton count={24} />
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
