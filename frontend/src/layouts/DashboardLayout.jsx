import React, { useState } from "react";
import { Menu } from "lucide-react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-20 left-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-white dark:bg-gray-800 shadow-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-30">
          <Sidebar
            isOpen={true}
            onClose={() => {}}
            onCollapseChange={setSidebarCollapsed}
          />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <main
          className={`
            flex-1 flex flex-col min-h-screen
            transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}
            ml-0
          `}
        >
          {/* Content Container */}
          <div className="flex-1 overflow-auto">
            <div className="w-full px-4 py-4 sm:px-6 lg:px-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
