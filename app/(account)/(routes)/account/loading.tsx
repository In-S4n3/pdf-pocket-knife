import { PocketKnife } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-full flex justify-center items-center animate-bounce">
      <PocketKnife size={"50px"} />
      Loading...
    </div>
  );
}
