import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./singlepage.css";

import { ContentContext } from "../../context/context";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import star from "../../assets/rating-star.png";
import CastCard from "../../components/Card/CastCard";
import notimagefound from "../../assets/nomoviefound.png";

const SinglePage = () => {
  const { getMovieData, movieData } = ContentContext();

  const imgUrl = "https://image.tmdb.org/t/p/original/";

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMovieData(id);
  }, []);

  const { movieDetails, cast, crew } = movieData;

  if (!movieDetails) {
    return null;
  }
  return (
    <div className="min-h-screen pb-[100px]">
      <div className="backdrop-header flex min-h-[200px] md:min-h-[400px] w-full bg-red-500 relative isolate aspect-[3.5/1] ">
        {movieDetails.backdrop_path && (
          <img
            className="absolute object-cover w-full h-full -z-10"
            src={imgUrl + movieDetails.backdrop_path}
          />
        )}
      </div>

      <div className="movie-content sm:pl-10 flex flex-col items-center sm:items-start md:min-h-[60vh] sm:flex-row relative">
        <div className="poster-img flex max-w-[180px] sm:max-w-[300px] overflow-hidden relative rounded-[11px] mt-[-10%] ml-4 isolate">
          <img
            className="z-1"
            src={
              movieDetails.poster_path
                ? imgUrl + movieDetails.poster_path
                : notimagefound
            }
            alt="poster Image"
          />
          <div className="rating-stars z-10 absolute bottom-0 right-0 rounded-tl-[0.5rem]  bg-gradient-to-tr from-background to-transparent p-1">
            <p className="flex items-center justify-center font-semibold tracking-widest rating">
              <img src={star} alt="" width={40} height={40} />
              <span className="">
                {movieDetails.vote_average &&
                  movieDetails.vote_average.toFixed(1)}
              </span>
              <span>/10</span>
            </p>
          </div>
        </div>
        <div className="content px-3 md:px-0 md:ml-5 md:max-w-[80%] ">
          <div className="flex justify-center content-head md:justify-start ">
            <h1 className="text-[1.2rem] mt-5 sm:text-[2rem] text-center md:text-justify font-bold">
              {movieDetails.title}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-4 mt-4 genre md:justify-start ">
            {movieDetails.genres &&
              movieDetails.genres.map((genre) => {
                return (
                  <span
                    key={genre.id}
                    className=" outline outline-2 outline-[text] px-4 py-[2px] rounded-[20px] cursor-pointer"
                  >
                    {genre.name}
                  </span>
                );
              })}
          </div>
          <div className="mt-6 lang">
            <p className="flex flex-wrap gap-3">
              <span>Languages: </span>
              {movieDetails.spoken_languages &&
                movieDetails.spoken_languages.map((lang, index) => {
                  return (
                    <span
                      className=" outline outline-2 outline-[text] px-4 py-[2px] rounded-[20px] cursor-pointer"
                      key={index}
                    >
                      {lang.english_name}
                    </span>
                  );
                })}
            </p>
          </div>
          <div className="mt-8 overview-section">
            <h2 className="text-[30px] font-semibold">Overview</h2>
            <p className="text-justify sm:text-left w-full md:w-[90%] lg:w-[70%] mt-5 tracking-widest leading-7">
              {movieDetails.overview}
            </p>
          </div>
        </div>
      </div>
      <div className="pt-5 mt-2 cast-carousel ">
        <h1 className="text-[2em] font-semibold mb-7">Casts</h1>
        {cast.length === 0 ? (
          <p>No Information found</p>
        ) : (
          <div className="flex swiper-container ">
            <Swiper
              className="mySwiper min-h-[300px] px-14"
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
              {cast.map((member, index) => {
                return (
                  <SwiperSlide key={member.id}>
                    <CastCard
                      name={member.name}
                      image={member.profile_path}
                      character={member.character}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>

      <div className="pt-5 mt-2 crew-carousel ">
        <h1 className="text-[2em] font-semibold mb-7">Crew</h1>
        {crew.length === 0 ? (
          <p>No information found</p>
        ) : (
          <div className="flex swiper-container ">
            <Swiper
              className="mySwiper min-h-[300px] px-14"
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
              {crew.map((member, index) => {
                return (
                  <SwiperSlide key={index}>
                    <CastCard
                      name={member.name}
                      image={member.profile_path}
                      character={member.department}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePage;
