import React from "react";
import Navbar from "../Navbar/Navbar";
import PageTransition from "../PageTransition/PageTransition";

const NavbarLayout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <PageTransition />
      </main>
    </div>
  );
};

export default NavbarLayout;
