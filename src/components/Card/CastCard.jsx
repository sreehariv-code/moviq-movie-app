import React from "react";
import notFoundImage from "../../assets/avatar.jpg";

const CastCard = ({ name, character, image }) => {
  let imgUrl;
  if (image !== null) {
    imgUrl = `https://image.tmdb.org/t/p/original/${image}`;
  } else {
    imgUrl = notFoundImage;
  }

  return (
    <div className="cast-card-container">
      <div className="img-container flex relative items-center justify-center  overflow-hidden min-w-[100px] rounded-[5px] aspect-[2/3]">
        <img
          className="w-full h-full object-cover md:hover:scale-105 transition-transform"
          src={imgUrl}
          alt="profile-image"
        />
      </div>
      <div className="about-content text-center">
        <h1 className="text-[1.25rem] font-semibold">
          {name ? name : "Unknown"}
        </h1>
        <p>
          as <span className="italic">{character ? character : "Unknown"}</span>
        </p>
      </div>
    </div>
  );
};

export default CastCard;
