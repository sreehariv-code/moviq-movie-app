import React from "react";
import { motion } from "framer-motion";
import { Filter, Star, Calendar, ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Genre } from "@/types/tmdb";

// Generate year options (current year back to 1900)
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

// Rating options
const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "9", label: "9+ Exceptional" },
  { value: "8", label: "8+ Great" },
  { value: "7", label: "7+ Good" },
  { value: "6", label: "6+ Above Average" },
  { value: "5", label: "5+ Average" },
];

interface SortOption {
  value: string;
  label: string;
}

interface Filters {
  genre: string;
  year: string;
  sortBy: string;
  minRating: string;
}

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  genres: Genre[];
  sortOptions: SortOption[];
  isTV: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  genres,
  sortOptions,
  isTV,
}) => {
  const hasActiveFilters =
    filters.genre ||
    filters.year ||
    filters.minRating ||
    filters.sortBy !== "popularity.desc";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="w-5 h-5 text-primary" />
          Filters
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Sort By */}
      <FilterSection icon={ArrowUpDown} title="Sort By">
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Genres */}
      <FilterSection icon={Filter} title="Genres">
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
          <GenrePill
            active={!filters.genre}
            onClick={() => onFilterChange("genre", "")}
          >
            All
          </GenrePill>
          {genres.map((genre) => (
            <GenrePill
              key={genre.id}
              active={filters.genre === genre.id.toString()}
              onClick={() => onFilterChange("genre", genre.id.toString())}
            >
              {genre.name}
            </GenrePill>
          ))}
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection icon={Calendar} title={isTV ? "First Air Year" : "Release Year"}>
        <select
          value={filters.year}
          onChange={(e) => onFilterChange("year", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary focus:outline-none transition-colors cursor-pointer"
        >
          <option value="">Any Year</option>
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </FilterSection>

      {/* Minimum Rating */}
      <FilterSection icon={Star} title="Minimum Rating">
        <div className="space-y-2">
          {RATING_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all",
                filters.minRating === option.value
                  ? "bg-primary/20 border border-primary/50"
                  : "hover:bg-secondary/50"
              )}
            >
              <input
                type="radio"
                name="minRating"
                value={option.value}
                checked={filters.minRating === option.value}
                onChange={(e) => onFilterChange("minRating", e.target.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center",
                  filters.minRating === option.value
                    ? "border-primary"
                    : "border-muted-foreground"
                )}
              >
                {filters.minRating === option.value && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-sm">{option.label}</span>
              {option.value && (
                <div className="flex items-center gap-0.5 ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < Math.ceil(parseInt(option.value) / 2)
                          ? "fill-rating text-rating"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
              )}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

// Filter Section Component
interface FilterSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-xl p-4"
  >
    <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
      <Icon className="w-4 h-4" />
      {title}
    </div>
    {children}
  </motion.div>
);

// Genre Pill Component
interface GenrePillProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const GenrePill: React.FC<GenrePillProps> = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
      active
        ? "bg-primary text-primary-foreground"
        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
    )}
  >
    {children}
  </button>
);

export default FilterSidebar;
