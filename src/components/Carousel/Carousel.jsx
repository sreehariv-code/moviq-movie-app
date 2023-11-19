import React from "react";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import Card from "../Card/Card";

const Carousel = ({ data }) => {
  return (
    <div className="swiper-container min-h-[300px] flex ">
      <Swiper
        className="mySwiper min-h-[300px] mx-6"
        navigation={true}
        modules={[Navigation]}
        height={300}
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          250: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
      >
        {data.map((movie) => {
          return (
            <SwiperSlide key={movie.id}>
              <Card
                id={movie.id}
                image={movie.poster_path}
                title={movie.title}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Carousel;
