import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ContentContext } from "../../context/context";
import star from "../../assets/rating-star.png";
import notimagefound from "../../assets/nomoviefound.png";

const TVSinglePage = () => {
  const { id } = useParams();

  const { getTVData, tvData } = ContentContext();
  useEffect(() => {
    getTVData(id);
  }, []);
  const imgUrl = "https://image.tmdb.org/t/p/original/";

  if (!tvData) {
    return null;
  }

  return (
    <div className="min-h-screen pb-[100px]">
      <div className="backdrop-header flex min-h-[200px] md:min-h-[400px] w-full bg-red-500 relative isolate aspect-[3.5/1] ">
        {tvData.backdrop_path && (
          <img
            className="absolute object-cover w-full h-full -z-10"
            src={imgUrl + tvData.backdrop_path}
          />
        )}
      </div>

      <div className="movie-content sm:pl-10 flex flex-col items-center sm:items-start md:min-h-[60vh] sm:flex-row relative">
        <div className="poster-img flex max-w-[180px] sm:max-w-[300px] overflow-hidden relative rounded-[11px] mt-[-10%] ml-4 isolate">
          <img
            className="z-1"
            src={
              tvData.poster_path ? imgUrl + tvData.poster_path : notimagefound
            }
            alt="poster Image"
          />
          <div className="rating-stars z-10 absolute bottom-0 right-0 rounded-tl-[0.5rem]  bg-gradient-to-tr from-background to-transparent p-1">
            <p className="flex items-center justify-center font-semibold tracking-widest rating">
              <img src={star} alt="" width={40} height={40} />
              <span className="">
                {tvData.vote_average && tvData.vote_average.toFixed(1)}
              </span>
              <span>/10</span>
            </p>
          </div>
        </div>
        <div className="content px-3 md:px-0 md:ml-5 md:max-w-[80%] ">
          <div className="flex justify-center content-head md:justify-start ">
            <h1 className="text-[1.2rem] mt-5 sm:text-[2rem] text-center md:text-justify font-bold">
              {tvData.title}
            </h1>
          </div>

          <div className="flex flex-wrap justify-center gap-3 p-4 mt-4 genre md:justify-start ">
            {tvData.genres &&
              tvData.genres.map((genre) => {
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
              {tvData.spoken_languages &&
                tvData.spoken_languages.map((lang, index) => {
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
              {tvData.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVSinglePage;
