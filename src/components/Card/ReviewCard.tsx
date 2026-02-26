import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/tmdb";

const PREVIEW_LENGTH = 300;

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [expanded, setExpanded] = useState(false);

  const { author, author_details, content, created_at, url } = review;
  const rating = author_details?.rating;
  const avatarPath = author_details?.avatar_path;
  const isLong = content.length > PREVIEW_LENGTH;

  // TMDB avatars sometimes have a leading slash with a gravatar URL
  const avatarUrl = avatarPath
    ? avatarPath.startsWith("/https")
      ? avatarPath.slice(1)
      : `https://image.tmdb.org/t/p/w92${avatarPath}`
    : null;

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = author
    ? author.slice(0, 2).toUpperCase()
    : "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="w-10 h-10 rounded-full object-cover bg-muted flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const sibling = target.nextSibling as HTMLElement | null;
                if (sibling) sibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary",
              avatarUrl && "hidden"
            )}
          >
            {initials}
          </div>

          {/* Author & Date */}
          <div>
            <p className="font-semibold text-sm leading-tight">{author}</p>
            <p className="text-xs text-muted-foreground">{formattedDate}</p>
          </div>
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1.5 bg-rating/10 px-3 py-1.5 rounded-full border border-rating/20 flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-rating text-rating" />
            <span className="text-sm font-semibold text-rating">{rating}</span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="text-muted-foreground text-sm leading-relaxed">
        <AnimatePresence initial={false}>
          <motion.p
            key={expanded ? "full" : "preview"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {expanded || !isLong
              ? content
              : `${content.slice(0, PREVIEW_LENGTH).trim()}…`}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        {isLong ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Read full review
              </>
            )}
          </button>
        ) : (
          <span />
        )}

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View on TMDB
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
