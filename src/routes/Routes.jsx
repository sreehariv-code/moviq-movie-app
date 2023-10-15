import React from "react";
import { Route, Routes } from "react-router-dom";
import SearchPage from "../pages/SearchPage/SearchPage";
import HomePage from "../pages/HomePage/HomePage";
import SinglePage from "../pages/SingleMoviePage/SinglePage";
import Navbar from "../components/Navbar/Navbar";
import NavbarLayout from "../components/Layouts/NavbarLayout";
import TVSinglePage from "../pages/SingleMoviePage/TVSinglePage";

const RouteLayout = () => {
  return (
    <>
      <Routes>
        <Route element={<NavbarLayout />}>
          <Route element={<HomePage />} path="/" />
          <Route element={<SinglePage />} path="movie/:id" />
          <Route element={<TVSinglePage />} path="tv/:id" />
        </Route>
        <Route element={<SearchPage />} path="search" />
      </Routes>
    </>
  );
};

export default RouteLayout;
