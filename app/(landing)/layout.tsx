"use client";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isMounted === false) return;

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <Navbar />
      {children}
    </main>
  );
}
