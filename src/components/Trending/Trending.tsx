import React from "react";
import { useTrendingMovies } from "@/hooks/useMovies";
import ContentSection from "@/components/ContentSection/ContentSection";

const Trending = () => {
  const { data: trendingMovies, isLoading } = useTrendingMovies();

  return (
    <ContentSection
      title="Trending Movies"
      data={trendingMovies}
      isLoading={isLoading}
      type="movie"
      viewAllLink="/movies/trending"
    />
  );
};

export default Trending;
