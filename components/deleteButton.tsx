"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteFileFromFirebase } from "@/actions/serverActions";
import { useRouter } from "next/navigation";

export const DeleteButton = ({ filePath }: { filePath: string }) => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        await deleteFileFromFirebase(filePath);
        router.refresh();
      }}
    >
      <Trash2 />
    </Button>
  );
};
