import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Sidebar />
    <main className="pt-[72px] md:pt-20 lg:pl-[103px] lg:pt-0">
      <div className="mx-auto w-full max-w-[730px] px-6 py-8 sm:px-12 sm:py-14 lg:px-6 lg:py-20">
        {children}
      </div>
    </main>
  </div>
);

export default AppLayout;
