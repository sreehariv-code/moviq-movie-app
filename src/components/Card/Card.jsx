import React from "react";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";
import imageNotFound from "../../assets/clapperborad.jpg";

const Card = ({ id, image, title, type }) => {
  let imgUrl;
  if (image !== undefined) {
    imgUrl = `https://image.tmdb.org/t/p/original/${image}`;
  } else {
    imgUrl = imageNotFound;
  }
  return (
    <Link
      to={`/${type || "movie"}/${id}`}
      className="min-h-[300px] max-w-max w-[160px] md:w-[260px]"
    >
      <div className={styles.container}>
        <div className={styles.movieImg}>
          <img
            src={imgUrl}
            alt=""
            className="transition-transform md:hover:scale-105"
          />
        </div>
      </div>
      <h1>{title}</h1>
    </Link>
  );
};

export default Card;
