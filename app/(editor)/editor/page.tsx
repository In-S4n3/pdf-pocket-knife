"use client";

import { useFileContext } from "@/app/context/FileContext";
import { useEffect, useRef } from "react";
import { customIcons } from "./customIcons";
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
        container,
        document: buffer || (await getFile()),
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
      }).then((instance: any) => {
        const items = instance.toolbarItems;
        const { downloadButton } = customIcons(instance);

        instance.setToolbarItems(
          items.splice(11, 1, {
            type: "content-editor",
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
          items.filter(
            (item: any) =>
              item.type !== "search" &&
              item.type !== "print" &&
              item.type !== "export-pdf" &&
              item.type !== "multi-annotations-selection"
          )
        );
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [buffer]);

  return <div ref={containerRef} style={{ height: "100vh" }} />;
}
