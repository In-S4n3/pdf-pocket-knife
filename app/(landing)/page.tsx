"use client";

import { useFileContext } from "../context/FileContext";
import { useRouter } from "next/navigation";
import { storeFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Home() {
  const refButton = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setBuffer } = useFileContext();

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const buffer: any = await file.arrayBuffer();
    setBuffer(buffer);
    await storeFile(buffer);
    router.push("/editor");
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Button
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm md:text-lg"
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
    </main>
  );
}
