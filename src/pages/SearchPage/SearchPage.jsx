import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import { FiSearch } from "react-icons/fi";
import styles from "./Home.module.css";
import axios from "axios";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState({ pages: 1, data: [] });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${
      import.meta.env.VITE_API_KEY
    }`;
    try {
      const response = await axios.get(
        `${searchUrl}&query=${searchTerm}&page=${page}`
      );
      setSearchData({ pages: response.data.page, data: response.data.results });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form action="" onSubmit={handleFormSubmit}>
        <div className="max-w-[500px] flex gap-5">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-[100%] pl-5 min-h-full focus:border-none focus:outline-none rounded-md"
          />
          <button
            className={`${styles.searchBtn} btn bg-primary lg:hover:bg-white search-btn`}
            type="submit"
          >
            <FiSearch fontSize={20} className={styles.searchIcon} />
          </button>
        </div>
      </form>
      <div className="pt-5 mt-2 flex justify-between md:justify-start md:gap-[4rem] bg-background sticky top-[30px]">
        <button
          disabled={page > 1 ? false : true}
          onClick={() => setPage((prevState) => prevState - 1)}
          className="btn"
        >
          {" "}
          Previous{" "}
        </button>
        <span>{page}</span>
        <button
          className="btn"
          onClick={() => setPage((prevState) => prevState + 1)}
        >
          Next
        </button>
      </div>
      <div className={styles.searchSection}>
        {loading ? <p>Loading...</p> : null}
        {searchData.data.length > 0 &&
          searchData.data.map((data, index) => (
            <Card
              key={index}
              id={data.id}
              image={data.poster_path}
              title={data.title}
              type="movie"
            />
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
