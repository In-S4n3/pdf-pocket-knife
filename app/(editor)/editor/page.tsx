"use client";

import { useFileContext } from "@/app/context/FileContext";
import { useEffect, useRef } from "react";
import { colors, customIcons } from "./cusmtomizations";
import { getFile, getPSPDFKitLicenseKey } from "@/lib/utils";

export default function App() {
  const containerRef = useRef(null);
  const { buffer } = useFileContext();

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
        annotationToolbarColorPresets: function ({
          propertyName,
        }: {
          propertyName: string;
        }) {
          if (propertyName === "fill-color") {
            return {
              presets: colors(PSPDFKit),
            };
          }

          if (propertyName === "stroke-color") {
            return {
              presets: colors(PSPDFKit),
            };
          }
        },
      }).then((instance: any) => {
        const items = instance.toolbarItems;
        const { downloadButton } = customIcons(instance);

        console.log(items);

        instance.setToolbarItems(
          items.splice(11, 0, { type: "rectangle" }) &&
            items.splice(25, 1) &&
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
            if (window.innerWidth < 678) {
              return (
                item.type !== "search" &&
                item.type !== "print" &&
                item.type !== "export-pdf" &&
                item.type !== "multi-annotations-selection" &&
                item.type !== "pan" &&
                item.type !== "pager" &&
                !item.type.startsWith("sidebar")
              );
            } else {
              return (
                item.type !== "search" &&
                item.type !== "print" &&
                item.type !== "export-pdf" &&
                item.type !== "multi-annotations-selection"
              );
            }
          })
        );
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [buffer]);

  return <div ref={containerRef} style={{ height: "100vh" }} />;
}
