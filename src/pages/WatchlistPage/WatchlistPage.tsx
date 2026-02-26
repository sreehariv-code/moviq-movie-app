import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check, Trash2, ListChecks } from "lucide-react";
import { useWatchlist } from "@/context/WatchlistContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MovieCard from "@/components/Card/MovieCard";
import SEO from "@/components/SEO/SEO";
import type { WatchlistItem } from "@/types/tmdb";

const FILTER_TABS = [
  { id: "all", label: "All", icon: Heart },
  { id: "unwatched", label: "Unwatched", icon: ListChecks },
  { id: "watched", label: "Watched", icon: Check },
];

const WatchlistPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { watchlist, watchlistCount, getFilteredWatchlist, toggleWatched, clearWatchlist } = useWatchlist();

  const filteredItems = getFilteredWatchlist(activeFilter);

  const handleMarkAsWatched = (e: React.MouseEvent<HTMLButtonElement>, id: string | number, type: "movie" | "tv") => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatched(id, type);
  };

  const handleClearWatchlist = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      clearWatchlist();
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <SEO
        title="My Watchlist"
        description="Your personal collection of movies and TV shows to watch. Keep track of what you want to watch and what you've already seen."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Heart className="w-8 h-8 text-primary fill-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">My Watchlist</h1>
                <p className="text-muted-foreground mt-1">
                  {watchlistCount} {watchlistCount === 1 ? "item" : "items"} saved
                </p>
              </div>
            </div>

            {watchlistCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearWatchlist}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          {watchlistCount > 0 && (
            <div className="flex gap-2">
              {FILTER_TABS.map((tab) => {
                const Icon = tab.icon;
                const count = getFilteredWatchlist(tab.id).length;

                return (
                  <Button
                    key={tab.id}
                    variant={activeFilter === tab.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(tab.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <Badge variant={activeFilter === tab.id ? "secondary" : "outline"} className="ml-1">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Content */}
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {filteredItems.map((item: WatchlistItem, index: number) => (
              <motion.div
                key={`${item.id}-${item.type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
                className="relative"
              >
                {/* MovieCard */}
                <MovieCard
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  type={item.type}
                  rating={item.rating}
                  year={item.year}
                />

                {/* Mark as Watched Button */}
                <button
                  onClick={(e) => handleMarkAsWatched(e, item.id, item.type)}
                  className={`absolute bottom-16 right-2 p-2 rounded-full backdrop-blur-md border transition-all shadow-lg z-10 ${
                    item.watched
                      ? "bg-green-500/90 border-green-400 hover:bg-green-600"
                      : "bg-background/80 border-white/10 hover:bg-green-500/80"
                  }`}
                  title={item.watched ? "Mark as Unwatched" : "Mark as Watched"}
                >
                  {item.watched ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Check className="w-4 h-4 text-foreground/70" />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState filter={activeFilter} totalCount={watchlistCount} />
        )}
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  filter: string;
  totalCount: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter, totalCount: _totalCount }) => {
  const messages: Record<string, { title: string; description: string }> = {
    all: {
      title: "Your watchlist is empty",
      description: "Start adding movies and TV shows you want to watch by clicking the heart icon on any title.",
    },
    watched: {
      title: "No watched items yet",
      description: "Mark items as watched to see them here.",
    },
    unwatched: {
      title: "All caught up!",
      description: "You've marked everything as watched. Great job!",
    },
  };

  const message = messages[filter] || messages["all"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
        <Heart className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{message.title}</h3>
      <p className="text-muted-foreground max-w-md">{message.description}</p>
    </motion.div>
  );
};

export default WatchlistPage;
