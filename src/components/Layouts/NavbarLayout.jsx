import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

const NavbarLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default NavbarLayout;
