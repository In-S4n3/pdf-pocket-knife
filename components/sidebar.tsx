import { UserButton } from "@clerk/nextjs";
import { PocketKnifeIcon } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4 flex items-center">
            <PocketKnifeIcon />
          </div>
          <h1 className={"text-xl font-bold gradient-text flex items-center"}>
            PDF Pocket Knife
          </h1>
        </Link>
        <div className="flex pl-20">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
