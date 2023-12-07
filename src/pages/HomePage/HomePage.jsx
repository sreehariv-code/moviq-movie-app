import React from "react";
import "./Home.css";

import Main from "../../components/Main/Main";
import Sidebar from "../../components/Sidebar/Sidebar";

const HomePage = () => {
  return (
    <div className="pb-11 flex">
      <Sidebar />
      <Main />
    </div>
  );
};

export default HomePage;
