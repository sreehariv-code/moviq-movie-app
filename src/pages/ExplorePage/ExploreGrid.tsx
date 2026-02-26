import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Film, Tv } from "lucide-react";
import MovieCard from "@/components/Card/MovieCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { Movie, TVShow } from "@/types/tmdb";

interface ExploreGridProps {
  results: (Movie | TVShow)[];
  isLoading: boolean;
  isFetching: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  mediaType: "movie" | "tv";
}

const ExploreGrid: React.FC<ExploreGridProps> = ({
  results,
  isLoading,
  isFetching,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  mediaType,
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreVisible = useIntersectionObserver(loadMoreRef, {
    threshold: 0.1,
    rootMargin: "200px",
  });

  // Auto-fetch next page when load more trigger is visible
  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading) {
    return <GridSkeleton />;
  }

  // Empty state
  if (!results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          {mediaType === "tv" ? (
            <Tv className="w-10 h-10 text-muted-foreground" />
          ) : (
            <Film className="w-10 h-10 text-muted-foreground" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">No results found</h3>
        <p className="text-muted-foreground max-w-sm">
          Try adjusting your filters to discover more content.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
      >
        {results.map((item: Movie | TVShow, index: number) => (
          <motion.div
            key={`${item.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: Math.min((index % 20) * 0.03, 0.5),
            }}
          >
            <MovieCard
              id={item.id}
              image={item.poster_path}
              title={(item as Movie).title || (item as TVShow).name || ""}
              type={mediaType}
              rating={item.vote_average}
              year={((item as Movie).release_date || (item as TVShow).first_air_date)?.split("-")[0]}
              enableLayoutAnimation={index < 15}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Fetching indicator */}
      {isFetching && !isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Updating...</span>
        </div>
      )}

      {/* Load More Trigger */}
      <div
        ref={loadMoreRef}
        className="h-20 flex items-center justify-center"
      >
        {isFetchingNextPage ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        ) : hasNextPage ? (
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="gap-2"
          >
            Load More
          </Button>
        ) : results.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            You've reached the end
          </p>
        ) : null}
      </div>
    </div>
  );
};

// Skeleton Grid for loading state
const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.02 }}
        className="space-y-3"
      >
        <Skeleton className="aspect-[2/3] rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </motion.div>
    ))}
  </div>
);

export default ExploreGrid;
