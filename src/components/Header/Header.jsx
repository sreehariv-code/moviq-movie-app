import { Link } from "react-router-dom";
import bgVideo from "../../assets/bg-header.webm";
const Header = () => {
  return (
    <header className="relative min-h-[400px] md:min-h-[80vh] overflow-hidden isolate flex flex-col justify-center scroll-p-[70px]">
      <div className="z-10 flex flex-col min-h-[200px] py-10 text-center text-section">
        <p className=" text-[90px] font-semibold  md:text-[12vw] group-hover/discover-button:text-primary">
          MovieQ
        </p>
        <Link
          to="/search"
          className="self-center bg-primary border-none rounded-full outline-none cursor-pointer w-28 md:w-[12vw]  group/discover-button btn hover:bg-white hover:text-primary"
        >
          <span className="group-hover/discover-button:text-primary">
            Discover
          </span>
        </Link>
      </div>
      <video
        className="absolute inset-0 object-cover w-full h-full -z-10"
        src={bgVideo}
        autoPlay
        muted
        loop
      />
    </header>
  );
};

export default Header;
