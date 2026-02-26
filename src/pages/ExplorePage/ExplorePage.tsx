import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Film, Tv, SlidersHorizontal, TrendingUp, Star, Flame } from "lucide-react";
import {
  useInfiniteDiscover,
  useInfiniteTrending,
  useInfinitePopular,
  useInfiniteTopRated,
  useMovieGenres,
  useTVGenres,
} from "@/hooks/useMovies";
import FilterSidebar from "./FilterSidebar";
import ExploreGrid from "./ExploreGrid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO/SEO";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
];

interface FilterState {
  genre: string;
  year: string;
  sortBy: string;
  minRating: string;
}

const ExplorePage = () => {
  const location = useLocation();

  // Determine media type and mode from URL path
  const pathname = location.pathname;
  const isTV = pathname.includes("/tv");
  const mediaType: "movie" | "tv" = isTV ? "tv" : "movie";

  // Determine mode: popular, trending, top-rated, or discover (default)
  const mode = pathname.includes("/popular")
    ? "popular"
    : pathname.includes("/trending")
    ? "trending"
    : pathname.includes("/top-rated")
    ? "top-rated"
    : "discover";

  // Time window for trending (day or week)
  const [timeWindow, setTimeWindow] = useState("day");

  // Filter state (all values stored as strings for HTML form compatibility)
  const [filters, setFilters] = useState<FilterState>({
    genre: "",
    year: "",
    sortBy: "popularity.desc",
    minRating: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch genres based on media type
  const { data: movieGenres } = useMovieGenres();
  const { data: tvGenres } = useTVGenres();
  const genres = isTV ? tvGenres : movieGenres;

  // Convert string filter values to number values for the hooks
  const genreNum = filters.genre ? Number(filters.genre) : null;
  const yearNum = filters.year ? Number(filters.year) : null;
  const minRatingNum = filters.minRating ? Number(filters.minRating) : undefined;

  // Conditionally use different hooks based on mode
  const discoverQuery = useInfiniteDiscover({
    mediaType,
    genre: genreNum,
    year: yearNum,
    sortBy: filters.sortBy,
    minRating: minRatingNum,
  });

  const trendingQuery = useInfiniteTrending(mediaType, timeWindow);
  const popularQuery = useInfinitePopular(mediaType);
  const topRatedQuery = useInfiniteTopRated(mediaType);

  // Select the appropriate query based on mode
  const activeQuery =
    mode === "trending"
      ? trendingQuery
      : mode === "popular"
      ? popularQuery
      : mode === "top-rated"
      ? topRatedQuery
      : discoverQuery;

  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = activeQuery;

  // Flatten paginated results
  const results = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  // Get total results count
  const totalResults = data?.pages?.[0]?.totalResults || 0;

  // Count active filters
  const activeFilterCount = [
    filters.genre,
    filters.year,
    filters.minRating,
    filters.sortBy !== "popularity.desc",
  ].filter(Boolean).length;

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      genre: "",
      year: "",
      sortBy: "popularity.desc",
      minRating: "",
    });
  };

  // Get selected genre name for display
  const selectedGenreName = genres?.find((g) => g.id.toString() === filters.genre)?.name;

  // Get page title and icon based on mode
  const pageConfig = {
    discover: {
      title: isTV ? "TV Shows" : "Movies",
      subtitle: totalResults > 0 ? `${totalResults.toLocaleString()} titles to discover` : "Discover amazing content",
      icon: isTV ? Tv : Film,
    },
    popular: {
      title: isTV ? "Popular TV Shows" : "Popular Movies",
      subtitle: totalResults > 0 ? `${totalResults.toLocaleString()} popular titles` : "Most popular content",
      icon: Flame,
    },
    trending: {
      title: isTV ? "Trending TV Shows" : "Trending Movies",
      subtitle: totalResults > 0 ? `${totalResults.toLocaleString()} trending ${timeWindow === "day" ? "today" : "this week"}` : "What's trending now",
      icon: TrendingUp,
    },
    "top-rated": {
      title: isTV ? "Top Rated TV Shows" : "Top Rated Movies",
      subtitle: totalResults > 0 ? `${totalResults.toLocaleString()} highest rated titles` : "Highest rated content",
      icon: Star,
    },
  };

  const { title, subtitle, icon: PageIcon } = pageConfig[mode];

  // Show filters only in discover mode
  const showFilterSidebar = mode === "discover";

  return (
    <div className="min-h-screen pt-20">
      <SEO
        title={title}
        description={`${subtitle}. ${selectedGenreName ? `Filter by ${selectedGenreName}.` : ""} Browse and discover the best ${isTV ? "TV shows" : "movies"} on MoviQ.`}
      />
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Title and Filter Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <PageIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Window Toggle for Trending */}
              {mode === "trending" && (
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={timeWindow === "day" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeWindow("day")}
                    className="h-8"
                  >
                    Today
                  </Button>
                  <Button
                    variant={timeWindow === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeWindow("week")}
                    className="h-8"
                  >
                    This Week
                  </Button>
                </div>
              )}

              {/* Mobile Filter Toggle - Only in discover mode */}
              {showFilterSidebar && (
                <Button
                  variant="outline"
                  className="lg:hidden gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="default" className="ml-1 px-1.5 py-0.5 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Display - Only in discover mode */}
          {showFilterSidebar && (selectedGenreName || filters.year || filters.minRating) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedGenreName && (
                <Badge variant="secondary" className="gap-1">
                  {selectedGenreName}
                  <button
                    onClick={() => handleFilterChange("genre", "")}
                    className="ml-1 hover:text-destructive cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.year && (
                <Badge variant="secondary" className="gap-1">
                  {filters.year}
                  <button
                    onClick={() => handleFilterChange("year", "")}
                    className="ml-1 hover:text-destructive cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.minRating && (
                <Badge variant="secondary" className="gap-1">
                  {filters.minRating}+ Rating
                  <button
                    onClick={() => handleFilterChange("minRating", "")}
                    className="ml-1 hover:text-destructive cursor-pointer"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex gap-8">
          {/* Sidebar - Desktop - Only in discover mode */}
          {showFilterSidebar && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  genres={genres || []}
                  sortOptions={SORT_OPTIONS}
                  isTV={isTV}
                />
              </div>
            </div>
          )}

          {/* Sidebar - Mobile - Only in discover mode */}
          {showFilterSidebar && showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    ×
                  </Button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  genres={genres || []}
                  sortOptions={SORT_OPTIONS}
                  isTV={isTV}
                />
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="flex-1 min-w-0">
            <ExploreGrid
              results={results}
              isLoading={isLoading}
              isFetching={isFetching}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              mediaType={mediaType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
