"use client";

import { useFileContext } from "@/app/context/FileContext";
import { useEffect, useRef } from "react";
import {
  createRectangle,
  customIcons,
} from "../app/(editor)/editor/cusmtomizations";
import { getFile, getPSPDFKitLicenseKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
        console.log(items);
        instance.setToolbarItems(
          items.splice(11, 0, {
            type: "custom",
            title: "Whiteout",
            onPress: () => {
              createRectangle(PSPDFKit, instance);
            },
          }) &&
            items.splice(12, 0, {
              type: "redact-rectangle",
              id: "custom-dropdown",
              dropdownGroup: "my-group",
            }) &&
            items.splice(13, 0, {
              type: "form-creator",
              dropdownGroup: "my-group",
            }) &&
            items.splice(14, 0, {
              type: "content-editor",
              responsiveGroup: "annotate",
            }) &&
            items.splice(15, 0, {
              type: "responsive-group",
              title: "Tools",
              id: "annotate",
              mediaQueries: ["(max-width:1266px)"],
            }) &&
            items.splice(35, 0, {
              type: "undo",
            }) &&
            items.splice(36, 0, {
              type: "redo",
            }) &&
            items.splice(44, 0, downloadButton)
        );

        instance.setToolbarItems(
          items.filter((item: any) => {
            return (
              item.type !== "search" &&
              item.type !== "print" &&
              item.type !== "export-pdf" &&
              item.type !== "note" &&
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
