import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background min-w-0">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <Header />
          <main className="p-4 sm:p-6 md:p-8 w-full max-w-7xl mx-auto min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
