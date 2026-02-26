import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Movie,
  TVShow,
  SearchResult,
  CastMember,
  CrewMember,
  Genre,
  Video,
  Review,
  WatchProviders,
  MovieDetailsResponse,
  TVDetailsResponse,
  PersonDetailsResponse,
} from "@/types/tmdb";

interface PaginatedResult<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

// Fetch trending all (movies + TV shows combined)
export function useTrendingAll() {
  return useQuery<(Movie | TVShow)[]>({
    queryKey: ["trending", "all", "day"],
    queryFn: async () => {
      const { data } = await api.get<{ results: (Movie | TVShow)[] }>("/trending/all/day");
      // Filter to only include items with backdrop images
      return data.results.filter((item) => item.backdrop_path);
    },
  });
}

// Fetch trending movies
export function useTrendingMovies() {
  return useQuery<Movie[]>({
    queryKey: ["trending", "movie", "day"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Movie[] }>("/trending/movie/day");
      return data.results;
    },
  });
}

// Fetch trending TV shows
export function useTrendingTV() {
  return useQuery<TVShow[]>({
    queryKey: ["trending", "tv", "day"],
    queryFn: async () => {
      const { data } = await api.get<{ results: TVShow[] }>("/trending/tv/day");
      return data.results;
    },
  });
}

// Fetch popular movies
export function usePopularMovies() {
  return useQuery<Movie[]>({
    queryKey: ["movies", "popular"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Movie[] }>("/movie/popular");
      return data.results;
    },
  });
}

// Fetch movie details with credits
export function useMovieDetails(movieId: string | number | undefined) {
  return useQuery<MovieDetailsResponse>({
    queryKey: ["movie", movieId],
    queryFn: async () => {
      const [detailsRes, creditsRes] = await Promise.all([
        api.get<Movie>(`/movie/${movieId}`),
        api.get<{ cast: CastMember[]; crew: CrewMember[] }>(`/movie/${movieId}/credits`),
      ]);
      return {
        movieDetails: detailsRes.data,
        cast: creditsRes.data.cast,
        crew: creditsRes.data.crew,
      };
    },
    enabled: !!movieId,
  });
}

// Fetch TV show details with credits
export function useTVDetails(tvId: string | number | undefined) {
  return useQuery<TVDetailsResponse>({
    queryKey: ["tv", tvId],
    queryFn: async () => {
      const [detailsRes, creditsRes] = await Promise.all([
        api.get<TVShow>(`/tv/${tvId}`),
        api.get<{ cast: CastMember[]; crew: CrewMember[] }>(`/tv/${tvId}/credits`),
      ]);
      return {
        tvDetails: detailsRes.data,
        cast: creditsRes.data.cast,
        crew: creditsRes.data.crew,
      };
    },
    enabled: !!tvId,
  });
}

// Fetch TV show videos (for trailers)
export function useTVVideos(tvId: string | number | null | undefined) {
  return useQuery<Video | null>({
    queryKey: ["tv", tvId, "videos"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Video[] }>(`/tv/${tvId}/videos`);
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return trailer || data.results[0] || null;
    },
    enabled: !!tvId,
  });
}

// Search movies or TV shows (basic)
export function useSearch(searchTerm: string, mediaType = "movie") {
  return useQuery<(Movie | TVShow)[]>({
    queryKey: ["search", mediaType, searchTerm],
    queryFn: async () => {
      const { data } = await api.get<{ results: (Movie | TVShow)[] }>(`/search/${mediaType}`, {
        params: { query: searchTerm },
      });
      return data.results;
    },
    enabled: !!searchTerm && searchTerm.length > 0,
  });
}

interface AdvancedSearchOptions {
  mediaType?: string;
  page?: number;
  year?: number | null;
  genre?: number | null;
}

