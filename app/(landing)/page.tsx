"use client";

import { Input } from "@/components/ui/input";
import { useFileContext } from "../context/FileContext";
import { useRouter } from "next/navigation";
import { storeBuffer } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { setBuffer } = useFileContext();

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const buffer: any = await file.arrayBuffer();
    setBuffer(buffer);
    await storeBuffer(buffer);
    router.push("/editor");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Input type="file" className="w-[50%]" onChange={(e) => handleFile(e)} />
    </main>
  );
}
