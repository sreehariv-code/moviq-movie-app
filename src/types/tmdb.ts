// ─── Shared ───────────────────────────────────────────────────────────────────

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviders {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

// ─── Movie ────────────────────────────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  homepage?: string;
  spoken_languages?: SpokenLanguage[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  media_type?: "movie";
}

// ─── TV Show ──────────────────────────────────────────────────────────────────

export interface Episode {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_number: number;
  still_path: string | null;
  air_date: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Creator {
  id: number;
  name: string;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  homepage?: string;
  type?: string;
  spoken_languages?: SpokenLanguage[];
  production_companies?: ProductionCompany[];
  origin_country?: string[];
  networks?: Network[];
  seasons?: Season[];
  created_by?: Creator[];
  last_episode_to_air?: Episode;
  media_type?: "tv";
}

// ─── Person ───────────────────────────────────────────────────────────────────

export interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for?: (Movie | TVShow)[];
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string | null;
  popularity?: number;
  media_type?: "person";
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface CombinedCredit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  character?: string;
  job?: string;
  department?: string;
  genre_ids?: number[];
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface MovieDetailsResponse {
  movieDetails: Movie;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface TVDetailsResponse {
  tvDetails: TVShow;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface PersonDetailsResponse {
  personDetails: Person;
  combinedCredits: {
    cast: CombinedCredit[];
    crew: CombinedCredit[];
  };
  externalIds: Record<string, string | null>;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export type SearchResult = (Movie | TVShow | Person) & {
  media_type: "movie" | "tv" | "person";
};

// ─── Watchlist ────────────────────────────────────────────────────────────────

export interface WatchlistItem {
  id: string | number;
  title: string;
  image: string | null;
  type: "movie" | "tv";
  rating: number;
  year: string;
  watched?: boolean;
  addedAt?: string;
}
