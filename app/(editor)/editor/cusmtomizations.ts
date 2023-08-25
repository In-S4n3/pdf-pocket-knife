import { triggerDownload, uploadToFirebase } from "@/lib/utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const customIcons = (
  instance: any,
  file: any,
  router: AppRouterInstance
) => {
  return {
    downloadButton: {
      type: "custom",
      id: "download-pdf",
      title: "Download",
      onPress: () => {
        instance.exportPDF().then(async (buffer: Buffer) => {
          await triggerDownload(buffer);
          uploadToFirebase(buffer, file);
          setTimeout(() => {
            router.push("/account");
          }, 3000);
        });
      },
    },
  };
};
