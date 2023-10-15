import React from "react";
import { BarsSpinner } from "react-spinners-kit";

const Loader = () => {
  return (
    <div className="grid place-items-center min-h-screen">
      <BarsSpinner size={60} color="#dcd9f7" />
    </div>
  );
};

export default Loader;
