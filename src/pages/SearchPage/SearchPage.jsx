import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import { FiSearch } from "react-icons/fi";
import styles from "./Home.module.css";
import axios from "axios";

import { ContentContext } from "../../context/context";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("multi");
  const { handleSubmit } = ContentContext();
  const [searchData, setSearchData] = useState([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
      import.meta.env.VITE_API_KEY
    }`;
    try {
      const response = await axios.get(
        searchUrl + "&query=" + searchTerm + "&page=2"
      );
      setSearchData(response.data);
    } catch (error) {
      return error;
    }
  };

  console.log(searchData);

  return (
    <div className={styles.container}>
      <form action="" onSubmit={handleFormSubmit}>
        <div className="flex justify-between w-full h-full overflow-hidden rounded-full min-h-[50px] input-container relative">
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

      <div className={styles.searchSection}>{}</div>
    </div>
  );
};

export default SearchPage;
