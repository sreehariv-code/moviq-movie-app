import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  Film,
  Tv,
  Sparkles,
  Loader2,
  Users,
} from "lucide-react";
import { useInfiniteSearch, useInfiniteSearchPeople, useInfinitePopularPeople, useInfiniteDiscover, useMovieGenres } from "@/hooks/useMovies";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "@/components/Card/MovieCard";
import PersonCard from "@/components/Card/PersonCard";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO/SEO";

const MEDIA_TYPES = [
  { id: "multi", label: "All", icon: Sparkles },
  { id: "movie", label: "Movies", icon: Film },
  { id: "tv", label: "TV Shows", icon: Tv },
  { id: "person", label: "People", icon: Users },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "primary_release_date.asc", label: "Oldest" },
];

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => 2025 - i);

const RATING_OPTIONS = [
  { value: 0, label: "Any" },
  { value: 5, label: "5+" },
  { value: 6, label: "6+" },
  { value: 7, label: "7+" },
  { value: 8, label: "8+" },
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [mediaType, setMediaType] = useState("multi");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: null,
    genre: null,
    sortBy: "popularity.desc",
    minRating: 0,
  });

  // Ref for infinite scroll trigger
  const loadMoreRef = useRef(null);
  const isLoadMoreVisible = useIntersectionObserver(loadMoreRef);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use person-specific hook when searching for people
  const searchHook = mediaType === "person"
    ? useInfiniteSearchPeople(debouncedSearch)
    : useInfiniteSearch(debouncedSearch, {
      mediaType,
      year: filters.year,
      genre: filters.genre ? [filters.genre] : null,
    });

  // Infinite search query
  const {
    data: searchData,
    isLoading: isSearching,
    isFetching: isSearchFetching,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = searchHook;

  // Infinite discover query (when no search term for movies/TV)
  const {
    data: discoverData,
    isLoading: isDiscovering,
    isFetching: isDiscoverFetching,
    fetchNextPage: fetchNextDiscoverPage,
    hasNextPage: hasNextDiscoverPage,
    isFetchingNextPage: isFetchingNextDiscoverPage,
  } = useInfiniteDiscover({
    genre: filters.genre,
    year: filters.year,
    sortBy: filters.sortBy,
    minRating: filters.minRating || undefined,
  });

  // Infinite popular people query (when no search term for people)
  const {
    data: popularPeopleData,
    isLoading: isLoadingPopularPeople,
    isFetching: isFetchingPopularPeople,
    fetchNextPage: fetchNextPopularPeoplePage,
    hasNextPage: hasNextPopularPeoplePage,
    isFetchingNextPage: isFetchingNextPopularPeoplePage,
  } = useInfinitePopularPeople();

  // Genres
  const { data: genres } = useMovieGenres();

  // Determine which data to show
  const isSearchMode = debouncedSearch.length >= 2;

  // Choose the appropriate data source based on mode and media type
  let infiniteData, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage;

  if (isSearchMode) {
    // Search mode: use search results
    infiniteData = searchData;
    isLoading = isSearching;
    isFetching = isSearchFetching;
    fetchNextPage = fetchNextSearchPage;
    hasNextPage = hasNextSearchPage;
    isFetchingNextPage = isFetchingNextSearchPage;
  } else if (mediaType === "person") {
    // People tab without search: use popular people
    infiniteData = popularPeopleData;
    isLoading = isLoadingPopularPeople;
    isFetching = isFetchingPopularPeople;
    fetchNextPage = fetchNextPopularPeoplePage;
    hasNextPage = hasNextPopularPeoplePage;
    isFetchingNextPage = isFetchingNextPopularPeoplePage;
  } else {
    // Discover mode for movies/TV
    infiniteData = discoverData;
    isLoading = isDiscovering;
    isFetching = isDiscoverFetching;
    fetchNextPage = fetchNextDiscoverPage;
    hasNextPage = hasNextDiscoverPage;
    isFetchingNextPage = isFetchingNextDiscoverPage;
  }

  // Flatten all pages into a single array
  const allResults = infiniteData?.pages.flatMap((page) => page.results) ?? [];
  const totalResults = infiniteData?.pages[0]?.totalResults ?? 0;

  // Dedupe results by ID
  const uniqueResults = allResults.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  // Auto-fetch next page when load more trigger is visible
  useEffect(() => {
    if (isLoadMoreVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isLoadMoreVisible, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      year: null,
      genre: null,
      sortBy: "popularity.desc",
      minRating: 0,
    });
  };

  const hasActiveFilters =
    filters.year || filters.genre || filters.minRating > 0 || filters.sortBy !== "popularity.desc";

  return (
    <div className="min-h-screen pt-24 pb-12">
      <SEO
        title={debouncedSearch ? `Search results for "${debouncedSearch}"` : "Search"}
        description={
          debouncedSearch
            ? `Search results for "${debouncedSearch}" on MoviQ. Find movies, TV shows, and people.`
            : "Search for your favorite movies, TV shows, and people. Browse by genre, year, and rating."
        }
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {isSearchMode ? "Search Results" : "Discover"}
          </h1>

          {/* Search Input */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for movies, TV shows, people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-12 text-lg bg-secondary/50 border-border/50 focus:border-primary rounded-xl"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Search hint */}
            {searchTerm && searchTerm.length < 2 && (
              <p className="text-sm text-muted-foreground mt-2 ml-1">
                Type at least 2 characters to search
              </p>
            )}
          </div>

          {/* Media Type Tabs and Filters */}
          <div className="flex items-center gap-4 mt-6">
            {/* Media Type Selector - Mobile/Tablet (Dropdown) */}
            <div className="lg:hidden flex-1">
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full h-9 pl-4 pr-10 rounded-lg bg-secondary border border-border text-foreground text-sm font-medium cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_0.5rem_center] bg-no-repeat"
              >
                {MEDIA_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Type Tabs - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-1">
              {MEDIA_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setMediaType(type.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                      mediaType === type.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {/* Filter Toggle */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Genre Filter */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Genre
                    </label>
                    <select
                      value={filters.genre || ""}
                      onChange={(e) =>
                        handleFilterChange("genre", e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground cursor-pointer"
                    >
                      <option value="">All Genres</option>
                      {genres?.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Year
                    </label>
                    <select
                      value={filters.year || ""}
                      onChange={(e) =>
                        handleFilterChange("year", e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground cursor-pointer"
                    >
                      <option value="">All Years</option>
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Min Rating
                    </label>
                    <div className="flex gap-2">
                      {RATING_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange("minRating", option.value)}
                          className={cn(
                            "flex-1 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer",
                            filters.minRating === option.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Filter (only for discover mode) */}
                  {!isSearchMode && (
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground cursor-pointer"
                      >
                        {SORT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Info */}
        {uniqueResults.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {isSearchMode ? (
                <>
                  Found <span className="text-foreground font-medium">{totalResults.toLocaleString()}</span> results
                  for "<span className="text-foreground">{debouncedSearch}</span>"
                </>
              ) : (
                <>
                  Showing <span className="text-foreground font-medium">{uniqueResults.length}</span> of{" "}
                  <span className="text-foreground font-medium">{totalResults.toLocaleString()}</span> titles
                </>
              )}
            </p>
            {isFetching && !isLoading && !isFetchingNextPage && (
              <Badge variant="secondary" className="animate-pulse">
                Updating...
              </Badge>
            )}
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <ResultsSkeleton />
        ) : uniqueResults.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
            >
              {uniqueResults.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                >
                  {item.media_type === "person" || mediaType === "person" ? (
                    <PersonCard
                      id={item.id}
                      name={item.name}
                      image={item.profile_path}
                      knownForDepartment={item.known_for_department}
                      knownFor={item.known_for}
                      enableLayoutAnimation={index < 12}
                    />
                  ) : (
                    <MovieCard
                      id={item.id}
                      image={item.poster_path}
                      title={item.title || item.name}
                      type={item.media_type || (mediaType === "tv" ? "tv" : "movie")}
                      rating={item.vote_average}
                      year={(item.release_date || item.first_air_date)?.split("-")[0]}
                      enableLayoutAnimation={index < 12}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
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
              ) : (
                <p className="text-muted-foreground text-sm">
                  You've reached the end
                </p>
              )}
            </div>
          </>
        ) : (
          <EmptyState isSearchMode={isSearchMode} searchTerm={debouncedSearch} />
        )}
      </div>
    </div>
  );
};

// Skeleton loader
const ResultsSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
    {Array.from({ length: 18 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[2/3] rounded-xl" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// Empty state
interface EmptyStateProps {
  isSearchMode: boolean;
  searchTerm: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isSearchMode, searchTerm }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
      <Search className="w-10 h-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">
      {isSearchMode ? "No results found" : "Start exploring"}
    </h3>
    <p className="text-muted-foreground max-w-md">
      {isSearchMode
        ? `We couldn't find anything matching "${searchTerm}". Try different keywords or adjust your filters.`
        : "Search for your favorite movies and TV shows, or browse using the filters above."}
    </p>
  </motion.div>
);

export default SearchPage;
