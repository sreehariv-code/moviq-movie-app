import React, { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import { FiSearch } from "react-icons/fi";
import styles from "./Home.module.css";
import axios from "axios";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState({
    pages: 1,
    data: [],
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Perform the search after a delay (e.g., 300ms) to debounce the input
    setLoading(true);
  };

  useEffect(() => {
    // Check if searchTerm is not empty before making the API call
    if (searchTerm !== "") {
      const debounceTimeout = setTimeout(() => {
        const fetchData = async () => {
          const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_KEY
            }`;

          try {
            const response = await axios.get(
              `${searchUrl}&query=${searchTerm}&page=${page}`
            );
            setSearchData({
              ...searchData,
              pages: response.data.page,
              data: response.data.results,
              totalPages: response.data.total_pages,
            });
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      }, 700); // Adjust the delay as needed (e.g., 300ms)

      // Cleanup the timeout on each input change
      return () => clearTimeout(debounceTimeout);
    } else {
      setSearchData({
        pages: 1,
        data: [],
        totalPages: 0
      })
    }
  }, [searchTerm, page]); // Trigger the effect on changes to searchTerm and page

  return (
    <div className={styles.container}>
      <form action="" onSubmit={handleFormSubmit}>
        <div className="w-full flex gap-5 min-h-[50px]">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-full md:min-w-[55%] lg:min-w-[40%] pl-5 min-h-full focus:border-none focus:outline-none rounded-md"
          />
        </div>
      </form>
      <div className="pt-5 mt-2 flex justify-between md:justify-start md:gap-[4rem] bg-background  w-full z-10">
        <button
          disabled={page > 1 ? false : true}
          onClick={() => setPage((prevState) => prevState - 1)}
          className="btn"
        >
          Previous
        </button>
        <span className="btn">
          {page} of {searchData.totalPages}
        </span>
        <button
          disabled={page === searchData.totalPages ? true : false}
          className="btn"
          onClick={() => setPage((prevState) => prevState + 1)}
        >
          Next
        </button>
      </div>
      <div className="grid-wrapper pb-10">
        <div className={[styles.searchSection]}>
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
    </div>
  );
};

export default SearchPage;
