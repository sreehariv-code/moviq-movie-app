import Genres from "../Genres/Genres";

const Sidebar = () => {
  return (
    <div className="min-w-[15%] overflow-y-auto bottom-0 fixed top-0 z-[5] ">
      <h1>Title</h1>
      <Genres />
    </div>
  );
};

export default Sidebar;
