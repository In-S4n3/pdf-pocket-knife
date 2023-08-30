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
            router.refresh();
          }, 3000);
        });
      },
    },
  };
};

export const createRectangle = (PSPDFKit: any, instance:any) => {
  const annotation = new PSPDFKit.Annotations.RectangleAnnotation(
    {
      pageIndex: instance.viewState.currentPageIndex,
      boundingBox: new PSPDFKit.Geometry.Rect({
        left: 200,
        top: 100,
        width: 250,
        height: 500,
      }),
      fillColor: new PSPDFKit.Color({ r: 255, g: 255, b: 255 }),
      strokeColor: new PSPDFKit.Color({ r: 255, g: 255, b: 255 }),
    }
  );
  instance.create(annotation);
}