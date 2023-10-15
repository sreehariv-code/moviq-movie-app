import React from "react";
import Carousel from "../Carousel/Carousel";
import { ContentContext } from "../../context/context";

const Popular = () => {
  const { popularData } = ContentContext();
  return (
    <div className="px-5 pt-16">
      <h1 className="text-[1.5rem] md:text-[2.5vw] pb-10 font-bold tracking-wider">
        Popular
      </h1>
      <Carousel data={popularData} />
    </div>
  );
};

export default Popular;
