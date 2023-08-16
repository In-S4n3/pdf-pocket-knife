import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";

import { FileContextProvider } from "./context/FileContext";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF Pocket Knife",
  description: "Edit and download any PDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${montserrat.className} bg-slate-300`}>
          <ClerkProvider>
            <FileContextProvider>{children}</FileContextProvider>
          </ClerkProvider>
        </body>
      </html>
    </>
  );
}
