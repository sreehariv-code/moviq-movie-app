import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar  z-50 flex justify-between top-0 px-5 min-h-[70px] bg-transparent">
      <div className="logo">Logo</div>
      <div className="search">Sea</div>
      <ul className="flex gap-5 navlinks">
        <Link to="/">Movie</Link>
        <Link to="/search">TV Shows</Link>
      </ul>
    </nav>
  );
};

export default Navbar;
