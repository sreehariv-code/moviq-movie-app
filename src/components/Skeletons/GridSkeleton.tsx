import React from "react";
import { MovieCardSkeleton } from "./CardSkeleton";

// Grid skeleton for movie/TV lists
export const GridSkeleton = ({ count = 20, columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" }) => {
  return (
    <div className={`grid ${columns} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default GridSkeleton;
