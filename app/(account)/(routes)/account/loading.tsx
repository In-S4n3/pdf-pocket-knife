import { PocketKnife } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="pl-96 animate-bounce flex items-center justify-center h-screen w-screen">
      <div className="text-center">
        <PocketKnife size={"45px"} />
        <div>Loading...</div>
      </div>
    </div>
  );
}
