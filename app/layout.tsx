import { ThemeProvider } from "@/app/context/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FileContextProvider } from "./context/FileContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF SaaS",
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
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ClerkProvider>
              <FileContextProvider>{children}</FileContextProvider>
            </ClerkProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
