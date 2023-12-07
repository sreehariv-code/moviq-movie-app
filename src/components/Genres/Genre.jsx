import { Link } from "react-router-dom";

const Genre = ({ name }) => {
  return (
    <Link className="bg-secondary hover:bg-slate-500 pl-2 py-1 rounded-lg">
      {name}
    </Link>
  );
};

export default Genre;
