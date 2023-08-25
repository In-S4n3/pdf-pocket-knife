import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";

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
        <body className={montserrat.className}>
          <ClerkProvider>{children}</ClerkProvider>
        </body>
      </html>
    </>
  );
}
