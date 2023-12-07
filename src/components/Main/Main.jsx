import Header from "../Header/Header";
import Popular from "../Popular/Popular";
import Trending from "../Trending/Trending";

const Main = () => {
  return (
    <div className="w-[100%] pl-[15%]">
      <Header />
      <Trending />
      <Popular />
    </div>
  );
};

export default Main;
