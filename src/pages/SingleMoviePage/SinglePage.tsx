import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Star,
  Clock,
  Calendar,
  Globe,
  ArrowLeft,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useMovieDetails, useMovieVideos, useMovieWatchProviders, useMovieRecommendations, useMovieReviews } from "@/hooks/useMovies";
import { getImageUrl, getBackdropUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/context/WatchlistContext";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CastCard from "@/components/Card/CastCard";
import MovieCard from "@/components/Card/MovieCard";
import ReviewsSection from "@/components/ContentSection/ReviewsSection";
import TrailerModal, { TrailerButton } from "@/components/TrailerModal/TrailerModal";
import SEO from "@/components/SEO/SEO";
import WatchProviders from "@/components/WatchProviders/WatchProviders";
import notimagefound from "../../assets/nomoviefound.png";

const SinglePage = () => {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);

  const { data, isLoading, error } = useMovieDetails(id);
  const { data: trailer } = useMovieVideos(id);
  const { data: watchProviders } = useMovieWatchProviders(id);
  const { data: recommendations } = useMovieRecommendations(id);
  const { data: reviews } = useMovieReviews(id);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  if (isLoading) return (
    <>
      <SEO />
      <DetailsSkeleton />
    </>
  );
  if (error) return <ErrorState />;
  if (!data?.movieDetails) return null;

  const { movieDetails, cast, crew } = data;
  const director = crew?.find((c) => c.job === "Director");
  const writers = crew?.filter((c) => c.department === "Writing").slice(0, 3);

  const displayTitle = movieDetails.original_title || movieDetails.title;
  const hasAltTitle =
    movieDetails.original_title &&
    movieDetails.original_title !== movieDetails.title;

  const inWatchlist = isInWatchlist(id, "movie");

  const handleWatchlistClick = () => {
    toggleWatchlist({
      id,
      title: movieDetails.title,
      image: movieDetails.poster_path,
      type: "movie",
      rating: movieDetails.vote_average,
      year: movieDetails.release_date?.split("-")[0],
    });
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={displayTitle}
        description={
          movieDetails.overview ||
          `Watch ${displayTitle} (${movieDetails.release_date?.split("-")[0]}). Explore cast, crew, ratings, and more on MoviQ.`
        }
        image={movieDetails.poster_path ? getImageUrl(movieDetails.poster_path, "w500") : undefined}
        type="video.movie"
      />
      {/* Backdrop Section */}
      <div className="relative h-[70vh] min-h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          {movieDetails.backdrop_path ? (
            <img
              src={getBackdropUrl(movieDetails.backdrop_path)}
              alt={movieDetails.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-24 left-4 md:left-8 z-10">
          <Link to="/">
            <Button variant="glass" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              {/* Poster with shared layout animation */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block flex-shrink-0"
              >
                <div className="w-64 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                  <motion.img
                    layoutId={`poster-movie-${id}`}
                    src={
                      movieDetails.poster_path
                        ? getImageUrl(movieDetails.poster_path, "w500")
                        : notimagefound
                    }
                    alt={movieDetails.title}
                    className="w-full"
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              </motion.div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1"
              >
                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  {displayTitle}
                  {movieDetails.release_date && (
                    <span className="text-muted-foreground font-normal ml-3">
                      ({movieDetails.release_date.split("-")[0]})
                    </span>
                  )}
                </h1>
                {hasAltTitle && (
                  <p className="text-base text-muted-foreground mb-3 italic">
                    {movieDetails.title}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 bg-rating/10 px-3 py-1.5 rounded-full border border-rating/20">
                    <Star className="w-4 h-4 fill-rating text-rating" />
                    <span className="font-semibold text-rating">
                      {movieDetails.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">/ 10</span>
                  </div>

                  {/* Runtime */}
                  {movieDetails.runtime > 0 && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatRuntime(movieDetails.runtime)}</span>
                    </div>
                  )}

                  {/* Release Date */}
                  {movieDetails.release_date && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(movieDetails.release_date).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {movieDetails.genres?.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Tagline */}
                {movieDetails.tagline && (
                  <p className="text-lg italic text-muted-foreground mb-4">
                    "{movieDetails.tagline}"
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  <TrailerButton
                    onClick={() => setShowTrailer(true)}
                    disabled={!trailer?.key}
                    className="w-full sm:w-auto"
                  />
                  <Button
                    size="lg"
                    onClick={handleWatchlistClick}
                    variant={inWatchlist ? "default" : "outline"}
                    className={cn(
                      "gap-2 cursor-pointer w-full sm:w-auto",
                      inWatchlist && "bg-rose-500 hover:bg-rose-600 border-rose-500"
                    )}
                  >
                    <Heart
                      className={cn(
                        "w-4 h-4 transition-all",
                        inWatchlist && "fill-white"
                      )}
                    />
                    {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  {movieDetails.homepage && (
                    <a
                      href={movieDetails.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button size="lg" variant="outline" className="gap-2 w-full">
                        <ExternalLink className="w-4 h-4" />
                        Official Site
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {movieDetails.overview || "No overview available."}
              </p>
            </motion.section>

            {/* Reviews */}
            <ReviewsSection reviews={reviews} />

            {/* Cast */}
            {cast && cast.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
                <div className="relative">
                  <Carousel opts={{ align: "start", dragFree: true }}>
                    <CarouselContent className="-ml-4" viewportClassName="px-4 -mx-4 py-4 -my-4">
                      {cast.slice(0, 15).map((member) => (
                        <CarouselItem
                          key={member.id}
                          className="pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                        >
                          <CastCard
                            id={member.id}
                            name={member.name}
                            image={member.profile_path}
                            character={member.character}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </motion.section>
            )}
            {/* Recommendations */}
            {recommendations && recommendations.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                <Carousel opts={{ align: "start", dragFree: true }}>
                  <CarouselContent className="-ml-4" viewportClassName="px-4 -mx-4 py-4 -my-4">
                    {recommendations.map((movie) => (
                      <CarouselItem
                        key={movie.id}
                        className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                      >
                        <MovieCard
                          id={movie.id}
                          image={movie.poster_path}
                          title={movie.title}
                          type="movie"
                          rating={movie.vote_average}
                          year={movie.release_date?.split("-")[0]}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Movie Info Card */}
            <div className="glass rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-lg">Movie Info</h3>

              {director && (
                <InfoItem label="Director" value={director.name} />
              )}

              {writers && writers.length > 0 && (
                <InfoItem
                  label="Writers"
                  value={writers.map((w) => w.name).join(", ")}
                />
              )}

              {movieDetails.status && (
                <InfoItem label="Status" value={movieDetails.status} />
              )}

              {movieDetails.budget > 0 && (
                <InfoItem
                  label="Budget"
                  value={formatCurrency(movieDetails.budget)}
                />
              )}

              {movieDetails.revenue > 0 && (
                <InfoItem
                  label="Revenue"
                  value={formatCurrency(movieDetails.revenue)}
                />
              )}

              {movieDetails.spoken_languages?.length > 0 && (
                <InfoItem
                  label="Languages"
                  value={movieDetails.spoken_languages
                    .map((l) => l.english_name)
                    .join(", ")}
                />
              )}

              {movieDetails.production_countries?.length > 0 && (
                <InfoItem
                  label="Country"
                  value={movieDetails.production_countries
                    .map((c) => c.name)
                    .join(", ")}
                />
              )}
            </div>

            {/* Where to Watch */}
            <WatchProviders providers={watchProviders} link={watchProviders?.link} />

            {/* Production Companies */}
            {movieDetails.production_companies?.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Production</h3>
                <div className="space-y-3">
                  {movieDetails.production_companies.slice(0, 4).map((company) => (
                    <div key={company.id} className="flex items-center gap-3">
                      {company.logo_path ? (
                        <img
                          src={getImageUrl(company.logo_path, "w92")}
                          alt={company.name}
                          className="h-6 w-auto object-contain bg-white rounded px-2 py-1"
                        />
                      ) : (
                        <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                          <Globe className="w-3 h-3 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={setShowTrailer}
        videoKey={trailer?.key}
        title={`${movieDetails.title} - Trailer`}
      />
    </div>
  );
};

// Helper Components
interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div>
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="font-medium">{value}</dd>
  </div>
);

// Helper Functions
const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Loading Skeleton
const DetailsSkeleton = () => (
  <div className="min-h-screen">
    <div className="relative h-[70vh] min-h-[500px] bg-muted">
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-7xl mx-auto flex gap-8 items-end">
          <Skeleton className="hidden md:block w-64 h-96 rounded-xl" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-8 py-12">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-24 w-full" />
    </div>
  </div>
);

// Error State
const ErrorState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">
        We couldn't load the movie details.
      </p>
      <Link to="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  </div>
);

export default SinglePage;
