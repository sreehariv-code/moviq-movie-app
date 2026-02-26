import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/Card/ReviewCard";
import type { Review } from "@/types/tmdb";

const INITIAL_COUNT = 3;

interface ReviewsSectionProps {
  reviews: Review[] | undefined;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews }) => {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const hasMore = reviews.length > INITIAL_COUNT;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" />
          Reviews
          <span className="text-base font-normal text-muted-foreground ml-1">
            ({reviews.length})
          </span>
        </h2>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {visible.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More / Show Less */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll
              ? `Show less`
              : `Load ${reviews.length - INITIAL_COUNT} more review${reviews.length - INITIAL_COUNT > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </motion.section>
  );
};

export default ReviewsSection;
