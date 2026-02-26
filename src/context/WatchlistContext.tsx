import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { WatchlistItem } from "@/types/tmdb";

interface WatchlistInput {
  id: string | number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  image?: string | null;
  type?: "movie" | "tv";
  media_type?: "movie" | "tv";
  vote_average?: number;
  rating?: number;
  year?: string | number | null;
  release_date?: string;
  first_air_date?: string;
}

interface WatchlistContextValue {
  watchlist: WatchlistItem[];
  watchlistCount: number;
  addToWatchlist: (item: WatchlistInput) => void;
  removeFromWatchlist: (id: string | number, type: "movie" | "tv") => void;
  toggleWatchlist: (item: WatchlistInput) => void;
  isInWatchlist: (id: string | number, type: "movie" | "tv") => boolean;
  toggleWatched: (id: string | number, type: "movie" | "tv") => void;
  getFilteredWatchlist: (filter?: string) => WatchlistItem[];
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextValue>({} as WatchlistContextValue);

export const useWatchlist = (): WatchlistContextValue => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within WatchlistProvider");
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("moviq-watchlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as WatchlistItem[];
        setWatchlist(parsed);
      } catch (error) {
        console.error("Failed to parse watchlist from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("moviq-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add item to watchlist
  const addToWatchlist = (item: WatchlistInput) => {
    const newItem: WatchlistItem = {
      id: item.id,
      title: item.title || item.name || "",
      image: item.poster_path || item.image || null,
      type: item.type || item.media_type || "movie",
      rating: item.vote_average || item.rating || 0,
      year: item.year?.toString() || item.release_date || item.first_air_date || "",
      addedAt: new Date().toISOString(),
      watched: false,
    };

    setWatchlist((prev) => {
      // Prevent duplicates
      if (prev.some((i) => i.id === newItem.id && i.type === newItem.type)) {
        return prev;
      }
      return [newItem, ...prev];
    });
  };

  // Remove item from watchlist
  const removeFromWatchlist = (id: string | number, type: "movie" | "tv") => {
    setWatchlist((prev) =>
      prev.filter((item) => !(item.id === id && item.type === type))
    );
  };

  // Toggle item in watchlist (add if not present, remove if present)
  const toggleWatchlist = (item: WatchlistInput) => {
    const exists = isInWatchlist(item.id, (item.type || item.media_type || "movie") as "movie" | "tv");
    if (exists) {
      removeFromWatchlist(item.id, (item.type || item.media_type || "movie") as "movie" | "tv");
    } else {
      addToWatchlist(item);
    }
  };

  // Check if item is in watchlist
  const isInWatchlist = (id: string | number, type: "movie" | "tv"): boolean => {
    return watchlist.some((item) => item.id === id && item.type === type);
  };

  // Mark item as watched/unwatched
  const toggleWatched = (id: string | number, type: "movie" | "tv") => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.id === id && item.type === type
          ? { ...item, watched: !item.watched }
          : item
      )
    );
  };

  // Get filtered watchlist
  const getFilteredWatchlist = (filter = "all"): WatchlistItem[] => {
    if (filter === "watched") {
      return watchlist.filter((item) => item.watched);
    }
    if (filter === "unwatched") {
      return watchlist.filter((item) => !item.watched);
    }
    return watchlist;
  };

  // Clear all watchlist
  const clearWatchlist = () => {
    setWatchlist([]);
  };

  const value: WatchlistContextValue = {
    watchlist,
    watchlistCount: watchlist.length,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    toggleWatched,
    getFilteredWatchlist,
    clearWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
