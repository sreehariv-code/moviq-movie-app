import React from "react";
import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="grid place-items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default Loader;
