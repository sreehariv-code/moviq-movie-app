import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import { FiSearch } from "react-icons/fi";
import styles from "./Home.module.css";

import { ContentContext } from "../../context/context";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("multi");
  const { searchData, handleSubmit } = ContentContext();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(searchTerm, mediaType);
  };

  return (
    <div className={styles.container}>
      <form action="" onSubmit={handleFormSubmit}>
        <div className="flex justify-between w-full h-full overflow-hidden rounded-full min-h-[50px] input-container relative">
          <select
            className="bg-slate-800 pl-5 px-1 md:px-5 md:text-[1em] min-w-[110px]"
            name="media-type"
            id="media"
            value={mediaType}
            onChange={(e) => {
              setMediaType(e.target.value);
            }}
          >
            <option value="multi">All</option>
            <option value="movie">Movie</option>
            <option value="tv">TV Shows</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-[100%] pl-5 min-h-full focus:border-none focus:outline-none"
          />
          <button
            className="p-1 min-w-[10%] aspect-square grid place-content-center bg-red-500 rounded-full absolute text-[20px] right-0 h-full"
            type="submit"
          >
            <FiSearch />
          </button>
        </div>
      </form>

      <div className={styles.searchSection}>
        {searchData.map((movie) => (
          <Card
            key={movie.id}
            id={movie.id}
            type={movie.media_type}
            image={movie.poster_path || movie.profile_path}
            title={movie.name || movie.title}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
