import { PocketKnife } from "lucide-react";
import React from "react";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin">
        <PocketKnife size={"70px"} />
      </div>
      <div>Loading...</div>
    </div>
  );
};
