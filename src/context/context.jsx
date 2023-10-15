import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

export const DataContext = createContext();

const ContextProvider = ({ children }) => {
  const [trendingData, setTrendingData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const [movieData, setMovieData] = useState({});
  const [tvData, setTvData] = useState({});
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_API_KEY
    }`;
  const popularUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_API_KEY
    }`;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res1 = await axios.get(`${trendingUrl}&page=1`);
        setTrendingData(res1.data.results);
        const res2 = await axios.get(popularUrl);
        setPopularData(res2.data.results);
        setIsLoading(false);
      } catch (error) {
        console.log("Error Occured: ", error);
      }
    })();
  }, []);

  //Get Movie Data by id
  const getMovieData = async (movieId) => {
    try {
      const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_KEY
        }`;
      const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${import.meta.env.VITE_API_KEY
        }`;

      const [creditsResponse, detailsResponse] = await axios.all([
        axios.get(creditsUrl),
        axios.get(movieUrl),
      ]);

      const creditsData = creditsResponse.data;
      const detailsData = detailsResponse.data;

      const updatedMovieData = {
        movieDetails: detailsData,
        cast: creditsData.cast,
        crew: creditsData.crew,
      };
      setMovieData(updatedMovieData);
    } catch (error) {
      console.log(error);
    }
  };

  const getTVData = async (id) => {
    try {
      const tvUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${import.meta.env.VITE_API_KEY
        }`;
      const response = await axios.get(tvUrl);
      setTvData(response.data);
    } catch (error) {
      console.log("Didn't get movie data");
    }
  };

  //Search Movie (later to be changed)

  async function fetchData(searchTerm, mediaType) {
    const searchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${import.meta.env.VITE_API_KEY
      }`;
    try {
      const response = await axios.get(`${searchUrl}&query=${searchTerm}`);
      setSearchData(response.data.results);
    } catch (error) {
      console.log("Error Occured: ", error);
    }
  }

  async function handleSubmit(searchTerm, mediaType) {
    await fetchData(searchTerm, mediaType);
  }

  return (
    <DataContext.Provider
      value={{
        trendingData,
        popularData,
        getMovieData,
        getTVData,
        movieData,
        tvData,
        searchData,
        handleSubmit,
        isLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default ContextProvider;

export const ContentContext = () => {
  return useContext(DataContext);
};
