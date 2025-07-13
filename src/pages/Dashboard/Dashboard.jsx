import React, { useState } from "react";
import { Outlet } from "react-router";
import AdminSideNav from "../../components/AdminSideNav/AdminSideNav";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <section>
      <div className="flex min-h-screen">
        {/* Toggle Button for Mobile */}
        <button
          className="md:hidden p-2 m-2 border rounded text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 z-40 fixed top-2 left-2"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Sidebar (Desktop) */}
        <div className="md:w-40 lg:w-64 sticky top-0 h-screen bg-gray-100 dark:bg-gray-900 hidden md:block">
          <AdminSideNav />
        </div>

        {/* Sidebar (Mobile) */}
        <div
          className={`w-64 h-screen fixed top-0 left-0 bg-gray-100 dark:bg-gray-900 z-30 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSideNav />
        </div>

        {/* Backdrop for mobile */}
        {mobileSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setMobileSidebarOpen(false)} />}

        <div className="flex-1 overflow-x-auto p-4 pt-20">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
