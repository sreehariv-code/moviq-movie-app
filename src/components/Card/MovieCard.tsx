import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Play, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/OptimizedImage/OptimizedImage";
import { useWatchlist } from "@/context/WatchlistContext";
import imageNotFound from "../../assets/clapperborad.jpg";

interface MovieCardProps {
  id: string | number;
  image: string | null | undefined;
  title: string;
  type?: "movie" | "tv";
  rating?: number;
  year?: string | number | null;
  enableLayoutAnimation?: boolean;
  layoutPrefix?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  image,
  title,
  type = "movie",
  rating,
  year,
  enableLayoutAnimation = false,
  layoutPrefix = "",
}) => {
  const layoutId = enableLayoutAnimation ? `${layoutPrefix}poster-${type}-${id}` : undefined;
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(id, type);

  const handleWatchlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ id, title, image, type, rating, year });
  };

  return (
    <Link to={`/${type}/${id}`} className="block group">
      <motion.div
        className="relative overflow-hidden rounded-xl"
        whileHover={{ scale: 1.05, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card Container */}
        <div className="relative overflow-hidden rounded-xl">
          {/* Optimized Image with lazy loading and blur placeholder */}
          <motion.div layoutId={layoutId} className="transition-transform duration-500 group-hover:scale-110">
            <OptimizedImage
              src={image}
              alt={title}
              fallback={imageNotFound}
              aspectRatio="2/3"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className=""
            />
          </motion.div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button on Hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
            initial={{ scale: 0.5 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 rounded-full bg-primary/90 text-white shadow-lg shadow-primary/50">
              <Play className="w-8 h-8 fill-current" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Rating Badge */}
          {Number(rating) > 0 && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-md border border-white/10 text-xs font-semibold shadow-lg"
              aria-label={`Rating: ${Number(rating).toFixed(1)} out of 10`}
            >
              <Star className="w-3 h-3 fill-rating text-rating" aria-hidden="true" />
              <span>{Number(rating).toFixed(1)}</span>
            </div>
          )}

          {/* Watchlist Button */}
          <motion.button
            onClick={handleWatchlistClick}
            className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-md border border-white/10 hover:bg-rose-500/20 hover:border-rose-500 transition-all shadow-lg z-10 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all",
                inWatchlist
                  ? "fill-rose-500 text-rose-500"
                  : "text-foreground/70 hover:text-rose-500"
              )}
              aria-hidden="true"
            />
          </motion.button>
        </div>

        {/* Glow Effect */}
        <div className="absolute -inset-px rounded-xl bg-linear-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
      </motion.div>

      {/* Title Below Card */}
      <div className="mt-3 px-1">
        <h3 className="font-medium text-sm text-foreground/90 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        {Number(year) > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5" aria-label="Release year">{year}</p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
