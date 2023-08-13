import { useRouter } from "next/navigation";
import { storeFile } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useFileContext } from "@/app/context/FileContext";

const UploadButton = () => {
  const refButton = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const { setBuffer, setFile } = useFileContext();

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
    </div>
  );
};

export default UploadButton;
