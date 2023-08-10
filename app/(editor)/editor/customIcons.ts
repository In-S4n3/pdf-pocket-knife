import { triggerDownload } from "@/lib/utils";

export const customIcons = (instance: any) => {
  return {
    downloadButton: {
      type: "custom",
      id: "download-pdf",
      title: "Download",
      onPress: () => {
        instance.exportPDF().then(async (buffer: any) => {
          await triggerDownload(buffer);
        });
      },
    },
  };
};
