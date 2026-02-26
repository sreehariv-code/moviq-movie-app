import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarLayout from "../components/Layouts/NavbarLayout";
import Loader from "../components/Loader/Loader";

// Lazy load page components for code splitting
const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const SearchPage = lazy(() => import("../pages/SearchPage/SearchPage"));
const SinglePage = lazy(() => import("../pages/SingleMoviePage/SinglePage"));
const TVSinglePage = lazy(() => import("../pages/SingleMoviePage/TVSinglePage"));
const PersonPage = lazy(() => import("../pages/PersonPage/PersonPage"));
const ExplorePage = lazy(() => import("../pages/ExplorePage/ExplorePage"));
const WatchlistPage = lazy(() => import("../pages/WatchlistPage/WatchlistPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage/NotFoundPage"));

const RouteLayout = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route element={<HomePage />} path="/" />
          <Route element={<SinglePage />} path="movie/:id" />
          <Route element={<TVSinglePage />} path="tv/:id" />
          <Route element={<PersonPage />} path="person/:id" />
          <Route element={<SearchPage />} path="search" />
          <Route element={<WatchlistPage />} path="watchlist" />
          <Route element={<ExplorePage />} path="movies" />
          <Route element={<ExplorePage />} path="movies/popular" />
          <Route element={<ExplorePage />} path="movies/trending" />
          <Route element={<ExplorePage />} path="movies/top-rated" />
          <Route element={<ExplorePage />} path="tv" />
          <Route element={<ExplorePage />} path="tv/popular" />
          <Route element={<ExplorePage />} path="tv/trending" />
          <Route element={<ExplorePage />} path="tv/top-rated" />

          {/* 404 Catch-all Route - Must be last */}
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouteLayout;
