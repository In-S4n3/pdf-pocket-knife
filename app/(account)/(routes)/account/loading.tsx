import { PocketKnife } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="animate-bounce flex flex-1 items-center justify-center h-screen w-screen pl-72">
      <div>
        <PocketKnife size={"70px"} />
        <div>Loading...</div>
      </div>
    </div>
  );
}
