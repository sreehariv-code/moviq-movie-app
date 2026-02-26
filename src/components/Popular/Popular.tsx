import React from "react";
import { usePopularMovies, useTrendingTV } from "@/hooks/useMovies";
import ContentSection from "@/components/ContentSection/ContentSection";

const Popular = () => {
  const { data: popularMovies, isLoading: isLoadingMovies } = usePopularMovies();
  const { data: trendingTV, isLoading: isLoadingTV } = useTrendingTV();

  return (
    <>
      <ContentSection
        title="Popular Movies"
        data={popularMovies}
        isLoading={isLoadingMovies}
        type="movie"
        viewAllLink="/movies/popular"
      />
      <ContentSection
        title="Trending TV Shows"
        data={trendingTV}
        isLoading={isLoadingTV}
        type="tv"
        viewAllLink="/tv/trending"
      />
    </>
  );
};

export default Popular;
