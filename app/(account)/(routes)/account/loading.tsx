import { PocketKnife } from "lucide-react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="animate-bounce">
      <PocketKnife size={"45px"} />
      Loading...
    </div>
  );
}
