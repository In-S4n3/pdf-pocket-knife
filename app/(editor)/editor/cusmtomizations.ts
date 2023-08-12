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

export const colors = (PSPDFKit: any) => {
  return [
    {
      color: new PSPDFKit.Color({ r: 255, g: 255, b: 255 }),
      localization: {
        id: "custom_white",
        defaultMessage: "custom_white",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 255, g: 0, b: 0 }),
      localization: {
        id: "custom_red",
        defaultMessage: "custom_red",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 0, g: 255, b: 0 }),
      localization: {
        id: "custom_green",
        defaultMessage: "custom_green",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 255, g: 255, b: 0 }),
      localization: {
        id: "custom_yellow",
        defaultMessage: "custom_yellow",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 0, g: 0, b: 0 }),
      localization: {
        id: "custom_black",
        defaultMessage: "custom_black",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 128, g: 128, b: 128 }),
      localization: {
        id: "custom_grey",
        defaultMessage: "custom_grey",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 0, g: 0, b: 255 }),
      localization: {
        id: "custom_blue",
        defaultMessage: "custom_blue",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 128, g: 0, b: 128 }),
      localization: {
        id: "custom_purple",
        defaultMessage: "custom_purple",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 0, g: 128, b: 0 }),
      localization: {
        id: "custom_purple",
        defaultMessage: "custom_purple",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 255, g: 165, b: 0 }),
      localization: {
        id: "custom_orange",
        defaultMessage: "custom_orange",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 165, g: 42, b: 42 }),
      localization: {
        id: "custom_brown",
        defaultMessage: "custom_brown",
      },
    },
    {
      color: new PSPDFKit.Color({ r: 255, g: 192, b: 203 }),
      localization: {
        id: "custom_pink",
        defaultMessage: "custom_pink",
      },
    },
  ];
};
