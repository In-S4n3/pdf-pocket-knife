"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteFileFromFirebase } from "@/actions/serverActions";

export const DeleteButton = ({ filePath }: { filePath: string }) => {
  return (
    <Button
      onClick={async () => {
        await deleteFileFromFirebase(filePath);
      }}
    >
      <Trash2 />
    </Button>
  );
};
