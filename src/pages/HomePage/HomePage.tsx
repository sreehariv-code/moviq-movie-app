import React from "react";
import HeroCarousel from "../../components/Hero/HeroCarousel";
import Trending from "../../components/Trending/Trending";
import Popular from "../../components/Popular/Popular";
import SEO from "@/components/SEO/SEO";

const HomePage = () => {
  return (
    <div className="pb-11">
      <SEO
        title="Home"
        description="Discover trending movies and TV shows. Explore popular content, browse by genre, and find your next favorite watch on MoviQ."
      />
      <HeroCarousel />
      <Trending />
      <Popular />
    </div>
  );
};

export default HomePage;
