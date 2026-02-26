import React, { useRef, useMemo, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import MovieCard from "@/components/Card/MovieCard";
import type { CombinedCredit } from "@/types/tmdb";

interface FilmographyCredit extends CombinedCredit {
  creditType?: "cast" | "crew";
  role?: string;
}

interface VirtualFilmographyGridProps {
  credits: FilmographyCredit[];
}

/**
 * VirtualFilmographyGrid Component
 *
 * Efficiently renders large lists of filmography credits using virtual scrolling.
 * Only renders items that are visible in the viewport for optimal performance.
 */
const VirtualFilmographyGrid: React.FC<VirtualFilmographyGridProps> = ({ credits }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Responsive column count based on Tailwind breakpoints
  const getColumnCount = (): number => {
    if (typeof window === "undefined") return 5;
    const width = window.innerWidth;
    if (width < 640) return 2; // sm
    if (width < 768) return 3; // md
    if (width < 1024) return 4; // lg
    return 5; // xl
  };

  const [columnCount, setColumnCount] = useState(getColumnCount);

  // Update column count on window resize
  useEffect(() => {
    const handleResize = () => setColumnCount(getColumnCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate rows from credits array
  const rows = useMemo(() => {
    const result: FilmographyCredit[][] = [];
    for (let i = 0; i < credits.length; i += columnCount) {
      result.push(credits.slice(i, i + columnCount));
    }
    return result;
  }, [credits, columnCount]);

  // Virtual row renderer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380, // MovieCard (~300px) + role text (~30px) + margins (~50px)
    overscan: 2, // Number of items to render outside of viewport
  });

  const virtualItems = rowVirtualizer.getVirtualItems();


  return (
    <div
      ref={parentRef}
      className="h-[1200px] overflow-y-auto overflow-x-hidden rounded-lg border border-border/50"
    >
      {/* Virtual list container */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Virtual rows */}
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Grid row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {row.map((credit: FilmographyCredit) => (
                  <div key={`${credit.id}-${credit.media_type}-${credit.role}`}>
                    <MovieCard
                      id={credit.id}
                      image={credit.poster_path}
                      title={credit.title || credit.name || ""}
                      type={credit.media_type}
                      rating={credit.vote_average}
                      year={
                        credit.release_date
                          ? new Date(credit.release_date).getFullYear()
                          : credit.first_air_date
                            ? new Date(credit.first_air_date).getFullYear()
                            : null
                      }
                    />
                    {/* Role/Character display */}
                    <p className="mt-3 text-xs text-muted-foreground text-center line-clamp-2">
                      {credit.creditType === "cast" ? (
                        <span>as {credit.role || "Unknown"}</span>
                      ) : (
                        <span>{credit.role || "Crew"}</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {credits.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No credits found.
        </div>
      )}
    </div>
  );
};

export default VirtualFilmographyGrid;
