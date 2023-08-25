"use client";
import { useRouter } from "next/navigation";
import { storeFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useDocumentStore } from "@/store/documentStore";

export const UploadButton = () => {
  const refButton = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const setFile = useDocumentStore((state) => state.setFile);
  const setBuffer = useDocumentStore((state) => state.setBuffer);

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    setFile(file);
    const buffer: any = await file.arrayBuffer();
    setBuffer(buffer);
    await storeFile(buffer);

    router.push("/editor");
  };
  return (
    <div>
      <Button
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm md:text-lg border-2 border-cyan-950 hover:animate-pulse hover:text-xl"
        size={"lg"}
        onClick={() => {
          refButton.current?.click();
        }}
      >
        Upload your PDF
      </Button>
      <input
        type="file"
        className="w-auto hidden"
        onChange={(e) => handleFile(e)}
        accept="application/pdf"
        ref={refButton}
      />
    </div>
  );
};
