"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteFileFromFirebase } from "@/actions/serverActions";
import { useRouter } from "next/navigation";

export const DeleteButton = ({ filePath }: { filePath: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await deleteFileFromFirebase(filePath);
        router.refresh();
      }}
      className="hover:bg-red-500"
    >
      <span className={isLoading ? "animate-spin " : ""}>
        <Trash2 />
      </span>
    </Button>
  );
};
