import { PocketKnife } from "lucide-react";
import React from "react";

export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-3">
      <div className="animate-spin">
        <PocketKnife size={"70px"} />
      </div>
      <div className="text-lg">Loading...</div>
    </div>
  );
};
