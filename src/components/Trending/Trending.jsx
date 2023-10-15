import React, { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import axios from "axios";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ContentContext } from "../../context/context";
import Carousel from "../Carousel/Carousel";

const Trending = () => {
  const { trendingData } = ContentContext();

  return (
    <div className="px-5 pt-16">
      <h1 className="text-[1.5rem] md:text-[2.5vw] pb-10 font-bold tracking-wider">
        Trending
      </h1>
      <Carousel data={trendingData} />
    </div>
  );
};

export default Trending;
