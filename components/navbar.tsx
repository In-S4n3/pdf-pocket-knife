"use client";
import Link from "next/link";
import { ModeToggle } from "./modeToogle";
import { Button } from "./ui/button";
import { PocketKnife, Settings } from "lucide-react";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const Navbar = () => {
  return (
    <div className="flex w-full justify-between py-5 px-10">
      <div
        className={cn(
          "flex space-x-4 items-center text-2xl font-bold",
          montserrat.className
        )}
      >
        <PocketKnife size={"44px"} />
        <p>
          <span className="hidden text-sm md:block">Wellcome to PDF </span>
          <span className="gradient-text hidden md:block">Pocket-Knife</span>
        </p>
      </div>
      <div className="flex space-x-5">
        <Link href={"account"}>
          <Button className="flex space-x-2">
            <Settings />
            <p className="hidden md:block">Account</p>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
