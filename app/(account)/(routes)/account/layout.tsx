import { Sidebar } from "@/components/sidebar";
import { Suspense } from "react";
import Loading from "./loading";
import MobileSidebar from "@/components/mobile-sidebar";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative">
      <MobileSidebar />
      <div className="hidden h-full md:flex md:w-96 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
        <Sidebar />
      </div>
      <main className="md:pl-72">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
};

export default AccountLayout;
