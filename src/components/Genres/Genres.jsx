import axios from "axios";
import { useEffect, useState } from "react";
import Genre from "./Genre";

const Genres = () => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setGenres(res.data.genres);
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="">
      <h1>Genres</h1>

      <div className="flex flex-col gap-2 px-2 overflow-y-auto">
        {genres.map((genre) => (
          <Genre key={genre.id} name={genre.name} />
        ))}
      </div>
    </div>
  );
};

export default Genres;
