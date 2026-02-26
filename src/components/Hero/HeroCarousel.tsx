import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  useTrendingAll,
  useMovieVideos,
  useTVVideos,
  useMovieCertification,
  useTVCertification
} from "@/hooks/useMovies";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import TrailerModal from "@/components/TrailerModal/TrailerModal";
import OptimizedImage from "@/components/OptimizedImage/OptimizedImage";
import type { Movie, TVShow } from "@/types/tmdb";
import noMovieFound from "../../assets/nomoviefound.png";

type HeroItem = (Movie | TVShow) & { media_type: "movie" | "tv" };

const HeroCarousel = () => {
  const { data: trending, isLoading } = useTrendingAll();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Take top 5 trending items for the hero
  const heroItems = (trending?.slice(0, 5) || []) as HeroItem[];

  return (
    <div className="relative h-[70vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
      {/* Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroItems.map((item, index) => (
            <HeroSlide
              key={item.id}
              item={item}
              isActive={index === selectedIndex}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/50 hover:bg-primary hover:text-primary-foreground backdrop-blur-md transition-all hover:scale-110 cursor-pointer border border-white/10 hidden md:flex items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/50 hover:bg-primary hover:text-primary-foreground backdrop-blur-md transition-all hover:scale-110 cursor-pointer border border-white/10 hidden md:flex items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroItems.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
              index === selectedIndex
                ? "w-8 bg-primary shadow-lg shadow-primary/30"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent z-10" />
    </div>
  );
};

interface HeroSlideProps {
  item: HeroItem;
  isActive: boolean;
}

const HeroSlide: React.FC<HeroSlideProps & { index: number }> = ({ item, isActive, index }) => {
  const isMovie = item.media_type === "movie";
  const title = isMovie ? (item as Movie).title : (item as TVShow).name;
  const releaseYear = isMovie
    ? (item as Movie).release_date?.split("-")[0]
    : (item as TVShow).first_air_date?.split("-")[0];
  const detailPath = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <div className="relative flex-[0_0_100%] h-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={item.backdrop_path}
          alt={title || ""}
          type="backdrop"
          priority={index === 0}
          aspectRatio="16/9"
          sizes="100vw"
          className="object-center md:object-top"
          fallback={noMovieFound}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            {isActive && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-2xl"
              >
                {/* Media Type Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge variant="accent" className="mb-4">
                    {isMovie ? "Movie" : "TV Series"}
                  </Badge>
                </motion.div>

                {/* Title - Only H1 for the active slide for SEO optimization */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                >
                  {title}
                </motion.h1>

                {/* Meta Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 mb-4 text-sm text-muted-foreground"
                >
                  <span
                    className="flex items-center gap-1"
                    aria-label={`Rating: ${item.vote_average?.toFixed(1)} out of 10`}
                  >
                    <Star className="w-4 h-4 fill-rating text-rating" aria-hidden="true" />
                    <span className="text-foreground font-semibold">
                      {item.vote_average?.toFixed(1)}
                    </span>
                  </span>
                  {releaseYear && <span aria-label="Release year">{releaseYear}</span>}
                  <HeroRating item={item} />
                </motion.div>

                {/* Overview */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground text-base md:text-lg mb-8 line-clamp-3"
                >
                  {item.overview}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-4"
                >
                  <HeroTrailerSection item={item} title={title || ""} />
                  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto" asChild>
                    <Link to={detailPath}>
                      <Info className="w-5 h-5" />
                      More Info
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface HeroRatingProps {
  item: HeroItem;
}

const HeroRating: React.FC<HeroRatingProps> = ({ item }) => {
  const isMovie = item.media_type === "movie";
  const { data: movieCert } = useMovieCertification(isMovie ? item.id : null);
  const { data: tvCert } = useTVCertification(!isMovie ? item.id : null);

  const rating = isMovie ? movieCert : tvCert;

  if (!rating) return null;

  return (
    <Badge variant="outline" className="text-xs">
      {rating}
    </Badge>
  );
};

interface HeroTrailerSectionProps {
  item: HeroItem;
  title: string;
}

const HeroTrailerSection: React.FC<HeroTrailerSectionProps> = ({ item, title }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const isMovie = item.media_type === "movie";

  const movieVideos = useMovieVideos(isMovie ? item.id : null);
  const tvVideos = useTVVideos(!isMovie ? item.id : null);

  const trailer = isMovie ? movieVideos.data : tvVideos.data;

  return (
    <>
      <Button
        size="lg"
        className="gap-2 w-full sm:w-auto"
        onClick={() => setShowTrailer(true)}
        disabled={!trailer?.key}
      >
        <Play className="w-5 h-5 fill-current" />
        Play Trailer
      </Button>

      <TrailerModal
        isOpen={showTrailer}
        onClose={setShowTrailer}
        videoKey={trailer?.key}
        title={`${title} - Trailer`}
      />
    </>
  );
};

const HeroSkeleton = () => (
  <div className="relative h-[85vh] min-h-[600px] bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-16 w-full max-w-lg" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-36" />
        </div>
      </div>
    </div>
  </div>
);

export default HeroCarousel;
