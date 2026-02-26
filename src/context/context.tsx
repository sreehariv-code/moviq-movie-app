import axios from "axios";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ContentContextValue {
  trendingData: unknown[];
  popularData: unknown[];
  getMovieData: (movieId: string | number) => Promise<void>;
  getTVData: (id: string | number) => Promise<void>;
  movieData: Record<string, unknown>;
  tvData: Record<string, unknown>;
  searchData: unknown[];
  handleSubmit: (searchTerm: string, mediaType: string) => Promise<void>;
  isLoading: boolean;
}

export const DataContext = createContext<ContentContextValue | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [trendingData, setTrendingData] = useState<unknown[]>([]);
  const [popularData, setPopularData] = useState<unknown[]>([]);
  const [movieData, setMovieData] = useState<Record<string, unknown>>({});
  const [tvData, setTvData] = useState<Record<string, unknown>>({});
  const [searchData, setSearchData] = useState<unknown[]>([]);
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
  const getMovieData = async (movieId: string | number) => {
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

  const getTVData = async (id: string | number) => {
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

  async function fetchData(searchTerm: string, mediaType: string) {
    const searchUrl = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${import.meta.env.VITE_API_KEY
      }`;
    try {
      const response = await axios.get(`${searchUrl}&query=${searchTerm}`);
      setSearchData(response.data.results);
    } catch (error) {
      console.log("Error Occured: ", error);
    }
  }

  async function handleSubmit(searchTerm: string, mediaType: string) {
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

export const ContentContext = (): ContentContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("ContentContext must be used within ContextProvider");
  }
  return context;
};