// Advanced search with pagination and filters
export function useAdvancedSearch(searchTerm: string, options: AdvancedSearchOptions = {}) {
  const { mediaType = "multi", page = 1, year, genre } = options;

  return useQuery<PaginatedResult<SearchResult>>({
    queryKey: ["search", mediaType, searchTerm, page, year, genre],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = { query: searchTerm, page };
      if (year) params.year = year;

      const { data } = await api.get<{ results: SearchResult[]; page: number; total_pages: number; total_results: number }>(`/search/${mediaType}`, { params });

      // For multi search, add media_type to each result if not present
      let results = data.results;
      if (mediaType === "multi") {
        results = results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
      }

      // Client-side genre filter if specified
      if (genre && genre > 0) {
        results = results.filter((item) =>
          (item as Movie | TVShow).genre_ids?.some((id) => id === genre)
        );
      }

      return {
        results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    placeholderData: (previousData) => previousData,
  });
}

interface DiscoverOptions {
  page?: number;
  genre?: number | null;
  year?: number | null;
  sortBy?: string;
  minRating?: number;
}

// Discover movies with filters (for browsing without search term)
export function useDiscoverMovies(options: DiscoverOptions = {}) {
  const { page = 1, genre, year, sortBy = "popularity.desc", minRating } = options;

  return useQuery<PaginatedResult<Movie>>({
    queryKey: ["discover", "movie", page, genre, year, sortBy, minRating],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {
        page,
        sort_by: sortBy,
        include_adult: false,
      };
      if (genre) params.with_genres = genre;
      if (year) params.primary_release_year = year;
      if (minRating) params["vote_average.gte"] = minRating;

      const { data } = await api.get<{ results: Movie[]; page: number; total_pages: number; total_results: number }>("/discover/movie", { params });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
  });
}

// Discover TV shows with filters
export function useDiscoverTV(options: DiscoverOptions = {}) {
  const { page = 1, genre, year, sortBy = "popularity.desc", minRating } = options;

  return useQuery<PaginatedResult<TVShow>>({
    queryKey: ["discover", "tv", page, genre, year, sortBy, minRating],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {
        page,
        sort_by: sortBy,
        include_adult: false,
      };
      if (genre) params.with_genres = genre;
      if (year) params.first_air_date_year = year;
      if (minRating) params["vote_average.gte"] = minRating;

      const { data } = await api.get<{ results: TVShow[]; page: number; total_pages: number; total_results: number }>("/discover/tv", { params });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
  });
}

// Fetch movie genres
export function useMovieGenres() {
  return useQuery<Genre[]>({
    queryKey: ["genres", "movie"],
    queryFn: async () => {
      const { data } = await api.get<{ genres: Genre[] }>("/genre/movie/list");
      return data.genres;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
}

// Fetch TV genres
export function useTVGenres() {
  return useQuery<Genre[]>({
    queryKey: ["genres", "tv"],
    queryFn: async () => {
      const { data } = await api.get<{ genres: Genre[] }>("/genre/tv/list");
      return data.genres;
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
}

// Fetch movie videos (for trailers)
export function useMovieVideos(movieId: string | number | null | undefined) {
  return useQuery<Video | null>({
    queryKey: ["movie", movieId, "videos"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Video[] }>(`/movie/${movieId}/videos`);
      // Filter for YouTube trailers
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return trailer || data.results[0] || null;
    },
    enabled: !!movieId,
  });
}

interface InfiniteSearchOptions {
  mediaType?: string;
  year?: number | null;
  genre?: number[] | null;
}

// Infinite search with pagination (for infinite scrolling)
export function useInfiniteSearch(searchTerm: string, options: InfiniteSearchOptions = {}) {
  const { mediaType = "multi", year, genre } = options;

  return useInfiniteQuery<PaginatedResult<SearchResult>>({
    queryKey: ["infinite-search", mediaType, searchTerm, year, genre],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string | number | boolean> = { query: searchTerm, page: pageParam as number };
      if (year) params.year = year;

      const { data } = await api.get<{ results: SearchResult[]; page: number; total_pages: number; total_results: number }>(`/search/${mediaType}`, { params });

      // For multi search, filter to movies, TV shows, and people
      let results = data.results;
      if (mediaType === "multi") {
        results = results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv" || item.media_type === "person"
        );
      }

      // Client-side genre filter if specified
      if (genre && genre.length > 0) {
        results = results.filter((item) =>
          (item as Movie | TVShow).genre_ids?.some((id) => genre.includes(id))
        );
      }

      return {
        results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!searchTerm && searchTerm.length >= 2,
  });
}

interface InfiniteDiscoverOptions {
  mediaType?: string;
  genre?: number | null;
  year?: number | null;
  sortBy?: string;
  minRating?: number;
}

// Infinite discover movies/TV (for infinite scrolling)
export function useInfiniteDiscover(options: InfiniteDiscoverOptions = {}) {
  const { mediaType = "movie", genre, year, sortBy = "popularity.desc", minRating } = options;

  return useInfiniteQuery<PaginatedResult<Movie | TVShow>>({
    queryKey: ["infinite-discover", mediaType, genre, year, sortBy, minRating],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string | number | boolean> = {
        page: pageParam as number,
        sort_by: sortBy,
        include_adult: false,
      };
      if (genre) params.with_genres = genre;

      // Use appropriate year parameter based on media type
      if (year) {
        if (mediaType === "tv") {
          params.first_air_date_year = year;
        } else {
          params.primary_release_year = year;
        }
      }
      if (minRating) params["vote_average.gte"] = minRating;

      const { data } = await api.get<{ results: (Movie | TVShow)[]; page: number; total_pages: number; total_results: number }>(`/discover/${mediaType}`, { params });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Infinite trending movies/TV (for infinite scrolling)
export function useInfiniteTrending(mediaType = "movie", timeWindow = "day") {
  return useInfiniteQuery<PaginatedResult<Movie | TVShow>>({
    queryKey: ["infinite-trending", mediaType, timeWindow],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ results: (Movie | TVShow)[]; page: number; total_pages: number; total_results: number }>(`/trending/${mediaType}/${timeWindow}`, {
        params: { page: pageParam },
      });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Infinite popular movies/TV (for infinite scrolling)
export function useInfinitePopular(mediaType = "movie") {
  return useInfiniteQuery<PaginatedResult<Movie | TVShow>>({
    queryKey: ["infinite-popular", mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ results: (Movie | TVShow)[]; page: number; total_pages: number; total_results: number }>(`/${mediaType}/popular`, {
        params: { page: pageParam },
      });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Infinite top rated movies/TV (for infinite scrolling)
export function useInfiniteTopRated(mediaType = "movie") {
  return useInfiniteQuery<PaginatedResult<Movie | TVShow>>({
    queryKey: ["infinite-top-rated", mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ results: (Movie | TVShow)[]; page: number; total_pages: number; total_results: number }>(`/${mediaType}/top_rated`, {
        params: { page: pageParam },
      });
      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

// Fetch person details with credits and social links
export function usePersonDetails(personId: string | number | undefined) {
  return useQuery<PersonDetailsResponse>({
    queryKey: ["person", personId],
    queryFn: async () => {
      const [detailsRes, creditsRes, externalIdsRes] = await Promise.all([
        api.get(`/person/${personId}`),
        api.get(`/person/${personId}/combined_credits`),
        api.get(`/person/${personId}/external_ids`),
      ]);

      return {
        personDetails: detailsRes.data,
        combinedCredits: creditsRes.data,
        externalIds: externalIdsRes.data,
      };
    },
    enabled: !!personId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Infinite search for people (for People tab)
export function useInfiniteSearchPeople(searchTerm: string) {
  return useInfiniteQuery<PaginatedResult<SearchResult>>({
    queryKey: ["infinite-search", "person", searchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ results: SearchResult[]; page: number; total_pages: number; total_results: number }>("/search/person", {
        params: { query: searchTerm, page: pageParam },
      });

      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    enabled: !!searchTerm && searchTerm.length >= 2,
  });
}

// Infinite popular people (for People tab without search)
export function useInfinitePopularPeople() {
  return useInfiniteQuery<PaginatedResult<SearchResult>>({
    queryKey: ["infinite-popular-people"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ results: SearchResult[]; page: number; total_pages: number; total_results: number }>("/person/popular", {
        params: { page: pageParam },
      });

      return {
        results: data.results,
        page: data.page,
        totalPages: data.total_pages,
        totalResults: data.total_results,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
}

interface ReleaseDate {
  certification: string;
  release_date: string;
}

interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

// Fetch movie certification
export function useMovieCertification(movieId: string | number | null | undefined) {
  return useQuery<string>({
    queryKey: ["movie", movieId, "release_dates"],
    queryFn: async () => {
      const { data } = await api.get<{ results: ReleaseDatesResult[] }>(`/movie/${movieId}/release_dates`);
      const usRelease = data.results.find((r) => r.iso_3166_1 === "US");
      // Find valid certification (not empty)
      if (usRelease) {
        const cert = usRelease.release_dates.find(d => d.certification)?.certification;
        if (cert) return cert;
      }
      return data.results[0]?.release_dates.find(d => d.certification)?.certification || "";
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

interface ContentRating {
  iso_3166_1: string;
  rating: string;
}

// Fetch TV certification
export function useTVCertification(tvId: string | number | null | undefined) {
  return useQuery<string>({
    queryKey: ["tv", tvId, "content_ratings"],
    queryFn: async () => {
      const { data } = await api.get<{ results: ContentRating[] }>(`/tv/${tvId}/content_ratings`);
      const usRating = data.results.find((r) => r.iso_3166_1 === "US");
      return usRating ? usRating.rating : data.results[0]?.rating || "";
    },
    enabled: !!tvId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Fetch movie watch providers
export function useMovieWatchProviders(movieId: string | number | undefined) {
  return useQuery<WatchProviders | null>({
    queryKey: ["movie", movieId, "watch_providers"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Record<string, WatchProviders> }>(`/movie/${movieId}/watch/providers`);
      // Prioritize US, then fallback to any available country
      return data.results.US || data.results[Object.keys(data.results)[0]] || null;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

// Fetch movie reviews
export function useMovieReviews(movieId: string | number | undefined) {
  return useQuery<Review[]>({
    queryKey: ["movie", movieId, "reviews"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Review[] }>(`/movie/${movieId}/reviews`);
      return data.results;
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch TV reviews
export function useTVReviews(tvId: string | number | undefined) {
  return useQuery<Review[]>({
    queryKey: ["tv", tvId, "reviews"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Review[] }>(`/tv/${tvId}/reviews`);
      return data.results;
    },
    enabled: !!tvId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch movie recommendations
export function useMovieRecommendations(movieId: string | number | undefined) {
  return useQuery<Movie[]>({
    queryKey: ["movie", movieId, "recommendations"],
    queryFn: async () => {
      const [recommendationsRes, similarRes] = await Promise.all([
        api.get<{ results: Movie[] }>(`/movie/${movieId}/recommendations`),
        api.get<{ results: Movie[] }>(`/movie/${movieId}/similar`),
      ]);
      // Prefer recommendations, fall back to similar, dedupe by id
      const combined = [
        ...recommendationsRes.data.results,
        ...similarRes.data.results,
      ];
      const seen = new Set<number>();
      return combined
        .filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return item.poster_path;
        })
        .slice(0, 20);
    },
    enabled: !!movieId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch TV recommendations
export function useTVRecommendations(tvId: string | number | undefined) {
  return useQuery<TVShow[]>({
    queryKey: ["tv", tvId, "recommendations"],
    queryFn: async () => {
      const [recommendationsRes, similarRes] = await Promise.all([
        api.get<{ results: TVShow[] }>(`/tv/${tvId}/recommendations`),
        api.get<{ results: TVShow[] }>(`/tv/${tvId}/similar`),
      ]);
      // Prefer recommendations, fall back to similar, dedupe by id
      const combined = [
        ...recommendationsRes.data.results,
        ...similarRes.data.results,
      ];
      const seen = new Set<number>();
      return combined
        .filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return item.poster_path;
        })
        .slice(0, 20);
    },
    enabled: !!tvId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Fetch TV watch providers
export function useTVWatchProviders(tvId: string | number | undefined) {
  return useQuery<WatchProviders | null>({
    queryKey: ["tv", tvId, "watch_providers"],
    queryFn: async () => {
      const { data } = await api.get<{ results: Record<string, WatchProviders> }>(`/tv/${tvId}/watch/providers`);
      // Prioritize US, then fallback to any available country
      return data.results.US || data.results[Object.keys(data.results)[0]] || null;
    },
    enabled: !!tvId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
