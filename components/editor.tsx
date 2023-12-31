"use client";

import { useFileContext } from "@/app/context/FileContext";
import { useEffect, useRef } from "react";
import { colors, customIcons } from "../app/(editor)/editor/cusmtomizations";
import { getFile, getPSPDFKitLicenseKey } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { fillRectangleSVG } from "@/public/images/icons";

export function Editor() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { buffer, file } = useFileContext();

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit: any;

    (async function () {
      PSPDFKit = await import("pspdfkit");

      if (PSPDFKit) {
        PSPDFKit.unload(container);
      }

      await PSPDFKit.load({
        ...getPSPDFKitLicenseKey(),
        styleSheets: ["style.css"],
        theme: PSPDFKit.Theme.AUTO,
        enableHistory: true,
        enableClipboardActions: true,
        container,
        document: buffer || (await getFile()),
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
      }).then((instance: any) => {
        const items = instance.toolbarItems;
        const { downloadButton } = customIcons(instance, file, router);

        instance.setToolbarItems(
          items.splice(14, 0, {
            type: "responsive-group",
            title: "Tools",
            id: "annotate",
            mediaQueries: ["(max-width:1266px)"],
          }) &&
            items.splice(11, 0, {
              type: "custom",
              title: "Whiteout",
              onPress: () => {
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
              },
            }) &&
            items.splice(12, 0, {
              type: "content-editor",
              responsiveGroup: "annotate",
            }) &&
            items.splice(35, 0, {
              type: "undo",
            }) &&
            items.splice(36, 0, {
              type: "redo",
            }) &&
            items.splice(37, 0, downloadButton)
        );

        instance.setToolbarItems(
          items.filter((item: any) => {
            return (
              item.type !== "search" &&
              item.type !== "print" &&
              item.type !== "export-pdf" &&
              item.type !== "multi-annotations-selection"
            );
          })
        );
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [buffer]);

  return <div ref={containerRef} style={{ height: "100vh" }} />;
}
